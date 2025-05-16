// Modal de agregar expediente

export class AltaNuevoExpediente {
    constructor() {
        this.numeroExpedienteInput = () => cy.get('input[aria-label="numero de expediente"]');
        this.destinatarioSelect = (value = "") => cy.llenarSelectModal('Destinatario', value);
        this.tipoJuicioSelect = (value = "") => cy.llenarSelectModal('Tipo de Juicio', value);
        this.viaSelect = (value = "") => cy.llenarSelectModal('Vía', value);
        this.materiaSelect = (value = "") => cy.llenarSelectModal('Materia', value);
        this.observacionesTextarea = () => cy.get('textarea[aria-label="Observaciones"]');

        this.partesP = () => cy.contains('p', 'Partes');
        this.partesAgregarBtn = () => this.partesP().siblings('button');

        this.modalFooter = () => cy.get('.modal-footer');
        this.enviarBtn = () => this.modalFooter().contains('button', 'Enviar');
        this.cerrarBtn = () => this.modalFooter().contains('button', 'Cerrar');
       
    }
}

export class AgregarParte {
    constructor() {
        this.section = () => cy.get('form div.mt-2.mb-2');
        
        this.tipoParteSelect = (value="") => cy.llenarSelectModal('Tipo de parte', value);
        this.datosPersonalesTab = () => this.section().contains('button', 'Datos Personales')
        this.datosContactoTab = () => this.section().contains('button', 'Datos de Contacto')
        this.transparenciaTab = () => this.section().contains('button', 'Transparencia')

        this.regimenDeLaParteSelect = (value="") => cy.llenarSelectModal('Régimen de la parte', value);
        this.nombresInput = () => cy.contains('label', 'Nombres').siblings('input');
        this.apellidoPaternoInput = () => cy.contains('label', '* Apellido Paterno').siblings('input');
        this.apellidoMaternoInput = () => cy.contains('label', '* Apellido Materno').siblings('input');
        this.aliasInput = () => 
        

    }
}