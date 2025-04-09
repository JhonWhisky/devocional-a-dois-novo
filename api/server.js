const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const atividadesRouter = require("./routes/atividades");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
console.log("MONGO_URI:", process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI não está definido no arquivo .env");
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB Atlas"))
  .catch((err) => console.error("Erro ao conectar no MongoDB:", err));

app.use("/api/atividades", atividadesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));