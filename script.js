const API_URL = 'COLE_AQUI_A_SUA_URL_DO_APPS_SCRIPT'; 
let totalDespesasGlobal = 0;

const moeda = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Função que calcula o saldo restante
function calcularRestante() {
    const salarioInput = document.getElementById('saldo-disponivel');
    const salarioVal = Number(salarioInput.value) || 0;
    
    const restante = salarioVal - totalDespesasGlobal;
    
    const elRestante = document.getElementById('saldo-restante');
    elRestante.innerText = moeda(restante);
    
    // Fica vermelho se estiver negativo, verde se positivo
    elRestante.style.color = restante < 0 ? "#ef4444" : "#10b981";
}

async function carregar() {
    try {
        const r = await fetch(API_URL);
        const dados = await r.json();
        renderizar(dados);
    } catch (e) {
        console.error("Erro ao carregar dados:", e);
        document.getElementById('conteudo').innerHTML = "<p style='color:red'>Erro na conexão com a planilha.</p>";
    }
}

document.getElementById('form-gasto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-salvar');
    const originalText = btn.innerText;
    btn.innerText = "⌛...";
    btn.disabled = true;
    
    const obj = {
        acao: "ADICIONAR",
        despesa: document.getElementById('desc').value,
        valor: document.getElementById('valor').value,
        vencimento: document.getElementById('data').value
    };

    try {
        await fetch(API_URL, { method: 'POST', body: JSON.stringify(obj) });
        e.target.reset();
        await carregar();
    } catch (e) {
        alert("Erro ao salvar despesa.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
});

async function deletar(id) {
    if(!confirm("Deseja apagar esta despesa?")) return;
    await fetch(API_URL, { method: 'POST', body: JSON.stringify({ acao: "DELETAR", id })});
    carregar();
}

function renderizar(lista) {
    // Soma todas as despesas da lista
    totalDespesasGlobal = lista.reduce((acc, item) => acc + Number(item.valor || 0), 0);
    
    document.getElementById('total-geral').innerText = moeda(totalDespesasGlobal);
    
    // Atualiza o saldo restante após carregar a lista
    calcularRestante();

    let html = `<table>
        <thead>
            <tr>
                <th>DESCRIÇÃO</th>
                <th>DATA</th>
                <th>VALOR</th>
                <th style="text-align:right">AÇÃO</th>
            </tr>
        </thead>
        <tbody>`;

    // Inverte para mostrar a mais recente primeiro
    lista.slice().reverse().forEach(item => {
        html += `
            <tr>
                <td><strong>${item.despesa}</strong></td>
                <td style="color: var(--text-dim)">${item.vencimento ? new Date(item.vencimento).toLocaleDateString('pt-BR') : '-'}</td>
                <td>${moeda(item.valor)}</td>
                <td style="text-align:right">
                    <button onclick="deletar(${item.id})" class="btn-del">🗑️</button>
                </td>
            </tr>
        `;
    });

    document.getElementById('conteudo').innerHTML = html + "</tbody></table>";
}

// Inicia o carregamento
carregar();