import { InputErrors, InputName } from './types';

export const getErrors = async (data: [InputName, FormDataEntryValue][]): Promise<InputErrors> => {
  const errors: InputErrors = {
    title: '',
    description: '',
  };

  for (const [name, value] of data) {
    switch (name) {
      case 'title': {
        if (typeof value !== 'string') {
          break;
        }

        if (value.length === 0) {
          errors[name] = 'Название не может быть пустым';
          continue;
        }

        if (value.length > 20) {
          errors[name] = 'Название должно быть до 50 символов';
        }
        break;
      }

      case 'description': {
        if (typeof value !== 'string') {
          break;
        }

        if (value.length > 140) {
          errors[name] = 'Описание должно быть до 140 символов';
        }
        break;
      }

      default: {
        break;
      }
    }
  }

  return errors;
};
