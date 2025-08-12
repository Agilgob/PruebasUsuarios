
import { AltaNuevoExpediente , AgregarParte, ParteCreada} from '../../page/functionary/my-expedients/ModalNewExpedientRegistration';
import { ModalNewExpedientRegistration } from '../../page/functionary/my-expedients/ModalNewExpedientRegistration';
import { getExpedientDataByNumber} from '../../page/functionary/expediente';
import { PageMyExpedients, PageMyExpedientsCommands } from '../../page/functionary/PageMyExpedients';
import { createParty } from '../../support/faker';

describe('Agregar plantilla de sentencias', () => {



    let expedientCreated = false;
    const funcionario = Cypress.env('funcionario');
    const environment = Cypress.env('environment');
    let exp = null;
    
    before(() => {
        cy.fixture('expediente_funcionario').then((data) => {
            exp = data["tresPartes"]
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
           
        }, {
            cacheAcrossSpecs: true
        }); 
    });


    it('Carga los datos del expediente', () => {
       
        
        const myExpedientsCmd = new PageMyExpedientsCommands();
        const myExpedients = new PageMyExpedients();
        const modalNewExpedient = new ModalNewExpedientRegistration();
        const party = createParty({
            'partType' : 'Actor',
            'personalData' : {'regime': 'Persona Física'},

        });

        cy.visit(environment.funcionarioURL);
        cy.hamburguer().click();
        cy.sidebar('Expedientes').click();
        cy.sidebarExpedientes('Mis expedientes').click();

        myExpedients.btnAddExpedient().click();
        modalNewExpedient.modal().should('be.visible');
        modalNewExpedient.btnAddPart().should('be.visible').click()

        modalNewExpedient.fillMultiselectPartyType(party.partType)

        

        modalNewExpedient.tabPartSection('Datos Personales').scrollIntoView().should('be.visible').click()
        const pd = modalNewExpedient.sectionPartPersonalData;
            pd.fillMultiselectRegime(party.personalData.regime)
            pd.inputNames().type(party.personalData.firstName)
            pd.inputPaternalSurname().type(party.personalData.paternalLastName)
            pd.inputMaternalSurname().type(party.personalData.maternalLastName)
            pd.inputAlias().type(party.personalData.alias)
            pd.fillMultiselectAge(party.personalData.age)
            pd.inputBirthDate().type(party.personalData.birthDate)
            pd.fillMultiselectSex(party.personalData.sex)
            pd.fillMultiselectGender(party.personalData.gender)
            pd.fillMultiselectClassification(party.personalData.classification)


        modalNewExpedient.tabPartSection('Datos de Contacto').scrollIntoView().should('be.visible').click()
        const cd = modalNewExpedient.sectionPartContactData;
            cd.inputEmail().type(party.contactData.email)
            cd.inputPhoneNumber().type(party.contactData.phoneNumber)
            cd.inputResidence().type(party.contactData.residencePlace)


        modalNewExpedient.tabPartSection('Transparencia').scrollIntoView().should('be.visible').click()
        const t = modalNewExpedient.sectionPartTransparency;
            t.multiselectCanReadWrite(party.transparency.canReadWrite)
            t.multiselectSpeaksSpanish(party.transparency.speaksSpanish)
            t.inputLanguageOrDialect().type(party.transparency.languageOrDialect)
            t.multiselectEducationLevel(party.transparency.educationalLevel)
            t.multiselectMaritalStatus(party.transparency.maritalStatus)
            t.multiselectNationality(party.transparency.nationality)
            t.inputOccupation().type(party.transparency.occupation)

            t.radioBelongsToIndigenousCommunity(party.transparency.indigenousCommunity.answer).click()
            if(party.transparency.indigenousCommunity.answer == 'si'){
                t.inputEthnicGroup().type(party.transparency.indigenousCommunity.community)
            }
        
        // TODO Revisar que la parte se muestre en el listado de partes 
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