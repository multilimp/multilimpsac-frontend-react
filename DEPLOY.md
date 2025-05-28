# Guía de Despliegue - MultiLimp React

## Configuración para Dokploy

### Variables de Entorno Requeridas

En Dokploy, configura las siguientes variables de entorno:

```
VITE_APP_API_HOST_URL=https://multilimpsac.onrender.com/api
NODE_VERSION=20
```

### Opciones de Despliegue

#### Opción 1: Usando Nixpacks (Recomendado)
El proyecto incluye un archivo `nixpacks.toml` configurado para usar Node.js 20 y Yarn.

#### Opción 2: Usando Dockerfile
Si Nixpacks presenta problemas, puedes usar el Dockerfile incluido:

1. En la configuración de Dokploy, selecciona "Dockerfile"
2. El Dockerfile está optimizado para producción con multi-stage build

### Comandos de Build
- **Install**: `yarn install --frozen-lockfile`
- **Build**: `yarn build`
- **Start**: `yarn start`

### Puerto
La aplicación se ejecuta en el puerto 3000.

### Resolución de Problemas

#### Error: nodejs-20_x no encontrado
- Asegúrate de que el archivo `nixpacks.toml` esté actualizado
- Usa la configuración simplificada proporcionada

#### Error: Versión de Node.js incompatible
- Verifica que NODE_VERSION=20 esté configurado
- El archivo `.nvmrc` especifica la versión 20

#### Error: react-router-dom incompatible
- Este error se resuelve automáticamente con Node.js 20
- Las dependencias están configuradas correctamente para esta versión
