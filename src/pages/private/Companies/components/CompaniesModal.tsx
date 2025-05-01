import { Form } from 'antd';
import InputAntd from '@/components/InputAntd';
import SubmitButton from '@/components/SubmitButton';
import { CompanyProps } from '@/services/companies/company';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import SelectRegions from '@/components/selects/SelectRegions';
import SelectProvinces from '@/components/selects/SelectProvinces';
import SelectDistricts from '@/components/selects/SelectDistricts';
import InputFile from '../../../../components/InputFile';

interface CompaniesModalProps {
  data: null | CompanyProps;
  handleClose: VoidFunction;
}

const CompaniesModal = ({ data, handleClose }: CompaniesModalProps) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: Record<string, string>) => {
    console.log(values);
  };

  const requiredField = { required: true, message: 'Este campo es requerido' };

  return (
    <Dialog open fullWidth maxWidth="md" onClose={handleClose}>
      <DialogTitle variant="h5">{data ? 'Editar' : 'Agregar'} empresa</DialogTitle>
      <DialogContent>
        <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 8 }}>
          <Grid container columnSpacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Form.Item name="razon_social" rules={[requiredField]}>
                <InputAntd label="Razón social" />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Form.Item name="ruc" rules={[requiredField]}>
                <InputAntd label="RUC" />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Form.Item name="telefono" rules={[requiredField]}>
                <InputAntd label="Tel / Cel" />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Form.Item name="email" rules={[requiredField]}>
                <InputAntd label="Correo electrónico" />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Form.Item name="web" rules={[requiredField]}>
                <InputAntd label="Dirección Web" />
              </Form.Item>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Form.Item name="departamento" rules={[requiredField]}>
                <SelectRegions
                  label="Departamento"
                  onChange={(value) => form.setFieldsValue({ departamento: value, provincia: null, distrito: null })}
                />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => (
                  <Form.Item name="provincia" rules={[requiredField]}>
                    <SelectProvinces
                      label="Provincia"
                      regionId={getFieldValue('departamento')}
                      onChange={(value) => form.setFieldsValue({ provincia: value, distrito: null })}
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => (
                  <Form.Item name="distrito" rules={[requiredField]}>
                    <SelectDistricts label="Distrito" provinceId={getFieldValue('provincia')} />
                  </Form.Item>
                )}
              </Form.Item>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Form.Item name="direccion" rules={[requiredField]}>
                <InputAntd label="Dirección" />
              </Form.Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <Form.Item name="logo" rules={[requiredField]}>
                <InputFile onChange={(file) => form.setFieldValue('logo', file)} />
              </Form.Item>
            </Grid>
          </Grid>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleClose}>
          Cancelar
        </Button>
        <SubmitButton form={form} onClick={() => form.submit()}>
          Guardar{data ? ' cambios' : ''}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
};

export default CompaniesModal;
