import React from 'react';
import Store from './Store';
import Controller from './Controller';

const controller = new Controller ();

/**
 * connect component to state manager
 * 
 * @func Connect
 * @author Tamer Zorba <abo.al.tot@gmail.com>
 */
export default function Connect (Component) {
  return class GlobalState extends React.Component {
    /**
     * Creates an instance of GlobalState.
     * @param {any} props 
     */
    constructor (props) {
      super (props);
      let state = {
        state: {},
        computed: {},
      };

      let stores = Object.keys (Store.stores);

      // update stores with current state
      stores.forEach (e => {
        state.state[e] = Store.stores[e].state || {};
      });

      // update computed if exists with previously updated state
      stores.forEach (e => {
        state.computed[e] = controller.getComputed (e, state.state[e]);
      });

      this.state = state;
    }

    /**
     * make component state change subscribtion 
     */
    componentDidMount () {
      this.subsHandle = controller.subscribe (this.handleChange.bind (this));
    }

    /**
     * remove component state change subscribtion
     */
    componentWillUnmount () {
      controller.unsubscribe (this.subsHandle);
    }

    /**
     * handle mutations to global state
     * 
     * @param {any} store 
     * @param {any} value 
     */
    handleChange (store, value) {
      let obj = this.state;
      obj.state[store] = Object.assign ({}, obj.state[store], value);
      Store.stores[store].state = obj.state[store];

      let computed = controller.getComputed (store, obj.state[store], value);
      obj.computed[store] = Object.assign ({}, obj.computed[store], computed);

      this.setState (obj);
    }

    /**
     * render and link component to state
     * 
     * @returns 
     */
    render () {
      let store = function (store) {
        return {
          state: this.state.state[store],
          computed: this.state.computed[store],
          commit: controller.commit.bind ({
            controller,
            store,
            component: this,
          }),
          dispatch: controller.dispatch.bind ({
            controller,
            store,
            component: this,
          }),
          setState: controller.setState.bind ({controller, store}),
        };
      };
      return <Component {...this.props} store={store.bind (this)} />;
    }
  };
}
