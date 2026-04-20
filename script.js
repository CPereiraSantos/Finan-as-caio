const API_URL = 'https://script.google.com/macros/s/AKfycbxd6UZtC_DB3lTrvENxgubuIXmwickgRnTJsr01tZ76aJ3OJbb3EI3R-wN4tPCiuiCo/exec';
let totalDespesasGlobal = 0; // Para facilitar o cálculo em tempo real

const moeda = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Função para calcular o saldo restante em tempo real
function calcularRestante() {
    const saldoInserido = Number(document.getElementById('saldo-disponivel').value) || 0;
    const restante = saldoInserido - totalDespesasGlobal;
    
    const elRestante = document.getElementById('saldo-restante');
    elRestante.innerText = moeda(restante);
    
    // Fica vermelho se o saldo for negativo
    elRestante.style.color = restante < 0 ? "#ef4444" : "#ffffff";
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

// ... (as funções de Adicionar, MudarStatus e Deletar continuam as mesmas) ...

function render(lista) {
    const total = lista.reduce((a, b) => a + Number(b.valor), 0);
    const pago = lista.filter(i => i.status?.toUpperCase() === 'PAGO').reduce((a, b) => a + Number(b.valor), 0);
    
    totalDespesasGlobal = total; // Atualiza a variável global

    document.getElementById('total-geral').innerText = moeda(total);
    document.getElementById('total-pago').innerText = moeda(pago);
    document.getElementById('total-pendente').innerText = moeda(total - pago);

    // Atualiza o cálculo do saldo restante caso já exista um valor no input
    calcularRestante();

    let html = `<table><thead><tr><th>Descrição</th><th>Valor</th><th>Status</th><th></th></tr></thead><tbody>`;
    
    lista.reverse().forEach(i => {
        const status = (i.status || 'PENDENTE').toUpperCase();
        html += `
            <tr>
                <td><strong>${i.despesa}</strong><br><small style="color:gray">${i.vencimento || ''}</small></td>
                <td>${moeda(i.valor)}</td>
                <td><button onclick="mudarStatus(${i.id}, '${status}')" class="status-btn ${status}">${status}</button></td>
                <td><button onclick="deletar(${i.id})" class="btn-del">🗑️</button></td>
            </tr>
        `;
    });

    document.getElementById('conteudo').innerHTML = html + "</tbody></table>";
}

carregar();