const API_URL = 'https://script.google.com/macros/s/AKfycbxd6UZtC_DB3lTrvENxgubuIXmwickgRnTJsr01tZ76aJ3OJbb3EI3R-wN4tPCiuiCo/exec';

let totalDespesasGlobal = 0;

const moeda = v =>
    Number(v || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

async function salvarSaldo() {
    const valor = document.getElementById('saldo-disponivel').value;
    const btn = document.getElementById('btn-saldo');

    btn.innerText = '⌛';

    await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
            acao: 'SALVAR_SALDO',
            valor
        })
    });

    btn.innerText = 'OK!';

    setTimeout(() => {
        btn.innerText = 'Registrar';
    }, 2000);

    carregar();
}

function calcularRestante(saldoBase) {
    const restante = saldoBase - totalDespesasGlobal;

    const el = document.getElementById('saldo-restante');

    el.innerText = moeda(restante);
    el.style.color = restante < 0 ? '#ef4444' : '#10b981';
}

async function carregar() {
    try {
        const r = await fetch(API_URL);
        const res = await r.json();

        const saldoDaPlanilha = Number(res.saldoInicial) || 0;

        document.getElementById('saldo-disponivel').value = saldoDaPlanilha;

        renderizar(res.despesas || [], saldoDaPlanilha);

    } catch (e) {
        console.error('Erro:', e);
    }
}

function alternarEdicao(id) {
    const linha = document.querySelector(`tr[data-id="${id}"]`);

    if (!linha) return;

    const isEditing = linha.classList.contains('editing');

    if (!isEditing) {

        linha.classList.add('editing');

        const celulaNome = linha.cells[0];
        const celulaValor = linha.cells[1];
carregar();