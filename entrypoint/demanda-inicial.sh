#!/bin/bash

set -e

# Ir al directorio raíz del proyecto
cd "$(dirname "$0")/.."

npx cypress run --spec "cypress/e2e/Ciudadano/004_TramiteSecretarioAcuerdos.cy.js" --env tramite="di-rep-abog-demandado-anexo"
EXPEDIENT_CREATED=$?

if [ "$EXPEDIENT_CREATED" -eq 0 ]; then
    npx cypress run --spec "cypress/e2e/Ciudadano/004_TramiteSecretarioAcuerdos.cy.js" --env tramite="di-rep-abog-demandado-anexo"
    npx cypress run --spec "cypress/e2e/Funcionario/007_ActionButtonsEnabled.cy.js"
    npx cypress run --spec "cypress/e2e/Funcionario/008_AcuerdosNotificacionesSentenciasOficios.cy.js"
    npx cypress run --spec "cypress/e2e/Funcionario/009_AgregarDocumentoPromocion.cy.js"
    
    PROMOTION_LOADED=$?
    if [ "$PROMOTION_LOADED" -eq 0 ]; then
        npx cypress run --spec "cypress/e2e/Funcionario/015_IngresoAcuerdos.cy.js"
    else
        echo "Se  omitio la ejecucion de la prueba 015 de ingreso de acuerdos por error en el ingreso de promocion"
    fi

else
    echo "Hubo  un error en la creacion del expediente desde el ciudadadano, se omitieron las pruebas de funcionario"
fi
