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



---

## Consideraciones
- **Seguridad:** Configurar permisos adecuados y ejecutar los contenedores en un entorno controlado.
- **Persistencia de Datos:** Utiliza volúmenes para mantener el estado de Jenkins entre reinicios.
- **Optimización de Recursos:** Configurar límites de CPU y memoria para los contenedores Docker y evita la sobrecarga del sistema anfitrión.

---

## Contribuciones
Las contribuciones son bienvenidas. Si tienes ideas, mejoras o encuentras errores, por favor abre un issue o envía un pull request.

---

🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

