const API_URL = "COLE_SEU_LINK_AQUI";

let despesas = [];
let salarios = [];
let pessoais1 = [];
let pessoais2 = [];

function moeda(v){
return Number(v).toLocaleString("pt-BR",{
style:"currency",
currency:"BRL"
});
}

async function carregar(){

const req = await fetch(API_URL + "?t=" + Date.now());
const dados = await req.json();

despesas = dados.despesas || [];
salarios = dados.salarios || [];
pessoais1 = dados.pessoais1 || [];
pessoais2 = dados.pessoais2 || [];

render();
}

function render(){

let nome1 = salarios[0]?.nome || "";
let nome2 = salarios[1]?.nome || "";

let valor1 = Number(salarios[0]?.salario || 0);
let valor2 = Number(salarios[1]?.salario || 0);

let totalSalarios = valor1 + valor2;
let totalDespesas = despesas.reduce((a,b)=>a+Number(b.valor),0);

let divisao = totalDespesas / 2;
let sobraCasa = totalSalarios - totalDespesas;

let sobraBase1 = valor1 - divisao;
let sobraBase2 = valor2 - divisao;

let totalP1 = pessoais1.reduce((a,b)=>a+Number(b.valor),0);
let totalP2 = pessoais2.reduce((a,b)=>a+Number(b.valor),0);

let sobraFinal1 = sobraBase1 - totalP1;
let sobraFinal2 = sobraBase2 - totalP2;

// ===== CARDS PRINCIPAIS =====
document.getElementById("salarios").innerText = moeda(totalSalarios);
document.getElementById("despesas").innerText = moeda(totalDespesas);
document.getElementById("sobra").innerText = moeda(sobraCasa);
document.getElementById("divisao").innerText = moeda(divisao);

document.getElementById("pessoa1").innerText = nome1;
document.getElementById("pessoa2").innerText = nome2;

document.getElementById("sobra1").innerText = moeda(sobraBase1);
document.getElementById("sobra2").innerText = moeda(sobraBase2);

// ===== PESSOAL =====
document.getElementById("titulo1").innerText = nome1;
document.getElementById("titulo2").innerText = nome2;

document.getElementById("entrada1").innerText = moeda(sobraBase1);
document.getElementById("entrada2").innerText = moeda(sobraBase2);

document.getElementById("totalP1").innerText = moeda(totalP1);
document.getElementById("totalP2").innerText = moeda(totalP2);

document.getElementById("final1").innerText = moeda(sobraFinal1);
document.getElementById("final2").innerText = moeda(sobraFinal2);

// LISTAS
renderLista("lista1", pessoais1);
renderLista("lista2", pessoais2);
renderDespesas();
}

function renderLista(id, lista){

let html = "";

lista.slice().reverse().forEach(item=>{

html += `
<li>
<span>${item.descricao}</span>
<strong>${moeda(item.valor)}</strong>
<button onclick="excluirPessoal('${item.id}')">🗑️</button>
</li>
`;

});

document.getElementById(id).innerHTML = html;
}

function renderDespesas(){

let html = "";

despesas.slice().reverse().forEach(item=>{

html += `
<li>
<span>${item.descricao}</span>
<strong>${moeda(item.valor)}</strong>
<button onclick="editarConta('${item.id}','${item.descricao}','${item.valor}')">✏️</button>
<button onclick="excluirConta('${item.id}')">🗑️</button>
</li>
`;

});

document.getElementById("gastos").innerHTML = html;
}

async function salvarSalarios(){

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
tipo:"salario",
nome1:document.getElementById("nome1").value,
valor1:document.getElementById("valor1").value,
nome2:document.getElementById("nome2").value,
valor2:document.getElementById("valor2").value
})
});

carregar();
}

async function addDespesa(){

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
tipo:"despesa",
descricao:document.getElementById("descricao").value,
valor:document.getElementById("valor").value
})
});

document.getElementById("descricao").value="";
document.getElementById("valor").value="";

carregar();
}

async function addPessoal(pessoa){

let desc = document.getElementById("desc"+pessoa).value;
let val = document.getElementById("val"+pessoa).value;

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
tipo:"pessoal",
pessoa:pessoa,
descricao:desc,
valor:val
})
});

document.getElementById("desc"+pessoa).value="";
document.getElementById("val"+pessoa).value="";

carregar();
}

async function excluirConta(id){

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
tipo:"excluirDespesa",
id:id
})
});

carregar();
}

async function excluirPessoal(id){

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
tipo:"excluirPessoal",
id:id
})
});

carregar();
}

async function editarConta(id,nome,valor){

let novoNome = prompt("Nome:",nome);
let novoValor = prompt("Valor:",valor);

if(!novoNome) return;

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
tipo:"editarDespesa",
id:id,
descricao:novoNome,
valor:novoValor
})
});

carregar();
}

window.onload = carregar;