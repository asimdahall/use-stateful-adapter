import { PayloadAction } from "@reduxjs/toolkit/src/createAction";
import { EntityId, Update } from "@reduxjs/toolkit/src/entities/models";

export interface EntityReturnType<T> {
  addOne(entity: T): void;
  addOne(action: PayloadAction<T>): void;
  addMany(entities: readonly T[] | Record<EntityId, T>): void;
  addMany(entities: PayloadAction<readonly T[] | Record<EntityId, T>>): void;
  setOne(entity: T): void;
  setOne(action: PayloadAction<T>): void;
  setMany(entities: readonly T[] | Record<EntityId, T>): void;
  setMany(entities: PayloadAction<readonly T[] | Record<EntityId, T>>): void;
  setAll(entities: readonly T[] | Record<EntityId, T>): void;
  setAll(entities: PayloadAction<readonly T[] | Record<EntityId, T>>): void;
  removeOne(key: EntityId): void;
  removeOne(key: PayloadAction<EntityId>): void;
  removeMany(keys: readonly EntityId[]): void;
  removeMany(keys: PayloadAction<readonly EntityId[]>): void;
  removeAll(): void;
  updateOne(update: Update<T>): void;
  updateOne(update: PayloadAction<Update<T>>): void;
  updateMany(updates: ReadonlyArray<Update<T>>): void;
  updateMany(updates: PayloadAction<ReadonlyArray<Update<T>>>): void;
  upsertOne(entity: T): void;
  upsertOne(entity: PayloadAction<T>): void;
  upsertMany(entities: readonly T[] | Record<EntityId, T>): void;
  upsertMany(entities: PayloadAction<readonly T[] | Record<EntityId, T>>): void;
}
