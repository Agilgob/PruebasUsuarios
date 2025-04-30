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
            
            cy.writeFile('tmp/Documents.json', { documents }, { log: false });
            expedientNumber = expedientNumber.replace(/\D/g, '-');
            const headers = interception.request.headers; // Defínelo aquí

            // LLAMAR A LA FUNCIÓN PASANDO LOS DOCUMENTOS Y HEADERS

            fetchDocumentPermissions(documents, Object.keys(documents), 0, {}, headers).then((_permissions) => {
                permissions = _permissions;
                cy.writeFile('tmp/Permissions.json', { permissions }, { log: false });

            // fetchDocumentPermissions(documents, 0, {}, headers).then((_permissions) => {
            //     permissions = _permissions;
            //     cy.writeFile('tmp/Permissions.json', { permissions }, { log: false });
                console.log(permissions)
                console.log(documents)
            //     // functionaryValidatePermissions(documents, permissions);
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



// Validations for the permissions
function functionaryValidatePermissions(documents = Object, permissions = Object) {
    cy.log('Numero de documentos: ' + Object.keys(documents).length);
    cy.log('Numero de permisos: ' + Object.keys(permissions).length);
    cy.log('Iniciando revision de cada uno de los permisos desde el funcionario')

    const docs = Object.keys(documents);

    execute(documents, permissions, ciudadano.email, docs, 0);

    function execute(documents, permissions, citizenEmail, docs = Array, index = 0 ) {
        if (index >= docs.length) {
            return;
        }

        const docId = docs[index];
        const document = documents[docId];
        const documentPermissions = permissions.users.filter(
            (user) => user.email === citizenEmail
        )
        
        cy.get('section.document-expedient-table tbody').get('tr').filter(`contains("${doc.alias}")`)
            .filter(`contains("${doc.filename}")`).first().scrollIntoView().should('exist').and('be.visible')
            .as('documentRow')
        
        cy.get('@documentRow').find('[title="Descargar / Visualizar"]').should('exist').should('be.visible')
        
        cy.get('@documentRow').find('[title="Gestionar permisos"]').should('exist').should('be.visible')
            .should('have.descendants', 'i').click()
       
        cy.get('.list-group.list-group-flush').as('tablaPermisos');
        cy.get('@tablaPermisos').should('be.visible');
        cy.get('@tablaPermisos').find('.custom-control.custom-switch > input[type="checkbox"]')
            .then((checkbox) => {

                expect(checkbox.is(':checked')).to.eq(documentPermissions.isPermissionEnabled)
                cy.contains('button', 'Cerrar', {timeout:10000}).click()
                cy.contains('button', 'Aceptar', {timeout:10000}).click()
            })

        execute(documents, permissions, citizenEmail, docs, index + 1); 
    }



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



  
  
  