# Guía de Despliegue - MultiLimp React

## Configuración para Dokploy

### Variables de Entorno Requeridas

En Dokploy, configura las siguientes variables de entorno:

```
VITE_APP_API_HOST_URL=https://multilimpsac.onrender.com/api
NODE_VERSION=22
```

### Opciones de Despliegue

#### Opción 1: Usando Nixpacks (Recomendado)
El proyecto incluye un archivo `nixpacks.toml` configurado para usar Node.js 22 y npm.

#### Opción 2: Usando Dockerfile
Si Nixpacks presenta problemas, puedes usar el Dockerfile incluido:

1. En la configuración de Dokploy, selecciona "Dockerfile"
2. El Dockerfile está optimizado para producción con multi-stage build

### Comandos de Build
- **Install**: `npm ci`
- **Build**: `npm run build`
- **Start**: `npm start`

### Puerto
La aplicación se ejecuta en el puerto 3000.

### Cambios Realizados para Resolver Errores

#### ✅ Problema de Node.js resuelto
- Actualizado a Node.js 22 (compatible con react-router-dom@7.5.3)
- Configurado `.nvmrc` con versión 22
- Actualizado `nixpacks.toml` con NODE_VERSION=22

#### ✅ Problema de yarn.lock resuelto
- Migrado de Yarn a npm para mejor compatibilidad
- Regenerado package-lock.json
- Eliminado yarn.lock para evitar conflictos
- Configurado comandos de npm en dokploy.json

#### ✅ Configuración optimizada
- Dockerfile con multi-stage build para Node.js 22
- Scripts de npm configurados correctamente
- Variables de entorno para Vite configuradas

### Resolución de Problemas

#### Error: nodejs-20_x no encontrado
- ✅ **Resuelto**: Actualizado a Node.js 22

#### Error: Versión de Node.js incompatible
- ✅ **Resuelto**: NODE_VERSION=22 configurado correctamente

#### Error: yarn.lock desactualizado
- ✅ **Resuelto**: Migrado a npm con package-lock.json

#### Error: react-router-dom incompatible
- ✅ **Resuelto**: Node.js 22 es compatible con todas las dependencias

### Verificación de Build Local
El proyecto se puede construir correctamente con:
```bash
npm install
npm run build
```

El build genera archivos optimizados en la carpeta `dist/` listos para producción.
