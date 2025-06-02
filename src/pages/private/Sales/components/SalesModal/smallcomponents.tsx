import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, Box } from '@mui/material';

interface StepItemContentProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const StepItemContent = ({ children, title, subtitle }: StepItemContentProps) => (
  <Card 
    variant="outlined" 
    sx={{ 
      background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
      border: '1px solid #e0e0e0',
      borderRadius: 3,
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      mb: 3
    }}
  >
    <CardHeader 
      title={
        <Box component="span" sx={{ 
          fontSize: '1.1rem', 
          fontWeight: 600, 
          color: '#111826',
          letterSpacing: '0.5px'
        }}>
          {title}
        </Box>
      }
      subheader={subtitle}
      sx={{ 
        pb: 1,
        '& .MuiCardHeader-subheader': {
          color: '#666',
          fontSize: '0.9rem',
          mt: 0.5
        }
      }} 
    />
    <CardContent sx={{ pt: 1 }}>{children}</CardContent>
  </Card>
);
