import React, { FC, useEffect, createRef, useReducer } from 'react';
import { tasksReducer } from './helpers';
import { SnackbarMessage } from '../../types';
import { getTasks } from '../../api';
import { Task } from '@components/Task/Task';
import { EditTask } from '@components/EditTask/EditTask';
import { IconPlaceholder } from '@components/IconPlaceholder/IconPlaceholder';
import { useAuthContext } from '../../features/auth/AuthContextProvider';
// Icons
import noodle from '../../images/noodle.svg';
import donut from '../../images/donut.svg';
import coffee from '../../images/coffee.svg';
// Styles
import './TaskList.css';
// MUI
import { Stack, Button, Snackbar, Alert, Divider, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const TaskList: FC = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [expandedAddNew, setExpandedAddNew] = React.useState<boolean>(false);
  const [clearedTasks, setClearedTasks] = React.useState<boolean>(false);
  const [editedTask, setEditedTask] = React.useState<string>('');
  const addNewRef = createRef<HTMLDivElement>();

  // Snackpack (stack of alerts)
  const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]);
  const [snackPackMessage, setSnackPackMessage] = React.useState<SnackbarMessage | undefined>(undefined);
  const [openSnackbar, setOpenSnackbar] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (snackPack.length > 0 && !snackPackMessage) {
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

  const addSnackbarMessage = (
    status: SnackbarMessage['status'],
    message: SnackbarMessage['message'],
    action?: SnackbarMessage['action']
  ) => {
    setSnackPack((prev) => [...prev, { status: status, message: message, action: action, key: new Date().getTime() }]);
  };

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Get tasks list from firebase
  const [state, dispatch] = useReducer(tasksReducer, { tasks: [] });

  useEffect(() => {
    getTasks(user.uid).then((tasksData) => {
      dispatch({
        type: 'fetch',
        data: tasksData,
      });
      setLoading(false);
    });
  }, []);

  // Filter only active tasks
  const activeTasks = state.tasks.filter((task) => task.isRemoved === false);

  // Expand/collapse of the 'Add new task' section
  const expandAddNew = () => {
    setExpandedAddNew(true);
  };

  const cancelAddNew = () => {
    setExpandedAddNew(false);
  };

  const cancelEdit = () => {
    setEditedTask('');
  };

  // Scrolling to the opened section
  useEffect(() => {
    if (expandedAddNew) {
      addNewRef.current?.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
      // Close opened 'Edit task' section
      setEditedTask('');
    }
  }, [expandedAddNew]);

  return (
    <Stack direction="column" alignItems="center" spacing={4}>
      <Typography variant="h4">Задачи</Typography>
      <Stack
        direction="column"
        spacing={1}
        divider={<Divider flexItem sx={{ opacity: '.3' }} />}
        sx={{ width: '100%' }}
      >
        {!loading ? (
          activeTasks.length > 0 ? (
            activeTasks.map((item) =>
              !(editedTask ? editedTask == item.id : false) ? (
                <Task
                  task={item}
                  addSnackbarMessage={addSnackbarMessage}
                  key={item.id}
                  editState={(id, value) => {
                    dispatch({ type: 'edit', id: id, value: value });
                    setClearedTasks(true);
                  }}
                  changeMode={() => {
                    setEditedTask(item.id);
                    cancelAddNew();
                  }}
                />
              ) : (
                <Stack sx={{ pt: 2, pb: 2 }}>
                  <EditTask
                    task={item}
                    addSnackbarMessage={addSnackbarMessage}
                    editState={(id, value) => {
                      dispatch({ type: 'edit', id: id, value: value });
                      setClearedTasks(true);
                    }}
                    closeEdit={cancelEdit}
                  />
                </Stack>
              )
            )
          ) : (
            <IconPlaceholder
              icon={clearedTasks ? noodle : coffee}
              title={clearedTasks ? 'Воу-воу, задач больше нет!' : 'Пора добавлять задачи!'}
            />
          )
        ) : (
          <IconPlaceholder icon={donut} title="Загрузка задач..." isLoader />
        )}
      </Stack>
      <Divider flexItem />
      <Stack sx={{ width: '100%' }} ref={addNewRef}>
        {expandedAddNew ? (
          <EditTask
            addSnackbarMessage={addSnackbarMessage}
            closeEdit={cancelAddNew}
            addState={(value) => dispatch({ type: 'add', value: value })}
          />
        ) : (
          <Stack alignItems="center">
            <Button variant="outlined" startIcon={<AddIcon />} onClick={expandAddNew}>
              Добавить новую
            </Button>
          </Stack>
        )}
      </Stack>

      {/* Snackpack */}
      <Snackbar
        key={snackPackMessage ? snackPackMessage.key : undefined}
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        TransitionProps={{ onExited: handleExitedSnackbar }}
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
