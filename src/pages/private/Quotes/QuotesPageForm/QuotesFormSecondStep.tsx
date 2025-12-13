import { Form, FormInstance, Input, Row, Col, Typography } from 'antd';
import { StepItemContentAntd } from './StepItemContentAntd';
import InputAntd from '@/components/InputAntd';

const { TextArea } = Input;
const { Title } = Typography;

const QuotesFormSecondStep = ({ form }: { form: FormInstance }) => {
  return (
    <StepItemContentAntd>
      <Title level={5} style={{ margin: '8px 0 16px 0' }}>
        Lugar de entrega
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item name="direccionEntrega">
            <InputAntd placeholder="Dirección de entrega" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="departamentoEntrega">
            <InputAntd placeholder="Departamento" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="provinciaEntrega">
            <InputAntd placeholder="Provincia" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="distritoEntrega">
            <InputAntd placeholder="Distrito" />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="referenciaEntrega">
            <TextArea
              placeholder="Referencia de entrega (opcional)"
              rows={3}
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Col>
      </Row>
    </StepItemContentAntd>
  );
};

export default QuotesFormSecondStep;
