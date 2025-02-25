# Proyecto de Pruebas con Cypress

Este proyecto utiliza Cypress para realizar pruebas end-to-end (E2E) automatizadas. A continuación, se describen las configuraciones y variables de entorno utilizadas en el archivo `cypress.config.js`.

### Descripción de las Configuraciones

- **defaultCommandTimeout**: Tiempo de espera predeterminado para los comandos (5000 ms).
- **video**: Habilita la grabación de video durante las pruebas.
- **videoCompression**: Nivel de compresión de los videos grabados (32).
- **videosFolder**: Carpeta donde se almacenan los videos (`tmp`).
- **screenshotsFolder**: Carpeta donde se almacenan las capturas de pantalla (`tmp`).

### Variables de Entorno

- **funcionario**: `secretarioAcuerdos02`
- **ciudadano**: `ciudadanoManuel`
- **tramite**: `promocion_demanda_fam_merc`
- **environment**: `sandbox`

## Ejecución de Pruebas

Las pruebas pueden ser alimentadas por datos de dos origenes distintos, de los archivos fixture que se encuentran en la carpeta `cypress/fixtures` o pueden tomar datos de pruebas realizadas previamente, siempre que las salidas sean compatibles y que se almacenan en el archivo `tmp/testData.json` el cual almacena los datos de pruebas ejecutados anteriormente en un formato muy similar. 

Para ejecutar la prueba usando los datos de fixtures no debe incluirse el parametro `jsonFile` a la ejecucion, opcionalmente puede pasarse las variables de entorno para usar alguno de los objetos en los archivos de fixtures:

Ejemplo:
```bash
npx cypress run --env ciudadano="admin",funcionario="Secretario001",tramite="promocion_demanda_fam_merc" --spec foo
```
Si alguna de estas variables de entorno no se proporciona, se tomarán los valores por defecto declarados en el archivo [cypress.config.js](./cypress.config.js)


Para ejecutar las pruebas tomando los datos almacenados en al archivo `tmp/testData.json`, epecialmente en casos en que se generan datos en pruebas previas, es neceasario usar la variable de entorno `jsonFile=true` como se muestra a continuacion:


```shell
npx cypress run --env jsonFile=true --spec foo
```
En caso de pasar otras variables en el comando, solo se cargan los datos en el archivo `jsonFile` aunque la ejecucion no genera error.



## Estructura del Proyecto

- `cypress/`: Carpeta principal que contiene las pruebas y configuraciones de Cypress.
- `tmp/`: Carpeta donde se almacenan los videos y capturas de pantalla, logs, datos de pruebas (testData.json) generados durante las pruebas.

