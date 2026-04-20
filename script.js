const API_URL = 'https://script.google.com/macros/s/AKfycbxd6UZtC_DB3lTrvENxgubuIXmwickgRnTJsr01tZ76aJ3OJbb3EI3R-wN4tPCiuiCo/exec'; 
let totalDespesasGlobal = 0;

const moeda = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function calcularRestante() {
    const saldoInserido = Number(document.getElementById('saldo-disponivel').value) || 0;
    const restante = saldoInserido - totalDespesasGlobal;
    
    const elRestante = document.getElementById('saldo-restante');
    elRestante.innerText = moeda(restante);
    elRestante.style.color = restante < 0 ? "#ef4444" : "#10b981";
}

async function carregar() {
    try {
        const r = await fetch(API_URL);
        const dados = await r.json();
        render(dados);
    } catch (e) {
        document.getElementById('conteudo').innerHTML = "<p>Erro na conexão.</p>";
    }
}

document.getElementById('form-gasto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-salvar');
    btn.innerText = "⌛";
    
    const obj = {
        acao: "ADICIONAR",
        despesa: document.getElementById('desc').value,
        valor: document.getElementById('valor').value,
        vencimento: document.getElementById('data').value
    };

    await fetch(API_URL, { method: 'POST', body: JSON.stringify(obj) });
    e.target.reset();
    btn.innerText = "Adicionar";
    carregar();
});

async function deletar(id) {
    if(confirm("Excluir esta despesa?")) {
        await fetch(API_URL, { method: 'POST', body: JSON.stringify({ acao: "DELETAR", id })});
        carregar();
    }
}

function render(lista) {
    totalDespesasGlobal = lista.reduce((a, b) => a + Number(b.valor), 0);

    document.getElementById('total-geral').innerText = moeda(totalDespesasGlobal);
    calcularRestante();

    let html = `<table><thead><tr><th>Descrição</th><th>Vencimento</th><th>Valor</th><th style="text-align:right">Ações</th></tr></thead><tbody>`;
    
    lista.reverse().forEach(i => {
        html += `
            <tr>
                <td><strong>${i.despesa}</strong></td>
                <td style="color: var(--text-dim)">${i.vencimento ? new Date(i.vencimento).toLocaleDateString('pt-BR') : '-'}</td>
                <td>${moeda(i.valor)}</td>
                <td style="text-align:right"><button onclick="deletar(${i.id})" class="btn-del">🗑️</button></td>
            </tr>
        `;
    });

    document.getElementById('conteudo').innerHTML = html + "</tbody></table>";
}

carregar();