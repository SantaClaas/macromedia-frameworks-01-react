import { useEffect, useRef, useState } from 'react';
import { Todo } from './Todo';

const OPEN = 'open';
const COMPLETED = 'completed';

function loadTodos(key, set) {
  // Load Todos from localStorage once
  const json = localStorage.getItem(key);

  if (!json) {
    return;
  }

  /**
   * @type {Array<{ id: string, name: string, completed: boolean }> | undefined}
   */
  let todos;
  try {
    todos = JSON.parse(json);
  } catch (error) {
    console.error(error);
    return;
  }

  // Small validation
  // Assume they're valid todos
  if (!Array.isArray(todos)) {
    console.error('Invalid todos data. Expected an array');
    return;
  }

  set(todos);
}

function saveTodos(key, todos) {
  const json = JSON.stringify(todos);
  localStorage.setItem(key, json);
}

function Todos() {
  const [open, setOpen] = useState([]);
  const [completed, setCompeleted] = useState([]);
  //TODO: Add a loading indicator ui
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    loadTodos(OPEN, setOpen);
    loadTodos(COMPLETED, setCompeleted);
    setIsLoading(false);
  }, []);

  let input = useRef();
  function sumbitHandler(event) {
    event.preventDefault();

    // Guard against reference error
    if (!input.current) {
      return;
    }

    const name = input.current.value;

    // Blocks empty strings too
    if (!name) {
      return;
    }
    // I am too lazy to check available ids
    const id = crypto.randomUUID();

    const newOpens = [...open, { id, name, completed: false }];
    setOpen(newOpens);

    // Update localStorage
    saveTodos(OPEN, newOpens);
  }

  function setToCompleted(todo) {
    // Return the handler for the event
    return (event) => {
      // This isn't very efficient but it's fine for now
      todo.completed = event.target.checked;
      // Remove from open todos
      const newOpen = open.filter((other) => {
        console.debug({
          otherId: other.id,
          todoId: todo.id,
          result: other.id === todo.id,
        });

        return other.id !== todo.id;
      });
      console.debug('open before/after', {
        before: open.length,
        after: newOpen.length,
      });
      const newCompleted = [...completed, todo];
      console.debug(newOpen.length, newCompleted.length);
      setOpen(newOpen);
      setCompeleted(newCompleted);

      // Update localStorage
      saveTodos(OPEN, newOpen);
      saveTodos(COMPLETED, newCompleted);
    };
  }

  function setToOpen(todo) {
    // Return the handler for the event
    return (event) => {
      // This isn't very efficient but it's fine for now
      todo.completed = event.target.checked;
      // Remove from completed todos
      const newCompleted = completed.filter((other) => other.id !== todo.id);
      console.debug('completed before/after', {
        before: completed.length,
        after: newCompleted.length,
      });
      const newOpen = [...open, todo];
      setCompeleted(newCompleted);
      setOpen(newOpen);

      // Update localStorage
      saveTodos(COMPLETED, newCompleted);
      saveTodos(OPEN, newOpen);
    };
  }

  return (
    <>
      <div className="grid gap-5">
        <h2 className="text-2xl font-semibold text-red">ToDo Component</h2>

        {isLoading || (
          <>
            <section className="grid gap-3">
              <h3 className="text-xl">Open ToDos</h3>

              {open.map((todo) => (
                <Todo
                  key={todo.id}
                  id={todo.id}
                  name={todo.name}
                  completed={todo.completed}
                  onChange={setToCompleted(todo)}
                />
              ))}
            </section>
            <section className="grid gap-3">
              <h3 className="text-xl ">Completed ToDos</h3>
              {completed.map((todo) => (
                <Todo
                  key={todo.id}
                  id={todo.id}
                  name={todo.name}
                  completed={todo.completed}
                  onChange={setToOpen(todo)}
                />
              ))}
            </section>
          </>
        )}
      </div>

      <form onSubmit={sumbitHandler}>
        <label htmlFor="new">New Todo</label>
        <input id="new" type="text" required ref={input} className="border" />
        <button type="submit" className="border">
          Add
        </button>
      </form>
    </>
  );
}

export { Todos };
