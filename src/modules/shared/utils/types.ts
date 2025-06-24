export type Nullish<T> = { [K in keyof T]: T[K] | null | undefined };
