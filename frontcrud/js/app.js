let alt = false
function adicionar(modal)
{
    
    limparform()
    toggleModal('block',modal)
    if(modal == 'bodybuilder')
    {
    carregarAcademias()
    carregarEstilos()  
    getEl('cpf').readOnly = false
    }
    
    
}

function alterar(cpf)
{
    fetch('http://localhost:3000/body-builder/buscar/'+cpf,{
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            mode: 'cors'
        }).then((response) => response.json()).then((data) => {
            console.log(data)
            getEl('cpf').value = data.cpf
            getEl('nome').value = data.nome
            getEl('peso').value = data.peso
            getEl('altura').value = data.altura
            getEl('nasc').value = data.nasc
            getEl('whats').value = data.whats
            getEl('celular').value = data.celular
            getEl('sapato').value = data.sapato
            getEl('academias').value = data.gym.id
            getEl('estilos').value = data.style.id
        }).catch((error) => {
            alert('erro ao listar' + error)
        })
        toggleModal('block','bodybuilder')
    
    getEl('cpf').readOnly = true
    alt = true
    
}

function excluir(cpf)
{
    fetch('http://localhost:3000/body-builder/'+cpf ,{
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        mode: 'cors'
    }).then(() => {
        alert('deletado com sucesso')
        carregarClientes()
    }).catch((error)=>{
        alert('erro ao deletar')
    })
    alt = false
    
}

function send()
{
    
    let cpf = getEl('cpf').value
    let nome = getEl('nome').value
    let peso = getEl('peso').value
    let altura = getEl('altura').value
    let nasc = getEl('nasc').value
    let whats = getEl('whats').value
    let celular = getEl('celular').value
    let sapato = getEl('sapato').value
    let idgym = getEl('academias').value
    let idstyle = getEl('estilos').value
    let pessoaAdd = {
        nome: nome,
        cpf: cpf,        
        peso: peso,
        altura: altura,
        nasc: nasc,
        whats: whats,
        celular: celular,
        sapato: sapato,  
        idgym:idgym,
        idstyle:idstyle
    }
    console.log(pessoaAdd)
    if(alt)
    {
        fetch('http://localhost:3000/body-builder/'+cpf ,{
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(pessoaAdd)
        }).then(() => {
            alert('atualizado com sucesso')
            carregarClientes()
        }).catch((error)=>{
            alert('erro ao atualizar')
        })
        alt = false
        //pessoas[buscar(pessoaAdd.cpf)] = pessoaAdd
    }
    else{
        fetch('http://localhost:3000/body-builder',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(pessoaAdd)
        }).then(() => {
            alert('cadastrado com sucesso')
            carregarClientes()
        }).catch((error) => {
            alert('erro ao cadastrar')
        })

        pessoas.push(pessoaAdd)
    }
    // console.log(cpf,nome,peso,altura,nasc)
    limparform()
    toggleModal('none','bodybuilder')
    return false
}

function toggleModal(valor,tipo)
{
   const modal = document.getElementById('modal'+tipo)
    modal.style.display = valor 
}

function getEl(id){
    return document.getElementById(id)
}
function limparform()
{
    getEl('cpf').value = ''
    getEl('nome').value = ''
    getEl('peso').value = ''
    getEl('altura').value = ''
    getEl('nasc').value = ''
    getEl('whats').value = ''
    getEl('celular').value = ''
    getEl('sapato').value = ''
    getEl('nomeAcademia').value = '' 
    getEl('telefoneAcademia').value = ''
    getEl('nomeEstilo').value = ''
}

function carregarClientes()
{
    fetch('http://localhost:3000/body-builder',{
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            mode: 'cors'
        }).then((response) => response.json()).then((data) => {
            let pessoas = data
            carregarLista(data)
        }).catch((error) => {
            alert('erro ao listar' + error)
        })
}
function carregarLista(data)
{   
    pessoas = data
    document.getElementById('tabela').innerHTML = ''
    for(let i = 0; i < data.length;i++)
    {
        let element = data[i]
        let date = new Date(element.nasc).toLocaleDateString('pt-BR', {timeZone: 'UTC'})
        document.getElementById('tabela').innerHTML += `<tr>
        <td>${element.cpf}</td>
        <td>${element.nome}</td>
        <td>${element.peso} Kg</td>
        <td>${element.altura} m</td>
        <td>${date}</td>
        <td>${element.whats}</td>
        <td>${element.celular}</td>
        <td>${element.sapato}</td>
        <td>${element.gym.nome}</td>
        <td>${element.style.nome}</td>
        <td>
        <button id="${element.cpf}" class='alt' onclick="alterar(this.id)">Alterar</button>
        <button id="${element.cpf}" class='del' onclick="excluir(this.id)">Excluir</button>
        </td>
        </tr>`
    }
}
function mascaraCPF(campo) {
    let valor = campo.value.replace(/\D/g, ""); // Remove tudo que não é número
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca o primeiro ponto
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca o segundo ponto
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca o traço
    campo.value = valor;
  }
function pesquisar()
{
    let texto = getEl('busca').value
    if(texto == '')
    {
        carregarClientes()
        return
    }
    fetch('http://localhost:3000/body-builder/b/'+texto,{
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        },
        mode: 'cors'
    }).then((response) => response.json()).then((data) => {
        console.log(data)
        carregarLista(data)
    }).catch((error) => {
        alert('cliente não encontrado')
    })
}
function carregarAcademias()
{
    const academias = getEl('academias');
    academias.innerHTML = ''; 
    fetch('http://localhost:3000/gym',{
        method: 'GET',
        headers:{
            'Content-type':'application/json'
        },
        mode:'cors'
    }).then((response)=> response.json()).then((data)=>{
        if(data.length == 0)
        {
            alert('nenhuma academia cadastrada')
            toggleModal('none','bodybuilder')
            return
        }
        data.forEach(element => {
            const option = document.createElement('option');  // Cria um novo elemento option
            option.value = element.id;  // Define o valor da opção
            option.textContent = element.nome;  // Define o texto da opção
            academias.appendChild(option);  // Adiciona a opção ao select
        });
    }).catch((error) => {
        alert('erro ao listar academias ')
    })
}
function carregarEstilos()
{
    const styles = getEl('estilos');
    styles.innerHTML = ''; 
    fetch('http://localhost:3000/style',{
        method: 'GET',
        headers:{
            'Content-type':'application/json'
        },
        mode:'cors'
    }).then((response)=> response.json()).then((data)=>{
        if(data.length == 0)
        {
            alert('nenhum estilo cadastrado')
            toggleModal('none','bodybuilder')
            return
        }
        data.forEach(element => {
            const option = document.createElement('option');  // Cria um novo elemento option
            option.value = element.id;  // Define o valor da opção
            option.textContent = element.nome;  // Define o texto da opção
            styles.appendChild(option);  // Adiciona a opção ao select
        });
    }).catch((error) => {
        alert('erro ao listar estilos ')
    })
}
function sendAcademia(){
    let nome = getEl('nomeAcademia').value
    let telefone = getEl('telefoneAcademia').value
    let academia = {
        nome:nome,
        telefone:telefone
    }
    console.log(academia)
    fetch('http://localhost:3000/gym',{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(academia)
    }).then((response) =>  {
        alert('academia criada com sucesso')
    }).catch((error) => {
        alert('erro ao cadastrar academia ' + error)
    })
    toggleModal('none','academia')
    return false
}
function sendEstilo(){
    let nome = getEl('nomeEstilo').value
    let estilo = {
        nome:nome
    }
    fetch('http://localhost:3000/style',{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(estilo)
    }).then((response) => {
        alert('estilo criado com sucesso')
    }).catch((error) => {
        alert('erro ao cadastrar estilo ' + error)
    })
    toggleModal('none','estilo')
    return false
}