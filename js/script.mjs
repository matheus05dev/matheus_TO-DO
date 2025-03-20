import { Tarefa } from "./tarefa.mjs";
const botaoAdicionar = document.querySelector(".botao-adicionar");

const tabela = document.querySelector('.tabela-tarefas tbody');


async function atualizarTabela() {
    tabela.innerHTML = "";
    const tarefas = await buscarTarefas();
    tarefas.forEach(tarefa => {
        const linha = document.createElement('tr');
        linha.setAttribute("data-id", tarefa.id);
        const campoCheck = document.createElement('td');
        const iconCheck = document.createElement('i');
        iconCheck.classList.add('fa-regular', 'fa-square-check');
        const titulo = document.createElement('td')
        titulo.textContent = tarefa.titulo
        const data = document.createElement('td')
        data.textContent = new Date(tarefa.vencimento).toLocaleDateString('pt-Br', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        const campoImportante = document.createElement('td');
        const iconImportante = document.createElement('i');
        iconImportante.classList.add('fa-solid', 'fa-triangle-exclamation');
        if (tarefa.importancia === true) {
            iconImportante.style.color = "yellow";
        };


        const campoLixo = document.createElement('td');
        const iconLixo = document.createElement('i');
        iconLixo.classList.add('fa-solid', 'fa-trash-can-arrow-up');


        campoCheck.appendChild(iconCheck);
        linha.appendChild(campoCheck);
        if(tarefa.check){
            titulo.style.textDecoration = "line-through"
        }

        linha.appendChild(titulo);
        linha.appendChild(data);
        tabela.appendChild(linha);
        campoImportante.appendChild(iconImportante);
        linha.appendChild(campoImportante);
        campoLixo.appendChild(iconLixo);
        linha.appendChild(campoLixo);
    });
}

async function salvarTarefa() {
    const titulo = document.querySelector("#descricao");
    const dataVencimento = document.querySelector("#data-vencimento");
    const importante = document.querySelector("#importante");
    const tarefa = new Tarefa(titulo.value, dataVencimento.value, importante.checked, false);
    try {
        const resposta = await fetch("http://localhost:3000/tarefas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tarefa)
        });
        if (!resposta.ok) {
            throw Error(`Erro ao criar tarefas: ${resposta.statusText}`)
        }
    } catch (error) {
        console.log(`Erro ao criar tarefas: ${error}`);
        alert("Erro ao salvar tarefa");
    }
    atualizarTabela();
}


async function deletarTarefa(id) {
    try {
        const response = await fetch(`http://localhost:3000/tarefas/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        atualizarTabela();
    } catch (error) {
        alert(`erro ao deletar tarefa: ${error}`)
        console.error("Erro:", error);
    }
}

async function buscarTarefas() {
    try {
        const reposta = await fetch('http://localhost:3000/tarefas');
        const dados = await reposta.json();
        const tarefas = dados.map(dado => {
            const novaTarefa = new Tarefa(dado.titulo, dado.vencimento, dado.importancia, dado.check)
            novaTarefa.id = dado.id;
            return novaTarefa;
        })
        console.log(tarefas);
        return tarefas;
    } catch (error) {
        console.log('Erro ao buscar tarefas: ', error);
        alert(`Erro ao buscar tarefas: ${error}`);
    }
}

async function buscarTarefa(id) {
    try {
        const resposta = await fetch(`http://localhost:3000/tarefas/${id}`);
        const data = await resposta.json();
        return data
    } catch (error) {
        alert(`Erro ao bucar tarefa ${error}`)
    }
}

async function atualizarTarefaConcluida(id) {
    const tarefa = await buscarTarefa(id);
    let check = !tarefa.check;
    try {
        await fetch(`http://localhost:3000/tarefas/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ check: check })
        });
        atualizarTabela();
    } catch (error) {
        console.error(`Erro ao atualizar a tarefa: `, error)
    }
}


botaoAdicionar.addEventListener("click", () => {
    salvarTarefa();
})

tabela.addEventListener('click', (event) => {
    const elementoClicado = event.target;
    const linha = elementoClicado.closest('tr');
    const dataId = linha.getAttribute('data-id');
    if (elementoClicado.classList.contains('fa-trash-can-arrow-up')) {
        deletarTarefa(dataId);
    }
    if(elementoClicado.classList.contains('fa-square-check')){
        atualizarTarefaConcluida(dataId)
    }
})

atualizarTabela();