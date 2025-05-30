# Script de verificación para Windows PowerShell

Write-Host "🚀 Verificando configuración para despliegue..." -ForegroundColor Green

# Verificar que Node.js esté en la versión correcta
Write-Host "📋 Verificando versión de Node.js..." -ForegroundColor Yellow
node --version

# Verificar que npm esté disponible
Write-Host "📋 Verificando npm..." -ForegroundColor Yellow
npm --version

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm ci

# Ejecutar linting
Write-Host "🔍 Ejecutando linting..." -ForegroundColor Yellow
npm run lint

# Ejecutar build
Write-Host "🏗️ Construyendo aplicación..." -ForegroundColor Yellow
npm run build

# Verificar que el build fue exitoso
if (Test-Path "dist") {
    Write-Host "✅ Build exitoso! La carpeta dist fue creada." -ForegroundColor Green
    Write-Host "📁 Contenido de dist:" -ForegroundColor Cyan
    Get-ChildItem dist/
} else {
    Write-Host "❌ Error: La carpeta dist no fue creada." -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Verificación completa! El proyecto está listo para desplegar." -ForegroundColor Green
