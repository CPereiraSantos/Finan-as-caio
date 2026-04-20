// Coloque aqui a URL da sua implantação do Google Apps Script
const API_URL = 'https://script.google.com/macros/s/AKfycbxd6UZtC_DB3lTrvENxgubuIXmwickgRnTJsr01tZ76aJ3OJbb3EI3R-wN4tPCiuiCo/exec';

const moeda = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

async function buscarDados() {
    try {
        const resposta = await fetch(API_URL);
        const dados = await resposta.json();
        // Usa a aba DESPESAS da sua planilha
        renderizar(dados.despesas);
    } catch (erro) {
        document.getElementById('conteudo').innerHTML = "<p style='color:red'>Erro ao conectar com a planilha.</p>";
    }
}

function renderizar(lista) {
    // Cálculos baseados na coluna VALOR e STATUS
    const totalGeral = lista.reduce((acc, i) => acc + Number(i.valor || 0), 0);
    const totalPago = lista.filter(i => i.status?.toUpperCase() === 'PAGO')
                           .reduce((acc, i) => acc + Number(i.valor || 0), 0);
    const totalPendente = totalGeral - totalPago;

    document.getElementById('total-gasto').innerText = moeda(totalGeral);
    document.getElementById('total-pago').innerText = moeda(totalPago);
    document.getElementById('total-pendente').innerText = moeda(totalPendente);

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Vencimento</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    lista.forEach(item => {
        const status = (item.status || 'PENDENTE').toUpperCase();
        const classeStatus = status === 'PAGO' ? 'status-pago' : 'status-pendente';
        
        html += `
            <tr>
                <td>${item.despesa || 'Sem descrição'}</td>
                <td>${moeda(item.valor)}</td>
                <td>${item.vencimento || '-'}</td>
                <td class="${classeStatus}">${status}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    document.getElementById('conteudo').innerHTML = html;
}

buscarDados();