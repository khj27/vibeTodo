import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'todoApp.todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTodos(JSON.parse(saved));
      }
    } catch {
      setTodos([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.done).length,
    [todos]
  );

  const addTodo = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setTodos((prev) => [
      { id: Date.now(), text: trimmed, done: false },
      ...prev,
    ]);
    setText('');
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-sm sm:p-8">
        <header className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">오늘의 목표</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">할 일 목록</h1>
          <p className="mt-2 text-slate-500">
            추가, 완료 체크, 삭제가 가능하며 새로고침해도 내용이 유지됩니다.
          </p>
        </header>

        <section className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="todo-input">
              할 일 입력
            </label>
            <input
              id="todo-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="할 일을 입력하세요"
              className="min-h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
            <button
              type="button"
              onClick={addTodo}
              className="min-h-[52px] rounded-2xl bg-sky-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
            >
              추가
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2 rounded-3xl bg-slate-50 p-4 text-slate-700 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span className="font-medium">총 {todos.length}개</span>
            <span className="text-sm text-slate-500">
              완료 {completedCount}개
            </span>
          </div>

          {todos.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              아직 등록된 할 일이 없습니다.
            </div>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={todo.done}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span
                      className={`text-base font-medium transition ${
                        todo.done ? 'text-slate-400 line-through' : 'text-slate-900'
                      }`}
                    >
                      {todo.text}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeTodo(todo.id)}
                    className="self-start rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 sm:self-center"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
