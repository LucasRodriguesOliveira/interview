export interface ICacheService {
  store(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null | undefined>;
  remove(key: string): Promise<boolean>;
}
