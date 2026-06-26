@echo off
echo ============================================
echo   NutriLink - Deploy a Vercel
echo ============================================
echo.

cd /d "%~dp0"

echo [1/4] Agregando cambios...
git add -A

echo [2/4] Haciendo commit...
git commit -m "fix: use anon client + Postgres RPCs, remove SUPABASE_SERVICE_ROLE_KEY dependency, seed 12 products"

echo [3/4] Subiendo a GitHub...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo [!] Error al hacer push. Autenticando con GitHub CLI...
    gh auth login --web
    git push origin main
)

echo.
echo [4/4] Vercel detectara el cambio y hara deploy automaticamente.
echo       URL: https://nutrilink-app-psi.vercel.app
echo.
echo Listo! Presiona cualquier tecla para cerrar...
pause > nul
