## core

```typescript
export declare type Dispatch<Action> = (action: Action) => undefined

export declare type ElmishEffect<Action> = Array<(dispatch: Dispatch<Action>) => void>

/** Starts ts-elmish runtime */
export declare const runProgram: <State, Action>({
  init,
  update,
  view
}: {
  readonly init: () => readonly [State, ElmishEffect<Action>]
  readonly update: (state: State, action: Action) => readonly [State, ElmishEffect<Action>]
  readonly view: (state: State, hasEffects: boolean) => void
}) => {
  readonly initialState: State
  readonly dispatch: Dispatch<Action>
  readonly stop: () => void
}
```

## basic-effects

```typescript
export declare type Effect<Action> = ElmishEffect<Action>

/** Create effect that maps one action to another */
declare function map<Action0, Action1>(
  func: (a: Action0) => Action1,
  effect: Effect<Action0>
): Effect<Action1>

/** Create effect from action */
declare function from<Action>(args: { readonly action: Action }): Effect<Action>

/** Create effect from any function */
declare function from<Action, Success = unknown>(args: {
  readonly func: () => Success
  readonly done?: (value: Success) => Action
  readonly error?: (error: unknown) => Action
}): Effect<Action>

/** Create effect from a function that returns a promise */
declare function from<Action, Success = unknown>(args: {
  readonly promise: () => Promise<Success>
  readonly then?: (value: Success) => Action
  readonly error?: (error: unknown) => Action
}): Effect<Action>

export declare const Effect: {
  readonly none: <Action>() => Effect<Action>
  readonly from: typeof from
  readonly map: typeof map
  readonly batch: <Action_1>(...actions: readonly Effect<Action_1>[]) => Effect<Action_1>
}
```

## railway-effects

```typescript
export declare type Effect<Action> = ElmishEffect<Action>

/** Create effect from action */
declare function from<Action>(args: { readonly action: Action }): Effect<Action>

/** Create effect from a function that returns Result<Success, Failure> */
declare function from<
  Action,
  Success,
  Failure,
  ResultLike extends Result<Success, Failure> = Result<Success, Failure>
>(args: {
  readonly result: () => ResultLike
  readonly success?: (value: SuccessOf<ResultLike>) => Action
  readonly failure: FailureOf<ResultLike> extends never
    ? never
    : (error: FailureOf<ResultLike>) => Action
}): Effect<Action>

/** Create effect from a function that returns Result<Success, never> */
declare function from<
  Action,
  Success,
  ResultLike extends Result<Success, never> = Result<Success, never>
>(args: {
  readonly result: () => ResultLike
  readonly success?: (value: SuccessOf<ResultLike>) => Action
}): Effect<Action>

/** Create effect from a function that returns AsyncResult<Success, Failure> */
declare function from<
  Action,
  Success,
  Failure,
  ResultLike extends AsyncResult<Success, Failure> = AsyncResult<Success, Failure>
>(args: {
  readonly asyncResult: () => ResultLike
  readonly success?: (value: SuccessOf<ResultLike>) => Action
  readonly failure: FailureOf<ResultLike> extends never
    ? never
    : (error: FailureOf<ResultLike>) => Action
}): Effect<Action>

/** Create effect from a function that returns AsyncResult<Success, never> */
declare function from<
  Action,
  Success,
  ResultLike extends AsyncResult<Success, never> = AsyncResult<Success, never>
>(args: {
  readonly asyncResult: () => ResultLike
  readonly success?: (value: SuccessOf<ResultLike>) => Action
}): Effect<Action>

export declare const Effect: {
  readonly from: typeof from
  readonly none: <Action>() => Effect<Action>
  readonly map: <Action0, Action1>(
    func: (a: Action0) => Action1,
    effect: Effect<Action0>
  ) => Effect<Action1>
  readonly batch: <Action_1>(...actions: readonly Effect<Action_1>[]) => Effect<Action_1>
}
```

## react

```typescript
declare type AssertDispatch<T> = T extends {
  readonly dispatch: unknown
}
  ? never
  : Readonly<T>

/** Props for elmish-driven react component */
export declare type ElmishProps<State, Action> = AssertDispatch<State> & {
  readonly dispatch: Dispatch<Action>
}

/**
 * Creates elmish-driven react component.
 * When component props are updated the elmish runtime is restated.
 *
 * @param init Function that returns initial state & effect
 * @param update Function that returns next state & effect for each dispatched action
 * @param View React component
 * @returns Root elmish react component
 */
export declare const createElmishComponent: <
  Props extends Record<string, unknown>,
  State extends Record<string, unknown>,
  Action
>(
  init: (props: Props) => readonly [AssertDispatch<State>, Effect<Action>],
  update: (
    state: AssertDispatch<State>,
    action: Action
  ) => readonly [AssertDispatch<State>, Effect<Action>],
  View: React.ComponentType<ElmishProps<State, Action>>
) => React.FunctionComponent<Props>
```

## mithril

```typescript
declare type AssertDispatch<T> = T extends {
  readonly dispatch: unknown
}
  ? never
  : Readonly<T>

/** Attrs for elmish-driven mithril component */
export declare type ElmishAttrs<State, Action> = AssertDispatch<State> & {
  readonly dispatch: Dispatch<Action>
}

/**
 * Creates elmish-driven mithril component.
 * When component attrs are updated the elmish runtime is restated.
 *
 * @param init Function that returns initial state & effect
 * @param update Function that returns next state & effect for each dispatched action
 * @param View Mithril component
 * @returns Root elmish mithril component
 */
export declare const createElmishComponent: <
  Attrs extends Record<string, unknown>,
  State extends Record<string, unknown>,
  Action
>(
  init: (attrs: Attrs) => readonly [AssertDispatch<State>, Effect<Action>],
  update: (
    state: AssertDispatch<State>,
    action: Action
  ) => readonly [AssertDispatch<State>, Effect<Action>],
  View: m.Component<ElmishAttrs<State, Action>, {}>
) => m.Component<Attrs, import('mithril-hooks').State>
```
