import { type Component, ErrorBoundary, type ParentProps } from 'solid-js';

import { ModalFallback } from './modal-fallback';

export const ErrorBoundaryModal: Component<ParentProps> = (props) => {
  return (
    <ErrorBoundary fallback={ModalFallback}>{props.children}</ErrorBoundary>
  );
};
