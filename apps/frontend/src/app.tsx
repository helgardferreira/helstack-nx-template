import { type Component } from 'solid-js';

import { ErrorBoundaryModal } from './components';
import { Todos } from './features/todos/todos';

const App: Component = () => {
  return (
    <ErrorBoundaryModal>
      <Todos />
    </ErrorBoundaryModal>
  );
};

export default App;
