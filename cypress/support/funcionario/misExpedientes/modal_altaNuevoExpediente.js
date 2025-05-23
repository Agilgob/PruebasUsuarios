// Modal de agregar expediente

export class AltaNuevoExpediente {
    constructor() {
        this.titleH4 = () => cy.get('.modal-title.h4');
        this.numeroExpedienteInput = () => cy.get('input[aria-label="numero de expediente"]');
        this.destinatarioSelect = (value = "") => cy.llenarSelectModal('Destinatario', value);
        this.tipoJuicioSelect = (value = "") => cy.llenarSelectModal('Tipo de Juicio', value);
        this.viaSelect = (value = "") => cy.llenarSelectModal('Vía', value);
        this.materiaSelect = (value = "") => cy.llenarSelectModal('Materia', value);
        this.observacionesTextarea = () => cy.get('textarea[aria-label="Observaciones"]');
        this.accionPrincipalSelect = (value = "") => cy.llenarSelectModal('Acción principal:', value);

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

export class ParteCreada {
    constructor(parte = {}) {
        
        this.registroDiv = () => {
            const dp = parte.datosPersonales;
            return cy.contains('div', `${dp.nombres} ${dp.apellidoPaterno} ${dp.apellidoMaterno}`)
                .closest('div.user-select-none')
        }; 

        this.trashIcon = () => this.registroDiv().find('span.ti-trash').parent();

        this.seccionEliminarParte = () => cy.contains('¿Estás seguro de eliminar la parte?').closest('.mt-2.mb-2');
        this.cancelaEliminacionBtn = () => this.seccionEliminarParte().find('button').contains('Cancelar');
        this.confirmaEliminacionBtn = () => this.seccionEliminarParte().find('button').contains('Eliminar');

    }
}