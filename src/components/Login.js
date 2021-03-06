import React, { Component } from "react";
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import { Redirect } from 'react-router-dom';
import './Login.css';
import {db, fire} from '../services/firebase';
import  '@firebase/auth'

class Login extends Component {
    constructor() {
        super();
        this.state = {
            redirect: false,
            authenticated: false,
            hint: ""
        }
        this.authWithEmail=this.authWithEmail.bind(this);
        this.addNewUser = this.addNewUser.bind(this);
    }

    authWithEmail(event) {
        event.preventDefault();
        const email = this.emailInput.value;
        const password = this.passwordInput.value;
        var that = this;
        fire.auth().signInWithEmailAndPassword(email, password)
            .then((promise) => {
                that.setState({redirect: true, authenticated: true});
            })
            .catch(function(error) {
            if (error.code === "auth/user-not-found") {
                fire.auth().createUserWithEmailAndPassword(email, password)
                    .then((user) => {
                        that.setState({redirect: true, authenticated: true, id: that.addNewUser(email)})
                    })
                    .catch((err) => {
                        that.setState({hint: err.message});
                });
            }
            that.setState({hint: error.message});
        });
        this.loginform.reset();
    }

    addNewUser(email) {
        const refUser = db.ref().child('users');
        const newUserRef = refUser.push();
        const key = newUserRef.key;
        newUserRef.set({email: email, cash: 5000, id: key});
        return key;
    }

    render() {
        // console.log(this.state);
        if (this.state.redirect === true) {
            return <Redirect to='/' />
        }
        return(
            <div className="login">
                <form onSubmit={(event) => {this.authWithEmail(event)}} ref={(form) => {this.loginform = form}}>
                <input style={{width: "100%"}} className="pt-input" type="email" ref={(input => {this.emailInput = input})} placeholder="email" />
                <input style={{width: "100%"}} className="pt-input" type="password" ref={(password => {this.passwordInput = password})} placeholder="password"/>
                    <input style={{width: "100%"}} type="submit" className="pt-button pt-intent-primary" value="Log In"></input>
                </form>
                <div>{this.state.hint}</div>


            </div>
        );
    }
}

export default Login;
