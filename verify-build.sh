#!/bin/bash

echo "🚀 Verificando configuración para despliegue..."

# Verificar que Node.js esté en la versión correcta
echo "📋 Verificando versión de Node.js..."
node --version

# Verificar que npm esté disponible
echo "📋 Verificando npm..."
npm --version

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Ejecutar linting
echo "🔍 Ejecutando linting..."
npm run lint

# Ejecutar build
echo "🏗️ Construyendo aplicación..."
npm run build

# Verificar que el build fue exitoso
if [ -d "dist" ]; then
    echo "✅ Build exitoso! La carpeta dist fue creada."
    echo "📁 Contenido de dist:"
    ls -la dist/
else
    echo "❌ Error: La carpeta dist no fue creada."
    exit 1
fi

echo "🎉 Verificación completa! El proyecto está listo para desplegar."
