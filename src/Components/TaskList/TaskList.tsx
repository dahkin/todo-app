import React, { FC, useEffect, createRef, useReducer } from 'react';
import { reducer } from '../../reducer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { SnackbarMessage } from '../../types';
import { getTasks } from '../../api';
import { Task } from '@components/Task/Task';
import { EditTask } from '@components/EditTask/EditTask';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import noodle from '../../images/noodle.svg';
import donut from '../../images/donut.svg';

export interface State {
  open: boolean;
  snackPack: readonly SnackbarMessage[];
  snackPackMessage?: SnackbarMessage;
}

export const TaskList: FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [expandedAddNew, setExpandedAddNew] = React.useState<boolean>(false);

  const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]);
  const [snackPackMessage, setSnackPackMessage] = React.useState<SnackbarMessage | undefined>(undefined);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const [editedTask, setEditedTask] = React.useState<string>('');
  const addNewRef = createRef<HTMLDivElement>();

  React.useEffect(() => {
    if (snackPack.length && !snackPackMessage) {
      setSnackPackMessage({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpenSnackbar(true);
    } else if (snackPack.length && snackPackMessage && open) {
      setOpenSnackbar(false);
    }
  }, [snackPack, snackPackMessage, openSnackbar]);

  const handleExitedSnackbar = () => {
    setSnackPackMessage(undefined);
  };

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const [state, dispatch] = useReducer(reducer, { tasks: [] });
  useEffect(() => {
    getTasks().then((tasksData) => {
      dispatch({
        type: 'fetch',
        data: tasksData,
      });
      setLoading(false);
    });
  }, []);

  // Add new section expand/collapse
  const expandAddNew = () => {
    setExpandedAddNew(true);
  };

  useEffect(() => {
    if (expandedAddNew) {
      addNewRef.current && addNewRef.current.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
      setEditedTask('');
    }
    //
  }, [expandedAddNew]);

  const cancelAddNew = () => {
    setExpandedAddNew(false);
  };

  console.log(state);

  return (
    <Stack direction="column" alignItems="center" spacing={4}>
      <Typography variant="h4">Задачи</Typography>

      <>
        <Stack
          direction="column"
          spacing={1}
          divider={<Divider variant="middle" flexItem sx={{ opacity: '.3' }} />}
          sx={{ width: '100%' }}
        >
          {!loading ? (
            state.tasks.filter((task) => task.isRemoved === false).length > 0 ? (
              state.tasks.map(
                (item) =>
                  !item.isRemoved && (
                    <Task
                      task={item}
                      setSnackbarMessage={setSnackPack}
                      key={item.id}
                      edit={(id, value) => dispatch({ type: 'edit', id: id, value: value })}
                      remove={(id) => dispatch({ type: 'remove', id: id })}
                      editMode={editedTask ? editedTask == item.id : false}
                      setEditedTask={setEditedTask}
                      cancelClick={cancelAddNew}
                    />
                  )
              )
            ) : (
              <Stack spacing={2} alignItems="center" justifyContent="center" flex="1 0 auto" sx={{ minHeight: 200 }}>
                <Box sx={{ height: '45px' }}>
                  <img src={noodle} alt="Картинка для отдыха" aria-hidden="true" />
                </Box>
                <Typography variant="h5">Воу-воу, задач больше нет!</Typography>
              </Stack>
            )
          ) : (
            <Stack spacing={2} alignItems="center" justifyContent="center" flex="1 0 auto" sx={{ minHeight: 200 }}>
              <Box sx={{ height: '45px' }}>
                <img src={donut} alt="Картинка для отдыха" aria-hidden="true" className="tasklist__loader" />
              </Box>
              <Typography variant="h5">Загрузка задач...</Typography>
            </Stack>
          )}
        </Stack>
        <Divider variant="middle" flexItem />
        <Stack sx={{ width: '100%' }} ref={addNewRef}>
          {expandedAddNew ? (
            <EditTask
              setSnackbarMessage={setSnackPack}
              cancelClick={cancelAddNew}
              add={(value) => dispatch({ type: 'add', value: value })}
              onAddNew={() => setExpandedAddNew(false)}
              // setEditedTask={setEditedTask}
            />
          ) : (
            <Stack alignItems="center">
              <Button variant="outlined" startIcon={<AddIcon />} onClick={expandAddNew}>
                Добавить новую
              </Button>
            </Stack>
          )}
        </Stack>
      </>

      <Snackbar
        key={snackPackMessage ? snackPackMessage.key : undefined}
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        TransitionProps={{ onExited: handleExitedSnackbar }}
        // message={snackPackMessage ? snackPackMessage.message : undefined}
      >
        <Alert
          key={snackPackMessage ? snackPackMessage.key : undefined}
          onClose={handleCloseSnackbar}
          severity={snackPackMessage ? snackPackMessage.status : undefined}
          sx={{ width: '100%' }}
          action={snackPackMessage && snackPackMessage.action ? snackPackMessage.action : undefined}
        >
          {snackPackMessage ? snackPackMessage.message : undefined}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
