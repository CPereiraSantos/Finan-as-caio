const API_URL = 'https://script.google.com/macros/s/AKfycby9vpt36jhnjbAIPqM1mDde4kY5IWN8UXyXrFeVk2uz75lt1S5wRlDw78ryq6qRMR4/exec';

let dados = { despesas: [], pessoais: [], salarios: [] };

const moeda = v => Number(v || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

async function carregar() {
    try {
        const r = await fetch(API_URL);
        dados = await r.json();
        render();
    } catch (erro) {
        console.error("Erro ao carregar:", erro);
        document.body.innerHTML += `<div style="color:red;padding:20px;text-align:center">Erro ao conectar com a planilha. Verifique se o App Script está publicado como 'Web App' e acessível para 'Anyone'.</div>`;
    }
}

function render() {
    // Busca os elementos dependendo do HTML que estiver aberto
    const containerCards = document.getElementById('cards') || document.getElementById('resumo');
    const containerConteudo = document.getElementById('conteudo');

    if (!containerCards || !containerConteudo) return;

    if (PAGINA === 'geral') {
        renderGeral(containerCards, containerConteudo);
    } else {
        renderPessoal(PAGINA, containerCards, containerConteudo);
    }
}

function renderGeral(cards, cont) {
    const totalGeral = dados.despesas.reduce((acc, d) => acc + Number(d.valor || 0), 0);
    cards.innerHTML = `
        <div class="card">
            <h3>Gasto Total</h3>
            <p style="font-size: 1.5rem; color: #ef4444">${moeda(totalGeral)}</p>
        </div>
    `;
    
    let html = '<table><thead><tr><th>Descrição</th><th>Valor</th><th>Vencimento</th></tr></thead><tbody>';
    dados.despesas.forEach(d => {
        html += `<tr><td>${d.descricao}</td><td>${moeda(d.valor)}</td><td>${d.vencimento || '-'}</td></tr>`;
    });
    html += '</tbody></table>';
    cont.innerHTML = html;
}

function renderPessoal(nome, cards, cont) {
    // Filtra gastos específicos da pessoa (ajuste os nomes das colunas conforme sua planilha)
    const gastosPessoais = dados.pessoais.filter(p => p.responsavel?.toLowerCase() === nome.toLowerCase());
    const total = gastosPessoais.reduce((acc, p) => acc + Number(p.valor || 0), 0);

    cards.innerHTML = `
        <div class="card">
            <h3>Meus Gastos</h3>
            <p style="font-size: 1.5rem;">${moeda(total)}</p>
        </div>
    `;

    let html = '<table><thead><tr><th>Item</th><th>Valor</th></tr></thead><tbody>';
    gastosPessoais.forEach(p => {
        html += `<tr><td>${p.item || p.descricao}</td><td>${moeda(p.valor)}</td></tr>`;
    });
    html += '</tbody></table>';
    cont.innerHTML = html;
}

carregar();