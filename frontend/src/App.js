import './App.css';
import React from 'react';
import ImageList from './ImageList';
import ImageUpload from './ImageUpload';
import Login from './componentes/pages/Login';
import {Routes, Route} from "react-router-dom";
import Home from './componentes/pages/Home';
import { LoginUserProvider } from './componentes/providers/LoginUserProvider';
import Main from './componentes/pages/Main';
import Album from './componentes/pages/Album';


function App() {
  return (
    <LoginUserProvider>
      <div className='App'>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/main" element={<Main/>}/>
          <Route path="/album" element={<Album/>}/>
          {/* <ImageUpload />
          <ImageList /> */}
        </Routes>
      </div>
    </LoginUserProvider>
  );
}

export default App;
