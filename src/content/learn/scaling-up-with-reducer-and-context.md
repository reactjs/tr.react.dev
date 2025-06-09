---
title: 'Reducer ve Context ile Ölçeklendirme'
---

<Intro>

Reducer'lar bir bileşenin state güncelleme mantığını bir araya getirmenizi sağlar. Context, bilgileri diğer bileşenlere derinlemesine iletmeye olanak tanır. Reducer'ları ve context'i bir araya getirerek karmaşık bir ekranın state'ini yönetebilirsiniz.

</Intro>

<YouWillLearn>

* Bir reducer context ile nasıl birleştirilir
* State ve dispatch'i props üzerinden iletmekten nasıl kaçınılır
* Context ve State mantığını ayrı bir dosyada nasıl tutabiliriz

</YouWillLearn>

## Reducer'ı context ile birleştirmek {/*combining-a-reducer-with-context*/}

[Reducerlara giriş](/learn/extracting-state-logic-into-a-reducer) bölümünden bu örnekte, state bir reducer tarafından yönetilmektedir. Reducer fonksiyonu tüm state güncelleme mantığını içerir ve bu dosyanın en alt kısmında belirtilir:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>İstanbul'da bir gün</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen eylem: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Tarihi Yarımada Yürüyüşü.', done: true },
  { id: 1, text: 'Galata Kulesi Ziyareti.', done: false },
  { id: 2, text: 'Türk kahvesi iç.', done: false }
];
```

```js src/AddTask.js
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Görev Ekle"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Ekle</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Kaydet
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Düzenle
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Sil
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

Reducer, olay yöneticilerini kısa ve öz tutmaya yardımcı olur. Ancak, uygulamanız büyüdükçe başka bir zorlukla karşılaşabilirsiniz. **Şu anda, `tasks` state'i ve `dispatch` fonksiyonu yalnızca üst düzey `TaskApp` bileşeninde mevcuttur.** Diğer bileşenlerin görev listesini okumasına veya değiştirmesine izin vermek için, mevcut state'i ve onu değiştiren olay yöneticilerini açıkça [prop olarak](/learn/passing-props-to-a-component) aktarmanız gerekir.

Örneğin, `TaskApp` görevlerin listesini ve olay yöneticilerini `TaskList`'e aktarır:

```js
<TaskList
  tasks={tasks}
  onChangeTask={handleChangeTask}
  onDeleteTask={handleDeleteTask}
/>
```

Ayrıca `TaskList` olay yöneticilerini `Task`'e aktarır:

```js
<Task
  task={task}
  onChange={onChangeTask}
  onDelete={onDeleteTask}
/>
```

Bunun gibi küçük bir örnekte bu yapı iyi çalışır, ancak ortada onlarca veya yüzlerce bileşen varsa, tüm state ve fonksiyonları aktarmak oldukça sinir bozucu olabilir!

Bu nedenle, bunları proplar aracılığıyla aktarmaya alternatif olarak, hem `tasks` state'ini hem de `dispatch` fonksiyonunu [context'e](/learn/passing-data-deeply-with-context) yerleştirmek isteyebilirsiniz. **Bu şekilde, hiyerarşide `TaskApp` altındaki herhangi bir bileşen görevleri okuyabilir ve tekrarlanan "prop drilling" olmadan eylemleri gönderebilir.**  

Burada bir reducer'ı context ile nasıl birleştirebileceğiniz anlatılmıştır:


1. Context'i **Oluştur**.
2. Context'in içine state ve dispatch'i **Yerleştir**.
3. Hiyerarşi'nin herhangi bir yerinde context'i **Kullan**.

### Adım 1: Context'i oluşturun. {/*step-1-create-the-context*/}

`useReducer` hook'u mevcut `tasks` ve bunları güncellemenizi sağlayan `dispatch` fonksiyonunu döndürür:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

Bunları hiyerarşide aşağı aktarmak için iki ayrı context [oluşturacaksınız](/learn/passing-data-deeply-with-context#step-2-use-the-context):

- `TasksContext` geçerli görev listesini sağlar.
- `TasksDispatchContext` bileşenlerin eylemleri göndermesini sağlayan fonksiyonu sağlar.

Bunları ayrı bir dosyadan dışa aktarın, böylece daha sonra diğer dosyalardan içe aktarabilirsiniz:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>İstanbul'da bir gün</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen eylem: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Tarihi Yarımada Yürüyüşü.', done: true },
  { id: 1, text: 'Galata Kulesi Ziyareti.', done: false },
  { id: 2, text: 'Türk kahvesi iç.', done: false }
];
```

```js src/TasksContext.js active
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Görev Ekle."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Ekle</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Kaydet
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Düzenle
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Sil
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

Burada, her iki context de varsayılan değer olarak `null` değerini veriyorsunuz. Gerçek değerler `TaskApp` bileşeni tarafından sağlanacaktır.

### Adım 2: Context’in içine state ve dispatch’i yerleştir {/*step-2-put-state-and-dispatch-into-context*/}

Artık her iki context'i de `TaskApp` bileşeninize aktarabilirsiniz. `useReducer()` tarafından döndürülen `tasks` ve `dispatch` bileşenlerini alın ve aşağıdaki hiyerarşinin tamamına [sağlayın](/learn/passing-data-deeply-with-context#step-3-provide-the-context):

```js {4,7-8}
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  // ...
  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        ...
      </TasksDispatchContext>
    </TasksContext>
  );
}
```

Şimdilik, bilgileri hem prop'lar aracılığıyla hem de context içinde iletebilirsiniz:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
<<<<<<< HEAD
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        <h1>İstanbul'da bir gün</h1>
=======
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        <h1>Day off in Kyoto</h1>
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91
        <AddTask
          onAddTask={handleAddTask}
        />
        <TaskList
          tasks={tasks}
          onChangeTask={handleChangeTask}
          onDeleteTask={handleDeleteTask}
        />
      </TasksDispatchContext>
    </TasksContext>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen eylem: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Tarihi Yarımada Yürüyüşü.', done: true },
  { id: 1, text: 'Galata Kulesi Ziyareti.', done: false },
  { id: 2, text: 'Türk kahvesi iç.', done: false }
];
```

```js src/TasksContext.js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Görev Ekle"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Ekle</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Kaydet
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Düzenle
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Sil
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

Bir sonraki adımda, prop geçişini kaldıracaksınız.

### Adım 3: Hiyerarşi’nin herhangi bir yerinde context’i kullan {/*step-3-use-context-anywhere-in-the-tree*/}

Artık görevlerin listesini veya olay yöneticilerini hiyerarşi boyunca iletmek zorunda değilsiniz:

```js {4-5}
<<<<<<< HEAD
<TasksContext.Provider value={tasks}>
  <TasksDispatchContext.Provider value={dispatch}>
    <h1>İstanbul'da bir gün</h1>
=======
<TasksContext value={tasks}>
  <TasksDispatchContext value={dispatch}>
    <h1>Day off in Kyoto</h1>
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91
    <AddTask />
    <TaskList />
  </TasksDispatchContext>
</TasksContext>
```

Bunun yerine, görev listesine ihtiyaç duyan herhangi bir bileşen bunu `TaskContext`'ten okuyabilir:

```js {2}
export default function TaskList() {
  const tasks = useContext(TasksContext);
  // ...
```

Görev listesini güncellemek için, herhangi bir bileşen `dispatch` fonksiyonunu context'den okuyabilir ve çağırabilir:

```js {3,9-13}
export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  // ...
  return (
    // ...
    <button onClick={() => {
      setText('');
      dispatch({
        type: 'added',
        id: nextId++,
        text: text,
      });
    }}>Ekle</button>
    // ...
```

**`TaskApp` bileşeni herhangi bir olay yöneticisini aşağıya iletmemekte ve `TaskList` bileşeni de `Task` bileşenine herhangi bir olay yöneticisini iletmemektedir.** Her bileşen ihtiyacı olan context'i okur:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
<<<<<<< HEAD
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        <h1>İstanbul'da bir gün</h1>
=======
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        <h1>Day off in Kyoto</h1>
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91
        <AddTask />
        <TaskList />
      </TasksDispatchContext>
    </TasksContext>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen eylem: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Tarihi Yarımada Yürüyüşü.', done: true },
  { id: 1, text: 'Galata Kulesi Ziyareti.', done: false },
  { id: 2, text: 'Türk kahvesi iç.', done: false }
];
```

```js src/TasksContext.js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  return (
    <>
      <input
        placeholder="Görev Ekle"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Ekle</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js active
import { useState, useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(TasksDispatchContext);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Kaydet
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Düzenle
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Sil
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

**State hala `useReducer` ile yönetilen en üst düzey `TaskApp` bileşeninde "barınıyor".** Ancak `tasks` ve `dispatch` artık bu contextleri içe aktarıp kullanarak hiyerarşi'de aşağıdaki her bileşen tarafından kullanılabilir.

## Tüm bağlantıları tek bir dosyaya taşıma {/*moving-all-wiring-into-a-single-file*/}

Bunu yapmak zorunda değilsiniz, ancak hem reducer hem de context tek bir dosyaya taşıyarak bileşenleri daha da sadeleştirebilirsiniz. Şu anda, `TasksContext.js` sadece iki context bildirimi içermektedir:

```js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

Bu dosya kalabalıklaşmak üzere! Reducer'ı aynı dosyaya taşıyacaksınız. Ardından aynı dosyada yeni bir `TasksProvider` bileşeni tanımlayacaksınız. Bu bileşen tüm parçaları birbirine bağlayacak:

1. Reducer'la state'i yönetecek.
2. Aşağıdaki bileşenlere her iki context'i de sağlayacaktır.
3. [`children`'ı bir prop olarak](/learn/passing-props-to-a-component#passing-jsx-as-children) alacak, böylece ona JSX'i iletebilirsiniz.

```js
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}
```

**Bu, `TaskApp` bileşeninizden tüm karmaşıklığı ve bağlantıyı kaldırır:**

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>İstanbul'da bir gün</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useReducer } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen eylem: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Tarihi Yarımada Yürüyüşü.', done: true },
  { id: 1, text: 'Galata Kulesi Ziyareti.', done: false },
  { id: 2, text: 'Türk kahvesi iç.', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  return (
    <>
      <input
        placeholder="Görev Ekle"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Ekle</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(TasksDispatchContext);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Kaydet
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Düzenle
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Sil
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

Ayrıca context'i _kullanan_ fonksiyonları `TasksContext.js` dosyasından dışa aktarabilirsiniz:

```js
export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
```

Bir bileşenin context'i okuması gerektiğinde, bunu bu fonksiyonlar aracılığıyla yapabilir:

```js
const tasks = useTasks();
const dispatch = useTasksDispatch();
```

Bu, davranışı herhangi bir şekilde değiştirmez, ancak daha sonra bu contextleri daha da bölmenize veya bu fonksiyonlara bazı mantıklar eklemenize olanak tanır. **Artık tüm context ve reducer bağlantıları `TasksContext.js` içindedir. Bu, bileşenleri temiz ve düzensiz olmayan, verileri nereden aldıklarından ziyade neyi görüntülediklerine odaklanmış tutar.**

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>İstanbul'da bir gün</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen eylem: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Tarihi Yarımada Yürüyüşü.', done: true },
  { id: 1, text: 'Galata Kulesi Ziyareti.', done: false },
  { id: 2, text: 'Türk kahvesi iç.', done: false }
];
```

```js src/AddTask.js
import { useState } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Görev Ekle"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Ekle</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js active
import { useState } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Kaydet
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Düzenle
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Sil
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

`TasksProvider`'ı görevleri nasıl işleyeceğini bilen bir ekran parçası olarak düşünebilirsiniz, `useTasks` onları okumanın bir yolu olarak, ve `useTasksDispatch` onları hiyerarşideki herhangi bir bileşenden güncellemenin bir yolu olarak düşünülebilir.

<Note>
`useTasks` ve `useTasksDispatch` gibi fonksiyonlara *[Özel Hook'lar](/learn/reusing-logic-with-custom-hooks)* denir. Bir fonksiyonunuzun adı `use` ile başlıyorsa fonksiyonunuz bir özel hook olarak kabul edilir. Bu, içinde `useContext` gibi diğer hook`ları kullanmanızı sağlar.
</Note>

Uygulamanız büyüdükçe, bunun gibi birçok context-reducer çiftine sahip olabilirsiniz. Bu, uygulamanızı ölçeklendirmenin ve hiyerarşinin derinliklerindeki verilere erişmek istediğinizde çok fazla iş yapmadan [state'i yükseltmenin](/learn/sharing-state-between-components) güçlü bir yoludur.

<Recap>

- Herhangi bir bileşenin üzerindeki state'i okumasına ve güncellemesine izin vermek için reducer'ı context ile birleştirebilirsiniz.
- Aşağıdakiler bileşenlere state ve dispatch fonksiyonu sağlamak için:
  1. İki context oluşturun (state ve dispatch fonksiyonları için).
  2. Reducer'ı kullanan bileşende her iki context'i de sağlayın.
  3. Bunları okuması gereken bileşenlerin contextlerinden birini kullanın.
- Bileşenleri daha da temizleyebilirsiniz; tüm bağlantıları tek bir dosyaya taşıyarak.
  - Context sağlayan `TasksProvider` gibi bir bileşeni dışa aktarabilirsiniz.
  - Ayrıca okumak için `useTasks` ve `useTasksDispatch` gibi özel hook'ları da dışa aktarabilirsiniz.
- Uygulamanızda bunun gibi birçok context-reducer çiftine sahip olabilirsiniz.

</Recap>
