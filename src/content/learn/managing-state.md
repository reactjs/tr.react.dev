---
title: State'i Yönetme
---

<Intro>

Uygulamanız büyüdükçe, state'inizin nasıl düzenlendiği ve bileşenleriniz arasında veri akışının nasıl olduğu konusunda daha bilinçli olmanız size yardımcı olur. Gereksiz ve yenilenen state, yaygın bir hata kaynağıdır. Bu bölümde, state'inizi nasıl iyi yapılandıracağınızı, state güncelleme mantığınızı nasıl sürdürülebilir tutacağınızı ve uzak bileşenler arasında state'i nasıl paylaşacığınızı öğreneceksiniz.

</Intro>

<YouWillLearn isChapter={true}>

* [UI değişiklikleri nasıl state değişikliği olarak düşünülür](/learn/reacting-to-input-with-state)
* [State nasıl iyi yapılandırılabilir](/learn/choosing-the-state-structure)
* [Bileşenler arasında paylaşmak için state nasıl "yukarı kaldırılır"](/learn/sharing-state-between-components)
* [State'in korunup korunmayacağı ya da sıfırlanıp sıfırlanmayacağı nasıl kontrol edilir](/learn/preserving-and-resetting-state)
* [Karmaşık state mantığı bir fonksiyonda nasıl birleştirilir](/learn/extracting-state-logic-into-a-reducer)
* ["Prop drilling" yapmadan bilgi nasıl iletilir](/learn/passing-data-deeply-with-context)
* [Uygulamanız büyüdükçe state yönetimi nasıl ölçeklenidirilir](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## State ile girdiye reaksiyon verme {/*reacting-to-input-with-state*/}

React ile kullanıcı arayüzünü direkt olarak koddan modifiye etmeyeceksiniz. Örneğin, "butonu devre dışı bırak", "butonu etkinleştir", "başarılı mesajını göster" gibi komutlar yazmayacaksınız. Onun yerine, bileşeninizin farklı görsel state'leri ("başlangıç state'i", "yazma state'i", "başarı state'i") için görmek istediğiniz kullanıcı arayüzünü tanımlayacak ve ardından kullanıcı girdisine yanıt olarak state değişikliklerini tetikleyeceksiniz. Bu, tasarımcıları kullanıcı arayüzünü nasıl düşündüğüyle benzerdir.

Aşağıda React ile yapılmış bir kısa sınav formu vardır. Gönder butonunun etkinleştirilip etkinleştirilmeyeceğini ve bunun yerine başarı mesajının gösterilip gösterilmeyeceğini belirlemek için `status` durum değişkeninin nasıl kullanıldağına dikkat edin.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>Doğru!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>Şehir sorusu</h2>
      <p>
        İki kıta üzerinde konumlanmış şehir hangisidir?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Gönder
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Ağa istek atıyormuş gibi yapalım.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'istanbul'
      if (shouldError) {
        reject(new Error('İyi tahmin ama yanlış cevap. Tekrar dene!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

**[Girdiye State ile Reaksiyon Verme](/learn/reacting-to-input-with-state)** sayfasını okuyarak etkileşimlere state odaklı zihniyetle nasıl yaklaşılacağını öğrenebilirsiniz.

</LearnMore>

## State yapısını seçme {/*choosing-the-state-structure*/}

State'i iyi yapılandırmak, değiştirmesi ve hata ayıklaması keyfli bir bileşen ile sürekli hata kaynağı olan bir bileşen arasında fark yaratabilir. En önemli ilke, state'in gereksiz veya yinelenen bilgiler içermemesidir. Gereksiz state varsa, güncellemeyi unutmak ve hatalara neden olmak kolaydır!

Örneğin, bu form **gereksiz** bir `fullName` state değişkenine sahip:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Hadi bilgilerinizi girelim</h2>
      <label>
        Adın:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Soyadın:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Biletiniz şu kişiye düzenlenecek: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Bileşen render edilirken `fullName`'i hesaplayarak state'i kaldırabilir ve kodu basitleştirebilirsiniz:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Hadi bilgilerinizi girelim</h2>
      <label>
        Adın:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Soyadın:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Biletiniz şu kişiye düzenlenecek: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Bu küçük bir değişiklik gibi görünebilir ama React uygulamalarındaki bir çok hata bu şekilde düzeltilir.

<LearnMore path="/learn/choosing-the-state-structure">

**[State Yapısını Seçme](/learn/choosing-the-state-structure)** sayfasını okuyarak hatalardan kaçınmak için state'i nasıl yapılandıracağınızı öğrenebilirsiniz.

</LearnMore>

## Bileşenler arasında state'i paylaşma {/*sharing-state-between-components*/}

Bazen, iki bileşenin state'inin birlikte değişmesini istersiniz. Bunu yapmak için, her ikisinin de state'ini kaldırın, state'i en yakın ortak üst bileşene taşıyın ve sonra iki bileşene prop'lar ile iletin. Bu "state'i yukarı kaldırmak" olarak bilinir ve React kodu yazarken en çok yapacağınız şeylerden biridir.

Bu örnekte, aynı anda sadece bir panel aktif olmalıdır. Bunu başarmak için, aktif state'i her bir panelin içinde tutmak yerine, üst bileşen state'i tutar ve alt bileşenler için prop'ları belirler.

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Ankara, Türkiye</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Ankara, Türkiye'nin başkenti ve İstanbul'dan sonra en kalabalık ikinci ilidir.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        Belgelere dayanmayan ve günümüze kadar gelen söylentilere göre tarihte bahsedilen ilk adı Galatlar tarafından verilen ve Yunanca "çapa" anlamına gelen <i lang="el">Ankyra</i>'dır. Bu isim zamanla değişerek Ancyre, Engüriye, Engürü, Angara, Angora ve nihayet Ankara olmuştur.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Göster
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

**[Bileşenler Arasında State Paylaşımı](/learn/sharing-state-between-components)** sayfasını okuyarak state'i nasıl yukarı kaldıracağınızı ve bileşenleri senkronize tutacağınızı öğrenebilirsiniz.

</LearnMore>

## State'i korumak ve resetlemek {/*preserving-and-resetting-state*/}

Bir bileşeni yeniden render ettiğinizde, React, ağacın hangi kısımlarını tutacağın (ve güncelleyeciğine) ve hangi kısımları atacağına ya da sıfırdan yeniden oluşturacağına karar vermelidir. Pek çok durumda, React'in otomatik davranışı yeterince iyi çalışmaktadır. Varsayılan olarak React, ağacın daha önce render edilmiş bileşen ağacıyla "eşleşen" kısımlarını korur.

Ancak, bazen bunu istemezsiniz. Bu sohbet uygulamasında, bir mesaj yazmak ve ardından alıcıyı değiştirmek girdiyi sıfırlamamaktadır. Bu kullanıcının kazara yanlış kişiye mesaj göndermesine neden olabilir:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Ayşe', email: 'ayse@mail.com' },
  { name: 'Zeynep', email: 'zeynep@mail.com' },
  { name: 'Ahmet', email: 'ahmet@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={contact.name + " ile sohbet et"}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>{contact.email} adresine gönder</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

React, varsayılan davranışı geçersiz kılmanıza ve bir bileşene `<Chat key={email} />` gibi farklı bir `key` ileterek state'i sıfırlamaya *zorlamanıza* izin verir. Bu React'e, eğer alıcı farklı ise, yeni verilerle (ve girdiler gibi kullanıcı arayüzüyle) sıfırdan yeniden render edilmesi gereken *farklı* bir `Chat` bileşeni olarak kabul edilmesi gerektiğini söyler. Şimdi alıcılar arasında geçiş yapmak, aynı bileşeni render etseniz bile girdi alanını sıfırlar.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Ayşe', email: 'ayşe@mail.com' },
  { name: 'Zeynep', email: 'zeynep@mail.com' },
  { name: 'Ahmet', email: 'ahmet@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={contact.name + " ile sohbet et"}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>{contact.email} adresine gönder</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

<LearnMore path="/learn/preserving-and-resetting-state">

**[State'i Korumak ve Sıfırlamak](/learn/preserving-and-resetting-state)** sayfasını okuyarak state'in ömrünü ve onu nasıl kontrol edebileceğinizi öğrenebilirsiniz.

</LearnMore>

## State mantığını bir reducer'a aktarma {/*extracting-state-logic-into-a-reducer*/}

Birçok olay yöneticisine yayılmış çok fazla sayıda state güncellemesine sahip bileşenler can sıkıcı olabilir. Bu gibi durumlarda tüm state güncelleme mantıklarını "reducer (redüktör)" adı verilen tek bir fonksiyonda birleştirebilirsiniz. Olay yönetecileriniz, yalnızca kullanıcı "eylemlerini" belirttikleri için kısa ve öz hale gelir. Dosyanın en altında, reducer fonksiyonu her bir eyleme yanıt olarak state'in nasıl güncellenmesi gerektiğini belirtir!

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
      <h1>Prag Gezisi Planı</h1>
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
  { id: 0, text: 'Kafka Müzesini ziyaret et', done: true },
  { id: 1, text: 'Kukla gösterisi izle', done: false },
  { id: 2, text: "Lennon Duvarı'nda fotoğraf çek", done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Görev ekle"
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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

**[State Mantığını Bir Reducer'a Aktarma](/learn/extracting-state-logic-into-a-reducer)** sayfasını okuyarak reducer fonksiyonunda mantığın nasıl birleştirileceğini öğrenebilirsiniz.

</LearnMore>

## Context ile veriyi derinlemesine aktarma {/*passing-data-deeply-with-context*/}

Bilgiyi genelde prop’lar vasıtasıyla üst elemandan alt elemana doğru aktarırsınız. Ancak, aktarmanız gereken bileşen ulaşana kadar birçok ara bileşene iletmeniz veya birden çok bileşene aktarmanız gerekiyorsa prop kullanmak zahmetli ve karmaşık hale gelir. Context, bilgiyi üst bileşenden ihtiyaç duyan alt bileşenlere (derinliğine bakılmaksızın) prop olarak açıkça belirtmeden iletmenizi sağlar.

Burada, `Heading` bileşeni başlık seviyesini en yakın `Section`'a seviyesini "sorarak" belirler. Her `Section`, üst `Section`'a sorarak ve ona bir tane ekleyerek kendi seviyesini takip eder. Her `Section`, tüm alt bileşenlerine prop aktarmadan bilgi sağlar ve bunu context aracılığıyla yapar.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Üst Başlık</Heading>
      <Section>
        <Heading>Başlık</Heading>
        <Heading>Başlık</Heading>
        <Heading>Başlık</Heading>
        <Section>
          <Heading>Alt-başlık</Heading>
          <Heading>Alt-başlık</Heading>
          <Heading>Alt-başlık</Heading>
          <Section>
            <Heading>Alt-alt-başlık</Heading>
            <Heading>Alt-alt-başlık</Heading>
            <Heading>Alt-alt-başlık</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
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

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading bir Section içinde olmak zorundadır!');
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
      throw Error('Bilinmeyen seviye: ' + level);
  }
}
```

```js src/LevelContext.js
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

<LearnMore path="/learn/passing-data-deeply-with-context">

 **[Context ile Veriyi Derinlemesine Aktarma](/learn/passing-data-deeply-with-context)** sayfasını okuyarak prop iletmesine alternatif olarak context'i nasıl kullanacağınızı öğrenebilirsiniz.

</LearnMore>

## Reducer ve context ile ölçeklendirme {/*scaling-up-with-reducer-and-context*/}

Reducer’lar bir bileşenin state güncelleme mantığını bir araya getirmenizi sağlar. Context, bilgileri diğer bileşenlere derinlemesine iletmeye olanak tanır. Reducer’ları ve context’i bir araya getirerek karmaşık bir ekranın state’ini yönetebilirsiniz.

Bu yaklaşımla birlikte, karmaşık state'e sahip bir üst bileşen bunu bir reducer ile yönetir. Ağacın herhangi bir yerindeki diğer bileşenler context aracılığıyla state'i okuyabilir. Ayrıca bu state'i güncellemek için eylemler de dispatch edebilirler.

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
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider
        value={dispatch}
      >
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
      throw Error('Bilinmeyen eylem: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Tarihi Yarımada Yürüyüşü', done: true },
  { id: 1, text: 'Galata Kulesi Ziyareti', done: false },
  { id: 2, text: 'Türk kahvesi iç', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Görev ekle"
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

**[Reducer ve Context ile Ölçeklendirme](/learn/scaling-up-with-reducer-and-context)** sayfasını okuyarak büyüyen bir uygulamada state yönetiminin nasıl ölçeklendirildiğini öğrenin.

</LearnMore>

## Sırada ne var? {/*whats-next*/}

[Girdiye State ile Reaksiyon Verme](/learn/reacting-to-input-with-state) sayfasına giderek okumaya başlayın!

Ya da, bu konulara zaten aşina iseniz, neden [Kaçış Yolları](/learn/escape-hatches) sayfasını okumuyorsunuz?
