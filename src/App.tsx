import ThemeConfig from '@/styles/theme';
import GlobalStyles from '@/styles/theme/GlobalStyles';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ConfigProvider } from 'antd';
import es from 'antd/lib/locale/es_ES';
import AppContextProvider from './context';
import ConfigRoutes from './router';

const App = () => {
  return (
    <HelmetProvider>
      <ConfigProvider locale={es}>
        <ThemeConfig>
          <GlobalStyles />
          <BrowserRouter>
            <AppContextProvider>
              <ConfigRoutes />
            </AppContextProvider>
          </BrowserRouter>
        </ThemeConfig>
      </ConfigProvider>
    </HelmetProvider>
  );
};

export default App;
