#!/bin/bash
# Este script es para correr en produccion sin necesidad de cambiar ninguna configuracion en el ambiente
# como habilitar los tramites del ciudadano 

export $(grep -v '^#' .env.prod | xargs)
export FUNCTIONARY=FUNC_LABORAL_ACUERDOS

npx cypress run --spec cypress/e2e/Funcionario/CP_EP_PanelVencimiento.cy.js

npx cypress run --spec cypress/e2e/Funcionario/EXP_AB_ActionButtonsEnabled.cy.js
npx cypress run --spec cypress/e2e/Funcionario/EXP_AB_DescargarExpediente.cy.js

npx cypress run --spec cypress/e2e/Funcionario/EXP_AB_ListarPartes.cy.js

npx cypress run --spec cypress/e2e/Funcionario/EXP_PL_*.cy.js # TODAS PLANTILLAS
npx cypress run --spec cypress/e2e/Funcionario/MODEXP_ModificarExpediente.cy.js # MODIFICAR EXPEDIENTE



# Promociones y acuerdos2
npx cypress run --spec "cypress/e2e/Funcionario/EXP_AB_AgregarDocumento_Promocion.cy.js"

PROMOTION_LOADED=$?
if [ "$PROMOTION_LOADED" -eq 0 ]; then
    npx cypress run --spec "cypress/e2e/Funcionario/EXP_AB_AgregarDocumento_Acuerdo.cy.js" # Debe haber partes
else
    echo "Se omitio la ejecucion de la prueba EXP_AB_AgregarDocumento_Acuerdo.cy.js por error en el ingreso de promocion"
fi

npx cypress run --spec cypress/e2e/Funcionario/EXP_AB_GenerarCodigoQR.cy.js # Requiere tener documentos
npx cypress run --spec cypress/e2e/Funcionario/EXP_DOC_DaPermisoCiudadano.cy.js # Requiere tener partes y documentos
npx cypress run --spec cypress/e2e/Funcionario/EXP_DOC_QuitaPermisoCiudadano.cy.js # Requiere tener partes y documentos

# Turnado de expediente
npx cypress run --spec cypress/e2e/Funcionario/EXP_AB_TurnarExpediente_Interno.cy.js 
EXPEDIENTE_TURNADO_01=$?
if [ "$EXPEDIENTE_TURNADO_01" -eq 0 ]; then
    export FUNCTIONARY=FUNC_LABORAL_NOTIFICADOR
    npx cypress run --spec cypress/e2e/Funcionario/EXPxREC_RecibirExpedienteTurnado.cy.js

    npx cypress run --spec "cypress/e2e/Funcionario/EXP_AB_AgregarDocumento_Promocion.cy.js"
    PROMOTION_LOADED=$?
    if [ "$PROMOTION_LOADED" -eq 0 ]; then
        npx cypress run --spec "cypress/e2e/Funcionario/EXP_AB_AgregarDocumento_Acuerdo_Multifirma.cy.js" # Debe haber partes

        EXPEPDIENTE_TURNADO_02=$?
        if [ "$EXPEPDIENTE_TURNADO_02" -eq 0 ]; then
            export FUNCTIONARY=FUNC_LABORAL_ACUERDOS
            npx cypress run --spec cypress/e2e/Funcionario/EXPxREC_RecibirExpedienteTurnado.cy.js
            EXPEDIENTE_RECIBIDO=$?
            if [ "$EXPEDIENTE_RECIBIDO" -eq 0 ]; then
                npx cypress run --spec cypress/e2e/Funcionario/CP_PSP_PanelFimasPendientes.cy.js
            else
                echo "Se omitio la ejecucion de la prueba EXP_AB_AgregarDocumento_Acuerdo.cy.js por error en el recibo del expediente"
            fi

        else
            echo "Se omitio la ejecucion de la prueba EXP_AB_AgregarDocumento_Acuerdo.cy.js por error en el turnado del expediente"
        fi

    else
        echo "Se omitio la ejecucion de la prueba EXP_AB_AgregarDocumento_Acuerdo.cy.js por error en el ingreso de promocion"
    fi

else
    echo "Se omitio la ejecucion de la prueba EXP_AB_TurnarExpediente_Externo.cy.js por error en el turnado del expediente"
fi


