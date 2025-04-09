import React from "react";

function ListaAtividades({ atividades, onEditar, onRemover, onCheckin }) {
  const formatarData = (data) => {
    const date = new Date(data);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="lista">
      {atividades.length === 0 ? (
        <p className="mensagem-vazia">💤 Nenhuma atividade registrada ainda.</p>
      ) : (
        atividades.map((atividade) => (
          <div key={atividade._id} className="atividade">
            <p><strong>Data:</strong> {formatarData(atividade.data)}</p>
            <p><strong>Local:</strong> {atividade.local}</p>
            <p><strong>Tema:</strong> {atividade.tema}</p>
            {atividade.anotacoes && <p><strong>Anotações:</strong> {atividade.anotacoes}</p>}
            <p><strong>Status:</strong> {atividade.checkin ? "✔️ Check-in feito" : "❌ Sem check-in"}</p>

            {!atividade.checkin && (
              <button onClick={() => onCheckin(atividade._id)}>Fazer Check-in</button>
            )}
            <button onClick={() => onEditar(atividade)}>Editar</button>
            <button onClick={() => onRemover(atividade._id)}>Remover</button>
          </div>
        ))
      )}
    </div>
  );
}

export default ListaAtividades;