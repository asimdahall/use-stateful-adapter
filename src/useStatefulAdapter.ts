import React from 'react';
import { createEntityAdapter, IdSelector, EntityState } from '@reduxjs/toolkit';
import { EntityReturnType } from './types/EntityReturnType';

type PropType<T> = {
  selectId: IdSelector<T>;
  name: string;
};

type Getters<T> = {
  selectById: (id: string | number) => T | undefined;
};

const actions = [
  'addOne',
  'addMany',
  'upsertMany',
  'upsertOne',
  'updateMany',
  'updateOne',
  'removeAll',
  'removeMany',
  'removeOne',
  'setAll',
  'setMany',
  'setOne',
];

function useStatefulAdapter<T>(
  options: PropType<T>
): [Array<T>, EntityReturnType<T>, Getters<T>] {
  const stateAdapter = createEntityAdapter<T>({
    selectId: options.selectId,
  });
  const [data, setData] = React.useState<EntityState<T>>(
    stateAdapter.getInitialState()
  );

  const adapterProxy = new Proxy(stateAdapter, {
    get(target, name) {
      // @ts-expect-error
      const toRevokeFunction = target[name];
      if (
        typeof toRevokeFunction === 'function' &&
        actions.includes(name as string)
      ) {
        return new Proxy(toRevokeFunction, {
          apply(target, thisArg, argList) {
            const result = target.call(thisArg, data, ...argList);
            setData(result);
            return result;
          },
        });
      }
      return toRevokeFunction;
    },
  });

  const selector = stateAdapter.getSelectors();

  const allData = selector.selectAll(data);
  const selectById = (id: string | number) => selector.selectById(data, id);

  return [
    allData,
    adapterProxy as unknown as EntityReturnType<T>,
    {
      selectById,
    },
  ];
}

export default useStatefulAdapter;
