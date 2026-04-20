const API_URL = 'https://script.google.com/macros/s/AKfycbxd6UZtC_DB3lTrvENxgubuIXmwickgRnTJsr01tZ76aJ3OJbb3EI3R-wN4tPCiuiCo/exec'; 
let totalDespesasGlobal = 0;

const moeda = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

async function salvarSaldo() {
    const valor = document.getElementById('saldo-disponivel').value;
    const btn = document.getElementById('btn-saldo');
    btn.innerText = "⌛";
    
    try {
        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ acao: "SALVAR_SALDO", valor: valor })
        });
        btn.innerText = "OK!";
        setTimeout(() => btn.innerText = "Registar", 2000);
        carregar(); 
    } catch (e) {
        btn.innerText = "Erro";
    }
}

function calcularRestante(saldoBase) {
    const restante = saldoBase - totalDespesasGlobal;
    const el = document.getElementById('saldo-restante');
    el.innerText = moeda(restante);
    el.style.color = restante < 0 ? "#ef4444" : "#10b981";
}

async function carregar() {
    try {
        const r = await fetch(API_URL);
        const res = await r.json();
        
        const saldoDaPlanilha = Number(res.saldoInicial) || 0;
        document.getElementById('saldo-disponivel').value = saldoDaPlanilha;
        
        renderizar(res.despesas || [], saldoDaPlanilha);
    } catch (e) {
        console.error("Erro:", e);
    }
}

document.getElementById('form-gasto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-salvar');
    btn.innerText = "⌛";
    
    const obj = {
        acao: "ADICIONAR",
        despesa: document.getElementById('desc').value,
        valor: document.getElementById('valor').value
    };

    await fetch(API_URL, { method: 'POST', body: JSON.stringify(obj) });
    e.target.reset();
    btn.innerText = "Adicionar";
    carregar();
});

async function deletar(id) {
    if(!confirm("Excluir?")) return;
    await fetch(API_URL, { method: 'POST', body: JSON.stringify({ acao: "DELETAR", id })});
    carregar();
}

function renderizar(lista, saldoBase) {
    totalDespesasGlobal = lista.reduce((acc, item) => acc + Number(item.valor || 0), 0);
    document.getElementById('total-geral').innerText = moeda(totalDespesasGlobal);
    
    calcularRestante(saldoBase);

    let html = `<table><thead><tr><th>DESPESA</th><th>VALOR</th><th></th></tr></thead><tbody>`;
    lista.reverse().forEach(item => {
        html += `<tr>
            <td><strong>${item.despesa}</strong></td>
            <td>${moeda(item.valor)}</td>
            <td style="text-align:right"><button onclick="deletar(${item.id})" class="btn-del">🗑️</button></td>
        </tr>`;
    });
    document.getElementById('conteudo').innerHTML = html + "</tbody></table>";
}

carregar();