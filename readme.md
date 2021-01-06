前言
<hr>
目前，Hooks 应该是 react 中最火的概念了，在阅读这篇文章之前，希望你已经了解基本的 Hooks 用法在使用 Hooks 的时候，我们会有很多疑惑<br>

1.为什么只能在函数最外层调用 Hook，不要在循环、条件判断或者子函数中调用<br>
2.为什么 useEffect 第二个参数是空数组，就相当于 ComponentDidMount ，只会执行一次<br>
3.自定义的Hook 是如何影响使用它的函数组件的<br>
4.Capture Value 特性是如何产生的<br>
5. ......<br>
直接进入hooks 的学习
## useState
1.最简单的useState 用法是这样的
```
function Counter() {
        const [count, setCount] = useState(0)
    
    return (
        <div>
        <p>你点击了 {count} 次</p>
        <button onClick={() => setCounter(count+1)}>点击 count+1 </button>
      </div>
    )
}
```
2.基于 useState 的用法，我们尝试自己实现一个 useState
```
function useState(initialValue) {
    const state = initialValue
  function setState(newState) {
    state = newState
    render()
  }
  return [state, newState]
}
```
3.这个时候我们发现，点击 Button 时，count并不会变化，为什么呢？ 
是因为我们没有存储state ，每次渲染 Count组件的时候，state 都是重置的
   解决方法： 将state 提取出来，存在 useState 外面
   ```
let state
function useState(initialValue) {
    state = state || initialValue    //initialValue是初始值，如果没有state的值，就使用 initialValue 的值
  function setState(newState) {
        state = newState
      render()
  }
  return [state, newState]
}
```
到目前为止，我们实现了一个可以简单工作的useState。
接下来，开始了 useEffect 的实现操作
```
useEffect
useEffect 是另外一个基础的 Hooks，用来处理副作用，最简单的用法是这样的
useEffect(() => {
    console.log(count)
},[count])
```
useEffect 的几个特点
1. 有两个参数callback 和dependencies 数组
2. 如果 dependencies 不存在，那么 callback 每次 render 都会执行
3. 如果dependencies  存在，只有它当时发生了变化，callback 才会执行
我们来实现一个 useEffect
```
let deps
function useEffect(callback, depArray) {
    const hasNoDeps = !depArray          //如果 dependencies 不存在
  const hasChangeDeps = deps ?  !depArray.every((el,i) => el === deps[i]) : true
  
  if(hasNoDeps || hasChangDeps) {
        callback()
      deps = depArray
  }
}
```
**.every（）    所有回调函数都返回true 的时候结果才会返回 true ，否则返回false
callback()     在计算机程序设计中，回调函数，或简称回调（Callback 即call then back 被主函数调用运算后会返回主函数），是指通过参数将函数传递到其它代码的，某一块可执行代码的引用。这一设计允许了底层代码调用在高层定义的子程序。**<br>
到这里，我们又实现了可以工作的 useEffect <br>
Q：为什么第二个参数空数组，相当于componentDideMount?<br>
A：因为依赖一直不变化，callback不会二次执行<br>

## Not Magic， just Arrays<br>
到现在为止，我们已经实现了可以工作的 useState 和useEffect 。但是有一个很大的问题，它满足只能使用一次，因为只有一个 state 和 deps <br>
```
const [count, setCount] = useState(0)
const [username, setUsername] = useState('hzk')
```
count he username 永远是相等的，因为他们共用了一个 state ，并没有地方能分别存在存储两个值。我们需要可以存储多个 state和deps
这时，我们可以利用数组来解决 hooks 的复用问题
<hr>

代码关键在于：
1. 初次渲染的时候，按照 useState ，useEffect的顺序，把state ，deps等顺序塞到 memoizedState数组中
2. 更新时，按照顺序，从 memoIzedState 中把上次记录的值拿出来
3. 如果还是不清楚，可以看下面的图
```
let memoizedState = []; // hooks 存放在这个数组
let cursor = 0; // 当前 memoizedState 下标
function useState(initialValue) {
  memoizedState[cursor] = memoizedState[cursor] || initialValue;
  const currentCursor = cursor;
  function setState(newState) {
    memoizedState[currentCursor] = newState;
    render();
  }
  return [memoizedState[cursor++], setState]; // 返回当前 state，并把 cursor 加 1
}
function useEffect(callback, depArray) {
  const hasNoDeps = !depArray;
  const deps = memoizedState[cursor];
  const hasChangedDeps = deps
    ? !depArray.every((el, i) => el === deps[i])
    : true;
  if (hasNoDeps || hasChangedDeps) {
    callback();
    memoizedState[cursor] = depArray;
  }
  cursor++;
}
```
~~也可以用图来描述 memoizedState 及cursor变化的过程~~<br>
~~图~~<br>
到这里，我们实现了一个可以任意复用的 useState 和useEffect
同时，也可以解答几个问题<br>
<hr>
Q：为什么只能在函数最外层调用 Hooks？为什么不要在循环、条件判断或者子函数中调用<br>
A： memoizedState 数组是按Hook定义顺序来放置数组的，如果 hooks顺序变化，memoizedState并不会感知到<br>
Q：自定义的 Hook 是如何影响使用它的函数组件的<br>
A： 共享一个 memoizedState ，共享同一个顺序<br>
Q： “capture Value”特性是怎么产生的<br>
A： 每一次 reRender 的时候，都是重新 去执行函数组件了，对于之前已经执行过的函数组件，并不会做任何操作<br>
<hr>
## 真正的 React 实现<br>
虽然我们用数组基本实现了一个可用的 Hooks ，了解Hooks 原理，但是在 react中。实现方式却有一些差异的<br>
● React中是通过类似单链表的形式来代替数组的，通过 next 按顺序串联所有的 hook<br>

```
type Hooks = {
         memoizedState: any,                         //指向当前渲染节点 Fiber
             baseState: Update<any> | null,          // 初始化 initialSate， 已经每次dispatch 之后 newState
       baseUpdate: Update<any> | null,               //当前需要更新的 Update，每次更新完之后，会赋值上一个 update，方便 react 在渲染错误的边缘，数据回溯
       queue: UpdateQueue<any> | null,               //updateQueue 通过
       next: Hook | null,                            // link 到下一个 hooks ，通过next 串联每一 hooks
}
type Effect = {
       tag: HokEffectTag,                           // effectTag 标记当前 hook 作用在 life-cycles 的哪一个阶段
       create: () => mixed,                         // 初始化 callback
       destroy: ( () => mixed ) | null,             // 卸载 callback
       deps: Array<mixed> | null,
       next: Effect,                                //同上
}
```

