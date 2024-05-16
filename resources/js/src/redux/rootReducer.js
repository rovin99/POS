const intialState = {
  loading: false,
  cartItems: [],
};

export const rootReducer = (state = intialState, action) => {
  switch (action.type) {
    case "SHOW_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "HIDE_LOADING":
      return {
        ...state,
        loading: false,
      };
      case "ADD_TO_CART":
        const existingItemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
        if (existingItemIndex >= 0) {
          // Item exists, update quantity
          return {
           ...state,
            cartItems: state.cartItems.map((item, index) =>
              index === existingItemIndex? {...item, quantity: item.quantity + 1 } : item
            ),
          };
        } else {
          // New item, add to cart
          return {
           ...state,
            cartItems: [...state.cartItems, {...action.payload, quantity: 1 }],
          };
        }
      
        case "UPDATE_CART":
          return {
           ...state,
            cartItems: state.cartItems.map((cartItem) =>
              cartItem.id === action.payload.id
               ? {...cartItem, quantity: action.payload.quantity }
                : cartItem
            ),
          };
        
    case "DELETE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.id !== action.payload.id
        ),
      };
    case "CLEAR_CART":
        return {
         ...state,
          cartItems: [],
        };
    default:
      return state;
  }
};
