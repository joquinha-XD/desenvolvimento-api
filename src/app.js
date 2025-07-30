import express from "express"
import cors from "cors"
import conn from "./sequelize.js"
//Tabelas
import tarefaTabela from "./tarefasTabela.js"
import setorTabela from "./setorTabela.js"


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
//****************ROTAS DE TAREFAS **********/
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
        const tarefaCadastrada = await tarefaTabela.create(novaTarefa)
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
        const tarefa = await tarefaTabela.findByPk(id)
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
        const tarefaSelecionada = await tarefaTabela.findByPk(id)
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

        await tarefaTabela.destroy({
            where: {id: tarefaSelecionada.id}
        })

        res.status(204).send()
    } catch (error) {
        res.status(500).json({
            erro: "Erro interno ao deletar uma tarefa"
        })
    }
})

//****************ROTAS DE SETOR **********/
app.get("/setores", async (req, res) => {
    try {
        const setores = await setorTabela.findAll()
        if(setores.length === 0){
            res.status(404).json({mensagem: "Não há nenhum setor na base de dados"})
            return
        }

        res.status(200).json(setores)
    } catch (error) {
        res.status(500).json({
            erro: "Erro interno ao listar os setores"
        })
    }
})

app.post("/setores", async (req, res) => {
    const { nome } = req.body

    if(!nome){
        res.status(400).json({
            erro: "Campo nome inválido", 
            mensagem: "O campo de nome não pode ser nulo"
        })
        return
    }

    const novoSetor = {
        nome
    }

    try {
        const setorCriado = await setorTabela.create(novoSetor)
        res.status(201).json({
            mensagem: "Setor criado com sucesso",
            setorCriado
        })
    } catch (error) {
        res.status(500).json({
            erro: "Erro interno ao cadastrar um setor"
        })
    }
})

app.get("/setor/:id", async (req, res) => {
    const { id } = req.params

    if(!id){
        res.status(400).json({
            erro: "Parâmetro id inválido",
            mensagem: "O parâmetro ID é necessário para buscar um único setor"
        })
        return
    }

    try {
        const setor = await setorTabela.findByPk(id)

        if(!setor || setor.length === 0){
            res.status(404).json({mensagem: "Setor com esse id não encontrado"})
            return
        }

        res.status(200).json(setor)
    } catch (error) {
        res.status(500).json({
            erro: "Erro interno ao listar um setor"
        })
    }
})

app.put("/setor/:id", async (req, res) => {
    const { id } = req.params
    const { nome } = req.body

    if(!id){
        res.status(400).json({
            erro: "Campo ID inválido",
            mensagem: "O parâmetro ID é necessário para atualizar um setor"
        })
        return
    }

    if(!nome){
        res.status(400).json({
            erro: "Campo nome inválido",
            mensagem: "O campo nome não pode ser nulo"
        })
        return
    }

    try {
        const setorBuscado = await setorTabela.findByPk(id)

        if(nome !== undefined){
            setorBuscado.nome = nome
        }

        await setorBuscado.save()

        res.status(200).json({
            mensagem: "Setor atualizado com sucesso",
            setorBuscado
        })
    } catch (error) {
        res.status(500).json({
            erro: "Erro interno ao listar um setor"
        })
    }
})

app.delete("/setor/:id", async (req, res) => {
    const { id } = req.params

    if(!id){
        res.status(400).json({
            erro: "Campo ID inválido",
            mensagem: "O parâmetro ID é necessário para deletar um setor"
        })
        return
    }

    try {
        const setorSelecionado = await findByPk(id)

        if(setorSelecionado.length === 0){
            res.status(404).json({mensagem: "Setor com esse ID não encontrado"})
            return
        }

        await setorTabela.destroy({
            where: {id: setorSelecionado.id}
        })

        res.status(200).send()
    } catch (error) {
        res.status(500).json({
            erro: "Erro interno ao deletar um setor"
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

