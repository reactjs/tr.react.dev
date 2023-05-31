---
title: State'i Korumak ve Sıfırlamak
---

<Intro>

State bileşenler arasında izole bir şekildedir. React, kullanıcı arayüzü (UI) ağacındaki yerlerine göre hangi state'in hangi bileşene ait olduğunu takip eder. Yeniden renderlar arasında state'in ne zaman korunacağını ve ne zaman sıfırlanacağını kontrol edebilirsiniz.

</Intro>

<YouWillLearn>

* React bileşen yapılarına nasıl "görür"
* React state'i korumayı ya da sıfırlamaya ne zaman seçer
* React'i bileşenin state'ini sıfırlamaya nasıl zorlanır
* Anahtarlar ve türler state'in korunup korunmamasını nasıl etkiler

</YouWillLearn>

## Kullanıcı arayüzü (UI) ağacı {/*the-ui-tree*/}

Tarayıcılar, kullanıcı arayüzünü modellemek için pek çok ağaç yapıları kullanırlar. [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) HTML elementlerini temsil eder, [CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model) aynı şeyi CSS için yapar. Bir [Erişilebilirlik ağacı](https://developer.mozilla.org/docs/Glossary/Accessibility_tree) bile var!

React, oluşturduğunuz kullanıcı arayüzünü yönetmek ve modellek için ağaç yapılarını da kullanır. React, JSX'inizden **kullanıcı arayüzü ağaçları** oluşturur. Ardından React DOM, tarayıcı DOM elementlerini güncelleyerek kullanıcı arayüzü ağacı ile eşleşmesini sağlar. (React Native bu ağaçları mobil platformlara özgü elementlere çevirir.)

<DiagramGroup>

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Yatay olarak düzenlenmiş üç bölümden oluşan diyagram. İlk bölümde, 'A Bileşeni', 'B bileşeni' ve 'C Bileşeni' olarak isimlendirilmiş dikey olarak istiflenmiş üç dikdörtgen vardır. Bir sonraki bölüme geçişi işaret eden React olarak isimlendirilmiş ve üstünde React logosu olan bir ok vardır. Orta bölümde bir bileşen ağacı vardır. Kök 'A'olarak ve iki alt eleman 'B' ve 'C' olarak isimlendirilmiştir. Bir sonraki bölüme geçiş yine React olarak isimlendirilmiş ve üstüne React logosu olan bir okla gösterilmiştir. Üçüncü ve son bölüm ise yalnızca bir alt kümenin vurgulandığı (orta bölümden alt ağacı gösteren) 8 node'dan oluşan ağaç gösteren bir tarayıcı wireframe'idir.">

React bileşenlerden, React DOM'un DOM'u render etmek için kullandığı bir kullanıcı arayüzü ağacı oluşturur

</Diagram>

</DiagramGroup>

## State ağaçta bir konuma bağlıdır {/*state-is-tied-to-a-position-in-the-tree*/}

Bir bileşene state verdiğiniz zaman state'in bileşen içinde "yaşadığını" düşünebilirsiniz. Aslında state, React içinde tutulur. React tuttuğu her bir state parçasını, bileşenin kullanıcı arayüzü ağacında bulunduğu yere göre doğru bileşenle ilişkilendirir.


Örneğin burada yalnızca bir `<Counter />` JSX tag'i vardır, ancak bu tag iki farklı konumda render edilir:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle 
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Aşağıdaki diyagramda ağaç olarak görülmektedir:     

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="React bileşenleri ağacının diyagramı. Kök node 'div' olarak isimlendirilmiş ve iki alt elemana sahip. Alt elemanların her ikisi de 'Counter' olarak isimlendirilmiş ve her ikisi de 0 değerine eşit 'count' olarak isimlendirilmiş bir state baloncuğu içerir.">

React ağacı

</Diagram>

</DiagramGroup>

**Bu sayaçlar iki farklı sayaçtır çünkü her ikisi de ağaçta kendi konumunda render edilir.** Genellikle React'i kullanmak için bu konumları düşünmeniz gerekmez, ancak çalışma mantığını anlamak faydalı olabilir.

React'te, ekrandaki her bileşenin içindeki state'ler izole bir şekildedir. Örneğin, iki `Counter` bileşenini yan yana render ederseniz, her birinin kendi bağımsız `score` ve `hover` state'leri olacaktır.

Her iki sayaca da tıklayın ve birbirlerini etkilemediklerini görün:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle 
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Gördüğünüz gibi, bir sayaç güncellendiği zaman sadece o bileşenin state'i güncellenmektedir:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="React bileşenleri ağacının diyagramı. Kök node 'div' olarak adlandırılmış ve iki alt elemana sahip. Soldaki alt eleman 'Counter' olarak adlandırılmış ve 0 değerine eşit 'count' olarak adlandırılmış bir state baloncuğu içerir. Sağdaki alt eleman 'Counter' olarak adlandırılmış ve 1 değerine eşit 'count' olarak adlandırılmış bir state baloncuğu içerir. Sağdaki alt elemanın state baloncuğu, değerinin güncellendiğini belirtmek için sarı renkle vurgulanmış.">

State'in güncellenmesi

</Diagram>

</DiagramGroup>


React, aynı bileşeni aynı konumda render ettiğiniz sürece state'i koruyacaktır. Bunu görmek için her iki sayacı da artırın, ardından "İkinci sayacı render et" kutusunun işaretini kaldırarak ikinci bileşeni kaldırın ve ardından kutuyu tekrar işaretleyerek bileşeni yeniden render edin:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        İkinci sayacı render et
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

İkinci sayacı render etmeyi bıraktığınız anda state'in nasıl tamamen kaybolduğuna dikkat edin. Bunun nedeni, React'in bir bileşeni kaldırdığı zaman o bileşenin state'ini yok etmesidir.

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="React bileşenleri ağacının diyagramı. Kök node 'div' olarak adlandırılmış ve iki alt elemana sahip. Soldaki alt eleman 'Counter' olarak adlandırılmış ve 0 değerine eşit 'count' olarak adlandırılmış bir state baloncuğu içerir. Sağdaki alt eleman eksik ve onun yerine, ağaçtan silinmekte olan bileşeni gösteren sarı bir 'puf' resmi var.">

Bileşenin silinmesi

</Diagram>

</DiagramGroup>

"İkinci sayacı render et" kutucuğunu işaretlediğinizde, ikinci bir `Counter` ve state'i sıfırdan oluşturulur (`score = 0`) ve DOM'a eklenir.

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="React bileşenleri ağacının diyagramı. Kök node 'div' olarak adlandırılmış ve iki alt elemana sahip. Soldaki alt eleman 'Counter' olarak adlandırılmış ve 0 değerine eşit 'count' olarak adlandırılmış bir state baloncuğu içerir. Sağdaki alt eleman 'Counter' olarak adlandırılmış ve 0 değerine eşit 'count' olarak adlandırılmış bir state baloncuğu içerir. Sağdaki alt eleman node'unun tamamı, ağaca yeni eklendiğini göstermek için sarı renkle vurgulanmış.">

Bileşen eklemek

</Diagram>

</DiagramGroup>

**React, aynı bileşeni kullanıcı arayüzü ağacında aynı konumda render ettiğiniz sürece state'i koruyacaktır.** Bileşen kaldırılırsa ya da aynı konumda başka bir bileşen render edilirse, React state'i yok edecektir.

## Aynı konumdaki aynı bileşen state'i korur {/*same-component-at-the-same-position-preserves-state*/}

Bu örnekte iki farklı `<Counter />` elementi var:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Süslü stili kullan
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Kutucuğu işaretlediğinizde veya işareti kaldırdığınızda, sayacın state'i sıfırlanmaz. `isFancy` ister `true` ister `false` olsun, kök `App` bileşeninden döndürülen `div`'in ilk alt elemanı her zaman bir `<Counter />` bileşenidir:

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Aralarındaki bir okla ayrılmış iki bölümden oluşan diyagram. Her bölüm, isFancy etiketli bir state baloncuğu içeren 'App' etiketli bir üst elemana sahip bir bileşen düzeni içerir. Bu bileşenin 'div' etiketli bir alt elemanı vardır ve bu tek alt elemana aktarılan isFancy değerini (mor renkle vurgulanmış) içeren bir prop baloncuğu içerir. Son alt eleman 'Counter' olarak etiketlenmiştir ve her iki diyagramda da 3 değerine eşit 'counter' etiketli bir state baloncuğu vardır. Diyagramın sol bölümünde hiçbir şey vurgulanmamış ve isFancy üst eleman state değeri false'tur. Diyagramın sağ bölümünde, isFancy üst eleman state değeri true olarak değişmiş ve sarı renkle vurgulanmıştır. Aynı zamanda isFancy değeri değişen prop baloncuğu da sarı renkle vurgulanmıştır.">

`App` state'inin güncellenmesi `Counter`'ı sıfırlamaz çünkü `Counter` aynı konumda kalmaktadır

</Diagram>

</DiagramGroup>


Bu, aynı konumdaki aynı bileşendir, bu nedenle React'in bakış açısından aynı sayaçtır.

<Pitfall>

**React için önemli olanın JSX markup'ındaki değil, kullanıcı arayüzü ağacındaki konumun olduğunu unutmayın!** Bu bileşen isFancy state değerine göre, `if` koşulu ile farklı `<Counter />` bileşenleri döndürmektedir:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Süslü stili kullan
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Süslü stili kullan
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Kutucuğa tıkladığınız zaman state'in sıfırlanmasını bekliyor olabilirsiniz ancak state sıfırlanmıyor! Bunun nedeni **her iki `<Counter />` elementi de aynı konumda render edilmektedir.** React, fonksiyonunuzda koşullu ifadeleri nereye koyduğunuz bilmez. React'in tüm "gördüğü" döndürdüğünüz ağaçtır.

Her iki durumda da, `App` bileşeni ilk alt eleman olarak `<Counter />` bileşenini içeren bir `<div>` döndürür. React'e göre, bu iki sayaç da aynı "adrese" sahiptir: kökün ilk alt elemanının ilk alt elemanı. React, mantığınızı nasıl yapılandırdığınıza bakmaksızın bunları önceki ve sonraki renderlar arasında bu şekilde eşleştirir.

</Pitfall>

## Aynı konumdaki farklı bileşenler state'i sıfırlar {/*different-components-at-the-same-position-reset-state*/}

Bu örnekte kutucuğa tıkalamak, `<Counter>` bileşenini `<p>` ile değiştirecektir:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>Hadi görüşürüz!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Mola ver
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Burada, aynı konumda _farklı_ bileşen türleri arasında geçiş yaparsınız. Başlangıçta, `<div>` elementinin ilk alt elemanı bir `Counter` içermekteydi. Ancak bunu bir `p` ile değiştirdiğiniz zaman React `Counter`'ı kullanıcı arayüzünden kaldırır ve state'ini yok eder.

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Üç bölümden oluşan ve bölümler arasında okla geçişi gösteren bir diyagram. İlk bölüm, 3 değerine sahip 'count' etiketli bir state baloncuğu içeren 'Counter' etiketli tek bir alt elemana sahip 'div' etiketli bir React bileşeni içerir. Orta bölüm aynı 'div' üst elemanına sahiptir ancak alt bileşen silinmiştir ve sarı bir 'puf' resmiyle gösterilmiştir. Üçüncü bölümde de aynı 'div' üst elemanı vardır ama sarı renkle vurgulanmış 'p' etiketli yeni bir alt eleman içermektedir.">

`Counter` `p` ile değiştiği zaman, `Counter` silinir ve `p` eklenir

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Üç bölümden oluşan ve bölümler arasında okla geçişi gösteren bir diyagram. İlk bölüm 'p' etiketli bir React bileşeni içerir. Orta bölüm aynı 'div' üst elemanına sahiptir ancak alt bileşen silinmiştir ve sarı bir 'puf' resmiyle gösterilmiştir. Üçüncü bölüm yine aynı 'div' üst elemanına sahiptir ancak şimdi sarı ile vurgulanmış 0 değerine sahip 'count' etiketli state baloncuğu içeren 'Counter' etikletli yeni bir alt eleman içerir.">

Geri dönerken, `p` silinir ve `Counter` eklenir

</Diagram>

</DiagramGroup>

Aynı zamanda, **aynı konumda farklı bir bileşen render ettiğinizde, tüm alt ağacının (subtree) state'ini sıfırlar.** Nasıl çalıştığını görmek için sayacı artırın ve kutucuğu işaretleyin:

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Süslü stili kullan
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Sayaç state'i kutucuğa tıkladığınız zaman sıfırlanır. Bir `Counter` render etmenize rağmen, `div`'in ilk alt elemanı `div`'den `section`'a dönüşür. Alt eleman olan `div` DOM'dan kaldırıldığında, altındaki ağacın tamamı da (`Counter` ve state'i de dahil olmak üzere) yok edilir.

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Üç bölümden oluşan ve bölümler arasında okla geçişi gösteren bir diyagram. İlk bölüm, 'section' etiketli tek bir alt elemana sahip 'div' etkietli bir React bileşeni içerir. Bu bileşen 3 değerine eşit 'count' etiketli bir state baloncuğu içeren 'Counter' etiketli tek bir alt elemana sahiptir. Orta bölüm aynı 'div' üst elemanına sahiptir, ancak alt bileşenler silinmiştir ve sarı bir 'puf' resmiyle gösterilmiştir. Üçüncü bölüm de aynı 'div'  üst elemanına sahiptir, 0 değerine eşit 'count' etiketli bir state baloncuğu içeren 'Counter' etiketli yeni bir alt eleman içeren 'div' etiketli yeni bir alt elemana sahiptir ve hepsi sarı ile vurgulanmıştır.">

`section` `div`'le değiştiği zaman, `section` silinir ve yerine yeni `div` eklenir

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="DÜç bölümden oluşan ve bölümler arasında okla geçişi gösteren bir diyagram. İlk bölüm, 'div' etiketli tek bir alt elemana sahip 'div' etiketli bir React bileşeni içerir. Bu bileşen, 0 değerine eşit 'count' etiketli bir state baloncuğu içeren 'Counter' etiketli tek bir alt elemana sahiptir. Orta bölüm aynı 'div' üst elemanına sahiptir, ancak alt bileşenler silinmiştir ve sarı bir 'puf' resmiyle gösterilmiştir. Üçüncü bölüm yine aynı 'div' üst elemanına sahiptir, 0 değerine eşit 'count' etiketli state baloncuğu içeren 'Counter' etiketli yeni bir alt eleman içeren 'section' etiketli yeni bir alt elemana sahiptir ve hepsi sarı ile vurgulanmıştır.">

Geri dönerken, `div` silinir ve `section` eklenir

</Diagram>

</DiagramGroup>

Genel bir kural olarak, **yeniden renderler arasında state'i korumak istiyorsanız, ağacınızın yapısının renderlar arasında "eşleşmesi"** gerekmektedir. Eğer yapı farklıysa, state yok edilecektir çünkü React bir bileşeni ağaçtan çıkardığı zaman o bileşenin state'ini yok eder.

<Pitfall>

Bu nedenle bileşen fonksiyonu tanımlarını iç içe yapmamalısınız.

Burada, `MyTextField` bileşen fonksiyonu `MyComponent` *içinde* tanımlanmıştır:

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>{counter} defa tıklandı</button>
    </>
  );
}
```

</Sandpack>


Butona her tıkladığınızda, input state'i kaybolmaktadır! Bunu nedeni, `MyComponent` bileşeni her render edildiğinde *farklı* bir `MyTextField` fonksiyonu oluşturulmaktadır. Aynı konumda *farklı* bir bileşen oluşturuyorsunuz, bu nedenle React aşağıdaki tüm state'leri sıfırlar. Bu, hatalara ve performans sorunlarına yol açar. Bu problemden kaçınmak için To avoid this problem, **bileşen fonksiyonlarını en üstte tanımlayın ve tanımları iç içe yapmayın.**

</Pitfall>

## Aynı konumda state'i sıfırlamak {/*resetting-state-at-the-same-position*/}

Varsayılan olarak React, aynı konumda kalan bir bileşenin state'ini korur. Genellikle istediğimiz davranış budur ve bu yüzden varsayılan olarak böyle davranmaktadır. Ancak bazen bir bileşenin state'ini sıfırlamak isteyebilirsiniz. İki oyuncunun her turda puanlarını takip etmesine izin veren bu uygulamayı ele alalım:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Sonraki oyuncu!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'ın skoru: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Şu anda, oyuncuyu değiştirdiğiniz zaman state korunmaktadır. Her iki `Counter` bileşeni de aynı konumdadır bu yüzden React, `person` prop'u değişmiş *aynı* `Counter` bileşeni olarak görür.

Ancak konsept olarak bu uygulamada iki farklı sayaç olmalıdır. Kullanıcı arayüzüünde aynı konumda görülebilirler ama bir sayaç Taylor için diğer sayaç da Sarah için olmalıdır.

İki sayaç arasında değişirken state'i sıfırlamanın iki yolu vardır:

1. Bileşenleri farklı konumlarda render edin
2. Her bileşene bir `key` prop'u verin


### Seçenek 1: Bileşeni farklı bir konumda render etmek {/*option-1-rendering-a-component-in-different-positions*/}

Eğer bu iki `Counter` bileşeninin bağımsız olmasını istiyorsanız, iki bileşeni farklı konumda render edebilirsiniz:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Sonraki oyuncu!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'ın skoru: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* Başlangıçta `isPlayerA` state'i `true`'dur. Yani ilk konum `Counter` state'ini içerir ve ikincisi  boştur.
* "Sonraki oyuncu" butonuna tıkladığınzda ilk konum temizlenir ancak şimdi ikinci konum `Counter`'ı içerir.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="React bileşenlerinin ağacını içeren diyagram. Üst eleman 'Scoreboard' olarak etiketlenmiş ve 'true' değerine eşit 'isPlayerA' olarak etiketlenmiş state baloncuğuna sahiptir. Tek alt eleman olan 'Counter' sol taraftadır ve 0 değerine eşit 'count' olarak etiketlenmiş state baloncuğuna sahiptir. Soldaki tüm alt eleman eklendiğini belli edecek şekilde sarı ile vurgulanmıştır.">

Başlangıç state'i

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="React bileşenlerinin ağacını içeren diyagram. Üst eleman 'Scoreboard' olarak etiketlenmiş ve 'false' değerine eşit 'isPlayerA' olarak etiketlenmiş state baloncuğuna sahiptir. State baloncuğu state'in değiştiğini belirtmek için sarı ile vurgulanmıştır. Soldaki alt eleman, silindiğini belirten sarı 'puf' resmiyle değiştirilmiş ve sağ taraftaki yeni alt eleman eklendiğini belirtecek şekilde sarı renkle vurgulanmıştır. Yeni alt eleman 'Counter' olarak etiketlenmiştir ve değeri 0'a eşit 'count' olarak etiketlenmiş state baloncuğu içerir.">

"sonraki"'ne tıklamak

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="eact bileşenlerinin ağacını içeren diyagram. Üst eleman 'Scoreboard' olarak etiketlenmiş ve 'true' değerine eşit 'isPlayerA' olarak etiketlenmiş state baloncuğuna sahiptir. tate baloncuğu state'in değiştiğini belirtmek için sarı ile vurgulanmıştır. Sol taraftaki alt eleman yeni eklendiğini belirtecek şekilde sarı ile vurgulanmıştır. Yeni alt eleman 'Counter' olarak etiketlenmiştir ve değeri 0'a eşit 'count' olarak etiketlenmiş state baloncuğu içerir. Sağdaki alt eleman silindiğini belirtecek şekilde sarı 'puf' resmiyle gösterilmiştir.">

Tekrar "sonraki"'ne tıklamak

</Diagram>

</DiagramGroup>

Her `Counter` bileşeni DOM'dan silindiğinde state'i de yok edilir. Bu yüzden butona her tıkladığınızda sıfırlanırlar.

Bu çözüm, aynı konumda render edilen birkaç bağımsız bileşeniniz olduğunda kullanışlıdır. Bu örnekte yalnızca iki bileşeniniz var bu yüzden ikisini de JSX'te ayrı ayrı render etmek zor değildir.

### Seçenek 2: State'i anahtar (key) ile sıfırlamak {/*option-2-resetting-state-with-a-key*/}

Bir bileşenin state'ini sıfırlamanın daha genel başka bir yolu da vardır.

[Rendering lists](/learn/rendering-lists#keeping-list-items-in-order-with-key) sayfasında `key` (`anahtar`) kullanımını görmüş olabilirsiniz. Anahtarlar sadece listeler için değildir! React'in herhangi bir bileşeni ayırt etmesini sağlamak için de anahtarları kullanabilirsiniz. Varsayılan olarak React, bileşenleri ayırt etmek için üst elemandaki sırayı ("ilk sayaç", "ikinci sayaç") kullanır. Ancak anahtarlar, React'e bunun yalnızca *ilk* sayaç veya *ikinci* sayaç değil de belirli bir sayaç olduğunu, örneğin *Taylor'ın* sayacı olduğunu söylemenizi sağlar. Bu şekilde React, ağaçta nerede olursa olsun *Taylor'ın* sayacı olduğunu bilecektir!

Bu örnekte, iki `<Counter />` bileşeni JSX'te aynı yerde olsalar bile aynı state'i paylaşmamaktadırlar.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Sonraki oyuncu!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'ın skoru: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Bir ekle
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Taylor ve Sarah arasında değiştirmek state'i korumamaktadır. Çünkü onlara **farklı key'ler (anahtar) verdiniz:**

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

Bir `key` belirtmek React'e, üst elemandaki sıraları yerine `key`'i konum olarak kullanmasını söyler. Bu nedenle, bileşenleri JSX'te aynı yerde render etseniz bile React onları iki farklı sayaç olarak görecektir ve state'lerini asla paylaşmayacaklardır. Bir sayaç ekranda göründüğü her sefer state'i oluşturulur. Sayaç her silindiğinde ise state'i yok edilir. Aralarında geçiş yapmak , state'lerini tekrar tekrar sıfırlar.

<Note>

Anahtarların (keys) global olarak eşsiz olmadığını unutmayın. Yalnızca *üst eleman içindeki* konumu belirtirler.

</Note>

### Formu anahtar (key) ile sıfırlamak {/*resetting-a-form-with-a-key*/}

State'i anahtar ile sıfırlamak formlarla uğraşırken çok kullanışlıdır.

Bu chat uygulamasında, `<Chat>` bileşeni metin input state'ini içermektedir:

<Sandpack>

```js App.js
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
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
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

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
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

Input'a bir şey yazmayı deneyin ve ardından farklı bir alıcı seçmek için "Alice" veya "Bob" butonuna basın. `<Chat>` bileşeni ağaçta aynı konumda render edildiği için input state'inin korunduğunu göreceksiniz.

**Bir çok uygulamada bu istenen davranış olabilir ancak bu uygulamada değil!** Kullanıcının zaten yazdığı bir mesajı yanlış bir tıklama nedeniyle yanlış bir kişiye göndermesine izin vermek istemezsiniz. Bunu düzeltmek için `key` prop'u ekleyin:

```js
<Chat key={to.id} contact={to} />
```

Bu, farklı bir alıcı seçtiğinizde `Chat` bileşeninin, altındaki ağaçtaki herhangi bir state de dahil olmak üzere sıfırdan yeniden oluşturulmasını sağlar. React ayrıca DOM elementlerini tekrar kullanmak yerine yeniden oluşturur.

Şimdi alıcıyı değiştirmek girilen metni temizleyecektir:

<Sandpack>

```js App.js
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
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
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

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
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

<DeepDive>

#### Silinen bileşenler için state'i korumak {/*preserving-state-for-removed-components*/}

Gerçek bir chat uygulamasında, kullanıcı önceki alıcıyı tekrar seçtiğinde input state'ini kurtarmak istersiniz. Artık görünmeyen bir bileşenin state'ini "canlı" tutmanın birkaç yolu vardır:

- Yalnızca geçerli sohbeti göstermek yerine _tüm_ sohbetleri render edebilir ve kullanmadıklarınızı CSS ile saklayabilirsiniz. Sohbetler ağaçtan silinmezler yani lokal state'leri korunmuş olur. Basit kullanıcı arayüzleri için iyi çalışan bir çözümdür. Ancak gizli ağaçlar büyükse ve çok sayıda DOM node'u içeriyorsa uygulamayı çok yavaşlatabilir.
- [State'i yukarı kaldırabilir](/learn/sharing-state-between-components) ve her alıcı için bekleyen mesajı üst bileşeninde tutabilirsiniz. Bu şekilde, alt bileşenlerin silinmesi önemli değildir çünkü önemli bilgileri tutan üst bileşendir. Bu en çok kullanılan çözümdür.
- React state'ine ek olarak başka bir kaynak da kullanabilirsiniz. Örneğin, kullanıcı yanlışlıkla sayfayı kapatsa bile mesaj taslağının korunmasını isteyebilirsiniz. Bunu yapmak için, `Chat` bileşeninin state'ini [`localStorage'dan`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) okuyabilir ve taslakları da localStorage'a kaydedebilirsiniz.

Hangi stratejiyi seçerseniz seçin, _Alice ile_ sohbet, _Bob ile_ sohbetten kavramsal olarak farklıdır. Bu nedele, `<Chat>` ağacına mevcut alıcıya göre bir `key` (`anahtar`) vermek mantıklıdır.

</DeepDive>

<Recap>

- React, aynı bileşen aynı konumda render edildiği sürece state'i koruyacaktır.
- State, JSX tag'lerinde tutulmaz. JSX'i koyduğunuz ağaç konumu ile alakalıdır.
- Bir alt ağaca farklı bir anahtar (key) vererek state'ini sıfırlamaya zorlayabilirsiniz.
- Bileşen tanımlamalarını iç içe yapmayın, aksi takdir yanlışlıkla state'i sıfırlarsınız.

</Recap>



<Challenges>

#### Kaybolan input metnini düzeltin {/*fix-disappearing-input-text*/}

Bu örnek butona tıkladığınız zaman bir mesaj göstermektedir. Ancak, butona tıkalamak aynı zamanda input'u da sıfırlamaktadır. Sizce bu niye olmakta? Butona tıklamanın input metnini sıfırlamayacağı şekilde düzeltin.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>İpucu: Favori şehriniz?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>İpucunu gizle</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>İpucunu göster</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Burdaki sorun `Form'un` farklı konumlarda render edilmesidir. `if` dalında `<div>`'in ikinci alt elemanıdır, ancak `else` dalında ilk alt elemanıdır. Bu nedenle, her konumdaki bileşen tipi değişir. Birinci konum `p` ve `Form` arasında değişirken, ikinci konum `Form` ve `button` arasında değişir. React, bileşen tipi her değiştiğinde state'i sıfırlar.

En kolay çözüm, `Form'un` her zaman aynı konumda render edilmesi için dalları birleştirmektir:

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>İpucu: Favori şehriniz?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>İpucunu gizle</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>İpucunu göster</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


Teknik olarak, `if` dal yapısıyla eşleşmesi için `else` dalındaki `<Form />'dan` önce `null` ekleyebilirsiniz:

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>İpucu: Favori şehriniz?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>İpucunu gizle</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>İpucunu göster</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

Bu şekilde `Form` her zaman ikinci alt elemandır yani her zaman aynı konumdadır ve state'i korur. Ancak bu yaklaşım daha az belirgindir ve başka birinin bu `null'u` silmesi riskini beraberinde getirir.

</Solution>

#### İki form alanını değiştir {/*swap-two-form-fields*/}

Bu form ad ve soyadınızı girmenize izin verir. Aynı zamanda hangi alanın daha önce geleceğini kontrol eden kutucuk vardır. Kutucuğu işaretlediğiniz zaman "Soyad" alanı "Ad" alanından önce gelecektir.

Neredeyse çalışmakta ancak bir hata var. Eğer "Ad" input'unu doldurup kutucuğu işaretlerseniz, adınız ilk input'ta kalacaktır (artık "Soyad" olan input). Sırayı değiştirdiğinzde input metninin de değişeceği şekilde düzenleyin.

<Hint>

Görünüşe göre bu alanlar için üst eleman içindeki konumları yeterli değildir. React'e yeniden render'lar arasında state'leri nasıl eşleştireceğini söylemenin bir yolu var mı?

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Sırayı terse çevir
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Ad" /> 
        <Field label="Soyad" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="Ad" /> 
        <Field label="Soyad" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

`if` ve `else` dallarındaki her iki `<Field>` bileşenine `anahtar` (`key`) verin. Bu, React'e her iki `<Field>` bileşeni için üst elemandaki sıraları değişse bile doğru state'i nasıl "eşleştireceğini" söyler.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Sırayı ters çevir
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Ad" /> 
        <Field key="firstName" label="Soyad" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="Ad" /> 
        <Field key="lastName" label="Soyad" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### Bilgi formunu sıfırla {/*reset-a-detail-form*/}

Bu düzenlenebilir bir kişi listesidir. Seçtiğiniz kişinin bilgilerini düzenleyip "Kaydet" butonu ile kaydedebilir ya da "Sıfırla" butonu ile değişiklikleri geri alabilirsiniz.

Farklı bir kişi seçtiğiniz zaman (örneğin Alice), state güncellenmektedir ancak form bir önceki kişinin bilgilerini göstermektedir. Seçilen kişi değiştiği zaman formun sıfırlanmasını sağlayacak şekilde düzeltin.

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Adı:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Kaydet
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Sıfırla
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

`key={selectedId}` prop'unu `EditContact` bileşenine iletin. Bu şekilde, seçilen kişiyi değiştirmek formu sıfırlayacaktır:

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Adı:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Kaydet
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Sıfırla
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Bir görüntüyü yüklenirken temizle {/*clear-an-image-while-its-loading*/}

"Sonraki" butonuna bastığınızda, tarayıcı sonraki görüntüyü yüklemeye başalar. Ancak, aynı `<img>` tag'inde görüntülendiğinden dolayı, varsayılan olarak bir sonraki görüntü yüklenene kadar önceki görüntüyü görmeye devam edersiniz. Metnin her zaman görüntüyle eşleşmesi önemliyse bu istenmeyen bir durum olabilir. "Sonraki" butonuna bastığınız anda bir önceki görüntünün temizlenmesini sağlayacak şekilde düzenleyin.

<Hint>

React'e DOM'u tekrar kullanmak yerine yeniden oluşturmasını söylemenin bir yolu var mı?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Sonraki
      </button>
      <h3>
        Görüntü {index + 1} / {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

`<img>` tag'ine `anahtar` (`key`) iletebilirsiniz. O `key` değiştiği zaman, React `<img>` DOM node'unu sıfırdan tekrar oluşturacaktır. Bu, her görüntü yüklendiğinde kısa bir flaşa neden olur, dolayısıyla uygulamanızdaki her görüntü için yapmak isteyeceğiniz bir şey değildir. Ancak görüntünün her zaman metinle eşleşmesini sağlamak istiyorsanız mantıklı bir yoldur.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Sonraki
      </button>
      <h3>
        Görüntü {index + 1} / {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### Fix misplaced state in the list {/*fix-misplaced-state-in-the-list*/}

In this list, each `Contact` has state that determines whether "Show email" has been pressed for it. Press "Show email" for Alice, and then tick the "Show in reverse order" checkbox. You will notice that it's _Taylor's_ email that is expanded now, but Alice's--which has moved to the bottom--appears collapsed.

Fix it so that the expanded state is associated with each contact, regardless of the chosen ordering.

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

The problem is that this example was using index as a `key`:

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

However, you want the state to be associated with _each particular contact_.

Using the contact ID as a `key` instead fixes the issue:

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

State is associated with the tree position. A `key` lets you specify a named position instead of relying on order.

</Solution>

</Challenges>
