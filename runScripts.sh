#!/bin/bash

run_test() {
  local spec="$1"
  echo "▶️ Ejecutando: $spec"
  npx cypress run --spec "$spec" --env jsonFile=true --quiet
}

echo 'Eliminando archivos de salida...'
rm -rf tmp

echo "▶️ Ejecutando pruebas de Playwright en segundo plano"
cantInputados=10 cantVictimas=10 ciudadano=ciudadanoJoseC2 npx playwright test playwright/tests/Penal.spec.js  


for test in \
    cypress/e2e/Exploratorios/001_DatosDemandadoSeOcultan.cy.js \
    cypress/e2e/Exploratorios/002_loginCredencialesIncorrectas.cy.js \
    cypress/e2e/Exploratorios/003_BuscadorExpedienteAdmiteCharEspeciales.cy.js \
    cypress/e2e/Ciudadano/001_DescargaManualUsuarioTramite.cy.js \
    cypress/e2e/Ciudadano/007_EliminaProyectosEnvio.cy.js \
    cypress/e2e/Ciudadano/004_TramiteSecretarioAcuerdos.cy.js; do
    npx cypress run --spec $test --env funcionario=secretarioAcuerdos01,tramite=civiles_familiares_mercantiles_abogado_demandado
done

l
if [ $? -eq 0 ]; then

    run_test cypress/e2e/Funcionario/001_IniciarCancelaTramite.cy.js 
    run_test cypress/e2e/Funcionario/002_EliminaTramitesIniciados.cy.js 
    run_test cypress/e2e/Funcionario/003_IniciaTramite.cy.js
    run_test cypress/e2e/Funcionario/007_ActionButtonsEnabled.cy.js
    run_test cypress/e2e/Funcionario/008_AcuerdosNotificacionesSentenciasOficios.cy.js 

    # los acuerdos requieren de promociones ingresadas
    run_test cypress/e2e/Funcionario/009_AgregarDocumentoPromocion.cy.js 
    if [ $? -eq 0 ]; then
        run_test cypress/e2e/Funcionario/015_IngresoAcuerdos.cy.js 
    else
        echo "Hubo un error en la carga de la promocion en la prueba 009 de funcionario"
    fi

    # Para ver los documentos se requiere habilitar las vistas
    run_test cypress/e2e/Funcionario/010_HabilitaVistaDocumentosACiudadano.cy.js 
    if [ $? -eq 0 ]; then
        run_test cypress/e2e/Ciudadano/006_DocumentosAccesibles.cy.js 
    else
        echo "Hubo un error en la habilitacion de los documentos en la prueba 010 de funcionario"
    fi

    run_test cypress/e2e/Funcionario/011_GeneraCodigoQR.cy.js 
    run_test cypress/e2e/Funcionario/012_ListarPartes.cy.js -
    run_test cypress/e2e/Funcionario/013_DescargarExpediente.cy.js 
    
    # Es necesario ocultar los documentos para que el ciudadano no pueda verlos
    run_test cypress/e2e/Funcionario/016_QuitaVistaDocumentosACiudadano.cy.js 
    if [ $? -eq 0 ]; then
        run_test cypress/e2e/Ciudadano/005_DocumentosNoAccesibles.cy.js 
    else
        echo "Hubo un error en la ocultacion de los documentos en la prueba 016 de funcionario"
    fi

    run_test cypress/e2e/Funcionario/017_CrearPartes.cy.js 
    run_test cypress/e2e/Funcionario/018_Plantilla-Acuerdos.cy.js 
    run_test cypress/e2e/Funcionario/019_Plantilla-Notificaciones.cy.js 
    run_test cypress/e2e/Funcionario/020_Plantilla-Correo.cy.js 
    run_test cypress/e2e/Funcionario/021_Plantilla-Sentencias.cy.js 
    run_test cypress/e2e/Funcionario/022_Plantilla-Oficios.cy.js 
    run_test cypress/e2e/Funcionario/024_ModificarExpediente.cy.js 
    run_test cypress/e2e/Funcionario/025_PanelVencimiento.cy.js 
    run_test cypress/e2e/Funcionario/026_PromocionesPendientes.cy.js 

    # los acuerdos requieren de promociones ingresadas
    run_test cypress/e2e/Funcionario/009_AgregarDocumentoPromocion.cy.js 
    if [ $? -eq 0 ]; then
        run_test cypress/e2e/Funcionario/027_AgregarAcuerdo-PublicarBoletin.cy.js 
    else
        echo "Hubo un error en la carga de la promocion en la prueba 009 de funcionario"
    fi

    run_test cypress/e2e/Funcionario/028_Reportes.cy.js 
    run_test cypress/e2e/Funcionario/029_PanelFimasPendientes.cy.js 
    run_test cypress/e2e/Funcionario/014_TurnarExpediente-Interno.cy.js 

    if [ $? -eq 0 ]; then
        run_test cypress/e2e/Funcionario/501_RecibirExpedienteTurnado.cy.js 
        run_test cypress/e2e/Funcionario/007_ActionButtonsEnabled.cy.js 
        run_test cypress/e2e/Funcionario/008_AcuerdosNotificacionesSentenciasOficios.cy.js 
        run_test cypress/e2e/Funcionario/009_AgregarDocumentoPromocion.cy.js 
        run_test cypress/e2e/Funcionario/010_HabilitaVistaDocumentosACiudadano.cy.js 
        run_test cypress/e2e/Funcionario/023_TurnarExpediente-Externo.cy.js 
    else
        echo "Hubo un error en el turnado interno del expediente en la prueba 014 de funcionario"
    fi

else
  echo "Hubo un error en la creacion del expediente en la prueba 004 de ciudadano"
fi



