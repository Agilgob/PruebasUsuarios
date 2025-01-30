describe('Login con credenciales falsas', () => {
  
  let testData;

  beforeEach(() => {
    cy.fixture('localhost').then((data) => {
      testData = data;
      cy.visit(testData.url.funcionario);
    });
  });

  it('Credenciales incorrectas', () => {
    cy.login(testData.secretarioAcuerdos.email, "FalsePassword");
    cy.contains('¿Aún no tienes una cuenta?, regístrate').should('be.visible');
  });

  it('SQL Injection attempt 1', () => {
    cy.login("admin@example.com' OR '1'='1", "password");
    cy.contains('¿Aún no tienes una cuenta?, regístrate').should('be.visible');
  });

  it('SQL Injection attempt 2', () => {
    cy.login("admin@example.com' --", "password");
    cy.contains('¿Aún no tienes una cuenta?, regístrate').should('be.visible');
  });

  it('SQL Injection attempt 3', () => {
    cy.login("'admin@example.com' OR 1=1--", "password");
    cy.contains('¿Aún no tienes una cuenta?, regístrate').should('be.visible');
  });

});
