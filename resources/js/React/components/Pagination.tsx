import React from 'react';
// 1. Importe o nosso Hook e as Ações
import { useUserContext, ACTIONS } from '../providers/UserProvider';

function Pagination() {
  // 2. Consumimos o contexto para ler o estado e obter o dispatch
  const { state, dispatch } = useUserContext();

  // 3. Pegamos as informações de paginação do estado global
  const { currentPage, totalPages } = state.pagination;
  const isLoading = state.isLoading;

  // 4. Função para disparar a mudança de página
  const goToPage = (pageNumber: number) => {
    // Validação: Não faz nada se a página for inválida ou se já estiver carregando
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage || isLoading) {
      return;
    }

    // Dispara a ação para o reducer, informando a nova página
    dispatch({ type: ACTIONS.SET_PAGE, payload: pageNumber });
  };

  // 5. Renderização
  // Se não houver usuários (ou só 1 página), não mostra a paginação
  if (totalPages <= 1) {
    return null; // Não renderiza nada
  }

  return (
    <div className="pagination-controls">
      {/* Botão "Anterior" */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        // Desabilita o botão se estiver na primeira página ou carregando
        disabled={currentPage <= 1 || isLoading} 
      >
        Anterior
      </button>

      {/* Informação da página atual */}
      <span>
        Página {currentPage} de {totalPages}
      </span>

      {/* Botão "Próxima" */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        // Desabilita o botão se estiver na última página ou carregando
        disabled={currentPage >= totalPages || isLoading}
      >
        Próxima
      </button>
    </div>
  );
}

export default Pagination;