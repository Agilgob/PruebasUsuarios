#!/bin/bash

set -e

# Ir al directorio raíz del proyecto
cd "$(dirname "$0")/.."

# npx cypress run --spec "cypress/e2e/Ciudadano/TR_DemandaInicial.cy.js" --env tramite="di-rep-abog-demandado-anexo"
ls
EXPEDIENT_CREATED=$?

if [ "$EXPEDIENT_CREATED" -eq 0 ]; then
    npx cypress run --spec "cypress/e2e/Funcionario/EXP_AB_ActionButtonsEnabled.cy.js"
    npx cypress run --spec "cypress/e2e/Funcionario/EXP_PL_*.cy.js"


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
    
    PROMOTION_LOADED_01=$?
    if [ "$PROMOTION_LOADED_01" -eq 0 ]; then
        npx cypress run --spec "cypress/e2e/Funcionario/EXP_AB_AgregarDocumento_Acuerdo.cy.js"

        npx cypress run --spec cypress/e2e/Funcionario/EXP_AB_GenerarCodigoQR.cy.js
        npx cypress run --spec cypress/e2e/Funcionario/MODEXP_ModificarExpediente.cy.js
        npx cypress run --spec cypress/e2e/Funcionario/EXP_AB_ListarPartes.cy.js
        npx cypress run --spec cypress/e2e/Funcionario/EXP_AB_ListarPates_crea_edita_elimina.cy.js

        npx cypress run --spec cypress/e2e/Funcionario/EXP_AB_TurnarExpediente_Interno.cy.js


        EXPEDIENTE_TURNADO_INTERNO_01=$?
        if [ EXPEDIENTE_TURNADO_INTERNO_01 -eq 0 ]; then
            export FUNCTIONARY=FUNC_LABORAL_ACUERDOS_03
            npx cypress run --spec cypress/e2e/Funcionario/EXPxREC_RecibirExpedienteTurnado.cy.js

                npx cypress run --spec "cypress/e2e/Funcionario/EXP_AB_AgregarDocumento_Promocion.cy.js"
                PROMOTION_LOADED_02=$?
                if [ "$PROMOTION_LOADED_02" -eq 0 ]; then
                    npx cypress run --spec cypress/e2e/Funcionario/EXP_AB_AgregarDocumento_Acuerdo_Multifirma.cy.js
                    MULTIFIRMA_TURNADO=$?
                    if [ "$MULTIFIRMA_TURNADO" -eq 0 ]; then
                        export FUNCTIONARY=FUNC_LABORAL_ACUERDOS_01
                        npx cypress run --spec cypress/e2e/Funcionario/EXPxREC_RecibirExpedienteTurnado.cy.js

                        MULTIFIRMA_RECIBIDO=$?
                        if [ "$MULTIFIRMA_RECIBIDO" -eq 0 ]; then
                           npx cypress run --spec cypress/e2e/Funcionario/CP_PSP_PanelFimasPendientes.cy.js
                        else
                            echo "Se omitio la ejecucion de la prueba EXP_AB_AgregarDocumento_Acuerdo_Multifirma_Validar.cy.js por error en el recibo del expediente multifirma"
                        fi

                    else
                        echo "Se omitio ya que fallo el ingreso de acuerdo multifirma"
                    fi


                else
                    echo "Se omitio la ejecucion de la prueba EXP_AB_AgregarDocumento_Acuerdo.cy.js por error en el ingreso de promocion"
                fi

        else
            echo "Se omitio la ejecucion de la prueba EXPxREC_RecibirExpedienteTurnado.cy.js por error en el turnado interno del expediente"
        fi


    else
        echo "Se omitio la ejecucion de la prueba EXP_AB_AgregarDocumento_Acuerdo.cy.js por error en el ingreso de promocion"
    fi


else
    echo "Hubo  un error en la creacion del expediente desde el ciudadadano, se omitieron las pruebas de funcionario"
fi


