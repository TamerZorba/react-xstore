# React xStore

[![NPM version][npm-badge]][npm-url]
[![Downloads][download-badge]][npm-url]
[![Build Status][build-badge]][build-url]
[![JavaScript Style Guide][standard-badge]][standard-url]
[![License][license-badge]][MIT License]

Simple yet powerful global state management for React, Inspired by Vuex, Redux and react-global-store, Support's Async mutations by (Actions), see examples for more informations.

## Installation

`npm install --save react-xstore`

## Usage

Wrap your components with `Connect` and the store will be available as `store` in props `this.props.store ('myStore')`
then you can access store api from any component you wrap with.

  * `state` current store state.
  * `commit` used to call mutations.
  * `dispatch` used to call actions.
  * `setState` for manual state mutation.
  * `computed` combine states or shrink object by computed property.


### Example 1 - simple counter

Init Store, you should import it at the main app loader

```javascript
    import {Store} from 'react-xstore';

    new Store ({
      name: 'myStore',
      state: { // default state for current store
        counter: 25,
      },
      mutations: { // called by commit() function
        plus (append) {
          this.counter = this.counter ? this.counter + append : 60;
        },
      },
      actions: {
        plusAsync (append) { // called by dispatch() function
          setTimeout (() => {
            this.commit ('plus', append);
          }, 500);
        },
      },
      computed: {
        x5 () {
          return this.counter * 5;
        },
      },
    });
```

access store from any component like this

```javascript
    import React, {Component} from 'react';
    import {Connect} from 'react-xstore';

    class First extends Component {
      render () {
        const {state, computed, setState, commit, dispatch} = this.props.store ('myStore');
        return (
          <div>
            Counter is {state.counter} and x5 is {computed.x5}<br />
            <button
              onClick={() => {
                setState ({
                  counter: state.counter ? state.counter + 1 : 1,
                });
              }}
            >
              setState +1
            </button>
            <button onClick={() => commit ('plus', 50)}>
              Commit +50
            </button>
            <button onClick={() => dispatch ('plusAsync', 100)}>
              Dispatch Async +100
            </button>
          </div>
        );
      }
    }

    export default Connect (First);
```

### Example 2 - advence auth manager

Init Store, and import it at the main app loader

```javascript
    import {Store} from 'react-xstore';

    const LOGIN = 'LOGIN';
    const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
    const LOGOUT = 'LOGOUT';

    new Store ({
      name: 'auth',
      state: {
        isLoggedIn: !!localStorage.getItem ('token'),
      },
      mutations: {
        [LOGIN] () {
          this.pending = true;
        },
        [LOGIN_SUCCESS] () {
          this.isLoggedIn = true;
          this.pending = false;
        },
        [LOGOUT] () {
          this.isLoggedIn = false;
        },
      },
      actions: {
        login (creds) {
          this.commit (LOGIN);
          return new Promise (resolve => {
            setTimeout (() => {
              localStorage.setItem ('token', 'JWT');
              this.commit (LOGIN_SUCCESS);
              resolve ();
            }, 1000);
          });
        },
        logout () {
          localStorage.removeItem ('token');
          this.commit (LOGOUT);
        },
      },
    });
```

component example usage

```javascript
    import React, {Component} from 'react';
    import {Connect} from 'react-xstore';

    class Login extends Component {
      render () {
        const {state, dispatch} = this.props.store ('auth');
        return (
          <div>
            {state.isLoggedIn
              ? <span>Logged</span>
              : <span>You Need to Login</span>}
            {state.pending && <span>...</span>}

            <br />
            {!state.isLoggedIn &&
              <button onClick={() => dispatch ('login', {user: 'name'})}>
                Login
              </button>}
            {state.isLoggedIn &&
              <button onClick={() => dispatch ('logout')}>
                Logout
              </button>}
          </div>
        );
      }
    }

    export default Connect (Login);
```

## Contributing
Thank you for considering contributing! Fork the repo then after you complete your awesome feature, make a pull request and we will be glad to accept after test.

## License
This code is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)

[npm-url]: https://npmjs.org/package/react-xstore
[build-url]: https://unpkg.com/react-xstore
[standard-url]: https://standardjs.com
[MIT License]: http://opensource.org/licenses/MIT

[npm-badge]: https://img.shields.io/npm/v/react-xstore.svg
[download-badge]: http://img.shields.io/npm/dm/react-xstore.svg
[build-badge]: https://img.shields.io/badge/build-passing-green.svg
[standard-badge]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg