const API_URL = 'https://script.google.com/macros/s/AKfycbxd6UZtC_DB3lTrvENxgubuIXmwickgRnTJsr01tZ76aJ3OJbb3EI3R-wN4tPCiuiCo/exec';

const moeda = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
        vencimento: document.getElementById('data').value,
        status: "PENDENTE"
    };

    await fetch(API_URL, { method: 'POST', body: JSON.stringify(obj) });
    e.target.reset();
    btn.innerText = "Adicionar";
    carregar();
});

async function mudarStatus(id, atual) {
    const novo = atual === "PAGO" ? "PENDENTE" : "PAGO";
    await fetch(API_URL, { method: 'POST', body: JSON.stringify({ acao: "EDITAR_STATUS", id, novoStatus: novo })});
    carregar();
}

async function deletar(id) {
    if(confirm("Excluir?")) {
        await fetch(API_URL, { method: 'POST', body: JSON.stringify({ acao: "DELETAR", id })});
        carregar();
    }
}

function render(lista) {
    const total = lista.reduce((a, b) => a + Number(b.valor), 0);
    const pago = lista.filter(i => i.status === "PAGO").reduce((a, b) => a + Number(b.valor), 0);

    document.getElementById('total-geral').innerText = moeda(total);
    document.getElementById('total-pago').innerText = moeda(pago);
    document.getElementById('total-pendente').innerText = moeda(total - pago);

    let html = `<table><thead><tr><th>Descrição</th><th>Valor</th><th>Status</th><th></th></tr></thead><tbody>`;
    
    lista.reverse().forEach(i => {
        html += `
            <tr>
                <td><strong>${i.despesa}</strong><br><small style="color:gray">${i.vencimento || ''}</small></td>
                <td>${moeda(i.valor)}</td>
                <td><button onclick="mudarStatus(${i.id}, '${i.status}')" class="status-btn ${i.status}">${i.status}</button></td>
                <td><button onclick="deletar(${i.id})" class="btn-del">🗑️</button></td>
            </tr>
        `;
    });

    document.getElementById('conteudo').innerHTML = html + "</tbody></table>";
}

carregar();