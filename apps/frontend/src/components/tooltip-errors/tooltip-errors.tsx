import {
  type Component,
  type ComponentProps,
  For,
  Show,
  splitProps,
} from 'solid-js';

type TooltipErrorsProps = ComponentProps<'div'> & {
  errors: string[] | undefined;
};

export const TooltipErrors: Component<TooltipErrorsProps> = (props) => {
  const [localProps, restProps] = splitProps(props, [
    'children',
    'classList',
    'errors',
  ]);

  const hasErrors = () =>
    localProps.errors !== undefined && localProps.errors.length > 0;

  return (
    <div
      classList={{
        'tooltip tooltip-error': hasErrors(),
        ...localProps.classList,
      }}
      {...restProps}
    >
      <Show when={hasErrors()}>
        <div class="tooltip-content pl-5">
          <ul class="list-disc">
            <For each={localProps.errors}>
              {(errorMessage) => <li class="text-start">{errorMessage}</li>}
            </For>
          </ul>
        </div>
      </Show>

      {localProps.children}
    </div>
  );
};
