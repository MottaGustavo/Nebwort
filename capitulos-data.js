/* ===================================================================
   NebWort — capitulos-data.js
   Trilha do modo história: temas → 5 subcapítulos cada, com vocabulário ampliado.
   =================================================================== */

export const TEMAS_HISTORIA = [
  {
    id: "animais",
    nome: "Animais",
    descricao: "Vida em cada canto do planeta",
    subs: [
      {
        nome: "Floresta",
        tema: "Entre árvores e sombras",
        qtd: 2,
        palavras: [
          "onca", "macaco", "tucano", "preguica", "cobra", "sapo", "borboleta",
          "formiga", "jacare", "capivara", "arara", "tamandua", "quati", "veado",
          "jabuti", "morcego", "besouro", "iguana"
        ],
      },
      {
        nome: "Savana",
        tema: "Planícies abertas",
        qtd: 2,
        palavras: [
          "leao", "zebra", "girafa", "elefante", "hiena", "gnu", "avestruz",
          "chita", "rinoceronte", "hipopotamo", "bufalo", "suricata", "abutre",
          "gazela", "jacare", "crocodilo"
        ],
      },
      {
        nome: "Oceano",
        tema: "Mundos debaixo d'água",
        qtd: 2,
        palavras: [
          "tubarao", "golfinho", "baleia", "polvo", "agua-viva", "peixe",
          "tartaruga", "estrela-do-mar", "caranguejo", "lagosta", "atum",
          "orca", "raia", "coral", "cavalo-marinho", "foca", "pinguim"
        ],
      },
      {
        nome: "Ártico",
        tema: "Frio extremo",
        qtd: 2,
        palavras: [
          "urso-polar", "foca", "pinguim", "rena", "raposa-do-artico",
          "morsa", "baleia", "narval", "lemming", "coruja", "lobo",
          "alce", "foca-elefante"
        ],
      },
      {
        nome: "Fazenda",
        tema: "Animais domésticos",
        qtd: 2,
        palavras: [
          "vaca", "cavalo", "galinha", "porco", "ovelha", "cabra", "pato",
          "ganso", "burro", "peru", "coelho", "cachorro", "gato", "bode",
          "jumento", "pintinho"
        ],
      },
    ],
  },
  {
    id: "comida",
    nome: "Comida",
    descricao: "Sabores e ingredientes",
    subs: [
      {
        nome: "Café da manhã",
        tema: "Começo do dia",
        qtd: 2,
        palavras: [
          "pao", "cafe", "leite", "manteiga", "geleia", "ovo", "queijo",
          "tapioca", "cuscuz", "aveia", "fruta", "suco", "bolo", "torrada",
          "iogurte", "granola"
        ],
      },
      {
        nome: "Pratos brasileiros",
        tema: "Sabor de casa",
        qtd: 2,
        palavras: [
          "feijoada", "arroz", "feijao", "farofa", "churrasco", "moqueca",
          "acaraje", "vatapa", "coxinha", "pastel", "brigadeiro", "pao-de-queijo",
          "tapioca", "bobó", "tropeiro"
        ],
      },
      {
        nome: "Frutas",
        tema: "Doce da natureza",
        qtd: 2,
        palavras: [
          "banana", "laranja", "maca", "manga", "abacaxi", "uva", "morango",
          "melancia", "mamao", "limao", "coco", "goiaba", "pera", "kiwi",
          "abacate", "caju", "jabuticaba", "pitaya"
        ],
      },
      {
        nome: "Doces",
        tema: "Sobremesas e tentação",
        qtd: 2,
        palavras: [
          "chocolate", "bolo", "sorvete", "pudim", "brigadeiro", "torta",
          "cookie", "brownie", "mousse", "gelatina", "doce-de-leite",
          "beijinho", "quindim", "pavê", "churros"
        ],
      },
      {
        nome: "Bebidas",
        tema: "O que se bebe",
        qtd: 2,
        palavras: [
          "agua", "suco", "refrigerante", "cafe", "cha", "leite", "vitamina",
          "smoothie", "cerveja", "vinho", "agua-de-coco", "limonada",
          "chocolate-quente", "energetico"
        ],
      },
    ],
  },
  {
    id: "natureza",
    nome: "Natureza",
    descricao: "Paisagens e elementos",
    subs: [
      {
        nome: "Montanhas",
        tema: "Altitude e pedra",
        qtd: 2,
        palavras: [
          "pico", "serra", "trilha", "rocha", "neve", "vale", "abismo",
          "cume", "alpinismo", "gelo", "canion", "penhasco", "cascata"
        ],
      },
      {
        nome: "Rios e lagos",
        tema: "Água doce",
        qtd: 2,
        palavras: [
          "rio", "lago", "cachoeira", "correnteza", "ponte", "peixe",
          "represa", "igarape", "nascente", "margem", "barco", "pesca"
        ],
      },
      {
        nome: "Florestas",
        tema: "Verde denso",
        qtd: 2,
        palavras: [
          "arvore", "folha", "tronco", "raiz", "selva", "mata", "musgo",
          "cipo", "sombra", "umidade", "canopy", "bambu", "samambaia"
        ],
      },
      {
        nome: "Deserto",
        tema: "Areia e calor",
        qtd: 2,
        palavras: [
          "areia", "duna", "oasis", "sol", "camelo", "seca", "cacto",
          "miragem", "vento", "tempestade", "rocha", "noite"
        ],
      },
      {
        nome: "Clima",
        tema: "Tempo e atmosfera",
        qtd: 2,
        palavras: [
          "chuva", "sol", "vento", "nuvem", "trovao", "relampago", "neblina",
          "geada", "calor", "frio", "tempestade", "arco-iris", "granizo"
        ],
      },
    ],
  },
  {
    id: "profissoes",
    nome: "Profissões",
    descricao: "Trabalho e ofícios",
    subs: [
      {
        nome: "Saúde",
        tema: "Cuidar de pessoas",
        qtd: 3,
        palavras: [
          "medico", "enfermeiro", "hospital", "cirurgia", "remedio", "paciente",
          "dentista", "fisioterapeuta", "vacina", "diagnostico", "ambulancia",
          "laboratorio", "psicologo"
        ],
      },
      {
        nome: "Educação",
        tema: "Ensinar e aprender",
        qtd: 3,
        palavras: [
          "professor", "aluno", "escola", "aula", "caderno", "prova",
          "universidade", "biblioteca", "diretor", "pedagogo", "quadro",
          "licao", "diploma"
        ],
      },
      {
        nome: "Construção",
        tema: "Obras e projetos",
        qtd: 3,
        palavras: [
          "engenheiro", "arquiteto", "pedreiro", "obra", "cimento", "planta",
          "tijolo", "andaime", "eletricista", "encanador", "reforma",
          "fundacao", "projeto"
        ],
      },
      {
        nome: "Arte e cultura",
        tema: "Criar e expressar",
        qtd: 3,
        palavras: [
          "pintor", "musico", "ator", "escritor", "dancarino", "fotografo",
          "escultor", "cineasta", "designer", "cantor", "teatro", "exposicao"
        ],
      },
      {
        nome: "Serviços",
        tema: "Atender o dia a dia",
        qtd: 3,
        palavras: [
          "cozinheiro", "motorista", "vendedor", "cabeleireiro", "garcom",
          "segurança", "faxineiro", "entregador", "caixa", "recepcionista",
          "mecanico", "agricultor"
        ],
      },
    ],
  },
  {
    id: "esportes",
    nome: "Esportes",
    descricao: "Movimento e competição",
    subs: [
      {
        nome: "Campo e quadra",
        tema: "Esportes coletivos",
        qtd: 3,
        palavras: [
          "futebol", "basquete", "volei", "handebol", "gol", "cesta",
          "time", "campeonato", "estadio", "quadra", "juiz", "torcida",
          "treino", "vitoria"
        ],
      },
      {
        nome: "Água",
        tema: "Esportes aquáticos",
        qtd: 3,
        palavras: [
          "natacao", "surfe", "remO", "canoagem", "mergulho", "prancha",
          "piscina", "onda", "boia", "traje", "raia", "flutuar", "praia"
        ],
      },
      {
        nome: "Atletismo",
        tema: "Correr, saltar, lançar",
        qtd: 3,
        palavras: [
          "corrida", "maratona", "salto", "lançamento", "pista", "cronometro",
          "sprint", "obstaculo", "medalhas", "recorde", "atletismo", "largada"
        ],
      },
      {
        nome: "Combate",
        tema: "Lutas e contato",
        qtd: 3,
        palavras: [
          "boxe", "judo", "jiu-jitsu", "karate", "luta", "ringue", "kimono",
          "golpe", "defesa", "campeao", "treino", "faixa", "mma"
        ],
      },
      {
        nome: "Sobre rodas",
        tema: "Velocidade e equilíbrio",
        qtd: 3,
        palavras: [
          "ciclismo", "skate", "patins", "motocross", "formula", "capacete",
          "pedal", "pista", "manobra", "bike", "rodas", "corrida"
        ],
      },
    ],
  },
  {
    id: "tecnologia",
    nome: "Tecnologia",
    descricao: "Máquinas, redes e código",
    subs: [
      {
        nome: "Computadores",
        tema: "Hardware e software",
        qtd: 3,
        palavras: [
          "computador", "teclado", "mouse", "monitor", "processador", "memoria",
          "hd", "ssd", "notebook", "software", "sistema", "arquivo", "pasta"
        ],
      },
      {
        nome: "Internet",
        tema: "Conexão global",
        qtd: 3,
        palavras: [
          "internet", "wifi", "site", "navegador", "email", "rede", "servidor",
          "link", "download", "upload", "nuvem", "senha", "login", "url"
        ],
      },
      {
        nome: "Celulares",
        tema: "No bolso",
        qtd: 3,
        palavras: [
          "celular", "smartphone", "app", "tela", "bateria", "chip", "camera",
          "mensagem", "chamada", "android", "ios", "carregador", "notificacao"
        ],
      },
      {
        nome: "Inteligência artificial",
        tema: "Máquinas que aprendem",
        qtd: 3,
        palavras: [
          "inteligencia", "robo", "algoritmo", "modelo", "dados", "aprendizado",
          "chatbot", "automacao", "neural", "prompt", "treinamento", "predicao"
        ],
      },
      {
        nome: "Inovação",
        tema: "O que vem depois",
        qtd: 3,
        palavras: [
          "drone", "satelite", "realidade-virtual", "impressora-3d", "sensor",
          "blockchain", "criptomoeda", "eletronico", "gadget", "startup",
          "prototipo", "invento"
        ],
      },
    ],
  },
  {
    id: "emocoes",
    nome: "Emoções",
    descricao: "O que sentimos por dentro",
    subs: [
      {
        nome: "Alegria",
        tema: "Momentos leves",
        qtd: 4,
        palavras: [
          "alegria", "felicidade", "sorriso", "riso", "festa", "euforia",
          "contentamento", "animacao", "prazer", "entusiasmo", "graca"
        ],
      },
      {
        nome: "Tristeza",
        tema: "Peso no peito",
        qtd: 4,
        palavras: [
          "tristeza", "saudade", "choro", "melancolia", "solidao", "luto",
          "desanimo", "nostalgia", "vazio", "dor", "lamento"
        ],
      },
      {
        nome: "Medo",
        tema: "Alerta interno",
        qtd: 4,
        palavras: [
          "medo", "pavor", "ansiedade", "susto", "panico", "receio",
          "terror", "inseguranca", "apreensao", "fobia", "nervosismo"
        ],
      },
      {
        nome: "Raiva",
        tema: "Fogo por dentro",
        qtd: 4,
        palavras: [
          "raiva", "odio", "furia", "irritacao", "revolta", "indignacao",
          "bravo", "estresse", "impaciencia", "ressentimento"
        ],
      },
      {
        nome: "Esperança",
        tema: "Olhar adiante",
        qtd: 4,
        palavras: [
          "esperanca", "fe", "otimismo", "sonho", "confianca", "coragem",
          "gratidao", "paz", "amor", "carinho", "serenidade", "calma"
        ],
      },
    ],
  },
  {
    id: "espaco",
    nome: "Espaço",
    descricao: "Além da atmosfera",
    subs: [
      {
        nome: "Sistema solar",
        tema: "Nossos vizinhos",
        qtd: 4,
        palavras: [
          "sol", "terra", "marte", "jupiter", "saturno", "venus", "mercurio",
          "urano", "netuno", "lua", "planeta", "orbita", "anel"
        ],
      },
      {
        nome: "Estrelas",
        tema: "Pontos de luz",
        qtd: 4,
        palavras: [
          "estrela", "constelacao", "galaxia", "via-lactea", "supernova",
          "brilho", "noite", "ceu", "telescopio", "nebulosa", "cosmos"
        ],
      },
      {
        nome: "Exploração",
        tema: "Humanos no espaço",
        qtd: 4,
        palavras: [
          "astronauta", "foguete", "estacao", "missao", "lancamento",
          "traje", "gravidade", "orbita", "modulo", "capsula", "nasa"
        ],
      },
      {
        nome: "Fenômenos",
        tema: "Forças do universo",
        qtd: 4,
        palavras: [
          "buraco-negro", "cometa", "asteroide", "meteoro", "eclipse",
          "gravidade", "expansao", "big-bang", "quasar", "pulsares"
        ],
      },
      {
        nome: "Ciência espacial",
        tema: "Entender o infinito",
        qtd: 4,
        palavras: [
          "astronomia", "fisica", "telescopio", "satelite", "observatorio",
          "espectro", "luz", "pesquisa", "universo", "teoria", "dados"
        ],
      },
    ],
  },
  {
    id: "historia",
    nome: "História",
    descricao: "O passado que molda o agora",
    subs: [
      {
        nome: "Antiguidade",
        tema: "Civilizações antigas",
        qtd: 4,
        palavras: [
          "egito", "piramide", "roma", "grecia", "imperio", "farao",
          "gladiador", "filosofia", "templo", "mitologia", "coliseu"
        ],
      },
      {
        nome: "Idade Média",
        tema: "Castelos e reinos",
        qtd: 4,
        palavras: [
          "castelo", "cavaleiro", "rei", "rainha", "feudalismo", "espada",
          "armadura", "igreja", "cruzada", "monarquia", "aldeia", "trono"
        ],
      },
      {
        nome: "Descobrimentos",
        tema: "Navegar o mundo",
        qtd: 4,
        palavras: [
          "navegacao", "caravela", "colonia", "mapa", "oceano", "explorador",
          "comercio", "rota", "porto", "conquista", "indigena"
        ],
      },
      {
        nome: "Revoluções",
        tema: "Mudança de era",
        qtd: 4,
        palavras: [
          "revolucao", "liberdade", "independencia", "povo", "bastilha",
          "industrial", "maquina", "direitos", "constituicao", "republica"
        ],
      },
      {
        nome: "Brasil",
        tema: "Nossa história",
        qtd: 4,
        palavras: [
          "independencia", "imperio", "republica", "escravidao", "abolicao",
          "constituicao", "ditadura", "democracia", "colonia", "bandeira",
          "brasilia"
        ],
      },
    ],
  },
];

/** Lista linear de todos os subcapítulos (para progresso). */
export function listarTodosSubs() {
  const lista = [];
  TEMAS_HISTORIA.forEach((tema, temaIdx) => {
    tema.subs.forEach((sub, subIdx) => {
      lista.push({
        indexGlobal: lista.length,
        temaId: tema.id,
        temaNome: tema.nome,
        temaIdx,
        subIdx,
        nome: sub.nome,
        temaLinha: sub.tema,
        qtd: sub.qtd,
        palavras: sub.palavras,
      });
    });
  });
  return lista;
}

export const TODOS_SUBS = listarTodosSubs();
export const TOTAL_SUBS = TODOS_SUBS.length;
