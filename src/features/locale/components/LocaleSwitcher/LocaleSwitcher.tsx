import React, { FC } from 'react';
import { FormControl, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useLocale } from '@features/locale/hooks';
import { Locale } from '@features/locale/types';
import { useTranslation } from 'react-i18next';

export const LocaleSwitcher: FC = () => {
  const { locale, setLocale } = useLocale();

  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    setLocale(event.target.value as Locale);
  };

  return (
    <FormControl size={'small'}>
      <Select value={locale} onChange={handleChange} inputProps={{ 'aria-label': `${t('locale_switcher')}` }}>
        <MenuItem value={Locale.ru}>Рус</MenuItem>
        <MenuItem value={Locale.en}>Eng</MenuItem>
      </Select>
    </FormControl>
  );
};
