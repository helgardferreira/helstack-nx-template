import { type Page } from '@playwright/test';
import { type AnyEventObject } from 'xstate';

export async function start(page: Page) {
  await page.goto('/');

  return page;
}

// Assert that the system under test (`sys`) is in the correct state
export async function assertState(_sys: Page, _state: { value: string }) {
  throw new Error('Not implemented');
}

export async function executeEvent(_sys: Page, _event: AnyEventObject) {
  throw new Error('Not implemented');
}
