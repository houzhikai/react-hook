import React, {useState, useEffect} from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [age, setAge] = useState(20);

  // 相当于 componentDidMount 和 componentDidUpdate:
  /*
  useEffect(() => {
    console.log(`You clicked ${count} times`);
  }); //监控所有state
  */

  
  useEffect(() => {
    console.log('首次挂载和更新count执行')
    return () => {
      console.log('状态更新和卸载组件时执行')
    }
  }, [count])  //只监控count状态
  

  
  useEffect(() => {
    console.log('首次挂载时执行');
    return () => {
      console.log('卸载时执行');
    };
  }, []);   //都不监控，只在第一次挂载时执行一次
  

  return (
    <div className="App">
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}> Add count</button>
      <p>You are {age} years old!</p>
      <button onClick={() => setAge(age + 1)}> Add age </button>     
    </div>
  );
}


function App() {
  const [isShow, setIsShow] = useState(true);

  return (
    <div className="App">
      <button onClick={() => setIsShow(!isShow)}>显示/隐藏Counter</button>
      {
        isShow && <Counter/>
      }
    </div>
  )
}

export default App;
