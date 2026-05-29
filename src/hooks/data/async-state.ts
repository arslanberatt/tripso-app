/**
 * Tüm data hook'larının ortak dönüş şekli. react-query'ye (`useQuery`) geçince
 * aynı `{ data, isLoading, error }` arayüzü korunur — ekranlarda değişiklik gerekmez.
 */
export interface AsyncState<T> {
  data: T;
  isLoading: boolean;
  error: Error | null;
}

/** Mock veriyi senkron "yüklenmiş" durumda sarmalayan yardımcı. */
export function loaded<T>(data: T): AsyncState<T> {
  return { data, isLoading: false, error: null };
}
