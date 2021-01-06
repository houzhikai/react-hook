import React from 'react'
import ReactDOM from 'react-dom'

function render() {
    ReactDOM.render(
    <App />,
    document.getElementById('root')
  ) 
}

/*
//初尝试
这种方法不会增加，因为 执行完 setState之后重新定义 initValue的值，虽然之前值是变了，但是又重新刷新了页面
function useState(initValue) {
  let state = initValue
  function setState(newState) {
    state = newState
    render()
  }
  return [state, setState]
}
*/


//简易版的useState 与 useEffect
let state
function useState(initValue) {
  state = state || initValue
  function setState(newState) {
    state = newState
    render()
  }
  return [state, setState]
} 



let oldDeps
 function useEffect( callback, deps ) {
   const hasChangeDeps = oldDeps ? !deps.every((el, i) => el === oldDeps[i]) : true
      if(!deps || hasChangeDeps) {
        callback()
        oldDeps = deps
      }
 }

 function App() {
   const [count, setCount] = useState(0)
   useEffect(() => {
     console.log('update', count)
   }, [count])
 

 return (
   <div className="App">
     <p>你点了 {count} 次</p>
     <button onClick={() => setCount(count + 1)}>添加 +1 次</button>
   </div>
 )
}
 export default App