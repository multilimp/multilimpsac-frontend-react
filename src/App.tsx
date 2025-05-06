import ThemeConfig from '@/styles/theme';
import GlobalStyles from '@/styles/theme/GlobalStyles';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import es from 'antd/lib/locale/es_ES';
import AppContextProvider from './context';
import ConfigRoutes from './router';

const App = () => {
  return (
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
  );
};

export default App;
