import { ReactElement } from 'react';

export interface SnackbarMessage {
  status: 'error' | 'warning' | 'success' | 'info';
  message: string;
  action?: ReactElement;
  key: number;
}
