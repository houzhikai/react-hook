import React, {useState} from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [age, setAge] = useState(20);

  return (
    <div className="App">
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}> Add count </button>
      <p>You age is {age}</p>
      <button onClick={() => setAge(age + 1)}> Add age </button>
    </div>
  );
}

export default App;
