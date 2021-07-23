import React from 'react';
import { createEntityAdapter, IdSelector, EntityState } from '@reduxjs/toolkit';
import { EntityReturnType } from './types/EntityReturnType';

type PropType<T> = {
  selectId: IdSelector<T>;
  name: string;
};

function useStatefulAdapter<T>(
  options: PropType<T>
): [Array<T>, EntityReturnType<T>] {
  const stateAdapter = createEntityAdapter<T>({
    selectId: options.selectId,
  });
  const [data, setData] = React.useState<EntityState<T>>(
    stateAdapter.getInitialState()
  );

  const adapterProxy = new Proxy(stateAdapter, {
    get(target, name) {
      // @ts-ignore
      const toRevokeFunction = target[name];
      if (typeof toRevokeFunction === 'function') {
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

  return [allData, adapterProxy as unknown as EntityReturnType<T>];
}

export default useStatefulAdapter;
