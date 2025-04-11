#!/bin/bash

export $(cat .env | xargs)

echo "▶️ Ejecutando pruebas de Playwright en segundo plano"
spec=playwright/tests/Penal.spec.js
cantInputados=$CANT_IMPUTADOS cantVictimas=$CANT_VICTIMAS ciudadano=ciudadanoJoseC2 npx playwright test $spec

if [ $exit_code -eq 0 ]; then
echo "✅ $spec terminado correctamente " >> "$log_file"
else
echo "❌ $spec falló " >> "$log_file"
fi