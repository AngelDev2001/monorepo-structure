import { Component } from "react";

type StateUpdate<S> = Partial<S> | ((prevState: S) => Partial<S>);

export const promisedSetState = <S extends Record<string, any>>(
  newState: StateUpdate<S>,
  context: Component<any, S>
): Promise<void> =>
  new Promise((resolve) => {
    context.setState(newState as any, () => resolve());
  });

export const timeoutPromise = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
