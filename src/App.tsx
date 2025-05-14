import ThemeConfig from '@/styles/theme';
import GlobalStyles from '@/styles/theme/GlobalStyles';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import es from 'antd/lib/locale/es_ES';
import AppContextProvider from './context';
import ConfigRoutes from './router';
import GlobalInformationProvider from './context/GlobalInformationProvider';

const App = () => {
  return (
    <ConfigProvider locale={es}>
      <ThemeConfig>
        <GlobalStyles />
        <BrowserRouter>
          <AppContextProvider>
            <GlobalInformationProvider>
              <ConfigRoutes />
            </GlobalInformationProvider>
          </AppContextProvider>
        </BrowserRouter>
      </ThemeConfig>
    </ConfigProvider>
  );
};

export default App;
