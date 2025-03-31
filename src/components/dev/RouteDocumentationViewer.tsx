// src/components/dev/RouteDocumentationViewer.tsx
import React, { useState } from "react";
import { allRoutes } from "@/routes/config";
import { generateRoutesDocumentation } from "@/routes/utils/routeDocumentation";
import { RouteDocumentation } from "@/routes/types";

/**
 * Componente para visualizar la documentación de rutas
 * Solo visible en entorno de desarrollo
 */
const RouteDocumentationViewer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<RouteDocumentation | null>(null);

  // Generar documentación de rutas
  const routeDocs = generateRoutesDocumentation(allRoutes);

  // Filtrar rutas según el término de búsqueda
  const filteredRoutes = routeDocs.filter(
    (route) =>
      route.path.toLowerCase().includes(filter.toLowerCase()) ||
      route.title.toLowerCase().includes(filter.toLowerCase()) ||
      route.description.toLowerCase().includes(filter.toLowerCase())
  );

  // Solo mostrar en entorno de desarrollo
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden max-w-2xl">
        <div
          className="bg-multilimp-green text-white p-3 flex justify-between items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="font-medium">
            Documentación de Rutas {isExpanded ? "(Minimizar)" : "(Expandir)"}
          </h3>
          <span>{isExpanded ? "▼" : "▲"}</span>
        </div>

        {isExpanded && (
          <div className="p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar rutas..."
                className="w-full p-2 border border-gray-300 rounded"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2 border-r pr-2">
                <h4 className="font-medium mb-2">Rutas ({filteredRoutes.length})</h4>
                <div className="max-h-80 overflow-y-auto">
                  {filteredRoutes.map((route) => (
                    <div
                      key={route.path}
                      className={`p-2 mb-1 cursor-pointer rounded hover:bg-gray-100 ${
                        selectedRoute?.path === route.path ? "bg-gray-100" : ""
                      }`}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <div className="font-medium">{route.title}</div>
                      <div className="text-xs text-gray-500">{route.path}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-1/2">
                {selectedRoute ? (
                  <div>
                    <h4 className="font-medium mb-2">Detalles de la Ruta</h4>
                    <div className="bg-gray-50 p-3 rounded mb-2">
                      <div className="font-medium text-lg">{selectedRoute.title}</div>
                      <div className="text-sm font-mono mb-2">{selectedRoute.path}</div>
                      {selectedRoute.description && (
                        <p className="text-sm text-gray-600 mb-2">{selectedRoute.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-blue-50 p-2 rounded">
                        <span className="text-xs font-medium text-blue-700">Requiere Auth</span>
                        <div>{selectedRoute.requiresAuth ? "Sí" : "No"}</div>
                      </div>
                      
                      <div className="bg-purple-50 p-2 rounded">
                        <span className="text-xs font-medium text-purple-700">Permisos</span>
                        <div>
                          {selectedRoute.permissions && selectedRoute.permissions.length > 0
                            ? selectedRoute.permissions.join(", ")
                            : "Ninguno"}
                        </div>
                      </div>
                    </div>

                    {selectedRoute.params && selectedRoute.params.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium mb-1">Parámetros de Ruta</h5>
                        <div className="bg-gray-50 p-2 rounded">
                          {selectedRoute.params.map((param) => (
                            <div key={param.name} className="mb-1 text-sm">
                              <span className="font-mono text-blue-600">{param.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({param.required ? "requerido" : "opcional"})
                              </span>
                              <div className="text-xs text-gray-600">{param.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedRoute.roles && selectedRoute.roles.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium mb-1">Roles</h5>
                        <div className="flex flex-wrap gap-1">
                          {selectedRoute.roles.map((role) => (
                            <span
                              key={role}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Selecciona una ruta para ver sus detalles
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 border-t pt-2">
              <p>
                Esta documentación se genera automáticamente a partir de las definiciones de rutas.
                Solo visible en entorno de desarrollo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteDocumentationViewer;
