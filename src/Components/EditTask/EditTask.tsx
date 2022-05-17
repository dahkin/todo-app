import React, { ChangeEvent, FC, FormEvent, useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { getErrors } from './helpers';
import { createTask, updateTask } from '../../api';
import { Timestamp } from 'firebase/firestore';
import { TTask, SnackbarMessage } from '../../types';
import { InputErrors, InputName, InputRefs, InputValues } from './types';
import { useAuthContext } from '../../features/auth/AuthContextProvider';
// MUI
import { Box, Stack, Button, Typography, TextField } from '@mui/material';

interface Props {
  task?: TTask;
  addSnackbarMessage: (
    status: SnackbarMessage['status'],
    message: SnackbarMessage['message'],
    action?: SnackbarMessage['action']
  ) => void;
  closeEdit: () => void;
  addState?: (value: Omit<TTask, 'created' | 'isRemoved' | 'viewMode'>) => void;
  editState?: (id: string, value: Partial<Omit<TTask, 'id' | 'created'>>) => void;
  setEditedTask?: Dispatch<SetStateAction<string>>;
}

export const EditTask: FC<Props> = ({ task, addSnackbarMessage, closeEdit, addState, editState, setEditedTask }) => {
  const { user } = useAuthContext();
  const inputRefs: InputRefs = {
    title: useRef<HTMLInputElement>(),
    description: useRef<HTMLTextAreaElement>(),
  };
  const [inputErrors, setInputErrors] = useState<InputErrors>({
    title: '',
    description: '',
  });
  const [inputValues, setInputValues] = useState<InputValues>({
    title: '',
    description: '',
  });

  // Get input values
  const onChangeInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const input = event.currentTarget;
    const name = input.name;
    const value = input.value;

    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  // On form submit
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Collect data
    const data = new FormData();

    Object.entries(inputValues).forEach(([name, value]) => {
      data.append(name, value);
    });

    // Check data
    const errors = await getErrors(Array.from(data.entries()) as [InputName, FormDataEntryValue][]);
    const errorsEntries = Object.entries(errors);

    // Highlight errors
    setInputErrors(errors);

    // Focus on first error field
    const errorInput = errorsEntries.find(([, value]) => value.length > 0);

    if (errorInput) {
      const name = errorInput[0] as InputName;
      const inputRef = inputRefs[name];
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    // Send data
    if (task) {
      updateTask(user.uid, task.id, inputValues)
        .then(() => {
          editState && editState(task.id, { title: inputValues.title, description: inputValues.description });
          setEditedTask && setEditedTask('');
          closeEdit();
          addSnackbarMessage('success', 'Задача обновлена');
        })
        .catch((error) => {
          addSnackbarMessage('error', error.message);
        });
    } else {
      const data = { ...inputValues, isRemoved: false, created: Timestamp.now() };
      createTask(user.uid, data)
        .then((id) => {
          addState && addState({ id: id, title: inputValues.title, description: inputValues.description });
          closeEdit();
          addSnackbarMessage('success', 'Задача создана');
        })
        .catch((error) => {
          addSnackbarMessage('error', error.message);
        });
    }
  };

  // Set initial data
  useEffect(() => {
    if (!task) {
      return;
    }

    setInputValues({
      title: task.title,
      description: task.description,
    });
  }, []);

  return (
    <Box component="form" noValidate onSubmit={onSubmit}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {task ? 'Редактирование задачи' : 'Новая задача'}
      </Typography>
      <Stack direction="column" spacing={2}>
        <TextField
          fullWidth
          label="Название задачи"
          variant="outlined"
          name="title"
          value={inputValues.title}
          onChange={onChangeInput}
          ref={inputRefs.title}
          error={Boolean(inputErrors.title.length)}
          helperText={inputErrors.title}
        />
        <TextField
          fullWidth
          multiline
          maxRows={4}
          label="Описание"
          variant="outlined"
          name="description"
          value={inputValues.description}
          onChange={onChangeInput}
          ref={inputRefs.description}
          error={Boolean(inputErrors.description.length)}
          helperText={inputErrors.description}
        />
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="outlined" color="primary">
            Сохранить
          </Button>
          <Button type="button" color="primary" onClick={closeEdit}>
            Отмена
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
