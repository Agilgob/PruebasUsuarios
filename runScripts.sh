

npx cypress run --spec cypress/e2e/Exploratorios/001_DatosDemandadoSeOcultan.cy.js
npx cypress run --spec cypress/e2e/Exploratorios/002_loginCredencialesIncorrectas.cy.js
npx cypress run --spec cypress/e2e/Exploratorios/003_BuscadorExpedienteAdmiteCharEspeciales.cy.js
npx cypress run --spec cypress/e2e/Ciudadano/001_DescargaManualUsuarioTramite.cy.js
npx cypress run --spec cypress/e2e/Ciudadano/007_EliminaProyectosEnvio.cy.js
npx cypress run --spec cypress/e2e/Ciudadano/004_TramiteSecretarioAcuerdos.cy.js \
    --env funcionario=secretarioAcuerdos01,tramite=civiles_familiares_mercantiles_abogado_demandado

if [ $? -eq 0 ]; then

    npx cypress run --spec cypress/e2e/Funcionario/001_IniciarCancelaTramite.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/002_EliminaTramitesIniciados.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/003_IniciaTramite.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/007_ActionButtonsEnabled.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/008_AcuerdosNotificacionesSentenciasOficios.cy.js --env jsonFile=true

    # los acuerdos requieren de promociones ingresadas
    npx cypress run --spec cypress/e2e/Funcionario/009_AgregarDocumentoPromocion.cy.js --env jsonFile=true
    if [ $? -eq 0 ]; then
        npx cypress run --spec cypress/e2e/Funcionario/015_IngresoAcuerdos.cy.js --env jsonFile=true
    else
        echo "Hubo un error en la carga de la promocion en la prueba 009 de funcionario"
    fi

    # Para ver los documentos se requiere habilitar las vistas
    npx cypress run --spec cypress/e2e/Funcionario/010_HabilitaVistaDocumentosACiudadano.cy.js --env jsonFile=true
    if [ $? -eq 0 ]; then
        npx cupress run --spec cypress/e2e/Ciudadano/006_DocumentosAccesibles.cy.js --env jsonFile=true
    else
        echo "Hubo un error en la habilitacion de los documentos en la prueba 010 de funcionario"
    fi

    npx cypress run --spec cypress/e2e/Funcionario/011_GeneraCodigoQR.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/012_ListarPartes.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/013_DescargarExpediente.cy.js --env jsonFile=true
    
    # Es necesario ocultar los documentos para que el ciudadano no pueda verlos
    npx cypress run --spec cypress/e2e/Funcionario/016_QuitaVistaDocumentosACiudadano.cy.js --env jsonFile=true
    if [ $? -eq 0 ]; then
        npx cupress run --spec cypress/e2e/Ciudadano/005_DocumentosNoAccesibles.cy.js --env jsonFile=true
    else
        echo "Hubo un error en la ocultacion de los documentos en la prueba 016 de funcionario"
    fi

    npx cypress run --spec cypress/e2e/Funcionario/017_CrearPartes.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/018_Plantilla-Acuerdos.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/019_Plantilla-Notificaciones.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/020_Plantilla-Correo.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/021_Plantilla-Sentencias.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/022_Plantilla-Oficios.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/024_ModificarExpediente.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/025_PanelVencimiento.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/026_PromocionesPendientes.cy.js --env jsonFile=true

    # los acuerdos requieren de promociones ingresadas
    npx cypress run --spec cypress/e2e/Funcionario/009_AgregarDocumentoPromocion.cy.js --env jsonFile=true
    if [ $? -eq 0 ]; then
        npx cypress run --spec cypress/e2e/Funcionario/027_AgregarAcuerdo-PublicarBoletin.cy.js --env jsonFile=true
    else
        echo "Hubo un error en la carga de la promocion en la prueba 009 de funcionario"
    fi

    npx cypress run --spec cypress/e2e/Funcionario/028_Reportes.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/029_PanelFimasPendientes.cy.js --env jsonFile=true
    npx cypress run --spec cypress/e2e/Funcionario/014_TurnarExpediente-Interno.cy.js --env jsonFile=true

    if [ $? -eq 0 ]; then
        npx cypress run --spec cypress/e2e/Funcionario/501_RecibirExpedienteTurnado.cy.js --env jsonFile=true
        npx cypress run --spec cypress/e2e/Funcionario/007_ActionButtonsEnabled.cy.js --env jsonFile=true
        npx cypress run --spec cypress/e2e/Funcionario/008_AcuerdosNotificacionesSentenciasOficios.cy.js --env jsonFile=true
        npx cypress run --spec cypress/e2e/Funcionario/009_AgregarDocumentoPromocion.cy.js --env jsonFile=true
        npx cypress run --spec cypress/e2e/Funcionario/010_HabilitaVistaDocumentosACiudadano.cy.js --env jsonFile=true
        npx cypress run --spec cypress/e2e/Funcionario/023_TurnarExpediente-Externo.cy.js --env jsonFile=true
    else
        echo "Hubo un error en el turnado interno del expediente en la prueba 014 de funcionario"
    fi

else
  echo "Hubo un error en la creacion del expediente en la prueba 004 de ciudadano"
fi



