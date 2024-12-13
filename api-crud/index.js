const express = require('express');
const app = express();
const cors = require('cors');
const { BodyBuilder } = require('./src/bodybuilder/bodybuilder.entity');
const { Gym } = require('./src/gym/gym.entity');
const { Style } = require('./src/style/style.entity');

app.use(cors({
    origin: 'https://prova-lp-gbqm-git-vercel-luw17s-projects.vercel.app', // Permite o frontend
    methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type,Authorization', // Cabeçalhos permitidos
}));
const port = 3000;
app.use(express.json());
var clientes = []; 
var academias = [{id: 0,nome: 'academia 1',telefone:'1222222222'},{id: 1,nome: 'academia 2',telefone:'2222222222'},{id: 2,nome: 'academia 3',telefone:'3222222222'}]
var styles = []
app.post('/body-builder', (req, res) => {
    const data = req.body
    let gym = academias.find(academia=>academia.id == data.idgym)
    let style = styles.find(style=>style.id == data.idstyle)
    let bodyBuilder = new BodyBuilder(data.nome,data.cpf,data.peso,data.altura,data.nasc,data.whats,data.celular,data.sapato,gym,style)
    console.log(bodyBuilder)
    clientes.push(bodyBuilder); 
    //gym.bodyBuilders.push(bodyBuilder)
    clientes.sort((a, b) => a.nome.localeCompare(b.nome, undefined, { numeric: true, sensitivity: 'base' }));
    res.send('deu certo');
});

app.put('/body-builder/:cpf', (req, res) => {

    let clienteAtualizado = false;
    const data = req.body
    let gym = academias.find(academia=>academia.id == data.idgym)
    let style = styles.find(style=>style.id == data.idstyle)
    let bodyBuilder = new BodyBuilder(data.nome,data.cpf,data.peso,data.altura,data.nasc,data.whats,data.celular,data.sapato,gym,style)

    clientes.forEach((element, index) => {
        if (element.cpf == bodyBuilder.cpf) {
            clientes[index] = bodyBuilder;
            res.send('atualizou certo');
            clienteAtualizado = true;
            return; 
        }
    });
    console.log(clientes)
    if (!clienteAtualizado) {
        res.status(404).send('cliente não encontrado');
    }
});


app.delete('/body-builder/:cpf', (req, res) => {
    let cpf = req.params.cpf;
    let clienteDeletado = false;

    clientes.forEach((element, index) => {
        if (element.cpf == cpf) {
            clientes.splice(index, 1);
            res.send('deletou certo');
            clienteDeletado = true;
            return;
        }
    });

    if (!clienteDeletado) {
        res.status(404).send('cliente não encontrado');
    }
});


app.get('/body-builder', (req, res) => {
    res.json(clientes);
});


app.get('/body-builder/buscar/:cpf', (req, res) => {
    let cpf = req.params.cpf;
    let clienteEncontrado = false;

    clientes.forEach((element, index) => {
        if (element.cpf == cpf) {
            res.json(clientes[index]);
            clienteEncontrado = true;
            return;
        }
    });

    if (!clienteEncontrado) {
        res.status(404).send('cliente não encontrado');
    }
});
app.get('/body-builder/b/:texto',(req,res)=>{
        let texto = req.params.texto;
        let retorno = [];
        let clienteEncontrado = false;
    
        function verificarObjeto(objeto, texto) {
            for (let [chave, valor] of Object.entries(objeto)) {
                console.log(`chave: ${chave}, valor: ${valor}`);
                if (typeof valor === 'string' && valor.includes(texto)) {
                    console.log(`Encontrado "${texto}" na chave: "${chave}", valor: "${valor}"`);
                    return true;
                } else if (typeof valor === 'object' && valor !== null) {
                    // Chamada recursiva para objetos aninhados
                    if (verificarObjeto(valor, texto)) {
                        return true;
                    }
                }
            }
            return false;
        }
    
        clientes.forEach((element, index) => {
            if (verificarObjeto(element, texto)) {
                console.log(`Encontrado "${texto}" no objeto de índice ${index}`);
                retorno.push(element);
                clienteEncontrado = true;
            }
        });
    
        if (clienteEncontrado) {
            console.log(retorno);
            res.json(retorno);
        } else {
            res.send('cliente nao encontrado');
        }
    })
app.post('/gym',(req,res)=>{
    const data = req.body
    let gym = new Gym()
    if(!academias  || academias.length == 0)
    {
        gym.id = 0
    }
    else{
        gym.id = (academias[academias.length-1].id)+1
    }
    gym.nome = data.nome
    gym.telefone = data.telefone
    academias.push(gym)
    console.log(academias)
    res.send('deu bom')
})
app.get('/gym',(req,res)=>{
    res.json(academias)
})
app.get('/style',(req,res)=>{
    res.json(styles)
})
app.post('/style',(req,res)=>{
    const data = req.body
    let style = new Style()
    if(!styles || styles.length == 0)
    {
        style.id = 0
    }
    else{
        style.id = (styles[styles.length-1].id)+1
    }
    style.nome = data.nome
    styles.push(style)
    console.log(styles)
    res.send('deu bom')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
