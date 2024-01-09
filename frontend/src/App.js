import logo from './logo.svg';
import './App.css';
import React from 'react';
import ImageList from './ImageList';
import ImageUpload from './ImageUpload';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function App() {
  return (
    <div>
      <h1>画像アップロードと管理</h1>
      <ImageUpload />
      <ImageList />
    </div>
  );
}

export default App;
