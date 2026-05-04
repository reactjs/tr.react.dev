---
title: useReducer
---

<Intro>

`useReducer`, bileşeninize bir [reducer](/learn/extracting-state-logic-into-a-reducer) eklemenizi sağlayan bir React Hook'udur.

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## Başvuru Dokümanı {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

Bileşeninizin state'ini bir [reducer](/learn/extracting-state-logic-into-a-reducer) ile yönetmek için bileşeninizin üst düzeyinde `useReducer` çağrısı yapın.

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

<<<<<<< HEAD
* `reducer`: State'in nasıl güncelleneceğini belirleyen reducer fonksiyonudur. Saf hâlde (pure) olmalı, state'i ve işlemi(action) argüman olarak almalı ve bir sonraki state'i döndürmelidir. State ve işlem herhangi bir tür olabilir.
* `initialArg`: Başlangıç state'inin hesaplandığı değerdir. Herhangi bir türden bir değer olabilir. Başlangıç state'inin nasıl hesaplandığı, sonraki `init` argümanına bağlıdır.
* **isteğe bağlı** `init`: Başlangıç state'ini döndürmesi gereken başlatıcı fonksiyondur. Belirtilmezse, başlangıç state'i `initialArg` olarak ayarlanır. Aksi takdirde, başlangıç state'i `init(initialArg)` çağrısının sonucuna ayarlanır.
=======
* `reducer`: The reducer function that specifies how the state gets updated. It must be pure, should take the state and action as arguments, and should return the next state. State and action can be of any types.
* `initialArg`: The value from which the initial state is calculated. It can be a value of any type. How the initial state is calculated from it depends on the next `init` argument.
* **optional** `init`: The initializer function that should return the initial state. If it's not specified, the initial state is set to `initialArg`. Otherwise, the initial state is set to the result of calling `init(initialArg)`.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

#### Dönüş değerleri {/*returns*/}

`useReducer`, tam olarak iki değer içeren bir dizi döndürür:

1. Mevcut state. İlk render sırasında, `init(initialArg)` veya `initialArg` (`init` olmadığında) olarak ayarlanır.
2. State'i farklı bir değere güncellemenizi ve yeniden render tetiklemenizi sağlayan [`dispatch`](#dispatch) fonksiyonu.

#### Dikkat edilmesi gerekenler {/*caveats*/}

* `useReducer`, bir Hook olduğundan, yalnızca bileşeninizin **üst düzeyinde** veya kendi Hook'larınızda çağırabilirsiniz. Döngüler veya koşullar içinde çağıramazsınız. Buna ihtiyacınız varsa, yeni bir bileşen oluşturun ve state'i taşıyın.
* The `dispatch` function has a stable identity, so you will often see it omitted from Effect dependencies, but including it will not cause the Effect to fire. If the linter lets you omit a dependency without errors, it is safe to do. [Learn more about removing Effect dependencies.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* Strict Mode'da, React, [tesadüfi karışıklıkları bulmanıza yardımcı olmak için](#my-reducer-or-initializer-function-runs-twice) reducer ve başlatıcı fonksiyonunuzu **iki kez çağırır**. Bu, yalnızca geliştirme amaçlı bir davranıştır ve canlı ortamı etkilemez. Reducer ve başlatıcı fonksiyonlarınız saf halde ise (olmaları gerektiği gibi), bu mantığınızı etkilememelidir. Çağrılardan birinin sonucu yoksayılır.

---

### `dispatch` fonksiyonu {/*dispatch*/}

`useReducer` tarafından döndürülen `dispatch` fonksiyonu, state'i farklı bir değere güncellemenizi ve yeniden render tetiklemenizi sağlar. `dispatch` işlevine tek argüman olarak eylemi iletmelisiniz:

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React, `dispatch` fonksiyonuna ilettiğiniz eylemi ve geçerli `state` ile çağırdığınız `reducer` işlevinin sonucunu kullanarak, bir sonraki state'i ayarlayacaktır.

#### Parametreler {/*dispatch-parameters*/}

* `action`: Kullanıcı tarafından gerçekleştirilen eylem. Herhangi bir türde bir değer olabilir. Genellikle bir eylem, kendisini tanımlayan bir `type` özelliği ve isteğe bağlı olarak ek bilgi içeren diğer özellikler olan bir nesne olarak temsil edilir.

#### Dönüş değerleri {/*dispatch-returns*/}

`dispatch` fonksiyonları bir dönüş değeri içermez.

#### Dikkat edilmesi gereken noktalar {/*setstate-caveats*/}

* `dispatch` fonksiyonu, sadece **bir sonraki** render işlemi için state değişkenini günceller. Eğer `dispatch` fonksiyonunu çağırdıktan sonra state değişkenini okursanız, [çağrı öncesinde ekranda olan eski değeri](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value) elde edersiniz.

* Eğer sağladığınız yeni değer, bir [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırması ile belirlendiği gibi, mevcut `state` ile aynı ise React elemanı ve alt elemanlarının yeniden render edilmesini **atlar.** Bu bir optimizasyonudur. React, sonucu yok saymadan önce yine de bileşeninizi çağırması gerekebilir ancak bu kodunuzu etkilememelidir.

* React, state güncellemelerini **toplu halde işler**. Tüm olay yöneticileri çalıştırıldıktan ve kendi `set` fonksiyonlarını çağırdıktan **sonra ekranı günceller.** Bu, tek bir olay sırasında birden fazla yeniden render işlemini önler. React'ı ekranı güncellemeye zorlamanız gereken nadir durumlarda, örneğin DOM'a erişmek için, [`flushSync`](/reference/react-dom/flushSync) kullanabilirsiniz.

---

## Kullanım {/*usage*/}

### Bir bileşene reducer eklemek {/*adding-a-reducer-to-a-component*/}

Bileşeninizin state'ini [reducer](/learn/extracting-state-logic-into-a-reducer) ile yönetmek için, `useReducer`'ı bileşeninizin en üst düzeyinde çağırın.

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer`, tam olarak iki öğe içeren bir dizi döndürür:

1. Bu state değişkeninin <CodeStep step={1}>mevcut state'i</CodeStep>, başlangıçta sağladığınız <CodeStep step={3}>başlangıç state'i</CodeStep>.
2. Etkileşime yanıt olarak değiştirmenize olanak tanıyan <CodeStep step={2}>`dispatch` fonksiyonu</CodeStep>.

Ekrandaki içeriği güncellemek için, kullanıcının yaptığı işlemi temsil eden bir nesne ile <CodeStep step={2}>`dispatch`</CodeStep> fonksiyonunu çağırın. Bu nesne bir *eylem* olarak adlandırılır:

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React, <CodeStep step={4}>reducer fonksiyonunuzu</CodeStep> çağırırken, mevcut state'i ve eylemi aktaracaktır. Reducer fonksiyonunuz, sonraki state'i hesaplayacak ve döndürecektir. React, bu sonraki state'i saklayacak, bileşeninizi bu state ile yeniden render edecek ve kullanıcı arayüzünü güncelleyecektir.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Bilinmeyen eylem.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Yaşı artır
      </button>
      <p>Merhaba! {state.age} yaşındasın.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer`, [`useState`](/reference/react/useState) ile çok benzerdir, ancak state güncelleme mantığını olay yöneticilerinden bileşeninizin dışındaki tek bir bir fonksiyona taşımanıza olanak tanır. [`useState` ve `useReducer` arasında seçim yapma hakkında daha fazla bilgi edinin.](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

---

### Reducer fonksiyonu yazmak {/*writing-the-reducer-function*/}

Reducer fonksiyonu şöyle tanımlanır:

```js
function reducer(state, action) {
  // ...
}
```

Ardından, sonraki state'i hesaplayacak ve döndürecek olan kodu yazmanız gerekiyor. Geleneksel olarak, bunu bir [`switch` ifadesi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) olarak yazmak yaygındır. `switch` ifadesindeki her `case` için, bir sonraki state'i hesaplayın ve döndürün.

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Bilinmeyen eylem: ' + action.type);
}
```

Eylemlerin herhangi bir şekli olabilir. Geleneksel olarak, eylemi tanımlayan bir `type` özelliği olan nesnelerin geçirilmesi yaygındır. Bu özellik, reducer'ın bir sonraki state'i hesaplamak için ihtiyaç duyduğu minimal bilgiyi içermelidir.

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

Eylem türü adları bileşeninizle ilgilidir. [Her eylem, birden çok veri değişikliğine yol açsa bile, yalnızca bir etkileşimi tanımlar.](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) State'in şekli rastgeledir, ancak genellikle bir nesne veya bir dizi olacaktır.

Daha fazla bilgi için [state mantığını reducer'a çıkarma](/learn/extracting-state-logic-into-a-reducer) makalesini okuyun.

<Pitfall>

State salt okunurdur. State içindeki nesneleri veya dizileri değiştirmeyin:

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 State'teki bir nesneyi şu şekilde değiştirmeyin:
      state.age = state.age + 1;
      return state;
    }
```

Bunun yerine, reducer'ınızdan her zaman yeni nesneler döndürün:

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Bunun yerine, yeni bir nesne döndürün
      return {
        ...state,
        age: state.age + 1
      };
    }
```

Daha fazla bilgi edinmek için [state içindeki nesneleri güncelleme](/learn/updating-objects-in-state) ve [state içindeki dizileri güncelleme](/learn/updating-arrays-in-state) makalelerini okuyun.

</Pitfall>

<Recipes titleText="Temel useReducer örnekleri" titleId="examples-basic">

#### Form (nesne) {/*form-object*/}

Bu örnekte, reducer iki alanı olan bir state nesnesini yönetir: `name` ve `age`.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Bilinmeyen eylem: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Yaşı artır
      </button>
      <p>Merhaba, {state.name}. {state.age} yaşındasın.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### Yapılacaklar listesi (dizi) {/*todo-list-array*/}

Bu örnekte, reducer bir görevler dizisini yönetir. Dizi [mutasyonsuz bir şekilde](/learn/updating-arrays-in-state) güncellenmesi gerekiyor.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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
      <h1>Prag tur programı</h1>
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

let nextId = 3;
const initialTasks = [
  { id: 0, text: "Kafka Müzesi'ni ziyaret edin.", done: true },
  { id: 1, text: 'Bir kukla gösterisi izleyin.', done: false },
  { id: 2, text: "Lennon Duvarı'nda fotoğraf çekin.", done: false }
];
```

```js src/AddTask.js hidden
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
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
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

<Solution />

#### Immer ile özlü güncelleme mantığı yazmak {/*writing-concise-update-logic-with-immer*/}

Mutasyonsuz olarak dizileri ve nesneleri güncelleştirmek sıkıcı geliyorsa, [Immer](https://github.com/immerjs/use-immer#useimmerreducer) gibi bir kütüphane kullanarak tekrarlayan kodu azaltabilirsiniz. Immer, nesneleri değiştiriyor gibi özlü kod yazmanıza olanak tanır, ancak işin altında değişmez güncellemeler gerçekleştirir:

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen eylem: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
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
      <h1>Prag tur programı</h1>
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

let nextId = 3;
const initialTasks = [
  { id: 0, text: "Kafka Müzesi'ni ziyaret edin.", done: true },
  { id: 1, text: 'Bir kukla gösterisi izleyin.', done: false },
  { id: 2, text: "Lennon Duvarı'nda fotoğraf çekin.", done: false },
];
```

```js src/AddTask.js hidden
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
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
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

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Başlangıç state'ini yeniden oluşturmayı önleme {/*avoiding-recreating-the-initial-state*/}

React, başlangıç state'ini bir kez kaydeder ve sonraki render işlemlerinde bunu görmezden gelir.

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

`createInitialState(username)`'in sonucu sadece ilk render işlemi için kullanılmasına rağmen, hala her render işleminde bu fonksiyonu çağırıyorsunuz. Bu, büyük diziler oluşturuyorsa veya maliyetli hesaplamalar yapıyorsa israf olabilir.

Bunu çözmek için, bunu üçüncü argüman olarak `useReducer`'a bir **_initializer_ fonksiyon** olarak geçebilirsiniz:

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

Yukarıdaki örnekte, `createInitialState` bir `username` argümanı alır. Başlatıcı fonksiyonunuz başlangıç state'ini hesaplamak için herhangi bir bilgiye ihtiyacı yoksa, `null`'i `useReducer`'ın ikinci argümanı olarak geçebilirsiniz.

Dikkat edin ki, `createInitialState` **kendisi** olan *fonksiyonu* geçiriyorsunuz ve çağrı sonucu olan `createInitialState()`'i değil. Bu şekilde, başlatma işleminden sonra başlangıç state'i yeniden oluşturulmaz.

<Recipes titleText="Başlatıcı fonksiyonu geçirmenin ve başlangıç state'ini doğrudan geçirmenin farkı" titleId="examples-initializer">

#### Başlatıcı fonksiyonunu geçirme {/*passing-the-initializer-function*/}

Bu örnek başlatıcı fonksiyonunu geçirir, bu nedenle `createInitialState` fonksiyonu yalnızca başlatma sırasında çalışır. Girdiye yazdığınız gibi, bileşen yeniden render olduğunda çalışmaz.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'nun görevi #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Bilinmeyen eylem: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Ekle</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Başlangıç state'ini doğrudan geçirme {/*passing-the-initial-state-directly*/}

Bu örnek başlatıcı fonksiyonu geçirmez, bu nedenle `createInitialState` fonksiyonu girdiye yazdığınız gibi her yeniden render olduğunda çalışır. Davranışta gözle görülür bir fark yoktur, ancak bu kod daha az verimlidir.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'nun görevi #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Bilinmeyen eylem:: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

## Sorun giderme {/*troubleshooting*/}

### Bir işlem yaptım, ancak state'i yazdırdığımda eski değerini veriyor {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

`dispatch` fonksiyonunu çağırmak **çalışan kodda state'i değiştirmez**:

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // 43 ile bir yeniden render isteği
  console.log(state.age);  // Hâlâ 42!

  setTimeout(() => {
    console.log(state.age); // Hâlâ 42!
  }, 5000);
}
```

Bu, [state'in bir anlık görüntü gibi davrandığı](/learn/state-as-a-snapshot) için böyle olur. State güncellendiğinde, yeni state değeriyle başka bir yeniden render isteği yapılır, ancak zaten çalışan olay yöneticinizdeki `state` JavaScript değişkenini etkilemez.

Bir sonraki state değerini tahmin etmeniz gerekiyorsa, reducer'ı kendiniz çağırarak manuel olarak hesaplayabilirsiniz:

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### Bir işlem yaptım, ancak ekran güncellenmiyor {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

React, [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırması ile belirlendiği gibi bir sonraki state önceki state ile eşitse, güncellemenizi **yok sayar**. Bu genellikle doğrudan state içinde bir nesne veya bir dizi değiştirdiğinizde olur:

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Hatalı: mevcut nesneyi değiştirme
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Hatalı: mevcut nesneyi değiştirme
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

Mevcut bir `state` nesnesini değiştirip geri döndürdüğünüz için React güncellemeyi görmezden geldi. Bunu düzeltmek için, onları mutasyona uğratmak yerine, her zaman [state içindeki nesneleri güncelleyerek](/learn/updating-objects-in-state) ve [state içindeki dizileri güncelleyerek](/learn/updating-arrays-in-state) emin olmanız gerekir:

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Doğru: yeni bir nesne oluşturmak
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Doğru: yeni bir nesne oluşturmak
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### Dispatch işleminden sonra reducer state'in bir kısmı tanımsız (undefined) oluyor. {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

Yeni state'i döndürürken her `case` dalının **mevcut tüm alanları kopyaladığından** emin olun:

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Bunu unutma!
        age: state.age + 1
      };
    }
    // ...
```

Yukarıdaki `...state` olmadan, döndürülen yeni state yalnızca `age` alanını ve başka hiçbir şeyi içermeyecektir.

---

### Dispatch işleminden sonra tüm reducer state'i tanımsız (undefined) oluyor. {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

Eğer state beklenmedik şekilde `undefined` olursa, muhtemelen `case` state'lerinden birinde state döndürmeyi unutuyorsunuz veya eylem türünüz herhangi bir `case` ifadesine uymuyor. Bunun sebebini bulmak için, anahtar kelime `switch`'in dışında bir hata yaratın:

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Bilinmeyen eylem:: ' + action.type);
}
```

Böyle hataları yakalamak için TypeScript gibi bir statik tip denetleyicisi de kullanabilirsiniz.

---

### "Too many re-renders" hatası alıyorum {/*im-getting-an-error-too-many-re-renders*/}

`Too many re-renders. React limits the number of renders to prevent an infinite loop.` hatası alabilirsiniz. Bu genellikle, işlemi koşulsuz bir şekilde `render` sırasında gönderdiğiniz anlamına gelir, böylece bileşeniniz döngüye girer: render, gönderim (bu da bir yeniden render yapar), render, gönderim (bu da bir yeniden render yapar) ve böyle devam eder. Bu sıklıkla, bir olay yöneticisi belirleme hatası nedeniyle oluşur:

```js {1-2}
// 🚩 Yanlış: yöneticiyi yeniden render sırasında çağırır.
return <button onClick={handleClick()}>Tıkla</button>

// ✅ Doğru: olay yöneticisini aşağıya aktarır.
return <button onClick={handleClick}>Tıkla</button>

// ✅ Doğru: iç içe bir fonksiyonu aktarır.
return <button onClick={(e) => handleClick(e)}>Tıkla</button>
```

Bu hatanın nedenini bulamazsanız, konsoldaki hatanın yanındaki ok'a tıklayın ve JavaScript yığınını (stack) tarayarak hatadan sorumlu belirli `dispatch` fonksiyonu çağrısını bulun.

---

### Reducer veya başlatıcı (initializer) fonksiyonlarım iki kez çalışıyor. {/*my-reducer-or-initializer-function-runs-twice*/}

[Strict Mode](/reference/react/StrictMode) içinde, React reducer ve başlatıcı (initializer) fonksiyonlarınızı iki kez çağırır. Bu, kodunuzu bozmamalıdır.

Bu **yalnızca geliştirme sırasında** gerçekleşen davranış, [bileşenleri saf olarak tutmanıza](/learn/keeping-components-pure) yardımcı olur. React, çağrılardan birinin sonucunu kullanır ve diğer çağrının sonucunu yoksayar. Bileşen, başlatıcı ve azaltıcı foknisyonlarınız saf halde olduğu sürece, bu mantığınızı etkilememelidir. Ancak yanlışlıkla saf halde olmayan foknisyonlarınız varsa, bu hataları fark etmenize yardımcı olur.

Örneğin, aşağıdaki saf halde olmayan reducer fonksiyonu, state'deki bir diziyi değiştirir:

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Hata: state değiştirme (mutate)
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

React, reducer fonksiyonunuzu iki kez çağırdığı için, yapılacakların iki kez eklendiğini göreceksiniz, bu yüzden bir hatanın olduğunu bileceksiniz. Bu örnekte, hatayı düzeltmek için [diziyi değiştirmek yerine ona yeni bir dizi atayabilirsiniz](/learn/updating-arrays-in-state#adding-to-an-array):

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Doğru: yeni bir state ile değiştirme
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

Artık bu reducer fonksiyonu saf halde olduğuna göre, bir kez daha çağrılması davranışta fark yaratmaz. Bu, React'in iki kez aramakla hataları bulmanıza yardımcı olmasının sebebidir. **Sadece bileşen, başlatıcı ve reducer fonksiyonlar saf halde olmalıdır.** Olay yöneticisi saf halde olmak zorunda değildir, bu nedenle React asla olay yöneticinizi iki kez çağırmaz.

Daha fazla bilgi edinmek için [bileşenleri saf olarak tutma](/learn/keeping-components-pure) konusunu okuyun.
