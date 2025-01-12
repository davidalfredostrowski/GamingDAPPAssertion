import React,{ Component, useState } from 'react'
import Web3 from 'web3'
import { ethers } from "ethers";
import './App.css';

import GamingAbi from './contractsData/Gaming.json'
import GamingAddress from './contractsData/Gaming-address.json'



class App extends Component{
    constructor(props){
	super(props)
	this.state = { selectedOption: ' ', wager: 0, account: '', player1: '' ,
            playerNumber: '',
            highLow: 'lower',
            wager: '',
            historyData: [],
            snackbar: false,
            message: '',
            result: []
	}
	this.handleChange = this.handleChange.bind(this)
        this.onValueChange = this.onValueChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this)
        this.contentRef = React.createRef();

    }


    componentWillMount(){
		this.loadBlockchainData()
    }






	// Sample wait function to wait for a transaction to be mined
async waitForTransaction(txHash) {
  console.log(`Waiting for transaction ${txHash} to be mined...`);
  let receipt = null;

  while (receipt === null) {
    // Wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    receipt = await Web3.eth.getTransactionReceipt(txHash);
  }

  console.log("Transaction mined!");
  return receipt;
}

    async loadBlockchainData(){
    
 // const [playerSessions, setPlayerSessions] = useState([]);
//    const  loadBlockchainData = async () =>{


	    const web3 = new Web3(new Web3.providers.HttpProvider("http://ec2-34-221-100-136.us-west-2.compute.amazonaws.com:8545"))
    var account;
    const accounts  = await web3.eth.getAccounts()
    console.log(accounts)
    web3.eth.getAccounts().then((f) => {
        account = f[0];
    })

    this.setState( { account : accounts[0] })
    console.log(account);
    const contract = new web3.eth.Contract(GamingAbi.abi);
    contract.options.address = GamingAddress.address
    this.setState( { contract })
	



	const owner = accounts[0]
	const player1 = accounts[1]
	//this.setState({ player1: accounts[1] })
	this.setState({ player1 })
	this.setState({ web3 } )
	    //var config  = require('./Gaming.json');   // put a copy in /src directory.....

	contract.methods.fundGame().send({from: owner, value: web3.utils.toWei('10', 'ether')}).then((f) => console.log(f))	

	const initialBalance = await web3.eth.getBalance(player1)
	alert("initialBalance     " + String(initialBalance));
	console.log("initialBalance",initialBalance)
	const initialBalanceInEther = Number(web3.utils.fromWei(initialBalance, 'ether'))
	alert("initialBalanceInEther   " + String(initialBalanceInEther));
	console.log("initialBalanceInEther",initialBalanceInEther)
		
	//   two parameters this time: ( will mystery number be higher or lower than your given umber are higher(true) or lower(false)    )
	console.log("just before first call..., passing in a '12' as the player number with bet to be higher.")

	// true:  mystery number > player
	// false: mystery number < player

       	// FIX !   I need to put in a second to get this to run! a 'call' will only perform a read and not update the blockchain
 	// put in the user account address  ------ the short one , not the private key!!!!

 const tx = await this.state.contract.methods.winOrLose(11, true).send({from: this.state.player1 ,value: this.state.web3.utils.toWei(this.state.wager, 'ether')}).then((f) => console.log(f))
	
//await tx.wait;
console.log("el fini")

}




// Form submitting logic, prevent default page refresh
async handleSubmit(event){

  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";


//const [count, setCount] = useState(0);
        var resultOutput;
	const { selectedOption, wager, history, result } = this.state
	event.preventDefault()
	console.log(this.state.selectedOption)
	alert("this.state.selectedOption")
	alert( this.state.selectedOption)
	let  HigherThanMysteryNumber = "true"
	if (this.state.selectedOption == "High") {
		HigherThanMysteryNumber = true
	}
	else{
		HigherThanMysteryNumber = false
	}
 	alert("HigherThanMysteryNumber")
 	alert(HigherThanMysteryNumber)
	if (HigherThanMysteryNumber) { 
		alert ("yessss")
	}
	console.log("HigherThanMysteryNumber",HigherThanMysteryNumber)
	console.log("this.state.wager",this.state.wager)	
	// works!!!!!   
try { 
//  const data = contract.methods.exampleFunction().encodeABI();
const data =   this.state.contract.methods.winOrLose(10, HigherThanMysteryNumber).send({from: this.state.player1 ,value: this.state.web3.utils.toWei(this.state.wager, 'ether')}).encodeABI(); 



  const tx = {
    to: GamingAddress.address, //i//contractAddress,
    data,
    gas: 2000000,
  };

  const signedTx = await Web3.eth.accounts.signTransaction(tx, privateKey);

  const txHash = await Web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(`Transaction sent with hash: ${txHash.transactionHash}`);

  // Wait for the transaction to be mined
 
  let receipt = null;

  while (receipt === null) {
    // Wait for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    receipt = await Web3.eth.getTransactionReceipt(txHash);
  }

  console.log("Transaction mined!");




//	const receipt = await waitForTransaction(txHash.transactionHash);
//  console.log("Transaction receipt:", receipt);




//	try {
//const tx =   this.state.contract.methods.winOrLose(10, HigherThanMysteryNumber).send({from: this.state.player1 ,value: this.state.web3.utils.toWei(this.state.wager, 'ether')})   //.then((f) => console.log(f))

}
catch(error){
	console.log(error);
}



	console.log("player1, account1", this.state.player1)



    	const initialBalance = await this.state.web3.eth.getBalance(this.state.player1)
	alert("initialBalance     " + String(initialBalance));
	alert(initialBalance)
	console.log("initialBalance",initialBalance)
	const currentBalanceInEther = Number(this.state.web3.utils.fromWei(initialBalance, 'ether'))
	alert("currentBalanceInEther   " + String(currentBalanceInEther));
	console.log("**** kaboom **** just  before get past events - currentBalanceInEther",currentBalanceInEther)
// 'AllEvents', 
	//
const newHistory = this.state.historyData
const newResult = this.state.result;

	this.state.contract.getPastEvents(
	{
		fromBlock: 0,
		toBlock: 'latest'
	}).then(function(events) {
		console.log(events);
                console.log(events[0].returnValues)

                console.log('junk')

const objectLength = Object.keys(events).length
                console.log('objectLength', objectLength )   
		console.log('events[1].returnValues.toString()', events[1].returnValues.toString() )

		console.log('events[1].returnValues', events[1].returnValues)
		newHistory.push( "test")

 console.log("JSON string",  JSON.stringify(events[1].returnValues[4])  )
 console.log("JSON string2 ",  JSON.stringify(events[objectLength-1].returnValues[4])  )
console.log("new history", newHistory)
newHistory.push(JSON.stringify(events[objectLength-1].returnValues[4]));

		//setResults("testt")
//this.contentRef.current.textContent =  JSON.stringify(events[objectLength-1].returnValues[4]);
resultOutput =  JSON.stringify(events[objectLength-1].returnValues[4]);
console.log("resultOuptut line 182", resultOutput)

	})
	.catch(function(error) {
		console.log(error);
	});
this.contentRef.current.textContent = newHistory //newHistory[1]  
       this.setState({ historyData: newHistory } )   
   this.setState({ result: newResult } )
//this.onValueChange()
// works   ( with string passed in )
console.log("test")
console.log("resultOutput", "crapola" )    // resultOutput)
//console.log("JSON.stringify(events[objectLength-1].returnValues[4])", JSON.stringify(events[objectLength-1].returnValues[4]))


//this.contentRef.current.textContent = "crap20"


// this.state.result  // "junk"//resultOutput; //JSON.stringify(events[objectLength-1].returnValues[4]);
	//   this.setState({ result: JSON.stringify(events[objectLength].returnValues[4]) } )
}



// input changes of all the input field using ES6
// javascript feature computed property names
handleChange(event){
    this.setState({
      wager: event.target.value
    });
}

onValueChange(event) {
    this.setState({
      selectedOption: event.target.value
    });
}
 // const handleStateChange = (value) => {
 //   setParentState(value);
//  };


// Return a controlled form i.e. values of the
// input field not stored in DOM values are exist
// in react component itself as state
// this.handleSubmit

render(){
	return(
	<form onSubmit={this.handleSubmit}>
        <div className="radio">
          <label>
            <input
              type="radio"
              value="High"
              checked={this.state.selectedOption === "High"}
              onChange={this.onValueChange}
            />
            Mystery number is higher
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              type="radio"
              value="Low"
              checked={this.state.selectedOption === "Low"}
              onChange={this.onValueChange}
            />
            Mystery Number is lower
          </label>
        </div>      
 <div>
          Selected option is : {this.state.selectedOption}
	  Current History is: {  JSON.stringify(this.state.historyData) }
          last round:       { JSON.stringify(this.state.result) }   


		</div>
		<div>
		<label htmlFor='wager'>wager</label>
		<input
			name='wager'
			placeholder='0'
			value = {this.state.wager}
			onChange={this.handleChange}
		/>
		</div>
				<div>
		<button>Play Round!</button>
		</div>
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>Class-Based Component Example</h1>
        <p ref={this.contentRef}>Waiting for updates...</p>
      </div>	

</form>

	)
}
}

export default App 
