export interface ITokenStorageRepository {
  save(userId: number, token: string, ttl: number): Promise<void>;
  get(userId: number): Promise<string | null>;
  delete(userId: number): Promise<void>;
}