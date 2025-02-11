## Dockefile

Crea la imagen con las pruebas en cypress
Recibe como variables de entorno las siguientes:
SPEC : (obligatoria) ruta a las pruebas que se ejecutan

- **FUNCIONARIO** : Datos del funcionario desde el cual se realiza la prueba
- **CIUDADANO** : Datos del ciudadano 
- **TRAMITE** : JSON de datos del tramite
- **TEST_DATA** : contiene las URL de las aplicaciones


Para FUNCIONARIO, CIUDADANO, TRAMITE y TEST_DATA hay valores por default que pueden ser consultados en el archivo [cypress.config.js](../../cypress.config.js)


___
## build_image.sh
### Descripción del Script

[Este script de Bash](./build_image.sh) realiza las siguientes acciones:

1. Obtiene el SHA del último commit de Git (los primeros 15 caracteres).
2. Define el nombre de la imagen de Docker utilizando el SHA obtenido.
3. Verifica si ya existe una imagen de Docker con el mismo SHA.
4. Si no existe una imagen previa con el mismo SHA:
   - Construye una nueva imagen de Docker sin utilizar la caché.
5. Si existe una imagen previa con el mismo SHA:
   - Informa que la imagen actual ya está actualizada y no es necesario construir una nueva.
6. Si existe una imagen previa con un SHA diferente:
   - Elimina todas las imágenes de Docker con el nombre `cypress-agilgob`.
   - Construye una nueva imagen de Docker sin utilizar la caché.

Este script asegura que siempre se tenga una imagen de Docker actualizada basada en el último commit de Git.

___
## run_tests.sh

[Este script](./run_tests.sh) se ejecuta al lanzar el contenedor de Docker, toma las variables de entorno que se pasan al lanzar el contenedor:

1. Imprime en la consola los valores de las variables de entorno `FUNCIONARIO`, `CIUDADANO`, `TRAMITE` y `TEST_DATA` para poder corroborar al ejecutar la prueba.
2. Verifica si la variable de entorno `SPEC` está definida. Si no lo está, muestra un mensaje de error y termina la ejecución del script, para evitar que se ejecuten pruebas sin usar un criterio.
3. Inicializa la variable `CYPRESS_ARGS` como una cadena vacía.
4. Itera sobre un arreglo de variables de entorno (`ENV_VARS`), y para cada variable:
    - Obtiene su valor.
    - Si el valor no está vacío, agrega la variable y su valor a `CYPRESS_ARGS` en el formato `--env VAR=VALUE`.
5. Ejecuta Cypress utilizando `npx`, pasando como argumentos la especificación (`--spec "$SPEC"`), el reportero (`--reporter cypress-mochawesome-reporter`), y las variables de entorno adicionales (`$CYPRESS_ARGS`).

