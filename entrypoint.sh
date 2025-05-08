#!/bin/bash
set -e

./entrypoint/runCypress.sh 
./entrypoint/runPlaywright.sh 




cd "$(dirname "$0")"

# Cargar entorno si existe
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Leer plan de ejecución
IFS=',' read -ra PLAN <<< "$EXECUTION_PLAN"

for tipo in "${PLAN[@]}"; do
  SCRIPT="./sessions/${tipo}.sh"
  if [ -x "$SCRIPT" ]; then
    echo "▶️ Ejecutando sesión: $tipo"
    "$SCRIPT"
  else
    echo "⚠️ Script no encontrado o no ejecutable: $SCRIPT"
  fi
done

# Envia el reporte de pruebas a slack
./entrypoint/runSenderReports.sh 