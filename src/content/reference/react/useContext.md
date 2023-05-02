---
title: useContext
---

<Intro>

`useContext`, bileşeninizden [context](/learn/passing-data-deeply-with-context) okumanıza ve buna abone olmanıza izin veren bir React Hook'tur.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Bileşeninizde [context](/learn/passing-data-deeply-with-context) okumak ve buna abone olmak için `useContext`'i bileşeninizin üst düzeyinde çağırın.


```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[Aşağıda daha fazla örneğe bakın.](#usage)

#### Parametreler {/*parameters*/}

* `SomeContext`: Daha önce [`createContext`](/tr/referans/react/createContext) ile oluşturduğunuz context. Context kendisi bilgiyi tutmaz, sadece bileşenlere sağlayabileceğiniz veya okuyabileceğiniz bilgi türünü temsil eder.

#### Dönüşler {/*returns*/}

`useContext`, çağrılan bileşen için Context değerini döndürür. Bu değer, ağaçtaki çağrılan bileşenden önceki en yakın `SomeContext.Provider`'a iletilen `value` olarak belirlenir. Böyle bir sağlayıcı yoksa, döndürülen değer o Context için [`createContext`](/tr/referans/react/createContext) ile belirlediğiniz `defaultValue` olacaktır. Döndürülen değer her zaman günceldir. Eğer bir Context değişirse, React otomatik olarak bu Context'i kullanan bileşenleri yeniden render eder.

#### Dikkat Edilmesi Gerekenler {/*caveats*/}

* Bir bileşende yapılan `useContext()` çağrısı, aynı bileşenden döndürülen sağlayıcılardan etkilenmez. İlgili `<Context.Provider>` **kullanılan bileşenin üstünde olmalıdır.**
* React, farklı bir `value` alan sağlayıcıdan başlayarak, belirli bir Context'i kullanan tüm alt bileşenleri **otomatik olarak yeniden render** eder. Önceki ve sonraki değerler [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırması ile karşılaştırılır. [`memo`](/tr/referans/react/memo) ile yeniden renderları atlamak, alt bileşenlerin taze Context değerleri almasını engellemez.
* Yapı sistemimiz çıktıda modüllerin kopyalarını oluşturursa (sembolik bağlantılarla olabilir), bu Context'i bozabilir. Bir şeyi Context aracılığıyla geçirmek, Context sağlamak ve okumak için **tamamen aynı nesne** olan `SomeContext`'ın, `===` karşılaştırması ile belirlendiği durumlarda çalışır.

---

## Kullanım {/*usage*/}


### Veri geçişini ağaca derinlemesine sağlama {/*passing-data-deeply-into-the-tree*/}

Bileşeninizin üst düzeyinde `useContext`'i çağırarak [Context](/learn/passing-data-deeply-with-context)'a erişebilir ve abone olabilirsiniz:

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext`, geçtiğiniz <CodeStep step={1}>Context</CodeStep> için <CodeStep step={2}>Context değerini</CodeStep> döndürür. Context değerini belirlemek için, React bileşen ağacını tarar ve o belirli context için **en yakın Context sağlayıcısını** bulur.

`Button` bileşenine Context geçmek için, ilgili Context sağlayıcısını bu bileşenin veya üst bileşeninin içine yerleştirin:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

`Button`'ın içinde olduğu herhangi bir yerde `useContext(ThemeContext)` çağrıldığında, `Form`'un içindeki `ThemeContext.Provider` bileşenine en yakın olanın `"dark"` değeri alınır.

<Pitfall>

`useContext()`, onu çağıran bileşenden yukarı doğru arama yapar ve arama sırasında `useContext()`'i çağırdığınız bileşen içindeki sağlayıcıları dikkate **almaz**.

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Context üzerinden geçirilen verileri güncelleme {/*updating-data-passed-via-context*/}

Genellikle, context'in zaman içinde değişmesini istersiniz. Context'i güncellemek için, [state](/tr/referans/react/useState) ile birleştirin. Ana bileşende bir durum değişkeni bildirin ve geçerli durumu sağlayıcının <CodeStep step={2}>context değeri</CodeStep> olarak aşağıya geçirin.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext.Provider>
  );
}
```

Şimdi sağlayıcı içindeki herhangi bir `Button`, mevcut `theme` değerini alacaktır. `setTheme`i çağırarak sağlayıcıya iletilen `theme` değerini güncellerseniz, tüm `Button` bileşenleri yeni `'light'` değeriyle yeniden render olacaktır.

<Recipes titleText="Context güncelleme örnekleri" titleId="examples-basic">

#### Context aracılığıyla bir değerin güncellenmesi {/*updating-a-value-via-context*/}

Bu örnekte, `MyApp` bileşeni bir durum değişkenini tutar ve daha sonra `ThemeContext` sağlayıcısına iletilir. "Karanlık mod" onay kutusunu işaretlemek, durumu günceller. Sağlanan değerin değiştirilmesi, bu context'i kullanan tüm bileşenlerin yeniden render edilmesine neden olur.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </ThemeContext.Provider>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

`value="dark"` ifadesi `"dark"` string değerini geçerken, `value={theme}` ifadesi JavaScript `theme` değişkeninin değerini JSX curly braces (`{}`) ile geçirir. Curly braces ayrıca, string olmayan context değerlerini geçirmenize de olanak tanır.

<Solution />

#### Bir objeyi context aracılığıyla güncelleme {/*updating-an-object-via-context*/}

Bu örnekte, bir nesneyi tutan `currentUser` isimli bir durum değişkeni vardır. Bu, `{ currentUser, setCurrentUser }` değişkenlerinin birleştirildiği ve bunların `value={}` içinden context yoluyla aşağıdaki tüm bileşenler tarafından okunabilmesini sağlar. Örneğin, `LoginButton` bileşeni, `currentUser` ve `setCurrentUser`'ı okuyabilir ve ihtiyaç duyulduğunda `setCurrentUser`'ı çağırabilir.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext.Provider>
  );
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>You logged in as {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Log in as Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### Birden fazla context {/*multiple-contexts*/}

Bu örnekte iki bağımsız context var. `ThemeContext`, mevcut temayı sağlar, bu bir dizedir, `CurrentUserContext` ise mevcut kullanıcıyı temsil eden bir nesneyi tutar.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Use dark mode
        </label>
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Sağlayıcıları bir bileşene çıkarma {/*extracting-providers-to-a-component*/}

Uygulamanız büyüdükçe, context "piramidi"ni uygulamanızın köküne doğru yaklaşan bir şekilde sahip olmanız beklenir. Bununla bir sorun yok. Ancak, görsel olarak yuvalamayı sevmiyorsanız, sağlayıcıları tek bir bileşene çıkarabilirsiniz. Bu örnekte, `MyProviders` "plumbing"i gizler ve çocukları içinde gerekli sağlayıcıların render eder. `tema` ve `setTheme` durumu `MyApp`te kendisi için gereklidir, bu nedenle `MyApp` hala bu parçaya sahiptir.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Context ve bir azaltıcıyı (reducer) kullanarak ölçeklendirme {/*context-ve-bir-azaltıcı-reducer-kullanarak-ölçeklendirme*/}

Daha büyük uygulamalarda, bazı durumlarla ilgili mantığı bileşenlerden ayıklamak için context ile [bir azaltıcıyı (reducer)](/tr/referans/react/useReducer) birleştirmek yaygındır. Bu örnekte, tüm "bağlantı" işlemleri, bir azaltıcı ve iki ayrı context içeren `TasksContext.js` dosyasında gizlenmiştir.

Bu örneğin [tam bir açıklamasını burada](/tr/learn/scaling-up-with-reducer-and-context) bulabilirsiniz.

<Sandpack>

```js App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
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
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
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
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js TaskList.js
import { useState, useContext } from 'react';
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
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
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
        Delete
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

</Recipes>

---

### Varsayılan geri dönüş değerini belirleme {/*specifying-a-fallback-default-value*/}

Eğer React, üst ağaçta o belirli <CodeStep step={1}>context</CodeStep> sağlayan bir sağlayıcı bulamazsa, `useContext()` tarafından döndürülen context değeri, o context [oluşturduğunuzda belirttiğiniz varsayılan değer](/reference/react/createContext) ile aynı olacaktır:

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

Varsayılan değer **asla değişmez**. Eğer context'i güncellemek istiyorsanız, yukarıda açıklandığı gibi durumu kullanın.

Genellikle `null` yerine varsayılan olarak kullanabileceğiniz bir değer vardır örneğin:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

Bu şekilde, yanlışlıkla uygun bir sağlayıcı olmadan bazı bileşenleri oluşturursanız, kırılmaz. Ayrıca, bileşenlerinizin test ortamında birçok sağlayıcı ayarlamadan iyi çalışmasına yardımcı olur.

Aşağıdaki örnekte "Temayı değiştir" butonu her zaman açık renkli olarak görüntülenir çünkü herhangi bir tema context'i sağlayıcısı **dışında** yer alır ve varsayılan context teması değeri `'açık'`tır. Varsayılan temayı `'koyu'` olarak düzenlemeyi deneyin.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext.Provider value={theme}>
        <Form />
      </ThemeContext.Provider>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Toggle theme
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Ağacın bir kısmında context'i geçersiz kılma {/*overriding-context-for-a-part-of-the-tree*/}

Ağacın bir kısmı için context'i farklı bir değerle sağlayan bir sağlayıcıya sararak, context'i değiştirebilirsiniz.

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

İhtiyacınız olan kadar sağlayıcıları iç içe yerleştirip geçersiz kılabilirsiniz.

<Recipes title="Context'in geçersiz kılınması örnekleri">

#### Temanın geçersiz kılınması {/*overriding-a-theme*/}

Burada `Footer` içindeki buton, dışındaki butonlardan (`"dark"`) farklı bir context değeri (`"light"`) alır.

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext.Provider value="light">
        <Footer />
      </ThemeContext.Provider>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Settings</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Otomatik olarak iç içe başlıklar {/*automatically-nested-headings*/}

İç içe geçmiş contextleri yuvalayarak bilgi biriktirebilirsiniz. Bu örnekte, `Section` bileşeni `LevelContext`i tutar, bu belirtir alt bölüm yuvalama derinliğini. Alt bölümden `LevelContext` okur ve bu numarayı bir artırmış olarak alt elemanlarına sağlar. Sonuç olarak, `Heading` bileşeni, iç içe kaç `Section` bileşenine sahip olduğuna bağlı olarak hangi `<h1>`,`<h2>`,`<h3>`,`...` etiketlerinin kullanılacağını otomatik olarak karar verebilir.

Bu örneğin [ayrıntılı bir açıklamasını](/learn/passing-data-deeply-with-context) okuyun.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Nesneler ve fonksiyonları geçirirken tekrar render işlemlerini optimize etmek {/*nesneler-ve-fonksiyonları-geçirirken-tekrar-render-işlemlerini-optimize-etmek*/}

Herhangi bir değeri, nesne veya fonksiyon dahil, context aracılığıyla iletebilirsiniz. 

```js [[2, 10, "{ currentUser, login }"]] 
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      <Page />
    </AuthContext.Provider>
  );
}
```

Burada, <CodeStep step={2}>context değeri</CodeStep> iki özellikli bir JavaScript nesnesidir ve bunlardan biri bir fonksiyondur. `MyApp` yeniden render edildiğinde (örneğin, bir rota güncellendiğinde) bu, *farklı* bir fonksiyona işaret eden *farklı* bir nesne olacaktır, bu nedenle derin ağaçta `useContext(AuthContext)` çağıran tüm bileşenlerin de yeniden render edilmesi gerekecektir.

Daha küçük uygulamalarda, bu bir sorun değildir. Ancak, `currentUser` gibi altta yatan veriler değişmediyse, bunları yeniden render etmek gerekli değildir. React'ın bu gerçekten faydalanabilmesine yardımcı olmak için, `login` fonksiyonunu [`useCallback`](/reference/react/useCallback) ile sarmalayabilir ve nesne oluşturmayı [`useMemo`](/reference/react/useMemo) ile sarmalayabilirsiniz. Bu bir performans optimizasyonudur:

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

Bu değişiklik sonucunda, `MyApp` yeniden render edilse bile, `useContext(AuthContext)` çağıran bileşenler, `currentUser` değişmediği sürece yeniden render edilmeyecektir.

[`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) ve [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) hakkında daha fazla bilgi edinin.

---

## Sorun Giderme {/*troubleshooting*/}

### Bileşenim sağlayıcının değerini görmüyor {/*my-component-doesnt-see-the-value-from-my-provider*/}

Bunun birkaç yaygın sebebi vardır:

1. `useContext()`'i çağırdığınız bileşenle aynı bileşende `<SomeContext.Provider>`bu bileşeni render ediyorsunuz. `SomeContext.Provider`'ı `useContext()` çağıran bileşenin üstüne ve dışına taşıyın.
2. Bileşeninizi `SomeContext.Provider` ile sarmalamayı unuttunuz veya düşündüğünüzden farklı bir yerde yerleştirdiniz. [React DevTools](/learn/react-developer-tools) kullanarak hiyerarşinin doğru olup olmadığını kontrol edin.
3. Sembolik bağlantılar kullanıyorsanız veya başka bir nedenle sağlayan bileşenin gördüğü `SomeContext`'ın, okuyan bileşenin gördüğü `SomeContext`'tan farklı olmasına neden olan bir yapılandırma sorunu ile karşılaşabilirsiniz. Bu, `window.SomeContext1` ve `window.SomeContext2` gibi global değişkenlere atayarak ve ardından konsolda `window.SomeContext1 === window.SomeContext2` gibi bir kontrol yaparak doğrulayabilirsiniz. Eğer aynı değillerse, yapılandırma sorununu düzeltin.

### Default değer farklı olsa da her zaman context'den `undefined` değerini alıyorum {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

Ağacınızda `value` belirtmeksizin bir sağlayıcı olabilir:

```js {4}
const MyContext = React.createContext('default');

function MyComponent() {
  const value = useContext(MyContext);
  // ...
}
```

`value` belirtmeyi unutursanız, sanki `value={undefined}` geçirmişsiniz gibi davranılır.

Ayrıca, farklı bir özellik adı yanlışlıkla kullanmış da olabilirsiniz:

```js {1,2}
// 🚩 Çalışmaz: özellik "value" olarak adlandırılmalı
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

Bu durumlarda, React tarafından konsolda bir uyarı görmeniz gerektiğini unutmayın. Bunları düzeltmek için özelliği `value` olarak adlandırın:

```js {1,2}
// ✅ value özelliğini kullanarak geçirme
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

Önemli bir not olarak, [varsayılan değerinizin (`createContext` çağrısındaki `defaultValue`)](#specifying-a-fallback-default-value) yalnızca **hiçbir eşleşen sağlayıcı yoksa** kullanılacağına dikkat edin. Alt ağaçta bir `<SomeContext.Provider value={undefined}>` bileşeni varsa, `useContext(SomeContext)` çağrısını yapan bileşen `undefined` olarak context değerini alacaktır.
