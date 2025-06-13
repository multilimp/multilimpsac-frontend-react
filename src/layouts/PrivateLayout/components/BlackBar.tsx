import SelectCompanies from '@/components/selects/SelectCompanies';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { BlackBarKeyEnum } from '@/types/global.enum';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { Dropdown } from 'antd';
import { Fragment, useState } from 'react';

const saleTypeOptions = [
  { label: 'Venta al Estado', value: 'directa' },
  { label: 'Venta Privada', value: 'privada' },
];

const BlackBar = () => {
  const { saleInputValues, setSaleInputValues, blackBarKey } = useGlobalInformation();
  const [openDD, setOpenDD] = useState(false);
  const [tempFile, setTempFile] = useState<File>();

  const handleClear = () => {
    setOpenDD(false);
    setTempFile(undefined);
  };

  const components = {
    [BlackBarKeyEnum.OC]: (
      <Stack direction="column" spacing={3}>
        <Box
          sx={{
            '& .ant-select-single .ant-select-selector': {
              backgroundColor: '#4F46E5 !important',
              borderColor: '#4F46E5 !important',
              color: '#ffffff !important',
              borderRadius: '8px !important',
              height: '50px !important',
              display: 'flex !important',
              alignItems: 'center !important',
              minHeight: '50px !important',
            },
            '& .ant-select-arrow': {
              color: '#ffffff !important',
            },
            '& .float-label label': {
              display: 'none !important', // Oculta el label flotante
            },
          }}
        >
          <SelectCompanies
            label="Selecciona una empresa"
            value={saleInputValues.enterprise?.id}
            onChange={(_, option: any) => setSaleInputValues({ ...saleInputValues, enterprise: option?.optiondata })}
          />
        </Box>

        <Box
          sx={{
            '& .ant-select-single .ant-select-selector': {
              backgroundColor: 'transparent !important',
              borderColor: '#4F46E5 !important',
              color: '#ffffff !important',
              borderRadius: '8px !important',
              height: '50px !important',
              display: 'flex !important',
              alignItems: 'center !important',
              minHeight: '50px !important',
            },
            '& .ant-select-selection-placeholder': {
              color: '#ffffff !important',
              opacity: 0.8,
              lineHeight: '46px !important',
            },
            '& .ant-select-selection-item': {
              color: '#ffffff !important',
              lineHeight: '46px !important',
            },
            '& .ant-select-arrow': {
              color: '#ffffff !important',
            },
            '& .float-label label': {
              display: 'none !important', // Oculta el label flotante
            },
          }}
        >
          <SelectGeneric
            label="Tipo de venta"
            options={saleTypeOptions}
            value={saleInputValues.tipoVenta}
            onChange={(tipoVenta) => setSaleInputValues({ ...saleInputValues, tipoVenta })}
          />
        </Box>

        <Divider />

        <Dropdown
          placement="bottom"
          trigger={['click']}
          open={openDD}
          dropdownRender={() => (
            <Stack direction="column" spacing={2} bgcolor="#fff" p={2} borderRadius={2} boxShadow="0 5px 50px -5px rgba(0,0,0,0.75);" width={250}>
              <Typography textAlign="center" color="textSecondary" fontWeight={600}>
                ¿Desear cargar este archivo para ser analizado?
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button onClick={handleClear} color="error" variant="outlined" size="small" fullWidth>
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setSaleInputValues({ ...saleInputValues, file: tempFile! });
                    handleClear();
                  }}
                  size="small"
                  fullWidth
                  color="secondary"
                >
                  Confirmar
                </Button>
              </Stack>
            </Stack>
          )}
        >
          <Button
            sx={{ border: '2px solid #9932CC', color: '#9932CC', borderRadius: 0.75, position: 'relative' }}
            color="secondary"
            variant="outlined"
          >
            <img src="/images/book_ai.png" alt="book ai icon" width={28} />
            <input
              type="file"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
              onChange={(event) => {
                setTempFile(event.target.files?.[0]);
                setOpenDD(true);
              }}
              accept="application/pdf"
            />
            {saleInputValues.file?.name ?? 'Cargar PDF'}
          </Button>
        </Dropdown>
      </Stack>
    ),
    [BlackBarKeyEnum.OP]: (
      <Stack direction="column" spacing={3}>
        AQUÍ IRÁ EL CONTENIDO PARA OP
      </Stack>
    ),
  };

  return (
    <Fragment>
      {blackBarKey ? (
        <Box 
          width={300} 
          bgcolor="#111827" 
          color="#ffffff" 
          px={2} 
          py={3} 
        >
          {components[blackBarKey]}
        </Box>
      ) : null}
    </Fragment>
  );
};

export default BlackBar;
