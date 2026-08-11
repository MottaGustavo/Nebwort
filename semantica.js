/* ===================================================================
   NebWort — semantica.js
   Embeddings no navegador + heurísticas + dicionário de relações
   para reduzir falsos negativos (ex.: surfe → prancha/mar/água).
   =================================================================== */

const URL_BIBLIOTECA = "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";
const NOME_MODELO = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

/** Limiar principal. Antes 0.5 rejeitava relações óbvias (mar 34%, água 46%). */
export const LIMIAR_SIMILARIDADE = 0.30;

let moduloTransformers = null;
let extrator = null;
let carregamentoFalhou = false;
let promessaCarregamento = null;
const cacheEmbeddings = new Map();

/**
 * Grupos de palavras fortemente relacionadas.
 * Se a sorteada e a resposta estiverem no mesmo grupo → aprova.
 * Cobre os temas atuais do jogo + associações comuns em PT-BR.
 */
const GRUPOS_RELACIONADOS = [
  // Esportes / surfe
  ["surfe", "surf", "praia", "mar", "oceano", "onda", "ondas", "prancha", "agua", "água", "areia", "sol", "verao", "verão", "tubarão", "mergulho", "nadar", "natação", "natacao"],
  ["futebol", "bola", "gol", "campo", "chuteira", "jogador", "time", "estadio", "estádio", "juiz", "torcida", "campeonato", "copa"],
  ["basquete", "cesta", "quadra", "enterrada", "nba", "bola"],
  ["boxe", "luta", "ringue", "soco", "luva", "punch", "knockout"],
  ["tenis", "tênis", "raquete", "quadra", "saque", "rede"],
  ["ciclismo", "bike", "bicicleta", "pedal", "capacete", "estrada"],
  ["corrida", "maratona", "atletismo", "pista", "sprint", "tênis", "tenis"],
  // Animais
  ["cachorro", "cão", "cao", "latido", "osso", "coleira", "pet", "animal", "puppy", "cãozinho"],
  ["gato", "felino", "miado", "pet", "animal", "gatinho"],
  ["elefante", "tromba", "savana", "africa", "áfrica", "animal", "mamute"],
  ["tigre", "felino", "selva", "listras", "animal", "leão", "leao"],
  ["cavalo", "haras", "sela", "galope", "égua", "egua", "potro", "animal"],
  ["passaro", "pássaro", "ave", "asa", "voo", "ninho", "penas", "animal"],
  ["peixe", "mar", "rio", "aquario", "aquário", "nadar", "oceano", "animal"],
  ["coelho", "cenoura", "orelha", "buraco", "animal"],
  // Comida
  ["pizza", "queijo", "massa", "tomate", "forno", "fatia", "pepperoni", "comida"],
  ["arroz", "feijao", "feijão", "comida", "prato", "almoço", "almoco"],
  ["feijao", "feijão", "arroz", "comida", "tropeiro"],
  ["chocolate", "cacau", "doce", "sobremesa", "bomba", "trufa"],
  ["laranja", "fruta", "suco", "cítrico", "citrico", "casca"],
  ["queijo", "leite", "mussarela", "pizza", "pão", "pao"],
  ["pao", "pão", "trigo", "padaria", "lanche", "café", "cafe"],
  ["sorvete", "gelado", "doce", "sobremesa", "casquinha", "baunilha"],
  // Natureza
  ["montanha", "pico", "trilha", "alpinismo", "serra", "rocha", "natureza"],
  ["rio", "água", "agua", "peixe", "ponte", "correnteza", "natureza"],
  ["floresta", "árvore", "arvore", "selva", "mata", "verde", "natureza"],
  ["deserto", "areia", "sol", "oásis", "oasis", "camelo", "natureza"],
  ["oceano", "mar", "água", "agua", "peixe", "onda", "natureza"],
  ["vulcao", "vulcão", "lava", "magma", "erupção", "erupcao", "natureza"],
  ["cachoeira", "água", "agua", "queda", "natureza", "rio"],
  ["ilha", "mar", "praia", "oceano", "natureza"],
  // Profissões
  ["medico", "médico", "hospital", "paciente", "remedio", "remédio", "cirurgia", "saúde", "saude", "doutor"],
  ["professor", "escola", "aluno", "aula", "ensino", "quadro", "educação", "educacao"],
  ["engenheiro", "obra", "cálculo", "calculo", "projeto", "construção", "construcao"],
  ["cozinheiro", "chef", "cozinha", "comida", "receita", "restaurante", "fogão", "fogao"],
  ["piloto", "avião", "aviao", "voo", "cockpit", "aeroporto", "aviacao", "aviação"],
  ["advogado", "lei", "justiça", "justica", "tribunal", "processo", "cliente"],
  ["musico", "músico", "musica", "música", "instrumento", "show", "banda", "som"],
  ["pintor", "tinta", "quadro", "arte", "pincel", "tela", "cor"],
  // Tecnologia
  ["computador", "pc", "teclado", "mouse", "tela", "software", "hardware", "internet"],
  ["internet", "wifi", "rede", "site", "online", "web", "navegador"],
  ["celular", "smartphone", "telefone", "app", "tela", "bateria", "chip"],
  ["robo", "robô", "automação", "automacao", "inteligencia", "inteligência", "maquina", "máquina"],
  ["satelite", "satélite", "espaço", "espaco", "orbita", "órbita", "comunicação", "comunicacao"],
  ["software", "programa", "codigo", "código", "app", "sistema", "computador"],
  ["bateria", "energia", "carga", "eletricidade", "celular", "pilha"],
  ["teclado", "digitar", "computador", "tecla", "pc"],
  // Emoções
  ["saudade", "falta", "lembrança", "lembranca", "nostalgia", "distancia", "distância"],
  ["alegria", "felicidade", "sorriso", "festa", "contentamento", "riso"],
  ["medo", "pavor", "susto", "ansiedade", "terror", "receio"],
  ["coragem", "bravura", "força", "forca", "ousadia", "valentia"],
  ["raiva", "ódio", "odio", "furia", "fúria", "irritação", "irritacao", "bravo"],
  ["esperanca", "esperança", "fé", "fe", "otimismo", "futuro", "sonho"],
  ["gratidao", "gratidão", "obrigado", "agradecimento", "reconhecimento"],
  ["surpresa", "espanto", "assombro", "inesperado", "choque"],
  // Espaço
  ["galaxia", "galáxia", "estrela", "universo", "espaço", "espaco", "via lactea", "via láctea"],
  ["planeta", "terra", "marte", "orbita", "órbita", "sistema solar", "espaço", "espaco"],
  ["estrela", "sol", "constelação", "constelacao", "brilho", "céu", "ceu", "espaço", "espaco"],
  ["cometa", "cauda", "órbita", "orbita", "espaço", "espaco", "astro"],
  ["buraco negro", "buraco", "negro", "gravidade", "espaço", "espaco", "evento"],
  ["nebulosa", "gás", "gas", "poeira", "espaço", "espaco", "estrela"],
  ["asteroide", "meteoro", "rocha", "espaço", "espaco", "impacto"],
  ["universo", "cosmos", "espaço", "espaco", "galáxia", "galaxia", "tudo"],
  // História
  ["revolucao", "revolução", "rebelião", "rebeliao", "mudança", "mudanca", "povo", "liberdade"],
  ["imperio", "império", "imperador", "colonia", "colônia", "conquista", "poder"],
  ["civilizacao", "civilização", "cultura", "sociedade", "povo", "história", "historia"],
  ["monarquia", "rei", "rainha", "coroa", "trono", "reino", "nobreza"],
  ["independencia", "independência", "liberdade", "nação", "nacao", "patria", "pátria"],
  ["tratado", "acordo", "paz", "diplomacia", "nação", "nacao"],
  ["colonizacao", "colonização", "colonia", "colônia", "exploração", "exploracao", "conquista"],
  ["democracia", "voto", "eleição", "eleicao", "povo", "liberdade", "governo"],
];

export function normalizarTexto(texto) {
  return String(texto || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function noMesmoGrupo(a, b) {
  const na = normalizarTexto(a);
  const nb = normalizarTexto(b);
  if (!na || !nb) return false;

  for (const grupo of GRUPOS_RELACIONADOS) {
    const normalizados = grupo.map(normalizarTexto);
    if (normalizados.includes(na) && normalizados.includes(nb)) return true;
  }
  return false;
}

function formasProximas(a, b) {
  const x = normalizarTexto(a);
  const y = normalizarTexto(b);
  if (!x || !y) return false;
  if (x === y) return true;

  const menor = x.length <= y.length ? x : y;
  const maior = x.length <= y.length ? y : x;
  if (maior.startsWith(menor) && maior.length - menor.length <= 3) return true;

  const pares = [
    [/s$/, ""],
    [/es$/, ""],
    [/ns$/, "m"],
    [/oes$/, "ao"],
    [/aes$/, "ao"],
    [/ais$/, "al"],
    [/eis$/, "el"],
    [/ois$/, "ol"],
    [/is$/, "l"],
  ];

  function stem(p) {
    let s = p;
    for (const [re, sub] of pares) {
      if (re.test(s) && s.replace(re, sub).length >= 3) {
        s = s.replace(re, sub);
        break;
      }
    }
    return s;
  }

  return stem(x) === stem(y);
}

async function carregarInternamente() {
  try {
    moduloTransformers = await import(URL_BIBLIOTECA);
    if (moduloTransformers.env) {
      moduloTransformers.env.allowLocalModels = false;
    }
    extrator = await moduloTransformers.pipeline("feature-extraction", NOME_MODELO);
    return extrator;
  } catch (erro) {
    console.error("[semantica.js] Falha ao carregar o modelo. Modo fallback.", erro);
    carregamentoFalhou = true;
    return null;
  }
}

export function carregarModelo() {
  if (!promessaCarregamento) {
    promessaCarregamento = carregarInternamente();
  }
  return promessaCarregamento;
}

export function emModoFallback() {
  return carregamentoFalhou;
}

async function obterEmbedding(texto) {
  const chave = normalizarTexto(texto);
  if (cacheEmbeddings.has(chave)) return cacheEmbeddings.get(chave);

  const modelo = await carregarModelo();
  if (!modelo) return null;

  const resultado = await modelo(texto, { pooling: "mean", normalize: true });
  const dados = resultado.data;
  cacheEmbeddings.set(chave, dados);
  return dados;
}

export async function calcularSimilaridade(palavra1, palavra2) {
  const modelo = await carregarModelo();
  if (!modelo || !moduloTransformers) return null;

  try {
    const pares = [
      [palavra1, palavra2],
      [normalizarTexto(palavra1), normalizarTexto(palavra2)],
    ];

    let melhor = 0;
    for (const [a, b] of pares) {
      if (!a || !b) continue;
      const e1 = await obterEmbedding(a);
      const e2 = await obterEmbedding(b);
      if (!e1 || !e2) continue;
      const sim = moduloTransformers.cos_sim(e1, e2);
      if (sim > melhor) melhor = sim;
    }
    return melhor;
  } catch (erro) {
    console.error("[semantica.js] Erro ao calcular similaridade:", erro);
    return null;
  }
}

/**
 * Avalia relação entre resposta e palavra sorteada.
 * Ordem: igual → grupo relacionado → forma próxima → modelo → fallback.
 */
export async function avaliarRelacao(resposta, alvo) {
  const r = String(resposta || "").trim();
  const a = String(alvo || "").trim();

  if (!r || !a) {
    return { passou: false, similaridade: 0, motivo: "vazio" };
  }

  // mesma palavra não pontua
  if (normalizarTexto(r) === normalizarTexto(a)) {
    return { passou: false, similaridade: 1, motivo: "igual" };
  }

  // dicionário de relações (resolve casos como surfe↔prancha)
  if (noMesmoGrupo(r, a)) {
    return { passou: true, similaridade: 0.92, motivo: "grupo" };
  }

  if (formasProximas(r, a)) {
    return { passou: true, similaridade: 0.9, motivo: "forma-proxima" };
  }

  const similaridade = await calcularSimilaridade(r, a);

  if (similaridade === null) {
    return { passou: true, similaridade: null, motivo: "fallback" };
  }

  const passou = similaridade >= LIMIAR_SIMILARIDADE;
  return {
    passou,
    similaridade,
    motivo: passou ? "semantico" : "baixo",
  };
}
