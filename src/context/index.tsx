
import LoaderPage from '@/pages/public/LoaderPage';
import StorageService from '@/services/storageService';
import { UserProps } from '@/services/users/user';
import { validateSession } from '@/services/users/user.requests';
import { STORAGE_KEY } from '@/utils/constants';
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useState, useContext } from 'react';

interface ContextProps {
  user: UserProps;
  setUser: Dispatch<SetStateAction<UserProps>>;
}

export const AppContext = createContext({} as ContextProps);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps>({} as UserProps);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleValidateUser();
  }, []);

  const handleValidateUser = async () => {
    try {
      setLoading(true);
      const token = StorageService.get(STORAGE_KEY);
      if (!token) return;
      const res = await validateSession();
      setUser({ ...res });
    } catch (error) {
      console.error('Error validating user session:', error);
      StorageService.delete(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  };

  const values = useMemo(() => ({ user, setUser }), [user]);

  return <AppContext.Provider value={values}>{loading ? <LoaderPage /> : children}</AppContext.Provider>;
};

export default AppContextProvider;
