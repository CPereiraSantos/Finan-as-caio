const API_URL='https://script.google.com/macros/s/AKfycby9vpt36jhnjbAIPqM1mDde4kY5IWN8UXyXrFeVk2uz75lt1S5wRlDw78ryq6qRMR4/exec';
let dados={geral:[],caio:[],victoria:[]};
const moeda=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
async function carregar(){
 const r=await fetch(API_URL);
 dados=await r.json();
 render();
}
function sobraPessoa(nome){
 const entradas=dados.geral.filter(x=>String(x.responsavel||'').toLowerCase().includes(nome)).reduce((a,b)=>a+Number(b.valor||0),0);
 const gastos=(dados[nome]||[]).reduce((a,b)=>a+Number(b.valor||0),0);
 return {entradas,gastos,saldo:entradas-gastos};
}
function render(){
 const resumo=document.getElementById('resumo');
 const c=document.getElementById('conteudo');
 if(PAGINA==='geral'){
   const total=dados.geral.reduce((a,b)=>a+Number(b.valor||0),0);
   resumo.innerHTML=`<div class='card'>Total Geral <strong>${moeda(total)}</strong></div>`;
   c.innerHTML=`<table><tr><th>Data</th><th>Resp.</th><th>Descrição</th><th>Valor</th></tr>${dados.geral.map(x=>`<tr><td>${x.data}</td><td>${x.responsavel}</td><td>${x.descricao}</td><td>${moeda(x.valor)}</td></tr>`).join('')}</table>`;
 } else {
   const p=sobraPessoa(PAGINA);
   resumo.innerHTML=`<div class='card'>Entrada <strong>${moeda(p.entradas)}</strong></div><div class='card'>Pessoais <strong>${moeda(p.gastos)}</strong></div><div class='card'>Sobra <strong>${moeda(p.saldo)}</strong></div>`;
   c.innerHTML=`<form onsubmit='salvar(event)'><input type='date' id='data' required><input id='descricao' placeholder='Descrição' required><input id='categoria' placeholder='Categoria'><input type='number' step='0.01' id='valor' placeholder='Valor' required><button>Salvar</button></form><table><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Valor</th></tr>${dados[PAGINA].map(x=>`<tr><td>${x.data}</td><td>${x.descricao}</td><td>${x.categoria}</td><td>${moeda(x.valor)}</td></tr>`).join('')}</table>`;
 }
}
async function salvar(e){
 e.preventDefault();
 await fetch(API_URL,{method:'POST',body:JSON.stringify({aba:PAGINA,data:data.value,descricao:descricao.value,categoria:categoria.value,valor:valor.value})});
 carregar();
}
carregar();