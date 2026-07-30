/* ===================================================================
   NebWort / Semanti — script.js
   Lógica compartilhada por TODAS as páginas: contas, login, pontos,
   navegação protegida e mecânica das fases.
   A validação semântica em si mora em semantica.js (módulo isolado).
   =================================================================== */

/* Caminho relativo até a raiz do site. Páginas dentro de subpastas
   devem declarar `const CAMINHO_RAIZ = "../../";` ANTES de importar
   este arquivo. Na raiz, nenhuma declaração é necessária. */
const RAIZ = (typeof CAMINHO_RAIZ !== "undefined") ? CAMINHO_RAIZ : "";

const CHAVE_CONTAS = "nebwortContas";
const CHAVE_USUARIO_ATUAL = "nebwortUsuarioAtual";

/* Limiar de similaridade semântica (0 a 1). Ajustável. */
const LIMIAR_SIMILARIDADE = 0.5;

/* ------------------------------------------------------------------ */
/* Contas / persistência                                              */
/* ------------------------------------------------------------------ */

function obterContas() {
  try {
    const bruto = localStorage.getItem(CHAVE_CONTAS);
    return bruto ? JSON.parse(bruto) : {};
  } catch (erro) {
    console.error("Não foi possível ler as contas do localStorage:", erro);
    return {};
  }
}

function salvarContas(contas) {
  localStorage.setItem(CHAVE_CONTAS, JSON.stringify(contas));
}

function obterUsuarioAtual() {
  return localStorage.getItem(CHAVE_USUARIO_ATUAL);
}

function definirUsuarioAtual(nickname) {
  localStorage.setItem(CHAVE_USUARIO_ATUAL, nickname);
}

function fazerLogout() {
  localStorage.removeItem(CHAVE_USUARIO_ATUAL);
  window.location.href = RAIZ + "index.html";
}

function obterPontosUsuario(nickname) {
  const contas = obterContas();
  return contas[nickname] ? contas[nickname].pontos : 0;
}

function adicionarPontos(quantidade) {
  const nickname = obterUsuarioAtual();
  if (!nickname) return;
  const contas = obterContas();
  if (!contas[nickname]) return;
  contas[nickname].pontos = (contas[nickname].pontos || 0) + quantidade;
  salvarContas(contas);
}

/* ------------------------------------------------------------------ */
/* Proteção de páginas                                                 */
/* ------------------------------------------------------------------ */

/* Chamar no topo de toda página que exige estar logado.
   Retorna o nickname logado, ou redireciona e retorna null. */
function exigirLogin() {
  const nickname = obterUsuarioAtual();
  const contas = obterContas();
  if (!nickname || !contas[nickname]) {
    localStorage.removeItem(CHAVE_USUARIO_ATUAL);
    window.location.href = RAIZ + "index.html";
    return null;
  }
  return nickname;
}

/* ------------------------------------------------------------------ */
/* index.html — modal de login                                        */
/* ------------------------------------------------------------------ */

function iniciarLogin() {
  const modal = document.getElementById("modalLogin");
  if (!modal) return; // esta página não tem o modal de login

  // Se já existe usuário logado válido, pula direto para pagina2.
  const nicknameAtual = obterUsuarioAtual();
  const contas = obterContas();
  if (nicknameAtual && contas[nicknameAtual]) {
    window.location.href = RAIZ + "pagina2.html";
    return;
  }

  const formulario = document.getElementById("formularioLogin");
  const campoNickname = document.getElementById("campoNickname");
  const campoSenha = document.getElementById("campoSenha");
  const mensagemErro = document.getElementById("mensagemErroLogin");

  // Nunca deve poder fechar sem logar: bloqueia ESC e clique no backdrop.
  modal.addEventListener("cancel", (evento) => {
    evento.preventDefault();
  });
  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) {
      // clique fora do conteúdo (no próprio <dialog>, que ocupa o backdrop)
      evento.stopPropagation();
    }
  });

  if (formulario) {
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      if (mensagemErro) mensagemErro.textContent = "";
      if (campoNickname) campoNickname.classList.remove("campo-erro");
      if (campoSenha) campoSenha.classList.remove("campo-erro");

      const nickname = (campoNickname?.value || "").trim();
      const senha = campoSenha?.value || "";

      if (!nickname || !senha) {
        if (mensagemErro) mensagemErro.textContent = "Preencha nickname e senha.";
        return;
      }

      const contasAtuais = obterContas();

      if (!contasAtuais[nickname]) {
        // conta nova
        contasAtuais[nickname] = { senha: senha, pontos: 0 };
        salvarContas(contasAtuais);
        definirUsuarioAtual(nickname);
        window.location.href = RAIZ + "pagina2.html";
        return;
      }

      // conta existente: valida senha
      if (contasAtuais[nickname].senha !== senha) {
        if (mensagemErro) mensagemErro.textContent = "Senha incorreta. Tente novamente.";
        if (campoSenha) campoSenha.classList.add("campo-erro");
        return;
      }

      definirUsuarioAtual(nickname);
      window.location.href = RAIZ + "pagina2.html";
    });
  }

  if (typeof modal.showModal === "function") {
    modal.showModal();
  }
}

/* ------------------------------------------------------------------ */
/* pagina2.html — boas-vindas                                         */
/* ------------------------------------------------------------------ */

function iniciarBoasVindas() {
  const saudacao = document.getElementById("saudacaoUsuario");
  if (!saudacao) return;
  const nickname = exigirLogin();
  if (!nickname) return;
  saudacao.textContent = `Bem-vindo, ${nickname}!`;
}

/* ------------------------------------------------------------------ */
/* pagina3.html — escolher dificuldade                                */
/* ------------------------------------------------------------------ */

function iniciarEscolhaDificuldade() {
  const seletor = document.getElementById("seletorDificuldade");
  if (!seletor) return;
  const nickname = exigirLogin();
  if (!nickname) return;

  const displayPontos = document.getElementById("pontosAtuais");
  if (displayPontos) {
    displayPontos.textContent = obterPontosUsuario(nickname);
  }

  const botaoFacil = document.getElementById("botaoJogarFacil");
  const botaoMedio = document.getElementById("botaoJogarMedio");
  const botaoDificil = document.getElementById("botaoJogarDificil");

  const botoes = { facil: botaoFacil, medio: botaoMedio, dificil: botaoDificil };

  function atualizarVisibilidade() {
    Object.values(botoes).forEach((botao) => botao && botao.classList.add("oculto"));
    const escolha = seletor.value;
    if (escolha && botoes[escolha]) {
      botoes[escolha].classList.remove("oculto");
    }
  }

  seletor.addEventListener("change", atualizarVisibilidade);
  atualizarVisibilidade();
}

/* ------------------------------------------------------------------ */
/* ranking.html                                                       */
/* ------------------------------------------------------------------ */

function iniciarRanking() {
  const corpoTabela = document.getElementById("corpoTabelaRanking");
  if (!corpoTabela) return;
  const nickname = exigirLogin();
  if (!nickname) return;

  const contas = obterContas();
  const listaOrdenada = Object.entries(contas)
    .map(([nick, dados]) => ({ nickname: nick, pontos: dados.pontos || 0 }))
    .sort((a, b) => b.pontos - a.pontos);

  corpoTabela.innerHTML = "";
  listaOrdenada.forEach((entrada, indice) => {
    const linha = document.createElement("tr");
    if (entrada.nickname === nickname) {
      linha.classList.add("linha-atual");
    }
    linha.innerHTML = `
      <td class="coluna-posicao">${indice + 1}</td>
      <td>${escaparHtml(entrada.nickname)}</td>
      <td class="coluna-pontos">${entrada.pontos}</td>
    `;
    corpoTabela.appendChild(linha);
  });

  const botaoSair = document.getElementById("botaoSair");
  if (botaoSair) {
    botaoSair.addEventListener("click", fazerLogout);
  }
}

function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

/* ------------------------------------------------------------------ */
/* Páginas de fase — mecânica compartilhada                           */
/*                                                                     */
/* Cada página de fase (Facil/Medio/Dificil FaseN.html) declara um     */
/* array global `PALAVRAS_DA_FASE` e chama `iniciarFase(quantidade)`.  */
/* A validação semântica (import assíncrono de semantica.js) é feita   */
/* dentro do próprio HTML da fase, pois requer `type="module"`; aqui   */
/* ficam apenas as partes que NÃO precisam de módulos ES.              */
/* ------------------------------------------------------------------ */

/* Sorteia um índice válido de um array de qualquer tamanho. */
function sortearIndice(array) {
  return Math.floor(Math.random() * array.length);
}

/* Formata o campo de resposta: troca espaços por vírgula, remove
   caracteres inválidos (mantém letras/acentos e vírgulas) e remove
   vírgulas duplicadas/consecutivas. */
function formatarCampoResposta(valorBruto) {
  let valor = valorBruto.replace(/\s+/g, ",");
  valor = valor.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ,]/g, "");
  valor = valor.replace(/,+/g, ",");
  valor = valor.replace(/^,/, "");
  return valor;
}

function anexarFormatacaoAutomatica(campoInput) {
  if (!campoInput) return;
  campoInput.addEventListener("input", () => {
    const posicaoCursor = campoInput.selectionStart;
    const tamanhoAntes = campoInput.value.length;
    campoInput.value = formatarCampoResposta(campoInput.value);
    const diferenca = campoInput.value.length - tamanhoAntes;
    const novaPosicao = Math.max(0, (posicaoCursor || 0) + diferenca);
    campoInput.setSelectionRange(novaPosicao, novaPosicao);
  });
}

/* Extrai a lista de palavras digitadas (sem vazios, sem duplicar espaços). */
function extrairPalavrasDigitadas(valorCampo) {
  return valorCampo
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/* Calcula a pontuação de uma palavra aprovada semanticamente. */
function calcularPontosPalavra(palavra) {
  return palavra.length >= 5 ? 10 : 2;
}
