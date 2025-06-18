import useContacts from '@/hooks/useContacts';
import useContactsByEntity from '@/hooks/useContactsByEntity';
import { ContactProps } from '@/services/contacts/contacts';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';
import { AddBox, Close, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Button, Card, CardActionArea, CardContent, CardHeader, Collapse, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { Empty, Form, message, Spin } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import InputAntd from './InputAntd';
import DatePickerAntd from './DatePickerAnt';
import { createContact } from '@/services/contacts/contacts.requests';

interface ContactsDrawerProps {
  handleClose: VoidFunction;
  tipo: ContactTypeEnum;
  referenceId: number;
  onContactCreated?: VoidFunction;
}

const ContactsDrawer = ({ handleClose, tipo, referenceId, onContactCreated }: ContactsDrawerProps) => {
  const entityType = tipo.toLowerCase() as 'cliente' | 'proveedor' | 'transporte';
  const { contacts, loadingContacts, obtainContacts } = useContactsByEntity(entityType, referenceId);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const isLoading = loading || loadingContacts;

  const onSubmit = async (values: Record<string, string>) => {
    try {
      setLoading(true);
      await createContact(values);
      setOpenForm(false);
      obtainContacts();
      onContactCreated?.(); // Notificar al componente padre
    } catch (error) {
      message.error(`No se logró guardar el contacto. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open>
      <Card sx={{ borderRadius: 0, width: 450 }} variant="outlined">
        <CardHeader
          title="CONTACTOS"
          slotProps={{ title: { fontWeight: 700, fontSize: 20 } }}
          sx={{ pb: 1, pt: 2 }}
          action={
            <IconButton size="small" color="error" onClick={handleClose} disabled={isLoading}>
              <Close fontSize="large" />
            </IconButton>
          }
        />
        <CardContent sx={{ height: 'calc((100vh) - 80px)', overflow: 'auto' }}>
          <Spin spinning={isLoading}>
            <Stack direction="column" spacing={2}>
              {contacts.length ? contacts.map((item, index) => <CardItem data={item} key={index + 1} />) : <Empty description="No hay contactos" />}

              {openForm ? (
                <CardForm handleClose={() => setOpenForm(false)} tipo={tipo} referenceId={referenceId} onSubmit={onSubmit} />
              ) : (
                <Card>
                  <CardActionArea onClick={() => setOpenForm(true)}>
                    <CardContent>
                      <Stack direction="column" justifyContent="center" alignItems="center">
                        <AddBox fontSize="large" color="info" />
                        <Typography variant="subtitle1" color="info">
                          Agregar contacto
                        </Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              )}
            </Stack>
          </Spin>
        </CardContent>
      </Card>
    </Drawer>
  );
};

export default ContactsDrawer;

const CardItem = ({ data }: { data: ContactProps }) => {
  const [open, setOpen] = useState(false);

  const records = [
    { label: 'Correo', value: data.email ?? '-' },
    { label: 'Teléfono', value: data.telefono ?? '-' },
    { label: 'Usuario destacado', value: data.usuarioDestacado ? 'Si' : 'No' },
    { label: 'Cumpleaños', value: data.cumpleanos ? dayjs(data.cumpleanos).format('DD/MM/YYYY') : '-' },
    { label: 'Nota', value: data.nota ?? '-' },
  ];

  return (
    <Card>
      <CardHeader
        title={data.nombre}
        subheader={data.cargo}
        sx={{ pt: 2 }}
        action={
          <IconButton onClick={() => setOpen(!open)} size="small" color={open ? 'primary' : 'default'}>
            {open ? <KeyboardArrowUp fontSize="large" /> : <KeyboardArrowDown fontSize="large" />}
          </IconButton>
        }
      />
      <Collapse in={open}>
        <CardContent sx={{ pt: 0, pb: '16px !important' }}>
          {records.map((item, index) => (
            <Stack key={index + 1} direction="row" spacing={2}>
              <Typography flex={1} color="textSecondary" variant="body2">
                <b>{item.label}</b>
              </Typography>
              <Typography flex={1} color="textSecondary" variant="body2">
                {item.value}
              </Typography>
            </Stack>
          ))}
        </CardContent>
        {/* <CardActions sx={{ pt: 0 }}>
          <IconButton color="info">
            <Edit />
          </IconButton>
          <Box flex={1} />
          <IconButton color="error">
            <Delete />
          </IconButton>
        </CardActions> */}
      </Collapse>
    </Card>
  );
};

interface CardFormProps extends ContactsDrawerProps {
  onSubmit: (data: Record<string, any>) => void;
}

const CardForm = ({ handleClose, tipo, referenceId, onSubmit }: CardFormProps) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: Record<string, any>) => {
    const body: Record<string, any> = {
      nombre: values.nombre,
      cargo: values.cargo,
      telefono: values.telefono,
      email: values.email,
      tipo,
      cumpleanos: values.cumpleanos ? values.cumpleanos.toISOString() : undefined,
      nota: values.nota,
      // usuarioDestacado: string,
      referenciaId: referenceId,

      clienteId: undefined,
      proveedorId: undefined,
      transporteId: undefined,
    };

    if (tipo === ContactTypeEnum.CLIENTE) {
      body.clienteId = referenceId;
    } else if (tipo === ContactTypeEnum.PROVEEDOR) {
      body.proveedorId = referenceId;
    } else if (tipo === ContactTypeEnum.TRANSPORTE) {
      body.transporteId = referenceId;
    }

    onSubmit(body);
  };

  return (
    <Card>
      <CardContent>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="nombre" rules={[{ required: true, message: 'El nombre es requerido' }]}>
            <InputAntd label="Nombre" />
          </Form.Item>

          <Form.Item name="cargo" rules={[{ required: true, message: 'El cargo es requerido' }]}>
            <InputAntd label="Cargo" />
          </Form.Item>

          <Form.Item name="telefono" rules={[{ required: true, message: 'El teléfono es requerido' }]}>
            <InputAntd label="Teléfono" />
          </Form.Item>

          <Form.Item name="email" rules={[{ required: true, message: 'El email es requerido' }]}>
            <InputAntd label="Email" />
          </Form.Item>

          <Form.Item name="cumpleanos">
            <DatePickerAntd label="Fecha de Cumpleaños" type="date" />
          </Form.Item>

          <Form.Item name="nota">
            <InputAntd label="Nota" type="textarea" />
          </Form.Item>

          <Stack direction="row" spacing={2} mt={4}>
            <Button fullWidth type="submit">
              GUARDAR
            </Button>
            <Button color="error" variant="outlined" fullWidth onClick={handleClose}>
              CANCELAR
            </Button>
          </Stack>
        </Form>
      </CardContent>
    </Card>
  );
};
