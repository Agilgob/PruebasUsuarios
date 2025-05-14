describe('Inicia Tramite desde el portal de ciudadano', () => {
  
    before(() => { 
        // Carga los datos del archivo de datos para utilizarlos en el test
        // ciudadano almacena los datos de cualquier Ciudadano en el archivo de datos


    });


    it('should visit the environment page', () => {
        cy.visit('https://www.google.com')
        cy.get('body').then(($body) => {
            const text = $body.html();
            expect(text).to.contains('Google') 
            expect(text).to.contains('Buscar con Google')
            expect(text).to.contains('Voy a tener suerte')
        })
    })
    

});