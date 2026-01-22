import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Conversations from './pages/Conversations.jsx';
import ConversationsArea from './components/ConversationArea.jsx'; 

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element = {<Home />}/>
          <Route path='/login' element ={<Login />}/>
          <Route path='/signup' element ={<SignUp />}/>
          <Route path='/conversations' element ={<Conversations />}>
            <Route path=':Id' element ={<ConversationsArea />}/>
          </Route>
          <Route path='*' element ={<div>404 Not Found</div>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
