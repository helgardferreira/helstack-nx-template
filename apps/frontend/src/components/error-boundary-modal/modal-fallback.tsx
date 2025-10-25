import { type JSX, onMount } from 'solid-js';

export const ModalFallback = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  reset: () => void
): JSX.Element => {
  let ref!: HTMLDialogElement | undefined;

  let errorMessage = error.message || 'Unknown error';
  let errorName = error.name || 'Unknown error';
  let errorStack = error.stack;

  onMount(() => {
    console.error(error);
    if (ref) ref.showModal();
  });

  return (
    <dialog class="modal" ref={ref}>
      <div class="modal-box">
        <h3 class="text-lg font-bold">{errorName}</h3>

        <p class="py-4">Something went wrong:</p>

        <div class="code max-h-100 w-full overflow-y-auto">
          <div class="overflow-hidden pr-5 pl-[2ch]">
            <code class="text-wrap">{errorMessage}</code>
          </div>

          <br />

          <pre class="text-error" data-prefix=">">
            <code>{errorStack}</code>
          </pre>
        </div>

        <div class="modal-action">
          <button onClick={reset} class="btn">
            Try Again
          </button>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
