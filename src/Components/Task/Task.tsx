import React, { FC, Dispatch, SetStateAction, useState, useEffect, ReactElement } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { EditTask } from '@components/EditTask/EditTask';

import { deletePartnerArticle, updatePartnerArticle } from '../../api';
import { SnackbarMessage } from '../../types';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { TTask } from '../../reducer';

interface Props {
  task: TTask;
  setSnackbarMessage: Dispatch<SetStateAction<readonly SnackbarMessage[]>>;
  edit?: (id: string, value: Partial<Omit<TTask, 'id' | 'created'>>) => void;
  remove?: (id: string) => void;
  cancelClick?: () => void;
  toggleViewMode?: (id?: string) => void;
  editMode: boolean;
  setEditedTask: Dispatch<SetStateAction<string>>;
}

export const Task: FC<Props> = ({ task, setSnackbarMessage, edit, remove, cancelClick, editMode, setEditedTask }) => {
  const [checked, setChecked] = useState<boolean>(false);

  // Change mode
  const changeMode = () => {
    console.log(editMode, task.id);
    setEditedTask(task.id);
    cancelClick && cancelClick();
  };

  const [myTimeout, setMyTimeout] = useState<NodeJS.Timeout>();

  const unhideTask = () => {
    edit && edit(task.id, { isRemoved: false });
    updatePartnerArticle(task.id, { isRemoved: false });
    setSnackbarMessage((prev) => [
      ...prev,
      { status: 'success', message: 'Задача восстановлена', key: new Date().getTime() },
    ]);
  };

  const actionUndo = (
    <Button size="small" onClick={unhideTask}>
      Отмена
    </Button>
  );

  // Deleting
  const deleteArticle = async () => {
    edit && edit(task.id, { isRemoved: true });
    deletePartnerArticle(task.id)
      .then(() => {
        setSnackbarMessage((prev) => [
          ...prev,
          { status: 'success', message: 'Задача выполнена!', key: new Date().getTime() },
        ]);
      })
      .catch((error) => {
        setSnackbarMessage((prev) => [
          ...prev,
          { status: 'success', message: error.message, key: new Date().getTime() },
        ]);
      });
  };

  // Deleting
  const hideTask = () => {
    // remove && remove(task.id);
    edit && edit(task.id, { isRemoved: true });
    updatePartnerArticle(task.id, { isRemoved: true });
    setSnackbarMessage((prev) => [
      ...prev,
      { status: 'success', message: 'Задача удалена', action: actionUndo, key: new Date().getTime() },
    ]);
    // If Undo wasn't clicked, delete it permanently
    // setMyTimeout(
    //   setTimeout(async () => {
    //     await deletePartnerArticle(task.id);
    //   }, 3000)
    // );
  };

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (checked) {
      setMyTimeout(
        setTimeout(async () => {
          await deleteArticle();
        }, 2000)
      );
    } else {
      if (myTimeout) {
        clearTimeout(myTimeout);
      }
    }
  }, [checked]);

  return (
    <>
      {!editMode ? (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Checkbox
            icon={<RadioButtonUncheckedIcon fontSize="large" />}
            checkedIcon={<CheckCircleOutlineIcon fontSize="large" />}
            checked={checked}
            onChange={handleCheck}
            color="secondary"
            inputProps={{
              'aria-label': `Complete task "${task.title}"`,
            }}
          />
          <Box sx={{ ml: 1, mr: 1, wordBreak: 'break-word' }}>
            <Typography variant="h5" component="div">
              {task.title}
            </Typography>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {task.description}
              </Typography>
            )}
          </Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 'auto' }}>
            <IconButton color="primary" aria-label="Edit task" onClick={changeMode}>
              <EditIcon />
            </IconButton>
            <IconButton color="secondary" aria-label="Delete task" onClick={hideTask}>
              <DeleteOutlineIcon />
            </IconButton>
          </Stack>
        </Stack>
      ) : (
        <Stack sx={{ pt: 2, pb: 2 }}>
          <EditTask task={task} setSnackbarMessage={setSnackbarMessage} edit={edit} setEditedTask={setEditedTask} />
        </Stack>
      )}
    </>
  );
};
