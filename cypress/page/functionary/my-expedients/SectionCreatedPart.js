export default class SectionCreatedPart {
    constructor(parte = {}) {
        
        this.divRow = () => {
            const dp = parte.datosPersonales;
            return cy.contains('div', `${dp.nombres} ${dp.apellidoPaterno} ${dp.apellidoMaterno}`)
                .closest('div.user-select-none')
        }; 

    }

    iconTrash = () => this.divRow().find('span.ti-trash').parent();

    sectionRemovePart = () => cy.contains('¿Estás seguro de eliminar la parte?').closest('.mt-2.mb-2');

    btnCancelDeletion = () => this.sectionRemovePart().find('button').contains('Cancelar');

    btnConfirmDeletion = () => this.sectionRemovePart().find('button').contains('Eliminar');

}