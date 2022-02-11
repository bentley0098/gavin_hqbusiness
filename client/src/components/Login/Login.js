import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './Login.css';

import Footer from './../Footer.jsx'

import HQicon from './HQicon.ico'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'

async function loginUser(credentials) {
  return fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    checkDueDate();

    
    e.preventDefault();
    const token = await loginUser({
        username,
        password
    });
    
    
    if(token.token!=='q>)*8n[TfhTyZAW'){  
      alert('Invalid Username/Password');
    } else{
      setToken(token);
    }
     
    
  }

  const checkDueDate = () =>{
    //console.log("checkDueDate Method");
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'}
    }
    return fetch('/checkDueDate/', requestOptions)  
  }
  
  return(
    <>
    
    
    <div className="login-logo"><img src={HQicon} alt="logo" /></div>
    <div className="login-wrapper">
      <h2>HQ Business - Log In</h2>
      <Form>
        <Form.Group className="mb-3" controlId="emailInput">
          <Form.Label>User:</Form.Label>
          <Form.Control type="email" placeholder="Enter username" onChange={e => setUserName(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" constrolId="passwordInput">
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="secondary" type="submit" onClick={handleSubmit} className="button-to-the-right">
          Submit
        </Button>
      </Form>
    </div>

    <Footer />
    </>
  )

  
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}