import { UserProps } from '@/services/users/user';
import { RolesEnum } from '@/types/global.enum';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react';

interface ContextProps {
  user: UserProps;
  setUser: Dispatch<SetStateAction<UserProps>>;
}

const AppContext = createContext({} as ContextProps);

export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps>({
    id: 1,
    name: 'ALDO',
    rol: RolesEnum.ADMIN,
  });

  const values = useMemo(() => ({ user, setUser }), [user]);

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
