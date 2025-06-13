#!/bin/bash

set -e

# Ir al directorio raíz del proyecto
cd "$(dirname "$0")/.."

# Establecer REPORT_FILENAME como "REPORT.zip" si no está definido
export REPORT_FILENAME=${REPORT_FILENAME:-REPORT.zip}
zip -r "$REPORT_FILENAME" tmp

node entrypoint/sendReport.js 
