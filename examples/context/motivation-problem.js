class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-4,7}
  // Toolbar bileşeninin ek bir "theme" prop'u alması gerekir
  // ve onu ThemeButton'a geçirmelidir. Uygulamadaki her bir
  // button'un theme'yi bilmesi gerekiyorsa zor olabilir,
  // çünkü her bileşenden geçmesi gerekecek.
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
