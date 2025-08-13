
describe('Valida las condiciones para el ingreso y confirmacion de contrasena', () => {

    const environment = Cypress.env('environment');

    const creds = [
        // Contraseña muy corta
        { description: 'La contrasena no tiene al menos 8 caracteres', values: ['Conr@s3', 'Conr@s3'] , valid: false},
        { description: 'La contrasena no tiene al menos 8 caracteres', values: ['Con1$', 'Con1$'], valid: false },

        // Sin caracter especial
        { description: 'No posee un caracter especial', values: ['Contrasena1', 'Contrasena1'] , valid: false},
        { description: 'No posee un caracter especial', values: ['Password123', 'Password123'] , valid: false},

        // Sin mayúsculas
        { description: 'No posee mayusculas', values: ['contrasena1$', 'contrasena1$'] , valid: false},
        { description: 'No posee mayusculas', values: ['clave123$', 'clave123$'], valid: false },

        // Sin minúsculas
        { description: 'No posee minusculas', values: ['CONTRASENA1$', 'CONTRASENA1$'], valid: false },
        { description: 'No posee minusculas', values: ['PASSWORD123$', 'PASSWORD123$'] , valid: false},

        // No tiene números
        { description: 'No posee numeros', values: ['Contrasena$', 'Contrasena$'], valid: false },
        { description: 'No posee numeros', values: ['Password@', 'Password@'] , valid: false},

        // Con espacios
        { description: 'Contiene espacios en blanco', values: ['Contra seña1$', 'Contra seña1$'], valid: false },
        { description: 'Contiene espacios en blanco', values: ['Mi clave@1', 'Mi clave@1'] , valid: false},

        // Caracteres inválidos
        { description: 'Contiene caracteres no permitidos (como comillas)', values: ['Contrase"1$', 'Contrase"1$'] , valid: true},
        { description: 'Contiene caracteres no permitidos (como comillas)', values: ["Contrase'1$", "Contrase'1$"] , valid: true},

        // No coinciden
        { description: 'Contrasena valida pero no coincide la confirmacion', values: ['Valid@123', 'valid@123'], valid: false },
        { description: 'Contrasena valida pero no coincide la confirmacion', values: ['Segura@2024', 'Segura@2025'] , valid: false},

        // Confirmación vacía
        { description: 'Contrasena valida pero confirmacion vacía', values: ['Valid@123', ''] , valid: false},
        { description: 'Contrasena valida pero confirmacion vacía', values: ['Valid@123', ' '] , valid: false},

        // Contraseña vacía
        { description: 'Confirmacion valida pero contrasena vacía', values: ['', 'Valid@123'] , valid: false},
        { description: 'Confirmacion valida pero contrasena vacía', values: [' ', 'Valid@123'], valid: false },

        // Caracteres especiales múltiples
        { description: 'Contrasena con caracteres especiales múltiples', values: ['Vali@d#1$', 'Vali@d#1$'] , valid: true},
        { description: 'Contrasena con caracteres especiales múltiples', values: ['123$%ABCabc', '123$%ABCabc'] , valid: true},

        // Contraseña muy larga
        { description: 'Contrasena extremadamente larga', values: ['Valid@123Valid@123Valid@123Valid@123', 'Valid@123Valid@123Valid@123Valid@123'] , valid: true},
        { description: 'Contrasena extremadamente larga', values: ['S3gura@2025ContrasenaExtendidaConMuchoTexto!', 'S3gura@2025ContrasenaExtendidaConMuchoTexto!'], valid: true },

        // Solo caracteres especiales
        { description: 'Contrasena con solo caracteres especiales', values: ['@#$%^&*!', '@#$%^&*!'], valid: false },
        { description: 'Contrasena con solo caracteres especiales', values: ['!@*#)(%^', '!@*#)(%^'] , valid: false},

        // Solo números
        { description: 'Contrasena con solo números', values: ['12345678', '12345678'], valid: false },
        { description: 'Contrasena con solo números', values: ['9876543210', '9876543210'] , valid: false},

        // Solo letras
        { description: 'Contrasena con solo letras', values: ['Contrasena', 'Contrasena'], valid: false },
        { description: 'Contrasena con solo letras', values: ['Password', 'Password'] , valid: false}
    ];




    creds.forEach(
        (cred) => {
            it(`${cred.description} ${cred.values[0]} ${cred.values[1]} `, () => {
                cy.visit(environment.ciudadanoURL + 'register')
                // cy.llenarSelect('Regimen Fiscal', 'Persona Fisica')
                cy.get('input[placeholder="Correo Electronico"]').type('example@agilgob.com')
                cy.get('input[placeholder="Contraseña"]').type(cred.values[0])
                cy.get('input[placeholder="Confirmar contraseña"]').type(cred.values[1])
                cy.wait(500);
                cy.get('div ul[style^="list-style"] li').then($items => {
                    const hasRed = Array.from($items).some(item => item.getAttribute('style') === 'color: red;');
                    const hasGreen = Array.from($items).some(item => item.getAttribute('style') === 'color: green;');
                    const visible = Cypress.$('li small').is(':visible');

                    if (cred.valid){
                        expect(hasRed).to.be.false;
                        expect(hasGreen).to.be.true;
                    }else{
                         expect(hasRed || visible).to.be.true;
                    }
                   
                    // expect(hasGreen).to.be.false;
                });
                // cy.get('li small').should('be.visible')
            })
        } 
    )

   
})


