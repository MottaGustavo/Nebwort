/* ===================================================================
   NebWort / Semanti — script.js
   Lógica compartilhada: contas, login, pontos, navegação e helpers de fase.
   Validação semântica mora em semantica.js.
   =================================================================== */

const RAIZ = (typeof CAMINHO_RAIZ !== "undefined") ? CAMINHO_RAIZ : "";

const CHAVE_CONTAS = "nebwortContas";
const CHAVE_USUARIO_ATUAL = "nebwortUsuarioAtual";

/* Limiar legado (as fases novas usam avaliarRelacao de semantica.js).
   Mantido em 0.30 para qualquer código antigo que ainda consulte esta constante. */
const LIMIAR_SIMILARIDADE = 0.30;

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

  modal.addEventListener("cancel", (evento) => {
    evento.preventDefault();
  });
  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) {
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
        contasAtuais[nickname] = { senha: senha, pontos: 0 };
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

      definirUsuarioAtual(nickname);
      window.location.href = RAIZ + "pagina2.html";
    });
  }

  if (typeof modal.showModal === "function") {
    modal.showModal();
  }
}

function iniciarBoasVindas() {
  const saudacao = document.getElementById("saudacaoUsuario");
  if (!saudacao) return;
  const nickname = exigirLogin();
  if (!nickname) return;
  saudacao.textContent = `Bem-vindo, ${nickname}!`;
}

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

  if (listaOrdenada.length === 0) {
    const linha = document.createElement("tr");
    linha.innerHTML = `<td colspan="3" style="text-align:center;color:var(--text-faint);">Nenhum jogador ainda. Seja o primeiro!</td>`;
    corpoTabela.appendChild(linha);
  } else {
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
  }

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

function sortearIndice(array) {
  return Math.floor(Math.random() * array.length);
}

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
