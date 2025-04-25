import { loadTestData, saveTestData } from '../../support/loadTestData';
import {getNewExpedientId} from '../../support/commands';
import {getAllExpedients} from '../../support/ciudadano/expedientes';


// env : {
//     funcionario: JSON.parse(functionaryRaw),
//     ciudadano: JSON.parse(citizenRaw),
//     environment: JSON.parse(environmentRaw),
//     tramite: "civiles_familiares_mercantiles_abogado_demandado",
//   }

const environment = Cypress.env('environment');
const funcionario = Cypress.env('funcionario');
const ciudadano = Cypress.env('ciudadano');

describe('Inicia Tramite desde el portal de ciudadano', () => {



    
    it('debe cargar las variables de entorno', () => {
        cy.log('environment', environment)
        console.log('funcionario', funcionario)
        console.log('ciudadano', ciudadano)

        expect(environment).to.exist;
        expect(environment).to.have.property('ciudadanoURL');
        expect(environment).to.have.property('funcionarioURL');

        expect(ciudadano).to.exist;
        expect(ciudadano).to.have.property('email');
        expect(ciudadano).to.have.property('password');

        expect(funcionario).to.exist;
        expect(funcionario).to.have.property('email');
        expect(funcionario).to.have.property('password');
        cy.writeFile('tmp/env.json', environment)
    })

})

/*
DONE \cypress\e2e\Ciudadano\001_DescargaManualUsuarioTramite.cy.js
DONE \cypress\e2e\Ciudadano\004_TramiteSecretarioAcuerdos.cy.js
TODO \cypress\e2e\Ciudadano\005_DocumentosNoAccesibles.cy.js
TODO \cypress\e2e\Ciudadano\006_DocumentosAccesibles.cy.js
DONE \cypress\e2e\Ciudadano\007_EliminaProyectosEnvio.cy.js
TODO \cypress\e2e\Ciudadano\008_CrearUsuario.cy.js
TODO \cypress\e2e\Env\001_env.cy.js
TODO \cypress\e2e\Env\002_env.cy.js
DONE \cypress\e2e\Exploratorios\001_DatosDemandadoSeOcultan.cy.js
DONE \cypress\e2e\Exploratorios\002_loginCredencialesIncorrectas.cy.js
DONE \cypress\e2e\Exploratorios\003_BuscadorExpedienteAdmiteCharEspeciales.cy.js
TODO \cypress\e2e\Funcionario\000_logins.cy.js
DONE \cypress\e2e\Funcionario\001_IniciarCancelaTramite.cy.js
DONE \cypress\e2e\Funcionario\002_EliminaTramitesIniciados.cy.js
DONE \cypress\e2e\Funcionario\003_IniciaTramite.cy.js
DONE \cypress\e2e\Funcionario\007_ActionButtonsEnabled.cy.js
DONE \cypress\e2e\Funcionario\008_AcuerdosNotificacionesSentenciasOficios.cy.js
DONE \cypress\e2e\Funcionario\009_AgregarDocumentoPromocion.cy.js
DONE \cypress\e2e\Funcionario\010_HabilitaVistaDocumentosACiudadano.cy.js
DONE \cypress\e2e\Funcionario\011_GeneraCodigoQR.cy.js
DONE \cypress\e2e\Funcionario\012_ListarPartes.cy.js
DONE \cypress\e2e\Funcionario\013_DescargarExpediente.cy.js
DONE \cypress\e2e\Funcionario\014_TurnarExpediente-Interno.cy.js
DONE \cypress\e2e\Funcionario\015_IngresoAcuerdos.cy.js
DONE \cypress\e2e\Funcionario\016_QuitaVistaDocumentosACiudadano.cy.js
DONE \cypress\e2e\Funcionario\017_CrearPartes.cy.js
DONE \cypress\e2e\Funcionario\018_Plantilla-Acuerdos.cy.js
DONE \cypress\e2e\Funcionario\019_Plantilla-Notificaciones.cy.js
DONE \cypress\e2e\Funcionario\020_Plantilla-Correo.cy.js
DONE \cypress\e2e\Funcionario\021_Plantilla-Sentencias.cy.js
DONE \cypress\e2e\Funcionario\022_Plantilla-Oficios.cy.js
TODO \cypress\e2e\Funcionario\023_TurnarExpediente-Externo.cy.js
DONE \cypress\e2e\Funcionario\024_ModificarExpediente.cy.js
DONE \cypress\e2e\Funcionario\025_PanelVencimiento.cy.js
DONE \cypress\e2e\Funcionario\026_PromocionesPendientes.cy.js
DONE \cypress\e2e\Funcionario\027_AgregarAcuerdo-PublicarBoletin.cy.js
DONE \cypress\e2e\Funcionario\028_Reportes.cy.js
FIXME \cypress\e2e\Funcionario\029_PanelFimasPendientes.cy.js
DONE \cypress\e2e\Funcionario\501_RecibirExpedienteTurnado.cy.js
TODO \cypress\e2e\Funcionario\900_Login.cy.js
TODO \cypress\e2e\Penal\001_TramitePenalLinea.cy.js
*/