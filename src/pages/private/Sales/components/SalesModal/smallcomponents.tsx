import { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';

interface StepItemContentProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const StepItemContent = ({ children, title, subtitle }: StepItemContentProps) => (
  <Card >
    <CardHeader title={title} subheader={subtitle} sx={{ pb: 0 }} />
    <CardContent>{children}</CardContent>
  </Card>
);
