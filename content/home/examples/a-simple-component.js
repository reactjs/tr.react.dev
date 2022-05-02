class HelloMessage extends React.Component {
  render() {
<<<<<<< HEAD
    return (
      <div>
        Merhaba {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Ali" />,
  document.getElementById('hello-example')
);
=======
    return <div>Hello {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="Taylor" />);
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d
