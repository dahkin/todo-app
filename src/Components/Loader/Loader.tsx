import React, { FC } from 'react';

// MUI
import { CircularProgress, Backdrop } from '@mui/material';

interface Props {
  loading: boolean;
}

export const Loader: FC<Props> = ({ loading }) => {
  return (
    <Backdrop invisible sx={{ color: 'background.paper', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
};
