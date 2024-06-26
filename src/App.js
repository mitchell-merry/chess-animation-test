import './App.css';
import { Board } from './Board';
import { useEffect, useState } from 'react';

function App() {
  const [mousePosition, setMousePosition] = useState([0, 0]);

  // useEffect(() => {
  //   console.log('Mouse position:', mousePosition);
  // }, [mousePosition]);

  return (
    <div
      className="App"
      onMouseMove={event => {
        setMousePosition([event.clientX, event.clientY]);
      }}
    >
      <Board mouseX={mousePosition[0]} mouseY={mousePosition[1]}></Board>
    </div>
  );
}

export default App;
