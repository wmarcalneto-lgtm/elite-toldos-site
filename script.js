// ---------------------------------------------------------------------------
// CONFIGURAÇÃO — edite só aqui. Preços, mínimo, margem, desconto e WhatsApp.
// Itens marcados PLACEHOLDER precisam de confirmação do cliente antes de publicar.
// ---------------------------------------------------------------------------

// Campo "imagem": caminho do arquivo em assets/produtos/. Deixe undefined para manter
// o placeholder "Foto em breve". Tamanho recomendado: 1200x900px (proporção 4:3).
// precoM2 é usado só internamente pela calculadora — o preço não é exibido nos cards.
const produtos = [
  {
    id: "lona",
    nome: "Toldo (lona)",
    precoM2: 260,
    descricao: "Cobertura leve e versátil para varandas e áreas de convivência.",
    imagem: "assets/produtos/lona.png",
  },
  {
    id: "cortina",
    nome: "Toldo (cortina)",
    precoM2: 230,
    descricao: "Fecha lateral contra sol e chuva, mantendo o espaço aberto.",
    imagem: "assets/produtos/cortina.png",
  },
  {
    id: "policarbonato_movel",
    nome: "Toldo (retrátil em policarbonato)",
    precoM2: 750,
    descricao: "Abre e fecha conforme o clima. O produto mais procurado da Elite.",
    destaque: true,
    imagem: "assets/produtos/policarbonato_movel.png",
  },
  {
    id: "policarbonato_alveolar_fixo",
    nome: "Cobertura (em policarbonato com alveolar fixo)",
    precoM2: 580,
    descricao: "Estrutura fixa em alumínio com chapa alveolar, boa relação custo-benefício.",
    imagem: "assets/produtos/policarbonato_alveolar_fixo.png",
  },
  {
    id: "policarbonato_compacto",
    nome: "Cobertura (em policarbonato compacto)",
    precoM2: 680,
    descricao: "Chapa compacta, mais resistente a impacto, acabamento mais refinado.",
    imagem: "assets/produtos/policarbonato_compacto.png",
  },
];

// Produtos de alto padrão: aparecem só na seção "Produtos", sem preço e sem entrar na
// calculadora. O card mostra um CTA direto para o WhatsApp em vez de valor.
const produtosAltoPadrao = [
  {
    id: "braco_articulado",
    nome: "Toldo (com braço articulado)",
    descricao: "Projeção ajustável sem estrutura de apoio no chão, ideal para varandas e sacadas.",
    imagem: "assets/produtos/braco_articulado.png",
  },
  {
    id: "cortina_screen",
    nome: "Toldo (cortina em tela screen)",
    descricao: "Tela técnica que filtra sol e vento mantendo a vista, para fechamentos de alto padrão.",
    imagem: "assets/produtos/cortina_screen.png",
  },
];

// PLACEHOLDER — confirmar com a equipe o valor mínimo cobrado por instalação.
const valorMinimoPadrao = 800;

// Margem para cima/baixo na faixa de estimativa (8%).
const margem = 0.08;

// Desconto oferecido ao fechar a visita técnica na hora.
const descontoFechamentoPercentual = 5;

// Taxa fixa da visita técnica (abatida do valor final se o serviço for fechado).
const taxaVisitaTecnica = 30;

// PLACEHOLDER — confirmar número exato do WhatsApp do Renato (com/sem 9º dígito).
const numeroWhatsapp = "5534988397959";

// ---------------------------------------------------------------------------

const formatador = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const chipGrid = document.getElementById("chip-grid");
const larguraInput = document.getElementById("largura-input");
const larguraMinus = document.getElementById("largura-minus");
const larguraPlus = document.getElementById("largura-plus");
const comprimentoInput = document.getElementById("comprimento-input");
const comprimentoMinus = document.getElementById("comprimento-minus");
const comprimentoPlus = document.getElementById("comprimento-plus");
const resultBox = document.getElementById("result");
const resultValue = document.getElementById("result-value");
const calcHint = document.getElementById("calc-hint");
const whatsappLink = document.getElementById("whatsapp-link");
const discountPercentEl = document.getElementById("discount-percent");
const taxaVisitaEl = document.getElementById("taxa-visita-valor");

discountPercentEl.textContent = `${descontoFechamentoPercentual}%`;
taxaVisitaEl.textContent = formatador.format(taxaVisitaTecnica);

let produtoSelecionado = null;

function renderChips() {
  produtos.forEach((produto) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.setAttribute("role", "radio");
    chip.setAttribute("aria-checked", "false");
    chip.dataset.id = produto.id;

    if (produto.destaque) {
      const tag = document.createElement("span");
      tag.className = "chip-tag";
      tag.textContent = "Mais procurado";
      chip.appendChild(tag);
    }

    const nome = document.createElement("span");
    nome.className = "chip-name";
    nome.textContent = produto.nome;

    chip.appendChild(nome);
    chip.addEventListener("click", () => selecionarProduto(produto.id));
    chipGrid.appendChild(chip);
  });
}

function selecionarProduto(id) {
  produtoSelecionado = produtos.find((p) => p.id === id) || null;
  [...chipGrid.children].forEach((chip) => {
    chip.setAttribute("aria-checked", String(chip.dataset.id === id));
  });
  calcular();
}

function calcular() {
  const largura = parseFloat(larguraInput.value);
  const comprimento = parseFloat(comprimentoInput.value);
  const medidasValidas =
    Number.isFinite(largura) && largura > 0 && Number.isFinite(comprimento) && comprimento > 0;

  if (!produtoSelecionado || !medidasValidas) {
    resultBox.hidden = true;
    resultBox.classList.remove("is-live");
    calcHint.hidden = false;
    calcHint.textContent = !produtoSelecionado
      ? "Escolha um produto e informe a largura e o comprimento para ver sua estimativa."
      : "Informe a largura e o comprimento para ver sua estimativa.";
    return;
  }

  const m2 = largura * comprimento;
  const valorBase = Math.max(m2 * produtoSelecionado.precoM2, valorMinimoPadrao);
  const min = valorBase * (1 - margem);
  const max = valorBase * (1 + margem);

  resultValue.textContent = `${formatador.format(min)} a ${formatador.format(max)}`;

  const mensagem =
    `Olá! Simulei um orçamento no site de ${formatador.format(min)} a ${formatador.format(max)} ` +
    `para ${produtoSelecionado.nome} e gostaria de agendar uma visita técnica.`;
  whatsappLink.href = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;

  calcHint.hidden = true;
  resultBox.hidden = false;
  resultBox.classList.remove("is-live");
  void resultBox.offsetWidth; // reinicia a animação a cada novo cálculo
  resultBox.classList.add("is-live");
}

function ligarCampoMedida(input, botaoMenos, botaoMais) {
  input.addEventListener("input", calcular);
  botaoMenos.addEventListener("click", () => {
    const atual = parseFloat(input.value) || 0;
    input.value = Math.max(0, atual - 0.5);
    calcular();
  });
  botaoMais.addEventListener("click", () => {
    const atual = parseFloat(input.value) || 0;
    input.value = atual + 0.5;
    calcular();
  });
}

ligarCampoMedida(larguraInput, larguraMinus, larguraPlus);
ligarCampoMedida(comprimentoInput, comprimentoMinus, comprimentoPlus);

function criarCardProduto(produto, altoPadrao) {
  const card = document.createElement("article");
  card.className = "produto-card" + (produto.destaque ? " destaque" : "") + (altoPadrao ? " alto-padrao" : "");

  if (produto.destaque) {
    const tag = document.createElement("span");
    tag.className = "produto-tag";
    tag.textContent = "Mais procurado";
    card.appendChild(tag);
  }
  if (altoPadrao) {
    const tag = document.createElement("span");
    tag.className = "produto-tag alto-padrao";
    tag.textContent = "Toldo de alto padrão";
    card.appendChild(tag);
  }

  const foto = document.createElement("div");
  foto.className = "produto-photo";
  if (produto.imagem) {
    const img = document.createElement("img");
    img.src = produto.imagem;
    img.alt = produto.nome;
    foto.appendChild(img);
  } else {
    const placeholder = document.createElement("span");
    placeholder.className = "produto-photo-placeholder";
    placeholder.textContent = "Foto em breve";
    foto.appendChild(placeholder);
  }
  card.appendChild(foto);

  const body = document.createElement("div");
  body.className = "produto-body";

  const nome = document.createElement("p");
  nome.className = "produto-name";
  nome.textContent = produto.nome;
  body.appendChild(nome);

  const desc = document.createElement("p");
  desc.className = "produto-desc";
  desc.textContent = produto.descricao;
  body.appendChild(desc);

  if (altoPadrao) {
    const mensagem = `Olá! Tenho interesse em um orçamento para ${produto.nome}.`;
    const cta = document.createElement("a");
    cta.className = "produto-cta";
    cta.href = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
    cta.target = "_blank";
    cta.rel = "noopener";
    cta.textContent = "Cotação direta no WhatsApp";
    body.appendChild(cta);
  }

  card.appendChild(body);
  return card;
}

function renderProdutos() {
  const grid = document.getElementById("produtos-grid");
  // Nesta seção só entram os produtos da calculadora. Toldos sempre antes de
  // Coberturas, para o cliente entender os grupos de cara.
  const categoria = (nome) => (nome.startsWith("Toldo") ? 0 : 1);
  const ordenados = [...produtos].sort((a, b) => categoria(a.nome) - categoria(b.nome));
  ordenados.forEach((produto) => grid.appendChild(criarCardProduto(produto, false)));
}

function renderProdutosAltoPadrao() {
  const grid = document.getElementById("produtos-alto-padrao-grid");
  produtosAltoPadrao.forEach((produto) => grid.appendChild(criarCardProduto(produto, true)));
}

renderChips();
renderProdutos();
renderProdutosAltoPadrao();
calcular();

// Menu mobile
const navToggle = document.getElementById("nav-toggle");
const nav = document.getElementById("nav");

navToggle.addEventListener("click", () => {
  const aberto = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!aberto));
  nav.classList.toggle("is-open", !aberto);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  });
});

// Botão flutuante do WhatsApp
document.getElementById("whatsapp-float").href = `https://wa.me/${numeroWhatsapp}`;
