let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let proximoId = 1;

// Atualizar contador ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarContador();
    animarProdutos();
});

function adicionarAoCarrinho(nome, preco) {
    // Verificar se o produto já existe no carrinho
    const produtoExistente = carrinho.find(item => item.nome === nome);
    
    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        const produto = {
            id: proximoId++,
            nome: nome,
            preco: preco,
            quantidade: 1
        };
        carrinho.push(produto);
    }
    
    salvarCarrinho();
    atualizarContador();
    mostrarToast(`${nome} adicionado ao carrinho!`);
    
    // Animação do botão carrinho
    const btnCarrinho = document.getElementById('btn-carrinho');
    btnCarrinho.style.transform = 'scale(1.2)';
    setTimeout(() => {
        btnCarrinho.style.transform = 'scale(1)';
    }, 200);
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    atualizarContador();
    renderizarCarrinho();
    mostrarToast('Produto removido do carrinho!', '#ff6b6b');
}

function alterarQuantidade(id, novaQuantidade) {
    if (novaQuantidade <= 0) {
        removerDoCarrinho(id);
        return;
    }
    
    const produto = carrinho.find(item => item.id === id);
    if (produto) {
        produto.quantidade = novaQuantidade;
        salvarCarrinho();
        atualizarContador();
        renderizarCarrinho();
    }
}

function atualizarContador() {
    const quantidadeTotal = carrinho.reduce((total, item) => total + item.quantidade, 0);
    document.getElementById('contator-quantidade').textContent = quantidadeTotal;
}

function calcularTotal() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function mostrarToast(mensagem, cor = '#4caf50') {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.style.background = cor;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function abrirCarrinho() {
    const modal = document.getElementById('modalCarrinho');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Impede scroll do body
    renderizarCarrinho();
}

function fecharCarrinho() {
    const modal = document.getElementById('modalCarrinho');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restaura scroll do body
}

function renderizarCarrinho() {
    const container = document.getElementById('itensCarrinho');
    const totalContainer = document.getElementById('carrinhoTotal');
    
    if (carrinho.length === 0) {
        container.innerHTML = `
            <div class="carrinho-vazio">
                <div class="emoji">🛒</div>
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione alguns produtos incríveis!</p>
            </div>
        `;
        totalContainer.style.display = 'none';
        return;
    }

    container.innerHTML = carrinho.map(item => `
        <div class="item-carrinho">
            <div class="item-imagem">👟</div>
            <div class="item-info">
                <div class="item-nome">${item.nome}</div>
                <div class="item-preco">R$ ${item.preco.toFixed(2)}</div>
                <div class="quantidade-controls">
                    <button class="btn-quantidade" onclick="alterarQuantidade(${item.id}, ${item.quantidade - 1})">-</button>
                    <span class="quantidade-display">${item.quantidade}</span>
                    <button class="btn-quantidade" onclick="alterarQuantidade(${item.id}, ${item.quantidade + 1})">+</button>
                </div>
            </div>
            <button class="btn-remover" onclick="removerDoCarrinho(${item.id})">
                🗑️ Remover
            </button>
        </div>
    `).join('');

    // Mostrar total
    const total = calcularTotal();
    document.getElementById('valorTotal').textContent = `R$ ${total.toFixed(2)}`;
    totalContainer.style.display = 'block';
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarToast('Seu carrinho está vazio!', '#ff6b6b');
        return;
    }

    const total = calcularTotal();
    const quantidadeItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    if (confirm(`🎉 Confirmar compra?\n\n${quantidadeItens} item(ns)\nTotal: R$ ${total.toFixed(2)}`)) {
        // Limpar carrinho
        carrinho = [];
        salvarCarrinho();
        atualizarContador();
        
        // Fechar modal
        fecharCarrinho();
        
        // Mostrar sucesso
        mostrarToast('🎉 Compra finalizada com sucesso!', '#4caf50');
        
        // Simular redirecionamento (opcional)
        setTimeout(() => {
            mostrarToast('Obrigado por comprar conosco! 😊', '#667eea');
        }, 3000);
    }
}

// Fechar modal ao clicar fora dele
document.getElementById('modalCarrinho').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        fecharCarrinho();
    }
});

// Tecla ESC para fechar modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fecharCarrinho();
    }
});

// Animação de entrada dos produtos
function animarProdutos() {
    const produtos = document.querySelectorAll('.produto');
    produtos.forEach((produto, index) => {
        produto.style.opacity = '0';
        produto.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            produto.style.transition = 'all 0.6s ease';
            produto.style.opacity = '1';
            produto.style.transform = 'translateY(0)';
        }, index * 100);
    });
}