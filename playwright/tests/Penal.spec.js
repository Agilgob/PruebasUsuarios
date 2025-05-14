import { test, expect } from '@playwright/test';
import { crearPersonasFalsas } from '../../cypress/support/_faker.js';
import { llenarSelect, llenarSelectRandomValue, seleccionaRadioAleatorio } from '../utils/selectHelpers';
import { medirDuracionEnSegundos } from '../utils/utils.js';
import { parseFunctionary, parseCitizen, parseEnvironment } from '../../cypress/utilities/config.js';

let contadorTiempo;

let ciudadano = {};
let environment = {};
let imputados = [];
let victimas = [];




test.describe('Automatización de Trámite Penal en Línea', () => {

    let cantImputados = process.env.CANT_IMPUTADOS || 10;
    let cantVictimas = process.env.CANT_VICTIMAS || 10;

    test.beforeAll(async () => {

        ciudadano = parseCitizen(process.env.CITIZEN);
        environment = parseEnvironment();

        expect(ciudadano).not.toEqual({});
        expect(environment).not.toEqual({});

        imputados = crearPersonasFalsas(cantImputados);
        victimas = crearPersonasFalsas(cantVictimas);

        console.log('Cantidad de imputados: ' + process.env.CANT_IMPUTADOS || 10)
        console.log('Cantidad de victimas: ' + process.env.CANT_VICTIMAS || 10);


    });


    test.beforeEach(async ({ page }) => {
        await page.goto(environment.ciudadanoURL);
        await page.fill('input[placeholder="Correo electrónico"]', ciudadano.email);
        await page.fill('input[placeholder="Contraseña"]', ciudadano.password);
        await page.waitForSelector('text=Entrar', { state: 'visible' });
        await page.route('**/api/v1/auth/sign_in', (route) => route.continue());
        const [response] = await Promise.all([
            page.waitForResponse('**/api/v1/auth/sign_in'),
            page.click('text=Entrar'),
        ]);
        expect(response.status()).toBe(200);
        await page.waitForTimeout(1000);
    });

    test('Debe completar el flujo del trámite penal', async ({ page }) => {

        test.setTimeout(999_999);

        await page.locator('.principal-nav.container-fluid .container')
            .getByRole('link', { name: 'Trámites disponibles' }).click();

        // Encuentra la tarjeta que contiene el texto del trámite penal
        const tarjetaPenal = page.locator('div.procedure-card').filter({
        hasText: 'Penal - Ordenes de aprehensión, reaprehensión, cateos '
        });

        await tarjetaPenal.getByText('Ir al trámite').click();

        // Luego hacer clic en "Iniciar trámite"
        await page.getByText('Iniciar trámite').scrollIntoViewIfNeeded();
        await page.getByText('Iniciar trámite').click();

        await page.waitForTimeout(2000);

        // Datos de trámite
        await page.fill('input[name="carpeta_investigacion"]', '1/2024');
        await llenarSelect(page, 'Distrito', 'Distrito segundo');
        await llenarSelectRandomValue(page, 'Vía o solicitud');
        await llenarSelect(page, 'Vía o solicitud', 'Orden de Cateo');
        await llenarSelect(page, 'Delito', 'ABANDONO DE PERSONAS');
        await llenarSelect(page, 'Forma de desahogo de la audiencia', 'Electrónico');
        await llenarSelect(page, 'Dependencia o Particular Solicitante', 'Juzgados de distrito en sistema acusatorio');
        await llenarSelect(page, 'Cantidad de imputados relacionados', cantImputados);
        await llenarSelect(page, 'Cantidad de victimas u ofendidos', cantVictimas);

        await page.getByText('Agregar Firma').click();
        const firelModal = page.locator('.modal-dialog .modal-content');
        await firelModal.getByText('Firma Firel').click();
        await firelModal.locator('input[type=file]').setInputFiles( ciudadano.archivoFirel)
        await firelModal.locator('input[name="password"]').fill(ciudadano.passwordFirel);
        await firelModal.getByText('Agregar').click()

        const [uploadResponse] = await Promise.all([
            page.waitForResponse('**/api/v1/upload_document'),
            page.getByText('Agregar Archivo').locator('..').locator('input[type=file]').setInputFiles('assets/ACUERDOS.pdf')
        ]);
        expect(uploadResponse.ok()).toBeTruthy();
        await page.getByRole('button', { name: 'Firmar' }).click();
        await page.waitForTimeout(2000);

        // Anexos
        await page.getByText('Agregar Campo para subir anexos').click();
            const anexoModal = page.locator('div.modal-content');
            await anexoModal.getByText('Selecciona el tipo de documento').click();
            await anexoModal.locator('div[id*="-option-0"]').click();
            await anexoModal.locator('input[placeholder*="etiqueta"]').fill('Documento Prueba');
            await anexoModal.locator('input[type=file]').setInputFiles('assets/documento.pdf');
            await anexoModal.getByText('Agregar').click();

        const [stageResponse] = await Promise.all([
            page.waitForResponse('**/api/v1/execute_stage'),
            page.getByText('Siguiente').click(),
        ]);
        expect(stageResponse.ok()).toBeTruthy();

        // Sujeto procesal
        await page.waitForTimeout(5000); 
        await llenarSelect(page, 'Sujeto procesal', 'Agente del ministerio público');
        await llenarSelect(page, 'Elige el regimén del Sujeto procesal', 'Física');
        await llenarSelect(page, 'Nacionalidad', 'MEXICANA');
        await llenarSelect(page, 'Edad', Math.floor(Math.random() * 50 + 18));
        await llenarSelectRandomValue(page, 'Estado civil');
        await seleccionaRadioAleatorio(page, 'Sexo');
        await llenarSelectRandomValue(page, 'Género');
        await seleccionaRadioAleatorio(page, '¿Sabe leer y escribir?');
        await llenarSelectRandomValue(page, 'Grado de estudios');
        await seleccionaRadioAleatorio(page, '¿Habla español?');
        await page.fill('input[placeholder*="fecha"]', '15-08-1990');
        await siguientePagina(page);

        let etapaAnterior;

        for (const [index, imputado] of imputados.entries()) {

            contadorTiempo = medirDuracionEnSegundos();

            await page.locator(`input[id="inputForm.apellido_paterno${index + 1}"]`)
                .waitFor({ state: 'visible', timeout: 10000 })

            await ingresaDatosBasicos(page, imputado);
            await page.fill('input[name^="alias"]', imputado.alias);
            await ingresaDatosSecundarios(page, imputado);
            await page.getByLabel('Lugar habitual de residencia').fill(imputado.pais);
            await page.screenshot({ path: `tmp/Penal/imputado-${index + 1}.png` });
            console.log(`Imputado ${index + 1} ${imputado.nombre} - DURACION: ${contadorTiempo()} segundos, Registado`);
            await siguientePagina(page);

        }

        await page.waitForTimeout(5000);

        //  Datos de la víctima
        for (const [index, victima] of victimas.entries()) {
            contadorTiempo = medirDuracionEnSegundos();
            await page.locator(`input[id="inputForm.apellido_paterno${index + 101}"]`)
                .waitFor({ state: 'visible', timeout: 10000 })
            await llenarSelectRandomValue(page, 'Elige el tipo de parte del que se ingresará la información');
            await llenarSelectRandomValue(page, '¿El nombre de la víctima u ofendido es un dato reservado?');
            await ingresaDatosBasicos(page, victima);
           
            const reservado = await page.locator('.col-md-12 .row').filter({
                has: page.getByText('¿El nombre de la víctima u ofendido es un dato reservado?')
            }).locator('.css-1uccc91-singleValue').innerText();
            
            if (reservado === 'No') {
                await ingresaDatosSecundarios(page, victima);
                await page.getByLabel('Correo electrónico').fill(victima.correo);
            }
            await page.screenshot({ path: `tmp/Penal/victima-${index + 1}.png` });

            console.log(`Victima ${index + 1} ${victima.nombre} - DURACION: ${contadorTiempo()} segundos, Registado`);
            await siguientePagina(page);

        }
        // return 
        //  Finalizar
        await expect(page.locator('body')).toContainText('ACUSE DE ENVÍO DE ESCRITO ELECTRÓNICO');
        const [finalize] = await Promise.all([
            page.waitForResponse('**/api/v1/finalize_stage'),
            page.getByRole('button', { name: 'Confirmar' }).click()
        ]);
        const responseBody = await finalize.json();
        expect(finalize.status()).toBe(200);
        expect(responseBody.status).toBe(true);
        expect(responseBody.data.message).toContain('Tu procedimiento ha sido ingresado satisfactoriamente');
        // page.screenshot({ path: 'tmp/Penal/PenalFinalizado.png' });

    });

});



const siguientePagina = async (page) => {
    const contadorTiempoSigPag = medirDuracionEnSegundos();
    const [response] = await Promise.all([
        page.waitForResponse((resp) =>
        resp.url().includes('/api/v1/execute_stage') && resp.request().method() === 'POST'
        ),
        page.getByText('Siguiente').click()
    ]);

    const body = await response.json();
    const statusCode = response.status();

    if (statusCode !== 200) {
        throw new Error(`La respuesta tuvo código ${statusCode} en lugar de 200`);
    }

    if (!body.status) {
        console.warn('Error en la respuesta:', JSON.stringify(body));
        throw new Error(`La respuesta del servidor no fue exitosa: ${JSON.stringify(body)}`);
    }

    console.log(`POST de /api/v1/execute_stage: ${contadorTiempoSigPag()} segundos`);
};


const ingresaDatosBasicos = async (page, persona) => {
    
    await page.getByLabel('Apellido paterno').fill(persona.apellidoPaterno);
    await page.getByLabel('Apellido materno').fill(persona.apellidoMaterno);
    await page.getByLabel('Nombre(s)').fill(persona.nombre);

};
  

const ingresaDatosSecundarios = async (page, persona) => {
    await page.getByLabel('Número de teléfono').fill(persona.telefono);
    await seleccionaRadioAleatorio(page, 'Sexo');
    await llenarSelectRandomValue(page, 'Género');
    await llenarSelect(page, 'Edad', String(Math.floor(Math.random() * 50 + 18)));
    await page.locator('input[placeholder="selecciona una fecha"]').fill('');
    await page.locator('input[placeholder="selecciona una fecha"]').fill(persona.fechaNacimiento);
    await llenarSelect(page, 'Nacionalidad', persona.nacionalidad || 'MEXICANA');
    await llenarSelectRandomValue(page, 'Estado civil');
    await page.getByLabel('Lugar de nacimiento').fill(persona.pais);
    
    await seleccionaRadioAleatorio(page, '¿Sabe leer y escribir?');
    await llenarSelectRandomValue(page, 'Grado de estudios');
    await seleccionaRadioAleatorio(page, '¿Habla español?');
    await page.getByLabel('Lengua indígena o dialecto').fill(persona.lengua);
    await page.getByLabel('Ocupación').fill(persona.ocupacion || 'Desconocido');
};
  