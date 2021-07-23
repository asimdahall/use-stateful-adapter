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
