import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Route, Link} from 'react-router-dom';

import UserDetails from './UserDetails';
import './App.css';

function App(props) {
  const [users, setUsers] = useState([]);
  const [inputUser, setInputUser] = useState({});
  const [editId, setEditId] = useState(-1);

  useEffect(() => {
    getUsers();
  },[])
  
  const getUsers = () => {
    axios.get('http://localhost:5000/api/users')
      .then(res => {
        console.log(res);
        setUsers(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const deleteUser = (id) => {
    axios.delete(`http://localhost:5000/api/users/${id}`)
    .then(res => {
      console.log(res);
      getUsers();
    })
    .catch(err => {
      console.log(err);
    })
  }

  const handleInput = e => {
    setInputUser({...inputUser, [e.target.name]: e.target.value})
  }

  const addUser = () => {
    console.log(inputUser);
    axios.post(`http://localhost:5000/api/users`, inputUser)
    .then(res => {
      console.log(res);
      getUsers();
    })
    .catch(err => {
      console.log(err);
    })
  }

  const editUser = () => {
    console.log(inputUser);
    axios.put(`http://localhost:5000/api/users/${editId}`, inputUser)
    .then(res => {
      console.log(res);
      getUsers();
    })
    .catch(err => {
      console.log(err);
    })
  }

  const handleSetId = (e) => {
    setEditId(e.target.value)
  }

  const openUser = (id) => {
    console.log('open user: ', id);
    props.history.push(`/users/${id}`)
  }

  return (
    <div className="App">
      <Route path='/users/:id' component={UserDetails}/>
      <header className="App-header">
        Users:
        {users.map(user => (
          <div key={user.id} style={{background: 'grey', margin:'5px', padding:'0 20px'}}>
            <div onClick={() => openUser(user.id)} style={{background:'teal', padding: '0 10px'}}>
              <p>{user.id}: {user.name}</p>
              {/* <p>{`  ${user.bio}`}</p> */}
            </div>
            <button onClick={() => deleteUser(user.id)} style={{background: 'red', color:'white', margin:'10px'}}>X</button>
          </div>
        ))}
        Add or edit user:
        <div style={{display: 'flex', flexDirection: 'column', width: '200px', background: 'grey'}}>
          <input type='text' name='name' placeholder='name' onChange={handleInput}/>
          {/* <input type='text' name='bio' placeholder='bio' onChange={handleInput}/> */}
          <button onClick={addUser}>Add</button>
          <br/>
          <input type='number' placeholder='user id (for editting only)' onChange={handleSetId}/>
          <button onClick={editUser}>Update</button>
        </div>
      </header>
      
    </div>
  );
}

export default App;
