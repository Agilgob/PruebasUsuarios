describe('Crear Usuario - Pruebas de Ciudadano', () => {

    const usuario = {
        regimen : 'Persona Fisica',
        correo : 'manuel@agilgob.com',
        genero : "Hombre",
        edad : 25, 
        fechaNacimiento : '1998-01-01',
        calle : 'Calle Falsa',
        numeroExterior : '123',
        numeroInterior : '456',
        colonia : 'Colonia Falsa',
        municipio : 'Guadalajara',
        cp : '44100',
        password : 'password123',
        confirmarPassword : 'password123'
    }

    beforeEach(() => {
        cy.visit('http://localhost:3000/'); // Reemplaza con la URL de tu aplicación
    });

    it('Crear un nuevo usuario', () => {
        cy.contains('a', 'aquí').click(); // Cambia 'aqui' por el texto del enlace que deseas hacer clic
        cy.url().should('include', '/register'); // Verifica que la URL contenga '/login'
        
        cy.get('select[name="regime"]').select(usuario.regimen); // Selecciona el régimen
        cy.get("input#formBasicCorreoElectronico").type(usuario.correo)
        cy.get("select#formBasicGender").select(usuario.genero) // Selecciona el género
        cy.get("input#formBasicAge").type(usuario.edad)
        // cy.get('input[placeholder="Da clic y elige la fecha correspondiente"]').click().type(usuario.fechaNacimiento, {force:true}) // Selecciona la fecha de nacimiento
        cy.get("input#formBasicCorreoStreet").type(usuario.calle)
        cy.get("input#formBasicNumExt").type(usuario.numeroExterior); // Ingresa el número exterior
        cy.get("input#formBasicNumInt").type(usuario.numeroInterior); // Ingresa el número interior
        cy.get('input#formBasicColony').type(usuario.colonia); // Ingresa la colonia')
        cy.get("select#formBasicMunicipality").select(usuario.municipio); // Selecciona el municipio
        cy.get('input#formBasicZipCode').type(usuario.cp)
        cy.get('input#formBasicCorreoContraseña').type(usuario.password); // Ingresa la contraseña
        cy.get('input#formBasicCorreoConfirmarContraseña').type(usuario.confirmarPassword); // Ingresa la confirmación de contraseña
        cy.get('.recaptcha-checkbox-border').click({force:true}); // Marca la casilla de reCAPTCHA (si es necesario)
        cy.contains('button', 'Registrarme').click(); // Cambia 'Registrarme' por el texto del botón que deseas hacer clic

    })

    // afterEach(() => {
    //     // Acciones que se ejecutan después de cada prueba
    // });

    // after(() => {
    //     // Limpieza final después de todas las pruebas
    // });
});