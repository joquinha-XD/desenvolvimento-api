import { DataTypes } from "sequelize"
import conn from "./sequelize.js"

const tabelaTarefa = conn.define("Tarefa",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        tarefa: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100]
            }
        },
        descricao: {
            type: DataTypes.STRING
        },
        situacao: {
            type: DataTypes.ENUM('pendente', 'concluido'),
            defaultValue: 'pendente',
            allowNull: false
        }
    },
    {
        tableName: 'tarefas',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

export default tabelaTarefa;