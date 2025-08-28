import { en } from '@faker-js/faker';
import {getNewExpedientId, getAllExpedients} from '../../page/citizen/expedientes';


describe('Juzgados Civiles, Familiares y Mercantiles en línea', () => {
    
    const environment = Cypress.env('environment');
    const ciudadano = Cypress.env('ciudadano');
    let tramite = null;
    let testData = {'expedientCreated': false};

    before(() => {
        cy.fixture('tramites.json').then((tramites) => {
            const nombreTramite = 'di-rep-abog-demandado-anexo';
            tramite = tramites[nombreTramite];
            expect(tramite).to.exist;
        })
    })

    beforeEach(() => {
        cy.session('ciudadano', () => {
            cy.visit(environment.ciudadanoURL);
            cy.loginCiudadano(ciudadano.email, ciudadano.password);
            cy.wait(2000);
            cy.getCookie('authentication_token_02', { timeout: 5000 }).should('exist');
        });
    });

    context('Ingresa datos al tramite y concluye su creacion', () => {

        it('captura expedientes del ciudadano antes de inciar', () => {
            getAllExpedients(environment).then((expedientes) => {
                cy.writeFile('tmp/ciudadano_expedients_inicio.json', expedientes);
            })
        })

        it('Inicia un trámite y concluye la creacion', () => {

            expect(tramite.nombre).to.be.equal('Juzgados Civiles, Familiares y Mercantiles en línea');

            cy.visit(environment.ciudadanoURL);
            
            // Ir a tramites disponibles
            cy.get('.principal-nav  ul').as('menuPrincipal');
            cy.get('@menuPrincipal').contains('Trámites disponibles').click();
    
            // Verifica que existan trámites disponibles
            cy.get('.procedure-card').should('have.length.greaterThan', 0);
    
            // Buscar un trámite
            cy.get('#searcher').type(tramite.nombre);
            cy.get('i.ti-search')
                .parent()
                .should('be.visible')
                .and('be.enabled')
                .click();

            cy.get('.procedure-card').filter(`:contains("${tramite.nombre}")`).first().as('tramite');
            cy.get('@tramite').contains('button', 'Ir al trámite').click();


            // Iniciar tramite
            cy.contains('button', 'Iniciar trámite')
                .should('be.visible')
                .and('be.enabled')
                .click();


            // Formulario que se parametriza desde el archivo de datos 
            cy.llenarSelect('Partido Judicial', tramite.partidoJudicial);
            cy.llenarSelect('Materia', tramite.materia);
            cy.llenarSelect('Clave del tipo de juicio', tramite.claveTipoJuicio);
            cy.llenarSelect('Tipo de Vía', tramite.tipoVia);


            cy.llenarSelect('Elige el regimén del Actor o Promovente', tramite.regimenActor);
            // TODO falta validad que los campos se muestren correectamente 

            if (tramite.regimenActor === 'Fisica'){
                //Validar que los campos se muestren correctamente

                // REPRESENTANTE LEGAL PARA EL ACTOR
                cy.llenarSelect('¿Existe representante legal para el actor?', tramite.representanteLegal);
                if(tramite.representanteLegal === 'Si') {
                    const representante = tramite.representante;
                    cy.get('input[name="apellido_paternor"]').type(representante.apellidoPaterno);
                    cy.get('input[name="apellido_maternom"]').type(representante.apellidoMaterno);
                    cy.get('input[name="nombre_ss"]').type(representante.nombre);
                    cy.get('input[name="correo_electronico_representante"]').type(representante.email);
                    cy.screenshot('RepresentanteLegal')
                }




            }else if (tramite.regimenActor === 'Moral'){
                cy.get('[id="inputForm.razon_social"]').type(tramite.razonSocial);
                cy.get('[name="primer_apellido_apoderado"]').type(tramite.apoderado.primerApellido);
                cy.get('[name="segundo_apellido_apoderado"]').type(tramite.apoderado.segundoApellido);
                cy.get('[name="nombre_s_apoderado"]').type(tramite.apoderado.nombre);
            }



            // ABOGADO PATRONO PARA EL ACTOR
            cy.llenarSelect('¿Existe abogado patrono para el actor?', tramite.abogadoPatrono);
            if(tramite.abogadoPatrono === 'Si') {
                const abogado = tramite.abogado;
                cy.get('input[name="apellido_paternoa"]').type(abogado.apellidoPaterno);
                cy.get('input[name="apellido_maternoa"]').type(abogado.apellidoMaterno);
                cy.get('input[name="nombre_abogado1"]').type(abogado.nombre);
                cy.get('input[name="correo_electronico_abogado_patrono_actor"]').type(abogado.email);
                cy.screenshot('AbogadoPatrono')
            }
            


            // FIRMA
            cy.get('button').contains('Agregar Firma').click()
            cy.cargarArchivoFirel(ciudadano.archivoFirel, ciudadano.passwordFirel);
            cy.cargarDocumento('Agregar Archivo', environment.documentoPDF)
            cy.wait(5000)
            cy.contains('button', 'Firmar').should('be.visible').and('be.enabled').click();
            cy.screenshot("AgregarFirma")


            // DEMANDADO
            cy.llenarSelect('Para este caso, ¿Es necesario agregar demandado?', tramite.agregarDemandado);
            if(tramite.agregarDemandado === 'Si') {
                const demandado = tramite.demandado;
                cy.llenarSelect('¿El demandado es persona física o moral?', demandado.regimen);
                cy.get('input[name="apellido_paternod"]').type(demandado.apellidoPaterno);
                cy.get('input[name="apellido_maternod"]').type(demandado.apellidoMaterno);
                cy.get('input[name="nombre_sd"]').type(demandado.nombre);
                cy.get('input[name="correo_electronico_del_demandado"]').type(demandado.email);
            }
            cy.screenshot('AgregarDemandado')


            if(tramite.subirAnexo){
                cy.contains('b', ' Agregar Campo para subir anexos').click()
                cy.llenarSelectModal('* Tipo de documento:', tramite.anexos.tipoDocumento)
                cy.get('input[placeholder="Agrega una etiqueta para identificar este documento"]')
                    .type(tramite.anexos.etiqueta);
                cy.cargarDocumento('* Selecciona el archivo a subir', ciudadano.documentoIdentificacion)
                cy.wait(2000)
                cy.contains('.modal-content button', 'Agregar').click()
                cy.screenshot("Subir anexo")
            }
    
            // Confirma la creacion de los expedientes validando la respuesta del servidor
            cy.contains('button', 'Siguiente', {timeout:15000}).click(); 
            cy.intercept('POST', `**/api/v1/execute_stage`).as('execute_stage');
            cy.wait('@execute_stage').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
                cy.log("RESPUESTA A POST execute_stage " + JSON.stringify(interception.response.body));
            })
            cy.screenshot("Enviar formulario")

            cy.intercept('POST', '**/api/v1/finalize_stage').as('finalize_stage');
            cy.contains('button', 'Confirmar', {timeout:15000}).click();
            cy.wait('@finalize_stage').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
                cy.log("RESPUESTA A POST execute_stage " + JSON.stringify(interception.response.body));
            })

            cy.screenshot("Confirmar envio")
            testData.expedientCreated = true;

        })


        it('Captura expedientes despues de la creacion de un nuevo tramite', () => {
            
            // Falla si no se ha encontrado el expediente creado
            if(!testData.expedientCreated) {
                throw new Error('No se ha creado un nuevo expediente');
            }

            // Guardamos la primera captura de expedientes con cy.wrap()
            cy.readFile('tmp/ciudadano_expedients_inicio.json').then((expedientesInicio) => {
                getAllExpedients(environment).then((expedientesFinal) => {
                    cy.writeFile('tmp/ciudadano_expedients_final.json', expedientesFinal)
                    const newExpedient = getNewExpedientId(expedientesInicio.electronicExpedients, expedientesFinal.electronicExpedients);
                    cy.log('Nuevo expediente creado: ' + JSON.stringify(newExpedient));
                    
                    testData.expedient = newExpedient;
                    testData.ciudadano = ciudadano;
                    testData.tramite = tramite;
                    testData.environment = environment;

                    const name =  testData.expedient.expedient_number.replace(/\//g, '-') + ".json"
                    cy.writeFile('tmp/testData.json', testData)
                    cy.writeFile('tmp/' + name, testData)

                    
                })
            })

        })

    })
})