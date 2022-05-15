import React, { ChangeEvent, FC, FormEvent, useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { getErrors } from './helpers';
import { InputErrors, InputName, InputRefs, InputValues } from './types';
import { createPartnerArticle, updatePartnerArticle } from '../../api';
import { SnackbarMessage } from '../../types';
import { Timestamp } from 'firebase/firestore';
import { TTask } from '../../reducer';

interface Props {
  task?: TTask;
  setSnackbarMessage: Dispatch<SetStateAction<readonly SnackbarMessage[]>>;
  cancelClick?: () => void;
  add?: (value: Omit<TTask, 'created' | 'isRemoved' | 'viewMode'>) => void;
  edit?: (id: string, value: Partial<Omit<TTask, 'id' | 'created'>>) => void;
  setEditedTask?: Dispatch<SetStateAction<string>>;
  onAddNew?: VoidFunction;
}

export const EditTask: FC<Props> = ({ task, setSnackbarMessage, cancelClick, add, edit, onAddNew, setEditedTask }) => {
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
  const onChangeInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const input = event.currentTarget;
    const name = input.name;
    const value = input.value;

    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 1. Собрать данные
    const data = new FormData();

    Object.entries(inputValues).forEach(([name, value]) => {
      data.append(name, value);
    });

    // 2. Проверить данные
    const errors = await getErrors(Array.from(data.entries()) as [InputName, FormDataEntryValue][]);
    const errorsEntries = Object.entries(errors);

    // 3.1 Подстветить ошибки
    setInputErrors(errors);

    // 3.2 Сфокусироваться на первом ошибочном инпуте
    const errorInput = errorsEntries.find(([, value]) => value.length > 0);

    if (errorInput) {
      const name = errorInput[0] as InputName;
      const inputRef = inputRefs[name];
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    // 4. Если все ок, отправить данные
    if (task) {
      updatePartnerArticle(task.id, inputValues)
        .then(() => {
          edit && edit(task.id, { title: inputValues.title, description: inputValues.description });
          setEditedTask && setEditedTask('');
          setSnackbarMessage((prev) => [
            ...prev,
            { status: 'success', message: 'Задача обновлена', key: new Date().getTime() },
          ]);
        })
        .catch((error) => {
          setSnackbarMessage((prev) => [
            ...prev,
            { status: 'error', message: error.message, key: new Date().getTime() },
          ]);
        });
    } else {
      const data = { ...inputValues, isRemoved: false, created: Timestamp.now() };
      createPartnerArticle(data)
        .then((id) => {
          add && add({ id: id, title: inputValues.title, description: inputValues.description });
          onAddNew && onAddNew();
          setSnackbarMessage((prev) => [
            ...prev,
            { status: 'success', message: 'Задача создана', key: new Date().getTime() },
          ]);
        })
        .catch((error) => {
          setSnackbarMessage((prev) => [
            ...prev,
            { status: 'error', message: '${error.message}', key: new Date().getTime() },
          ]);
        });
    }
  };

  // Cancel
  const handleCancelClick = () => {
    cancelClick && cancelClick();
    setEditedTask && setEditedTask('');
  };

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
          <Button type="button" color="primary" onClick={handleCancelClick}>
            Отмена
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
