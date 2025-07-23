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
            erro: "Erro interno ao listar tarefas"
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
            erro: "Erro interno ao listar tarefas"
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
            erro: "Erro interno ao listar tarefas"
        })
    }

})

app.delete("/tarefas/:id", async (req, res) => {})

//Middlewares
app.use((req, res) => {
    res.status(404).json({
        error: "Erro de Rota",
        mensagem: "Rota não encontrada"
    })
})

