#!/bin/bash


# Este script se ejecuta desde adentro del contendor que se levanta 



ENV_VARS=("funcionario" "ciudadano" "tramite" "environment" "jsonFile")

echo "specs : $specs"
echo "funcionario : $funcionario"
echo "ciudadano : $ciudadano"
echo "tramite : $tramite"
echo "environment : $environment"
echo "jsonFile : $jsonFile"


# Verificar si la variable de entorno folder_name está definida
if [ -z "$specs" ]; then
  echo "Error: La variable de entorno 'SPECS' no está definida."
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
npx cypress run --spec "$specs" $CYPRESS_ARGS 
