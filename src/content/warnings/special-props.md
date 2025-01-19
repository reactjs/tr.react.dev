---
title: Özel Props Uyarısı
---

Bir JSX öğesindeki çoğu prop bileşene iletilir, ancak React tarafından kullanılan ve bu nedenle bileşene iletilmeyen iki özel prop (`ref` ve `key`) vardır.

For instance, you can't read `props.key` from a component. If you need to access the same value within the child component, you should pass it as a different prop (ex: `<ListItemWrapper key={result.id} id={result.id} />` and read `props.id`). While this may seem redundant, it's important to separate app logic from hints to React.
