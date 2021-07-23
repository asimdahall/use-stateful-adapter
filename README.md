# use-stateful-adapter

useStatefulAdapter is the hook over [createEntityAdapter](https://redux-toolkit.js.org/api/createEntityAdapter) method provided by `@redux/toolkit` that helps to maintain CRUD operation of the state.

`useStatefulAdapter` provides an API to manipulate the state without worrying about handling all the states.

Reduces boilerplate for creating reducers that manage state.
Provides performant CRUD operations for managing stateful entity collections.

## usage

```typescript
const [state, handler, { selectById }] = useStatefulAdapter<{
  id: string;
  text: string;
}>({
  name: 'my-adapter',
  selectId: (item) => item.id,
});
```

### Installation

```bash
npm i use-stateful-adapter
```

or

```bash
yarn add use-stateful-adapter
```

The initialisation

```typescript
import * as React from 'react';
import useStatefulAdapter from 'use-stateful-adapter';

export default function App() {
  const [state, handler, { selectById }] = useStatefulAdapter<{
    id: string;
    text: string;
  }>({
    name: 'my-adapter',
    selectId: (item) => item.id,
  });
}
```

`useStatefulAdapter` returns [
    `currentState`,
    `handler`,
    `selectors`
]

## `handler` methods
- `addOne`: Add one entity to the collection
- `addMany`: Add multiple entities to the collection
- `addAll`: Replace current collection with provided collection
- `removeOne`: Remove one entity from the collection
- `removeMany`: Remove multiple entities from the collection, by id or by predicate
- `removeAll`: Clear entity collection
- `updateOne`: Update one entity in the collection
- `updateMany`: Update multiple entities in the collection
- `upsertOne`: Add or Update one entity in the collection
- `upsertMany`: Add or Update multiple entities in the collection
- `map`: Update multiple entities in the collection by defining a map function, similar to Array.map

## `selector` methods
- `selectById(id:string):void`: Select item by ID

## example todo application

```tsx
import * as React from 'react';
import useStatefulAdapter from '../src';

export default function App() {
  const [state, handler, { selectById }] = useStatefulAdapter<{
    id: string;
    text: string;
  }>({
    name: 'my-adapter',
    selectId: (item) => item.id,
  });
  const [currentId, setCurrentId] = React.useState<string | null>(null);

  const [todo, setTodo] = React.useState('');

  const handleSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      if (currentId) {
        handler.updateOne({
          id: currentId,
          changes: {
            text: todo,
          },
        });
        setCurrentId(null);
      } else {
        handler.addOne({
          id: String(Math.random()),
          text: todo,
        });
      }
      setTodo('');
    },
    [handler, todo]
  );

  const currentValue = React.useMemo(() => {
    return selectById(currentId!);
  }, [currentId]);

  React.useEffect(() => {
    if (!currentValue) return;
    setTodo(currentValue.text);
  }, [currentValue]);

  return (
    <form onSubmit={handleSubmit} className="App">
      <input
        key={currentId}
        name="todo"
        value={todo}
        onChange={(e) => setTodo(e.currentTarget.value)}
        placeholder="Add Todo"
        type="text"
      />
      <button type="button" onClick={handler.removeAll}>
        Remove All
      </button>
      {currentId && <div>Currently editing {currentId}</div>}
      {state.map((item) => (
        <React.Fragment key={item.id}>
          <li>{item.text}</li>
          <button type="button" onClick={() => handler.removeOne(item.id)}>
            Delete
          </button>
          <button type="button" onClick={() => setCurrentId(item.id)}>
            Edit
          </button>
        </React.Fragment>
      ))}
    </form>
  );
}
```

with ❤️ from [Asim](https://github.com/asimdahall)
