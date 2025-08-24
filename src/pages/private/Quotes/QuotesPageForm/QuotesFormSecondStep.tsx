import { Form, FormInstance, Input } from 'antd';
import { Grid, Typography } from '@mui/material';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import InputAntd from '@/components/InputAntd';

const { TextArea } = Input;

const QuotesFormSecondStep = ({ form }: { form: FormInstance }) => {
  return (
    <StepItemContent
    >
      <Typography variant="h6" sx={{ margin: 1, mb: 2 }}>
        Lugar de entrega
      </Typography>
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid size={{ xs: 12 }}>
          <Form.Item name="direccionEntrega">
            <InputAntd placeholder="Dirección de entrega" />
          </Form.Item>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Form.Item name="departamentoEntrega">
            <InputAntd placeholder="Departamento" />
          </Form.Item>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Form.Item name="provinciaEntrega">
            <InputAntd placeholder="Provincia"  />
          </Form.Item>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Form.Item name="distritoEntrega">
            <InputAntd placeholder="Distrito"  />
          </Form.Item>
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <Form.Item name="referenciaEntrega">
            <TextArea
              placeholder="Referencia de entrega (opcional)"
              rows={3}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Grid>
      </Grid>
    </StepItemContent>
  );
};

export default QuotesFormSecondStep;

