import { AnimatePresence, motion } from 'framer-motion';
import { useTodo } from './useTodo';

import { Button, Drawer, Select } from 'antd';
import { useState } from 'react';
import Input from 'antd/es/input/Input';

function App() {
  const { getTodos, editTodo, addTodo, deleteTodo } = useTodo();
  const allTodos = [...getTodos()].reverse();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [newTodo, setNewTodo] = useState<{
    name: string;
    description: string;
    status: 'new' | 'onProcces' | 'onFinished' | 'deleted';
  }>({
    name: '',
    description: '',
    status: 'new'
  });
  const [scrolled, setScrolled] = useState<string>('');
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-screen px-4"
      >
        <motion.h1
          animate={{
            backgroundPosition: [
              '0% 0%',
              '20% 0%',
              '40% 0%',
              '60% 0%',
              '80% 0%',
              '100% 0%',

              // Yuqoridan pastga tushish
              '100% 20%',
              '100% 40%',
              '100% 60%',
              '100% 80%',
              '100% 100%',

              // O'ngdan chapga qaytish
              '80% 100%',
              '60% 100%',
              '40% 100%',
              '20% 100%',
              '0% 100%',

              // Pastdan yuqoriga qaytish
              '0% 80%',
              '0% 60%',
              '0% 40%',
              '0% 20%',
              '0% 0%' // Boshlang‘ich nuqtaga qaytish
            ]
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 15,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop'
          }}
          style={{
            background:
              'linear-gradient(90deg, #ff8a00, #da1b60, #0FB5BA, #3B82F6)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}
          className="flex items-center justify-center text-[1.2rem] font-bold h-[30px] w-full  "
        >
          <h1 className="text-center">Todo list with Capacitor</h1>
        </motion.h1>
        <motion.div
          className="h-[calc(100vh-100px)] w-full overflow-y-auto  snap snap-y snap-mandatory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {allTodos.length > 0 ? (
            <AnimatePresence presenceAffectsLayout mode="sync">
              {allTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  className="flex w-[90vw] overflow-x-auto "
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.25 }}
                  drag="x"
                  layout
                  layoutId={todo.id}
                  layoutScroll
                  dragConstraints={{ left: 0, right: 0 }}
                  onDrag={(_, info) => {
                    if (info.point.x < 1) {
                      setScrolled(todo.id);
                    }
                    if (info.point.x > -1) {
                      setScrolled('');
                    }
                  }}
                >
                  <div className=" w-[95vw]  my-2 bg-white shadow-md rounded-xl border border-zinc-100  p-4 flex flex-col gap-4">
                    {/* <h1 className="text-lg font-semibold">{todo.name}</h1> */}
                    <Input
                      variant="filled"
                      className="text-3xl font-semibold"
                      value={todo.name}
                      onChange={(e) =>
                        editTodo(todo.id, { name: e.target.value })
                      }
                    />
                    <Input
                      value={todo.description}
                      onChange={(e) =>
                        editTodo(todo.id, { description: e.target.value })
                      }
                    />
                    <Select
                      value={todo.status}
                      options={[
                        { label: 'Yangi', value: 'new' },
                        { label: 'Jarayonda', value: 'onProcces' },
                        { label: 'Tugallangan', value: 'onFinished' },
                        { label: 'O`chirilgan', value: 'deleted' }
                      ]}
                      onChange={(value) => editTodo(todo.id, { status: value })}
                    />
                  </div>
                  {scrolled === todo.id ? (
                    <div className="py-2 w-[100px]">
                      <div
                        className="h-1/2 w-full bg-red-500 flex items-center justify-center text-white cursor-pointer"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        delete
                      </div>
                      <div
                        className="h-1/2 w-full bg-blue-500 flex items-center justify-center text-white cursor-pointer"
                        onClick={() => setScrolled('')}
                      >
                        close
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <motion.h1
              className="text-center text-xl font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No todos
            </motion.h1>
          )}
        </motion.div>
        <div className="h-[50px]  w-full">
          <Button
            type="primary"
            className="w-full"
            onClick={() => setDrawerVisible(true)}
          >
            add todo
          </Button>
        </div>
      </motion.div>
      <Drawer
        open={drawerVisible}
        height={'90vh'}
        onClose={() => setDrawerVisible(false)}
        placement="bottom"
        closable={false}
      >
        <div className="">
          <Button type="primary" onClick={() => setDrawerVisible(false)}>
            close
          </Button>
          <div className=" my-2 bg-white shadow-md rounded-xl border border-zinc-100  p-4 flex flex-col gap-4">
            <Input
              placeholder="Todo name"
              value={newTodo.name}
              onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
            />
            <Input
              placeholder="Todo description"
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
            />
            <Select
              value={newTodo.status}
              options={[
                { label: 'Yangi', value: 'new' },
                { label: 'Jarayonda', value: 'onProcces' },
                { label: 'Tugallangan', value: 'onFinished' },
                { label: 'O`chirilgan', value: 'deleted' }
              ]}
              onChange={(value) => setNewTodo({ ...newTodo, status: value })}
            />
            <Button
              type="primary"
              onClick={() => {
                addTodo(newTodo);
                setDrawerVisible(false);
                setNewTodo({ name: '', description: '', status: 'new' });
              }}
            >
              add todo
            </Button>
          </div>
        </div>
      </Drawer>
    </AnimatePresence>
  );
}

export default App;
