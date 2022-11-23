import React, { FC } from 'react';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

// MUI
import { Stack, Typography } from '@mui/material';

export const Error: FC = () => {
  return (
    <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ p: 3, minHeight: '100vh' }}>
      <SentimentDissatisfiedIcon sx={{ fontSize: 100 }} color="error" />
      <Typography variant="h1" textAlign="center" color="primary">
        Oops! Something went wrong!
      </Typography>
      <Typography variant="h2" textAlign="center">
        Please don&apos;t worry, we&apos;re already working on it.
      </Typography>
    </Stack>
  );
};
