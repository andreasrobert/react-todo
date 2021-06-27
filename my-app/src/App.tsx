import React, { useEffect, useReducer, useState } from 'react';
import './App.css';
import reducer, { TodoList } from './reducers/todo'



function App() {
  const [input, setInput] = useState("");
  const isInputEmpty = input === "";
  const [state, dispatch] = useReducer(reducer, [] as TodoList);


  useEffect(()=>{
    fetch("http://localhost:8000/todo-json",{
      method: "GET",  
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      
    }).then(result => result.json()).then(parsedResult => {
      console.log('what is result', parsedResult);
      dispatch({ type: "loadData", data: parsedResult.todoTasks })
    })
  },[isInputEmpty])


  const onClear = () => {
    dispatch({type: "removeAll"})
  }

  const onRemoveTodo = (itemId) => { 
    fetch(`http://localhost:8000/remove-json/${itemId}`, {
      method: "get"
    })
    dispatch({type:"removeOne", data:itemId})
  }


  const removeSelected = () => {
    state.filter(item => item.selected).forEach(item =>{
      onRemoveTodo(item._id)
    })
  }


  console.log({state});


  return (
    <div className="App">
      <header className="App-header">

        <div>
          <input type="text" value={input} onChange={(event) => { setInput(event.target.value) }} />
          <button onClick={() => {
            fetch("http://localhost:8000/todo", {
              method: "post",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },

              body: JSON.stringify({ content: input })

 
            })
            
            dispatch({type: "addTodo", data: {content: input, _id: Math.random().toString(36).substring(7) }})
            setInput("")

          }}>SAVE</button>

          <button onClick={onClear} >CLEAR</button>
          <button onClick={removeSelected} >Cleary Unwanted</button>

        </div>
          you just wrote : 
        <div>
          {state.map(item => (
            <div key={item._id}>
              <div>{item.content}</div>
              <button onClick={() => onRemoveTodo(item._id)}>Remove</button>
              <input type="checkbox" defaultChecked={item.selected} onChange={() => {
                dispatch({ type: "setTodoToRemove", data: item._id})
              }}/>
            </div>
          ))}
        </div>


      </header>
    </div>
  );
}

export default App;
