import { Form, InputNumber, FormInstance } from 'antd';
import { AddCircle, Delete, LocalShipping } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  FormHelperText,
  Grid,
  IconButton,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import InputAntd from '@/components/InputAntd';
import SelectGeneric from '@/components/selects/SelectGeneric';
import SelectTransports from '@/components/selects/SelectTransports';
import SelectContactsByTransport from '@/components/selects/SelectContactsByTransport';
import SimpleFileUpload from '@/components/SimpleFileUpload';

interface TransportsSectionProps {
  form: FormInstance;
}

const getEmptyTransformRecord = () => ({
  transporte: null,
  destino: null,
  region: '',
  provincia: '',
  distrito: '',
  direccion: '',
  nota: '',
  flete: '',
  cotizacion: null,
});

export { getEmptyTransformRecord };

const requiredField = { required: true, message: 'Requerido' };

const TransportsSection = ({ form }: TransportsSectionProps) => {
  return (
    <Form.List
      name="transportes"
      initialValue={[getEmptyTransformRecord()]}
      rules={[
        {
          validator(_, arr) {
            if (!arr.length) {
              return Promise.reject(new Error('Debe ingresar por lo menos 1 transporte para continuar.'));
            }
            return Promise.resolve();
          },
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <Card sx={{ backgroundColor: '#ecf0f4', border: 'none' }}>
          {/* Header similar a StepItemContent */}
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center" 
            sx={{
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }} 
            bgcolor="#887bad" 
            color="#ffffff" 
            px={2} 
            height={32}
          >
          </Stack>

          {/* Sección de resumen similar a StepItemContent */}
          <Stack 
            bgcolor="#2f3a4b" 
            color="#ffffff" 
            p={2} 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              mb: 3,
            }}
          >
            <Stack direction="row" spacing={2}>
              <Stack alignItems="center" justifyContent="center">
                <LocalShipping sx={{ fontSize: 56, color: '#887bad' }} />
              </Stack>

              <Box>
                <Divider orientation="vertical" sx={{ borderColor: '#887bad' }} />
              </Box>
              
              <Stack height="100%" justifyContent="center">
                <Typography variant="h5">TRANSPORTE</Typography>
                {errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : null}
              </Stack>
            </Stack>

            <IconButton 
              sx={{ 
                border: '1px solid', 
                borderRadius: 1, 
                color: '#887bad',
                zIndex: 900 
              }} 
              onClick={() => add(getEmptyTransformRecord())}
            >
              <AddCircle />
            </IconButton>
          </Stack>

          {/* Contenido principal */}
          <Box>
          <Stack direction="column" spacing={3}>
            {fields.map((field) => (
              <Card 
                key={field.name} 
                sx={{ 
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  bgcolor: '#f8f9fa'
                }}
              >
                {/* Header del Transporte con información principal */}
                <CardHeader
                  sx={{ 
                    py: 2,
                    px: 3,
                    bgcolor: '#887bad',
                    borderRadius: '8px 8px 0 0',
                  }}
                  title={
                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldValue }) => {
                        const transporteData = getFieldValue(['transportes', field.name, 'transporte']);
                        const transporteName = transporteData?.razonSocial || `TRANSPORTE N° ${field.name + 1}`;
                        return (
                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                            {transporteName}
                          </Typography>
                        );
                      }}
                    </Form.Item>
                  }
                  action={
                    <IconButton 
                      color="error" 
                      onClick={() => remove(field.name)} 
                      sx={{ 
                        border: '1px solid #fff', 
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                      }}
                    >
                      <Delete sx={{ color: '#fff' }} />
                    </IconButton>
                  }
                />

                <CardContent sx={{ p: 3, bgcolor: 'white' }}>
                  {/* Sección de información principal - 3 columnas */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={4}>
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                          const transporteData = getFieldValue(['transportes', field.name, 'transporte']);
                          return (
                            <Stack spacing={1}>
                              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                                Empresa de Transporte
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {transporteData?.razonSocial || '---'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                RUC: {transporteData?.ruc || '---'}
                              </Typography>
                            </Stack>
                          );
                        }}
                      </Form.Item>
                    </Grid>
                    
                    <Grid size={4}>
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                          const direccion = getFieldValue(['transportes', field.name, 'direccion']);
                          const region = getFieldValue(['transportes', field.name, 'region']);
                          const provincia = getFieldValue(['transportes', field.name, 'provincia']);
                          const distrito = getFieldValue(['transportes', field.name, 'distrito']);
                          
                          return (
                            <Stack spacing={1}>
                              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                                Dirección y Ubicación
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {direccion || '---'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {[region, provincia, distrito].filter(Boolean).join(' / ') || 'Sin ubicación especificada'}
                              </Typography>
                            </Stack>
                          );
                        }}
                      </Form.Item>
                    </Grid>

                    <Grid size={4}>
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                          const contactoData = getFieldValue(['transportes', field.name, 'contacto']);
                          return (
                            <Stack spacing={1}>
                              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                                Conductor
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {contactoData?.nombre || '---'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {contactoData?.telefono || '---'}
                              </Typography>
                            </Stack>
                          );
                        }}
                      </Form.Item>
                    </Grid>
                  </Grid>

                  {/* Sección de formulario - campos editables */}
                  <Grid container spacing={2}>
                    {/* Primera fila: Empresa de Transporte y Dirección */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Form.Item name={[field.name, 'transporte']} rules={[requiredField]}>
                        <SelectTransports label="Empresa de Transporte" />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Form.Item name={[field.name, 'direccion']} rules={[requiredField]}>
                        <InputAntd label="Dirección" size="large" />
                      </Form.Item>
                    </Grid>

                    {/* Segunda fila: Contacto y Destino */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Form.Item name={[field.name, 'contacto']} rules={[requiredField]}>
                        <Form.Item noStyle shouldUpdate>
                          {({ getFieldValue }) => {
                            const transporteId = getFieldValue(['transportes', field.name, 'transporte']);
                            return (
                              <SelectContactsByTransport
                                transportId={transporteId}
                                onChange={(value, record: any) => {
                                  // Autocompletar campos de nombre y teléfono del contacto del transporte
                                  form.setFieldsValue({
                                    [`transportes[${field.name}].contacto`]: value,
                                    [`transportes[${field.name}].nombreContactoTransporte`]: record?.optiondata?.nombre,
                                    [`transportes[${field.name}].telefonoContactoTransporte`]: record?.optiondata?.telefono,
                                  });
                                }}
                                onContactCreated={() => {
                                  // Recargar contactos si es necesario
                                }}
                              />
                            );
                          }}
                        </Form.Item>
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Form.Item name={[field.name, 'destino']} rules={[requiredField]}>
                        <SelectGeneric label="Destino" options={['CLIENTE', 'ALMACEN'].map((value) => ({ value, label: value }))} />
                      </Form.Item>
                    </Grid>

                    {/* Tercera fila: Ubicación */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Form.Item name={[field.name, 'region']}>
                        <InputAntd label="Departamento" size="large" />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Form.Item name={[field.name, 'provincia']}>
                        <InputAntd label="Provincia" size="large" />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Form.Item name={[field.name, 'distrito']}>
                        <InputAntd label="Distrito" size="large" />
                      </Form.Item>
                    </Grid>

                    {/* Quinta fila: Nota de transporte */}
                    <Grid size={12}>
                      <Form.Item name={[field.name, 'nota']} rules={[requiredField]}>
                        <InputAntd 
                          label="Nota de transporte" 
                          type="textarea" 
                          size="large"
                          style={{
                            border: '1px solid #007bff',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                      </Form.Item>
                    </Grid>

                    {/* Cuarta fila: Subir Cotización y Flete Cotizado */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Form.Item name={[field.name, 'cotizacion']} rules={[requiredField]}>
                        <Typography sx={{ textAlign: 'center' }}>Subir Cotización</Typography>
                        <SimpleFileUpload
                          accept="pdf"
                        />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Form.Item name={[field.name, 'flete']} rules={[requiredField]}>
                        <Stack>
                          <Typography sx={{ textAlign: 'center' }}>
                            Flete Cotizado
                          </Typography>
                          <InputNumber
                            min={0}
                            step={0.01}
                            placeholder="0.00"
                            style={{ 
                              width: '100%',
                              border: '1px solid #007bff',
                              borderRadius: '8px',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              padding: '6px',
                            }}
                            prefix="S/ "
                          />
                        </Stack>
                      </Form.Item>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
          </Box>
        </Card>
      )}
    </Form.List>
  );
};

export default TransportsSection;
