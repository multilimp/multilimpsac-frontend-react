import { Route, Routes } from 'react-router-dom';
import routes from './config';
import Page401 from '@/pages/errors/Page401';
import React from 'react';
import { useAppContext } from '@/context';

const ConfigRoutes = () => {
  const { user } = useAppContext();

  const filteredRoutes = routes.filter((item) => item.isPrivate === Boolean(user.id));

  return (
    <Routes>
      {filteredRoutes.map((routeList) => {
        const { path, element: Component, children, isPrivate } = routeList;
        return (
          <React.Fragment key={path}>
            {isPrivate ? (
              <Route path={path} element={<Component />}>
                {children.map((el) => {
                  const { path: ruta, element: Element, roles } = el;
                  let flag = false;
                  if (roles.includes(user.role)) flag = true;
                  return <Route path={ruta} element={flag ? <Element /> : <Page401 />} key={ruta} />;
                })}
              </Route>
            ) : (
              <Route path={path} element={<Component />}>
                {children?.map((el) => {
                  const { path: ruta, element: Element } = el;
                  return <Route path={ruta} element={<Element />} key={ruta} />;
                })}
              </Route>
            )}
          </React.Fragment>
        );
      })}
    </Routes>
  );
};

export default ConfigRoutes;
