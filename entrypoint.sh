#!/bin/bash



IFS=',' read -r -a scenarios_array <<< "$TEST_SCENARIOS"

for escenario in "${scenarios_array[@]}"; do
    case "$escenario" in
        exploratorios)
        ./entrypoint/exploratorios.sh
        ;;
        konami)
        ./entrypoint/konami.sh
        ;;
        demanda-inicial)
        ./entrypoint/demanda-inicial.sh
        ;;
        penal)
        ./entrypoint/penal.sh
        ;;
        *)
        echo "Escenario desconocido: $escenario"
        ;;
    esac
done

./entrypoint/sendReport.sh
