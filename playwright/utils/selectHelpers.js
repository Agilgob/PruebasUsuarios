export const llenarSelectRandomValue = async (page, campo) => {
  const fila = page.locator('.col-md-12 .row').filter({ hasText: campo }).first();
  await fila.scrollIntoViewIfNeeded();
  await fila.click();

  const opciones = page.locator('[class$="-menu"] div[id^="react-select"]');

  // Espera a que aparezca al menos una opción visible
  await opciones.first().waitFor({ state: 'visible', timeout: 5000 });

  const count = await opciones.count();
  if (count === 0) {
    throw new Error(`No se encontraron opciones para el campo "${campo}"`);
  }

  const indexAleatorio = Math.floor(Math.random() * count);
  await opciones.nth(indexAleatorio).click();
};



export const llenarSelectModal = async (page, campo, valorSeleccion) => {
    const fila = page.locator('form .form-group').filter({ hasText: campo }).first();
    await fila.scrollIntoViewIfNeeded();
    await fila.click();

    const menu = page.locator('[class$="-menu"]');
    await menu.locator(`text="${valorSeleccion}"`).click();
};
  

export const llenarSelect = async (page, campo, valorSeleccion) => {
    const fila = page.locator('.col-md-12 .row').filter({ hasText: campo }).first();
    await fila.scrollIntoViewIfNeeded();
    await fila.click();
  
    const menu = page.locator('[class$="-menu"]');
    await menu.locator(`text="${valorSeleccion}"`).click();
  
  };
  
export const seleccionaRadioAleatorio = async (page, label) => {
  const seccion = page.locator('.col-md-12.col-12').filter({ hasText: label }).first();
  const radios = seccion.locator('.form-check-input');

  const count = await radios.count();
  if (count === 0) {
    throw new Error(`No se encontraron radios para la etiqueta: "${label}"`);
  }

  const randomIndex = Math.floor(Math.random() * count);
  await radios.nth(randomIndex).check({ force: true });
};
  