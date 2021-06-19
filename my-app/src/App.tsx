import React, { useEffect, useReducer, useState } from 'react';
import './App.css';

type Todo = { _id: string; content: string; selected?: boolean };
type TodoList = Array<Todo>

function reducer(
  state: TodoList,
  // action: {type: 'loadData', data: TodoList } | {type: 'addTodo', data: Todo }
  action: any
) {
  switch (action.type){
    case "loadData":
      return action.data
    case "addTodo":
      return [...state, action.data]
    case "removeAll":
      return []
    case "removeOne":
      return state.filter(item => item._id !== action.data )
    case "setTodoToRemove":
      return state.map(item => {
        if (item._id === action.data){
          return ({
            ...item,
            selected:true
          })
        }
        return item
      })
    default:
      throw new Error();
  }
}

function App() {
  const [input, setInput] = useState("");
  // const [state, setState] = useState([] as Array<{ id: string; content: string }>);
  const isInputEmpty = input === "";
  const [state, dispatch] = useReducer(reducer, [] as TodoList);


  useEffect(()=>{
    // const savedData = input;
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
              // mode: 'cors',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              // headers: {
              // 'content-type': 'application/json',
              // 'content-type': 'application/x-www-form-urlencoded',
              // 'content-length': "" + (input.length),
              // },

              body: JSON.stringify({ content: input })

              // body: `content=${input}`
              // jsonBody: "{content: 'bbb'",
            })
            // setState([...state,{content: input,id:""}])
            dispatch({type: "addTodo", data: {content: input, _id: Math.random().toString(36).substring(7) }})

            setInput("")

          }}>SAVE</button>

          <button onClick={onClear} >CLEAR</button>
          <button onClick={removeSelected} >Cleary Unwanted</button>

        </div>
          you just wrote : {}
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
