import useLocalStorage from './useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

export const useTodo = () => {
  type Todo = {
    id: string;
    name: string;
    description: string;
    status: 'new' | 'onProcces' | 'onFinished' | 'deleted';
  };
  const [todos, setTodos] = useLocalStorage<Todo[]>('TODOS_KEY', []);

  const getTodos = () => todos;

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setTodos([...todos, { ...newTodo, id: uuidv4() }]);
  };

  const editTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, ...updates };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return { getTodos, addTodo, editTodo, deleteTodo };
};
