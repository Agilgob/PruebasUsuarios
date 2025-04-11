#!/bin/bash

export $(cat .env | xargs)
log_file="tmp/test.log" 

echo "▶️ Ejecutando pruebas de Playwright en segundo plano"
spec=playwright/tests/Penal.spec.js
cantImputados=$CANT_IMPUTADOS cantVictimas=$CANT_VICTIMAS ciudadano=ciudadanoJoseC2 npx playwright test $spec

if [ $? -eq 0 ]; then
echo "✅ $spec terminado correctamente " >> "$log_file"
else
echo "❌ $spec falló " >> "$log_file"
fi

