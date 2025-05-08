

const getShuffledUsers = () => {
	const allVars = Cypress.env('allVars');
	let usuarios = {};

	Object.keys(allVars).forEach((key) => {
	if (key.startsWith('FUNC_')) {
		const [base, tipo] = key.split(/_(EMAIL|PASSWORD)$/);

		if (!usuarios[base]) usuarios[base] = {};
		if (tipo === 'EMAIL') usuarios[base].correo = allVars[key];
		if (tipo === 'PASSWORD') usuarios[base].password = allVars[key];
	}
	});

	return Object.values(usuarios).filter(
		(user) => user.correo && user.password
		).sort(() => Math.random() - 0.5);
}


Cypress.on('uncaught:exception', (err, runnable) => {	return false;   });


const shuffledUsers = getShuffledUsers();
const environment = Cypress.env('environment');

describe('Inicia sesion con la lista de funcionarios', () => {

    beforeEach(() => {
        cy.visit(environment.funcionarioURL);
		cy.clearCookies();
		cy.clearLocalStorage();
    })

	context(`Pruebas de login en ambiente ${environment.environment}`, () => {
		shuffledUsers.forEach(cred => {

			it(`Es posible hacer login con: ${cred.correo}`, () => {
	
				cy.get('input[placeholder="Correo electrónico"]').as('email')
				cy.get('@email').should('be.visible')
				cy.get('@email').type(cred.correo)
				
				cy.get('input[placeholder="Password"]').as('password')
				cy.get('@password').should('be.visible')
				cy.get('@password').type(cred.password)
				
				cy.contains('Ingresar').should('be.visible')
	
				cy.intercept('POST', `**/api/v1/auth/sign_in`).as('login')
				cy.intercept('**').as('allRequests');
	
				cy.contains('Ingresar').click()
				cy.wait('@login').then((interception) => {
					const filename = interception.response.statusCode !== 200 ? 'FAILED' : 'SUCCESS';
					cy.wait('@allRequests').then((interceptionAll) => {
						cy.writeFile(`tmp/logins/${filename}-${cred.correo}.json`, interceptionAll).then(() => {
							if(filename === 'FAILED'){
								throw new Error(`Login failed for ${cred.correo}`);
							}
						})
					});
				})
				cy.contains('h3', "Tablero de control").should('be.visible')
	
				const submenu = ["Mis expedientes", "Expedientes enviados", "Buscar expediente", "Expedientes recibidos", 
					"Expedientes por recibir", "Promociones"
				]
	
				// submenu.forEach(item => {
				// 	pierdeElTiempoPicandoleAquiYAllaYAculla(item)
				// })
			});
		});
	})

});

const pierdeElTiempoPicandoleAquiYAllaYAculla = ( pestana = 'Buscar expediente' ) => {
	cy.hamburguer().click();
	cy.sidebar('Expedientes').click();
	cy.sidebarExpedientes(pestana).click();
	cy.wait(1000);
} 



