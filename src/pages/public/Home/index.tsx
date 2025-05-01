import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const router = useNavigate();

  useEffect(() => {
    router('/login');
  }, []);

  return <div>CARGANDO...</div>;
};

export default Home;
