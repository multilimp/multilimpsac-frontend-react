
import { useState } from 'react';

export const useTabs = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return { tabValue, handleTabChange };
};
