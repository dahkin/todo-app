import { Timestamp } from 'firebase/firestore';

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

interface IAction {
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
  type: 'remove';
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

type TAction = IFetchAction | IAddAction | IRemoveAction | IDeleteAction | IEditAction;

type TReducer = (state: TState, action: TAction) => TState;

export const reducer: TReducer = (state: TState, action: TAction): TState => {
  switch (action.type) {
    case 'fetch': {
      return {
        tasks: action.data,
      };
    }
    case 'add': {
      const newTask = {
        id: action.value.id,
        title: action.value.title,
        isRemoved: false,
        viewMode: true,
        description: action.value.description,
        created: Timestamp.now(),
      };
      return {
        tasks: [...state.tasks, newTask],
      };
    }
    case 'edit': {
      const taskIndex = state.tasks.findIndex((t) => t.id === action.id);
      const task = { ...state.tasks[taskIndex] } as TTask;
      const actionKeys = Object.keys(action.value) as (keyof Partial<Omit<TTask, 'id' | 'created'>>)[];
      actionKeys.forEach((name) => {
        const value = action.value[name];
        if (value !== undefined) {
          Object.assign(task, { [name]: value });
        }
      });
      const tasks = [...state.tasks];
      tasks.splice(taskIndex, 1, task);
      return {
        tasks: tasks,
      };
    }
    case 'remove': {
      const taskIndex = state.tasks.findIndex((t) => t.id === action.id);
      const task = { ...state.tasks[taskIndex] };
      task.isRemoved = true;
      const tasks = [...state.tasks];
      tasks.splice(taskIndex, 1, task);
      return {
        tasks: tasks,
      };
    }
    case 'delete': {
      const taskIndex = state.tasks.findIndex((t) => t.id === action.id);
      const tasks = [...state.tasks];
      tasks.splice(taskIndex, 1);
      return {
        tasks: tasks,
      };
    }
    default:
      return state;
  }
};
