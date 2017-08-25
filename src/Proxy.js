import Store from './Store';
import controller from './Controller';

/**
 * handle store custom behavior
 * 
 * @func ProxyManager
 * @author Tamer Zorba <abo.al.tot@gmail.com>
 */
const ProxyManager = that => {
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
  return proxy;
};

export default ProxyManager;
