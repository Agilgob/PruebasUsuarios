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

    describe('01 FUNCIONARIO - Validar permisos de los documentos desde el funcionario', () => {


        let permissionsFinal = []; // Se carga en la prueba de verificacion del historial
        let documentsFinal = [];

        beforeEach(() => {
            cy.session('funcionario', () => {
                functionarySession();
            })
            cy.visit(environment.funcionarioURL);
        })

        it('Valida que los permisos se muestran correctamente en la tabla y el modal del documento', () => {

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
                    // permisosInicial = {...permissions};
                    cy.writeFile('tmp/Permissions.json', permissions, { log: false });
                    functionaryValidatePermissions(documents, permissions, 0, ciudadano.email);
                })
            });

            cy.url().then((url) => { functionaryExpedientUrl = url; cy.log(functionaryExpedientUrl)});
            

        });

        it('Habilita todos los permisos del documento', () => {
            cy.visit(functionaryExpedientUrl);

            const validate = (interception) => {
                expect(interception.response.statusCode).to.eq(200); 
                expect(interception.request.body).to.have.property('users');
                expect(interception.request.body.users).to.have.length.greaterThan(0);
                expect(interception.request.body.users[0]).to.have.property('isPermissionEnabled');
                expect(interception.request.body.users[0].isPermissionEnabled).to.be.true;
            }
            modifyAllDocumentPermissions(':checked', validate).then((permisosOtorgados) => {
                cy.writeFile('tmp/PermisosOtorgados.json', permisosOtorgados, { log: false });
            })
            
        })

        it('Deshabilita todos los permisos del documento', () => {
            cy.visit(functionaryExpedientUrl);

            const validate = (interception) => {
                expect(interception.response.statusCode).to.eq(200); 
                expect(interception.request.body).to.have.property('users');
                expect(interception.request.body.users).to.have.length.greaterThan(0);
                expect(interception.request.body.users[0]).to.have.property('isPermissionEnabled');
                expect(interception.request.body.users[0].isPermissionEnabled).to.be.false;
            }

            modifyAllDocumentPermissions(':not(:checked)', validate).then((permisosDenegados) => {
                cy.writeFile('tmp/PermisosDenegados.json', permisosDenegados, { log: false });
            })
        })

        it('Verifica que el historial de cambios se registra y muesrtra correctamente', () => {

            cy.intercept('GET', '**/api/v1/document_expedients/documents/*/10?page=1').as('getDocuments');
            cy.visit(functionaryExpedientUrl);
            cy.wait('@getDocuments').then((interception) => {

                const data = interception.response.body.data;

                documentsFinal = data.documents.reduce((acc, item) => {
                    acc[item.id] = item;
                    return acc;
                    }, {});
                
                cy.writeFile('tmp/DocumentsFinal.json', documentsFinal , { log: false });

                const headers = interception.request.headers; 
                fetchDocumentPermissions(documentsFinal, Object.keys(documentsFinal), 0, {}, headers).then((permissionsFinal) => {
                    cy.writeFile('tmp/PermisosFinal.json', permissionsFinal, { log: false });
                    functionaryValidatePermissions(documents, permissionsFinal, 0, ciudadano.email);
                    functionaryValidateHistory(documentsFinal, permissions, permissionsFinal, ciudadano.email);
                })

            });
        }) 

    })

    describe('02 Ciudadano - No debe ver los documentos del expediente', () => {
        // Estas pruebas estan pensadas para que el ciudadano no pueda ver los documentos del expediente
        // aunque no se generara un falso positivo si a caso se cuenta con un acuerdo en la promocion 
        beforeEach(() => {
            cy.session('ciudadano', () => {
                citizenSession();
            })
            cy.visit(environment.ciudadanoURL);
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


function functionaryValidateHistory(documents = {}, permissionsThen = {}, permissionsNow = {}, citizenEmail = ''){


    function validateHistoryStructure(historyObject = Object) {

        expect(historyObject).to.have.all.keys('id', 'email', 'username', 'fullname', 'isPermissionEnabled', 'visibility_date', 'history');
        historyObject.history.forEach((entry) => {
            expect(entry).to.have.all.keys('active', 'updated_at');
            expect(entry.active).to.be.a('boolean');
            expect(entry.updated_at).to.be.a('string');
          });
    }

    function iterate(index = 0, documents = Object, permissionsThen = Object, permissionsNow = Object, citizenEmail = String) {
        if (index >= Object.keys(documents).length) {
            return;
        }

        const document = documents[Object.keys(documents)[index]];
        const documentPermissionsThen = filterPermission(document, permissionsThen, citizenEmail);
        const documentPermissionsNow = filterPermission(document, permissionsNow, citizenEmail);

        validateHistoryStructure(documentPermissionsThen);
        validateHistoryStructure(documentPermissionsNow);
        expect(documentPermissionsThen.history.length).to.be.greaterThan(0); // History cant be empty at the beginning
        expect(documentPermissionsNow.history.length).to.be.greaterThan(0); // History cant be empty at the end
        expect(documentPermissionsThen.history[0].active).to.eq(documentPermissionsNow.isPermissionEnabled); // Last history must be the same as the current status
        expect(documentPermissionsThen.history.length).to.lessThan(documentPermissionsNow.history.length); // History count at the beginning must be less than the history count at the end

        iterate(index + 1, documents, permissionsThen, permissionsNow, citizenEmail); // Recursive call to check the next document
    }

    iterate(0, documents, permissionsThen, permissionsNow, citizenEmail); 
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


/**
 * Filters and retrieves a specific user's permission for a given document.
 *
 * @param {Object} document - The document object containing an `id` property.
 * @param {Object} permissions - An object where keys are document IDs and values are permission objects.
 * @param {string} citizenEmail - The email of the citizen whose permission is being searched for.
 * @returns {Object|undefined} - The permission object for the specified user, or `undefined` if not found.
 */
function filterPermission(document = Object, permissions = Object, citizenEmail = String) {
    const permissionObj = permissions[document.id];
    return permissionObj.users.find(
        (user) => user.email === citizenEmail
    );
}


/**
 * Modifies the permissions of all documents in an expedient based on the desired status.
 * 
 * @param {string} [desiredStatus=':checked'] - The expected status of the checkboxes. 
 *                                              It can be `:checked` or `:not(:checked)`.
 * @param {function} [validate=() => {}] - A callback function to validate the `interception` 
 *                                         of the POST request that modifies the document permissions.
 *                                         The `interception` object contains details about the request and response.
 * @returns {Cypress.Chainable<Array>} - A Cypress chainable that resolves to an array of request bodies 
 *                                       sent during the POST requests for modifying permissions.
 */
const modifyAllDocumentPermissions = (desiredStatus = ':checked', validate = () => {}) => {
    const results = [];
  
    cy.intercept('POST', '**/api/v1/docuemnts_expedient/document_expedient_users_permissions/*')
      .as('postPermisosExpediente');
  
    cy.get('.document-expedient-table.procedures-table-container').as('tablaDocumentos');
    cy.get('@tablaDocumentos').find('tbody tr td.fixed-cell').as('tdControlDocumentos');
  
    cy.get('@tdControlDocumentos').each((element) => {
      cy.wrap(element).find('[title="Gestionar permisos"]').should('have.descendants', 'i').click();
      cy.get('.list-group.list-group-flush').as('tablaPermisos');
      cy.get('@tablaPermisos').should('be.visible');
      cy.get('@tablaPermisos')
        .find('.custom-control.custom-switch > input[type="checkbox"]')
        .then((checkbox) => {
          if (checkbox.is(desiredStatus)) {
            cy.log('El permiso ya está habilitado para ' + element.text());
            cy.contains('button', 'Cerrar').click();
            cy.contains('button', 'Aceptar').click();
          } else {
            cy.get('@tablaPermisos').find('.custom-control.custom-switch').click();
            cy.contains('button', 'Guardar').click();
            cy.contains('button', 'Aceptar').click();
            cy.wait('@postPermisosExpediente').then((interception) => {
              validate(interception);
              results.push(interception.request.body);
            });
          }
        });
    });
  
    return cy.then(() => results); 
  };
  
