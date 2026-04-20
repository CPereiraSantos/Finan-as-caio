const API_URL = 'https://script.google.com/macros/s/AKfycbxd6UZtC_DB3lTrvENxgubuIXmwickgRnTJsr01tZ76aJ3OJbb3EI3R-wN4tPCiuiCo/exec'; 
let totalDespesasGlobal = 0;

const moeda = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function calcularRestante() {
    const salarioInput = document.getElementById('saldo-disponivel');
    const salarioVal = Number(salarioInput.value) || 0;
    
    // Subtrai as despesas do salário inserido
    const restante = salarioVal - totalDespesasGlobal;
    
    const elRestante = document.getElementById('saldo-restante');
    elRestante.innerText = moeda(restante);
    
    // Muda a cor se o saldo for negativo
    elRestante.style.color = restante < 0 ? "#ef4444" : "#10b981";
}

async function carregar() {
    try {
        const r = await fetch(API_URL);
        const dados = await r.json();
        renderizar(dados);
    } catch (e) {
        document.getElementById('conteudo').innerHTML = "<p style='color:red'>Erro ao carregar dados.</p>";
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
    if(!confirm("Excluir despesa?")) return;
    await fetch(API_URL, { method: 'POST', body: JSON.stringify({ acao: "DELETAR", id })});
    carregar();
}

function renderizar(lista) {
    // Soma o total de todas as despesas na planilha
    totalDespesasGlobal = lista.reduce((acc, item) => acc + Number(item.valor || 0), 0);
    document.getElementById('total-geral').innerText = moeda(totalDespesasGlobal);
    
    // Atualiza o saldo restante
    calcularRestante();

    let html = `<table><thead><tr><th>DESPESA</th><th>VALOR</th><th style="text-align:right">AÇÃO</th></tr></thead><tbody>`;
    lista.reverse().forEach(item => {
        html += `<tr>
            <td><strong>${item.despesa}</strong><br><small style="color:gray">${item.vencimento ? new Date(item.vencimento).toLocaleDateString('pt-BR') : ''}</small></td>
            <td>${moeda(item.valor)}</td>
            <td style="text-align:right"><button onclick="deletar(${item.id})" class="btn-del">🗑️</button></td>
        </tr>`;
    });
    document.getElementById('conteudo').innerHTML = html + "</tbody></table>";
}

carregar();