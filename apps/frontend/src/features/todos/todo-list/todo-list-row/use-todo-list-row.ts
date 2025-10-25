import { format, formatDistanceToNow, isToday } from 'date-fns';
import { createMemo } from 'solid-js';

import type { TodoActorRef } from '../../../../actors';

import { useTodoActor } from './use-todo-actor';

export const useTodoListRow = (todoActor: TodoActorRef) => {
  const {
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
  } = useTodoActor(todoActor);

  const formattedCreatedAt = createMemo(() => {
    const date = createdAt();

    if (date === undefined) {
      return undefined;
    }

    if (isToday(date)) {
      return formatDistanceToNow(date, { addSuffix: true });
    }

    return format(date, 'kk:mm:ss');
  });

  const handleCompleteChange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) return;

    change({ completed: event.target.checked });
  };

  const handleDescriptionChange = (event: Event) => {
    if (!(event.target instanceof HTMLTextAreaElement)) return;

    change({ description: event.target.value });
  };

  const handleTitleChange = (event: Event) => {
    if (!(event.target instanceof HTMLInputElement)) return;

    change({ title: event.target.value });
  };

  return {
    completed,
    createTodoErrors,
    description,
    formattedCreatedAt,
    handleCompleteChange,
    handleDescriptionChange,
    handleTitleChange,
    isCreating,
    isDisabled,
    isDraft,
    isRemoving,
    isUpdating,
    remove,
    save,
    title,
    updateTodoErrors,
  };
};
