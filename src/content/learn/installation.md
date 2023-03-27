---
title: Kurulum
---

<Intro>

React, baştan sona aşamalı olarak benimsenmesi için tasarlandı. React’i ihtiyacınız kadar az veya çok kullanabilirsiniz. React'in tadına bakmak, basit bir HTML sayfasına biraz etkileşim eklemek veya karmaşık bir React destekli uygulamaya başlamak istiyorsanız, bu bölüm başlamanıza yardımcı olacaktır.

</Intro>

<YouWillLearn isChapter={true}>

* [How to start a new React project](/learn/start-a-new-react-project)
* [How to add React to an existing project](/learn/add-react-to-an-existing-project)
* [How to set up your editor](/learn/editor-setup)
* [How to install React Developer Tools](/learn/react-developer-tools)

</YouWillLearn>

## React'i deneyin {/*try-react*/}

React ile vakit geçirmek için herhangi bir şey yüklemeniz gerekmez. Bu çevrimiçi kod oyun alanını düzenlemeyi deneyin!

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Selam, {name}</h1>;
}

export default function App() {
  return <Greeting name="Yunus" />
}
```

</Sandpack>

Çevrimiçi kod oyun alanlarını bu dokümanlarda eğitim yardımcıları olarak kullanıyoruz. Çevrimiçi kod oyun alanları, React'in nasıl çalıştığını anlamanıza ve React'in sizin için doğru olup olmadığı konusunda karar vermenize yardımcı olabilir. React dokümanlarının dışında, React'i destekleyen birçok çevrimiçi kod oyun alan var: örneğin, [CodeSandbox](https://codesandbox.io/s/new), [Stackblitz](https://stackblitz.com/fork/react), veya [CodePen](
https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb).

### React'i kendi bilgisayarınızda deneyin {/*try-react-locally*/}

React'i bilgisayarınızda yerel olarak denemek için, [bu HTML sayfasını indirın](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html). Editörünüzde ve tarayıcınızda açın!

To try React locally on your computer, [download this HTML page.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Open it in your editor and in your browser!

## Start a new React project {/*start-a-new-react-project*/}

If you want to build an app or a website fully with React, [start a new React project.](/learn/start-a-new-react-project)

## Add React to an existing project {/*add-react-to-an-existing-project*/}

If want to try using React in your existing app or a website, [add React to an existing project.](/learn/add-react-to-an-existing-project)

Her gün karşılaşacağınız en önmeli React konseptlerini görmek için [Hızlı Başlangıç](/learn) rehberini ziyaret edin!

