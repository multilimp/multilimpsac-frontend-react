# Configuración para Dokploy - MultiLimp React

## 🚀 Configuración Rápida

### 1. Variables de Entorno
En tu panel de Dokploy, configura estas variables:

```
VITE_APP_API_HOST_URL=https://multilimpsac.onrender.com/api
NODE_VERSION=22
```

### 2. Configuración de Build
- **Source**: GitHub Repository
- **Branch**: main (o tu rama principal)
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: 3000

### 3. Opciones de Despliegue

#### Opción A: Nixpacks (Automático)
Dokploy detectará automáticamente el proyecto React y usará la configuración de `nixpacks.toml`.

#### Opción B: Dockerfile
Si prefieres usar Docker, selecciona "Dockerfile" en la configuración.

## 📁 Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `nixpacks.toml` | Configuración para Nixpacks |
| `Dockerfile` | Multi-stage build optimizado |
| `Dockerfile.simple` | Dockerfile simplificado |
| `dokploy.json` | Configuración específica de Dokploy |
| `.nvmrc` | Especifica versión de Node.js |
| `package-lock.json` | Lockfile para npm |

## ✅ Estado de Configuración

- [x] Node.js 22 configurado
- [x] npm como gestor de paquetes
- [x] Build optimizado para producción
- [x] Servidor estático configurado
- [x] Variables de entorno documentadas
- [x] Dockerfiles listos
- [x] Scripts de verificación incluidos

## 🔧 Comandos de Verificación Local

### Windows (PowerShell):
```powershell
.\verify-build.ps1
```

### Linux/macOS:
```bash
chmod +x verify-build.sh
./verify-build.sh
```

### Manual:
```bash
npm ci
npm run build
npm start
```

## 🐛 Solución de Problemas

### Error: "nodejs-20_x no encontrado"
✅ **Resuelto**: Actualizado a Node.js 22

### Error: "yarn.lock desactualizado"
✅ **Resuelto**: Migrado a npm con package-lock.json

### Error: "react-router-dom incompatible"
✅ **Resuelto**: Node.js 22 es compatible

## 📞 Soporte

Si encuentras problemas:

1. Verifica que las variables de entorno estén configuradas
2. Ejecuta el script de verificación local
3. Revisa los logs de build en Dokploy
4. Asegúrate de usar Node.js 22

---

**Estado**: ✅ Listo para producción
**Última actualización**: 27 de mayo de 2025
