/* ===================================================================
   NebWort — script.js
   Contas, login, pontos, títulos, modos (rápido / história) e helpers.
   =================================================================== */

const RAIZ = (typeof CAMINHO_RAIZ !== "undefined") ? CAMINHO_RAIZ : "";

const CHAVE_CONTAS = "nebwortContas";
const CHAVE_USUARIO_ATUAL = "nebwortUsuarioAtual";
const CHAVE_MODO = "nebwortModo";
const CHAVE_CAPITULO = "nebwortCapitulo";

const LIMIAR_SIMILARIDADE = 0.30;

/** Total de subcapítulos do modo história (9 temas × 5). */
const TOTAL_SUBS_HISTORIA = 45;

const TITULOS = [
  { min: 0,   id: "aprendiz",     nome: "Aprendiz",           emoji: "🌱" },
  { min: 50,  id: "conector",     nome: "Conector",           emoji: "🔗" },
  { min: 150, id: "semantico",    nome: "Semântico",          emoji: "✨" },
  { min: 350, id: "constelacao",  nome: "Constelação",        emoji: "🌌" },
  { min: 700, id: "mestre",       nome: "Mestre das Palavras", emoji: "👑" },
];

function obterTituloPorPontos(pontos) {
  let atual = TITULOS[0];
  for (const t of TITULOS) {
    if (pontos >= t.min) atual = t;
  }
  return atual;
}

function obterProximoTitulo(pontos) {
  for (const t of TITULOS) {
    if (pontos < t.min) return t;
  }
  return null;
}

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

function garantirEstruturaConta(dados) {
  if (!dados || typeof dados !== "object") {
    return { senha: "", pontos: 0, historiaCapitulo: 0 };
  }
  if (typeof dados.pontos !== "number") dados.pontos = 0;
  if (typeof dados.historiaCapitulo !== "number") dados.historiaCapitulo = 0;
  return dados;
}

function obterUsuarioAtual() {
  return localStorage.getItem(CHAVE_USUARIO_ATUAL);
}

function definirUsuarioAtual(nickname) {
  localStorage.setItem(CHAVE_USUARIO_ATUAL, nickname);
}

function fazerLogout() {
  localStorage.removeItem(CHAVE_USUARIO_ATUAL);
  sessionStorage.removeItem(CHAVE_MODO);
  sessionStorage.removeItem(CHAVE_CAPITULO);
  window.location.href = RAIZ + "index.html";
}

function obterPontosUsuario(nickname) {
  const contas = obterContas();
  return contas[nickname] ? (contas[nickname].pontos || 0) : 0;
}

function obterCapituloHistoria(nickname) {
  const contas = obterContas();
  if (!contas[nickname]) return 0;
  return contas[nickname].historiaCapitulo || 0;
}

function avancarCapituloHistoria() {
  const nickname = obterUsuarioAtual();
  if (!nickname) return;
  const contas = obterContas();
  if (!contas[nickname]) return;
  garantirEstruturaConta(contas[nickname]);
  const atual = contas[nickname].historiaCapitulo || 0;
  if (atual < TOTAL_SUBS_HISTORIA) {
    contas[nickname].historiaCapitulo = atual + 1;
    salvarContas(contas);
  }
}

function adicionarPontos(quantidade) {
  const nickname = obterUsuarioAtual();
  if (!nickname) return null;
  const contas = obterContas();
  if (!contas[nickname]) return null;
  garantirEstruturaConta(contas[nickname]);
  const antes = contas[nickname].pontos || 0;
  const tituloAntes = obterTituloPorPontos(antes);
  contas[nickname].pontos = antes + quantidade;
  const depois = contas[nickname].pontos;
  const tituloDepois = obterTituloPorPontos(depois);
  salvarContas(contas);
  return {
    pontos: depois,
    subiuTitulo: tituloAntes.id !== tituloDepois.id,
    titulo: tituloDepois,
  };
}

function exigirLogin() {
  const nickname = obterUsuarioAtual();
  const contas = obterContas();
  if (!nickname || !contas[nickname]) {
    localStorage.removeItem(CHAVE_USUARIO_ATUAL);
    window.location.href = RAIZ + "index.html";
    return null;
  }
  garantirEstruturaConta(contas[nickname]);
  salvarContas(contas);
  return nickname;
}

function definirModo(modo) {
  sessionStorage.setItem(CHAVE_MODO, modo);
}

function obterModo() {
  return sessionStorage.getItem(CHAVE_MODO) || "rapido";
}

function definirCapituloSessao(id) {
  sessionStorage.setItem(CHAVE_CAPITULO, String(id));
}

function obterCapituloSessao() {
  const v = sessionStorage.getItem(CHAVE_CAPITULO);
  return v === null ? null : Number(v);
}

function iniciarLogin() {
  const modal = document.getElementById("modalLogin");
  if (!modal) return;

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

  modal.addEventListener("cancel", (e) => e.preventDefault());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) e.stopPropagation();
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
        contasAtuais[nickname] = { senha, pontos: 0, historiaCapitulo: 0 };
        salvarContas(contasAtuais);
        definirUsuarioAtual(nickname);
        window.location.href = RAIZ + "pagina2.html";
        return;
      }

      if (contasAtuais[nickname].senha !== senha) {
        if (mensagemErro) mensagemErro.textContent = "Senha incorreta. Tente novamente.";
        if (campoSenha) campoSenha.classList.add("campo-erro");
        return;
      }

      garantirEstruturaConta(contasAtuais[nickname]);
      salvarContas(contasAtuais);
      definirUsuarioAtual(nickname);
      window.location.href = RAIZ + "pagina2.html";
    });
  }

  if (typeof modal.showModal === "function") modal.showModal();
}

function iniciarBoasVindas() {
  const nickname = exigirLogin();
  if (!nickname) return;

  const saudacao = document.getElementById("saudacaoUsuario");
  if (saudacao) saudacao.textContent = `Olá, ${nickname}`;

  const pontos = obterPontosUsuario(nickname);
  const titulo = obterTituloPorPontos(pontos);
  const proximo = obterProximoTitulo(pontos);

  const elTitulo = document.getElementById("tituloAtual");
  if (elTitulo) elTitulo.textContent = `${titulo.emoji} ${titulo.nome}`;

  const elPontos = document.getElementById("pontosPerfil");
  if (elPontos) elPontos.textContent = pontos;

  const elProx = document.getElementById("proximoTitulo");
  if (elProx) {
    if (proximo) {
      elProx.textContent = `Próximo: ${proximo.nome} (${proximo.min} pts)`;
    } else {
      elProx.textContent = "Você alcançou o título máximo!";
    }
  }

  const botaoRapido = document.getElementById("botaoModoRapido");
  const botaoHistoria = document.getElementById("botaoModoHistoria");

  if (botaoRapido) {
    botaoRapido.addEventListener("click", (e) => {
      e.preventDefault();
      definirModo("rapido");
      window.location.href = RAIZ + "pagina3.html";
    });
  }
  if (botaoHistoria) {
    botaoHistoria.addEventListener("click", (e) => {
      e.preventDefault();
      definirModo("historia");
      window.location.href = RAIZ + "historia.html";
    });
  }
}

function iniciarEscolhaDificuldade() {
  const nickname = exigirLogin();
  if (!nickname) return;

  definirModo("rapido");

  const displayPontos = document.getElementById("pontosAtuais");
  if (displayPontos) displayPontos.textContent = obterPontosUsuario(nickname);

  const elTitulo = document.getElementById("tituloPill");
  if (elTitulo) {
    const t = obterTituloPorPontos(obterPontosUsuario(nickname));
    elTitulo.textContent = `${t.emoji} ${t.nome}`;
  }

  const seletor = document.getElementById("seletorDificuldade");
  if (!seletor) return;

  const botaoFacil = document.getElementById("botaoJogarFacil");
  const botaoMedio = document.getElementById("botaoJogarMedio");
  const botaoDificil = document.getElementById("botaoJogarDificil");
  const botoes = { facil: botaoFacil, medio: botaoMedio, dificil: botaoDificil };

  function atualizarVisibilidade() {
    Object.values(botoes).forEach((b) => b && b.classList.add("oculto"));
    const escolha = seletor.value;
    if (escolha && botoes[escolha]) botoes[escolha].classList.remove("oculto");
  }

  seletor.addEventListener("change", atualizarVisibilidade);
  atualizarVisibilidade();
}

function iniciarRanking() {
  const corpoTabela = document.getElementById("corpoTabelaRanking");
  if (!corpoTabela) return;
  const nickname = exigirLogin();
  if (!nickname) return;

  const contas = obterContas();
  const listaOrdenada = Object.entries(contas)
    .map(([nick, dados]) => {
      garantirEstruturaConta(dados);
      const pts = dados.pontos || 0;
      return {
        nickname: nick,
        pontos: pts,
        titulo: obterTituloPorPontos(pts),
        historia: dados.historiaCapitulo || 0,
      };
    })
    .sort((a, b) => b.pontos - a.pontos);

  corpoTabela.innerHTML = "";

  if (listaOrdenada.length === 0) {
    const linha = document.createElement("tr");
    linha.innerHTML = `<td colspan="4" style="text-align:center;color:var(--text-faint);">Nenhum jogador ainda. Seja o primeiro!</td>`;
    corpoTabela.appendChild(linha);
  } else {
    listaOrdenada.forEach((entrada, indice) => {
      const linha = document.createElement("tr");
      if (entrada.nickname === nickname) linha.classList.add("linha-atual");
      linha.innerHTML = `
        <td class="coluna-posicao">${indice + 1}</td>
        <td>${escaparHtml(entrada.nickname)}</td>
        <td class="coluna-titulo">${entrada.titulo.emoji} ${escaparHtml(entrada.titulo.nome)}</td>
        <td class="coluna-pontos">${entrada.pontos}</td>
      `;
      corpoTabela.appendChild(linha);
    });
  }

  const botaoSair = document.getElementById("botaoSair");
  if (botaoSair) botaoSair.addEventListener("click", fazerLogout);
}

function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function sortearIndice(array) {
  return Math.floor(Math.random() * array.length);
}

function formatarCampoResposta(valorBruto) {
  let valor = valorBruto.replace(/\s+/g, ",");
  valor = valor.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ,\-]/g, "");
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

function extrairPalavrasDigitadas(valorCampo) {
  const vistas = new Set();
  const resultado = [];
  for (const p of valorCampo.split(",").map((x) => x.trim()).filter((x) => x.length > 0)) {
    const chave = p.toLowerCase();
    if (vistas.has(chave)) continue;
    vistas.add(chave);
    resultado.push(p);
  }
  return resultado;
}

function calcularPontosPalavra(palavra) {
  return palavra.length >= 5 ? 10 : 2;
}
