function isPlainObject(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
}

export function deepMerge(a, b) {
    // Si ambos son arrays, el segundo reemplaza al primero
    if (Array.isArray(a) && Array.isArray(b)) return b.slice();

    const out = Array.isArray(a) ? a.slice() : { ...a };

    for (const [k, v] of Object.entries(b || {})) {
        if (v === undefined) continue; // clave “no seteada” en b → conserva a[k]
        const av = out[k];
        if (isPlainObject(av) && isPlainObject(v)) {
            out[k] = deepMerge(av, v);
        } else if (Array.isArray(v)) {
            out[k] = v.slice();            // arrays: el segundo reemplaza
        } else {
            out[k] = v;                    // primitivos / objetos no planos
        }
    }
    return out;
}