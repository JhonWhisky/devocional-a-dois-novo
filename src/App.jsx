import React, { useState, useEffect } from "react";
import NovaAtividadeForm from "./components/NovaAtividadeForm";
import ListaAtividades from "./components/ListaAtividades";
import "./index.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "/api/atividades";

function App() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [atividades, setAtividades] = useState([]);
  const [atividadeEditando, setAtividadeEditando] = useState(null);

  const carregarAtividades = async () => {
    try {
      console.log("Carregando atividades...");
      const resposta = await axios.get(API_URL);
      console.log("Atividades recebidas:", resposta.data);

      // Filtra atividades com data válida e ordena
      const atividadesValidas = resposta.data.filter((atividade) => {
        const dataValida = !isNaN(new Date(atividade.data).getTime());
        if (!dataValida) {
          console.warn("Data inválida encontrada:", atividade.data);
        }
        return dataValida;
      });

      const atividadesOrdenadas = atividadesValidas.sort((a, b) => {
        return new Date(b.data) - new Date(a.data); // Mais recente primeiro
      });

      setAtividades(atividadesOrdenadas);
    } catch (erro) {
      console.error("Erro ao buscar atividades:", erro);
      toast.error("Erro ao carregar atividades. Verifique o servidor.");
      setAtividades([]);
    }
  };

  useEffect(() => {
    carregarAtividades();
  }, []);

  const adicionarAtividade = async (novaAtividade) => {
    try {
      const response = await axios.post(API_URL, novaAtividade);
      setAtividades([...atividades, response.data]);
      toast.success("Atividade adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar atividade:", error.message, error.response ? error.response.data : error);
      toast.error("Erro ao salvar atividade. Verifique o servidor.");
    }
  };

  const iniciarEdicao = (atividade) => {
    setAtividadeEditando(atividade);
    setMostrarFormulario(true);
  };

  const editarAtividade = async (atividadeEditada) => {
    try {
      const resposta = await axios.put(`${API_URL}/${atividadeEditada._id}`, atividadeEditada);
      const novasAtividades = atividades
        .map((a) => (a._id === atividadeEditada._id ? resposta.data : a))
        .filter((atividade) => !isNaN(new Date(atividade.data).getTime()))
        .sort((a, b) => new Date(b.data) - new Date(a.data));
      setAtividades(novasAtividades);
      setAtividadeEditando(null);
      setMostrarFormulario(false);
      toast.success("Atividade editada com sucesso!");
    } catch (erro) {
      console.error("Erro ao editar:", erro);
      toast.error("Erro ao editar atividade.");
    }
  };

  const removerAtividade = async (id) => {
    if (!id) {
      console.error("ID da atividade não definido!");
      toast.error("Erro: ID da atividade não encontrado.");
      return;
    }
    if (!window.confirm("Tem certeza que deseja remover esta atividade?")) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/${id}`);
      setAtividades(atividades.filter((a) => a._id !== id));
      toast.success("Atividade removida com sucesso!");
    } catch (erro) {
      console.error("Erro ao remover:", erro);
      toast.error("Erro ao remover atividade.");
    }
  };

  const fazerCheckin = async (id) => {
    try {
      const resposta = await axios.patch(`${API_URL}/${id}/checkin`);
      const novasAtividades = atividades
        .map((a) => (a._id === id ? resposta.data : a))
        .filter((atividade) => !isNaN(new Date(atividade.data).getTime()))
        .sort((a, b) => new Date(b.data) - new Date(a.data));
      setAtividades(novasAtividades);
      toast.success("Check-in realizado com sucesso!");
    } catch (erro) {
      console.error("Erro ao fazer check-in:", erro);
      toast.error("Erro ao fazer check-in.");
    }
  };

  console.log("Renderizando App, atividades:", atividades);

  return (
    <div className="container">
      <h1>Devocional a Dois</h1>
      <p className="versiculo">“Melhor é serem dois do que um...” – Eclesiastes 4:9</p>
      <button onClick={() => {
        setAtividadeEditando(null);
        setMostrarFormulario(!mostrarFormulario);
      }}>
        {mostrarFormulario ? "Cancelar" : "Nova Atividade"}
      </button>
      {mostrarFormulario && (
        <NovaAtividadeForm
          onAdicionar={atividadeEditando ? editarAtividade : adicionarAtividade}
          atividadeInicial={atividadeEditando}
        />
      )}
      <ListaAtividades
        atividades={atividades}
        onEditar={iniciarEdicao}
        onRemover={removerAtividade}
        onCheckin={fazerCheckin}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;