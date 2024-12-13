class BodyBuilder{
    
    constructor(nome,cpf,peso,altura,nasc,whats,celular,sapato,gym,style)
    {
        this.nome = nome
        this.cpf = cpf
        this.peso = peso
        this.altura = altura
        this.nasc = nasc
        this.whats = whats
        this.celular = celular
        this.sapato = sapato
        this.gym = gym // associação a classe gym
        this.style = style
    }
}
module.exports = { BodyBuilder };