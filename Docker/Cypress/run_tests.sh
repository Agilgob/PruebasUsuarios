#!/bin/bash


# Este script se ejecuta desde adentro del contendor que se levanta 



ENV_VARS=("FUNCIONARIO" "CIUDADANO" "TRAMITE" "TEST_DATA")

echo "FUNCIONARIO : $FUNCIONARIO"
echo "CIUDADANO : $CIUDADANO"
echo "TRAMITE : $TRAMITE"
echo "JSON_FILE : $JSON_FILE"


# Verificar si la variable de entorno folder_name está definida
if [ -z "$SPEC" ]; then
  echo "Error: La variable de entorno 'SPEC' no está definida."
  exit 1
fi


CYPRESS_ARGS=""
for VAR in "${ENV_VARS[@]}"; do
  VALUE="${!VAR}"  # Obtener el valor de la variable
  if [ -n "$VALUE" ]; then  # Verificar que no esté vacío
    CYPRESS_ARGS+=" --env $VAR=$VALUE"
  fi
done


# Ejecutar Cypress con la variable de entorno
npx cypress run --spec "$SPEC" $CYPRESS_ARGS 
