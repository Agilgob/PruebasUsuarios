import { en } from "@faker-js/faker";

const environment = Cypress.env('environment');
const ciudadano = Cypress.env('ciudadano');
const funcionario = Cypress.env('funcionario');


const functionarySession = () => {
    // cy.session('funcionario', () => {
        cy.visit(environment.funcionarioURL);
        cy.loginFuncionario(funcionario.email, funcionario.password);
        cy.getCookie('authentication_token_03').should('exist');
    // }, {
    //     cacheAcrossSpecs: true
    // }); 
    cy.visit(environment.funcionarioURL);
}

const citizenSession = () => {
    // cy.session('ciudadano', () => {
        cy.visit(environment.ciudadanoURL);
        cy.loginCiudadano(ciudadano.email, ciudadano.password);
        cy.wait(2000);
        cy.getCookie('authentication_token_02').should('exist');
    // }, {
    //     cacheAcrossSpecs: true
    // });
    cy.visit(environment.ciudadanoURL);
}

describe('Manejar sesiones funcionario y ciudadano', () => {
  
    let documents;
    let permissions;
    let expedientNumber = Cypress.env('expedientNumber');
  
    it('FUNCIONARIO - Captura documentos y permisos del expediente', () => {
        functionarySession();
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
                cy.writeFile('tmp/Permissions.json', permissions, { log: false });
                // console.log(permissions)
                // console.log(documents)
                functionaryValidatePermissions(documents, permissions, 0, ciudadano.email);
            })
        });



    });





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

    const document = documents[Object.keys(documents)[index]]
    cy.log('document', document)
    const documentPermissions = filterPermission(document, permissions, citizenEmail);
    if(!documentPermissions) {
        throw new Error('No se encontraron permisos para el documento para el ciudadano ' + citizenEmail + ' revisa las variables de entorno');
    }
    console.log('documentPermissions', documentPermissions)
    
    // Check if the document is in the list
    cy.get('section.document-expedient-table tbody').get('tr').filter(`:contains("${document.alias}")`)
        .filter(`:contains("${document.filename}")`).first().scrollIntoView().should('exist').and('be.visible')
        .as('documentRow')
    
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
    console.log('document', document)
    console.log('permissions', permissions)
    const permissionObj = permissions[document.id];
    
    return permissionObj.users.find(
        (user) => user.email === citizenEmail
    );
}

    // https://sandbox.nilo.cjj.gob.mx/api/v1/docuemnts_expedient/get_user_permissions/24206
    // https://sandbox.funcionario.cjj.gob.mx/api/v1/docuemnts_expedient/get_user_permissions/24206

    // it('Login como ciudadano', () => {
    //     citizenSession();
    //     cy.wait(2000);
    // });
    
    // it('Accede como funcionario again', () => {
    //     functionarySession();
    //     cy.wait(2000);
    // });

    // it('Login como ciudadano again', () => {
    //     citizenSession();
    //     cy.wait(2000);
    // });



  
  
