import { type Component, For, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import type { ToastGroupActorRef } from '@helstack-nx-template/actors';
import { useSelector } from '@helstack-nx-template/solid-xstate';

import { Toast } from './toast/toast';

type ToastGroupProps = {
  toastGroupActor: ToastGroupActorRef;
};

export const ToastGroup: Component<ToastGroupProps> = (props) => {
  const placement = useSelector(
    // eslint-disable-next-line solid/reactivity
    props.toastGroupActor,
    ({ context }) => context.placement
  );
  const toasts = useSelector(
    // eslint-disable-next-line solid/reactivity
    props.toastGroupActor,
    ({ context }) => context.toasts
  );

  const handlePointerEnter = () =>
    props.toastGroupActor.send({ type: 'POINTER_ENTER' });
  const handlePointerLeave = () =>
    props.toastGroupActor.send({ type: 'POINTER_LEAVE' });

  return (
    <Show when={toasts().length > 0}>
      <Portal>
        <div
          class="toast"
          classList={{
            'toast-bottom': placement().startsWith('bottom'),
            'toast-center':
              !placement().endsWith('end') && !placement().endsWith('start'),
            'toast-end': placement().endsWith('end'),
            'toast-start': placement().endsWith('start'),
            'toast-top': placement().startsWith('top'),
          }}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <For each={toasts()}>
            {(toastActor) => <Toast toastActor={toastActor} />}
          </For>
        </div>
      </Portal>
    </Show>
  );
};
