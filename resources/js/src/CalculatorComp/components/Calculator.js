// import React, { Component } from 'react';

// //Components
// import Button from './Button';
// import Display from './Display';

// //Styles 
// import './styles/calculator.css';

// class Calculator extends Component {

//     constructor(props) {
//         super(props);
    
//         this.state = {
//             displayValue : "0",
//             value: null,
//             waitingForOperand: false,
//             operand: null
//         }
    
//         // This binding is necessary to make `this` work in the handleClick function
//         this.handleNumber = this.handleNumber.bind(this);
//         this.handleDecimal = this.handleDecimal.bind(this);
//         this.handleClearDisplay = this.handleClearDisplay.bind(this);
//         this.toggleSign = this.toggleSign.bind(this);
//         this.handlePercentage = this.handlePercentage.bind(this);
//         this.handleMath = this.handleMath.bind(this);
//       }

//       handleNumber(num) {
//         const { displayValue, waitingForOperand } = this.state;
    
//         if(waitingForOperand){
//           this.setState({
//             displayValue: String(num),
//             waitingForOperand: false
//           });
//         } else {
//           this.setState({
//             displayValue: displayValue === "0" ? String(num) : displayValue + num
//           });
//         }   
//       }
    
//       handleDecimal(){
//         const { waitingForOperand } = this.state;
    
//         if(waitingForOperand){
//           this.setState({
//             displayValue: ".",
//             waitingForOperand: false
//           });
//         }
//         else if(this.state.displayValue.indexOf(".") === -1){
//             this.setState({
//               displayValue: this.state.displayValue + ".",
//               waitingForOperand: false
//             })
//         }
//       }
    
//       handleClearDisplay(num) {
//         this.setState({
//           displayValue: "0"
//         })
//       }
    
//       toggleSign() {
//         const { displayValue } = this.state;
    
//         this.setState({
//           displayValue: Number(displayValue) > 0 ? "-" + displayValue : displayValue.substring(1)
//         });
//       }
    
//       handlePercentage() {
//         const { displayValue } = this.state;
//         const value = parseFloat(displayValue);
    
//         this.setState({
//           displayValue: String(value / 100)
//         });
//       }
    
//       handleMath(nextOperator){
//         const { displayValue, operand, value } = this.state;
//         const nextValue = parseFloat(displayValue);
    
//         const operations = {
//           "/": (prevValue, nextValue) => prevValue / nextValue,
//           "*": (prevValue, nextValue) => prevValue * nextValue,
//           "+": (prevValue, nextValue) => prevValue + nextValue,
//           "-": (prevValue, nextValue) => prevValue - nextValue,
//           "=": (prevValue, nextValue) => nextValue
//         };
    
//         if(value === null) {
//           this.setState({
//               value: nextValue
//           });
//         }
//         else if(operand) {
//         const curentValue = value || 0;
//         const calculatedValue = operations[operand](curentValue, nextValue);
         
//          this.setState({
//             value: calculatedValue,
//             displayValue: String(calculatedValue)
//           });
//         }
    
//         this.setState({
//           waitingForOperand: true,
//           operand: nextOperator
//         });
//       }

//     render() {
//         const { displayValue } = this.state;

//         return (
//               <div className="calc-wrapper">
//                 <div className="row">
//                    <Display calcValue={displayValue} />
//                 </div>
//                 <div className="row">
//                   <Button text={"AC"} onBtnClick={this.handleClearDisplay} />
//                   <Button text={"+/-"} onBtnClick={this.toggleSign} />
//                   <Button text={"%"} onBtnClick={this.handlePercentage} />
//                   <Button text={"/"} isOperand={true} onBtnClick={() => this.handleMath("/")} />
//                 </div>
//                 <div className="row">
//                   <Button text={"7"} onBtnClick={() => this.handleNumber(7)} />
//                   <Button text={"8"} onBtnClick={() => this.handleNumber(8)} />
//                   <Button text={"9"} onBtnClick={() => this.handleNumber(9)} />
//                   <Button text={"X"} isOperand={true} onBtnClick={() => this.handleMath("*")} />
//                 </div>
//                 <div className="row">
//                   <Button text={"4"} onBtnClick={() => this.handleNumber(4)} />
//                   <Button text={"5"} onBtnClick={() => this.handleNumber(5)} />
//                   <Button text={"6"} onBtnClick={() => this.handleNumber(6)} />
//                   <Button text={"-"} isOperand={true} onBtnClick={() => this.handleMath("-")} />
//                 </div>
//                 <div className="row">
//                   <Button text={"1"} onBtnClick={() => this.handleNumber(1)} />
//                   <Button text={"2"} onBtnClick={() => this.handleNumber(2)} />
//                   <Button text={"3"} onBtnClick={() => this.handleNumber(3)} />
//                   <Button text={"+"} isOperand={true} onBtnClick={() => this.handleMath("+")} />
//                 </div>
//                 <div className="row">
//                   <Button text={"0"} isDouble={true} onBtnClick={() => this.handleNumber(0)} />
//                   <Button text={"."} onBtnClick={this.handleDecimal} />
//                   <Button text={"="} isOperand={true} onBtnClick={() => this.handleMath("=")} />
//                 </div>
//               </div>
//           );
//     }
// } 

// export default Calculator;