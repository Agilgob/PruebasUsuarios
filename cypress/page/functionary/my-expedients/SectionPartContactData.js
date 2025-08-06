export default class SectionPartContactlData{

        inputEmail = () => cy.contains('label', 'Correo electrónico').siblings('input');

        inputPhoneNumber = () => cy.contains('label', 'Teléfono').siblings('input');

        inputResidence = () => cy.contains('label', 'Lugar de residencia').siblings('input');

}