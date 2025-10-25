import { XIcon } from 'lucide-solid';
import { type Component, Show } from 'solid-js';

import type { ToastActorRef } from '@helstack-nx-template/actors';
import { useSelector } from '@helstack-nx-template/solid-xstate';

type ToastProps = {
  toastActor: ToastActorRef;
};

export const Toast: Component<ToastProps> = (props) => {
  const closable = useSelector(
    // eslint-disable-next-line solid/reactivity
    props.toastActor,
    ({ context }) => context.closable
  );

  const description = useSelector(
    // eslint-disable-next-line solid/reactivity
    props.toastActor,
    ({ context }) => context.description
  );

  // eslint-disable-next-line solid/reactivity
  const isVisible = useSelector(props.toastActor, (snapshot) =>
    snapshot.hasTag('visible')
  );

  const progress = useSelector(
    // eslint-disable-next-line solid/reactivity
    props.toastActor,
    ({ context }) => context.progress
  );
  const remainingDuration = () => (1 - progress()) * 100;

  // eslint-disable-next-line solid/reactivity
  const title = useSelector(props.toastActor, ({ context }) => context.title);

  // eslint-disable-next-line solid/reactivity
  const type = useSelector(props.toastActor, ({ context }) => context.type);

  const dismiss = () => props.toastActor.send({ type: 'DISMISS' });

  return (
    <Show when={isVisible()}>
      <div
        class="alert relative w-fit max-w-sm"
        classList={{
          'alert-error': type() === 'error',
          'alert-info': type() === 'info' || type() === 'loading',
          'alert-success': type() === 'success',
          'alert-warning': type() === 'warning',
        }}
        role="alert"
      >
        <div>
          <h3 class="font-bold">{title()}</h3>
          <div class="text-xs">{description()}</div>
        </div>

        <Show when={closable()}>
          <button
            class="btn btn-circle btn-ghost btn-xs btn-primary absolute top-1 right-1"
            onClick={dismiss}
          >
            <Show
              when={type() !== 'loading'}
              fallback={
                <>
                  <span class="loading loading-spinner loading-lg absolute" />
                  <XIcon class="size-4" />
                </>
              }
            >
              <div
                class="radial-progress shrink-0"
                style={{
                  '--size': '1.625rem',
                  '--thickness': '0.2rem',
                  '--value': remainingDuration(),
                }}
                aria-valuenow={remainingDuration()}
                role="progressbar"
              >
                <XIcon class="size-4" />
              </div>
            </Show>
          </button>
        </Show>
      </div>
    </Show>
  );
};
