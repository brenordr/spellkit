import { Actions, ActionsCreator, actions } from "../actions";
import { Store, store } from "../store";

export function create<T>(init: T): Store<T>;
export function create<T>(init: () => T): Store<T>;
export function create<T>(init: () => Promise<T>): Store<T>;
export function create<T, A extends { [key: string]: (...args: any[]) => T }>(
  init: T | (() => T) | (() => Promise<T>),
  actionsCreator: ActionsCreator<T, A>
): Store<T> & Actions<T, A>;

/**
 * Creates a store along with associated actions.
 *
 * @template T The type of values that the store holds.
 * @template A The type of actions that can be performed on the store.
 *
 * @param {T | (() => T) | (() => Promise<T>)} init - Initial value for the store, or a function that produces the initial value, possibly asynchronously.
 * @param {ActionsCreator<T, A>} [actionsCreator] - A function that creates actions for the store. If not provided, an empty actions object is used.
 *
 * @returns {Store<T> & Actions<T, A>} An object that combines the store and actions into a single object.
 *
 * @example
 * // Creating a store with initial value
 * const myStore = create(0);
 *
 * @example
 * // Creating a store with initial value and actions
 * const myStore = create(0, (unwrap) => ({
 *   increment: () => unwrap() + 1,
 *   decrement: () => unwrap() - 1,
 * }));
 */
export function create<
  T,
  A extends { [key: string]: (...args: any[]) => T } = {}
>(
  init: T | (() => T) | (() => Promise<T>),
  actionsCreator?: ActionsCreator<T, A>
): Store<T> & Actions<T, A> {
  const innerStore = store(init) as Store<T>; // Now this should be typed correctly as Store<T>
  const innerActions = actionsCreator
    ? actions(innerStore, actionsCreator)
    : ({} as Actions<T, A>);

  return { ...innerStore, ...innerActions };
}
