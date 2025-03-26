describe('Inicia Tramite desde el portal de ciudadano', () => {
  
    before(() => { 
        // Carga los datos del archivo de datos para utilizarlos en el test
        // ciudadano almacena los datos de cualquier Ciudadano en el archivo de datos


    });


    it('should visit the environment page', () => {
        cy.visit('https://www.google.com')
        cy.crearPersonasFalsas(2).then((x) => {
            console.log(x)
        })

        cy.crearUnaPersonaFalsa().then((x) => {
            console.log(x)
        })
    })
    

});