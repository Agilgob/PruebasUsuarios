#!/bin/bash

export $(cat .env | xargs)

run_test() {
  local spec="$1"
  local env_value="$2"
  local log_file="tmp/test.log"

  echo "▶️ Ejecutando: $spec con --env $env_value"
  npx cypress run --spec "$spec" --env "$env_value" --quiet
  local exit_code=$?

  if [ $exit_code -eq 0 ]; then
    echo "✅ $spec terminado correctamente con env: $env_value" >> "$log_file"
  else
    echo "❌ $spec falló con env: $env_value" >> "$log_file"
  fi

  return $exit_code
}



run_test cypress/e2e/Exploratorios/001_DatosDemandadoSeOcultan.cy.js funcionario=secretarioAcuerdos01
run_test cypress/e2e/Exploratorios/002_loginCredencialesIncorrectas.cy.js funcionario=secretarioAcuerdos01
run_test cypress/e2e/Exploratorios/003_BuscadorExpedienteAdmiteCharEspeciales.cy.js funcionario=secretarioAcuerdos01
run_test cypress/e2e/Ciudadano/001_DescargaManualUsuarioTramite.cy.js funcionario=secretarioAcuerdos01
run_test cypress/e2e/Ciudadano/007_EliminaProyectosEnvio.cy.js ciudadano=ciudadanoJoseC2
run_test cypress/e2e/Ciudadano/004_TramiteSecretarioAcuerdos.cy.js funcionario=secretarioAcuerdos01,ciudadano=ciudadanoJoseC2,tramite=civiles_familiares_mercantiles_abogado_demandado

if [ $? -eq 0 ]; then

    run_test cypress/e2e/Funcionario/001_IniciarCancelaTramite.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/002_EliminaTramitesIniciados.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/003_IniciaTramite.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/007_ActionButtonsEnabled.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/008_AcuerdosNotificacionesSentenciasOficios.cy.js jsonFile=true

    # los acuerdos requieren de promociones ingresadas
    run_test cypress/e2e/Funcionario/009_AgregarDocumentoPromocion.cy.js jsonFile=true
    if [ $? -eq 0 ]; then
        run_test cypress/e2e/Funcionario/015_IngresoAcuerdos.cy.js jsonFile=true
    else
        echo "Hubo un error en la carga de la promocion en la prueba 009 de funcionario" 
    fi

    # Para ver los documentos se requiere habilitar las vistas
    run_test cypress/e2e/Funcionario/010_HabilitaVistaDocumentosACiudadano.cy.js jsonFile=true
    if [ $? -eq 0 ]; then
        run_test cypress/e2e/Ciudadano/006_DocumentosAccesibles.cy.js jsonFile=true
    else
        echo "Hubo un error en la habilitacion de los documentos en la prueba 010 de funcionario"
    fi

    run_test cypress/e2e/Funcionario/011_GeneraCodigoQR.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/012_ListarPartes.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/013_DescargarExpediente.cy.js jsonFile=true
    
    # Es necesario ocultar los documentos para que el ciudadano no pueda verlos
    run_test cypress/e2e/Funcionario/016_QuitaVistaDocumentosACiudadano.cy.js jsonFile=true
    if [ $? -eq 0 ]; then
        run_test cypress/e2e/Ciudadano/005_DocumentosNoAccesibles.cy.js jsonFile=true
    else
        echo "Hubo un error en la ocultacion de los documentos en la prueba 016 de funcionario"
    fi

    run_test cypress/e2e/Funcionario/017_CrearPartes.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/018_Plantilla-Acuerdos.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/019_Plantilla-Notificaciones.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/020_Plantilla-Correo.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/021_Plantilla-Sentencias.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/022_Plantilla-Oficios.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/024_ModificarExpediente.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/025_PanelVencimiento.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/026_PromocionesPendientes.cy.js jsonFile=true

    # los acuerdos requieren de promociones ingresadas
    run_test cypress/e2e/Funcionario/009_AgregarDocumentoPromocion.cy.js jsonFile=true
    if [ $? -eq 0 ]; then
        run_test cypress/e2e/Funcionario/027_AgregarAcuerdo-PublicarBoletin.cy.js jsonFile=true
    else
        echo "Hubo un error en la carga de la promocion en la prueba 009 de funcionario"
    fi

    run_test cypress/e2e/Funcionario/028_Reportes.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/029_PanelFimasPendientes.cy.js jsonFile=true
    run_test cypress/e2e/Funcionario/014_TurnarExpediente-Interno.cy.js jsonFile=true

    if [ $? -eq 0 ]; then
        run_test cypress/e2e/Funcionario/501_RecibirExpedienteTurnado.cy.js jsonFile=true
        run_test cypress/e2e/Funcionario/007_ActionButtonsEnabled.cy.js jsonFile=true
        run_test cypress/e2e/Funcionario/008_AcuerdosNotificacionesSentenciasOficios.cy.js jsonFile=true
        run_test cypress/e2e/Funcionario/009_AgregarDocumentoPromocion.cy.js jsonFile=true
        run_test cypress/e2e/Funcionario/010_HabilitaVistaDocumentosACiudadano.cy.js jsonFile=true
        run_test cypress/e2e/Funcionario/023_TurnarExpediente-Externo.cy.js jsonFile=true
    else
        echo "Hubo un error en el turnado interno del expediente en la prueba 014 de funcionario"
    fi

else
  echo "Hubo un error en la creacion del expediente en la prueba 004 de ciudadano"
fi







