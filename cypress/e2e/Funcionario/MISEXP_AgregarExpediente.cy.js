
import { AltaNuevoExpediente , AgregarParte, ParteCreada} from '../../page/functionary/my-expedients/ModalNewExpedientRegistration';
import { ModalNewExpedientRegistration , ModalNewExpedientRegistrationCommands} from '../../page/functionary/my-expedients/ModalNewExpedientRegistration';
import { getExpedientDataByNumber} from '../../page/functionary/expediente';
import { PageMyExpedients, PageMyExpedientsCommands } from '../../page/functionary/PageMyExpedients';
import { createParty } from '../../support/faker';
import { newExpedientNumber } from '../../utilities/random';

describe('Agregar plantilla de sentencias', () => {

    let expedientCreated = false;
    let parties = [];
    let exp = null;
    const funcionario = Cypress.env('funcionario');
    const environment = Cypress.env('environment');
    const myExpedientsCmd = new PageMyExpedientsCommands();
    const myExpedients = new PageMyExpedients();
    const modalNewExpedient = new ModalNewExpedientRegistration();
    const modalNewExpedientCmd = new ModalNewExpedientRegistrationCommands();
    const expedientNumber = newExpedientNumber();

    before(() => {
        cy.fixture('expediente_funcionario').then((data) => {
            exp = data["tresPartes"]
        })

        parties.push(createParty({'partyType' : 'Actor','personalData' : {'regime': 'Persona Moral'}}))
        parties.push(createParty({'partyType' : 'Actor','personalData' : {'regime': 'Persona Física'}}))

        parties.push(createParty({'partyType' : 'Tercero Interesado','personalData' : {'regime': 'Persona Física'}}))
        parties.push(createParty({'partyType' : 'Tercero Interesado','personalData' : {'regime': 'Persona Física'}}))

        parties.push(createParty({'partyType' : 'Demandado','personalData' : {'regime': 'Persona Física'}}))
        parties.push(createParty({'partyType' : 'Demandado','personalData' : {'regime': 'Persona Física'}}))

        parties.push(createParty({'partyType' : 'Abogado Patrono del Actor', 'personalData' : {'regime': 'Persona Física'}}))

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

        myExpedients.btnAddExpedient().click();

        
        modalNewExpedient.modal().should('be.visible');
        modalNewExpedient.inputExpedientNumber().type(expedientNumber)
        modalNewExpedient.setModalTitle(expedientNumber); // The modal changes its name when the expedient number is set
        modalNewExpedient.modal().should('be.visible'); // Validate modal name 
        modalNewExpedient.fillMultiselectAddressee(funcionario.nombre)

        // TODO agregar metodos para seleccionar partes cuando el tipo es defensor (tercero interesado, actor, demandado)
        parties.forEach((party) => {
            modalNewExpedient.btnAddPart().scrollIntoView().should('be.visible').click()

            modalNewExpedient.fillMultiselectPartyType(party.partyType)

            modalNewExpedient.tabPartSection('Datos Personales').scrollIntoView().should('be.visible').click()
            modalNewExpedientCmd.fillSectionPersonalData(party.personalData)

            modalNewExpedient.tabPartSection('Datos de Contacto').scrollIntoView().should('be.visible').click()
            modalNewExpedientCmd.fillSectionContactData(party.contactData)

            modalNewExpedient.tabPartSection('Transparencia').scrollIntoView().should('be.visible').click()
            modalNewExpedientCmd.fillSectionTransparency(party.transparency)
            
            modalNewExpedient.btnSave().scrollIntoView().should('be.enabled').and('be.visible').click()
            let createdPartRow = modalNewExpedient.divRowPartCreated(party)
            createdPartRow.divRow().scrollIntoView().should('be.visible')
        })


        //     cy.wait(1000)
        //     createdPartRow.iconTrash().should('be.visible').click()
        //     cy.wait(1000)
        //     createdPartRow.btnCancelDeletion().should('be.visible').click()
        //     cy.wait(1000)
        //     createdPartRow.iconTrash().click()
        //     cy.wait(1000)
        //     createdPartRow.btnConfirmDeletion().should('be.visible').click()
        //     cy.wait(1000)
            // createdPartRow
        
        // modalNewExpedient.fillMultiselectJudgeType('random')
        // modalNewExpedient.fillMultiselectWay('random')
        // modalNewExpedient.fillMultiselectMatter('random')
        // modalNewExpedient.fillMultiselectPrincipalAction('random')
        // modalNewExpedient.fillMultiselectPrincipalAction('random')
        // modalNewExpedient.fillMultiselectPrincipalAction('random')
        // modalNewExpedient.textAreaObservation().type(`Prueba ejecutada el: ${new Date().toLocaleString()} por ManuelBot`)
        // modalNewExpedient.btnSend()

        // TODO Crear una funcion para ingresar el CURP y el RFC de las personas morales
        
        //     agregarParte.guardarBtn().click();

        //     const parteCreada = new ParteCreada(parte);
        //     parteCreada.registroDiv().scrollIntoView().should('exist');
        //     cy.screenshot(`parte-${parte.datosPersonales.nombres}-${parte.datosPersonales.apellidoPaterno}`);
        //     parteCreada.registroDiv().should('contain', parte.datosPersonales.nombres);
        //     parteCreada.registroDiv().should('contain', parte.datosPersonales.apellidoPaterno);
        //     parteCreada.registroDiv().should('contain', parte.datosPersonales.apellidoMaterno);

        // })
        
        // cy.intercept("POST", "**/api/v1/government_books/release").as("release");
        // altaExp.enviarBtn().click();
        // cy.wait("@release").then((interception) => {
        //     const expediente = interception.response.body.data.governmentBook;
        //     expect(interception.response.statusCode).to.equal(200);
        //     expect(interception.response.body.code).to.equal(200);
        //     expect(interception.response.body.data.message).to.equal("El expediente ha sido transferido correctamente");
        //     cy.writeFile("tmp/expediente-creado-funcionario.json" , expediente);
        // })
    }) 
    
    // after(() => {
    //     if (expedientCreated) {
    //         cy.visit(environment.funcionarioURL);
    //         getExpedientDataByNumber(exp.numeroExpediente).then((expedientData) => {
    //             cy.url().then((url) => {
    //                 expedientData['tramite'] = { url };
    //                 expedientData['expedientFound'] = true;
    //                 expedientData['expedientCreated'] = true
    //                 console.log(expedientData); 
    //                 cy.writeFile('tmp/testData.json', expedientData, { log: false });
    //             });
                
    //         })
    //     }
    // });

    
})