---
title: Hook'ların Kuralları
---

<Intro>
Hook'lar JavaScript fonksiyonları kullanılarak tanımlanır, ancak nerede çağrılabilecekleri konusunda kısıtlamaları olan özel bir yeniden kullanılabilir UI mantığı türünü temsil ederler.
</Intro>

<InlineToc />

---

##  Hook'ları yalnızca en üst düzeyde çağırın {/*only-call-hooks-at-the-top-level*/}

İsimleri `use` ile başlayan fonksiyonlar React'te [*Hooks*](/reference/react) olarak adlandırılır.

**Hook'ları döngüler, koşullar, iç içe fonksiyonlar veya `try`/`catch`/`finally` blokları içinde çağırmayın.** Bunun yerine, Hook'ları her zaman React fonksiyonunuzun en üst seviyesinde, herhangi bir erken dönüşten önce kullanın. Hook'ları yalnızca React bir fonksiyon bileşenini işlerken çağırabilirsiniz:

* ✅ Bunları bir [fonksiyon bileşeninin](/learn/your-first-component) gövdesinde en üst seviyede çağırın.
* ✅ Bunları bir [özel Hook](/learn/reusing-logic-with-custom-hooks)'un gövdesinde en üst düzeyde çağırın.

```js{2-3,8-9}
function Counter() {
  // ✅ İyi: bir işlev bileşeninde üst düzey
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ İyi: özel bir Hook içinde üst düzey
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

Hook'ları (`use` ile başlayan fonksiyonlar) başka herhangi bir durumda çağırmak **desteklenmez**, örneğin:

* 🔴 Hook'ları koşulların veya döngülerin içinde çağırmayın.
* 🔴 Hook'ları koşullu bir `return` ifadesinden sonra çağırmayın.
* 🔴 Hook'ları olay işleyicilerinde çağırmayın.
* 🔴 Hook'ları sınıf bileşenlerinde çağırmayın.
* 🔴 Hook'ları `useMemo`, `useReducer` veya `useEffect`'e geçirilen fonksiyonların içinde çağırmayın.
* 🔴 Hook'ları `try`/`catch`/`finally` blokları içinde çağırmayın.

Bu kuralları ihlal ederseniz, bu hatayı görebilirsiniz.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Kötü: bir durumun içinde (düzeltmek için, dışarı taşıyın!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Kötü: bir döngünün içinde (düzeltmek için dışarı taşıyın!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Kötü: koşullu dönüşten sonra (düzeltmek için dönüşten önce taşıyın!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Kötü: bir olay işleyicisinin içinde (düzeltmek için dışarı taşıyın!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Kötü: useMemo'nun içinde (düzeltmek için dışarı taşıyın!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Kötü: bir sınıf bileşeninin içinde (düzeltmek için, sınıf yerine bir fonksiyon bileşeni yazın!)
    useEffect(() => {})
    // ...
  }
}

function Bad() {
  try {
    // 🔴 Kötü: try/catch/finally bloğu içinde (düzeltmek için dışarı taşıyın!)
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

Bu hataları yakalamak için [`eslint-plugin-react-hooks` eklentisini](https://www.npmjs.com/package/eslint-plugin-react-hooks) kullanabilirsiniz.

<Note>

[Özel Hook'lar](/learn/reusing-logic-with-custom-hooks) *diğer Hook'ları çağırabilir* (tüm amaçları budur). Bu işe yarar çünkü özel Hook'ların da yalnızca bir işlev bileşeni işlenirken çağrılması gerekir.

</Note>

---

## Only call Hooks from React functions {/*only-call-hooks-from-react-functions*/}

Don’t call Hooks from regular JavaScript functions. Instead, you can:

✅ Call Hooks from React function components.
✅ Call Hooks from [custom Hooks](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component).

By following this rule, you ensure that all stateful logic in a component is clearly visible from its source code.

```js {2,5}
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ Not a component or custom Hook!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```
