Cypress - Normas de Nomenclatura para Proyecto POM
## 1. Alcance

Este documento define las reglas obligatorias para la nomenclatura de todos los elementos dentro del proyecto de pruebas automatizadas utilizando Cypress bajo el patrón Page Object Model (POM). El objetivo es garantizar consistencia, legibilidad y escalabilidad en el código. Estas reglas son de carácter obligatorio y deben ser aplicadas en todos los nuevos desarrollos y mantenimientos del proyecto.

## 2. Archivos
### 2.1. Archivos de Page Object

    Formato: TipoComponenteNombreFuncionalidad.js

    Case: PascalCase

    Deben iniciar con el tipo de componente que representan:

        Page para páginas completas

        Modal para ventanas modales

        Component para componentes reutilizables

        Section para secciones internas

### 2.2. Archivos de pruebas (.spec.js)

    Formato: nombre-funcionalidad.spec.js

    Case: kebab-case

    Deben describir la funcionalidad específica bajo prueba.

## 3. Clases

    Formato: TipoComponenteNombreFuncionalidad

    Case: PascalCase

    La clase debe tener el mismo nombre que el archivo que la contiene, omitiendo la extensión .js.

    Debe representar únicamente la entidad definida en el archivo.

## 4. Métodos
### 4.1. Métodos que retornan elementos (getters)

    Formato: getNombreElemento

    Case: camelCase

    Deben iniciar con el prefijo get y describir el elemento retornado.

    Deben usarse únicamente para obtener referencias a elementos del DOM.

### 4.2. Métodos de acción

    Formato: verboNombreElemento

    Case: camelCase

    Deben iniciar con un verbo que describa la acción realizada (por ejemplo: click, fill, select, toggle, upload, delete).

    Deben ejecutar acciones de interacción sobre elementos del DOM.

### 4.3. Métodos de validación

    Formato: shouldResultadoEsperado

    Case: camelCase

    Deben iniciar con el prefijo should y describir el estado esperado a verificar.

    Deben contener únicamente aserciones.

## 5. Variables y constantes

### 5.1. Variables locales

    Formato: nombreDescriptivo

    Case: camelCase

    Deben tener un nombre claro y autoexplicativo.

    Se prohíbe el uso de abreviaturas ambiguas.

### 5.2. Constantes globales

    Formato: NOMBRE_CONSTANTE

    Case: SCREAMING_SNAKE_CASE

    Deben usarse únicamente para valores fijos o selectores reutilizables dentro del archivo.

## 6. Comandos personalizados de Cypress

    Formato: verboDescripcion

    Case: camelCase

    Deben iniciar con un verbo y describir de manera clara la funcionalidad del comando.

    Deben evitar abreviaturas.

## 7. Descripciones en pruebas

Este apartado define cómo deben redactarse los textos utilizados en los bloques describe y it dentro de los archivos de pruebas Cypress. Su objetivo es estandarizar la forma en que se documenta el comportamiento esperado y los escenarios de prueba, asegurando claridad y trazabilidad.
### 7.1. Bloques describe
    Reglas generales

    - Deben utilizar frases completas, no palabras sueltas.
    - Deben indicar qué módulo, funcionalidad o flujo se está probando.
    - Deben ser claros y concisos, evitando ambigüedades o términos genéricos como “Prueba 1”, “Funcionalidad A”.
    - Deben expresar la intención del conjunto de pruebas, no la implementación técnica.

    Redacción

    - La frase debe estar escrita en lenguaje natural, sin abreviaturas ni notación técnica innecesaria.
    - No se debe incluir el detalle de pasos ni resultados esperados (eso se coloca en los it).
    - Debe servir para identificar rápidamente la funcionalidad que cubre ese archivo o suite de pruebas.

    Estructura recomendada

    [Componente o módulo] + - + [Acción, flujo o funcionalidad bajo prueba]

    Ejemplo de formato esperado (sin código):

        “Modal de creación de documento - flujo de alta de documento con firma múltiple”

        “Página de login - validaciones de credenciales y acceso”

### 7.2. Bloques it
Reglas generales

    Deben describir de forma precisa y sin ambigüedades qué se está validando en ese caso de prueba específico.

    La descripción debe iniciar con:

        el verbo “should” cuando se exprese un comportamiento esperado (inglés técnico estándar), o

        una frase que describa la acción y el resultado esperado, si se opta por lenguaje natural.

    Cada it debe representar una sola verificación o escenario; no debe abarcar múltiples objetivos no relacionados.

    Se prohíben nombres genéricos como “Caso 1”, “Prueba botón”, “Funciona bien”.

Redacción

    Escribir la descripción como una expectativa funcional, no como una acción del código.

    La descripción debe ser comprensible para alguien que lea únicamente el reporte de ejecución, sin ver el código de la prueba.

    Evitar referencias a pasos técnicos como “clic en botón” salvo que sea la condición principal evaluada.

Estructura recomendada

    [should | debe] + [acción o condición] + [resultado esperado]
    Ejemplos de estructura (sin código):

        “should display an error message when mandatory fields are left empty”
        “should allow creating a new document with multiple signatures enabled”
        “should prevent login when credentials are invalid”

### 7.3. Consideraciones adicionales

    Los textos deben estar en idioma consistente en todo el proyecto (por defecto inglés técnico).
    La descripción no debe superar una línea, salvo casos donde el flujo sea complejo y requiera una aclaración mayor.
    La redacción debe ser autoexplicativa y trazable a un requerimiento o criterio de aceptación funcional.
