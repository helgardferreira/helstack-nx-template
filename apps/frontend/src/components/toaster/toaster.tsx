import { type Component, For } from 'solid-js';

import type { ToasterStore } from '@helstack-nx-template/actors';
import { useSelector } from '@helstack-nx-template/solid-xstate';

import { ToastGroup } from './toast-group/toast-group';

type ToasterProps = {
  toaster: ToasterStore;
};

export const Toaster: Component<ToasterProps> = (props) => {
  const toastGroups = useSelector(
    // eslint-disable-next-line solid/reactivity
    props.toaster.toastsActor,
    ({ context }) => context.toastGroups
  );

  return (
    <For each={Object.values(toastGroups())}>
      {(toastGroupActor) => <ToastGroup toastGroupActor={toastGroupActor} />}
    </For>
  );
};
