---
title: flushSync
---

<Pitfall>

`flushSync` kullanımı yaygın değildir ve uygulamanızın performansına zarar verebilir.

</Pitfall>

<Intro>

`flushSync`, sağlanan callback içindeki herhangi bir güncellemeyi zorla ve senkronize bir şekilde işlemeye olanak sağlar. Bu, DOM'u anında güncelleyecektir.

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

Bekleyen tüm islemleri aninda calistirmak ve DOM'u hemen güncellemek için `flushSync` fonksiyonunu kullanın.


```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

Çoğunlukla, `flushSync` kullanmanıza gerek yoktur. `flushSync`'i sadece son çareniz olduğunda kullanın.

[Daha fazla örnek için aşağıdaki linki tıklayın.](#usage)

#### Parametreler {/*parameters*/}


* `callback`: Bir fonksiyon. React, bu callback'i hemen çağırır ve içerdiği tüm güncellemeleri senkronize bir şekilde gerçekleştirir. Aynı zamanda bekleyen güncellemeleri, Effect'leri veya Effect'ler içindeki güncellemeleri de gerçekleştirebilir. Eğer `flushSync` çağrısı sonucunda bir güncelleme duraklatılırsa, fallback'ler tekrar görünebilir.

#### Geri Döndürür {/*returns*/}

`flushSync` `undefined` geri döndürür.

#### Uyarılar {/*caveats*/}

* `flushSync` performansı önemli ölçüde düşürebilir. Sınırlı şekilde kullanın.
* `flushSync` bekleyen Suspense sınırlarını `fallback` durumunu göstermeye mecbur bırakabilir.
* `flushSync` bekleyen effect'leri tetikleyebilir ve içerdikleri güncellemeleri döndürmeden önce senkron bir şekilde uygulayabilir.
* `flushSync` callback içindeki güncellemeleri işlemek gerektiğinde, callback dışındaki güncellemeleri işleyebilir. Örneğin, bir tıklama sonucu bekleyen güncellemeler varsa, React bu güncellemeleri callback içindeki güncellemeleri işlemeden önce işleyebilir.


---

## Kullanım {/*usage*/}

### Üçüncü Parti Entegrasyonlar için Güncellemeleri İşleme {/*flushing-updates-for-third-party-integrations*/}

Tarayıcı API'leri veya UI kütüphaneleri gibi üçüncü parti kodlarıyla entegrasyon sağlarken, React'in güncellemeleri zorla işlemesi gerekebilir. Callback içerisindeki herhangi bir <CodeStep step={1}>durum güncellemesi</CodeStep>'ni senkron bir şekilde işlemek için `flushSync` kullanın:

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// Bu satıra gelindiğinde, DOM güncellenmiştir.
```

Bir sonraki kod satırı çalıştığında, React'in zaten DOM'u güncellediğini garanti eder.

**`flushSync` kullanımı yaygın değildir ve sık kullanımı uygulamanızın performansını büyük ölçüde düşürebilir.** Eğer uygulamanız sadece React API'lerini kullanıyorsa ve üçüncü parti kütüphanelerle entegre değilse, `flushSync`'e ihtiyaç duyumamalıdır.

Ancak, tarayıcı API'leri gibi üçüncü parti kodlarla entegrasyon yapmak için kullanışlı olabilir.

Bazı tarayıcı API'leri, callback içindeki sonuçların callback'in sonuna kadar DOM'a senkron bir şekilde yazılmasını bekler, böylece tarayıcı, oluşturulan DOM ile bir şeyler yapabilir. Çoğu durumda, React bunu sizin için otomatik olarak halleder. Ancak bazı durumlarda senkron bir güncellemeyi zorlamak gerekebilir.

Örneğin, tarayıcının `onbeforeprint` API'si, yazdırma iletişim kutusu açılmadan hemen önce sayfayı değiştirmenize olanak sağlar. Bu, belgenin yazdırma için daha iyi bir şekilde görüntülenmesine olanak sağlayan özel yazdırma stillerinin uygulanması için yararlıdır. Aşağıdaki örnekte, `onbeforeprint` callback'inde `flushSync`'i hemen React durumunu DOM'a "güncellemek" için kullanıyorsunuz. Böylece, yazdırma penceresi açıldığında, `isPrinting` "yes" olarak görünür:

<Sandpack>

```js App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

</Sandpack>

<<<<<<< HEAD
`flushSync` olmadığında, yazdırma diyalogu `isPrinting`'i "hayır" olarak gösterir. Bunun sebebi, React'in güncellemeleri asenkron bir şekilde biriktirmesi ve yazdırma diyalogunun durum güncellenmeden önce görüntülenmesidir.
=======
Without `flushSync`, the print dialog will display `isPrinting` as "no". This is because React batches the updates asynchronously and the print dialog is displayed before the state is updated.
>>>>>>> 5219d736a7c181a830f7646e616eb97774b43272

<Pitfall>

`flushSync`, performansı önemli ölçüde etkileyebilir ve bekleyen Suspense sınırlarını beklenmedik şekilde fallback durumlarını göstermeye zorlayabilir.

Çoğu zaman, `flushSync`'in kullanılımına gerek yoktur, dolayısıyla `flushSync`'i son çare olarak kullanın.

</Pitfall>
