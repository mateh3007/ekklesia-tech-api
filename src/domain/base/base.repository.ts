export abstract class BaseRepository<
  TEntity,
  TCreate = TEntity,
  TUpdate = TCreate,
> {
  abstract create(data: TCreate): Promise<TEntity>;
  abstract findAll(): Promise<TEntity[]>;
  abstract findById(id: string): Promise<TEntity | null>;
  abstract update(id: string, data: TUpdate): Promise<TEntity>;
  abstract delete(id: string): Promise<void>;
}
