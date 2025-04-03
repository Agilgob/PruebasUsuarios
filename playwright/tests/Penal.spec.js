import { test, expect } from '@playwright/test';
import { crearPersonasFalsas } from '../../cypress/support/_faker.js';
import { llenarSelect, llenarSelectRandomValue, seleccionaRadioAleatorio, siguientePagina, ingresaDatosBasicos, ingresaDatosSecundarios } from '../utils/selectHelpers';
const fs = require('fs');
const path = require('path');
    

let cantImputados = process.env.cantImputados || 2;
let cantVictimas = process.env.cantVictimas || 2;

let ciudadanoKey = process.env.ciudadano || 'ciudadanoManuel';
let enviromentKey = process.env.enviroment || 'sandbox';

let ciudadano = {};
let environment = {};
let imputados = [];
let victimas = [];
let formulariosCompletados = false;

test.describe('Automatización de Trámite Penal en Línea', () => {

  test.beforeAll(async () => {
    console.log('Cantidad de imputados: ' + cantImputados);
    console.log('Cantidad de victimas: ' + cantVictimas);


    const ciudadanosData = JSON.parse(fs.readFileSync('./cypress/fixtures/ciudadanos.json', 'utf8'));
    ciudadano = ciudadanosData[ciudadanoKey];

    const environmentData = JSON.parse(fs.readFileSync('./cypress/fixtures/environments.json', 'utf8'));
    environment = environmentData[enviromentKey];

    expect(ciudadano).toBeDefined();
    expect(ciudadano).not.toEqual({});

    cantImputados = ciudadanosData.cantImputados || cantImputados;
    cantVictimas = ciudadanosData.cantVictimas || cantVictimas;
    imputados = crearPersonasFalsas(cantImputados);
    victimas = crearPersonasFalsas(cantVictimas);


  });

//   "ciudadanoManuel" : {
//     "descripcion" : "Ciudadano para generar tramites para secretario de acuerdos y turnados internos y externos",
//     "email" : "manuel@agilgob.com",
//     "password" : "1cafeArabica",
//     "archivoFirel" : "assets/Firel/CICF870709HNESVR02.pfx",
//     "passwordFirel" : "autlan1296",
//     "documentoIdentificacion" : "assets/INE-demo.png"
// }
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

    // Datos del imputado
    for (const [index, imputado] of imputados.entries()) {
      await ingresaDatosBasicos(page, imputado);
      await page.fill('input[name="alias"]', imputado.alias);
      await ingresaDatosSecundarios(page, imputado);
      await page.screenshot({ path: `imputado-${index + 1}.png` });
      await siguientePagina(page);
    }

    //  Datos de la víctima
    for (const [index, victima] of victimas.entries()) {
      await llenarSelectRandomValue(page, 'Elige el tipo de parte del que se ingresará la información');
      await llenarSelectRandomValue(page, '¿El nombre de la víctima u ofendido es un dato reservado?');
      await ingresaDatosBasicos(page, victima);

      const reservado = await page.locator('div:has-text("¿El nombre de la víctima") .singleValue').innerText();
      if (reservado === 'No') {
        await ingresaDatosSecundarios(page, victima);
        await page.fill('input[name="correo"]', victima.correo);
      }

      await page.screenshot({ path: `victima-${index + 1}.png` });
      await siguientePagina(page);
    }

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

    formulariosCompletados = true;
  });

});
