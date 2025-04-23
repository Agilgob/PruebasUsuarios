import { loadTestData } from '../../support/loadTestData';

const creds = {
	"correos" : ["m.laboral_oficialia@prueba.com",
				"m.laboral_acuerdos@prueba.com",
				"m.laboral_proyectista@prueba.com",
				"m.laboral_juez@prueba.com",
				"m.laboral_notificador@prueba.com",
				"m.familiar_oficialia@prueba.com",
				"m.familiar_acuerdos@prueba.com",
				"m.familiar_proyectista@prueba.com",
				"m.familiar_juez@prueba.com",
				"m.familiar_notificador@prueba.com",
				"m.civil_oficialia@prueba.com",
				"m.civil_acuerdos@prueba.com",
				"m.civil_proyectista@prueba.com",
				"m.civil_juez@prueba.com",
				"m.civil_notificador@prueba.com",
				"m.mercant_oficialia@prueba.com",
				"m.mercant_acuerdos@prueba.com",
				"m.mercant_proyectista@prueba.com",
				"m.mercant_juez@prueba.com",
				"m.mercant_notificador@prueba.com",
				"m.merco_oficialia@prueba.com",
				"m.merco_acuerdos@prueba.com",
				"m.merco_proyectista@prueba.com",
				"m.merco_juez@prueba.com",
				"m.merco_notificador@prueba.com"],
	"password" : "12345678"
};


describe('Inicia sesion con la lista ade funcionarios', () => {
    
    before(() => {
        loadTestData();
    })

    beforeEach(() => {
        cy.visit(environment.funcionarioURL);
    })

    creds.correos.forEach(correo => {
        it(`Es posible hacer login con: ${correo}`, () => {
            cy.loginFuncionario(correo, creds.password);
        });
    });

});