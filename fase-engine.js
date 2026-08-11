/* ===================================================================
   NebWort — fase-engine.js
   Lógica comum de todas as páginas de fase.
   =================================================================== */

import { carregarModelo, avaliarRelacao, emModoFallback } from "./semantica.js";

/**
 * @param {object} opcoes
 * @param {string[]} opcoes.palavras
 * @param {number} opcoes.quantidade
 * @param {string} [opcoes.proximaHref] — vazio = última fase
 */
export function iniciarFase({ palavras, quantidade, proximaHref = "" }) {
  const nickname = exigirLogin();
  if (!nickname) return;

  const elPalavra = document.getElementById("palavraSorteada");
  const elPontosPill = document.getElementById("pontosAtuais");
  const elEstadoModelo = document.getElementById("estadoModelo");
  const elTextoEstadoModelo = document.getElementById("textoEstadoModelo");
  const elAvisoFallback = document.getElementById("avisoFallback");
  const campoResposta = document.getElementById("campoResposta");
  const formResposta = document.getElementById("formResposta");
  const botaoEnviar = document.getElementById("botaoEnviar");
  const botaoProxima = document.getElementById("botaoProxima");
  const constelacao = document.getElementById("constelacaoRespostas");
  const resumoRodada = document.getElementById("resumoRodada");

  if (elPontosPill) elPontosPill.textContent = obterPontosUsuario(nickname);

  const palavraSorteada = palavras[sortearIndice(palavras)];
  if (elPalavra) elPalavra.textContent = palavraSorteada;

  anexarFormatacaoAutomatica(campoResposta);

  if (botaoEnviar) botaoEnviar.disabled = true;

  carregarModelo().then(() => {
    if (emModoFallback()) {
      if (elEstadoModelo) elEstadoModelo.classList.add("erro");
      if (elTextoEstadoModelo) {
        elTextoEstadoModelo.textContent = "Modelo semântico indisponível — pontuando só pelo tamanho";
      }
      if (elAvisoFallback) elAvisoFallback.classList.remove("oculto");
    } else {
      if (elEstadoModelo) elEstadoModelo.classList.add("pronto");
      if (elTextoEstadoModelo) elTextoEstadoModelo.textContent = "Modelo semântico pronto";
    }
    if (botaoEnviar) botaoEnviar.disabled = false;
  });

  if (!formResposta) return;

  formResposta.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const lista = extrairPalavrasDigitadas(campoResposta.value).slice(0, quantidade);
    if (lista.length === 0) return;

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Validando...";
    campoResposta.disabled = true;

    let totalPontos = 0;
    if (constelacao) constelacao.innerHTML = "";

    for (const palavra of lista) {
      const resultado = await avaliarRelacao(palavra, palavraSorteada);
      const passou = resultado.passou;
      const pontos = passou ? calcularPontosPalavra(palavra) : 0;
      totalPontos += pontos;

      let rotulo;
      if (resultado.motivo === "igual") {
        rotulo = "igual";
      } else if (resultado.similaridade === null) {
        rotulo = "s/ checagem";
      } else {
        rotulo = Math.round(resultado.similaridade * 100) + "%";
      }

      const no = document.createElement("span");
      no.className = "no-resposta " + (passou ? "aprovado" : "reprovado");
      no.innerHTML =
        escaparHtml(palavra) +
        ' <span class="similaridade">' + rotulo + "</span>" +
        ' <span class="pontos-ganhos">+' + pontos + "</span>";
      if (constelacao) constelacao.appendChild(no);
    }

    adicionarPontos(totalPontos);
    if (elPontosPill) elPontosPill.textContent = obterPontosUsuario(nickname);

    if (resumoRodada) {
      resumoRodada.classList.remove("oculto");
      resumoRodada.innerHTML =
        "Você ganhou <strong>" + totalPontos + "</strong> ponto(s) nesta rodada.";
    }

    botaoEnviar.textContent = "Enviar";

    if (botaoProxima) {
      botaoProxima.disabled = false;
      if (proximaHref) {
        botaoProxima.textContent = "Próxima pergunta";
        botaoProxima.addEventListener(
          "click",
          () => {
            window.location.href = proximaHref;
          },
          { once: true }
        );
      } else {
        botaoProxima.textContent = "Ver ranking";
        botaoProxima.addEventListener(
          "click",
          () => {
            window.location.href = (typeof CAMINHO_RAIZ !== "undefined" ? CAMINHO_RAIZ : "") + "ranking.html";
          },
          { once: true }
        );
      }
    }
  });
}
