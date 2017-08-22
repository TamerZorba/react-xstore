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
export default function Connect (Component, linkedStores = []) {
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
        if (linkedStores.length && !linkedStores.includes (e)) {
          return;
        }
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
      const that = this;

      const handler = {
        get (target, prop) {
          let store = target.store;
          if (!Object.keys (that.state.state).includes (store)) {
            let stores = Object.keys (Store.stores);
            let err;
            if (stores.includes (store)) {
              err = `Store: '${store}' exists, but not linked with current component`;
            } else {
              err = `Store: '${store}' not exists in the app.`;
            }
            console.error (new Error (err));
          }

          switch (prop) {
            case 'state':
              return that.state.state[store];
              break;
            case 'computed':
              return that.state.computed[store];
              break;
            case 'commit':
              return controller.commit.bind ({
                controller,
                store,
                component: that,
              });
              break;
            case 'dispatch':
              return controller.dispatch.bind ({
                controller,
                store,
                component: that,
              });
              break;
            case 'setState':
              return controller.setState.bind ({controller, store});
              break;
            default:
              return that.state.state[store][prop];
          }
        },
        // set the store value
        set (obj, prop, value) {
          let store = obj.store;
          let setStore = controller.setState.bind ({controller, store});
          setStore ({[prop]: value});

          return true;
        },
      };

      /**
       * first proxy to get the store name
       */
      var proxy = new Proxy (
        {},
        {
          get: (target, store) => new Proxy ({store}, handler),
        }
      );

      return <Component {...this.props} store={proxy} />;
    }
  };
}
