import React from 'react'
import ReactDOM from 'react-dom'
//https://github.com/brickspert/blog/issues/26
let memoizedState = [] //hook 存在这个数组里
let cursor = 0 // 下标

function render() {
    cursor = 0
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    )
}

function useState(initialValue) {
    memoizedState[cursor] = memoizedState[cursor] || initialValue
    const currentCursor = cursor
    function setSate (newState) {
        memoizedState[currentCursor] = newState
        render()
    }
    //返回当前state ，并cursor +1
    return [memoizedState[cursor++], setSate]
}

function useEffect(callback, depArray) {
    const hasNoDeps = !depArray
    const deps = memoizedState[cursor]
    const hasChangeDeps = deps ? !depArray.every((el,i) => el === deps[i]) : true
    if(hasNoDeps || hasChangeDeps) {
        callback()
        memoizedState[cursor] = depArray
    }
    cursor++
}

function App() {
    const [count, setCount] = useState(0)
    const [name, setName] = useState('hou')

    useEffect(() => {
        console.log('update', count)
    }, [count])

return (
    <div className="App">
        <p>我点击了 {count}次 </p>
        <button onClick={()=> setCount(count + 1)}>添加</button>
        <p>我叫 {name} </p>
        <button onClick={()=> setName(name + 'zk')}>设置名字</button>
    </div>
  )
}
export default App