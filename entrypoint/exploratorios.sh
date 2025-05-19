#!/bin/bash

echo "Desde el archivo .sh de exploratorios"

# Ir al directorio raíz del proyecto
cd "$(dirname "$0")/.."




# CIUDADANO
npx cypress run --spec "cypress/e2e/Exploratorios/CIU_DatosDemandadoSeOcultan.cy.js" 
npx cypress run --spec "cypress/e2e/Exploratorios/CIU_loginCredencialesIncorrectas.cy.js" 
npx cypress run --spec "cypress/e2e/Exploratorios/CIU_ConsultaMisTramites.cy.js"


# FUNCIONARIO
npx cypress run --spec "cypress/e2e/Exploratorios/FUNC_ModificarExp.cy.js" # Barra de busqueda del expediente
npx cypress run --spec "cypress/e2e/Exploratorios/FUNC_IniciarCancelaTramite.cy.js"
npx cypress run --spec "cypress/e2e/Exploratorios/FUNC_Reportes.cy.js" 
npx cypress run --spec "cypress/e2e/Exploratorios/FUNC_MisExpedientes.cy.js"



    
