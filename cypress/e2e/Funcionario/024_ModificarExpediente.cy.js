import { loadTestData, saveTestData } from '../../support/loadTestData';

const findInputInModal = function (modalName, label){
    cy.getModal(modalName).contains('label', label).parent().find('input').as('input');
    return cy.get('@input');
}


describe('Funcionario : Modificar expediente ', () => {

    const tipoParte = 'Tercero Interesado';

    let testData, tramite = null;
    const funcionario = Cypress.env('funcionario');
    const environment = Cypress.env('environment');
    
    before(() => {
        
        cy.readFile('tmp/testData.json', { log: false, timeout: 500 }).then((data) => {
          testData = data;
          tramite = testData.tramite;
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
          
            cy.getCookie('authentication_token_03').should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });


    it('El expediente puede ser localizado desde el buscador', () => {
        cy.buscarExpediente(testData); // support/funcionario/expediente.js
    });
    
    it('Permite editar los campos el expediente ' , () => {
        
        cy.visit(environment.funcionarioURL);
        cy.hamburguer().click();
        cy.sidebar('Modificar expedientes').should('be.visible').click()
        cy.get('section.searcherContainer').find('input').type(`${testData.expediente.expedient_number}{enter}`);

        cy.get('section.procedures-table-container').find('tr').filter(`:contains("${testData.expediente.expedient_number}")`).as('expedienteRow');
        cy.get('@expedienteRow')
            .then(($row) => {
                expect($row.length).to.be.equal(1);
                cy.wrap($row).find('div.edit').click()
            });
        
        cy.intercept('**/api/v1/matters/get_list').as('getMatters');
        cy.intercept('**/api/v1/electronic_expedient/crimes/*').as('getCrimes');
        cy.wait(['@getMatters', '@getCrimes']).then((interceptions) => {
            cy.log('GET MATTERS : ' + JSON.stringify(interceptions[0]));
            cy.log('GET CRIMES : ' + JSON.stringify(interceptions[1]));
        })

        cy.get('div.cardExpedientEdit.card').as('modalExpediente');
         // TODO agregar un metodo mas generico ya que el placeholder desaparece cuando tiene un valor
        cy.get('@modalExpediente').contains('label', 'Acción principal').parent().find('div[class$="placeholder"]')
            .click()
            .type('ABANDONO{enter}')

        cy.get('@modalExpediente').find('textarea[placeholder="Agrega una justificación"]')
            .type('Pruebas automatizadas cypress')

        cy.intercept('PUT', '**/api/v1/admin/electronic_expedients/*').as('putExpediente');
        cy.contains('button', 'Actualizar').click();
        cy.wait('@putExpediente').then((interception) => {
            
            expect(interception.response.statusCode).to.be.equal(200);
            expect(interception.response.body.data.message).to.be.equal('Expediente modificado');

            cy.log('PUT EXPEDIENTE MODIFICADO: ' + JSON.stringify(interception));
        })
    })

    it('Permite agregar partes al expediente ' , () => {
        
        cy.visit(environment.funcionarioURL);
        cy.hamburguer().click();
        cy.sidebar('Modificar expedientes').should('be.visible').click()
        cy.get('section.searcherContainer').find('input').type(`${testData.expediente.expedient_number}{enter}`);

        cy.get('section.procedures-table-container').find('tr').filter(`:contains("${testData.expediente.expedient_number}")`).as('expedienteRow');
        cy.get('@expedienteRow')
            .then(($row) => {
                expect($row.length).to.be.equal(1);
                cy.wrap($row).find('div.edit').click()
            });
        
        cy.intercept('**/api/v1/matters/get_list').as('getMatters');
        cy.intercept('**/api/v1/electronic_expedient/crimes/*').as('getCrimes');
        cy.wait(['@getMatters', '@getCrimes']).then((interceptions) => {
            cy.log('GET MATTERS : ' + JSON.stringify(interceptions[0]));
            cy.log('GET CRIMES : ' + JSON.stringify(interceptions[1]));
        })

        // aqui cambia la prueba respecto a la anterior para modificar en el modal
        let cantidadPartes = 0;
        cy.get('form div .mb-2 .ti-trash').its('length').then((length) => {
            cantidadPartes = length; // cuenta las partes que ya existen
        });
        cy.contains('p', 'Partes').siblings('button').click();
        cy.getModal('Agregar Parte').as('modalAgregarParte');
        cy.get('@modalAgregarParte').get('[aria-label="Button Parties Form"]').as('btnsPartes');

        // Datos Personales

        cy.llenarSelectModal('Tipo de parte', tipoParte );
        cy.llenarSelectModal('Régimen de la parte', 'Persona Física');
        cy.get('@modalAgregarParte').get('input[placeholder="Ejemplo: John"]').type('Juan');
        cy.get('@modalAgregarParte').get('input[placeholder="Ejemplo: Doe"]').type('Dohernandez');
        cy.get('@modalAgregarParte').contains('Apellido Materno').siblings('input').type('Lopez');
        cy.get('@modalAgregarParte').contains('Alias').siblings('input').type('Little Jonny');
        cy.llenarSelectModal('Edad', '45');
        cy.get('@modalAgregarParte').get('[placeholder="Da clic y elige la fecha correspondiente"]')
            .click()
            .type('1980-10-01', { force: true })
            .type('{enter}');
        cy.llenarSelectModal('Sexo', 'Masculino');
        cy.llenarSelectModal('Género', 'Heteronormatividad');
        cy.llenarSelectModal('Clasificación', 'Privado');

        // Datos de Contacto
        cy.get('@btnsPartes').contains('Datos de Contacto').click();
        cy.get('@modalAgregarParte').contains('Correo electrónico').siblings('input').type('donjuandoe@hotmail.com');
        cy.get('@modalAgregarParte').contains('Teléfono').siblings('input').type('5531231230');
        cy.get('@modalAgregarParte').contains('Lugar de residencia').siblings('input').type('No es de aqui pero tampoco es de alla');
        
        // Transparencia 
        cy.get('@btnsPartes').contains('Transparencia').click();
        cy.llenarSelectModal('¿Puede Leer y Escribir?' , 'Si');
        cy.llenarSelectModal('¿Sabe hablar español?' , 'Si');
        cy.get('@modalAgregarParte').contains('Lengua o dialecto').siblings('input').type('Español');
        cy.llenarSelectModal('Grado de estudios', 'No especifica');
        cy.llenarSelectModal('Estado civil', 'Casado');
        cy.llenarSelectModal('Nacionalidad','MEXICANA');
        cy.get('@modalAgregarParte').contains('Ocupación').siblings('input').type('Abogado');

        // Guardar Parte
        cy.intercept('POST', '/api/v1/electronic_expedients/*/parties').as('postPartes');
        cy.get('@modalAgregarParte').contains('button', 'Guardar').click();
        cy.wait('@postPartes').then((interception) => {
            expect(interception.response.statusCode).to.be.equal(200);
            expect(interception.response.body.status).to.be.equal(true);
            expect(interception.response.body.code).to.be.equal(200);
            cy.writeFile('tmp/nuevaParteIngresada.json', interception.response.body.data);
            cy.wait(1000); // espera un segundo para que se actualice la vista
        })

        cy.get('form div .mb-2 .ti-trash').its('length').then((length) => {
            expect(length).to.be.greaterThan(cantidadPartes); // verifica que la cantidad de partes haya aumentado
        })
        
    })

    it('Permite eliminar partes del expediente ' , () => {
        
        cy.visit(environment.funcionarioURL);
        cy.hamburguer().click();
        cy.sidebar('Modificar expedientes').should('be.visible').click()
        cy.get('section.searcherContainer').find('input').type(`${testData.expediente.expedient_number}{enter}`);

        cy.get('section.procedures-table-container').find('tr').filter(`:contains("${testData.expediente.expedient_number}")`).as('expedienteRow');
        cy.get('@expedienteRow')
            .then(($row) => {
                expect($row.length).to.be.equal(1);
                cy.wrap($row).find('div.edit').click()
            });
        
        cy.intercept('**/api/v1/matters/get_list').as('getMatters');
        cy.intercept('**/api/v1/electronic_expedient/crimes/*').as('getCrimes');
        cy.wait(['@getMatters', '@getCrimes']).then((interceptions) => {
            cy.log('GET MATTERS : ' + JSON.stringify(interceptions[0]));
            cy.log('GET CRIMES : ' + JSON.stringify(interceptions[1]));
        })

        // aqui cambia la prueba respecto a la anterior para modificar en el modal

        cy.get('.user-select-none.mb-2').its('length').then((length) => {
            cy.wrap(length).as('totalPartes'); // cuenta las partes que ya existen
        })

        // regresa la cantidad de partes que existen en el expediente del tipo que se va a eliminar
        const getCantPartes = () => {
            return cy.document().then(() => {
                const selector = `.user-select-none.mb-2:contains("${tipoParte}")`;
            
                return cy.get('body').then(($body) => {
                const elementos = $body.find(selector);
                const cantidad = elementos.length;
                return cy.wrap(cantidad);
                });
            });
        };

        cy.intercept('DELETE', '**/api/v1/electronic_expedients/*/parties/*').as('deletePartes');

        getCantPartes().then((cantPartes) => { // cantidad de partes que existen antes de eliminar
            const cantidadPartes = cantPartes;
            expect(cantidadPartes).to.be.greaterThan(0);
        })

        function eliminarPartes() {
            return getCantPartes().then((cantPartes) => {
                if (cantPartes > 0) {
                    cy.log(`Eliminando parte. Quedan: ${cantPartes}`);
        
                    return cy.get('.user-select-none.mb-2')
                        .filter(`:contains("${tipoParte}")`)
                        .first()
                        .find('.ti-trash')
                        .click()
                        .then(() => {
                            cy.getModal('Eliminar Parte').contains('button', 'Eliminar').click();
                            cy.wait('@deletePartes');
                            cy.wait(1500);
                        })
                        .then(() => eliminarPartes()); // Recursión bien encadenada
                } else {
                    cy.log('No quedan partes por eliminar');
                }
            });
        }
        
        eliminarPartes(); // Inicia la limpieza
        

            
    })

});
