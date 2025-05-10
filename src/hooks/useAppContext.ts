import { useContext } from 'react';
import { AppContext } from '../context'; // Ajusta la ruta si es necesario, apuntando a donde se exporta AppContext

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
