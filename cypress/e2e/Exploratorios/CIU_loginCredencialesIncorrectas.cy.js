
const environment = Cypress.env('environment');
const ciudadano = Cypress.env('ciudadano');

describe('Login CIUDADANO con credenciales falsas', () => {

    let urlToPost;
    let headers;
    const passwords = [
        '*******', '?????????', '--?', '--', ' -- OR true', 
        '123456', 'password', '     ', "' OR '1'='1", "<script>alert(1)</script>",
        'a', "' OR '1'='1",  "' OR 1=1 --", "' OR '' = '", "admin' --", "admin' #",
      ];

    const emails = [
        "' OR '1'='1",
        "usuario' --",
        "<script>alert('XSS')</script>",
        "'><img src=x onerror=alert(1)>",
        'a@b.co',                             
        'a'.repeat(320) + '@dominio.com',
        '"usuario"@dominio.com',
        'usuario+test@dominio.com',
        'usuario@sub.dominio.com',
        'usuario',                  // sin dominio
        'usuario@',                 // sin TLD
        'usuario@dominio',          // sin punto
        'usuario@.com',             // dominio inválido
        '@dominio.com',             // sin nombre
        'usuario@dominio..com',     // doble punto
        'usuario@dominio.c',        // TLD muy corto
        'usuario@@dominio.com',     // doble arroba
    ];
    
    beforeEach(() => {
        cy.visit(environment.ciudadanoURL);
        cy.get('input[placeholder="Contraseña"]').as('password')
        cy.get('input[placeholder="Correo electrónico"]').as('email')
        cy.intercept('POST', `**/api/v1/auth/sign_in`).as('loginPost')
        cy.contains('Entrar').as('btnLogin')
    });

    it("Password falsos", () => {
        const email = ciudadano.email;

        passwords.forEach((password) => {

            cy.get('@email').clear().type(email);   
            cy.get('@password').clear().type(password);
            cy.get('@btnLogin').click();
            cy.wait('@loginPost').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
                expect(interception.response.body.data.code).to.eq(401);
                expect(interception.response.body.status).to.eq(false);
                console.log(interception);

                urlToPost = interception.request.url;
                headers = interception.request.headers;

            });
        })
    });



    it("Correos falsos", () => {

        const password = "12345678"; 
        
        cy.get('@email').invoke('attr', 'type', 'text');
        emails.forEach((email) => {
            cy.get('@email').clear().type(email);   
            cy.get('@password').clear().type(password);
            cy.get('@btnLogin').click();
        
            cy.wait('@loginPost', { timeout: 3000 }).then((interception) => {
                if (interception) {
                    expect(interception.response.statusCode).to.eq(200);
                    expect(interception.response.body.data.code).to.eq(401);
                    expect(interception.response.body.status).to.eq(false);
                }
            })
        });

    });

});

    