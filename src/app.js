import express from "express"
import cors from "cors"

import conn from "./sequelize.js"

//Tabelas
import tarefaTabela from "./tarefasTabela.js"
import tabelaTarefa from "./tarefasTabela.js"

const PORT = 3333

const app = express()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(express.json())

conn
    .sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server http is running on PORT: ${PORT}`)
        })
    })
    .catch()

const logRoutes = (req, res, next) => {
    const { url, method } = req
    const rota = `[${method.toUpperCase()}] - ${url}`
    console.log(rota)
    next()
}

//Middleware GLOBAL
app.use(logRoutes)

//middleware LOCAL -> NA ROTA
app.get("/tarefas", async (req, res) => {
    try {
        const tarefas = await tarefaTabela.findAll()
        res.status(200).json(tarefas)
    } catch (error) {
        res.status(500).json({
            erro: "Erro interno ao listar tarefas"
        })
    }
})

app.post("/tarefas", async (req, res) => {
    const {tarefa, descricao} = req.body

    if(!tarefa || tarefa.length < 2){
        res.status(400).json({
            erro: "Campo tarefa inválido",
            mensagem: "O campo tarefa deve ter 2 ou mais caracteres"
        })
        return
    }

    if(!descricao){
        res.status(400).json({
            erro: "Campo descricao inválido",
            mensagem: "O campo descricao não pode ser nulo"
        })
        return
    }

    const novaTarefa = {
        tarefa,
        descricao
    }

    try {
        const tarefaCadastrada = await tabelaTarefa.create(novaTarefa)
        res.status(201).json({
            mensagem: "Tarefa cadastrada com sucesso",
            tarefaCadastrada
        })
    } catch (error) {
        res.status(500).json({
            erro: "Erro interno ao cadastrar uma tarefa"
        })
    }
})

app.get("/tarefas/:id", async (req, res) => {
    const { id } = req.params

    if(!id){
        res.status(400).json({
            erro: "Parâmetro id Inválido",
        })
        return
    }

    try {
        const tarefa = await tabelaTarefa.findByPk(id)
        if(!tarefa){
            res.status(404).json({
                erro: "Tarefa não encontrada",
                mensagem: `Id ${id} não existe`
            })
            return
        }
        res.status(200).json({
            mensagem: "Tarefa encontrada",
            tarefa
        })
    } catch (error) {
        res.status(500).json({
            erro: "Erro interno ao listar uma tarefa"
        })
    }
})

app.put("/tarefas/:id", async (req, res) => {
    const { id } = req.params
    const { tarefa, descricao, situacao} = req.body

    if(!tarefa || tarefa.length < 2){
        res.status(400).json({
            erro: "Campo tarefa inválido",
            mensagem: "O campo tarefa deve ter 2 ou mais caracteres"
        })
        return
    }

    if(!descricao){
        res.status(400).json({
            erro: "Campo descricao inválido",
            mensagem: "O campo descricao não pode ser nulo"
        })
        return
    }

    try {
        const tarefaSelecionada = await tabelaTarefa.findByPk(id)
        if(!tarefa){
            res.status(404).json({
                erro: "Tarefa não encontrada",
                mensagem: `Id ${id} não existe`
            })
            return
        }

        if(tarefa !== undefined){
            tarefaSelecionada.tarefa = tarefa
        }
        if(descricao !== undefined){
            tarefaSelecionada.descricao = descricao
        }
        if(situacao !== undefined){
            tarefaSelecionada.situacao = situacao
        }

        await tarefaSelecionada.save()
        res.status(200).json({
            mensagem: "Tarefa selecionada",
            tarefaSelecionada
        })
    } catch (error) {
        res.status(500).json({
            erro: "Erro interno ao atualizar uma tarefa"
        })
    }

})

app.delete("/tarefas/:id", async (req, res) => {
    const { id } = req.params

    if(!id){
        res.status(400).json({mensagem: "ID Parâmetro inválido"})
        return
    }

    try {
        const tarefaSelecionada = await tarefaTabela.findByPk(id)
        if(!tarefaSelecionada){
            res.status(404).json({
                erro: "Tarefa não encontrada",
                mensagem: `ID ${id} não existe no banco`
            })
            return
        }

        await tabelaTarefa.destroy({
            where: {id: tarefaSelecionada.id}
        })

        res.status(204).send()
    } catch (error) {
        res.status(500).json({
            erro: "Erro interno ao deletar uma tarefa"
        })
    }
})

//Middlewares
app.use((req, res) => {
    res.status(404).json({
        error: "Erro de Rota",
        mensagem: "Rota não encontrada"
    })
})

