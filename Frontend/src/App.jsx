import React from 'react'
import { Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import EmailVerify from './pages/EmailVerify';
import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import Todo1 from './pages/Todo1';
 import { ToastContainer} from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='text-4xl'>
      <ToastContainer/>


      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<PasswordReset/>}/>
        <Route path='/Todo1' element={<Todo1/>}/>

      </Routes>
      
    </div>
  )
}

export default App
