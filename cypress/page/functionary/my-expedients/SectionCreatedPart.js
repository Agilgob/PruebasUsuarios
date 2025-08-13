export class SectionCreatedPart {
    constructor(party = {}) {
        
        this.divRow = () => {
            const pd = party.personalData;
            return cy.contains('div', `${pd.firstName} ${pd.paternalLastName} ${pd.maternalLastName}`)
                .closest('div.user-select-none')
        }; 

    }

    iconTrash = () => this.divRow().find('span.ti-trash').parent();

    sectionRemovePart = () => cy.contains('¿Estás seguro de eliminar la parte?').closest('.mt-2.mb-2');

    btnCancelDeletion = () => this.sectionRemovePart().find('button').contains('Cancelar');

    btnConfirmDeletion = () => this.sectionRemovePart().find('button').contains('Eliminar');

}


