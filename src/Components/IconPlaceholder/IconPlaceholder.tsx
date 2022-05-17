import React, { FC } from 'react';

// MUI
import { Stack, Box, Typography } from '@mui/material';

interface Props {
  icon: string;
  title: string;
  isLoader?: boolean;
}

export const IconPlaceholder: FC<Props> = ({ icon, title, isLoader }) => {
  return (
    <Stack spacing={2} alignItems="center" justifyContent="center" flex="1 0 auto" sx={{ minHeight: 200 }}>
      <Box sx={{ height: '45px' }}>
        <img src={icon} alt="Relaxing image" aria-hidden="true" className={isLoader ? 'tasklist__loader' : undefined} />
      </Box>
      <Typography variant="h5">{title}</Typography>
    </Stack>
  );
};
