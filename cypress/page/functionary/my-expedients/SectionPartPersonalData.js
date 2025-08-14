export class SectionPartPersonalData{
        fillMultiselectRegime = (value="") => cy.llenarSelectModal('Régimen de la parte', value);

        inputCompanyName = () => cy.contains('* Razón Social').siblings('input')

        inputNames = () => cy.contains('label', 'Nombres').siblings('input');

        inputPaternalSurname = () => cy.contains('label', 'Apellido Paterno').siblings('input');

        inputMaternalSurname = () => cy.contains('label', 'Apellido Materno').siblings('input');

        inputAlias = () => cy.contains('label', 'Alias').siblings('input');

        inputBirthDate = () => cy.contains('Fecha de nacimiento').parent().find('input');

        inputShowCover = () => cy.get('input#showCover');

        fillMultiselectAge = (value="") => cy.llenarSelectModal('Edad', value);

        fillMultiselectSex = (value="") => cy.llenarSelectModal('* Sexo', value);

        fillMultiselectGender = (value="") => cy.llenarSelectModal('Género', value);

        fillMultiselectClassification = (value="") => cy.llenarSelectModal('Clasificación', value);

        fillRepresentedParty = (value) => cy.llenarSelectModal('Parte Representada', value);

        fillRepresentationKind = (value) => cy.llenarSelectModal('Tipo de representación', value)
}
