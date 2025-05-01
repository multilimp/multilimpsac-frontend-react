import { useTheme } from '@mui/material/styles';
import { GlobalStyles as GlobalThemeStyles } from '@mui/material';

export default function GlobalStyles() {
  const theme = useTheme();

  return (
    <GlobalThemeStyles
      styles={{
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          width: '100%',
          height: '100%',
          '--MainNav-height': '56px',
          '--MainNav-zIndex': 999,
          '--SideNav-width': '280px',
          '--SideNav-zIndex': 999,
          '--MobileNav-width': '320px',
          '--MobileNav-zIndex': 999,
        },
        '#root': {
          width: '100%',
          height: '100%',
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        textarea: {
          '&::-webkit-input-placeholder': {
            color: theme.palette.text.disabled,
          },
          '&::-moz-placeholder': {
            opacity: 1,
            color: theme.palette.text.disabled,
          },
          '&:-ms-input-placeholder': {
            color: theme.palette.text.disabled,
          },
          '&::placeholder': {
            color: theme.palette.text.disabled,
          },
        },

        img: { display: 'block', maxWidth: '100%' },

        // Lazy Load Img
        '.blur-up': {
          WebkitFilter: 'blur(5px)',
          filter: 'blur(5px)',
          transition: 'filter 400ms, -webkit-filter 400ms',
        },
        '.blur-up.lazyloaded ': {
          WebkitFilter: 'blur(0)',
          filter: 'blur(0)',
        },
        '.ant-notification-notice-with-icon svg': {
          fill: '#fff',
        },
        // SELECT
        '.ant-select-item-option-active': {
          backgroundColor: '#e6f7ff !important',
        },
        '.ant-select-item-option-selected': {
          backgroundColor: '#d3d3d3 !important',
        },
        '.ant-select-dropdown': {
          borderRadius: '10px',
        },
        '.ant-select-selector': {
          borderRadius: '6px !important',
        },
        '.ant-table-cell': {
          overflowWrap: 'break-word',
          padding: '20px',
        },
        '.ant-table-cell-row-hover': {
          backgroundColor: '#d3d3d3 !important',
        },
        '.ant-notification-notice-success': {
          backgroundColor: '#52c41a !important',
          borderRadius: '5px !important',
        },
        '.ant-notification-notice-info': {
          backgroundColor: '#1890ff !important',
          borderRadius: '5px !important',
        },
        '.ant-notification-notice-error': {
          backgroundColor: '#ff4d4f !important',
          borderRadius: '5px !important',
        },
        '.ant-notification-notice-warning': {
          backgroundColor: '#faad15 !important',
          borderRadius: '5px !important',
        },
        '.ant-notification-notice-message': {
          color: '#fff !important',
          fontWeight: 600,
        },
        '.ant-notification-notice-description': {
          color: '#eee',
        },
        '.MuiModal-root': {
          zIndex: '999 !important',
        },
        'table tr th': {
          background: `${theme.palette.primary.main} !important`,
          color: 'white !important',
          border: '1px solid rgba(200, 200, 200, 0.5)',
          padding: '10px',
        },
        '.input-select-form .ant-select-single .ant-select-selector, .input-form input': {
          borderRadius: '6px !important',
          borderColor: '#aaa !important',
          fontSize: '16px',
          lineHeight: '24px',
        },
        '.input-select-form.large .ant-select-single .ant-select-selector, .input-form.large input': {
          height: '50px !important',
        },
        '.input-select-form.small .ant-select-single .ant-select-selector, .input-form.small input': {
          height: ' 40px !important',
        },
        '.input-select-form.ant-form-item-has-error': {
          borderColor: `${theme.palette.error.main} !important`,
        },
        '.input-select-form.large .ant-select-single.ant-select-show-arrow .ant-select-selection-item, .input-select-form.large .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder':
          {
            lineHeight: '55px !important',
          },

        '.input-select-form.small .ant-select-single.ant-select-show-arrow .ant-select-selection-item, .input-select-form.small .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder':
          {
            lineHeight: '40px !important',
          },
        '.input-select-form.large .ant-select-single.ant-select-show-arrow .ant-select-selection-search-input': {
          lineHeight: '55px !important',
          height: '55px !important',
        },
        '.input-select-form.small .ant-select-single.ant-select-show-arrow .ant-select-selection-search-input': {
          lineHeight: '40px !important',
          height: '40px !important',
        },
        '.input-select-form .anticon-loading': {
          color: theme.palette.primary.main,
        },
        '.input-form .ant-input-group-addon': {
          borderTopLeftRadius: '6px',
          borderBottomLeftRadius: '6px',
          borderColor: '#212b3690 !important',
        },
        '.input-form .ant-input-group input': {
          borderTopLeftRadius: '0px !important',
          borderBottomLeftRadius: '0px !important',
        },
        '.input-form input.ant-input-status-error': {
          borderColor: `${theme.palette.error.main} !important`,
        },
        '.float-label': {
          position: 'relative',
        },
        '.float-label .label': {
          fontSize: '14px !important',
          fontWeight: '400',
          position: 'absolute',
          pointerEvents: 'none',
          left: '12px',
          top: '14px',
          transition: '0.2s ease all',
          color: '#272a2c',
          zIndex: '20',
          maxWidth: 'calc((100%) - 22px)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        '.float-label .label.error': {
          color: `${theme.palette.error.main} !important`,
        },
        '.float-label .label-float': {
          fontWeight: '400',
          top: '-8px !important',
          fontSize: '12px !important',
          color: '#272a2c !important',
          backgroundColor: 'white',
          padding: '0 4px',
          zIndex: '20',
        },
        '.float-label .label-float.focus': {
          color: `${theme.palette.primary.main} !important`,
        },
        '.float-label .label-float.disabled': {
          color: '#aaa !important',
          height: '10px',
        },
        '.float-label .label-float.error': {
          color: `${theme.palette.error.main} !important`,
        },
        '.ant-form-item-has-error .float-label .label-float': {
          color: `${theme.palette.error.main} !important`,
        },
        '.MuiTableRow-root': {
          '&:hover': {
            backgroundColor: '#e6f7ff !important',
          },
        },
        '.calendar_table_header': {
          padding: '10px 0 !important',
          a: {
            color: '#ffffff',
          },
        },
        '.m-0': {
          margin: '0 !important',
        },
      }}
    />
  );
}
