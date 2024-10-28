import React, {useState, useEffect} from 'react';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           API 메인페이지
//         </a>
//       </header>
//     </div>
//   );
// }

const App: React.FC = () => {
  const [data, setData] = useState<string>('');
  
  useEffect(() => {
    fetch('/test')
      .then(response => response.json())
      .then(responseData => {
        setData(responseData.message)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className='App'>
      <h1>Hello from Spring Boot!</h1>
      <p>{data}</p>
    </div>
  );
};

export default App;
