const API_URL='https://script.google.com/macros/s/AKfycby9vpt36jhnjbAIPqM1mDde4kY5IWN8UXyXrFeVk2uz75lt1S5wRlDw78ryq6qRMR4/exec';

let dados={despesas:[],pessoais:[],salarios:[]};

const moeda=v=>Number(v||0).toLocaleString('pt-BR',{
style:'currency',
currency:'BRL'
});

async function carregar(){
try{
 const r=await fetch(API_URL);
 dados=await r.json();
 render();
}catch(erro){
 document.body.innerHTML += `
 <div style="color:red;padding:20px">
 Erro ao carregar dados da API
 </div>`;
 console.log(erro);
}
}

function render(){
let cards=document.getElementById('cards');
let c=document.getElementById('conteudo');

if(!cards || !c) return;

cards.innerHTML='<div class="card">Sistema carregado</div>';
c.innerHTML='<div class="card">Dados recebidos com sucesso</div>';
}

carregar();