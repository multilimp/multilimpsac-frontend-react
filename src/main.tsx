import { createRoot } from 'react-dom/client';
import { App as AntApp } from 'antd';
import App from './App';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '@ant-design/v5-patch-for-react-19';
import '@/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <AntApp>
    <App />
  </AntApp>
);
