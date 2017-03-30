const combineReducer = (reducers) => {
  return (state, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {

      nextState[key] = reducers[key](state[key], action);

      return nextState;
    }, {});
  }
}
const todoApp = combineReducer({
  todos,
  visibilityFilter
});


const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);

    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  dispatch({});

  return { getState, dispatch, subscribe };
};
const store = createStore(counter);

// work in jsbin with:
//<script src="https://fb.me/react-15.1.0.js"></script>
//<script src="https://fb.me/react-dom-15.1.0.js"></script>
//<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.6.0/redux.min.js"></script>

const counter = (state=0, action={}) => {
  switch(action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const Counter = ({
  value,
  onIncrement,
  onDecrement
}) => (
 <div>
  <h1>{value}</h1>
  <button onClick={onIncrement}>+</button>
  <button onClick={onDecrement}>-</button>
 </div>
);

const { createStore } = Redux;
const store = createStore(counter);

const render = () => {
  ReactDOM.render(
    <Counter 
      value={store.getState()}
      onIncrement={()=>
        store.dispatch({
          type: 'INCREMENT'
        })
      }
      onDecrement={()=> 
        store.dispatch({
          type: 'DECREMENT'
        })
      }
    />,
    document.getElementById('root')
  );
  //document.body.innerText = store.getState();
};

store.subscribe(render);
render();

// document.addEventListener('click', () => {
//   store.dispatch({ type: 'INCREMENT' });
// });
