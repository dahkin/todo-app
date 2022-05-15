import { RefObject } from 'react';

export type InputName = 'title' | 'description';

export type InputValues = {
  [key in InputName]: string;
};

export type InputErrors = {
  [key in InputName]: string;
};

export type InputRefs = {
  [key in InputName]: RefObject<any>;
};
