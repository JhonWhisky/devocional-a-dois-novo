const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado ao MongoDB Atlas");
    mongoose.connection.close();
  })
  .catch((err) => console.error("Erro ao conectar no MongoDB:", err));