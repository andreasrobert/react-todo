export type Todo = { _id: string; content: string; selected?: boolean };
export type TodoList = Array<Todo>

export default function reducer(
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