import { Row, Col, Select } from 'antd';

interface YearMonthSelectorProps {
    params: {
        year: number;
        mesInicio: number;
        mesFin: number;
    };
    setParams: (params: any) => void;
}

const meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
];

const YearMonthSelector = ({ params, setParams }: YearMonthSelectorProps) => {
    return (
        <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
                <div className="form-group">
                    <label>Año</label>
                    <Select
                        style={{ width: '100%' }}
                        value={params.year}
                        onChange={(year) => setParams({ ...params, year })}
                        options={Array.from({ length: 5 }, (_, i) => ({
                            value: new Date().getFullYear() - i,
                            label: String(new Date().getFullYear() - i),
                        }))}
                    />
                </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <div className="form-group">
                    <label>Mes Inicio</label>
                    <Select
                        style={{ width: '100%' }}
                        value={params.mesInicio}
                        onChange={(mesInicio) => setParams({ ...params, mesInicio })}
                        options={meses}
                    />
                </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <div className="form-group">
                    <label>Mes Fin</label>
                    <Select
                        style={{ width: '100%' }}
                        value={params.mesFin}
                        onChange={(mesFin) => setParams({ ...params, mesFin })}
                        options={meses}
                    />
                </div>
            </Col>
        </Row>
    );
};

export default YearMonthSelector;
