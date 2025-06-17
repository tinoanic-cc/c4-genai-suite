export function withStore<T>(config: T, store?: boolean): T {
  return {
    ...config,
    store: store ?? true,
  };
}
