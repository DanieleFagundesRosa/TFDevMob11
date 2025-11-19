import React, { createContext, useReducer, useContext, ReactNode } from 'react';
// 1. IMPORTAMOS OS SEUS TIPOS REAIS
import { ListApi, UserModel } from '@app/js/app.types';

// --- 1. Definição das Tipagens (Atualizadas) ---

// Não precisamos mais da interface 'User', pois já temos 'UserModel'
// Não precisamos mais da 'PaginationInfo', pois 'ListApi' já deve conter isso

// O formato do nosso estado global (agora usa os seus tipos)
interface State {
  isLoading: boolean;
  users: UserModel[]; // <-- MUDOU
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number; // Renomeei 'total' para 'totalUsers' por clareza
  };
}

// O formato das ações que o reducer pode receber
type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  // O payload agora é a resposta completa da API
  | { type: 'SET_USERS_DATA'; payload: ListApi<UserModel> } // <-- MUDOU
  | { type: 'SET_PAGE'; payload: number };

// O formato do valor que o Contexto vai fornecer
interface UserContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

// --- 2. Definição dos Tipos de Ação (Constantes) ---
export const ACTIONS = {
  SET_LOADING: 'SET_LOADING' as const,
  SET_USERS_DATA: 'SET_USERS_DATA' as const,
  SET_PAGE: 'SET_PAGE' as const,
};

// --- 3. O Estado Inicial ---
const initialState: State = {
  isLoading: true,
  users: [], // Continua começando vazio
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  },
};

// --- 4. O Reducer (O Gerente do Estado) ---
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    // ATUALIZADO: Agora ele sabe como lidar com a resposta 'ListApi'
    case ACTIONS.SET_USERS_DATA:
      // Assumindo que a API retorna estes campos:
      const { rows, currentPage, totalPages, total } = action.payload;

      return {
        ...state,
        isLoading: false,
        users: rows, // A lista de usuários
        pagination: {
          currentPage: currentPage,
          totalPages: totalPages,
          totalUsers: total, // Supondo que 'total' é o número total de usuários
        },
      };

    case ACTIONS.SET_PAGE:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          currentPage: action.payload,
        },
        isLoading: true,
      };

    default:
      throw new Error(`Ação desconhecida`);
  }
}

// --- 5. Criação do Contexto ---
const UserContext = createContext<UserContextValue | undefined>(undefined);

// --- 6. O Componente Provider (O Fornecedor) ---
type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    state,
    dispatch,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// --- 7. Hook Customizado (O Atalho) ---
export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext deve ser usado dentro de um UserProvider');
  }
  return context;
}