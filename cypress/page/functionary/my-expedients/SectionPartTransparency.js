export class SectionPartTransparency {
        multiselectCanReadWrite = (value = "") => cy.llenarSelectModal('* ¿Puede Leer y Escribir?', value);

        multiselectSpeaksSpanish = (value = "") => cy.llenarSelectModal('* ¿Sabe hablar español?', value);

        inputLanguageOrDialect = () => cy.contains('label', 'Lengua o dialecto').siblings('input');

        multiselectEducationLevel = (value = "") => cy.llenarSelectModal('* Grado de estudios', value);

        multiselectMaritalStatus = (value = "") => cy.llenarSelectModal('* Estado civil', value);

        multiselectNationality = (value = "") => cy.llenarSelectModal('* Nacionalidad', value);

        inputOccupation = () => cy.contains('label', 'Ocupación').siblings('input');

        radioBelongsToIndigenousCommunity = (value = "") => {
            if (value !== "si" && value !== "no") {
                throw new Error('Value for radioBelongsToIndigenousCommunity must be "ni" or "no" in uppercase.');
            }
            return cy.get(`input[type="radio"][value="${value}"]`);
        }

        labelToWhichEthnicGroup = () => cy.contains('label', '¿A que comunidad indígena pertenece?');

        inputEthnicGroup = () => this.labelToWhichEthnicGroup().siblings('input');
}