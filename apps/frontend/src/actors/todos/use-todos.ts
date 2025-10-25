import { useContext } from 'solid-js';

import { TodosContext, type TodosContextValue } from './todos-provider';

export const useTodos = (): TodosContextValue => {
  const context = useContext(TodosContext);

  if (context === undefined) {
    throw new Error('useTodos must be used within a TodosProvider');
  }

  return context;
};
