import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function NovaAtividadeForm({ onAdicionar, atividadeInicial }) {
  const [data, setData] = useState("");
  const [local, setLocal] = useState("");
  const [tema, setTema] = useState("");
  const [anotacoes, setAnotacoes] = useState("");

  useEffect(() => {
    if (atividadeInicial) {
      setData(atividadeInicial.data.split("T")[0]);
      setLocal(atividadeInicial.local);
      setTema(atividadeInicial.tema);
      setAnotacoes(atividadeInicial.anotacoes || "");
    }
  }, [atividadeInicial]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const atividade = {
      data: new Date(data), // Converte para Date
      local,
      tema,
      anotacoes,
      checkin: atividadeInicial ? atividadeInicial.checkin : false,
    };

    if (atividadeInicial) {
      atividade._id = atividadeInicial._id;
      onAdicionar(atividade);
    } else {
      try {
        const response = await axios.post("http://localhost:5000/api/atividades", atividade);
        onAdicionar(response.data);
      } catch (error) {
        console.error("Erro ao salvar atividade:", error);
        toast.error("Erro ao salvar atividade. Tente novamente.");
      }
    }

    setData("");
    setLocal("");
    setTema("");
    setAnotacoes("");
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <label>📅 Data:</label>
      <input type="date" value={data} onChange={(e) => setData(e.target.value)} required />
      
      <label>📍 Local:</label>
      <input type="text" value={local} onChange={(e) => setLocal(e.target.value)} required />

      <label>📖 Tema/Versículo:</label>
      <input type="text" value={tema} onChange={(e) => setTema(e.target.value)} required />

      <label>📝 Anotações:</label>
      <textarea value={anotacoes} onChange={(e) => setAnotacoes(e.target.value)} />

      <button type="submit">{atividadeInicial ? "Salvar Edição" : "Salvar Atividade"}</button>
    </form>
  );
}

export default NovaAtividadeForm;