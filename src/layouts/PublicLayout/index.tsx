import { Outlet } from 'react-router-dom';
import { MainStyled } from '@/styles/styled';

const PublicLayout = () => {
  return (
    <MainStyled>
      <Outlet />
    </MainStyled>
  );
};

export default PublicLayout;
