import { Fragment, useState, useEffect } from 'react';
import { Form, FormInstance, notification, Row, Col, Typography, Button } from 'antd';
import { PrinterOutlined, UserOutlined, PhoneOutlined, FileTextOutlined } from '@ant-design/icons';
import { StepItemContentAntd } from './StepItemContentAntd';
import SelectCompanies from '@/components/selects/SelectCompanies';
import DatePickerAntd from '@/components/DatePickerAnt';
import ClientSelectorModal from '../../Clients/components/ClientSelectorModal';
import SelectContactsByClient from '@/components/selects/SelectContactsByClient';
import { ClientProps } from '@/services/clients/clients';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

export const requiredField = { required: true, message: 'Campo requerido' };

const QuotesFormFirstStep = ({ form, isEditing, quoteId }: { form: FormInstance; isEditing: boolean; quoteId?: string }) => {
  const [openClients, setOpenClients] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      form.setFieldsValue({
        estado: 'COTIZADO'
      });
    }
  }, [isEditing, form]);

  const updateFechaActualizacion = () => {
    form.setFieldValue('fechaActualizacion', new Date());
  };

  const printQuote = async () => {
    if (!quoteId) {
      notification.error({
        message: 'Error',
        description: 'No se puede imprimir: ID de cotización no disponible',
      });
      return;
    }

    try {
      const { printCotizacion } = await import('../../../../services/print/print.requests');
      await printCotizacion(Number(quoteId));
    } catch (error) {
      notification.error({
        message: 'Error de impresión',
        description: 'No se pudo generar la cotización para impresión',
      });
    }
  };

  const renderFooterContent = () => (
    <Form.Item noStyle shouldUpdate>
      {({ getFieldValue }) => {
        const cliente: ClientProps | null = getFieldValue('cliente');
        const contactName = getFieldValue('nombreContacto') || '';
        const contactCargo = getFieldValue('cargoContacto') || '';
        const contactPhone = getFieldValue('celularContacto') || '';
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
              width: '100%',
              margin: '-4px'
            }}
          >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserOutlined style={{ color: '#bfc6d1', fontSize: '28px' }} />
              <Text strong style={{ color: '#e5e7eb', fontSize: '14px' }}>
                {contactCargo || '—'}
              </Text>
              <Text style={{ color: '#e5e7eb', fontSize: '14px', marginLeft: '4px' }}>
                {contactName || ''}
              </Text>
              <PhoneOutlined style={{ color: '#bfc6d1', fontSize: '24px', marginLeft: '8px' }} />
              <Text style={{ color: '#e5e7eb', fontSize: '14px' }}>
                {contactPhone || '—'}
              </Text>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Form.Item name="contactoCliente" noStyle>
                <SelectContactsByClient
                  placeholder="Contacto"
                  clientId={cliente?.id}
                  size="large"
                  onChange={(value, record: unknown) => {
                    const recordData = record as { optiondata?: { nombre: string; telefono: string; cargo: string } };
                    form.setFieldsValue({
                      contactoCliente: value,
                      nombreContacto: recordData?.optiondata?.nombre ?? '',
                      celularContacto: recordData?.optiondata?.telefono ?? '',
                      cargoContacto: recordData?.optiondata?.cargo ?? '',
                      contactoClienteComplete: recordData?.optiondata ?? null,
                    });
                    updateFechaActualizacion();
                  }}
                  style={{ backgroundColor: 'inherit', width: '200px' }}
                />
              </Form.Item>
            </div>
          </div>
        );
      }}
    </Form.Item>
  );

  return (
    <StepItemContentAntd
      showHeader
      showFooter
      ResumeIcon={FileTextOutlined}
      onClickSearch={() => setOpenClients(true)}
      resumeContent={
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => {
            const cliente: ClientProps | null = getFieldValue('cliente');
            return (
              <Fragment>
                <Title level={3} style={{ color: '#ffffff', margin: 0 }}>
                  {`${getFieldValue('codigoCotizacion')}`}
                </Title>
                <Text style={{ color: '#ffffff', opacity: 0.8, fontSize: '0.875rem', display: 'block' }}>
                  {cliente
                    ? `${cliente.razonSocial ?? 'Cliente seleccionado'}`
                    : 'Cliente no seleccionado'}
                </Text>
                {cliente && (
                  <Text style={{ color: '#ffffff', opacity: 0.7, fontSize: '0.85rem', display: 'block' }}>
                    RUC: {cliente.ruc ?? '—'}
                  </Text>
                )}
              </Fragment>
            );
          }}
        </Form.Item>
      }
      footerContent={renderFooterContent()}
      resumeButtons={
        <div style={{ display: 'flex', gap: '16px' }}>
          {isEditing && (
            <Button
              icon={<PrinterOutlined style={{ fontSize: '20px' }} />}
              type="default"
              ghost
              style={{
                borderColor: '#04BA6B',
                color: '#04BA6B',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
              onClick={() => {
                printQuote();
              }}
            />
          )}
        </div>
      }
    >
      <Form.Item name="cliente" noStyle />
      <Title level={5} style={{ margin: '8px 0 16px 0' }}>
        Empresa y fecha de cotización
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item name="empresa" rules={[requiredField]}>
            <SelectCompanies
              label="Empresa"
              onChange={updateFechaActualizacion}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="fechaCotizacion" rules={[requiredField]} initialValue={dayjs()}>
            <DatePickerAntd
              label="Fecha de Cotización"
              onChange={updateFechaActualizacion}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="fechaEntrega">
            <DatePickerAntd
              label="Fecha de Entrega"
              onChange={updateFechaActualizacion}
            />
          </Form.Item>
        </Col>
      </Row>

      {openClients ? (
        <ClientSelectorModal
          onClose={() => setOpenClients(false)}
          onSelected={(data) => form.setFieldValue('cliente', data)}
        />
      ) : null}
    </StepItemContentAntd>
  );
};

export default QuotesFormFirstStep;
