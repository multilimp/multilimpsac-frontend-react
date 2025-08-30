import React, { useState, useEffect } from 'react';
import { Select, notification } from 'antd';
import { getAlmacenes } from '@/services/almacen/almacen.requests';
import { Almacen } from '@/types/almacen.types';

interface SelectAlmacenesProps {
    label?: string;
    placeholder?: string;
    value?: number;
    onChange?: (value: number, record?: any) => void;
    size?: 'small' | 'middle' | 'large';
    style?: React.CSSProperties;
    disabled?: boolean;
}

const SelectAlmacenes: React.FC<SelectAlmacenesProps> = ({
    label,
    placeholder = "Selecciona un almacén",
    value,
    onChange,
    size = 'middle',
    style,
    disabled = false,
}) => {
    const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadAlmacenes();
    }, []);

    const loadAlmacenes = async () => {
        try {
            setLoading(true);
            const data = await getAlmacenes();
            setAlmacenes(data);
        } catch (error) {
            console.error('Error al cargar almacenes:', error);
            notification.error({
                message: 'Error',
                description: 'No se pudieron cargar los almacenes',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (selectedValue: number) => {
        const selectedAlmacen = almacenes.find(almacen => almacen.id === selectedValue);
        if (onChange) {
            onChange(selectedValue, {
                optiondata: selectedAlmacen,
                ...selectedAlmacen
            });
        }
    };

    return (
        <div>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: 4,
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#333'
                }}>
                    {label}
                </label>
            )}
            <Select
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                loading={loading}
                size={size}
                style={{ width: '100%', ...style }}
                disabled={disabled}
                showSearch
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={almacenes.map(almacen => ({
                    value: almacen.id,
                    label: almacen.nombre,
                    key: almacen.id
                }))}
                notFoundContent={loading ? 'Cargando...' : 'No hay almacenes disponibles'}
            />
        </div>
    );
};

export default SelectAlmacenes;
