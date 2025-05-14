# Detalles de las pruebas en esta carpeta: 

### Aqui se hace una breve descripcion de que hace cada prueba y en algunos casos, como es que se penso la forma de ejecutarse. 

Al igual que el resto de las pruebas para cambiar el ambiente es necesario cambiar las variables de entorno de ejecicion, no del entorno de cypress: en windows $env:Env="prod" p "sandbox" por ejemplo

<details>
    <summary><b>001_DatosDemandadoSeOcultan.cy.js</b></summary>
    <p>Valida que, al iniciar un trámite desde el portal del ciudadano correspondiente al proceso "Juzgados Civiles, Familiares y Mercantiles en línea", los campos de información del demandado (ya sea persona física o moral) se oculten correctamente cuando el usuario indica que no desea agregar un demandado, garantizando que los formularios asociados no estén visibles ni presentes en el DOM;</p>
</details>



<details>
    <summary><b>004_FUNC_LoginsTodosUsuariosEnv.js</b></summary>
    <b> Que hace la prueba?</b>
    <ul>
        <li>Se abre la URL correspondiente al ambiente (sandbox o producción)</li>
        <li>Se realiza un login interactivo (relleno de correo y contraseña)</li>
        <li>Se intercepta la petición POST /api/v1/auth/sign_in para validar la respuesta</li>
        <li>Se escribe un archivo de resultado (SUCCESS-<correo>.json o FAILED-<correo>.json) dentro de tmp/logins/</li>
        <li>Si el login falla (status ≠ 200), la prueba lanza un error explícito</li>
    </ul>
    <p> Se agregan mas ordenes de ejecucion si se intenta probar una carga mas elevada. Esta prueba intenta pero no logra reemplazar una prueba de tension como las de k6 o JUnit. 
    Como ejecutarlo:</p>
    <code>npx concurrently "npx cypress run --spec **/000*.cy.js" "npx cypress run --spec **/000*.cy.js" "npx cypress run --spec **/000*.cy.js"</code>
</details>