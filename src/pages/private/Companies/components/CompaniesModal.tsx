import { Form, notification, Spin, Select } from 'antd';
import InputAntd from '@/components/InputAntd';
import SubmitButton from '@/components/SubmitButton';
import { CompanyProps } from '@/services/companies/company';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Divider, Box, IconButton, Card, CardContent } from '@mui/material';
import SelectRegions from '@/components/selects/SelectRegions';
import SelectProvinces from '@/components/selects/SelectProvinces';
import SelectDistricts from '@/components/selects/SelectDistricts';
import { EMAIL_PATTERN } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { postCompany, putCompany } from '@/services/companies/company.requests';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface CompaniesModalProps {
  data?: CompanyProps;
  handleClose: VoidFunction;
  handleReload: VoidFunction;
}

const CompaniesModal = ({ data, handleClose, handleReload }: CompaniesModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) {
      form.setFieldsValue({
        departamento: '',
        provincia: '',
        distrito: '',
        web: '',
        logo: '',
        departamentoId: null,
        provinciaId: null,
        distritoId: null,
        cuentasBancarias: [{}], // Inicializar con una cuenta vacía
      });
      return;
    }
    form.setFieldsValue({
      ruc: data.ruc,
      razon_social: data.razonSocial,
      telefono: data.telefono,
      email: data.email,
      web: data.web || '',
      departamento: data.departamento || '',
      provincia: data.provincia || '',
      distrito: data.distrito || '',
      direccion: data.direccion,
      direcciones: data.direcciones || '',
      logo: data.logo || '',
      cuentasBancarias: data.cuentasBancarias && data.cuentasBancarias.length > 0
        ? data.cuentasBancarias
        : [{}], // Si no hay cuentas, inicializar con una vacía
      departamentoId: null,
      provinciaId: null,
      distritoId: null,
    });
  }, [data, form]);

  const addBankAccount = () => {
    const currentAccounts = form.getFieldValue('cuentasBancarias') || [];
    form.setFieldsValue({
      cuentasBancarias: [...currentAccounts, {}],
    });
  };

  const removeBankAccount = (index: number) => {
    const currentAccounts = form.getFieldValue('cuentasBancarias') || [];
    if (currentAccounts.length > 1) {
      form.setFieldsValue({
        cuentasBancarias: currentAccounts.filter((_: any, i: number) => i !== index),
      });
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      setLoading(true);

      // Filtrar cuentas bancarias válidas (solo banco y número de cuenta requeridos)
      const cuentasBancariasFiltradas = values.cuentasBancarias?.filter((cuenta: any) =>
        cuenta.banco && cuenta.numeroCuenta
      ).map((cuenta: any) => ({
        ...cuenta,
        numeroCci: cuenta.cci || null, // Mapear cci a numeroCci para el backend
        moneda: cuenta.moneda || 'SOLES', // Default a SOLES si no se especifica
        tipoCuenta: cuenta.tipoCuenta || 'corriente', // Default a corriente
        titularCuenta: cuenta.titularCuenta || '', // Default vacío
      })) || [];

      // Preparar datos para el backend con nombres de ubicación
      const body = {
        ruc: values.ruc,
        razon_social: values.razon_social,
        telefono: values.telefono,
        email: values.email,
        web: values.web,
        departamento: values.departamento, // Guardar el nombre, no el objeto
        provincia: values.provincia,       // Guardar el nombre, no el objeto
        distrito: values.distrito,         // Guardar el nombre, no el objeto
        direccion: values.direccion,
        direcciones: values.direcciones,
        logo: values.logo,
        cuentasBancarias: cuentasBancariasFiltradas,
      };

      if (data) {
        await putCompany(data.id, body);
      } else {
        await postCompany(body);
      }

      notification.success({
        message: 'Empresa guardada',
        description: `La empresa se ${data ? 'actualizó' : 'creó'} correctamente.`,
      });

      handleClose();
      handleReload();
    } catch (error) {
      console.error('Error al guardar empresa:', error);
      notification.error({
        message: 'Error al guardar',
        description: 'No se pudo guardar la información de la empresa.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth="md"
      sx={{
        zIndex: 1300, // Más alto que el sidebar (1200)
        '& .MuiDialog-paper': {
          zIndex: 1300,
        },
        '& .MuiBackdrop-root': {
          zIndex: 1299,
        },
      }}
    >
      <DialogTitle variant="h5" textAlign="center">
        {data ? 'Editar' : 'Agregar'} empresa
      </DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        <Spin spinning={loading}>
          <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 8 }} autoComplete="off">

            {/* Sección: Información Básica */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                📋 Información Básica
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item
                    name="ruc"
                    rules={[
                      { required: true, message: 'El RUC es requerido' },
                      { len: 11, message: 'Ingrese un RUC válido de 11 dígitos' },
                      { pattern: /^\d+$/, message: 'El RUC debe contener solo números' },
                    ]}
                  >
                    <InputAntd label="RUC" />
                  </Form.Item>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                  <Form.Item name="razon_social" rules={[{ required: true, message: 'La razón social es requerida' }]}>
                    <InputAntd label="Razón social" />
                  </Form.Item>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Sección: Información de Contacto */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                📞 Información de Contacto
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item
                    name="telefono"
                    rules={[
                      { required: true, message: 'El teléfono o celular es requerido' },
                    ]}
                  >
                    <InputAntd label="Tel / Cel" />
                  </Form.Item>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'El correo electrónico es requerido' },
                      { pattern: EMAIL_PATTERN, message: 'Ingrese un correo electrónico válido' },
                    ]}
                  >
                    <InputAntd label="Correo electrónico" />
                  </Form.Item>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item name="web">
                    <InputAntd label="Dirección Web" />
                  </Form.Item>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Sección: Ubicación */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                📍 Ubicación
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item name="departamento">
                    <SelectRegions
                      label="Departamento"
                      onChange={(value, record: any) => {
                        const departamentoName = record?.optiondata?.name || '';
                        form.setFieldsValue({
                          departamento: departamentoName,
                          departamentoId: value,
                          provincia: null,
                          provinciaId: null,
                          distrito: null,
                          distritoId: null,
                        });
                      }}
                    />
                  </Form.Item>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => (
                      <Form.Item name="provincia">
                        <SelectProvinces
                          label="Provincia"
                          regionId={getFieldValue('departamentoId')}
                          onChange={(value, record: any) => {
                            const provinciaName = record?.optiondata?.name || '';
                            form.setFieldsValue({
                              provincia: provinciaName,
                              provinciaId: value,
                              distrito: null,
                              distritoId: null,
                            });
                          }}
                        />
                      </Form.Item>
                    )}
                  </Form.Item>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => (
                      <Form.Item name="distrito">
                        <SelectDistricts
                          label="Distrito"
                          provinceId={getFieldValue('provinciaId')}
                          onChange={(value, record: any) => {
                            const distritoName = record?.optiondata?.name || '';
                            form.setFieldsValue({
                              distrito: distritoName,
                              distritoId: value,
                            });
                          }}
                        />
                      </Form.Item>
                    )}
                  </Form.Item>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Form.Item name="direccion" rules={[{ required: true, message: 'La dirección es requerida' }]}>
                    <InputAntd label="Dirección completa" />
                  </Form.Item>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Form.Item name="direcciones">
                    <InputAntd label="Direcciones adicionales (opcional)" />
                  </Form.Item>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Sección: Información Bancaria */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  💳 Información Bancaria
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addBankAccount}
                  sx={{ minWidth: 'auto' }}
                >
                  Agregar Cuenta
                </Button>
              </Box>

              <Form.List name="cuentasBancarias">
                {(fields, { remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <Card key={field.key} sx={{ mb: 2, position: 'relative' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Cuenta Bancaria #{index + 1}
                            </Typography>
                            {fields.length > 1 && (
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => {
                                  remove(field.name);
                                  removeBankAccount(index);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>

                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'banco']}
                                rules={[{ required: false, message: 'El banco es requerido' }]}
                              >
                                <InputAntd label="Banco" />
                              </Form.Item>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                              <Form.Item
                                {...field}
                                name={[field.name, 'numeroCuenta']}
                                rules={[{ required: false, message: 'El número de cuenta es requerido' }]}
                              >
                                <InputAntd label="Número de cuenta" />
                              </Form.Item>
                            </Grid>
                            {/* Campos ocultos - no visibles para el usuario */}
                            <Form.Item
                              {...field}
                              name={[field.name, 'tipoCuenta']}
                              initialValue="corriente"
                              style={{ display: 'none' }}
                            >
                              <Select style={{ width: '100%' }}>
                                <Select.Option value="corriente">Cuenta Corriente</Select.Option>
                                <Select.Option value="ahorros">Cuenta de Ahorros</Select.Option>
                              </Select>
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'cci']}
                              style={{ display: 'none' }}
                            >
                              <InputAntd />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'titularCuenta']}
                              style={{ display: 'none' }}
                            >
                              <InputAntd />
                            </Form.Item>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              </Form.List>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Sección: Recursos Adicionales */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                🎨 Recursos Adicionales
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Form.Item name="logo">
                    <SimpleFileUpload label="Logo de la empresa" accept='image/*' />
                  </Form.Item>
                </Grid>
              </Grid>
            </Box>

            {/* Campos ocultos para los IDs de ubicación */}
            <Form.Item name="departamentoId" noStyle />
            <Form.Item name="provinciaId" noStyle />
            <Form.Item name="distritoId" noStyle />

            <Button className="d-none" type="submit">
              SUBMIT
            </Button>
          </Form>
        </Spin>
      </DialogContent>
      <DialogActions sx={{ padding: 2, gap: 1.5 }}>
        <Button variant="outlined" color="error" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <SubmitButton form={form} onClick={() => form.submit()} loading={loading}>
          Guardar{data ? ' cambios' : ''}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
};

export default CompaniesModal;
