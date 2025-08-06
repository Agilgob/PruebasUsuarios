
const findInputInModal = function (modalName, label){
    cy.getModal(modalName).contains('label', label).parent().find('input').as('input');
    return cy.get('@input');
}


describe('Funcionario : Listar partes ', () => {


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
          
            cy.getCookie('authentication_token_03', { timeout: 5000 }).should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });


    it('El expediente puede ser localizado desde el buscador', () => {
        cy.buscarExpediente(testData); // support/funcionario/expediente.js
    });
    

    it('Puede crear partes' , () => {
        
        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }
        
        // Datos Personales
        let nombres = "Jose Mauel";
        let apellidoPaterno = "Perez";
        let apellidoMaterno = "Garcia";
        let alias = "Pepe";
        let edad = 30;
        let fechaNacimiento = {'dia': 1, 'mes': 'Enero', 'anio': '1990'};
        let sexo = "Masculino";
        let genero = "Heteronormatividad";
        let clasificacion = "Privado";
        let deseaMostrarCaratula = false;

        // Datos de contacto
        let correo = 'manuelValdez@agilgob.com';
        let telefono = '1231123123';
        let lugarResidencia = 'Calle 123, Colonia 456, Ciudad 789';

        // Transparencia
        let puedeLeerEscribir = "Si";
        let sabeHablarEspanol = "Si";
        let lenguaDialecto = "Español";
        let gradoEstudios = "Bachillerato";
        let estadoCivil = "No especifica";
        let nacionalidad = "MEXICANA";
        let ocupacion = "Pruebas automatizadas";
        let perteneceAComunidadIndigena = 'Si';
        let comunidadIndigena = 'Tarahumara';

        cy.visit(tramite.url, {failOnStatusCode: false});
        cy.clickListarPartes(); // support/funcionario/expediente
        cy.getModal('Listado de partes').should('be.visible');
        cy.getModal('Listado de partes').contains('p', 'Partes').parent().find('button').click()

        cy.llenarSelectModal('Tipo de parte', 'Tercero interesado')
        cy.get('div[aria-label="Button Parties Form"]').as('pestanasDatosPartes')

        // DATOS PERSONALES
        cy.llenarSelectModal('Régimen de la parte', 'Persona Física')
        findInputInModal('Listado de partes', '* Nombres').type(nombres, {delay: 0})
        findInputInModal('Listado de partes', 'Apellido Paterno').type(apellidoPaterno, {delay: 0})
        findInputInModal('Listado de partes', 'Apellido Materno').type(apellidoMaterno, {delay: 0})
        findInputInModal('Listado de partes', 'Alias').type(alias, {delay: 0})
        cy.llenarSelectModal('Edad', edad)
        cy.llenarSelectModal('Sexo', sexo)
        cy.llenarSelectModal('Género', genero)
        cy.llenarSelectModal('Clasificación', clasificacion)
        cy.contains('label', '¿Desea mostrar en caratula?').parent().find('input[type="checkbox"]').as('checkMostrarCaratula')
        if(deseaMostrarCaratula){
            cy.get('@checkMostrarCaratula').check()
        }else{
            cy.get('@checkMostrarCaratula').uncheck()
        }
        cy.get('[placeholder="Da clic y elige la fecha correspondiente"]').click()
        cy.get('.react-datepicker').should('be.visible').as('calendario')
        cy.get('@calendario')
            .find('.react-datepicker__header.react-datepicker__header--custom')
            .find('select').as('selects')
        
        cy.get('@selects').eq(0).select(fechaNacimiento.anio)
        cy.get('@selects').eq(1).select(fechaNacimiento.mes)
        cy.get('@calendario').find('.react-datepicker__month').contains(fechaNacimiento.dia).first().click()
        cy.screenshot('DATOS PERSONALES')


        // DATOS DE CONTACTO
        cy.get('@pestanasDatosPartes').find('button').contains('Datos de Contacto').click()
        findInputInModal('Listado de partes', 'Correo electrónico').type(correo, {delay: 0})
        findInputInModal('Listado de partes', 'Teléfono').type(telefono, {delay: 0})
        findInputInModal('Listado de partes', 'Lugar de residencia').type(lugarResidencia, {delay: 0})
        cy.screenshot('DATOS DE CONTACTO')

        // TRANSPARENCIA
        cy.get('@pestanasDatosPartes').find('button').contains('Transparencia').click()
        cy.llenarSelectModal('* ¿Puede Leer y Escribir?', puedeLeerEscribir)
        cy.llenarSelectModal('* ¿Sabe hablar español?', sabeHablarEspanol)
        findInputInModal('Listado de partes', 'Lengua o dialecto').type(lenguaDialecto, {delay: 0})
        cy.llenarSelectModal('* Grado de estudios', gradoEstudios)
        cy.llenarSelectModal('* Estado civil', estadoCivil)
        cy.llenarSelectModal('* Nacionalidad', nacionalidad)
        findInputInModal('Listado de partes', 'Ocupación').type(ocupacion, {delay: 0})
        
        cy.contains('label', '¿Pertenece a una comunidad indígena?').parent()
            .find(`input[type="radio"][value="${perteneceAComunidadIndigena.toLowerCase()}"]`).click()
        if(perteneceAComunidadIndigena == 'Si'){
            findInputInModal('Listado de partes', '¿A que comunidad indígena pertenece?').type(comunidadIndigena, {delay: 0})
        }
        cy.screenshot('TRANSPARENCIA')


        cy.intercept('**/api/v1/electronic_expedients/*/parties').as('guardarParte');
        cy.getModal('Listado de partes').find('button').contains('Guardar').click()
        cy.wait('@guardarParte').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.status).to.eq(true);
            cy.log("GUARDAR PARTE RESPONSE " + JSON.stringify(interception.response.body.data));
        })
        cy.contains('p', 'Partes', {timeout: 10000}).should('be.visible').then(() => {
            cy.screenshot('Parte guardada')
        })


    })

    it('Puede editar partes' , () => {
        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }
        cy.visit(tramite.url, {failOnStatusCode: false});
        cy.clickListarPartes(); // support/funcionario/expediente
        cy.getModal('Listado de partes').should('be.visible');
        cy.getModal('Listado de partes').find('.modal-body >  div > div ').filter(':contains("Tercero interesado")').first().click();
        cy.get('div[aria-label="Button Parties Form"]').as('pestanasDatosPartes')

        // DATOS DE CONTACTO
        cy.get('@pestanasDatosPartes').find('button').contains('Datos de Contacto').click()
        findInputInModal('Listado de partes', 'Correo electrónico').clear().type('otrocorreo@correo.com', {delay: 0})
        findInputInModal('Listado de partes', 'Teléfono').clear().type('99999999', {delay: 0})
        findInputInModal('Listado de partes', 'Lugar de residencia').clear().type('Calle del demandado 123', {delay: 0})
        cy.screenshot('EDICION DATOS DE CONTACTO')

        // TRANSPARENCIA
        cy.get('@pestanasDatosPartes').find('button').contains('Transparencia').click()
        cy.llenarSelectModal('* ¿Puede Leer y Escribir?', 'No')
        cy.llenarSelectModal('* Grado de estudios', 'Preescolar')
        findInputInModal('Listado de partes', 'Ocupación').clear().type("OTRA OCUPACION", {delay: 0})
        cy.contains('label', '¿Pertenece a una comunidad indígena?').parent()
            .find(`input[type="radio"][value="no"]`).click()
        cy.screenshot('EDICION TRANSPARENCIA')
        
        cy.intercept('PUT','**/api/v1/electronic_expedients/*/parties/*').as('editarParte');
        cy.getModal('Listado de partes').find('button').contains('Guardar').click()
        cy.wait('@editarParte').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.status).to.eq(true);
            cy.log("EDITAR PARTE RESPONSE " + JSON.stringify(interception.response.body.data));
        })

    })


    it('Puede eliminar partes' , () => {
        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }
        cy.visit(tramite.url, {failOnStatusCode: false});
        cy.clickListarPartes(); // support/funcionario/expediente
        cy.getModal('Listado de partes').should('be.visible');
        cy.getModal('Listado de partes').find('.modal-body >  div > div ').filter(':contains("Tercero interesado")').first().as('parte');
        cy.get('@parte').find('span[class="ti-trash"]').click();
        cy.contains('h5', '¿Estás seguro de eliminar la parte?').should('be.visible');

        cy.intercept('DELETE', '**/api/v1/electronic_expedients/*/parties/*').as('eliminarParte');
        cy.getModal('Listado de partes').find('button').contains('Eliminar').click();
        cy.wait('@eliminarParte').then((interception) => {
            cy.log("ELIMINAR PARTE RESPONSE " + JSON.stringify(interception.response.body));
        })
        cy.screenshot('Parte eliminada')
    })


});

// TODO Revisar porque termina bien la primer prueba pero no se muestra la parte en el listado
// por lo tanto el resto de las pruebas no se logran ejecutar (agregar una condicion para que lance un error mas claro)