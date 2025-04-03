export const llenarSelectRandomValue = async (page, campo) => {
    const fila = page.locator('.col-md-12 .row').filter({ hasText: campo }).first();
    await fila.scrollIntoViewIfNeeded();
    await fila.click();
  
    const opciones = page.locator('[class$="-menu"] div[id^="react-select"]').filter({ hasNot: page.locator('.option') });
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
  