#!/bin/bash

# Ir al directorio raíz del proyecto
cd "$(dirname "$0")/.."

cantImputados=$CANT_IMPUTADOS 
cantVictimas=$CANT_VICTIMAS 


npx playwright test playwright/tests/Penal.spec.js 

if [ $? -eq 0 ]; then
    echo "✅ $spec terminado correctamente " >> "$LOG_FILE"
else
    echo "❌ $spec falló " >> "$LOG_FILE"
fi

