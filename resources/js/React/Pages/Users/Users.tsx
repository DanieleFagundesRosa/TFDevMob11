import React from 'react';

// 1. Importe o nosso "cérebro" (o Provider)
import { UserProvider } from '../../providers/UserProvider';

// 2. Importe os componentes visuais
import UserList from '../../components/UserList';
import Pagination from '../../components/Pagination';

// Este é o componente que o seu app.tsx carrega
function Users() {
  return (
    // 3. O UserProvider "abraça" os componentes
    // para que partilhem o mesmo estado.
    <UserProvider>
      <div className="users-page-container">
        
        <h2>Painel de Usuários</h2>

        {/* 4. O UserList agora lê do estado global
            e busca os dados da API automaticamente */}
        <UserList />

        {/* 5. O Pagination agora lê e atualiza
            o estado global */}
        <Pagination />

      </div>
    </UserProvider>
  );
}

// Exporte como default para o app.tsx o encontrar
export default Users;