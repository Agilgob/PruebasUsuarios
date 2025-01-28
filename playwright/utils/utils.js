export const medirDuracionEnSegundos = () => {
    const inicio = Date.now();
    return () => {
      const fin = Date.now();
      const duracionEnSegundos = ((fin - inicio) / 1000).toFixed(2);
      return parseFloat(duracionEnSegundos);
    };
  };