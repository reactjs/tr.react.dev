---
title: 'Öğretici: Tic-Tac-Toe'
---

<Intro>

Bu öğretici ile küçük bir tic-tac-toe oyunu yapacaksınız. Bu öğretici herhangi bir React bilgisi gerektirmez. Bu öğreticide öğreneceğiniz teknikler herhangi bir React uygulaması yapmak için gerekli olan temel tekniklerdir ve bunları tamamıyla anlamak React hakkında derinlemesine bir anlayış sağlayacaktır.

</Intro>

<Note>

Bu öğretici, **yaparak öğrenmeyi** tercih eden ve hızlı bir şekilde somut bir şeyler yapmayı isteyen kişiler için tasarlanmıştır. Eğer her konsepti adım adım öğrenmeyi tercih ediyorsanız, [Describing the UI.](/learn/describing-the-ui) sayfası ile başlayın.

</Note>

Bu öğretici birçok bölüme ayrılmıştır:

- [Öğretici için kurulum](#setup-for-the-tutorial) bölümü size öğreticiyi takip etmeniz için **bir başlangıç noktası** verecektir.
- [Genel bakış](#overview) bölümü React'in **temellerini** öğretecektir: bileşenler, prop'lar ve state.
- [Oyunu tamamlama](#completing-the-game) bölümü React ile geliştirme yaparken **sık kullanılan teknikleri** öğretecektir.
- [Zaman yolculuğu ekleme](#adding-time-travel) bölümü React'in eşsiz gücüne **daha derin bir bakış** getirecektir.

### Ne yapıyorsunuz? {/*what-are-you-building*/}

Bu öğreticide, React ile interektif bir tic-tac-toe oyunu yapacaksınız.

İşimiz bittiği zaman nasıl bir şeyin ortaya çıkacağını burada görebilirsiniz:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Kazanan: ' + winner;
  } else {
    status = 'Sıradaki oyuncu: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = '# numaralı harekete git' + move;
    } else {
      description = 'Oyunun başlangıcına git';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Eğer bu kod size şu an anlamlı gelmiyorsa ya da kodun sözdizimine yabancıysanız, merak etmeyin! Bu öğreticinin amacı React'i ve sözdizimini anlamanıza yardımcı olmaktır.

Öğreticiye devam etmeden önce yukarıdaki tic-tac-toe oyununu kontrol etmenizi tavsiye ederiz. Fark edeceğiniz özelliklerden biri de oyun tahtasının sağında numaralandırılmış bir listenin bulunmasıdır. Bu liste size oyun boyunca yapılmış tüm hamleleri gösterir ve oyun devam ettiği sürece bu liste güncellenir.

Tamamlanmış oyunla biraz vakit geçirdikten sonra devam edin. Bu öğreticide daha basit bir şablonla başlayacaksınız. Bir sonraki adımımız oyunu yapmaya başlamanız için sizi hazırlamaktır.

## Öğretici için kurulum {/*setup-for-the-tutorial*/}

Aşağıdaki canlı kod editöründe, sağ üst köşedeki **Fork** butonuna basın ve CodeSanbox websitesini kullanarak editörü yeni bir sayfada açın. CodeSandbox, tarayıcınızda kod yazmanıza ve kullanıcılarınızın yaptığınız uygulamayı nasıl göreceğini önizlemenize olanak sağlar. Açılan yeni sayfa boş bir kare ve bu öğretici için gerekli olan başlangıç kodunu gösterecektir.

<Sandpack>

```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Bu öğreticiyi yerel geliştirme ortamınızı kullanarak da takip edebilirsiniz. Bunu yapmak için şu adımlar takip edin:

<<<<<<< HEAD
1. [Node.js](https://nodejs.org/en/) kurun
1. CodeSandbox sayfasında menüyü açmak için sol üst köşedeki butona tıklayın ve sonra **File > Export to ZIP** adımlarını izleyerek gerekli arşiv dosyalarını indirin.
1. Arşivi açın, daha sonra bir terminal açın ve çıkarttığınız dosyaya `cd` ile gidin
1. `npm install` ile bağımlılıkları yükleyin
1. `npm start` ile yerel bir sunucu başlatın ve kodu tarayıcıda çalışır halde görmek için adımları takip edin
=======
1. Install [Node.js](https://nodejs.org/en/)
1. In the CodeSandbox tab you opened earlier, press the top-left corner button to open the menu, and then choose **Download Sandbox** in that menu to download an archive of the files locally
1. Unzip the archive, then open a terminal and `cd` to the directory you unzipped
1. Install the dependencies with `npm install`
1. Run `npm start` to start a local server and follow the prompts to view the code running in a browser
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

Eğer bir yerde takılırsanız bunun sizi durdurmasına izin vermeyin! Websitesi üzerinde takip etmeye devam edin ve yerel kurulumu sonra tekrardan deneyin.

</Note>

## Genel bakış {/*overview*/}

Kurulumu tamamladığımıza göre, React'e genel bir bakış atalım!

### Başlangıç kodunu inceleme {/*inspecting-the-starter-code*/}

CodeSanbox'ta üç ana bölüm göreceksiniz:

![Başlangıç kodu ile CodeSandbox](../images/tutorial/react-starter-code-codesandbox.png)

1. _Files_ bölümünde `App.js`, `index.js`, `styles.css` gibi dosyaların listesi ve `public` dosyası vardır
1. Seçtiğiniz dosyanın kaynak kodunu göreceğiniz _kod editörü_ bölümü 
1. Yazdığınız kodun nasıl görüntüleneceğini gösteren _tarayıcı_ bölümü

_Files_ bölümünde `App.js` dosyası seçili olmalıdır. O dosyanın içeriği _kod editöründe_ şöyle olmalıdır:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

_Tarayıcı_ bölümü, içinde X olan bir kare göstermelidir:

![İçinde x olan kare](../images/tutorial/x-filled-square.png)

Şimdi başlangıç kodundaki dosyalara bir göz atalım.

#### `App.js` {/*appjs*/}

`App.js` içindeki kod bir _bileşen_ yaratır. React'te bileşen, bir kullanıcı arayüzü parçasını temsil eden tekrar kullanılabilir bir kod parçasıdır. Bileşenler, uygulamanızdaki UI elementleri render etmek, yönetmek ve güncellemek için kullanılır. Hadi şu bileşene satır satır bakarak ne olduğunu anlamaya çalışalım:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

İlk satır `Square` adında bir fonksiyon tanımlar. `export` JavaScript kelimesi bu fonksiyonun bu dosya dışındaki yerlerde de kullanılabilmesi sağlar. `default` kelimesi ise bu fonksiyonu kullanan diğer dosyalara bu fonksiyonun dosyadaki ana fonksiyon olduğunu söyler.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

İkinci satır bir buton döndürür. `return` JavaScript kelimesi bundan sonra gelen her şeyin, fonksiyonu çağırana bir değer olarak döndürüleceği anlamına gelir. `<button>` bir *JSX elementidir*. JSX elemanı, neyi görüntülemek istediğinizi açıklayan JavaScript kodu ve HTML elemanlarının birleşimidir. `className="square"` ise bir buton özelliği ya da CSS'e butonu nasıl stillendireceğini söyleyen *prop'tur*. `X` buton içindeki metindir ve `</button>` ifadesi JSX elementini kapatarak bundan sonra gelen içeriğin buton içine konmaması gerektiğini belirtir.

#### `styles.css` {/*stylescss*/}

CodeSandbox'ın _Files_ bölümündeki `styles.css` isimli dosyaya tıklayın. Bu dosya React uygulamanızın stillerini tanımlar. İlk iki _CSS seçici_ (`*` ve `body`) uygulamanızın büyük bölümlerinini stilini tanımlarken, `.square` seçicisi `className` özelliğini `.square` olduğu her bileşenin stilini tanımlar. Kodunuzda bu, `App.js` dosyasındaki Square bileşeninizdeki düğmeyle eşleşir.

#### `index.js` {/*indexjs*/}

CodeSandbox'ın _Files_ bölümündeki `index.js` isimli dosyaya tıklayın. Öğretici sırasında bu dosyayı düzenlemeyeceksiniz ama bu dosya `App.js` dosyası içerisinde oluşturduğunuz bileşen ile web tarayıcısı arasındaki köprüdür.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

1-5 satırları gerekli tüm parçaları bir araya getirir:

* React
* React'in web tarayıcıları ile konuşması için kütüphane (React DOM)
* bileşenlerinizin stilleri
* `App.js` içerisinde oluşturduğunuz bileşen.

Sayfanın geri kalanı tüm parçaları bir araya getirir ve `public` dosyasındaki `index.html` dosyasına son ürünü enjekte eder.

### Tahtayı oluşturmak {/*building-the-board*/}

`App.js` dosyasına geri gidelim. Öğreticinin geri kalanını bu sayfada geçireceğiz.

Şu anda tahta tek bir kareden oluşmakta ama bizim dokuz taneye ihtiyacımız var! Şu şekilde kopyala yapıştır yaparak iki kare yapmak isterseniz:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

Şu hatayı alacaksınız:

<ConsoleBlock level="error">

/src/App.js: Bitişik JSX elementleri çevreleyen bir elemana sarılmalıdır. Bir JSX Fragment'i `<>...</>` mi kullanmak istediniz?

</ConsoleBlock>

React bileşenleri tek bir JSX elementi döndürmelidir ve birden fazla bitişik iki buton gibi JSX elementi döndürmemelidir. Bunu düzeltmek için *Fragment* (`<>` ve `</>`) kullanıp çoklu bitişik JSX elementlerini şu şekilde sarabilirsiniz:

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

Şimdi şunu görmelisiniz:

![içinde x olan iki kare](../images/tutorial/two-x-filled-squares.png)

Güzel! Şimdi yapmanız gereken bir kaç kere daha kopyala yapıştır yaparak dokuz kare elde etmek ve...

![bir satırda içinde x olan dokuz kare](../images/tutorial/nine-x-filled-squares.png)

Olamaz! Kareler bizim istediğimiz tahtadaki gibi grid haline değil, tek bir satırda. Bunu düzeltmek için karelerinizi `div`ler kullanarak satırlar halinde gruplamanız ve bazı CSS sınıfları eklemeniz gerekmektedir. Bunu yaparken aynı zamanda her karenin nerede görüntülendiğini bilmek için her kareye bir numara vereceksiniz.

`App.js` dosyası içinide, `Square` bileşenini şöyle gözükecek halde güncelleyin:

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

`styles.css` dosyası içinde tanımlanmış CSS, `className`'i `board-row` olan div'leri stiller. Bileşenleri stillenmiş `div`'ler ile satır halinde grupladığınza göre, tic-tac-toe tahtamızı elde etmiş oluruz:

![içinde 1'den 9'a numaralar olan tic-tac-toe tahtası](../images/tutorial/number-filled-board.png)

Ancak şimdi bir sorunumuz var. `Square` adlı bileşeniniz, artık bir kare değil. Bu sorunu bileşenin ismini `Board` olarak değiştirerek çözelim:

```js {1}
export default function Board() {
  //...
}
```

Bu noktada kodunuz şöyle gözükmelidir:

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Pişşt... Yazacak çok şey var! Bu sayfadan kodu kopyala yapıştır yapabilirsiniz. Ancak, biraz kafa yormak isterseniz, yalnızca en az bir kez manuel olarak yazdığınız kodu kopyalamanızı tavsiye ederiz.

</Note>

### Prop'lar aracılığıyla veri iletme {/*passing-data-through-props*/}

Şimdi, oyuncu kareye tıkladığında karenin değerini boştan "X"'e değiştirmek isteyeceksiniz. Tahtayı şu ana kadar nasıl oluşturduğunuzu düşünürsek, kareyi dokuz kez güncelleyen kodu kopyalayıp yapıştırmanız gerekir (her kare için bir defa)! Kopyala yapıştır yapmak yerine, React'in bileşen yapısı, karışık ve yinelenen kodlardan kaçınmak için yeniden kullanılabilir bir bileşen oluşturmanıza olanak sağlar.

İlk olarak, ilk karenizi tanımlayan satırı (`<button className="square">1</button>`) `Board` bileşeninizden yeni bir `Square` bileşenine kopyalayacaksınız:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

Daha sonra JSX sözdizimini kullanarak Board bileşeninin `Square` bileşenini render etmesini sağlayacaksınız:

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Tarayıcının `div`'lerinin aksine, kendi bileşenleriniz olan `Board` ve `Square` büyük harfle başlamak zorundadır.

Şuna bir göz atalım:

![içi bir ile dolu tahta](../images/tutorial/board-filled-with-ones.png)

Olamaz! Daha önce sahip olduğunuz numaralandırılmış kareleriniz artık yok. Şimdi her karenin içinde "1" yazmakta. Bunu düzeltmek için, her karenin sahip olması gerektiği değeri (`Board`) üst bileşeninden (`Square`) alt bileşenine *prop'lar* ile ileteceksiniz.

`Square` bileşenini `Board` bileşeninden ilettiğiniz `value` değerini okuyacak şekilde güncelleyin:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` ifadesi Square bileşenine `value` prop'unun iletilebileceği anlamına gelmektedir.

Şimdi her bir karenin içinde `1` yerine `value` değerini göstermek isteyeceksiniz. Şu şekilde yapmaya çalışın:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

Eyvah, istediğiniz şey bu değildi:

![içi value ile dolu tahta](../images/tutorial/board-filled-with-value.png)

Siz kelime olan "value" değil JavaScript değişkeni olan `value` değerini render etmek istemiştiniz. JSX'ten "JavaScript'e kaçmak" için süslü parentezleri kullanmanız gereklidir. JSX içinde `value` etrafına süslü parentezleri koyun:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

Şimdilik boş bir tahta görmelisiniz:

![boş tahta](../images/tutorial/empty-board.png)

Bunun nedeni, henüz `Board` bileşeninin render ettiği her `Square` bileşenine `value` prop'unu iletmemesidir. Bunu düzeltmek için, `Board` bileşeni tarafından render edilen her `Square` bileşenine `value` prop'unu ileteceksiniz:

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

Şimdi tahtayı dolu bir şekilde görmelisiniz:

![1'den 9'a numaralandırılmış tic-tac-toe tahtası](../images/tutorial/number-filled-board.png)

GÜncellenmiş kodunuz şöyle gözükmelidir:

<Sandpack>

```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### İnteraktif bir bileşen yapma {/*making-an-interactive-component*/}

Hadi tıklandığı zaman `Square` bileşenini `X` ile dolduralım. `Square` içinde bir `handleClick` fonksiyonu bildirelim. Daha sonra, `Square` tarafından döndürülen buton JSX elementinin prop'larına `onClick`'i ekleyin:

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('tıklandı!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Şimdi bir kareye tıklarsanız CodeSandbox'taki _Browser_ bölümünün altındaki _Console_ sekmesinde `"tıklandı!"` diyen bir log görmelisiniz. Kareye birden fazla defa tıklamak yeniden `"tıklandı!"` log'layacaktır. Aynı mesajla tekrarlanan konsol log'ları, konsolda daha fazla satır oluşturmaz. Bunun yerine ilk `"tıklandı!"` log'unun yanında artan bir sayaç göreceksiniz.

<Note>

Bu öğreticiyi kendi yerel geliştirme ortamınızda takip ediyorsanız, tarayıcınızın Console'unu açmanız gerekmektedir. Örneğin, Chrome tarayıcısını kullanıyorsanız, konsolu açmak için **Shift + Ctrl + J** (Windows/Linux için) ya da **Option + ⌘ + J** (macOS için) klavye kısayollarını kullanabilirsiniz.

</Note>

Bir sonraki adımda, Square bileşeninin tıklandığını "hatırlamasını" ve "X" işareti ile doldurulmasını isteyeceksiniz. Bir şeyleri "hatırlamak" için bileşenler *state* kullanır.

React, bileşeninizin bir şeyleri "hatırlamasını" sağlamak için bileşeninizden çağırabileceğiniz `useState` adı verilen özel bir fonksiyon sağlar. Şimdi `Square`'in şu anki değerini state'te saklayalım ve `Square` tıklandığı zaman değiştirelim.

Dosyanın en üstüne `useState` içe aktarın. `Square` bileşeninden `value` prop'unu kaldırın. Onun yerine, `Square` bileşeninin başına `useState` çağıran yeni bir satır ekleyin ve `value` adında bir state değişkeni döndürmesini sağlayın:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` değeri saklar ve `setValue` değeri değiştirmek için kullanılan bir fonksiyondur. `useState`'e iletilen `null` değeri bu state değişkeni için başlangıç değeri olarak kullanılır ve bu yüzden `value` değeri `null` olarak başlar.

`Square` bileşeni artık prop almıyor, Board bileşeni tarafından render edilen dokuz Square bileşeninin tamamından `value` prop'unu kaldıracaksınız:

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Şimdi `Square` bileşenini tıklandığında "X" gösterecek şekilde değiştirin. Olay yöneticisi içindeki `console.log("clicked!");` ifadesini `setValue('X');` ile değiştirin. Şimdi `Square` bileşeniniz şöyle gözükecektir:

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

`onClick` yöneticisinden `set` fonksiyonunu çağırarak, React'e, `<button>` tıklandığında o `Square` bileşenini yeniden render etmesini söylüyorsunuz. Güncellemeden sonra, `Square`'nin `value` değeri `'X'` olacaktır, böylelikle "X" yazısını oyun tahtasında görebileceksiniz. Herhangi bir Square'e tıklayın. Şimdi "X" gözükmelidir:

![tahtaya x'leri eklemek](../images/tutorial/tictac-adding-x-s.gif)

Her bir Square kendi state'ine sahiptir: her bir Square'de saklanan `value` birbirlerinden tamamen bağımsızdır. Bileşende `set` fonksiyonu çağırdığınız zaman, React, içindeki alt bileşenleri de otomatik olarak güncelleyecektir.

Yukarıdaki değişiklikleri yaptıktan sonra, kodunuz şöyle gözükecektir:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### React Geliştirici Araçları {/*react-developer-tools*/}

React DevTools, React bileşenlerinizin prop'larını ve state'ini kontrol etmenize olanak sağlar. React DevTools sekmesini CodeSandbox'ın _browser_ bölümünün en altında bulabilirsiniz:

![CodeSandbox'ta React DevTools](../images/tutorial/codesandbox-devtools.png)

Ekrandaki herhangi bir bileşeni incelemek için, React DevTools'un sol üst köşesindeki butonu kullanın:

![React DevTools kullanarak ekrandaki bileşenleri seçmek](../images/tutorial/devtools-select.gif)

<Note>

Yerel geliştirme için, React DevTools, [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) ve [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil) tarayıcılarında eklentiye sahiptir. Eklentiyi kurun ve React kullanan sitelerde tarayıcınızın Geliştirici Araçlarında *Components(bileşenler)* sekmesi gözükecektir.

</Note>

## Oyunu tamamlama {/*completing-the-game*/}

Bu noktada, tic-tac-toe oyununuz için temel yapı taşlarına sahipsiniz. Tam bir oyun için, tahtaya "X" ve "O"'ları dönüşümlü olarak yerleştirmeniz ve kazananı belirlemeniz gerekiyor.

### State'i yukarı kaldırma {/*lifting-state-up*/}

Şu anda, her bir `Square` bileşeni oyunun state'inin bir parçasını kontorl etmekte. Bir tic-tac-toe oyununda kazananı kontrol etmek için, `Board` bileşeninin bir şekilde 9 `Square` bileşeninin state'ini bilmesi gereklidir.

Bu duruma nasıl yaklaşırsınız? İlk olarak, `Board`'ın her `Square`'e o `Square`'in state'ini "sorması" gerektiğini tahmin edebilirsiniz. Bu yaklaşım React'te teknik olarak mümkün olmasına rağmen, bu yaklaşımı kullanmanızı tavsiye etmiyoruz çünkü kod anlaması zor bir hale gelir, hatalara açık hale gelir ve sonradan düzenlenmesi zor bir hale gelir. Onun yerine, en iyi yaklaşım oyunun state'ini her bir `Square` bileşeninde saklamak yerine üst eleman `Board` bileşeninde saklamaktır. `Board` bileşeni, her bir Square'e bir sayı ilettiğinizde yaptığınız gibi, bir prop ileterek her `Square`'e ne göstereceğini söyleyebilir.

**Birden fazla alt elemandan veri toplamak için ya da iki alt bileşenin birbiriyle iletişim kurabilmesini sağlamak için paylaşılan state'i bu bileşenlerin üst bileşeninde bildirin. Üst eleman state'ini alt bileşenlerine prop'lar aracılığı ile iletebilir. Böylelikle alt bileşenler birbirleriyle ve üst bileşenle senkronize olurlar.**

React bileşenlerini sonradan düzenlenirken state'in üst bileşene kaldırılması sıkça yapılan bir durumdur.

Hadi bu fırsatı denemek için kullanalım. `Board` bileşenini, `square` adlı bir state'e sahip olacak ve state'i varsayılan olarak 9 kareye karşılık gelen 9 boş değerden oluşan bir diziye eşit olacak şekilde düzenleyelim:

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` ifadesi dokuz elemanlı bir dizi oluşturur ve her elemanı `null` yapar. Etrafındaki `useState()` çağrısı, başlangıçta o diziye ayarlanan bir `squares` state değişkeni bildirir. Dizideki her bir girdi bir karenin değerine denk gelir. Tahtayı doldurmaya başladığınız zaman, `squares` dizisi şöyle gözükecektir:

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

Şimdi `Board` bileşeninizin `value` prop'unu render ettiği her bir `Square` bileşenine iletmesi gereklidir:

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

Daha sonra, `Square` bileşenini Board bileşeninden `value` prop'unu alacak şekilde düzenleyeceksiniz. Bu, Square bileşeninin kendi `value` state değerini ve butonun `onClick` prop'unun kaldırılmasını gerektirecektir:

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

Bu noktada boş bir tic-tac-toe tahtası görüyor olmalısınız:

![boş tahta](../images/tutorial/empty-board.png)

Ve kodunuz şu şekilde gözükmelidir:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Şimdi her bir Square `'X'`, `'O'` ya da boş kareler için `null` değerine sahip `value` prop'u alacaktır.

Sırada, `Square`'e tıklandığı zaman ne olacağını değiştirmek vardır. Artık `Board` bileşeni hangi karenin dolduruluğunu yönetmekle görevlidir. `Square`'in `Board` state'ini güncellemesi için bir yol bulmanız gerekecektir. State onu bildiren bileşene özel olduğu için, `Board`'un state'ini direkt olarak `Square` bileşeninden güncelleyemezsiniz.

Onun yerine, `Board` bileşeninden `Square` bileşenine bir fonksiyon ileteceksiniz ve kareye tıklandığı zaman `Square` bileşeninin o fonksiyonu çağırmasını sağlayacaksınız. `Square` bileşeninin tıklandığında çağıracağı fonksiyonla başlayacaksınız. Bu fonksiyonu `onSquareClick` olarak adlandıracaksınız:

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Sonra, `onSquareClick` fonksiyonunu `Square` bileşeninin prop'larına ekleyeceksiniz:

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Şimdi `onSquareClick` prop'unu `Board` bileşenindeki `handleClick` adını vereceğiniz bir fonksiyona bağlayacaksınız. `onSquareClick`'i `handleClick`'e bağlamak için ilk `Square` bileşeninin `onSquareClick` prop'una bir fonksiyon ileteceksiniz:

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

Son olarak, Board'un state'ini tutan `squares` dizisini güncellemek için Board bileşeninin içinde `handleClick` fonksiyonunu tanımlayacaksınız:

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

`handleClick` fonksiyonu JavaScript `slice()` dizi metodu ile `squares` dizisinin bir kopyasını oluşturur (`nextSquares`). Daha sonra, `handleClick` fonksiyonu `nextSquares` dizisini güncelleyerek ilk kareye (`[0]` indeks) `X` ekler.

`setSquares` fonksiyonunu çağırmak React'e bileşenin state'inin değiştiğini söyler. Bu, `squares` state'ini (`Board`) kullanan bileşenlerin yanı sıra onun alt bileşenlerinin de (tahtayı oluşturan `Square` bileşenleri) yeniden render edilmesini tetikleyecektir.

<Note>

JavaScript [closure'ları](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) destekler. Bu da demektir ki bir iç fonksiyon (`handleClick` gibi) bir dış fonksiyonda (`Board` gibi) tanımlanan değişkenlere ve fonksiyonlar ulaşabilir. `handleClick` fonksiyonu `squares` state'ini okuyabilir ve `setSquares` metodunu çağırabilir çünkü her ikisi de `Board` fonksiyonu içinde tanımlanmıştır.

</Note>

Artık tahtaya X'leri ekleyebilirsiniz... ama sadece solt üst kareye. `handleClick` fonksiyonunuz sadece sol üst kareyi (`0`) güncelleyecek şekilde kodlanmıştır. Hadi şimdi `handleClick` fonksiyonunu herhangi bir kareyi güncelleyecek şekilde düzenleyelim. Güncellenecek karenin indeksini alacak şekilde `handleClick` fonksiyonuna `i` argümanını ekleyelim:

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

Daha sonra, bu `i` argümanını `handleClick` fonksiyonuna iletin. JSX'te karenin `onSquareClick` prop'unu doğrudan `handleClick(0)` olacak şekilde ayarlamayı deneyebilirsiniz ancak bu işe yaramayacaktır:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

Şimdi bunun neden çalışmadığına bakalım. `handleClick(0)` çağrısı Board bileşeninin render edilmesinde rol alacaktır çünkü `handleClick(0)` Board bileşeninin state'ini `setSquares` çağrısı ile değiştirir ve bütün Board bileşeniniz yeniden renderlanacaktır. Ancak bu `handleClick(0)` çağrısını tekrar yapar ve sonsuz bir döngüye neden olur:

<ConsoleBlock level="error">

Çok fazla yeniden render. React sonsuz döngülerin önüne geçmek için yapılan render'ların sayısını kısıtlar.

</ConsoleBlock>

Peki bu sorun neden daha önce olmadı?

`onSquareClick={handleClick}` ilettiğinizde, `handleClick` fonksiyonunu prop olarak iletiyordunuz. Fonksiyonu çağırmıyordunuz! Ancak şimdi anında o fonksiyonu *çağırıyorsunuz*--`handleClick(0)` etrafındaki parentezlere dikkat edin--ve fonksiyonun erken çalışmasının sebebi bu. `handleClick`  fonksiyonunu kullanıcı tıklayana kadar çağırmak *istemezsiniz!*

Bu sorunu çözmek için `handleClick(0)` çağıran bir `handleFirstSquareClick`, `handleClick(1)` çağıran bir `handleSecondSquareClick` fonksiyonu yaratabilirsiniz. Bu fonksiyonları `onSquareClick={handleFirstSquareClick}` şeklinde prop olarak (çağırmak yerine) iletebilirsiniz. Böylelikle sonsuz döngü sorununu çözersiniz.

Ancak, dokuz farklı fonksiyon tanımlamak ve herbirine farklı isimler vermek çok fazla laf kalabalığıdır. Onun yerine, şöyle yapalım:

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

Yeni `() =>` sözdizimine dikkat edin. Burada, `() => handleClick(0)` bir *ok fonksiyonudur.* Bu, fonksiyonları tanımlamanın kısa bir yoludur. Kareye tıklandığı zaman, `=>` "oktan" sonraki kod çalışacaktır ve `handleClick(0)` çağırılacaktır.

Şimdi ilettiğiniz ok fonksiyonlarından `handleClick`'i çağırmak için diğer sekiz kareyi güncellemeniz gerekiyor. Her bir `handleClick` çağrısına ilişkin argümanın doğru karenin indeksine karşılık geldiğinden emin olun:

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};
```

Şimdi yine tahtadaki istediğiniz kareye tıklayarak X ekleyebilirsiniz:

![tahtayı X ile doldurmak](../images/tutorial/tictac-adding-x-s.gif)

Bu sefer tüm state'imiz `Board` bileşeni tarafından yönetiliyor!

Kodunuz şu şekilde gözükmeli:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Artık state yönetiminiz `Board` bileşeninde olduğundan, üst `Board` bileşeni alt `Square` bileşenine prop'ları ileterek onların doğru görüntülenmesini sağlar. Bir `Square`'e tıklandığında, alt `Square` bileşeni, üst `Board` bileşeninden tahtanın state'inin güncellemesini ister. `Board`'un state'i değiştiğinde, hem `Board` bileşeni hem de her bir alt `Square` bileşeni otomatik olarak yeniden render edilir. Tüm karelerin state'inin `Board` bileşeninde tutulması ilerde kazananını belirlenmesinde yardımcı olacaktır.

Bir kullanıcı tahtadaki solt üst kareye bir `X` eklemek için tıkladığında ne olacağını özetleyelim:

1. Sol üstteki kareye tıklamak, `button`'ın `Square`'den `onClick` prop'u olarak aldığı fonksiyonu çalıştırır. `Square` bileşeni o fonksiyonu `onSquareClick` prop'u olarak `Board` bileşeninden aldı. `Board` bileşeni o fonksiyonu direkt olarak JSX içinde tanımladı. `handleClick` fonksiyonunu `0` argümanı ile çağıracaktır.
1. `handleClick` fonksiyonu (`0`) argümanını `square` dizisinin ilk elemanını `null`'dan `X`'e güncellemek için kullanır.
1. `Board` bileşeninin `squares` state'i güncellendi, bundan dolayı `Board` bileşeni ve alt bileşenleri yeniden renderlandı. Bu da `0` indeksli `Square` bileşeninin `value` prop'unun `null`'dan `X`'e değişmesine neden oldu.

Sonuçta, kullanıcı tıklamayı yaptıktan sonra sol üst karenin `X` ile doldurulduğunu gördü.

<Note>

DOM `<button>` elementinin `onClick` özelliğinin React'te özel bir anlamı vardır çünkü yerleşik bir bileşendir. Square gibi sizin bileşenlerinizde, adlandırma size aittir. `Square`'in `onSquareClick` prop'una ya da `Board`'un `handleClick` fonksiyonuna istediğiniz ismi verebilirsiniz ve kod aynı şekilde çalışacaktır. React'te, olayları temsil eden prop'lar için `onSomething` olarak adlandırmak ve bu olayları yöneten fonksiyonları `handleSomething` olarak adlandırmak gelenek haline gelmiştir.

</Note>

### Değişmezlik niye önemlidir {/*why-immutability-is-important*/}

Mevcut diziyi değiştirmek yerine, `squares` dizisinin bir kopyasını oluşturmak için `handleClick`'te nasıl `.slice()` çağırdığınıza dikkat edin. Nedenini açıklamak için, değişmezliği ve öğrenmenin neden önemli olduğunu tartışmamız gereklidir.

Veriyi değiştirmek için kullanılan genellikle iki yaklaşım vardır. İlk yaklaşım veriyi direkt olarak _mutasyona uğratarak_ verinin değerlerini değiştirmektir. İkinci yaklaşım ise veriyi gerekli değişiklikler yapılmış kopyası ile değiştirmektir. Aşağıda eğer `squares` dizisini mutasyona uğratsaydınız nasıl olacağını görebilirsiniz:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Şimdi `squares` dizisi: ["X", null, null, null, null, null, null, null, null];
```

Şimdi `squares` dizisinin mutasyona uğratılmadan değiştirildiğinde nasıl gözükeceğine bakalım:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// `squares` dizisi aynı şekilde durmakta ama `nextSquares` dizisinin ilk elemanı `null` yerine `X` olmuş
```

Sonuç aynıdır ama direkt olarak mutasyona uğratmayarak (temel verileri değiştirmek) birkaç avantaj kazanırsınız.

Değişmezlik, karmaşık özelliklerin uygulanmasını çok daha kolay hale getirir. Bu öğreticinin ilerleyen bölümlerinde, oyunun geçmişini gözden geçirmenize ve geçmiş hamlelere "geri dönmenize" olanak tanıyan bir "zaman yolculuğu" özelliği uygulayacaksınız. Bu işlevsellik oyunlara özgü değildir--belirli eylemleri geri alma ve yeniden yapma yeteneği uygulamalar için yaygın bir gerekliliktir. Doğrudan veri mutasyonundan kaçınmak, verilerin önceki sürümlerini bozulmadan saklamanıza ve daha sonra yeniden kullanmanıza olanak tanır.

Değişmezliğin başka bir faydası daha vardır. Varsayılan olarak, bir üst bileşenin state'i değiştiğinde tüm alt bileşenler otomatik olarak yeniden render edilir. Bu, değişiklikten etkilenmeye alt bileşenler için bile geçerlidir. Her ne kadar yeniden render etme kullanıcı tarafından fark edilmese de (bundan kaçınmaya çalışmamalısınız!), performans nedenleriyle ağacın açıkça etkilenmeyen bir bölümünü yeniden render etmemek isteyebilirsiniz. Değişmezlik, bileşenlerin verilerinin değişip değişmediğinin karşılaştırılmasını çok ucuz bir hale getirir. React'in bir bileşenin ne zaman yeniden render edileceğini nasıl seçtiği hakkında daha fazla bilgiyi [`memo` API referansı](/reference/react/memo) sayfasında bulabilirsiniz.

### Sırayla oynama {/*taking-turns*/}

Şimdi bu tic-tac-toe oyunundaki büyük kusuru düzeltmenin zamanı geldi: "O"'lar tahtaya işaretlenemiyor.

İlk hamleyi varsayılan olarak "X" olarak ayarlayacaksınız. Board bileşenine başka bir state parçası ekleyerek bunu takip edelim:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

Bir oyuncu her hamle yaptığında, `xIsNext` (bir boolean) değeri çevrilerek sıradaki oyuncunun hangisi olacağı belirlenecek ve oyunun state'i kaydedilecektir. `Board`'un `handleClick` fonksiyonunu `xIsNext` değerini çevirecek şekilde güncelleyeceksiniz:

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

Şimdi, farklı karelere tıkladığınızda, olması gerektiği gibi `X` ve `O` arasında değişecekler!

Ama durun, bir sorun var. Aynı kareye birden çok kez tıklamayı deneyin:

![O bir X'in üzerine yazılıyor](../images/tutorial/o-replaces-x.gif)

`X`'in üzerine bir `O` yazılıyor! Bu oyuna çok ilginç bir değişiklik katacak olsa da, şimdilik orijinal kurallara bağlı kalacağız.

Bir kareyi `X` veya `O` ile işaretlediğinizde, önce karenin zaten bir `X` veya `O` değerine sahip olup olmadığını kontrol etmiyorsunuz. Bunu *erken döndürerek* düzeltebilirsiniz. Karenin zaten bir `X` veya `O` değerine sahip olup olmadığını kontrol edeceksiniz. Eğer kare zaten doluysa, `handleClick` fonksiyonunda erken `return` yapacaksınız - tahta state'ini güncellemeye çalışmadan önce.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Artık sadece boş karelere `X` veya `O` ekleyebilirsiniz! İşte bu noktada kodunuzun nasıl görünmesi gerektiği:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Kazanan belirleme {/*declaring-a-winner*/}

Artık oyuncular sırayla oynayabildiğine göre, oyunun ne zaman kazanıldığını ve yapılacak başka hamle kalmadığını göstermek isteyeceksiniz. Bunu yapmak için 9 kareden oluşan bir dizi alan, bir kazanan olup olmadığını kontrol eden ve uygun şekilde `'X'`, `'O'` veya `null` döndüren `calculataWinner` adlı yardımcı bir fonksiyon ekleyeceksiniz. `calculateWinner` fonksiyonu hakkında çok fazla endişelenmeyin; React'e özgü bir fonksiyon değildir:

```js src/App.js
export default function Board() {
  //...
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

<Note>

`calculateWinner`'ı `Board`'tan önce ya da sonra tanımladığınız önemli değildir. Bunu en sona koyalım, böylece bileşenlerinizi her düzenlediğinizde bu fonksiyonu kaydırarak geçmek zorunda kalmazsınız.

</Note>

Bir oyuncunun kazanıp kazanmadığını kontrol etmek için `Board` bileşeninin `handleClick` fonksiyonunda `calculateWinner(squares)` fonksiyonunu çağıracaksınız. Bu kontrolü, kullanıcının zaten `X` veya `O` olan bir kareye tıklayıp tıklamadığını kontrol ederken aynı anda gerçekleştirebilirsiniz. Her iki durumda da erken döndürmek istiyoruz:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Oyunculara oyunun ne zaman bittiğini bildirmek için "Kazanan" gibi bir metin görüntüleyebilirsiniz: "Kazanan: X" ya da "Kazanan: O". Bunu yapmak için `Board` bileşenine bir `status` bölümü ekleyeceksiniz. Durum, oyun bittiyse kazananı gösterecek ve oyun devam ediyorsa sıranın hangi oyuncuda olduğunu gösterecektir:

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Kazanan: " + winner;
  } else {
    status = "Sıradaki oyuncu: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

Tebrikler! Artık çalışan bir tic-tac-toe oyununuz var. React'in temellerini de öğrenmiş oldunuz. Yani burada asıl kazanan _sizsiniz_. İşte kodunuz şöyle gözükmeli:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Kazanan: ' + winner;
  } else {
    status = 'Sıradaki oyuncu: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

## Zaman yolculuğu ekleme {/*adding-time-travel*/}

Son bir egzersiz olarak, oyundaki önceki hamlelere "zamanda geri gitmeyi" mümkün kılalım.

### Önceki hamleleri saklama {/*storing-a-history-of-moves*/}

`squares` dizisini mutasyona uğrattıysanız, zaman yolculuğunu uygulamak epey zor olacaktı.

Ancak, her hamleden sonra `squares` dizisinin yeni bir kopyasını oluşturmak için `slice()` metodunu kullandınız ve bunu değişmez olarak kabul ettiniz. Bu, `squares` dizisinin geçmişteki her sürümünü saklamanıza ve daha önce gerçekleşmiş hamleler arasında gezinmenize olanak tanır.

Geçmiş `squares` dizilerini, yeni bir state değişkeni olarak saklayacağınız `history` adlı başka bir dizide saklayacaksınız. `history` dizisi, ilk hamleden son hamleye kadar tüm tahta state'ini temsil eder ve aşağıdaki şekle sahiptir:

```jsx
[
  // İlk hamleden önce
  [null, null, null, null, null, null, null, null, null],
  // İlk hamleden sonra
  [null, null, null, null, 'X', null, null, null, null],
  // İkinci hamleden sonra
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### Yeniden state'i yukarı kaldırma {/*lifting-state-up-again*/}

Şimdi geçmiş hamlelerin bir listesini görüntülemek için `Game` adında yeni bir üst-düzey bileşen yazacaksınız. Tüm oyun geçmişini içeren `history` state'ini buraya yerleştireceksiniz.

`history` state'ini `Game` bileşenine yerleştirmek, `squares` state'ini alt bileşeni olan `Board` bileşeninden kaldırmanıza olanak sağlayacaktır. Tıpkı `Square` bileşeninden `Board` bileşenine "state'i kaldırdığınız" gibi, şimdi de `Board` bileşeninden üst-düzey `Game` bileşenine kaldıracaksınız. Bu, `Game` bileşenine `Board`'un verileri üzerinde tam kontrol sağlar ve `Board`'a `history`'den önceki hamleleri render etme talimatı vermesine olanak sağlar.

İlk olarak, `export default` ile bir `Game` bileşeni ekleyin. Bu bileşenin `Board` bileşeni ve bazı işaretlemeleri render etmesini sağlayın:

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*YAPILACAKLAR*/}</ol>
      </div>
    </div>
  );
}
```

`export default` anahtar sözcüklerini `function Board() {` bildiriminden önce kaldırdığınıza ve `function Game() {` bildiriminden önce eklediğinize dikkat edin. Bu, `index.js` dosyanıza `Board` bileşeniniz yerine üst-düzey bileşen olarak `Game` bileşenini kullanmanızı söyler. `Game` bileşeni tarafından döndürülen ek `div`'ler daha sonra tahtaya ekleyeceğiniz oyun bilgileri için yer açıyor.

Sırada hangi oyuncunun olduğunu ve hamle geçmişini izlemek için `Game` bileşenine state'ler ekleyin:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

Dikkat ederseniz `[Array(9).fill(null)]` tek öğeli bir dizidir ve kendisi de 9 `null`'dan oluşan bir dizidir.

Mevcut hamlenin karelerini render etmek için, `history` dizisinden son kareler dizisini okumak isteyeceksiniz. Bunun için `useState`'e ihtiyacınız yoktur--render sırasında bunu hesaplamak için zaten yeterli bilgiye sahipsiniz:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

Ardından, `Game` bileşeni içinde, oyunu güncellemek için `Board` bileşeni tarafından çağrılacak `handlePlay` fonksiyonunu oluşturun. `xIsNext`, `currentSquares` ve `handlePlay`'i `Board` bileşenine prop olarak iletin:

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // YAPILACAKLAR
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

Şimdi `Board` bileşenini aldığı prop'lar tarafından tamamen kontrol edilebilir hale getirelim. `Board` bileşenini üç prop alacak şekilde değiştirin: `xIsNext`, `squares` ve bir oyuncu hamle yaptığında `Board`'un güncellenmiş `squares` dizisiyle çağırabileceği yeni bir `onPlay` fonksiyonu. Ardından, `Board` fonksiyonunun `useState` çağrısı yapan ilk iki satırı kaldırın:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

Şimdi `Board` bileşenindeki `handleClick` içindeki `setSquares` ve `setXIsNext` çağrılarını yeni `onPlay` fonksiyonunuzda tek bir çağrı ile değiştirin, böylece `Game` bileşeni kullanıcı bir kareye tıkladığında `Board`'u güncelleyebilir:

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```
`Board` bileşeni tamamen `Game` bileşeni tarafından kendisine aktarılan prop'lar tarafından kontrol edilir. Oyunun tekrar çalışmasını sağlamak için `Game` bileşeninde `handlePlay` fonksiyonunu uygulamanız gerekir.

`handlePlay` çağırıldığında ne yapmalıdır? Board'un eskiden `setSquares` fonksiyonunu güncellenmiş bir dizi ile çağırdığını hatırlayın; şimdi güncellenmiş `squares` dizisi `onPlay` fonksiyonuna iletiliyor.

`handlePlay` fonksiyonun yeniden render etmeyi tetiklemek için `Game` state'ini güncellemesi gerekiyor ancak artık çağırabileceğiniz bir `setSquares` fonksiyonu yok--artık bu bilgiyi saklamak için `history` state değişkenini kullanıyorsunuz. Güncellenmiş `squares` dizisini yeni bir geçmiş girişi olarak ekleyerek `history` değişkenini güncellemek isteyeceksiniz. Ayrıca, Board'un eskiden yaptığı gibi `xIsNext`'i de değiştirmek isteyeceksiniz:

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

Burada, `[...history, nextSquares]` `history` ve ardından `nextSquares` içindeki tüm öğeleri içeren yeni bir dizi oluşturur. (`...history` [*spread sözdizimi*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) ifadesini "`history` içindeki tüm öğeleri sırala" şeklinde okuyabilirsiniz.)

Örneğin, eğer `history` `[[null,null,null], ["X",null,null]]` ve `nextSquares` `["X",null,"O"]` ise, yeni `[...history, nextSquares]` dizisi `[[null,null,null], ["X",null,null], ["X",null,"O"]]` olacaktır.

Bu noktada, state'i `Game` bileşeni içine taşıdınız ve kullanıcı arayüzü, tıpkı düzenleme işleminden önce olduğu gibi tamamen çalışıyor olmalıdır. İşte bu noktada kodun nasıl görünmesi gerektiği:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Kazanan: ' + winner;
  } else {
    status = 'Sıradaki oyuncu: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*YAPILACAKLAR*/}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Önceki hamleleri göstermek {/*showing-the-past-moves*/}

Tic-tac-toe oyununun hamlelerini kaydettiğinize göre, oyunculara önceki hamlelerin bir listesini gösterebilirsiniz.

`<button>` gibi React elemetleri sıradan JavaScript nesneleridir; bu elementleri uygulamanızda her yere iletebilirsiniz. React'te birden fazla öğe render etmek için, React elementlerinden oluşan bir dizi kullanabilirsiniz.

Halihazırda state'inizde `geçmiş` hamlelerin bir dizisi var, yani artık bu diziyi React elementlerinden oluşan bir diziye dönüştürmelisiniz. JavaScript'te, bir diziyi başka bir diziye dönüştürmek için, [dizi `map` metodunu](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) kullanabilirsiniz:

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

Hamle `history` state'ini ekrandaki butonları temsil eden React elementlerine dönüştürmek ve geçmiş hamlelere "atlamak" için bir buton listesi görüntülemek için `map` metodunu kullanacaksınız. Game bileşenindeki `history` state'i üzerinde `map` metodunu uygulayalım:

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // YAPILACAKLAR
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = '# numaralı hamleye git' + move;
    } else {
      description = 'Oyunun başlangıcına git';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

Aşağıda kodunuzun nasıl olması gerektiğini görebilirsiniz. Geliştirici araçları konsolunda şunu söyleyen bir hata görmeniz gerektiğine dikkat edin: 

<ConsoleBlock level="warning">
Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of &#96;Game&#96;.
Hata: Bir dizi veya yineleyicideki her alt eleman benzersiz bir "key" (anahtar) prop'una sahip olmalıdır. &#96;Game'in&#96; render metodunu kontrol edin.
</ConsoleBlock>
  
Bu hatayı bir sonraki bölümde düzelteceksiniz.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Kazanan: ' + winner;
  } else {
    status = 'Sıradaki oyuncu: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // YAPILACAKLAR
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = '# numaralı hamleye git' + move;
    } else {
      description = 'Oyunun başlangıcına git';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

`map` fonksiyonuna ilettiğiniz `history` dizisi içinde gezerken, `squares` argümanı `history` dizisinin her bir elemanından geçer ve `move` argümanı her bir dizi indeksinden geçer: `0`, `1`, `2`, …. (Çoğu durumda, gerçek dizi elemanlarına ihtiyacınız olacaktır ancak bir hamle listesi oluşturmak için yalnızca indekslere ihtiyacınız olacaktır.)

Tic-tac-toe oyunundaki her bir hamle için bir buton `<button>` içeren `<li>` elementi oluşturacaksınız. Buton, `jumpTo` (daha yazmadınız) adı verilen fonksiyonu `onClick` yöneticisi ile çağıracaktır.

Şimdilik oyunda gerçekleşen hamlelerin bir listesini ve geliştirici araçları konsolunda bir hata görmelisiniz. "key" hatasının ne anlama geldiğini tartışalım.

### Bir key (anahtar) seçme {/*picking-a-key*/}

Bir liste render ettiğinizde, React render edilen her bir liste öğesi hakkında bazı bilgileri saklar. Bir listeyi güncellediğinizde, React neyin değiştiğini saptamalıdır. Listenin öğelerine ekleme, çıkarma, yeniden düzenleme veya güncelleme yapmış olabilirsiniz.

Şundan

```html
<li>Ahmet: 7 görevi kaldı</li>
<li>Ayşe: 5 görevi kaldı</li>
```

şuna değiştiğini düşünelim

```html
<li>Ayşe: 9 görevi kaldı</li>
<li>Zeynep: 8 görevi kaldı</li>
<li>Ahmet: 5 görevi kaldı</li>
```

Güncellenen sayıları ek olarak, bunu okuyan bir insan muhtemelen Ahmet ve Ayşe'nin sıralamasını değiştirdiğinizi ve Zeynep'i Ahmet ve Ayşe arasına eklediğinizi söylecektir. Ancak, React bir bilgisayar programıdır ve neyi amaçladığınızı bilemez, bu nedenle her liste öğesini kardeş öğelerinden ayırmak için her bir liste öğesi için bir _key_ özelliği belirtmeniz gerekir. Verileriniz bir veritabanından alınmış olsaydı, Ayşe, Zeynep ve Ahmet'in veritabanı kimlikleri anahtar olarak kullanılabilirdi.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} görevi kaldı 
</li>
```

Bir liste yeniden render edildiğinde, React her liste öğesinin anahtarını alır ve önceki listenin öğelerinde eşleşen bir anahtar arar. Geçerli listede daha önce olmayan bir anahtar varsa, React bir bileşen oluşturur. Geçerli listede önceki listede var olan bir anahtar eksikse, React önceki bileşeni yok eder. Eğer iki anahtar eşleşirse, ilgili bileşen taşınır.

Anahtarlar React'e her bileşenin kimliği hakkında bilgi verir, bu da React'in yeniden oluşturma işlemleri arasında durumu korumasını sağlar. Bir bileşenin anahtarı değişirse, bileşen yok edilir ve yeni bir state ile yeniden oluşturulur.

`key` React'te özel ve ayrılmış bir özelliktir. Bir eleman oluşturulduğunda, React `key` özelliğini çıkarır ve anahtarı doğrudan döndürülen elemanda saklar. Her ne kadar `key` özelliği prop olarak iletilmiş gibi görünse de, React hangi bileşenlerin güncelleneceğine karar vermek için otomatik olarak `key` özelliğini kullanır. Bir bileşenin, üst elemanının hangi `key`i belirttiğini sormasının bir yolu yoktur.

**Dinamik listeler oluşturduğunuzda uygun anahtarlar kullanmanız şiddetle tavsiye edilir.** Uygun bir anahtarınız yoksa, verilerinizi uygun bir hale getirecek şekilde yeniden yapılandırmayı düşünebilirsiniz.

Herhangi bir anahtar belirtilmemişse, React bir hata bildirir ve dizi indeksini anahtar olarak kullanılır. Dizi indeksini anahtar olarak kullanmak, bir listenin öğelerini yeniden sıralamaya çalışırken veya liste öğelerini ekleyip/çıkarırken sorunludur. Açıkça `key={i}` iletmek hatayı susturur ancak dizi indekslerini kullanmak ile aynı sorunlara sahiptir ve çoğu durumda önerilmez.

Anahtarların global olarak benzersiz olması gerekmez; yalnızca bileşenler ve kardeşleri arasında benzersiz olmaları gerekir.

### Zaman yolculuğu uygulamak {/*implementing-time-travel*/}

Tic-tac-toe oyunun geçmişinde, her geçmiş hamlenin kendi benzersiz ID'si vardır: hamlenin sıralı numarasıdır. Hamleler asla yeniden sıralanmayacak, silinmeyecek ya da araya yenileri eklenmeyecektir bu nedenle hamle indeksini anahtar olarak kullanmak güvenlidir.

`Game` fonksiyonunda, anahtarı `<li key={move}>` olarak ekleyebilirsiniz ve render edilen oyunu yenilerseniz, React'in "key" hatası ortadan kalkacaktır:

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Kazanan: ' + winner;
  } else {
    status = 'Sıradaki oyuncu: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = '# numaralı hamleye git' + move;
    } else {
      description = 'Oyunun başlangıcına git';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

`jumpTo` fonksiyonunu uygulamadan önce, kullanıcının o anda hangi hamleyi görünütlediğini takip etmek için `Game` bileşenine ihtiyacınız vardır. Bunu yapmak için, varsayılan değeri `0` olan `currentMove` adında yeni bir state değişkeni tanımlayın:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

Daha sonra, `Game` içindeki `jumpTo` fonksiyonunu `currentMove`'u güncelleyecek şekilde düzenleyin. Ayrıca, `currentMove` değerini değiştirdiğiniz sayı çift ise `xIsNext` değerini `true` olarak ayarlayacaksınız.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

Şimdi bir kareye tıklandığında çağırılan `Game`'in `handlePlay` fonksiyonunda iki tane değişiklik yapacaksınız.

- Eğer "zamanda geriye gider" ve o noktadan itibaren yeni bir hamle yaparsanız, geçmişi sadece o noktaya kadar tutmak isterseniz. `nextSquares` öğelerini `history` içindeki tüm öğelerden (`...` spread sözdizimi) sonra eklemek yerine, `history.slice(0, currentMove + 1)` içindeki tüm öğelerden sonra eklersiniz, böylece eski geçmişin yalnıza o kısmını saklarsınız.
- Her hamle yapıldığında, `currentMove` değişkenini en son hamle girdisine işaret edecek şekilde güncellemeniz gerekir.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

Son olarak, `Game` bileşenini her zaman son hamleyi render edecek şekilde değilde seçili hamleyi render edecek şekilde güncelleyeceksiniz:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

Oyunun geçmişindeki herhangi bir hamleye tıklarsanız, tic-tac-toe tahtası o adım gerçekleştikten sonra tahtanın nasıl göründüğünü göstermek için hemen güncellenmelidir.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Kazanan: ' + winner;
  } else {
    status = 'Sıradaki oyuncu: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = '# numaralı hamleye git' + move;
    } else {
      description = 'Oyunun başlangıcına git';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Son temizlik {/*final-cleanup*/}

Eğer kodu yakından incelerseniz, `currentMove` çift ise `xIsNext === true`, `currentMove` tek ise `xIsNext === false` olduğunu göreceksiniz. Diğer bir deyişle eğer `currentMove` değişkeninin değerini biliyorsanız, `xIsNext` değerinin ne olduğunu tahmin edebilirsiniz.

Bunların her ikisini de state'te saklamanız için hiçbir neden yoktur. Aslında, her zaman gereksiz state'ten kaçınmaya çalışın. State'te sakladıklarınızı basitleştirmek hataları azaltır ve kodunuzun anlaşılmasını kolaylaştırır. `Game` bileşenini `xIsNext` değişkenini ayrı bir state olarak saklamayacak ve bunun yerine `currentMove` değişkenine göre hesaplayacak şekilde değiştirin:

```js {4,11,15}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  // ...
}
```

Artık `xIsNext` state değişkenine ya da `setXIsNext` çağrısına ihtiyacanız yoktur. Artık bileşenleri kodlarken bir hata yapsanız bile `xIsNext`'in `currentMove` ile senkronizasyonunun bozulma ihtimali yoktur.

### Toparlama {/*wrapping-up*/}

Tebrikler! Şunları yapan bir tic-tac-toe oyunu yarattınız:

- Tic-tac-toe oynamanızı sağlayan,
- Bir oyuncunun oyunu ne zaman kazandığını gösteren,
- Oyun ilerledikçe geçmiş hamleleri saklayan,
- Oyuncuların geçmiş hamleleri incelemesine ve oyun tahtasının önceki durumlarını görmesine olanak tanıyan.

Güzel iş! Umarız React'in nasıl çalıştığı hakkında hatırı sayılır bir bilgiye sahip olmuşsunuzdur.

Kodun son haline göz atın:

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Kazanan: ' + winner;
  } else {
    status = 'Sıradaki oyuncu: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = '# numaralı hamleye git' + move;
    } else {
      description = 'Oyunun başlangıcına git';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Eğer fazladan zamanınız varsa ya da yeni React becerilerinizi geliştirmek istiyorsanız, işte tic-tac-toe oyununda yapabileceğiniz iyileştirmeler için bazı fikirler artan zorluk seviyesine göre sıralanmıştır:

1. Yalnızca geçerli hamle için, bir buton yerine "# numaralı hamledesiniz..." ifadesini gösterin.
1. Kareleri doğrudan koda yazmak yerine iki döngü kullancak şekilde `Board` bileşenini tekrar yazın.
1. Yapilan hamleleri artan veya azalan şekilde görüntülemenizi sağlayan bir buton ekleyin.
1. Biri oyunu kazandığında, kazanmaya sebep olan kareleri başka bir renkle belirtin (kimse kazanmadığında, oyunun berabere bittiğini söyleyen bir mesaj gösterin).
1. Her hamlenin konumunu hamle geçmişi listesinde (satır, sütun) biçiminde gösterin.

Bu öğretici boyunca elementler, bileşenler, prop'lar ve state gibi React kavramlarını öğrendiniz. Artık bu kavramların bir oyun yaparken nasıl  çalıştığını gördüğünze göre, aynı React kavramlarının bir uygulamanın kullanıcı arayüzünü yaparken nasıl çalıştığını görmek için [React'te Düşünmek](/learn/thinking-in-react) sayfasına göz atın.
