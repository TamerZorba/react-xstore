import Store from './Store';

/**
 * @class Controller
 * @author Tamer Zorba <abo.al.tot@gmail.com>
 */
export default class Controller {
  /**
   * Creates an instance of Controller.
   * @memberof Controller
   */
  constructor () {
    this.subscriptions = [];
  }

  /**
   * subscribe components to state manager
   * 
   * @param {function} handler 
   * @returns handler index
   * @memberof Controller
   */
  subscribe (handler) {
    this.subscriptions.push (handler);
    return this.subscriptions.lastIndexOf (handler);
  }

  /**
   * unsubscribe components from state manager
   * 
   * @param {any} handler 
   * @memberof Controller
   */
  unsubscribe (handler) {
    delete this.subscriptions[handler];
  }

  /**
   * handle state changes, update all components
   * 
   * @param {any} obj 
   * @memberof Controller
   */
  setState (obj) {
    this.controller.subscriptions.forEach (cb => {
      if (cb) {
        cb (this.store, obj);
      }
    });
  }

  /**
   * handle commit -> mutations
   * 
   * @param {any} mutation 
   * @memberof Controller
   */
  commit (mutation) {
    let store = this.store;
    if (Store.stores[store].mutations) {
      let state = this.component.state.state[store];
      Array.prototype.shift.apply (arguments);
      Store.stores[store].mutations[mutation].apply (state, arguments);
      this.controller.setState.apply (this, [state]);
    }
  }

  /**
   * handle dispatch -> actions
   * 
   * @param {any} action 
   * @returns 
   * @memberof Controller
   */
  dispatch (action) {
    let store = this.store;
    if (Store.stores[store].actions) {
      let obj = {
        state: this.component.state.state[store],
        commit: this.controller.commit.bind (this),
      };
      Array.prototype.shift.apply (arguments);
      return Store.stores[store].actions[action].apply (obj, arguments);
    }
    return false;
  }

  /**
   * handle computed properties
   * 
   * @param {any} action 
   * @returns 
   * @memberof Controller
   */
  getComputed (store, state, mutation) {
    let computed = {};

    // TODO: run only computed property by mutation (proxy)
    Store.stores[store].computed &&
      Object.keys (Store.stores[store].computed).forEach (current => {
        computed[current] = Store.stores[store].computed[current].call (state);
      });

    return computed;
  }
}
