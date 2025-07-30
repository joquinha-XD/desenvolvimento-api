import { DataTypes } from "sequelize";
import conn from "./sequelize.js"

const setorTabela = conn.define(
    "setores",
    {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: true,
        tableName: "setores",
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

export default setorTabela;