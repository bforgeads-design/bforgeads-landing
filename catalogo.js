document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');
    const filterTabsContainer = document.getElementById('filter-tabs');
    
    let allProducts = [];

    // Busca os dados do "Hub" (data.json)
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar o catálogo');
            return response.json();
        })
        .then(data => {
            allProducts = data.produtos;
            renderFilters(data.categorias);
            renderProducts(allProducts);
        })
        .catch(error => {
            console.error(error);
            productsGrid.innerHTML = `
                <div class="error-state" style="grid-column: 1 / -1; text-align: center; color: #f87171; padding: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>Falha ao carregar os produtos. Tente recarregar a página.</p>
                </div>
            `;
        });

    // Função para renderizar as abas de filtro
    function renderFilters(categorias) {
        // Remove tudo, menos o botão "Todos" (se existir)
        filterTabsContainer.innerHTML = '<button class="filter-btn active" data-category="all">Todos</button>';
        
        categorias.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.setAttribute('data-category', cat.id);
            btn.textContent = cat.nome;
            filterTabsContainer.appendChild(btn);
        });

        // Adiciona eventos de clique nos filtros
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Atualiza classe visual
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Filtra os produtos
                const category = e.target.getAttribute('data-category');
                if (category === 'all') {
                    renderProducts(allProducts);
                } else {
                    const filtered = allProducts.filter(p => p.categoria === category);
                    renderProducts(filtered);
                }
            });
        });
    }

    // Função para renderizar os cards de produtos
    function renderProducts(produtos) {
        productsGrid.innerHTML = ''; // Limpa o grid

        if (produtos.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: #a0a0b0; padding: 40px;">
                    <p>Nenhum produto encontrado nesta categoria.</p>
                </div>
            `;
            return;
        }

        produtos.forEach(produto => {
            const card = document.createElement('div');
            card.className = 'glass-card product-card';
            if (produto.destaque) card.classList.add('featured-card');

            let atributosHtml = '';
            if (produto.atributos && produto.atributos.length > 0) {
                atributosHtml = '<ul class="category-list" style="margin-top: 16px; margin-bottom: 24px;">';
                produto.atributos.forEach(attr => {
                    atributosHtml += `<li><i class="fas fa-check text-neon"></i> ${attr}</li>`;
                });
                atributosHtml += '</ul>';
            }

            const wppText = encodeURIComponent(`Olá, tenho interesse no produto: ${produto.nome} (${produto.preco})`);

            card.innerHTML = `
                <div class="product-header">
                    ${produto.destaque ? '<span class="card-badge neon-badge">Mais Vendido</span>' : ''}
                    <h3 class="category-title" style="font-size: 1.3rem; margin-top: ${produto.destaque ? '20px' : '0'}">${produto.nome}</h3>
                    <div class="product-price">${produto.preco}</div>
                </div>
                <p class="category-desc" style="margin-bottom: 10px;">${produto.descricao}</p>
                ${atributosHtml}
                <div style="margin-top: auto;">
                    <a href="https://wa.me/5551980907413?text=${wppText}" target="_blank" class="btn btn-primary" style="width: 100%;">
                        Comprar via WhatsApp <i class="fab fa-whatsapp"></i>
                    </a>
                </div>
            `;

            productsGrid.appendChild(card);
        });
    }
});
