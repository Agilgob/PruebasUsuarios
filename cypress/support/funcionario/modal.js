/**
 * Custom command to get a modal by its title.
 * @param {string} title - The title of the modal to find.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The modal element.
 */
Cypress.Commands.add('getModal', (title) => {
  return cy.get('.modal-dialog .modal-content').filter(`:contains("${title}")`).first()
})


/**
 * Custom command to get the footer of a modal.
 * @function getHeader
 * @memberof Cypress.Commands
 * @param {JQuery<HTMLElement>} subject - The modal element.
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} The header, body, footer element of the modal.
 * @example
 * cy.getModal('Nuevo Documento').getHeader()
 */
Cypress.Commands.add('getHeader',{prevSubject : 'element'}, (subject) => {
    return cy.wrap(subject).find('.modal-header')
})

Cypress.Commands.add('getBody',{prevSubject : 'element'}, (subject) => {
  return cy.wrap(subject).find('.modal-body')
})

Cypress.Commands.add('getFooter',{prevSubject : 'element'}, (subject) => {
  return cy.wrap(subject).find('.modal-footer')
})
