# Jenkins en Docker con Contenedores Hermanos para Ejecución de Pruebas DooD

Esta versión del proyecto permite desplegar una instancia de Jenkins dentro de un contenedor Docker, conectada al socket de Docker del sistema anfitrión. Esto habilita a Jenkins para ejecutar pruebas utilizando contenedores "hermanos", garantizando un entorno aislado, flexible y escalable para las tareas de construcción y prueba.

---

## ¿Qué hace este proyecto especial?
- **Integración con Docker:** Jenkins se ejecuta como un contenedor y tiene acceso directo al socket de Docker del host, lo que permite gestionar y lanzar otros contenedores desde el agente.
- **Aislamiento y escalabilidad:** Cada prueba se ejecuta en un contenedor independiente, asegurando un manejo granular de las dependencias y evitando conflictos entre entornos.

---

## Beneficios del uso de contenedores para la ejecución de pruebas
- **Manejo Granular de las Dependencias:**
  Cada prueba tiene su propio contenedor con todas las dependencias requeridas, eliminando conflictos y facilitando la reproducción de errores.

- **Distribución de la Carga en el Sistema Anfitrión:**
  Los contenedores pueden ejecutarse en paralelo, optimizando el uso de recursos del host y acelerando los tiempos de ejecución.

- **Entornos Efímeros:**
  Cada contenedor se crea y destruye para cada prueba, garantizando que los entornos sean limpios y consistentes.

- **Escalabilidad Automática:**
  Con una configuración adecuada, puedes integrar esta solución con herramientas de orquestación como Kubernetes para manejar cargas más grandes.

---

## Cómo comenzar

### Prerrequisitos
1. **Docker instalado:** Tener Docker configurado en el sistema anfitrión.
2. **Permisos para el socket Docker:** El usuario (jenkins) que ejecuta el contenedor debe tener acceso al socket de Docker `/var/run/docker.sock`
3. **Acceso a Docker sin sudo:** Para permitir que Jenkins acceda a Docker sin necesidad de usar `sudo`, agrega el usuario `jenkins` al grupo `docker` en el sistema anfitrión. Esto se puede hacer ejecutando el siguiente comando:

  ```bash
  sudo usermod -aG docker jenkins
  ```

  Después de ejecutar este comando, es posible que necesites reiniciar la sesión del usuario para que los cambios surtan efecto.


## Como instalar
### Instalación

1. **Obtener el GID del grupo docker:**
  Ejecuta el siguiente comando para obtener el GID del grupo docker en el sistema anfitrión:
  ```bash
  getent group docker
  ```

2. **Construir la imagen de Docker:**
  Navega al directorio del proyecto y construye la imagen de Docker con el siguiente comando:
  ```bash
  docker build -t jenkins-plus-cypress --build-arg DOCKER_GID=137 .
  ```

3. **Ejecutar el contenedor de Jenkins:**
  Inicia el contenedor de Jenkins con acceso al socket de Docker del host:
  ```bash
  sudo docker run -d \
  --name jenkins-docker \
  -p 8080:8080 \
  -p 50000:50000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  agilgob-jenkins-dood:1.0
  ```

### Para comprobar la instalacion y la conexion de los sockets
1. **Entrar al contenedor de Jenkins:**
  Para acceder al contenedor de Jenkins, ejecuta el siguiente comando:
  ```bash
  sudo docker exec -it jenkins-docker /bin/bash
  ```

2. **Ejecutar un contenedor desde Jenkins:**
  Una vez dentro del contenedor de Jenkins, puedes ejecutar un contenedor Docker. Por ejemplo, para ejecutar un contenedor de Alpine Linux, usa el siguiente comando:
  ```bash
  docker run -d --name test-container alpine sleep 1000
  ```

3. **Monitorear el contenedor desde el host:**
  Abre una nueva terminal en el host y ejecuta el siguiente comando para ver los logs del contenedor que acabas de iniciar:
  ```bash
  sudo docker logs -f test-container
  ```

  También puedes verificar el estado del contenedor con:
  ```bash
  sudo docker ps -a
  ```
