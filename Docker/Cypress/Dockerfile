# NOTA: Se usa la version cypress/base en lugar de cypress/included por la diferencia 
# de tamaño de la imagen, la primera pesa 1.4GB y la segunda 3GB pero puede cambiarse sin problema
# si se desea probar con diferentes navegadores o versiones de cypress
FROM cypress/base:22.13.1

USER root

WORKDIR /home

# TO DO cambiar la branch desde donde se van a ejecutar las pruebas
RUN git clone --branch SecretarioAcuerdos https://github.com/manuel-agilgob/PruebasUsuarios \
    && cd PruebasUsuarios \
    && npm install

WORKDIR /home/PruebasUsuarios

# ARG SPECS
# ENV specs=${spec}

# ARG FUNCIONARIO 
# ENV funcionario=${FUNCIONARIO}

# ARG CIUDADANO 
# ENV ciudadano=${CIUDADANO}

# ARG TRAMITE 
# ENV tramite=${TRAMITE}

# ARG JSON_FILE 
# ENV jsonFile=${JSON_FILE}

# COPY run_tests.sh .
# RUN chmod +x run_tests.sh
# CMD [ "./run_tests.sh" ]
