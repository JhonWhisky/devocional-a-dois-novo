const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado ao MongoDB Atlas"))
  .catch((err) => console.error("Erro ao conectar no MongoDB:", err));

const Atividade = require("./models/Atividade");

async function migrarDatas() {
  try {
    const atividades = await Atividade.find();
    for (const atividade of atividades) {
      if (typeof atividade.data === "string") {
        atividade.data = new Date(atividade.data);
        await atividade.save();
      }
    }
    console.log("Migração concluída!");
  } catch (error) {
    console.error("Erro na migração:", error);
  } finally {
    mongoose.connection.close();
  }
}

migrarDatas();