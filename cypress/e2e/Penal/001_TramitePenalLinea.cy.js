import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Automatización de Trámite Penal en Línea', () => {
    let formulariosCompletados = false;

    let cantImputados = Cypress.env('cantImputados') || 2;
    let cantVictimas = Cypress.env('cantVictimas') || 2;
    let imputados;
    let victimas;


    before(() => { 

        cy.log('Cantidad de imputados: ' + cantImputados)
        cy.log('Cantidad de victimas: ' + cantVictimas)

        loadTestData();

        cy.crearPersonasFalsas(cantImputados).then((imputadosCreados) => {
            imputados = imputadosCreados
        })

        cy.crearPersonasFalsas(cantVictimas).then((victimasCreadas) => {
            victimas = victimasCreadas
        })

        cy.wait(500)

    });


    beforeEach(() => {
        // ✅ Deshabilitar animaciones directamente dentro del test
        cy.document().then((doc) => {
            const style = doc.createElement('style');
            style.innerHTML = `
                        *, *::before, *::after {
                            transition: none !important;
                            animation: none !important;
                        }
                    `;
            doc.head.appendChild(style);
        });

        cy.session('ciudadano-session', () => {
            cy.visit(environment.ciudadanoURL);
            cy.loginCiudadano(ciudadano.email, ciudadano.password)
        });

        cy.visit(environment.ciudadanoURL);
    });

    it('Debe completar el flujo del trámite penal', () => {
        
        cy.getNavigationBar('Trámites disponibles').click();

        // Tarjetas - Selecciona Tarjeta Penal
        cy.contains('Penal - Ordenes de aprehensión, reaprehensión, cateos y comparecencias')
            .closest('.procedure-card') // Encuentra la tarjeta contenedora
            .within(() => {
                cy.contains('Ir al trámite').should('be.visible').click();
            });
        cy.contains('Iniciar trámite').scrollIntoView().should('be.visible').click();

        
        // VISTA : Ingreso

        cy.get('input[name="carpeta_investigacion"]').type('1/2024'); // Numero de la carpeta de investigacion
        cy.llenarSelect('Distrito', 'Distrito segundo')

        cy.llenarSelectRandomValue('Vía o solicitud') // support/actions/llenarCamposFormularios.js
        cy.llenarSelect('Vía o solicitud', 'Orden de Cateo')
        cy.llenarSelect('Delito', 'ABANDONO DE PERSONAS')
        cy.llenarSelect('Forma de desahogo de la audiencia', 'Electrónico')
        cy.llenarSelect('Dependencia o Particular Solicitante', 'Juzgados de distrito en sistema acusatorio')
        cy.llenarSelect('Cantidad de imputados relacionados', cantImputados)
        cy.llenarSelect('Cantidad de victimas u ofendidos', cantVictimas)


        // 4️⃣ Adjuntar Firma FIREL (Modal de Firma)
        cy.contains('Agregar Firma').click();
        cy.contains('Firma Firel').click();
        cy.contains("Agregar Archivo").get('input[type=file]').eq(1)
            .selectFile( ciudadano.archivoFirel , { force: true })
            .click({ force: true });

        cy.contains('Contraseña').parent().get('input[name="password"]')
            .type( ciudadano.passwordFirel );

        cy.get('.modal-footer').within(() => {
            cy.contains('Agregar').click();
        });

        // Carga el documento a firmar
        cy.intercept('POST', '**/api/v1/upload_document').as('uploadDocument');
        cy.contains('Agregar Archivo').get('input[type=file]')
            .selectFile("assets/documento.pdf", { force: true }).click({ force: true });
        cy.wait('@uploadDocument').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.status).to.eq(true);
        });

        cy.contains('Firmar').click();
        // Esperar a que el modal de Firma FIREL se cierre
        cy.wait(2000);

        // 7️⃣ Adjuntar Anexos (Modal de Anexos)
        cy.contains('Agregar Campo para subir anexos').click();

        // Llenar los datos en el modal de anexos
        cy.get('div[role="dialog"]').within(() => {
            // 1️⃣ Seleccionar el tipo de documento
            cy.contains('Selecciona el tipo de documento').click();
            cy.get('div[id*="-option-0"]').click(); // Selecciona la primera opción

            // 2️⃣ Ingresar una etiqueta en el campo de texto
            cy.get('input[placeholder="Agrega una etiqueta para identificar este documento"]')
                .type('Documento Prueba');

            cy.contains('* Selecciona el archivo a subir')
                .get('input[type=file]')
                .selectFile("assets/documento.pdf", { force: true })
                .click({ force: true });

            cy.contains('Agregar').click();
        });

        // Esperar a que el modal de anexos se cierre
        cy.wait(5000);
        cy.intercept('POST', '**/api/v1/execute_stage').as('executeStage');
        cy.contains('Siguiente').click();
        cy.wait('@executeStage').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.status).to.eq(true);
        })




        // VISTA : Sujeto procesal ult

        cy.llenarSelect('Sujeto procesal', 'Agente del ministerio público') 
        cy.llenarSelect('Elige el regimén del Sujeto procesal', 'Física') 
        cy.llenarSelect('Nacionalidad', 'MEXICANA') 
        cy.llenarSelect('Edad', Math.floor(Math.random() * 50 + 18)) 
        cy.llenarSelectRandomValue('Estado civil')
        seleccionaRadioAleatorio('Sexo') 
        cy.llenarSelectRandomValue('Género')
        seleccionaRadioAleatorio('¿Sabe leer y escribir?') 
        cy.llenarSelectRandomValue('Grado de estudios')
        seleccionaRadioAleatorio('¿Habla español?') 
        cy.get('input[placeholder="selecciona una fecha"]').type('15-08-1990{enter}'); // 

        cy.contains('Siguiente').click();
        cy.wait('@executeStage').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.status).to.eq(true);
            cy.wait(2000)
        })

    
        // VISTA : Datos del imputado 
        imputados.forEach((imputado, index) => {
            cy.log('\n\nImputado ' + (index + 1) + JSON.stringify(imputado))
            cy.contains('h3', `Datos del Imputado`).scrollIntoView().should('be.visible');
            ingresaDatosBasicos(imputado)
            cy.contains('Alias').siblings('input').clear().type(imputado.alias);
            
            ingresaDatosSecundarios(imputado)
            cy.contains('Lugar habitual de residencia').siblings('input').clear().type(imputado.pais);
            cy.screenshot(`Imputado ${index + 1}`)
            siguientePagina()

        });
            
        
        // VISTA : Datos de la victima
        victimas.forEach((victima, index) => {
            cy.log('\n\nVictima ' + (index + 1) + JSON.stringify(victima))
            cy.contains('h3', 'Datos de la víctima u ofendido').scrollIntoView().should('be.visible');
            
            cy.llenarSelectRandomValue('Elige el tipo de parte del que se ingresará la información');
            cy.llenarSelectRandomValue('¿El nombre de la víctima u ofendido es un dato reservado?');
            ingresaDatosBasicos(victima)

            cy.contains('¿El nombre de la víctima u ofendido es un dato reservado?')
                .scrollIntoView()
                .should('be.visible')
                .closest('div')
                .find('div[class$="singleValue"]')
                .invoke('text').then((text) => {
                    if(text === 'No') {
                        ingresaDatosSecundarios(victima)
                        cy.contains('Correo electrónico').siblings('input').clear().type( victima.correo );
                    }
                })
            
            cy.screenshot('Victima ' + (index + 1))
            siguientePagina()
        })
            


        // VISTA : Etapa Finalizada
        cy.get('body').then(($body) => {
            const text = $body.text();
            expect(text).to.contain('ACUSE DE ENVÍO DE ESCRITO ELECTRÓNICO');
            expect(text).to.contain('Se te hará llegar una notificación a tu correo electrónico');
        });


        cy.intercept('POST', '**/api/v1/finalize_stage').as('finalizeStage');
        cy.contains('button', 'Confirmar').click();
        cy.wait('@finalizeStage').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.status).to.eq(true);
            expect(interception.response.body.data.message).to.contain('Tu procedimiento ha sido ingresado satisfactoriamente')
        })

        formulariosCompletados = true;

    });


    // it("Valida que los formularios se completaron correctamente", () => {
    //     if(!formulariosCompletados) {
    //         throw new Error("Abortada porque no se han completado los formularios");
    //     }
    // })

})


const ingresaDatosBasicos = (persona) => {
    cy.contains('Apellido paterno').siblings('input').clear().type(persona.apellidoPaterno);
    cy.contains('Apellido materno').siblings('input').clear().type(persona.apellidoMaterno);
    cy.contains('Nombre(s)').siblings('input').clear().type(persona.nombre)
}

const ingresaDatosSecundarios = (persona) => {
    cy.contains('Número de teléfono').siblings('input').clear().type(persona.telefono );
    seleccionaRadioAleatorio('Sexo');
    cy.llenarSelectRandomValue('Género');
    cy.llenarSelect('Edad', Math.floor(Math.random() * 50 + 18));
    cy.get('input[placeholder="selecciona una fecha"]').clear().type(persona.fechaNacimiento); //Fecha Nacimiento
    cy.llenarSelect('Nacionalidad', persona.nacionalidad || 'MEXICANA');
    cy.llenarSelectRandomValue('Estado civil');
    cy.contains('Lugar de nacimiento').siblings('input').clear().type(persona.pais);
    seleccionaRadioAleatorio('¿Sabe leer y escribir?');
    cy.llenarSelectRandomValue('Grado de estudios');
    seleccionaRadioAleatorio('¿Habla español?');
    cy.contains('Lengua indígena o dialecto').parent().find('input').clear().type(persona.lengua);
    cy.contains('Ocupación').parent().find('input').clear().type(persona.ocupacion || 'Desconocido');

}

const seleccionaRadioAleatorio = (label) => {
    cy.get('.col-md-12.col-12', {log:false}).filter(`:contains("${label}")`, {log:false}).within( () => { // Selecciona Sexo
        cy.get('.form-check-input', {log:false}).its('length', {log:false}).then((length) => { 
            const randomOption = Math.floor(Math.random() * length);
            cy.get('.form-check-input', {log:false}).eq(randomOption).check({ force: true });
         })
    })
}

const siguientePagina = () => {
    cy.contains('Siguiente').click();
    cy.wait('@executeStage').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        if(!interception.response.body.status) {
            cy.log('Error en la respuesta: ' + JSON.stringify(interception.response.body));
        }
        expect(interception.response.body.status).to.eq(true);
    });
    cy.wait(2000) // Para que la vista cambie y no hacer el get sobre elementos que ya se llenaron en
        // el ciclo anterior :( no se puede quitar el wait
}