//Instruções para conectar com o banco de dados
import { Sequelize } from "sequelize"

// const conn = new Sequelize("tarefas3D", "root", "123456789", {
//     host: "localhost",
//     dialect: "mysql",
//     port: 3306
// })

const conn = new Sequelize({
  dialect: 'sqlite',
  storage: './dev.sqlite'
});

//Testar conexão
// try {
//     await conn.authenticate()
//     console.log("Banco de dados mysql conectado com sucesso")
// } catch (error) {
//     console.log("Erro ao conectar: ", error)
// }

export default conn;

