
import { loadTestData, saveTestData } from '../../support/loadTestData';

const findInputInModal = function (modalName, label){
    cy.getModal(modalName).contains('label', label).parent().find('input').as('input');
    return cy.get('@input');
}


describe('Funcionario : Modificar expediente ', () => {

    let req;

    before(() => { 
        loadTestData();
        if(!testData.expedientFound) { // si es undefined o false
            testData.expedientFound = false;
        }
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
    
    it('Permite descargar reportes 1 Mes' , () => {
        
        cy.visit(environment.funcionarioURL);
        cy.hamburguer().click();
        cy.sidebar('Reportes').should('be.visible').click()
        
        cy.contains('b', '*Tipo de Reporte').parent().siblings('div').as('container')
        cy.get('@container').find('svg').click()
        cy.get('@container').find('div[class!="menu"]').contains('Reporte de expedientes').click()


        cy.contains('label', '*Fecha Inicial').siblings('input').as('fechaInicial');
        cy.contains('label', '*Fecha Final').siblings('input').as('fechaFinal');
        
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1); // Restar un mes
        
        // Función para formatear la fecha en mmddyyyy
        const formatDate = (date) => {
            let year = date.getFullYear();
            let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes en 2 dígitos
            let day = date.getDate().toString().padStart(2, '0'); // Día en 2 dígitos
            return `${year}-${month}-${day}`;
        };
        
        const fechaInicial = formatDate(lastMonth);
        const fechaFinal = formatDate(today);
        cy.get('@fechaInicial').type(fechaInicial);
        cy.get('@fechaFinal').type(fechaFinal);
        
        cy.intercept('GET', "**/reports/courts_reports?type_report=expedient&initial_date**").as('getReport');
        cy.contains('button', 'Generar').click();
        cy.wait('@getReport').then((intercept) => {
            // cy.writeFile('tmp/reporte.json', intercept.response);
            expect(intercept.response.statusCode).to.eq(200);
            expect(intercept.response.statusMessage).to.eq('OK');
       
            expect(intercept.response.url).to.contain(fechaInicial);
            expect(intercept.response.url).to.contain(fechaFinal);  
            
            expect(intercept.response.body).to.have.property('byteLength');
            expect(intercept.response.body.byteLength).to.be.greaterThan(0);
            req = intercept.request
        })

    })

    it('EXP 01 la fecha final es antes de la fecha de incio' , () => {
        const initialDate = '2025-03-01'
        const finalDate =  '2025-02-01'
        const query = `&initial_date=${initialDate}&final_date=${finalDate}`
        performRequest(query)
    })


    it('EXP 02 la fecha final es muy lejana en el tiempo' , () => {
        const initialDate = '2025-03-01'
        const finalDate =  '4000-02-01'
        const query = `&initial_date=${initialDate}&final_date=${finalDate}`
        performRequest(query)
    })

    it('EXP 03 la fecha inicial está en el futuro', () => {
        const initialDate = '3000-01-01'
        const finalDate = '3000-12-31'
        const query =  `&initial_date=${initialDate}&final_date=${finalDate}`
        performRequest(query)
    })

    it('EXP 04 la fecha inicial y la final son iguales', () => {
        const date = '2025-03-01'
        const query = `&initial_date=${date}&final_date=${date}`
        performRequest(query)
    })

    it('EXP 05 falta la fecha final', () => {
        const initialDate = '2025-03-01'
        const query = `&initial_date=${initialDate}`
        performRequest(query)
    })

    it('EXP 06 falta la fecha inicial', () => {
        const finalDate = '2025-03-01'
        const query = `&final_date=${finalDate}`
        performRequest(query)
    })

    it('EXP 07 formato de fecha inválido', () => {
        const initialDate = '01-03-2025' // Formato incorrecto (MM-DD-YYYY en lugar de YYYY-MM-DD)
        const finalDate = '03/10/2025'   // Otro formato inválido
        const query = `&initial_date=${initialDate}&final_date=${finalDate}`
        performRequest(query)
    })

    it('EXP 08 rango de fechas extremadamente corto', () => {
        const initialDate = '2025-03-01T12:00:00Z' // ISO con hora
        const finalDate = '2025-03-01T12:01:00Z'   // Un minuto después
        const query = `&initial_date=${initialDate}&final_date=${finalDate}`
        performRequest(query)
    })

    const performRequest = (query) => {
        let request = { ...req }
        request.url = request.url.split('&')[0]
        request.url = request.url + query
        cy.request({
            method: 'GET',
            url: request.url,
            headers: request.headers,
        }).then((response) => {
            cy.log('\n\n' + Cypress.currentTest.title )
            cy.log('QUERY: ' + query)
            cy.log('CODE: ' + response.body.code)
            cy.log('STATUS: ' + response.body.status)
            cy.log('STATUS TEXT: ' + response.statusText)
            cy.log('IS OK STATUS CODE: ' + response.isOkStatusCode)
            if(response.body.data){
                cy.log('MESSAGE: ' + JSON.stringify(response.body.data.message))
                if(response.body.data.error){
                    cy.log('ERRORS: ' + JSON.stringify(response.body.data.error))
                    throw new Error(response.body.data.message)
                }
            }
            cy.writeFile('tmp/response-courts_reports.json', response)
           
        })
    }

});




