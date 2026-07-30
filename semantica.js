/* ===================================================================
   NebWort / Semanti — semantica.js
   Módulo isolado responsável por carregar o modelo de embeddings do
   Xenova Transformers.js (100% no navegador, sem servidor) e calcular
   a similaridade semântica entre duas palavras.

   Este arquivo é sempre carregado com <script type="module">.
   =================================================================== */

const URL_BIBLIOTECA = "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";
const NOME_MODELO = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

let moduloTransformers = null;
let extrator = null;
let carregamentoFalhou = false;
let promessaCarregamento = null;

/* Faz o carregamento real (biblioteca + pipeline). Só roda uma vez,
   graças ao singleton em `promessaCarregamento`. */
async function carregarInternamente() {
  try {
    moduloTransformers = await import(URL_BIBLIOTECA);
    // Evita que o transformers.js tente baixar/rodar em Node; garante uso
    // do backend WASM no navegador (comportamento padrão da lib, mas
    // deixamos explícito para robustez).
    if (moduloTransformers.env) {
      moduloTransformers.env.allowLocalModels = false;
    }
    extrator = await moduloTransformers.pipeline("feature-extraction", NOME_MODELO);
    return extrator;
  } catch (erro) {
    console.error("[semantica.js] Falha ao carregar o modelo semântico. Entrando em modo fallback (pontuação apenas por tamanho).", erro);
    carregamentoFalhou = true;
    return null;
  }
}

/* Dispara (ou reaproveita) o carregamento do modelo.
   Retorna uma Promise que resolve para o extrator, ou null em caso de
   falha (modo fallback). Chamar cedo (ex: ao abrir a página de fase)
   para começar o download em paralelo com o resto da UI. */
export function carregarModelo() {
  if (!promessaCarregamento) {
    promessaCarregamento = carregarInternamente();
  }
  return promessaCarregamento;
}

/* true depois que uma tentativa de carregamento falhou definitivamente. */
export function emModoFallback() {
  return carregamentoFalhou;
}

/* Calcula a similaridade de cosseno (0 a 1, aproximadamente) entre duas
   palavras/expressões. Retorna `null` se o modelo não estiver disponível
   (fallback), para que quem chamou decida como pontuar sem a checagem
   semântica. */
export async function calcularSimilaridade(palavra1, palavra2) {
  const modelo = await carregarModelo();
  if (!modelo || !moduloTransformers) return null;

  try {
    const embedding1 = await modelo(palavra1, { pooling: "mean", normalize: true });
    const embedding2 = await modelo(palavra2, { pooling: "mean", normalize: true });
    return moduloTransformers.cos_sim(embedding1.data, embedding2.data);
  } catch (erro) {
    console.error("[semantica.js] Erro ao calcular similaridade:", erro);
    return null;
  }
}
