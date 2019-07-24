import React, {Component} from 'react';
import PrivateRoute from './components/PrivateRoute'
import {Route,Switch} from 'react-router-dom'
import Login from './routes/Login/index'
// import Login from './routes/Login2/index'
import Index from './routes/Index/index'
import './App.css'
import './assets/font/iconfont.css'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';


class App extends Component {
  render() {
    return (
      <Switch>
        <Route path='/login' component={Login}/>
        <PrivateRoute path='/' component={Index} />
      </Switch>
    )
  }
}

export default App;
