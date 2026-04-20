const API_URL = "https://script.google.com/macros/s/AKfycbzT33TqCjIjm8ojUWm9bCY439hx7hyp5cIfedfU0FeDZ275osfJp0DvmG_UZIDheXns/exec";

let salarioCaio = 0;
let salarioVictoria = 0;
let despesas = [];
let pessoaisCaio = [];
let pessoaisVictoria = [];

function moeda(valor){
return Number(valor).toLocaleString("pt-BR",{
style:"currency",
currency:"BRL"
});
}

async function carregar(){

const req = await fetch(API_URL + "?t=" + Date.now());
const dados = await req.json();

despesas = dados.despesas || [];
pessoaisCaio = dados.pessoaisCaio || [];
pessoaisVictoria = dados.pessoaisVictoria || [];

salarioCaio = Number(dados.salarios[0]?.salario || 0);
salarioVictoria = Number(dados.salarios[1]?.salario || 0);

document.getElementById("salarioCaio").value = salarioCaio;
document.getElementById("salarioVictoria").value = salarioVictoria;

atualizar();
}

function atualizar(){

let totalSalarios = salarioCaio + salarioVictoria;

let totalDespesas = despesas.reduce((t,i)=> t + Number(i.valor),0);

let divisao = totalDespesas / 2;
let sobraCasa = totalSalarios - totalDespesas;

let sobraBaseCaio = salarioCaio - divisao;
let sobraBaseVictoria = salarioVictoria - divisao;

let totalPessoalCaio = pessoaisCaio.reduce((t,i)=> t + Number(i.valor),0);
let totalPessoalVictoria = pessoaisVictoria.reduce((t,i)=> t + Number(i.valor),0);

let sobraFinalCaio = sobraBaseCaio - totalPessoalCaio;
let sobraFinalVictoria = sobraBaseVictoria - totalPessoalVictoria;

document.getElementById("salarios").innerText = moeda(totalSalarios);
document.getElementById("despesas").innerText = moeda(totalDespesas);
document.getElementById("sobra").innerText = moeda(sobraCasa);
document.getElementById("divisao").innerText = moeda(divisao);

document.getElementById("salCaio").innerText = moeda(salarioCaio);
document.getElementById("salVictoria").innerText = moeda(salarioVictoria);

document.getElementById("caioSobra").innerText = moeda(sobraBaseCaio);
document.getElementById("vicSobra").innerText = moeda(sobraBaseVictoria);

document.getElementById("caioFinal").innerText = moeda(sobraFinalCaio);
document.getElementById("vicFinal").innerText = moeda(sobraFinalVictoria);

renderLista("listaCaio", pessoaisCaio);
renderLista("listaVictoria", pessoaisVictoria);

renderDespesas();
}

function renderLista(id, lista){

let html = "";

lista.slice().reverse().forEach(item=>{
html += `
<li>
<span>${item.descricao}</span>
<strong>${moeda(item.valor)}</strong>
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
caio:Number(document.getElementById("salarioCaio").value),
victoria:Number(document.getElementById("salarioVictoria").value)
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
valor:Number(document.getElementById("valor").value)
})
});

document.getElementById("descricao").value="";
document.getElementById("valor").value="";

carregar();
}

async function addPessoal(pessoa){

let desc = pessoa === "caio"
? document.getElementById("descCaio").value
: document.getElementById("descVictoria").value;

let valor = pessoa === "caio"
? Number(document.getElementById("valorCaioP").value)
: Number(document.getElementById("valorVictoriaP").value);

await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
tipo:"pessoal",
pessoa:pessoa,
descricao:desc,
valor:valor
})
});

if(pessoa==="caio"){
document.getElementById("descCaio").value="";
document.getElementById("valorCaioP").value="";
}else{
document.getElementById("descVictoria").value="";
document.getElementById("valorVictoriaP").value="";
}

carregar();
}

window.onload = carregar;