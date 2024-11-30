---
title: Kurulum
---

<Intro>

React, baştan sona aşamalı olarak benimsenmesi için tasarlandı. React’i ihtiyacınız kadar az veya çok kullanabilirsiniz. React'in tadına bakmak, basit bir HTML sayfasına biraz etkileşim eklemek veya karmaşık bir React destekli uygulamaya başlamak istiyorsanız, bu bölüm başlamanıza yardımcı olacaktır.

</Intro>

<YouWillLearn isChapter={true}>

* [Bir HTML sayfasına React nasıl eklenir](/learn/add-react-to-a-website)
* [Bağımsız bir React projesine nasıl başlanır](/learn/start-a-new-react-project)
* [Editörünüzü nasıl kurarsınız](/learn/editor-setup)
* [React Developer Tools nasıl kurulur](/learn/react-developer-tools)

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

Çevrimiçi kod oyun alanlarını bu dokümanlarda eğitim yardımcıları olarak kullanıyoruz. Çevrimiçi kod oyun alanları, React'in nasıl çalıştığını anlamanıza ve React'in sizin için doğru olup olmadığı konusunda karar vermenize yardımcı olabilir. React dokümanlarının dışında, React'i destekleyen birçok çevrimiçi kod oyun alan var: örneğin, [CodeSandbox](https://codesandbox.io/s/new), [Stackblitz](https://stackblitz.com/fork/react), veya [CodePen](https://codepen.io/pen?template=QWYVwWN).

### React'i kendi bilgisayarınızda deneyin {/*try-react-locally*/}

React'i bilgisayarınızda yerel olarak denemek için, [bu HTML sayfasını indirın](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html). Editörünüzde ve tarayıcınızda açın!

## Bir sayfaya React ekleyin {/*add-react-to-a-page*/}

Mevcut bir site üzerinde çalışıyorsanız ve biraz React eklemeniz gerekiyorsa, [bir script etiketi ile React ekleyebilirsiniz](/learn/add-react-to-a-website).

## Bir React projesi oluşturun {/*start-a-react-project*/}

Eğer [bağımsız bir React projesine](/learn/start-a-new-react-project) başlamaya hazırsanız, tatlı bir geliştirici deneyimi için minimal bir araç zinciri kurabilirsiniz. Ayrıca, halihazırda sizin için birçok karar veren bir çatı ile de başlayabilirsiniz.

## Sonraki adımlar {/*next-steps*/}

Her gün karşılaşacağınız en önmeli React konseptlerini görmek için [Hızlı Başlangıç](/learn) rehberini ziyaret edin!

