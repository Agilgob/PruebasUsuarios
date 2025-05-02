import { en } from "@faker-js/faker";
import { accedeAlExpediente } from "../../support/ciudadano/expedientes";

const environment = Cypress.env('environment');
const ciudadano = Cypress.env('ciudadano');
const funcionario = Cypress.env('funcionario');


const functionarySession = () => {
    cy.visit(environment.funcionarioURL);
    cy.loginFuncionario(funcionario.email, funcionario.password);
    cy.getCookie('authentication_token_03').should('exist');
    cy.visit(environment.funcionarioURL);
}

const citizenSession = () => {
    cy.visit(environment.ciudadanoURL);
    cy.loginCiudadano(ciudadano.email, ciudadano.password);
    cy.wait(2000);
    cy.getCookie('authentication_token_02').should('exist');
    cy.visit(environment.ciudadanoURL);
}

describe('Documentos del expediente', () => {
  
    let documents;
    let permissions;
    let expedientNumber = Cypress.env('expedientNumber');
    let functionaryExpedientUrl; 

    describe('Validar permisos de los documentos desde el funcionario', () => {

        let permisosInicial = []; // Se carga en la primer prueba antes de cualquier cambio
        let permisosFinal = []; // Se carga en la prueba de verificacion del historial

        beforeEach(() => {
            cy.session('funcionario', () => {
                functionarySession();
            })
            cy.visit(environment.funcionarioURL);
        })

        it('FUNCIONARIO - Valida que los permisos se muestran correctamente en la tabla y el modal del documento', () => {

            // functionarySession();
            cy.hamburguer().click();
            cy.sidebar('Expedientes').click();
            cy.sidebarExpedientes('Buscar expediente').click();
            cy.get('.searcherContainer .inputSearcher').type(expedientNumber);
            cy.contains('.buttonsSearch button', "Buscar").click();
            cy.contains('tr td a', expedientNumber).parent().parent().as('expedienteEncontrado');

            cy.intercept('GET', '**/api/v1/document_expedients/documents/*/10?page=1').as('getDocuments');

            cy.get('@expedienteEncontrado').find('td a').click();

            cy.wait('@getDocuments').then((interception) => {
                // Obtiene los documentos del expediente
                const data = interception.response.body.data;

                documents = data.documents.reduce((acc, item) => {
                    acc[item.id] = item;
                    return acc;
                    }, {});
                
                cy.writeFile('tmp/Documents.json', documents , { log: false });
                expedientNumber = expedientNumber.replace(/\D/g, '-');
                const headers = interception.request.headers; // Defínelo aquí

                // LLAMAR A LA FUNCIÓN PASANDO LOS DOCUMENTOS Y HEADERS

                fetchDocumentPermissions(documents, Object.keys(documents), 0, {}, headers).then((_permissions) => {
                    permissions = _permissions;
                    permisosInicial = {...permissions};
                    cy.writeFile('tmp/Permissions.json', permissions, { log: false });
                    functionaryValidatePermissions(documents, permissions, 0, ciudadano.email);
                })
            });

            cy.url().then((url) => { functionaryExpedientUrl = url; cy.log(functionaryExpedientUrl)});
            

        });

        it('FUNCIONARIO - Habilita todos los permisos del documento', () => {
            cy.visit(functionaryExpedientUrl);

            cy.intercept('POST', `**/api/v1/docuemnts_expedient/document_expedient_users_permissions/*`)
            .as('postPermisosExpediente');


            cy.get('.document-expedient-table.procedures-table-container').as('tablaDocumentos');
            cy.get('@tablaDocumentos').find('tbody tr td.fixed-cell').as('tdControlDocumentos');
            cy.get('@tdControlDocumentos').each((element) => {
                cy.wrap(element).find('[title="Gestionar permisos"]').should('have.descendants', 'i').click()
                cy.get('.list-group.list-group-flush').as('tablaPermisos');
                cy.get('@tablaPermisos').should('be.visible');
                cy.get('@tablaPermisos').find('.custom-control.custom-switch > input[type="checkbox"]')
                    .then((checkbox) => {
                        if (checkbox.is(':checked')) {
                            cy.log('El permiso ya está habilitado para ' + element.text());
                            cy.contains('button', 'Cerrar').click()
                            cy.contains('button', 'Aceptar').click()

                        } else {
                            cy.get('@tablaPermisos').find('.custom-control.custom-switch').click();
                            cy.contains('button', 'Guardar').click()
                            cy.contains('button', 'Aceptar').click()
                            cy.wait('@postPermisosExpediente').then((interception) => {
                                //  Verificar que la petición se hizo correctamente
                                expect(interception.response.statusCode).to.eq(200); 

                                //  Revisar el request enviado
                                // cy.log(`Méthod: ${interception.request.method}`);
                                // cy.log(`URL: ${interception.request.url}`);
                                // cy.log(`Headers: ${JSON.stringify(interception.request.headers, null, 2)}`);
                                // cy.log(`Body: ${JSON.stringify(interception.request.body, null, 2)}`);
                                // TODO acumular en un array los permisos otorgados
                                expect(interception.request.body).to.have.property('users');
                                expect(interception.request.body.users).to.have.length.greaterThan(0);
                                expect(interception.request.body.users[0]).to.have.property('isPermissionEnabled');
                                expect(interception.request.body.users[0].isPermissionEnabled).to.be.true;
                            });
                        }
                    })            
            })
        })

        it('FUNCIONARIO - Deshabilita todos los permisos del documento', () => {
            // TODO Captura en un array los permisos retirados
        })

        it('FUNCIONARIO - Verifica que el historial de cambios se muestra correctamente', () => {
            // Captura el historial en la primer prueba 
            // Cambia el estado del documento 
            // Captura el historial en esta prueba 
            // Refresca pantalla, logout, login luego captura el historial
            // Compara los cambios
            cy.intercept('GET', '**/api/v1/document_expedients/documents/*/10?page=1').as('getDocuments');
            cy.visit(functionaryExpedientUrl);
            cy.wait('@getDocuments').then((interception) => {
                documents = interception.response.body.data.documents.reduce((acc, item) => {
                    acc[item.id] = item;
                    return acc;
                    }, {});

                fetchDocumentPermissions(documents, Object.keys(documents), 0, {}, headers).then((_permissions) => {
                    permisosFinal = _permissions;
                })
            })
        })

    })

    // it('CIUDADANO - Verifica que los documentos no se pueden ver por que no hay un acuerdo en la promocion', () => {
    //     // El expediente no debe tener acuerdos en ninguna de las promociones 
    //     citizenSession();
    //     if( documents.find((document) => document.document_type === 'agreement') !== undefined) {
    //         throw new Error('Tiene acuerdos, por lo que puede ser visible para el ciudadano');
    //     }        
    //     accedeAlExpediente(expedientNumber, environment);
    //     cy.get('section.procedures-table-container').as('procedures');
    //     cy.get('@procedures').should('exist')
    //         .and('not.be.visible')
    //         .and('be.hidden')
    //     // cy.get('@procedures').contains('a', 'Documentos').click();
           
    // })

});
  


/**
 * Recursively retrieves permissions for each document (dictionary input) and returns them as a Cypress chainable.
 * @param {Object} documentsDict - Dictionary of documents keyed by document ID.
 * @param {Array} keys - Array of document IDs to iterate over (automatically derived from documentsDict).
 * @param {number} index - Current index in the keys array.
 * @param {Object} permissions - Accumulator object for document permissions.
 * @param {Object} headers - Headers to use in the API requests.
 * @returns {Chainable<Object>} Cypress-wrapped permissions object.
 */
function fetchDocumentPermissions(documentsDict = {}, keys = Object.keys(documentsDict), index = 0, permissions = {}, headers = {}) {
    if (index >= keys.length) {
        return cy.wrap(permissions);
    }

    const documentId = keys[index];
    const document = documentsDict[documentId];

    return cy.request({
        method: 'GET',
        url: `${environment.modeladorURL}api/v1/docuemnts_expedient/get_user_permissions/${document.id}`,
        headers: headers,
    }).then((response) => {
        expect(response.status).to.eq(200);
        permissions[document.id] = response.body.data;

        // Continue with next document
        return fetchDocumentPermissions(documentsDict, keys, index + 1, permissions, headers);
    });
}



function functionaryValidatePermissions(documents = Object, permissions = Object, index = 0, citizenEmail = String) {
    
    if (index >= Object.keys(documents).length) {
        return;
    }

    const document = documents[Object.keys(documents)[index]];
    const documentPermissions = filterPermission(document, permissions, citizenEmail);

    if(!documentPermissions) {
        throw new Error('No se encontraron permisos para el documento para el ciudadano ' + citizenEmail + ' revisa las variables de entorno');
    }
    console.log('documentPermissions', documentPermissions)
    
    // Check if the document is in the list
    cy.get('section.document-expedient-table tbody tr', { timeout: 10000 }) // espera hasta 10s si es necesario
        .should('exist') // espera que existan
        .filter(`:contains("${document.alias}")`)
        .filter(`:contains("${document.filename}")`)
        .first()
        .scrollIntoView()
        .should('be.visible')
        .as('documentRow');

    
    // Check if the document has the button to download/view
    cy.get('@documentRow').find('[title="Descargar / Visualizar"]').should('exist').should('be.visible')
    
    // Check if the document has the button to manage permissions and click it
    cy.get('@documentRow').find('[title="Gestionar permisos"]').should('exist').should('be.visible')
        .should('have.descendants', 'i').click()
    
    // Check if the modal is visible
    cy.get('.list-group.list-group-flush').as('tablaPermisos');
    cy.get('@tablaPermisos').should('be.visible');
    cy.get('@tablaPermisos').find('.custom-control.custom-switch > input[type="checkbox"]')
        .then((checkbox) => {
            expect(checkbox.is(':checked')).to.eq(documentPermissions.isPermissionEnabled) // Validate if the checkbox is checked or not
            cy.contains('button', 'Cerrar', {timeout:10000}).click()
            cy.contains('button', 'Aceptar', {timeout:10000}).click()
        })

    functionaryValidatePermissions(documents, permissions, index + 1, citizenEmail); // Recursive call to check the next document
}


function filterPermission(document = Object, permissions = Object, citizenEmail = String) {
    const permissionObj = permissions[document.id];
    return permissionObj.users.find(
        (user) => user.email === citizenEmail
    );
}

function expedientHaveAgreements(expedient = Object) {
    
}




const modifyAllDocumentPermissions = (desiredStatus = ':checked', validate = (interception) => {}) => {
    cy.intercept('POST', `**/api/v1/docuemnts_expedient/document_expedient_users_permissions/*`)
    .as('postPermisosExpediente');


    cy.get('.document-expedient-table.procedures-table-container').as('tablaDocumentos');
    cy.get('@tablaDocumentos').find('tbody tr td.fixed-cell').as('tdControlDocumentos');
    let results = [];
    cy.get('@tdControlDocumentos').each((element) => {
        cy.wrap(element).find('[title="Gestionar permisos"]').should('have.descendants', 'i').click()
        cy.get('.list-group.list-group-flush').as('tablaPermisos');
        cy.get('@tablaPermisos').should('be.visible');
        cy.get('@tablaPermisos').find('.custom-control.custom-switch > input[type="checkbox"]')
            .then((checkbox) => {
                if (checkbox.is(desiredStatus)) {
                    cy.log('El permiso ya está habilitado para ' + element.text());
                    cy.contains('button', 'Cerrar').click()
                    cy.contains('button', 'Aceptar').click()

                } else {
                    cy.get('@tablaPermisos').find('.custom-control.custom-switch').click();
                    cy.contains('button', 'Guardar').click()
                    cy.contains('button', 'Aceptar').click()
                    cy.wait('@postPermisosExpediente').then((interception) => {

                        validate(interception);
                        results.concat(interception.request.body);
                        //  Verificar que la petición se hizo correctamente
                        // expect(interception.response.statusCode).to.eq(200); 

                        // //  Revisar el request enviado
                        // // cy.log(`Méthod: ${interception.request.method}`);
                        // // cy.log(`URL: ${interception.request.url}`);
                        // // cy.log(`Headers: ${JSON.stringify(interception.request.headers, null, 2)}`);
                        // // cy.log(`Body: ${JSON.stringify(interception.request.body, null, 2)}`);
                        // // TODO acumular en un array los permisos otorgados
                        // expect(interception.request.body).to.have.property('users');
                        // expect(interception.request.body.users).to.have.length.greaterThan(0);
                        // expect(interception.request.body.users[0]).to.have.property('isPermissionEnabled');
                        // expect(interception.request.body.users[0].isPermissionEnabled).to.be.true;
                    });
                }
            })            
    })
    return cy.wrap(results);
}
