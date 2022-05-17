import { ReactElement } from 'react';

export interface SnackbarMessage {
  status: 'error' | 'warning' | 'success' | 'info';
  message: string;
  action?: ReactElement;
  key: number;
}

export type TTask = {
  id: string;
  title: string;
  description: string;
  created: {
    nanoseconds: number;
    seconds: number;
  };
  isRemoved: boolean;
  viewMode: boolean;
};

export type TState = {
  tasks: Array<TTask>;
};

export interface IAction {
  type: string;
}

// Fetch task
interface IFetchAction extends IAction {
  type: 'fetch';
  data: Array<TTask>;
}

// Add task
interface IAddAction extends IAction {
  type: 'add';
  value: Omit<TTask, 'created' | 'isRemoved' | 'viewMode'>;
}

// Remove task
interface IRemoveAction extends IAction {
  type: 'toggle-remove';
  id: string;
}

// Delete task
interface IDeleteAction extends IAction {
  type: 'delete';
  id: string;
}

// Edit task
interface IEditAction extends IAction {
  type: 'edit';
  id: string;
  value: Partial<Omit<TTask, 'id' | 'created'>>;
}

export type TAction = IFetchAction | IAddAction | IRemoveAction | IDeleteAction | IEditAction;

export type TReducer = (state: TState, action: TAction) => TState;
