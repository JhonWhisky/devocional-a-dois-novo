const express = require("express");
const router = express.Router();
const Atividade = require("../models/Atividade");
const mongoose = require("mongoose");

// GET - Listar todas atividades (ordenadas por data, mais recente primeiro)
router.get("/", async (req, res) => {
  try {
    const atividades = await Atividade.find().sort({ data: -1 });
    res.json(atividades);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar atividades", error });
  }
});

// POST - Criar nova atividade
router.post("/", async (req, res) => {
  const nova = new Atividade(req.body);
  const salva = await nova.save();
  res.json(salva);
});

// PUT - Editar atividade
router.put("/:id", async (req, res) => {
  const atualizada = await Atividade.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(atualizada);
});

// DELETE - Remover atividade
router.delete("/:id", async (req, res) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }
    const atividade = await Atividade.findByIdAndDelete(req.params.id);
    if (!atividade) {
      return res.status(404).json({ mensagem: "Atividade não encontrada" });
    }
    res.json({ mensagem: "Atividade removida" });
  } catch (error) {
    console.error("Erro ao remover atividade:", error);
    res.status(500).json({ mensagem: "Erro ao remover atividade", error });
  }
});

// PATCH - Atualizar apenas o check-in
router.patch("/:id/checkin", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }
    const atividade = await Atividade.findById(req.params.id);
    if (!atividade) {
      return res.status(404).json({ mensagem: "Atividade não encontrada" });
    }
    atividade.checkin = true;
    const atualizada = await atividade.save();
    res.json(atualizada);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao fazer check-in", error });
  }
});

module.exports = router;