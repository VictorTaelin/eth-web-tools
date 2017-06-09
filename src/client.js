const R = require("ramda");
const Eth = require("./../../../eth/ethfp");
const defaultAccount = Eth.Account.fromPrivate("0x0000000000000000000000000000000000000000000000000000000000000001");

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ethUrl: "http://maiavictor.com:8545",
      privateKey: "",
      value: "",
      to: "",
      data: "",
      gas: "",
      chainId: "",
      rawTransaction: "",
      signedTransaction: ""
    }
  }
  set(field) {
    return value => this.setState({[field]: value});
  }
  sign() {
    console.log(this.state.data);
    const eth = Eth.Api(Eth.Provider(this.state.ethUrl));
    eth.addTransactionDefaults({
      data: this.state.data,
      from: this.state.address || defaultAccount.address,
      gas: this.state.gas,
      chainId: this.state.chainId,
    }).then(tx => {
      tx.to = "0x";
      this.setState({
        rawTransaction: JSON.stringify(tx),
        signedTransaction: Eth.Account.signTransaction(tx, this.state.privateKey || defaultAccount.privateKey)
      });
    }).catch(e => console.log(e));
  }
  render() {
    const fieldForm = (name, field) => <tr>
      <td>{name}: </td>
      <td><input onChange={e => this.set(field)(e.target.value)}/></td>
    </tr>;
    return <div>
      <table>
        <tbody>
          {fieldForm("ethUrl", "ethUrl")}
          {fieldForm("value", "value")}
          {fieldForm("gas", "gas")}
          {fieldForm("chainId", "chainId")}
          {fieldForm("data", "data")}
          {fieldForm("privateKey", "privateKey")}
          <tr>
            <td>
              <button onClick={this.sign.bind(this)}>
                SIGN
              </button>
            </td>
            <td>
              <p>Raw:</p>
              <p><textarea cols={40} rows={5} value={this.state.rawTransaction}/></p>
              <p>Signed:</p>
              <p><textarea cols={40} rows={5} value={this.state.signedTransaction}/></p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>;
  }
}

window.onload = function(){
  ReactDOM.render(
    React.createElement(Main),
    document.getElementById("main"));
};
