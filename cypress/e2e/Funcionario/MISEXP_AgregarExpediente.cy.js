import { loadTestData, saveTestData } from '../../support/loadTestData';
import '../../support/funcionario/misExpedientes/misExpedientesPage';
import { AltaNuevoExpediente , AgregarParte, ParteCreada} from '../../support/funcionario/misExpedientes/modal_altaNuevoExpediente';
import { agregarExpedienteBtn } from '../../support/funcionario/misExpedientes/misExpedientesPage';

import {getExpedientDataByNumber} from '../../support/funcionario/expediente';


describe('Agregar plantilla de sentencias', () => {


    let testData, tramite = null;
    let expedientCreated = false;
    const funcionario = Cypress.env('funcionario');
    const environment = Cypress.env('environment');
    let exp = null;
    
    before(() => {
        cy.fixture('expediente_funcionario').then((data) => {
            exp = data["tresPartes"]
        })
    });


    beforeEach(() => {
        cy.on("uncaught:exception", (err, runnable) => {
            cy.log(err.message);
            return false;
        })
        cy.clearCookies();
        cy.clearLocalStorage();
    
        cy.session('sesionFuncionario', () => {
            cy.visit(environment.funcionarioURL);
            cy.loginFuncionario(funcionario.email, funcionario.password);
           
        }, {
            cacheAcrossSpecs: true
        }); 
    });


    it('Carga los datos del expediente', () => {
        cy.visit(environment.funcionarioURL);

        cy.hamburguer().click();
        cy.sidebar('Expedientes').click();
        cy.sidebarExpedientes('Mis expedientes').click();
        
        const altaExp = new AltaNuevoExpediente();
        const agregarParte = new AgregarParte();

        agregarExpedienteBtn().click();
        altaExp.numeroExpedienteInput().type(exp.numeroExpediente);
        altaExp.titleH4().should('have.text', exp.numeroExpediente);
        altaExp.destinatarioSelect(exp.destinatario);
        altaExp.tipoJuicioSelect(exp.tipoJuicio);
        altaExp.viaSelect(exp.via);
        altaExp.materiaSelect(exp.materia);
        altaExp.observacionesTextarea().type(exp.observaciones);
        altaExp.accionPrincipalSelect(exp.accionPrincipal);

        exp.partes.forEach((parte) => {
            altaExp.partesAgregarBtn().click();
            agregarParte.tipoParteSelect(parte.tipoParte);

            // Datos Personales 
            agregarParte.datosPersonalesTab().click();
            agregarParte.regimenDeLaParteSelect(parte.datosPersonales.regimen);
            agregarParte.nombresInput().type(parte.datosPersonales.nombres);
            agregarParte.apellidoPaternoInput().type(parte.datosPersonales.apellidoPaterno);
            agregarParte.apellidoMaternoInput().type(parte.datosPersonales.apellidoMaterno);
            agregarParte.aliasInput().type(parte.datosPersonales.alias);
            agregarParte.edadSelect(parte.datosPersonales.edad);
            agregarParte.fechaNacimientoInput().type(parte.datosPersonales.fechaNacimiento);
            agregarParte.sexoSelect(parte.datosPersonales.sexo);
            agregarParte.generoSelect(parte.datosPersonales.genero);
            agregarParte.clasificacionSelect(parte.datosPersonales.clasificacion);
            parte.datosPersonales.mostrarCaratula ? 
                agregarParte.mostrarCaratulaCheckbox().check() : agregarParte.mostrarCaratulaCheckbox().uncheck();
   
            // Datos de contacto
            agregarParte.datosContactoTab().click();
            agregarParte.correoElectronicoInput().type(parte.datosContacto.correoElectronico);
            agregarParte.telefonoInput().type(parte.datosContacto.telefono);
            agregarParte.lugarResidenciaInput().type(parte.datosContacto.lugarResidencia);

            // Transparencia
            agregarParte.transparenciaTab().click();
            agregarParte.puedeLeerEscribirSelect(parte.transparencia.puedeLeerEscribir);
            agregarParte.sabeHablarEspanolSelect(parte.transparencia.sabeHablarEspanol);
            agregarParte.lenguaODialectoInput().type(parte.transparencia.lenguaODialecto);
            agregarParte.gradoDeEstudiosSelect(parte.transparencia.gradoDeEstudios);
            agregarParte.estadoCivilSelect(parte.transparencia.estadoCivil);
            agregarParte.nacionalidadSelect(parte.transparencia.nacionalidad);
            agregarParte.ocupacionInput().type(parte.transparencia.ocupacion);

            agregarParte.guardarBtn().click();

            const parteCreada = new ParteCreada(parte);
            parteCreada.registroDiv().scrollIntoView().should('exist');
            cy.screenshot(`parte-${parte.datosPersonales.nombres}-${parte.datosPersonales.apellidoPaterno}`);
            parteCreada.registroDiv().should('contain', parte.datosPersonales.nombres);
            parteCreada.registroDiv().should('contain', parte.datosPersonales.apellidoPaterno);
            parteCreada.registroDiv().should('contain', parte.datosPersonales.apellidoMaterno);

        })
        
        cy.intercept("POST", "**/api/v1/government_books/release").as("release");
        altaExp.enviarBtn().click();
        cy.wait("@release").then((interception) => {
            const expediente = interception.response.body.data.governmentBook;
            expect(interception.response.statusCode).to.equal(200);
            expect(interception.response.body.code).to.equal(200);
            expect(interception.response.body.data.message).to.equal("El expediente ha sido transferido correctamente");
            cy.writeFile("tmp/expediente-creado-funcionario.json" , expediente);
        })
    }) 
    
    after(() => {
        if (expedientCreated) {
            cy.visit(environment.funcionarioURL);
            getExpedientDataByNumber(exp.numeroExpediente).then((expedientData) => {
                cy.url().then((url) => {
                    expedientData['tramite'] = { url };
                    expedientData['expedientFound'] = true;
                    expedientData['expedientCreated'] = true
                    console.log(expedientData); 
                    cy.writeFile('tmp/testData.json', expedientData, { log: false });
                });
                
            })
        }
    });

    
})