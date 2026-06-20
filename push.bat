@echo off
setlocal enableextensions
cd /d "%~dp0"

set "REPO=https://github.com/gideoenfullard/BREIN-GYM.git"
set "BRANCH=main"

echo.
echo ============================================
echo   BREIN GYM  -  stuur na GitHub
echo ============================================
echo   Vouer: %cd%
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo [FOUT] Git is nie geinstalleer nie.
  echo Laai dit af by: https://git-scm.com/download/win
  echo.
  pause
  exit /b 1
)

if not exist ".git" (
  echo Stel git-repo op vir die eerste keer...
  git init >nul
)

git remote remove origin >nul 2>nul
git remote add origin "%REPO%"
git branch -M %BRANCH%

echo Voeg lere by...
git add -A
git commit -m "Deploy %date% %time%" >nul 2>nul

echo Stuur na GitHub...
echo (Eerste keer kan 'n GitHub-aanmeld-venster oopmaak - meld net aan.)
echo.
git push -u origin %BRANCH% --force
if errorlevel 1 (
  echo.
  echo [FOUT] Die stuur het misluk. Het jy aangemeld? Is jy aanlyn?
  echo.
  pause
  exit /b 1
)

echo.
echo ============================================
echo   KLAAR! Kyk oor ~1 minuut by:
echo   https://gideoenfullard.github.io/BREIN-GYM/
echo ============================================
echo.
pause