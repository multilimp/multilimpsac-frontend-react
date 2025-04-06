
// src/components/dev/RouteDocumentationViewer.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { allRoutes } from "@/app/routes/config";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RouteDefinition } from "@/app/routes/types";

interface RouteDocumentationProps {
  routes?: RouteDefinition[];
}

const RouteDocumentationViewer: React.FC<RouteDocumentationProps> = ({ routes = allRoutes }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentación de Rutas</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {routes.map((route, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <div className="flex items-start">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded mr-2">
                    {route.path}
                  </span>
                  <span>{route.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-4">
                  <div>
                    <span className="font-semibold">Título:</span> {route.title}
                  </div>
                  {route.requireAuth && (
                    <div>
                      <span className="font-semibold">Requiere autenticación:</span> Sí
                    </div>
                  )}
                  {route.permission && (
                    <div>
                      <span className="font-semibold">Permiso requerido:</span> {route.permission}
                    </div>
                  )}
                  {route.roles && route.roles.length > 0 && (
                    <div>
                      <span className="font-semibold">Roles permitidos:</span>{" "}
                      {route.roles.join(", ")}
                    </div>
                  )}
                  {route.domain && (
                    <div>
                      <span className="font-semibold">Dominio:</span> {route.domain}
                    </div>
                  )}
                  {route.entityType && (
                    <div>
                      <span className="font-semibold">Tipo de entidad:</span> {route.entityType}
                    </div>
                  )}
                  {route.action && (
                    <div>
                      <span className="font-semibold">Acción:</span> {route.action}
                    </div>
                  )}
                  {route.children && route.children.length > 0 && (
                    <div className="mt-4">
                      <div className="font-semibold mb-2">Rutas hijas:</div>
                      <RouteDocumentationViewer routes={route.children} />
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default RouteDocumentationViewer;
