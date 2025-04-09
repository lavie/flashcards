// Conjugation data for irregular Portuguese verbs
const conjugations = {
    // Regular -ar verb example
    "falar": {
        present: {
            "eu": "falo",
            "tu": "falas",
            "ele_ela_você": "fala",
            "nós": "falamos",
            "eles_elas_vocês": "falam"
        },
        preterite: {
            "eu": "falei",
            "tu": "falaste", 
            "ele_ela_você": "falou",
            "nós": "falamos",
            "eles_elas_vocês": "falaram"
        },
        future: {
            "eu": "falarei",
            "tu": "falarás",
            "ele_ela_você": "falará", 
            "nós": "falaremos",
            "eles_elas_vocês": "falarão"
        }
    },
    // Irregular verbs
    "ser": {
        present: {
            "eu": "sou",
            "tu": "és",
            "ele_ela_você": "é",
            "nós": "somos",
            "eles_elas_vocês": "são"
        },
        preterite: {
            "eu": "fui",
            "tu": "foste",
            "ele_ela_você": "foi",
            "nós": "fomos",
            "eles_elas_vocês": "foram"
        },
        future: {
            "eu": "serei",
            "tu": "serás",
            "ele_ela_você": "será",
            "nós": "seremos",
            "eles_elas_vocês": "serão"
        }
    },
    "ir": {
        present: {
            "eu": "vou",
            "tu": "vais",
            "ele_ela_você": "vai",
            "nós": "vamos",
            "eles_elas_vocês": "vão"
        },
        preterite: {
            "eu": "fui",
            "tu": "foste",
            "ele_ela_você": "foi",
            "nós": "fomos",
            "eles_elas_vocês": "foram"
        },
        future: {
            "eu": "irei",
            "tu": "irás",
            "ele_ela_você": "irá",
            "nós": "iremos",
            "eles_elas_vocês": "irão"
        }
    },
    "ter": {
        present: {
            "eu": "tenho",
            "tu": "tens",
            "ele_ela_você": "tem",
            "nós": "temos",
            "eles_elas_vocês": "têm"
        },
        preterite: {
            "eu": "tive",
            "tu": "tiveste",
            "ele_ela_você": "teve",
            "nós": "tivemos",
            "eles_elas_vocês": "tiveram"
        },
        future: {
            "eu": "terei",
            "tu": "terás",
            "ele_ela_você": "terá",
            "nós": "teremos",
            "eles_elas_vocês": "terão"
        }
    },
    "estar": {
        present: {
            "eu": "estou",
            "tu": "estás",
            "ele_ela_você": "está",
            "nós": "estamos",
            "eles_elas_vocês": "estão"
        },
        preterite: {
            "eu": "estive",
            "tu": "estiveste",
            "ele_ela_você": "esteve",
            "nós": "estivemos",
            "eles_elas_vocês": "estiveram"
        },
        future: {
            "eu": "estarei",
            "tu": "estarás",
            "ele_ela_você": "estará",
            "nós": "estaremos",
            "eles_elas_vocês": "estarão"
        }
    }
};

// Function to generate conjugations for regular -ar verbs
function generateArConjugations(infinitive) {
    const stem = infinitive.slice(0, -2);
    return {
        present: {
            "eu": stem + "o",
            "tu": stem + "as",
            "ele_ela_você": stem + "a",
            "nós": stem + "amos",
            "eles_elas_vocês": stem + "am"
        },
        preterite: {
            "eu": stem + "ei",
            "tu": stem + "aste",
            "ele_ela_você": stem + "ou",
            "nós": stem + "amos",
            "eles_elas_vocês": stem + "aram"
        },
        future: {
            "eu": stem + "arei",
            "tu": stem + "arás",
            "ele_ela_você": stem + "ará",
            "nós": stem + "aremos",
            "eles_elas_vocês": stem + "arão"
        }
    };
}

// Function to generate conjugations for regular -er verbs
function generateErConjugations(infinitive) {
    const stem = infinitive.slice(0, -2);
    return {
        present: {
            "eu": stem + "o",
            "tu": stem + "es",
            "ele_ela_você": stem + "e",
            "nós": stem + "emos",
            "eles_elas_vocês": stem + "em"
        },
        preterite: {
            "eu": stem + "i",
            "tu": stem + "este",
            "ele_ela_você": stem + "eu",
            "nós": stem + "emos",
            "eles_elas_vocês": stem + "eram"
        },
        future: {
            "eu": stem + "erei",
            "tu": stem + "erás",
            "ele_ela_você": stem + "erá",
            "nós": stem + "eremos",
            "eles_elas_vocês": stem + "erão"
        }
    };
}

// Function to generate conjugations for regular -ir verbs
function generateIrConjugations(infinitive) {
    const stem = infinitive.slice(0, -2);
    return {
        present: {
            "eu": stem + "o",
            "tu": stem + "es",
            "ele_ela_você": stem + "e",
            "nós": stem + "imos",
            "eles_elas_vocês": stem + "em"
        },
        preterite: {
            "eu": stem + "i",
            "tu": stem + "iste",
            "ele_ela_você": stem + "iu",
            "nós": stem + "imos",
            "eles_elas_vocês": stem + "iram"
        },
        future: {
            "eu": stem + "irei",
            "tu": stem + "irás",
            "ele_ela_você": stem + "irá",
            "nós": stem + "iremos",
            "eles_elas_vocês": stem + "irão"
        }
    };
}

// Function to get conjugations for any verb
function getConjugations(infinitive) {
    // If we have predefined conjugations for this verb, use those
    if (conjugations[infinitive]) {
        return conjugations[infinitive];
    }
    
    // Otherwise, generate conjugations based on verb ending
    if (infinitive.endsWith('ar')) {
        return generateArConjugations(infinitive);
    } else if (infinitive.endsWith('er')) {
        return generateErConjugations(infinitive);
    } else if (infinitive.endsWith('ir')) {
        return generateIrConjugations(infinitive);
    }
    
    // If we can't determine the conjugation, return null
    return null;
}
