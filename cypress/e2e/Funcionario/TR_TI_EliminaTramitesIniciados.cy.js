import { loadTestData, saveTestData } from '../../support/loadTestData';

const environment = Cypress.env('environment');
const funcionario = Cypress.env('funcionario');

describe('Elimina los tramites iniciados del funcionario', () => {



    beforeEach(() => {
        cy.iniciarSesionFuncionario(funcionario.email, funcionario.password, environment);
    });
    
    it('Permite eliminar TODOS los tramites iniciados', () =>{
        cy.visit(environment.funcionarioURL);
        cy.get('.one_column .fa-align-justify').click();
        cy.get('[title="Sección de trámites"]').click();
        cy.get('.principal-nav > .container').as('barraMenuTramites');
    
        cy.screenshot('Se deben cancelar todos los trámites de la tabla');
        cy.get('@barraMenuTramites').contains('Trámites iniciados').click();
        cy.wait(4000)
    
        eliminarTramite();
    
        function eliminarTramite() {
            cy.get('.table.table-bordered').then(($table) => {
                if($table.children().length > 1){

                    cy.get('.table.table-bordered tbody tr').then(($rows) => {
                        if ($rows.length > 0) {
                            cy.get('td .trash').first().click(); // Clic en el primer icono de eliminación
            
                            cy.get('.modal-dialog button')
                                .contains('Eliminar')
                                .should('be.visible')
                                .click()
                                .then(() => {
                                    cy.wait(1000);
                                    eliminarTramite(); // Llamado recursivo para eliminar el siguiente elemento
                                });
                        } else {
                            cy.log('No hay más trámites para eliminar');
                            done(); // Finalizar la prueba exitosamente
                        }
                    });

                }else{
                    cy.log('No hay trámites en la tabla');
                    return
                }
            })
        
        }   

    });
        
});
