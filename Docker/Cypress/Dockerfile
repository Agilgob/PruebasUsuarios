FROM cypress/base:22.13.1

USER root

WORKDIR /home


# TO DO cambiar la branch desde donde se van a ejecutar las pruebas
RUN git clone --branch SecretarioAcuerdos https://github.com/manuel-agilgob/PruebasUsuarios \
    && cd PruebasUsuarios \
    && npm install

WORKDIR /home/PruebasUsuarios


# TO DO Agregar los parametros de ejecucion de las pruebas de cypress
# Recibe como parametros las variables de entorno que luego usa cypress para ejecutar las pruebas
# Dentro del contenedor se valida que las variables de entorno se hayan pasado correctamente
# Si no se pasan, el proceso termina con codigo 1

# SPEC es la unica variable oblicatoria, para definir el archivo o carpetas que
# deben ser ejecutados en el entrypoint

ARG spec
ENV SPEC=${spec}


ARG funcionario 
ENV FUNCIONARIO=${funcionario}

ARG ciudadano 
ENV CIUDADANO=${ciudadano}

ARG tramite 
ENV TRAMITE=${tramite}

ARG testData 
ENV TEST_DATA=${testData}



COPY run_tests.sh .
RUN chmod +x run_tests.sh
CMD [ "./run_tests.sh" ]
