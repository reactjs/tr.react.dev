---
title: Sunucu Bileşenleri
---

<RSC>

Server Components, [React Server Components](/learn/start-a-new-react-project#full-stack-frameworks) içinde kullanılmak içindir.

</RSC>

<Intro>

Sunucu Bileşenleri, önceden, paketlemeden önce, istemci uygulamanızdan veya SSR sunucusundan ayrı bir ortamda render edilen yeni bir Bileşen türüdür.

</Intro>

Bu ayrı ortam, React Sunucu Bileşenlerinde "sunucu" olarak adlandırılır. Sunucu Bileşenleri, CI sunucunuzda build zamanı sırasında bir kez çalışabilir veya her istekte bir web sunucusu kullanılarak çalıştırılabilir.

<InlineToc />

<Note>

#### Sunucu Bileşenleri için nasıl destek oluşturulur? {/*how-do-i-build-support-for-server-components*/}

React 19'daki React Sunucu Bileşenleri kararlı ve küçük sürümler arasında bozulmayacak olsa da, React Sunucu Bileşenleri paketleyicisi veya çatısı (framework) oluşturmak için kullanılan temel API'ler semver (sürüm numarası yönetimi) kurallarına uymamakta ve React 19.x'in küçük sürümleri arasında bozulabilir.

React Sunucu Bileşenleri'ni bir paketleyici veya framework olarak desteklemek için, belirli bir React sürümüne sabitlemenizi veya Canary sürümünü kullanmanızı öneririz. Gelecekte, React Sunucu Bileşenleri'ni uygulamak için kullanılan API'leri stabilize etmek amacıyla paketleyiciler ve framework'lerle çalışmaya devam edeceğiz.

</Note>

### Sunucu Olmadan Sunucu Bileşenleri {/*server-components-without-a-server*/}
Sunucu bileşenleri, dosya sisteminden okumak veya statik içerik almak için build zamanı sırasında çalışabilir, bu nedenle bir web sunucusu gerekmez. Örneğin, bir içerik yönetim sisteminden statik veriler okumak isteyebilirsiniz.

Sunucu Bileşenleri olmadan, statik verileri istemcide bir Efekt ile almak yaygındır:
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // NOT: İlk sayfa render'ından *sonra* yüklenir.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

Bu desen, kullanıcıların ek olarak 75K (gzipped) kütüphane indirip çözümlemeleri gerektiği ve sayfa yüklendikten sonra verileri almak için ikinci bir isteği beklemeleri gerektiği anlamına gelir; sadece sayfa ömrü boyunca değişmeyecek statik içeriği render etmek için.

Sunucu Bileşenleri ile, bu bileşenleri build zamanı sırasında bir kez render edebilirsiniz:

```js
import marked from 'marked'; // Paket içinde dahil edilmemiş
import sanitizeHtml from 'sanitize-html'; // Paket içinde dahil edilmemiş

async function Page({page}) {
 // NOT: Render sırasında, uygulama build edilirken yüklenir.
  const content = await file.readFile(`${page}.md`);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

Render edilen çıktı daha sonra sunucu tarafında render edilip (SSR) HTML olarak oluşturulabilir ve bir CDN'ye yüklenebilir. Uygulama yüklendiğinde, istemci orijinal `Page` bileşenini veya markdown render'lamak için kullanılan pahalı kütüphaneleri görmez. İstemci yalnızca render edilmiş çıktıyı görür:

```js
<div><!-- markdown için html --></div>
```

Bu, içeriğin ilk sayfa yüklemesi sırasında görünür olduğu ve paketlemenin statik içeriği render etmek için gereken pahalı kütüphaneleri içermediği anlamına gelir.

<Note>

Yukarıdaki Sunucu Bileşeni'nin bir async fonksiyon olduğunu fark etmiş olabilirsiniz:

```js
async function Page({page}) {
  //...
}
```

Async Bileşenleri, render sırasında `await` yapmanıza olanak tanıyan Sunucu Bileşenleri'nin yeni bir özelliğidir.

Aşağıda [Sunucu Bileşenleri ile Async Bileşenleri](#async-components-with-server-components) başlığına bakın.

</Note>

### Sunucu ile Sunucu Bileşenleri {/*server-components-with-a-server*/}
Sunucu Bileşenleri, bir sayfa isteği sırasında bir web sunucusunda da çalışabilir, böylece bir API oluşturmanıza gerek kalmadan veri katmanınıza erişmenizi sağlar. Uygulamanız paketlenmeden önce render edilirler ve veri ile JSX'i İstemci Bileşenlerine prop olarak geçirebilirler.

Sunucu Bileşenleri olmadan, dinamik verileri istemcide bir Efekt ile almak yaygındır:

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // NOT: İlk render'dan *sonra* yüklenir.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);

  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
// NOT: Note render'ı *sonra* yüklenir.
// Pahalı bir istemci-sunucu şelalesine neden olur.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

Sunucu Bileşenleri ile veriyi okuyabilir ve bileşende render edebilirsiniz:

```js
import db from './database';

async function Note({id}) {
  // NOT: Render sırasında *yüklenir.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
 // NOT: Note'dan *sonra* yüklenir,
 // ancak veri aynı konumda ise hızlıdır.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

Paketleyici, ardından veriyi, render edilen Sunucu Bileşenlerini ve dinamik İstemci Bileşenlerini bir pakette birleştirir. İsteğe bağlı olarak, bu paket daha sonra sunucu tarafında render edilip (SSR) sayfanın ilk HTML'ini oluşturabilir. Sayfa yüklendiğinde, tarayıcı orijinal `Note` ve `Author` bileşenlerini görmez; yalnızca render edilmiş çıktı istemciye gönderilir:

```js
<div>
  <span>Yazan: React Ekibi</span>
  <p>React 19...</p>
</div>
```

Sunucu Bileşenleri, sunucudan tekrar alınıp veriye erişip yeniden render edilerek dinamik hale getirilebilir. Bu yeni uygulama mimarisi, sunucu odaklı Çok Sayfalı Uygulamalar'ın basit “istek/cevap” zihniyet modelini, istemci odaklı Tek Sayfa Uygulamalarının sorunsuz etkileşimiyle birleştirir ve size her iki dünyanın da en iyisini sunar.

### Sunucu Bileşenlerine Etkileşim Ekleme {/*adding-interactivity-to-server-components*/}

Sunucu Bileşenleri tarayıcıya gönderilmez, bu yüzden `useState` gibi etkileşimli API'leri kullanamazlar. Sunucu Bileşenlerine etkileşim eklemek için, bunları `"use client"` direktifini kullanarak İstemci Bileşeni ile birleştirebilirsiniz.

<Note>

#### Sunucu Bileşenleri için bir direktif yoktur. {/*there-is-no-directive-for-server-components*/}

Yaygın bir yanlış anlama, Sunucu Bileşenlerinin `"use server"` ile gösterildiğidir, ancak Sunucu Bileşenleri için bir direktif yoktur. Sunucu İşlevleri için `"use server"` direktifi kullanılır.

Daha fazla bilgi için, [Direktifler](/reference/rsc/directives) dökümantasyonuna bakın.

</Note>


Aşağıdaki örnekte, `Notes` Sunucu Bileşeni, `expanded` state'ini değiştirmek için state kullanan bir `Expandable` İstemci Bileşenini içe aktarır:
```js
// Sunucu Bileşeni
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// İstemci Bileşeni
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

Bu, önce `Notes`'u bir Sunucu Bileşeni olarak render edip, ardından paketleyiciye `Expandable` İstemci Bileşeni için bir paket oluşturması talimatı vererek çalışır. Tarayıcıda, İstemci Bileşenleri, prop olarak geçirilen Sunucu Bileşenlerinin çıktısını görecektir:

```js
<head>
  <!-- İstemci Bileşenleri için paket -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>bu ilk nottur</p>
    </Expandable>
    <Expandable key={2}>
      <p>bu ikinci nottur</p>
    </Expandable>
    <!--...-->
  </div>
</body>
```

### Sunucu Bileşenleri ile Async Bileşenleri {/*async-components-with-server-components*/}

Sunucu Bileşenleri, async/await kullanarak Bileşen yazmanın yeni bir yolunu tanıtır. Bir async bileşen içinde `await` kullandığınızda, React render'lamaya devam etmeden önce promise'in çözülmesini bekler. Bu, sunucu/istemci sınırlarında, Suspense için stream desteğiyle çalışır.

Hatta sunucuda bir promise oluşturabilir ve bunu istemcide bekleyebilirsiniz:

```js
// Sunucu Bileşeni
import db from './database';

async function Page({id}) {
  // Sunucu Bileşenini askıya alır.
  const note = await db.notes.get(id);

  // NOT: await edilmedi, burada başlayacak ve client tarafında await edilecek.
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Yorumlar Yükleniyor...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// İstemci Bileşeni
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOT: Bu, sunucudan gelen promise'i yeniden başlatacak.
  // Veriler mevcut olana kadar askıya alınacak.
  const comments = use(commentsPromise);
  return comments.map(commment => <p>{comment}</p>);
}
```

`note` içeriği, sayfanın render edilmesi için önemli bir veri olduğu için, sunucuda `await` edilir. Yorumlar ise daha aşağıda ve önceliği düşük olduğundan, promise'i sunucuda başlatırız ve istemcide `use` API'si ile bekleriz. Bu, istemcide askıya alınacak, ancak `note` içeriğinin render edilmesini engellemeyecektir.

Asyn bileşenler client'ta desteklenmez, Promiseları `use` ile bekleriz.
