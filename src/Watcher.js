import Store from './Store';
import controller from './Controller';

/**
 * @func Watcher
 * @author Tamer Zorba <abo.al.tot@gmail.com>
 */
const Watcher = (Extender = class {}, linkedStores = []) =>
  class extends Extender {
    /**
     * Creates an instance of Watcher and pass arguments to parent.
     */
    constructor (...args) {
      super (...args);

      this.updateStores (linkedStores);

      Store.subscribe (e => {
        this.updateStores (e.name, true);
      });
    }

    /**
     * update store data
     * 
     * @param {any} linkedStores 
     * @param {boolean} [force=false] 
     */
    updateStores (linkedStores, force = false) {
      let state = this.state || {
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
        if (linkedStores.length && !linkedStores.includes (e)) {
          return;
        }
        state.computed[e] = controller.getComputed (e, state.state[e]);
      });

      if (!force) {
        this.state = state;
      } else {
        this.setState (state);
      }
    }

    /**
     * make component state change subscribtion 
     */
    subscribe () {
      this.subsHandle = controller.subscribe (this.handleChange.bind (this));
    }

    /**
     * remove component state change subscribtion
     */
    unsubscribe () {
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
  };

export default Watcher;
