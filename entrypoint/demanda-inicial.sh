#!/bin/bash

set -e

# Ir al directorio raíz del proyecto
cd "$(dirname "$0")/.."

npx cypress run --spec "cypress/e2e/Ciudadano/TR_DemandaInicial.cy.js" --env tramite="di-rep-abog-demandado-anexo"
EXPEDIENT_CREATED=$?

if [ "$EXPEDIENT_CREATED" -eq 0 ]; then
    npx cypress run --spec "cypress/e2e/Funcionario/EXP_AB_ActionButtonsEnabled.cy.js"
    npx cypress run --spec "cypress/e2e/Funcionario/EXP_PL_BotonesEstanHabilitados.js"


    # Esta seccion prueba los permisos de los documentos en el ciudadano
    # se otorga el permiso al ciudadano para que pueda ver los documentos
    # en ambas pruebas el ciudadano NO tiene permiso para ver los documentos ya que no se cuenta con un acuerdo
    npx cypress run --spec "cypress/e2e/Funcionario/EXP_DOC_DaPermisoCiudadano.cy.js"
    CIUDADANO_CON_PERMISO=$?

    if [ "$CIUDADANO_CON_PERMISO" -eq 0 ]; then
        npx cypress run --spec "cypress/e2e/Ciudadano/EXP_DOC_DocumentosNoAccesibles.cy.js"
    else
        echo "Se omitio la ejecucion de la prueba EXP_DOC_DocumentosNoAccesibles.cy.js por error en el permiso del ciudadano"
    fi
    
    # se quita el permiso al ciudadano para que no pueda ver los documentos
    npx cypress run --spec "cypress/e2e/Funcionario/EXP_DOC_QuitaPermisoCiudadano.cy.js"
    CIUDADANO_SIN_PERMISO=$?

    if [ "$CIUDADANO_SIN_PERMISO" -eq 0 ]; then
        npx cypress run --spec "cypress/e2e/Ciudadano/EXP_DOC_DocumentosNoAccesibles.cy.js"
    else
        echo "Se omitio la ejecucion de la prueba EXP_DOC_DocumentosNoAccesibles.cy.js por error en el permiso del ciudadano"
    fi


    npx cypress run --spec "cypress/e2e/Funcionario/EXP_AB_AgregarDocumento_Promocion.cy.js"
    
    PROMOTION_LOADED=$?
    if [ "$PROMOTION_LOADED" -eq 0 ]; then
        npx cypress run --spec "cypress/e2e/Funcionario/EXP_AB_AgregarDocumento_Acuerdo.cy.js"
    else
        echo "Se omitio la ejecucion de la prueba EXP_AB_AgregarDocumento_Acuerdo.cy.js por error en el ingreso de promocion"
    fi

else
    echo "Hubo  un error en la creacion del expediente desde el ciudadadano, se omitieron las pruebas de funcionario"
fi
