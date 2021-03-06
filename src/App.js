import React, { Component } from 'react';
import Navbar from './components/Navbar';
import { Redirect } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Room from './components/Room';
import NewRoom from './components/NewRoom';
import {AuthAdapter} from './components/Adapter';
//HOORAY

class App extends Component {
  constructor(){
    super()

    this.state = {
      auth: {
        isLoggedIn: false,
        user: ''
      }
    }

    if (localStorage.getItem('token')) {
     AuthAdapter.currentUser()
     .then(user => {
       if (!user.error) {
         this.setState({
           auth: {
             isLoggedIn: true,
             user: user
           }
         });
         <Redirect to="/home" />
       }
     })
   }

  }

  handleFormSignIn = (username, password) => {
    AuthAdapter.login({username: username, password: password})
    .then( user => {

      if(user.response.data){
        this.setState({auth: {isLoggedIn: true, user: user}});
        localStorage.setItem('token', user.response.data.token);
      } else{
        alert("Wrong Username and password")
      }
    })
  }

  handleFormSignUp = (username, password, passwordConfirm) => {
    AuthAdapter.signup({username: username, password: password, confirmPassword: passwordConfirm})
    .then(user => {
      console.log(user)
      if(user.response.data){
        this.setState({auth: { isLoggedIn: true, user: user}})
        localStorage.setItem('token', user.response.data.token)
      }else{
        alert("Passwords don't match")
      }
    })
  }

  handleLogout = () => {
    localStorage.removeItem('token');
    this.setState({auth: {
      isLoggedIn: false,
      user: ''
    }});
    <Redirect to="/login" />
  }

  render() {
    const { isLoggedIn } = this.state.auth;
    // AuthAdapter.currentUser().then(resp => console.log(resp))

    return (
      <div className="App">
        <Navbar isloggedIn={isLoggedIn} handleLogout={this.handleLogout}/>

        <div id="content" className="ui container">
          <Switch>
            <Route exact path='/' render={() => {
              return (<Redirect to="/login" />)
            }}/>
            <Route exact path='/login' render={()=> {
              return (isLoggedIn ? <Redirect to="/home" /> : <Login handleForm={this.handleFormSignIn} />)
            }}/>
            <Route exact path='/room/create' render={() => {
                return (isLoggedIn ? <NewRoom /> : <Redirect to="/login" />)
              }}/>
            <Route exact path='/home' render={()=>{
              return (isLoggedIn ? <Home /> : <Redirect to="/login" />)
            }}/>
            <Route exact path='/room/:id' render={(props) => {
              return (isLoggedIn ? <Room {...props} /> : <Redirect to="/login" />)
            }}/>
            <Route exact path='/signup' render={() => {
              return (isLoggedIn ? <Redirect to="/home" /> : <Signup handleForm={this.handleFormSignUp} />)
            }}/>
          </Switch>

        </div>
      </div>
    );
  }
}

export default App;
