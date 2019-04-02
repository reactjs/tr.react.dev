class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-4,7}
  // Toolbar bileşeni fazladan "theme" prop'u almak zorunda 
  // ve onu ThemedButton'a geçirmek zorundadır. 
  // Uygulamadaki her Button theme prop'unu bilmesi gerekiyor ve onu
  // tüm bileşenlerden geçirmek zorunda kalıyorsa bu işlem biraz zahmetli olabilir.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
