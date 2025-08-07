// Modal de agregar expediente

import './SectionCreatedPart';
import './SectionPartPersonalData';
import './SectionPartContactData';
import './SectionPartTransparency'
export class ModalNewExpedientRegistration {
    constructor() {
        this.createdParts = [];
        this.sectionPartPersonalData = () => new SectionPartPersonalData();
        this.sectionPartContactData = () => new SectionPartContactData();
        this.sectionPartTransparency = () => new SectionPartTransparency();
    }

    modal(){
        return cy.getModal('Alta de nuevo expediente');
    }

    tabPartSection( text = "Datos Personales" ){
        assert(['Datos Personales', 'Datos de Contacto', 'Transparencia'].includes(text), 
        `El texto ${text} no es un tab válido en el formulario de partes`);
        return this.modal().find('button').contains(text);
    }
          
    createNewPart(partInformation = {}) {
        const newPart = new SectionCreatedPart(partInformation);
        this.createdParts.push(newPart);
        return newPart;
    }

    pPartsTitle(){
        return this.modal().contains('p', 'Partes');
    }

    btnAddPart(){
        return this.modal().siblings('button');
    }

    inputExpedientNumber(){
        return cy.get('input[aria-label="numero de expediente"]')
    };

    textAreaObservation() {
        return cy.get('textarea[aria-label="Observaciones"]')
    }

    btnSend(){ 
        return this.modal().find('button').contains('Enviar'); 
    }

    btnClose(){
        return this.modal().find('button').contains('Cerrar'); 
    }

    // Methods to perform actions in the modal

    fillMultiselectAddressee(value) {
        return cy.llenarSelectModal('Destinatario', value)
    }

    fillMultiselectJudgeType(value) {
        cy.llenarSelectModal('Tipo de Juicio', value)
    }

    fillMultiselectWay(value) {
        cy.llenarSelectModal('Vía', value)
    }

    fillMultiselectMatter(value) {
        cy.llenarSelectModal('Materia', value)
    }

    fillMultiselectPrincipalAction(value) {
        return cy.llenarSelectModal('Acción principal:', value)
    }

    btnCancel = () => this.modal().contains('.justify-content-between button', 'Cancelar');

    btnSave = () => this.modal().contains('.justify-content-between button', 'Guardar');
}










export class AgregarParte {
    constructor() {
        this.section = () => cy.get('form div.mt-2.mb-2');
        
        this.tipoParteSelect = (value="") => cy.llenarSelectModal('Tipo de parte', value);
        this.datosPersonalesTab = () => this.section().contains('button', 'Datos Personales')
        this.datosContactoTab = () => this.section().contains('button', 'Datos de Contacto')
        this.transparenciaTab = () => this.section().contains('button', 'Transparencia')

        // Datos personales
        this.regimenDeLaParteSelect = (value="") => cy.llenarSelectModal('Régimen de la parte', value);
        this.nombresInput = () => cy.contains('label', 'Nombres').siblings('input');
        this.apellidoPaternoInput = () => cy.contains('label', 'Apellido Paterno').siblings('input');
        this.apellidoMaternoInput = () => cy.contains('label', 'Apellido Materno').siblings('input');
        this.aliasInput = () => cy.contains('label', 'Alias').siblings('input');
        this.edadSelect = (value="") => cy.llenarSelectModal('Edad', value);
        this.fechaNacimientoInput = () => this.section().contains('Fecha de nacimiento').parent().find('input');
        this.sexoSelect = (value="") => cy.llenarSelectModal('* Sexo', value);
        this.generoSelect = (value="") => cy.llenarSelectModal('Género', value);
        this.clasificacionSelect = (value="") => cy.llenarSelectModal('Clasificación', value);
        this.mostrarCaratulaCheckbox = () => cy.get('input#showCover');

        // Datos de contacto
        this.correoElectronicoInput = () => cy.contains('label', 'Correo electrónico').siblings('input');
        this.telefonoInput = () => cy.contains('label', 'Teléfono').siblings('input');
        this.lugarResidenciaInput = () => cy.contains('label', 'Lugar de residencia').siblings('input');

        // Transparencia
        this.puedeLeerEscribirSelect = (value="") => cy.llenarSelectModal('* ¿Puede Leer y Escribir?', value);
        this.sabeHablarEspanolSelect = (value="") => cy.llenarSelectModal('* ¿Sabe hablar español?', value);
        this.lenguaODialectoInput = () => cy.contains('label', 'Lengua o dialecto').siblings('input');
        this.gradoDeEstudiosSelect = (value="") => cy.llenarSelectModal('* Grado de estudios', value);
        this.estadoCivilSelect = (value="") => cy.llenarSelectModal('* Estado civil', value);
        this.nacionalidadSelect = (value="") => cy.llenarSelectModal('* Nacionalidad', value);
        this.ocupacionInput = () => cy.contains('label', 'Ocupación').siblings('input');
        this.perteneceAComunidadIndigena = (value="") => cy.get(`input[type="radio"][value="${value}"]`); // llenar con minusculas si/no

        this.cancelarBtn = () => cy.contains('.justify-content-between button', 'Cancelar');
        this.guardarBtn = () => cy.contains('.justify-content-between button', 'Guardar');

    }
}

