import { Timestamp } from 'firebase/firestore';
import { TReducer, TState, TAction, TTask } from '../../types';

export const tasksReducer: TReducer = (state: TState, action: TAction): TState => {
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
    case 'toggle-remove': {
      const taskIndex = state.tasks.findIndex((t) => t.id === action.id);
      const task = { ...state.tasks[taskIndex] };
      task.isRemoved = !state.tasks[taskIndex].isRemoved;
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
