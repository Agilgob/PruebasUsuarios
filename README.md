# Proyecto de Pruebas con Cypress

Este proyecto utiliza Cypress para realizar pruebas end-to-end (E2E) automatizadas. A continuación, se describen las configuraciones y variables de entorno utilizadas en el archivo `cypress.config.js`.

### Descripción de las Configuraciones

Tanto para cypress como para playwright se cargan las variables de entorno antes de la ejecucion de las pruebas, los archivos de variables pueden ser `.env.sandbox` o `.env.prod` dependiendo el ambiente.

Para k6 es necesario pasar los archivos de credenciales a la carpeta de `k6/data/users.sandbox.json` o `k6/data/users.production.json`
Es importante que se tengan archivos de usuarios con un volumen por encima de lo que solicitan las estrategias de pruebas (si piden 100 usuarios, tener 100 o mas en los archivos de usuarios.)


## Estructura del Proyecto

- `cypress/`: Almacena pruebas e2e en cypress.
- `playwright/`: Almacena pruebas e2e pero solo para Penal o alguna otra prueba que llegue a saturar la memoria de cypress.
- `k6/` : Almacena pruebas de performance, requiere otros archivos de usuarios y passwords en formato JSON 
- `tmp/`: Guarda archivos temporales que se generan durante la ejecucion de las pruebas de cualquiera de los frameworks que se mencionan anteriormente. Es una carpeta que no se sube al repositorio.


<details>
<summary><h2>Imagen de Docker</h2></summary>

Se recomienda usar la imagen de docker para correr las pruebas, ya que no requiere configuracion adicional al build.
Puedes consultar el [Dockerfile](Dockerfile) el el root del proyecto.

Crea la imagen asi : 
```bash
docker build  -t testing-agilgob . --ignore-cache
```

Ejecuta las pruebas asi para cada framework :
```bash
# PARA K6
# De performance k6 para todas las pruebas en el shell
docker run --rm -v "$(pwd)/tmp:/home/tmp" testing-agilgob ./entrypoint/stress.sh

# para una prueba en particular 
docker run --rm -v "$(pwd)/tmp:/home/tmp" testing-agilgob k6 run k6/functionary/login.js


# PARA CYPRESS
# Para correr una prueba
docker run --rm -v "$(pwd)/tmp:/home/tmp" cypress run --spec <ruta a la prueba>

# para correr una sesion cobn multiples pruebas o 'Flujos completos'
docker run --rm -v "$(pwd)/tmp:/home/tmp" testing-agilgob ./entrypoint/demanda-inicial.sh 


# PARA PLAYWRIGHT
# Para correr una prueba
docker run --rm -v "$(pwd)/tmp:/home/tmp" playwright test playwright/tests/Penal.js

# para correr una sesion cobn multiples pruebas o 'Flujos completos'
docker run --rm -v "$(pwd)/tmp:/home/tmp" playwright ./entrypoint/penal.js

```

Si se ejecuta el entrypoint del contenedor sin parametros se inician varias sesiones, dependiendo del archivo de entorno que se pase al `run` del contenedor. 
Para saber que sesiones o suit se va a correr revisa la variable TEST_SCENARIOS
Por ejemplo en este caso al ejecutar el `docker run testing-agilgob` se ejecutaran test exploratorios, de penal en playwright y demandas iniciales en cypress.
``` bash
TEST_SCENARIOS=exploratorios,penal,demanda-inicial
```

Hay un archivo .sh en la carpeta entrypoint que envia el reporte como .zip a un canal de slack, se ejecuta al final del todo en el entrypoint. El canal y el tocken con el que se envia estan en el archivo de entorno que se pasa. 

</details>



<details>
<summary><h2>Instalacion</h2></summary>

### Los siguientes pasos son para llevar a cabo la instalacion en sistemas basados en Debian


<details>
<summary><h4>Instalacion JAVA</h4></summary>
Si aun no cuentas con JAVA instalalo usando el siguiente comando

```bash
sudo apt update
sudo apt install fontconfig openjdk-17-jre
java -version
```
</details>


<details>
<summary><h4>Instalacion Node</h4></summary>
Instala Node usando APT package manager


```bash
# Actualiza la lista de paquetes disponibles
sudo apt update

# Instala Node.js
sudo apt install nodejs

# Verifica la versión instalada de Node.js
node -v

# Instala npm (Node Package Manager)
sudo apt install npm
```



</details>


<details>
<summary><h4>Instalacion Jenkins</h4></summary>
Instala Jenkins en su version LTS

```bash
# Agregar la clave y el repositorio de Jenkins
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
    https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
    https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
    /etc/apt/sources.list.d/jenkins.list > /dev/null

# Actualizar la lista de paquetes e instalar Jenkins
sudo apt-get update
sudo apt-get install jenkins
```

Deshabilita CSP en Jenkins para poder mostrar archivos html en los reportes generados por mochawesome
Con privilegios de super usuario (sudo su) ejecuta los siguientes comandos, no afectan la ejecucion de las pruebas, solo permite ver los reportes en web:

```bash
mkdir -p /usr/share/jenkins/ref/init.groovy.d && \
echo 'System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "");' > /usr/share/jenkins/ref/init.groovy.d/disable-csp.groovy
```


</details>


<details>
<summary><h4>Configuracion inicial en primer arranque</h4></summary>
Navega a http://localhost:8080 (o el puerto que configuraste para Jenkins durante la instalación) y espera hasta que aparezca la página de Desbloquear Jenkins.

![alt text](Doc/image.png)

Durante el primer arranque, por consola se muestra el pasword generado automaticamente, usalo para hacer el primer login 

![alt text](Doc/image-1.png)

Si por alguna razon no capturaste el password en el primer arranque, puedes consultarlo usando
```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword 
```

- Puedes crear un usuario y contraseña o puedes usar las credenciales que se generan por defecto: `admin:admin`.
</details>


<details>
<summary><h4>Configuracion de arranque al cargar el sistema (opcional, recomendado)</h4></summary>


Puedes habilitar el servicio de Jenkins para que se inicie al arrancar el sistema con el comando:

```bash
sudo systemctl enable jenkins
```

Puedes iniciar el servicio de Jenkins con el comando:

```bash
sudo systemctl start jenkins
```

Puedes verificar el estado del servicio de Jenkins usando el comando:

```bash
sudo systemctl status jenkins
```

Si todo se ha configurado correctamente, deberías ver una salida como esta:

```
Loaded: loaded (/lib/systemd/system/jenkins.service; enabled; vendor preset: enabled)
Active: active (running) since Tue 2023-06-22 16:19:01 +03; 4min 57s ago
...
```
</details>

Instala los plugins recomendados por el sistema, espera a que la instalacion se complete.

<details>
<summary><h4>Configuracion del Pipeline</h4></summary>

Crea una nueva tarea 
![alt text](Doc/image-2.png)


Asigna un nombre al pipeline y selecciona el tipo 'Pipeline'
![alt text](Doc/image-3.png)


Ingresa descripcion y el campo para desechar las ejecuciones antiguas, por ejemplo 2 dias, 2 ejecuciones
![alt text](Doc/image-4.png)


Al final del formulario de configuracion selecciona los siguientes valores:
    Pipeline
        Definition : Pipeline script from SCM
        SCM : Git
        Repository URL : `https://github.com/Agilgob/PruebasUsuarios.git`
        Credentials : `- none -` no cambia
        Branch Specifier : `*/main`
        Navegador del repositorio : `(Auto)` no cambia
        Script Path : `Docker/Jenkins/Pipelines/Jenkinsfile_fn`

![alt text](Doc/image-5.png)
![alt text](Doc/image-6.png)

</details>


</details>
