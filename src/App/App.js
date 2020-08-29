import React from 'react';

import {
  Switch,
  BrowserRouter,
  Redirect,
  Route,
} from 'react-router-dom';

import './App.scss';
import firebase from 'firebase/app';
import 'firebase/auth';
import fbConnection from '../helpers/data/connection';

import Auth from '../components/pages/Auth/Auth';
import NavBar from '../components/pages/NavBar/NavBar';
import EditBirb from '../components/pages/EditBirb/EditBirb';
import Home from '../components/pages/Home/Home';
import NewBirb from '../components/pages/NewBirb/NewBirb';
import SingleBirb from '../components/pages/SingleBirb/SingleBirb';

fbConnection();

const PublicRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = (props) => (authed === false
    ? (<Component {...props} />)
    : (<Redirect to={{ pathname: '/home', state: { from: props.location } }} />));
  return <Route {...rest} render={(props) => routeChecker(props)} />;
};
const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = (props) => (authed === true
    ? (<Component {...props} />)
    : (<Redirect to={{ pathname: '/auth', state: { from: props.location } }} />));
  return <Route {...rest} render={(props) => routeChecker(props)} />;
};
class App extends React.Component {
  state = {
    authed: false,
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authed: true });
      } else {
        this.setState({ authed: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    const { authed } = this.state;

    return (
      <div className="App">
        <BrowserRouter>
          <React.Fragment>
            <NavBar authed={authed} />
            <div className="container">
              <Switch>
                <PrivateRoute path="/home" component={Home} authed={authed}/>
                <PrivateRoute path="/new" component={NewBirb} authed={authed}/>
                <PrivateRoute path="/edit/:birbId" component={EditBirb} authed={authed}/>
                <PrivateRoute path="/birbs/:birbId" component={SingleBirb} authed={authed}/>
                <PublicRoute path="/auth" component={Auth} authed={authed}/>
                <Redirect from="*" to="/home" />
              </Switch>
            </div>
          </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
