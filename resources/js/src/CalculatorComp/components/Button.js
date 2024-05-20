// import React from 'react';
// import PropTypes from 'prop-types';

// //Styles
// import './styles/button.css'

// const Button = (props) => {
//     const { text, isOperand, isDouble, onBtnClick } = props;

//     return (
//         <button 
//             className={`btn ${isOperand ? "btnOrange" : "btnDefault"} ${isDouble ? "btnDouble": ""}`}
//             onClick={(e) => {
//                 e.preventDefault();
//                 onBtnClick() 
//             }}>
//             {text}
//         </button>
//     );
// }

// Button.propTypes = {
//     text: PropTypes.string.isRequired,
//     isOperand: PropTypes.bool,
//     isDouble: PropTypes.bool,
//     onBtnClick: PropTypes.func
// }

// export default Button;