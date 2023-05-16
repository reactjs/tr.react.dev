---
title: State Mantığını Bir Reducer'a Aktarma
---

<Intro>

Birçok olay yöneticisine yayılmış çok fazla sayıda state güncellemesine sahip bileşenler can sıkıcı olabilir. Bu gibi durumlarda tüm state güncelleme mantıklarını _reducer_ (redüktör) adı verilen tek bir fonksiyonda birleştirebilirsiniz.

</Intro>

<YouWillLearn>

- Bir reducer fonsiyonunun ne olduğu
- `useState`'i `useReducer` ile nasıl yeniden yapılandıracağınız
- Ne zaman bir reducer kullanmanız gerektiği
- İyi bir reducer yazmanın püf noktaları

</YouWillLearn>

## State mantığını (State logic) bir reducer ile birleştirin {/*consolidate-state-logic-with-a-reducer*/}

Bileşenlerinizin karmaşıklığı arttıkça bir bileşenin state'inin hangi farklı yollarla güncellendiğini bir bakışta görmek zorlaşabilir. Örneğin, aşağıdaki `TaskApp` bileşeni `görevler` dizinini bir state'de tutar ve görevleri eklemek, kaldırmak ve düzenlemek için üç farklı olay yöneticisi kullanır:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prag Gezisi Planı</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Kafka Müzesini ziyaret et', done: true},
  {id: 1, text: 'Kukla gösterisi izle', done: false},
  {id: 2, text: "Lennon Duvarı'nda fotoğraf çek", done: false},
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Görev ekle"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Ekle
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Kaydet</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Düzenle</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Sil</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Her bir olay yöneticisi state'i güncellemek için `setTasks`'ı çağırır. Bu bileşen büyüdükçe, içine serpiştirilmiş state mantığı miktarı da artar. Bu karmaşıklığı azaltmak ve tüm mantığı erişilmesi kolay tek bir yerde tutmak için state mantıklarını bileşeninizin dışında **"reducer" adı verilen** tek bir fonksiyona taşıyabilirsiniz.

Reducer'lar, state'i ele almanın farklı bir yöntemidir. `useState`'ten `useReducer`'a şu üç adımda geçebilirsiniz:

1. State ayarlamak yerine işlemleri göndermeye (dispatching) **geçme**.
2. Bir reducer fonksiyonu **yazma**.
3. Bileşeninizden gelen “reducer”ı **kullanma**.

### Step 1: State ayarlamak yerine işlemleri göndermeye (dispatching) geçme {/*step-1-move-from-setting-state-to-dispatching-actions*/}

Olay yöneticileriniz şu aşamada _ne yapılacağını_ state ayarlayarak belirler:

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

Tüm state ayarlama mantığını kaldırın. Geriye üç olay yöneticisi kalacaktır:

- `handleAddTask(text)` kullanıcı "Ekle" butonuna bastığı zaman çağrılır.
- `handleChangeTask(task)` kullanıcı bir görevi açıp kapattığında veya "Kaydet" butonuna bastığında çağrılır.
- `handleDeleteTask(taskId)` kullanıcı "Sil" butonuna bastığında çağrılır.

Reducer'lar ile state yönetimi doğrudan state'i ayarlama işleminden biraz farklıdır. State ayarlayarak React'e "ne yapılacağını" belirtmek yerine, olay yöneticilerinden "işlemler" göndererek "kullanıcının ne yaptığını" belirtirsiniz. (State güncelleme mantığı başka bir yerde yaşayacaktır!) Yani bir olay yöneticisi aracılığıyla "görevleri ayarlamak" yerine, "görev eklendi/değiştirildi/silindi" şeklinde bir işlem gönderirsiniz. Bu kullanıcının isteğini daha açık hale getirir.


```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

`dispatch`'e gönderdiğiniz nesneye "işlem" adı verilir.

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "işlem" nesnesi:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

Bu bildiğimiz bir JavaScript nesnesidir. İçine ne koyacağınıza siz karar verirsiniz, ancak genellikle _ne meydana geldiği_ hakkında minimum bilgi içermelidir. (`dispatch` fonksiyonunun kendisini daha sonraki bir adımda ekleyeceksiniz.)

<Note>

Bir işlem nesnesi herhangi bir şekle sahip olabilir.

Geleneksel olarak, ona ne olduğunu açıklayan bir string `type`'ı vermek ve diğer alanlara herhangi bir ek bilgi girmek yaygındır. `type` bir bileşene özgüdür, bu nedenle bu örnek için `'added'` veya `'added_task'` uygun olacaktır. Ne olup bittiğini anlatan bir isim seçin!

```js
dispatch({
  // bileşene özgüdür
  type: 'what_happened',
  // diğer alanlar buraya girilir
});
```

</Note>

### Step 2: Bir reducer fonksiyonu yazma {/*step-2-write-a-reducer-function*/}

Bir reducer fonksiyonu state mantığınızı (state logic) koyacağınız yerdir. İki argüman alır; mevcut state ve işlem nesnesi, ardından bir sonraki state'i geri döndürür:

```js
function yourReducer(state, action) {
  // React'in ayarlaması için bir sonraki state'i geri döndür
}
```
React reducer'dan ne geri döndürürseniz state'i ona göre ayarlayacaktır.

Bu örnekte state ayarlama mantığınızı olay yöneticilerinden bir reducer fonksiyonuna taşımak için şunları yapacaksınız:

1. Geçerli state'i (`tasks`) ilk argüman olarak tanımlayın.
2. `action` nesnesini ikinci argüman olarak tanımlayın.
3. Reducer'dan (React'in state'i ayarlayacağı) bir sonraki state'i geri döndürün.

Burada tüm state ayarlama mantığı tek bir reducer fonksiyonuna aktarılmıştır:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Bilinmeyen işlem: ' + action.type);
  }
}
```

Reducer fonksiyonu state'i (`tasks`) bir argüman olarak aldığından **bunu bileşeninizin dışında tanımlayabilirsiniz**. Bu satır girinti seviyesini azaltır ve kodunuzun okunmasını kolaylaştırır.

<Note>

Yukarıdaki kod if/else ifadesini kullanır ancak [switch ifadesini](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) reducer'ların içinde kullanmak bir gelenektir. Sonuç aynıdır, ancak switch ifadelerini bir bakışta okumak daha kolay olabilir.

Bu dökümantasyonun geri kalanında bu şekilde kullanacağız:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}
```

Farklı `case`'ler içinde bildirilen değişkenlerin birbiriyle çakışmaması için her `case` bloğunu `{` ve `}` küme parantezlerine sarmanızı öneririz. Ayrıca bir `case` genellikle bir `return` ile bitmelidir. Eğer `return`'u unutursanız, kod bir sonraki `case`'e "düşer" ve bu da hatalara yol açabilir!

Eğer switch ifadeleri konusunda henüz rahat değilseniz, if/else kullanmaya devam edebilirsiniz.

</Note>

<DeepDive>

#### Reducer'lar (redüktör) neden bu şekilde adlandırılır? {/*why-are-reducers-called-this-way*/}

Reducer'lar bileşeninizin içindeki kod miktarını "azaltabilir" (reduce) olsa da, aslında diziler üzerinde gerçekleştirebileceğiniz [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) metodundan almakta.

`reduce()` işlemi bir diziyi alıp birçok değeri tek bir değerde "toplamanızı" sağlar:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

`reduce`'a aktardığınız fonksiyon "reducer" olarak bilinir. Bu fonksiyon _o ana kadarki sonucu_ ve _geçerli öğeyi_ alır, ardından _bir sonraki sonucu_ geri döndürür. React reducer'lar da aynı fikrin bir örneğidir: _o ana kadarki state'i_ ve _işlemi_ alırlar ve _bir sonraki state'i_ geri döndürürler. Bu şekilde, işlemleri zaman içinde state olarak toplarlar.

Hatta `reduce()` metodunu bir `initialState` ve bir `actions` dizisi ile kullanabilir ve reducer fonksiyonunuzu bu metoda aktararak son state'i hesaplayabilirsiniz:

<Sandpack>

```js index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Kafka Müzesini ziyaret et'},
  {type: 'added', id: 2, text: 'Kukla gösterisi izle'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: "Lennon Duvarı'nda fotoğraf çek"},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

Muhtemelen bunu kendiniz yapmanız gerekmeyecektir, ancak bu React'in yaptığına benzer!

</DeepDive>

### Step 3: Bileşeninizden gelen "reducer"ı kullanma {/*step-3-use-the-reducer-from-your-component*/}

En son olarak, `tasksReducer`'ı bileşeninize bağlamanız gerekiyor. `useReducer` Hook'unu React'ten içe aktarın:

```js
import { useReducer } from 'react';
```

Daha sonra `useState`'i:

```js
const [tasks, setTasks] = useState(initialTasks);
```

`useReducer` ile şu şekilde değiştirebilirsiniz:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

`useReducer` hook'u `useState`'e benzer; ona bir başlangıç state'i iletmeniz gerekir ve o da state bilgisi olan bir değeri geri döndürür (bu durumda dispatch fonksiyonu). Fakat yine de biraz faklılıklar gösterir.

`useReducer` hook'u iki argüman alır:

1. Bir reduce fonksiyonu
2. Bir başlangıç state'i

Ve şunları geri döndürür:

1. State bilgisi içeren bir değer
2. Bir dispatch fonksiyonu (kullanıcı işlemleri reducer'a "göndermek" için)

Artık tüm bağlantılar kurulmuş halde! Reducer burada bileşen dosyasının en altında tanımlanmıştır:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prag Gezisi Planı</h1>
      <AddTask onAddTask={handleAddTask} />
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
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Kafka Müzesini ziyaret et', done: true},
  {id: 1, text: 'Kukla gösterisi izle', done: false},
  {id: 2, text: "Lennon Duvarı'nda fotoğraf çek", done: false},
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Görev ekle"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Ekle
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Kaydet</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Düzenle</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Sil</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Hatta isterseniz reducer'ı ayrı bir dosyaya da taşıyabilirsiniz:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prag Gezisi Planı</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Kafka Müzesini ziyaret et', done: true},
  {id: 1, text: 'Kukla gösterisi izle', done: false},
  {id: 2, text: "Lennon Duvarı'nda fotoğraf çek", done: false},
];
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Görev ekle"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Ekle
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Kaydet</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Düzenle</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Sil</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Bileşen mantığını bu şekilde ayırmak okunarlığı daha kolay hale getirebilir. Artık olay yöneticileri işlemleri göndererek yalnızca _ne olduğunu_ belirler ve reducer fonksiyonu bunlara yanıt olarak _state'in nasıl güncelleneceği_ kararını verir.

## `useState` ve `useReducer` karışılaştırması {/*comparing-usestate-and-usereducer*/}

Reducers'ların dezavantajları da yok değil! İşte bunları karşılaştırabileceğiniz birkaç yol:

- **Kod miktarı:** Genellikle `useState` ile ilk etapta daha az kod yazmanız gerekir. `useReducer` ile ise hem reducer fonksiyonu _hem de_ dispatch işlemlerini yazmanız gerekir. Ne var ki, birçok olay yöneticisi state'i benzer şekillerde değiştiriyorsa, `useReducer` kodu azaltmaya yardımcı olabilir.
- **Okunabilirlik:** `useState` state güncellemeleri basit olduğu zamanlarda okunması da kolaydır. Daha karmaşık hale geldiklerinde ise bileşeninizin kodunu şişirebilir ve taranmasını zorlaştırabilir. Bu gibi durumlarda `useReducer`, güncelleme mantığının _nasıl_ olduğunu, olay yöneticilerinin _ne olduğundan_ temiz bir şekilde ayırmanızı sağlar.
- **Hata ayıklama:** `useState` ile ilgili bir hatanız olduğunda, state'in _nerede_ ve _neden_ yanlış ayarlandığını söylemek zor olabilir. `useReducer` ile, her state güncellemesini ve bunun neden olduğunu (hangi `işlem`'den kaynaklandığını) görmek için reducer'ınıza bir konsol logu ekleyebilirsiniz. Eğer bütün işlemler doğruysa, hatanın reducer mantığının kendisinde olduğunu bilirsiniz. Ancak, `useState` ile olduğundan daha fazla kod üzerinden geçmeniz gerekir.
- **Test etme:** Reducer, bileşeninize bağlı olmayan saf bir fonksiyondur. Bu, onu izole olarak ayrı ayrı dışa aktarabileceğiniz ve test edebileceğiniz anlamına gelir. Genellikle bileşenleri daha gerçekçi bir ortamda test etmek en iyisi olsa da karmaşık state güncelleme mantığı için reducer'unuzun belirli bir başlangıç state'i ve işlem için belirli bir state döndürdüğünü doğrulamak yararlı olabilir.
- **Kişisel tercih:** Bazı insanlar reducer'ları sever, bazıları sevmez. Bu sorun değil. Bu bir tercih meselesidir. Her zaman `useState` ve `useReducer` arasında dönüşümlü olarak geçiş yapabilirsiniz: bunlar eşdeğerdir!

Bazı bileşenlerde yanlış state güncellemeleri nedeniyle sık sık hatalarla karşılaşıyorsanız ve koda daha fazla yapılandırma getirmek istiyorsanız bir reducer kullanmanızı öneririz. Her şey için reducer kullanmak zorunda değilsiniz: farklı kombinler yapmaktan çekinmeyin! Hatta aynı bileşende `useState` ve `useReducer` bile kullanabilirsiniz.

## İyi bir reducer yazmak {/*writing-reducers-well*/}

Reducer yazarken şu iki ipucunu aklınızda bulundurun:

- **Reducer'lar saf olmalıdır.** [State güncelleme fonksiyonları](/learn/queueing-a-series-of-state-updates) gibi, reducer'lar da render sırasında çalışır! (İşlemler bir sonraki render işlemine kadar sıraya alınır.) Bunun anlamı reducer'ların [saf olması gerektiğidir](/learn/keeping-components-pure); aynı girdiler her zaman aynı çıktıyla sonuçlanır. Bunlar istek göndermemeli, zaman aşımı planlamamalı veya herhangi bir yan etki (bileşenin dışındaki şeyleri etkileyen faaliyetler) gerçekleştirmemelidir. [Nesneleri](/learn/updating-objects-in-state) ve [dizileri](/learn/updating-arrays-in-state) mutasyon (değişinim) olmadan güncellemelidirler.
- **Her işlem verilerde birden fazla değişikliğe yol açsa bile tek bir kullanıcı etkileşimini ifade eder.** Örneğin, bir reducer tarafından yönetilen beş alana sahip bir formda bir kullanıcı "Sıfırla" düğmesine bastığında, beş ayrı `set_field` işlemi yerine tek bir `reset_form` işlemini göndermek daha mantıklıdır. Bir reducer'daki her işlemi loglarsanız, bu log hangi etkileşimlerin veya yanıtların hangi sırayla gerçekleştiğini yeniden yapılandırmanız için yeterince açık olmalıdır. Bu, hata ayıklamaya yardımcı olur!

## Immer ile kısa reducer'lar yazma {/*writing-concise-reducers-with-immer*/}

Aynı normal state'deki [nesneleri](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) ve [dizileri güncelleme](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) gibi, Immer kütüphanesini reducer'ları daha kısa ve öz hale getirmek için kullanabilirsiniz. Burada, [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) işlevi `push` veya `arr[i] =` ataması ile state'i değiştirmenizi sağlar:

<Sandpack>

```js App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prag Gezisi Planı</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Kafka Müzesini ziyaret et', done: true},
  {id: 1, text: 'Kukla gösterisi izle', done: false},
  {id: 2, text: "Lennon Duvarı'nda fotoğraf çek", done: false},
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Görev ekle"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Ekle
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Kaydet</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Düzenle</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Sil</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
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

Reducer'lar saf olmalıdır, dolayısıyla state'i değiştirmemelidirler. Ancak Immer size mutasyona uğraması güvenli olan özel bir `draft` nesnesi sağlar. Arka planda, Immer `draft`'ta yaptığınız değişikliklerle state'inizin bir kopyasını oluşturacaktır. Bu nedenle, `useImmerReducer` tarafından yönetilen reducer'lar ilk argümanlarını değiştirebilir ve state geri döndürmeleri gerekmez.

<Recap>

- `useState`'ten `useReducer`'a geçmek için:
  1. İşlemlerinizi olay yöneticilerinden gönderin.
  2. Belirli bir state ve action için bir sonraki state'i döndüren bir reducer fonksiyonu yazın.
  3. `useState`'i `useReducer` ile değiştirin.
- Reducer'lar biraz daha fazla kod yazmanızı gerektirse de hata ayıklama ve test etme konusunda yardımcı olurlar.
- Reducer'lar saf olmalıdır.
- Her işlem tek bir kullanıcı etkileşimini ifade eder.
- Reducer'ları mutasyona uğrayan bir biçimde yazmak istiyorsanız Immer kullanın.

</Recap>

<Challenges>

#### İşlemleri olay yöneticisinden gönderin {/*dispatch-actions-from-event-handlers*/}

Şu anda, `ContactList.js` ve `Chat.js` içindeki olay yöneticilerinde `// TODO` yorumları var. Bu nedenle yazı alanına yazma özelliği çalışmıyor ve düğmelere tıklamak seçilen alıcı kişiyi değiştirmiyor.

Bu iki `// TODO`'yu ilgili işlemleri (actions) `dispatch` edecek kodla değiştirin. İşlemlerin beklenen şeklini ve türünü görmek için `messengerReducer.js` dosyasındaki reducer'u kontrol edin. Reducer hali hazırda yazılmıştır, bu yüzden değiştirmenize gerek yoktur. Yalnızca `ContactList.js` ve `Chat.js` içindeki işlemleri göndermeniz (dispatch) gerekir.

<Hint>

Bu bileşenlerin her ikisinde de `dispatch` fonksiyonu zaten mevcuttur çünkü bir prop olarak aktarılmıştır. Bu yüzden `dispatch` fonksiyonunu ilgili işlem nesnesi ile çağırmanız gerekir.

İşlem nesnesinin şeklini kontrol etmek için, reducer'a bakabilir ve hangi `action` alanlarını almayı beklediğini görebilirsiniz. Örneğin, reducer'daki `changed_selection` case'i şuna benzer:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

Bu, işlem nesnenizin `type: 'changed_selection'` özelliğine sahip olması gerektiği anlamına gelir. Ayrıca `action.contactId` kullanıldığını görüyorsunuz, bu nedenle işlemlerinize bir `contactId` özelliği eklemeniz gerekir.

</Hint>

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Deniz', email: 'deniz@mail.com'},
  {id: 1, name: 'Aylin', email: 'aylin@mail.com'},
  {id: 2, name: 'Ata', email: 'ata@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Merhaba',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: changed_selection'ı dispatch et
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + ' ile sohbet et'}
        onChange={(e) => {
          // TODO: edited_message'ı dispatch et
          // (e.target.value'dan gelen girdi değerini oku)
        }}
      />
      <br />
      <button>{contact.email}'a gönder</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Reducer kodundan, işlemlerin şu şekilde görünmesi gerektiğini anlayabilirsiniz:

```js
// Kullanıcı "Aylin" butonuna bastığında
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// Kullanıcı "Merhaba!" yazdığında
dispatch({
  type: 'edited_message',
  message: 'Merhaba!',
});
```

İşte ilgili mesajları göndermek için güncellenmiş örnek:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Deniz', email: 'deniz@mail.com'},
  {id: 1, name: 'Aylin', email: 'aylin@mail.com'},
  {id: 2, name: 'Ata', email: 'ata@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Merhaba',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + ' ile sohbet et'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>{contact.email}'a gönder</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### Bir mesaj gönderildiğinde giriş alanını temizleyin {/*clear-the-input-on-sending-a-message*/}

Şu anda, "Gönder" düğmesine basmak hiçbir şey yapmıyor. "Gönder" düğmesine şu işlemleri yapacak bir olay yöneticisi ekleyin:

1. Alıcının e-postasını ve mesajı içeren bir `alert` gösterin.
2. Mesaj giriş alanını temizleyin.

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Deniz', email: 'deniz@mail.com'},
  {id: 1, name: 'Aylin', email: 'aylin@mail.com'},
  {id: 2, name: 'Ata', email: 'ata@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Merhaba',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + ' ile sohbet et'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>{contact.email}'a gönder</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Bunu "Gönder" düğmesi olay yöneticisinde yapmanın birkaç yolu vardır. Bir yaklaşım, bir uyarı göstermek ve ardından boş bir `mesaj` ile bir `edited_message` işlemini göndermektir:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Deniz', email: 'deniz@mail.com'},
  {id: 1, name: 'Aylin', email: 'aylin@mail.com'},
  {id: 2, name: 'Ata', email: 'ata@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Merhaba',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + ' ile sohbet et'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`${contact.email} adresine "${message}" mesajı gönderiliyor.`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        {contact.email}'a gönder
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Bu işe yarar ve "Gönder" düğmesine bastığınızda girişi temizler.

Ancak, _kullanıcının bakış açısından_ mesaj göndermek, alanı düzenlemekten farklı bir işlemdir. Bunu yansıtmak için, bunun yerine `sent_message` adında _yeni_ bir işlem oluşturabilir ve bunu reducer'da ayrı olarak işleyebilirsiniz:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Deniz', email: 'deniz@mail.com'},
  {id: 1, name: 'Aylin', email: 'aylin@mail.com'},
  {id: 2, name: 'Ata', email: 'ata@mail.com'},
];
```

```js messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Merhaba',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + ' ile sohbet et'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`${contact.email} adresine "${message}" mesajı gönderiliyor.`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        {contact.email}'a gönder
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Sonuçta ortaya çıkan davranış aynıdır. Ancak işlem türlerinin ideal olarak "state'in nasıl değişmesini istediğinizden" ziyade "kullanıcının ne yaptığını" tanımlaması gerektiğini unutmayın. Bu, daha sonra daha fazla özellik eklemeyi kolaylaştırır.

Her iki çözümde de `alert`'ı bir reducer içine **yerleştirmemeniz** önemlidir. Reducer saf bir fonksiyon olmalıdır; sadece bir sonraki state'i hesaplamalıdır. Kullanıcıya mesaj göstermek de dahil olmak üzere hiçbir şey "yapmamalıdır". Bu, olay yöneticisinde gerçekleşmelidir. (Bunun gibi hataları yakalamaya yardımcı olmak için React, Strict Mode'da reducer'larınızı birden çok kez çağıracaktır. Bu nedenle, bir reducer'a bir uyarı koyarsanız, iki kez ateşlenir).

</Solution>

#### Sekmeler arasında geçiş yaparken girdi değerlerini geri yükleme {/*restore-input-values-when-switching-between-tabs*/}

Bu örnekte, farklı alıcı kişiler arasında geçiş yapmak metin giriş alanını temizler:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Girdi alanını temizle
  };
```

Bunun nedeni, tek bir mesaj taslağını birden fazla alıcı arasında paylaşmak istememenizdir. Ancak uygulamanızın her kişi için ayrı bir taslak "hatırlaması" ve kişileri değiştirdiğinizde bunları geri yüklemesi daha iyi olurdu.

Göreviniz, state'in yapılandırılma şeklini değiştirerek _her kişi_ için ayrı bir mesaj taslağını hatırlamanızı sağlamaktır. Reducer'da başlangıç state'inizde ve bileşenlerde birkaç değişiklik yapmanız gerekecektir.

<Hint>

State'inizi bu şekilde yapılandırabilirsiniz:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Merhaba, Deniz', // contactId = 0 için taslak
    1: 'Merhaba, Aylin', // contactId = 1 için taslak
  },
};
```

`[key]: value` [hesaplanmış özellik](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) sözdizimi `messages` nesnesini güncellemenize yardımcı olabilir:

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Deniz', email: 'deniz@mail.com'},
  {id: 1, name: 'Aylin', email: 'aylin@mail.com'},
  {id: 2, name: 'Ata', email: 'ata@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Merhaba',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + ' ile sohbet et'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`${contact.email} adresine "${message}" mesajı gönderiliyor.`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        {contact.email}'a gönder
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Her bir alıcı kişisi için ayrı bir mesaj taslağını saklamak ve güncellemek için reducer'ı güncellemeniz gerekir:

```js
// Girdi alanı düzenlendiğinde
case 'edited_message': {
  return {
    // Seçim gibi diğer state'leri saklayın
    ...state,
    messages: {
      // Diğer kişiler için mesajları sakla
      ...state.messages,
      // Yalnızca seçili kişinin mesajını değiştirin
      [state.selectedId]: action.message
    }
  };
}
```

Ayrıca `Messenger` bileşenini o anda seçili olan alıcı kişisinin mesajını okuyacak şekilde güncellersiniz:


```js
const message = state.messages[state.selectedId];
```

İşte tam çözüm:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Deniz', email: 'deniz@mail.com'},
  {id: 1, name: 'Aylin', email: 'aylin@mail.com'},
  {id: 2, name: 'Ata', email: 'ata@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Merhaba, Deniz',
    1: 'Merhaba, Aylin',
    2: 'Merhaba, Ata',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + ' ile sohbet et'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`${contact.email} adresine "${message}" mesajı gönderiliyor.`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        {contact.email}'a gönder
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Dikkat edilirse, bu farklı davranışı uygulamak için olay yöneticilerinden herhangi birini değiştirmeniz gerekmedi. Bir reducer olmadan, state'i güncelleyen her olay yöneticisini değiştirmeniz gerekirdi.

</Solution>

#### Sıfırdan `useReducer` implemente edin {/*implement-usereducer-from-scratch*/}

Daha önceki örneklerde React'ten `useReducer` Hook'unu içe aktarmıştınız. Bu sefer, _`useReducer` Hook`unu kendiniz_ implemente edeceksiniz! İşte başlamanız için bir şablon. Kodun 10 satırdan fazla sürmemesi gerekir.

Değişikliklerinizi test etmek için giriş alanına yazmayı deneyin veya bir alıcı kişi seçin.

<Hint>

İşte daha ayrıntılı bir implementasyon taslağı:

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```
Redüktör fonksiyonunun iki argüman (mevcut state ve işlem nesnesi) aldığını ve bir sonraki state'i döndürdüğünü hatırlayın. `dispatch` implementasyonunuz bununla ne yapmalıdır?

</Hint>

<Sandpack>

```js App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Deniz', email: 'deniz@mail.com'},
  {id: 1, name: 'Aylin', email: 'aylin@mail.com'},
  {id: 2, name: 'Ata', email: 'ata@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Merhaba, Deniz',
    1: 'Merhaba, Aylin',
    2: 'Merhaba, Ata',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + ' ile sohbet et'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`${contact.email} adresine "${message}" mesajı gönderiliyor.`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        {contact.email}'a gönder
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Bir işlem gönderildiğinde (dispatching), mevcut state ve işlemle birlikte bir reducer çağrılır ve sonuç bir sonraki state olarak saklanır. Kod olarak böyle görünür:

<Sandpack>

```js App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Deniz', email: 'deniz@mail.com'},
  {id: 1, name: 'Aylin', email: 'aylin@mail.com'},
  {id: 2, name: 'Ata', email: 'ata@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Merhaba, Deniz',
    1: 'Merhaba, Aylin',
    2: 'Merhaba, Ata',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Bilinmeyen işlem: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={contact.name + ' ile sohbet et'}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`${contact.email} adresine "${message}" mesajı gönderiliyor.`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        {contact.email}'a gönder
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Çoğu durumda önemli olmasa da, biraz daha doğru bir implementasyon şu şekildedir:

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

Bunun nedeni, gönderilen işlemlerin [güncelleyici işlevlerine benzer şekilde](/learn/queueing-a-series-of-state-updates) olduğu gibi bir sonraki render işlemine kadar kuyrukta bekletilmesidir.

</Solution>

</Challenges>
