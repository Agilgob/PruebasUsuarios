#!/bin/bash

set -e

# Ir al directorio raíz del proyecto
cd "$(dirname "$0")/.."

# Establecer REPORT_FILENAME como "REPORT.zip" si no está definido
REPORT_FILENAME=${REPORT_FILENAME:-REPORT.zip}
zip -r "$REPORT_FILENAME" tmp
curl -F "file=@$REPORT_FILENAME" \
    -F "initial_comment=$(cat tmp/test.log)" \
    -F "channels=$SLACK_CHANNEL" \
    -H "Authorization: Bearer $SLACK_TOKEN" \
    https://slack.com/api/files.upload
