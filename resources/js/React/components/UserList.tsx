import React, { useEffect } from 'react';
import axios from 'axios'; // 1. Importamos o axios

// 2. Importamos os tipos reais e o nosso Contexto/Ações
import { ListApi, UserModel } from '@app/js/app.types';
import { useUserContext, ACTIONS } from '../providers/UserProvider';

// --- O Componente React ---
function UserList() {
  // 3. Consumimos o contexto (igual a antes)
  const { state, dispatch } = useUserContext();
  const { currentPage } = state.pagination; // Pegamos a página atual

  // 4. Efeito para buscar dados (AGORA COM API REAL)
  useEffect(() => {
    // A função assíncrona que busca os dados
    const fetchUsers = async () => {
      // Não disparamos o SET_LOADING aqui, pois o reducer
      // já faz isso automaticamente quando trocamos de página (SET_PAGE)
      // Mas disparamos na primeira carga (currentPage === 1 && state.isLoading)
      
      // Se não for a primeira carga, mas estivermos a mudar de página,
      // o reducer do SET_PAGE já colocou isLoading = true.

      try {
        // 5. Usamos o axios com a página do estado global!
        const response = await axios.get<ListApi<UserModel>>(
          `http://localhost:8080/api/users?page=${currentPage}`
        );

        // 6. Disparamos a ação com os dados REAIS da API
        dispatch({
          type: ACTIONS.SET_USERS_DATA,
          payload: response.data, // response.data é o objeto ListApi<UserModel>
        });

      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        // Em caso de erro, paramos o "loading"
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };

    // Só executa a busca se for necessário
    // (isLoading é true por defeito na primeira carga, ou quando SET_PAGE é chamado)
    if (state.isLoading) {
      fetchUsers();
    }
    
    // O useEffect re-executa se `currentPage` mudar (vindo do Pagination)
    // ou se o dispatch mudar (raro).
  }, [currentPage, state.isLoading, dispatch]);

  // 7. A renderização é EXATAMENTE A MESMA
  
  if (state.isLoading) {
    return <div>Carregando usuários...</div>;
  }
  
  if (state.users.length === 0) {
    return <div>Nenhum usuário encontrado.</div>;
  }

  // Agora renderiza os dados reais da sua API
  return (
    <ul className="user-list">
      {state.users.map(user => (
        // Usamos o 'id' do seu UserModel
        <li key={user.id}> 
          <strong>{user.name}</strong>
          {/* Pode adicionar mais campos se quiser, ex: user.email */}
        </li>
      ))}
    </ul>
  );
}

export default UserList;