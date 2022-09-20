import React, { FC, useState, useEffect } from 'react';
import { updateTask } from '../../api';
import { SnackbarMessage, TTask } from '../../types';
import { useAuthContext } from '../../features/auth/AuthContextProvider';
// MUI
import { Box, Stack, Button, Typography, IconButton, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface Props {
  task: TTask;
  addSnackbarMessage: (
    status: SnackbarMessage['status'],
    message: SnackbarMessage['message'],
    action?: SnackbarMessage['action']
  ) => void;
  editState?: (id: string, value: Partial<Omit<TTask, 'id' | 'created'>>) => void;
  changeMode: () => void;
  toggleViewMode?: (id?: string) => void;
}

export const Task: FC<Props> = ({ task, addSnackbarMessage, editState, changeMode }) => {
  const { user } = useAuthContext();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  // Undo deleting
  const unhideTask = async () => {
    updateTask(user.uid, task.id, { isRemoved: false })
      .then(() => {
        editState && editState(task.id, { isRemoved: false });
        addSnackbarMessage('success', 'Задача восстановлена');
      })
      .catch((error) => {
        addSnackbarMessage('error', error.message);
      });
  };

  // Undo btn for snackbar message
  const actionUndo = (
    <Button size="small" onClick={unhideTask}>
      Отмена
    </Button>
  );

  // Deleting (only editing isRemoved prop, to provide possibility to undo the action)
  const hideTask = () => {
    updateTask(user.uid, task.id, { isRemoved: true })
      .then(() => {
        editState && editState(task.id, { isRemoved: true });
        addSnackbarMessage('success', 'Задача удалена', actionUndo);
      })
      .catch((error) => {
        addSnackbarMessage('error', error.message);
      });
  };

  // Checked/unchecked task logic
  const [myTimeout, setMyTimeout] = useState<NodeJS.Timeout>();

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    if (isChecked) {
      setMyTimeout(
        setTimeout(() => {
          updateTask(user.uid, task.id, { isRemoved: true })
            .then(() => {
              editState && editState(task.id, { isRemoved: true });
              addSnackbarMessage('success', 'Задача выполнена!');
            })
            .catch((error) => {
              addSnackbarMessage('error', error.message);
            });
        }, 2000)
      );
    } else {
      if (myTimeout) {
        clearTimeout(myTimeout);
      }
    }
  }, [isChecked]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Checkbox
          icon={<RadioButtonUncheckedIcon fontSize="large" />}
          checkedIcon={<CheckCircleOutlineIcon fontSize="large" />}
          checked={isChecked}
          onChange={handleCheck}
          color="secondary"
          inputProps={{
            'aria-label': `Complete task "${task.title}"`,
          }}
        />
        <Box sx={{ ml: 1, mr: 1, wordBreak: 'break-word' }}>
          <Typography variant="h5" component="div" style={{ textDecoration: isChecked ? 'line-through' : 'none' }}>
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
    </>
  );
};
