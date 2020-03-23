// highlight-range{1-4}
// Context her bir bileşenin içinden açıkça geçmeden, 
// bileşen ağacının derinliklerine bir value geçmemizi sağlar.
// Mevcut theme için bir context oluştur (varsayılan olarak "light" ile).
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // highlight-range{1-3,5}
    // Geçerli temayı aşağıdaki ağaca taşımak için bir Provider kullanın.
    // Herhangi bir bileşen ne kadar derinde olursa olsun okuyabilir.
    // Bu örnekte, mevcut değer olarak "dark" geçiyoruz.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// highlight-range{1,2}
// Aradaki bir bileşen artık temayı açıkça aşağı aktarmak zorunda değil.
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // highlight-range{1-3,6}
  // Mevcut tema context'ini okumak için bir contextType atayın.
  // React, en yakın tema Provider'ı bulacak ve değerini kullanacak.
  // Bu örnekte mevcut tema "dark"tır.
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
