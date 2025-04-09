const mongoose = require("mongoose");

const AtividadeSchema = new mongoose.Schema({
  data: { type: Date, required: true }, // Mude para Date
  local: String,
  tema: String,
  anotacoes: String,
  checkin: Boolean,
});

module.exports = mongoose.model("Atividade", AtividadeSchema);