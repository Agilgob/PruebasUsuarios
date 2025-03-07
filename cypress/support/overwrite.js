
Cypress.Commands.overwrite('log', (originalFn, message) => {
    originalFn(message)
    cy.writeFile('tmp/events.log', message + '\n', {flag: 'a+', log: false})
})

Cypress.Commands.overwrite('screenshot', (originalFn, subject, name, options) => {
    let screenshotCounter = Cypress.env('screenshotCounter') || 1; // Obtener el valor actual o inicializar en 1
    const prefixedName = `${screenshotCounter}_${name || 'screenshot'}`;
    Cypress.env('screenshotCounter', screenshotCounter + 1); // Incrementar el contador
    return originalFn(subject, prefixedName, options);
});
  


