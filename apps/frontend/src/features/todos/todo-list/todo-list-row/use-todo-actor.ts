import { createMemo } from 'solid-js';

import type { UpdateTodo } from '@helstack-nx-template/schemas';
import { useMatches, useSelector } from '@helstack-nx-template/solid-xstate';

import type { TodoActorRef } from '../../../../actors';
import { useZodFieldErrors } from '../../../../utils';

export const useTodoActor = (todoActor: TodoActorRef) => {
  const isCreating = useMatches(todoActor, { draft: 'creating' });
  const isDraft = useMatches(todoActor, 'draft');
  const isRemoving = useMatches(todoActor, { active: 'removing' });
  const isUpdating = useMatches(todoActor, { active: 'updating' });

  const isDisabled = createMemo(
    () => isCreating() || isRemoving() || isUpdating()
  );

  const completed = useSelector(
    todoActor,
    (snapshot) => snapshot.context.completed
  );
  const createdAt = useSelector(
    todoActor,
    (snapshot) => snapshot.context.createdAt
  );
  const description = useSelector(
    todoActor,
    (snapshot) => snapshot.context.description ?? ''
  );
  const title = useSelector(todoActor, (snapshot) => snapshot.context.title);
  const updatedAt = useSelector(
    todoActor,
    (snapshot) => snapshot.context.updatedAt
  );

  const createTodoErrors = useZodFieldErrors(
    useSelector(todoActor, ({ context }) => context.createTodoError)
  );
  const updateTodoErrors = useZodFieldErrors(
    useSelector(todoActor, ({ context }) => context.updateTodoError)
  );

  const change = (todo: UpdateTodo) =>
    todoActor.send({ type: 'CHANGE', ...todo });
  const remove = () => todoActor.send({ type: 'REMOVE' });
  const save = () => todoActor.send({ type: 'SAVE' });

  return {
    change,
    completed,
    createTodoErrors,
    createdAt,
    description,
    isCreating,
    isDisabled,
    isDraft,
    isRemoving,
    isUpdating,
    remove,
    save,
    title,
    updateTodoErrors,
    updatedAt,
  };
};
