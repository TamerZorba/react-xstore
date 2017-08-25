/**
 * @class Store
 * @author Tamer Zorba <abo.al.tot@gmail.com>
 */
export default class Store {
  /**
   * Creates an instance of Store.
   * 
   * @param {any} store 
   * @memberof Store
   */
  constructor (store) {
    if (!Store.metadata) {
      Store.metadata = {};
    }
    Store.metadata[store.name] = store;

    Store.subscriptions &&
      Store.subscriptions.forEach (e => {
        e.call (store, store);
      });
  }

  /**
   * send all registered stores metadata
   * 
   * @readonly
   * @static
   * @memberof Store
   */
  static get stores () {
    if (!Store.metadata) Store.metadata = [];
    return Store.metadata;
  }

  /**
   * subscribe to new store inited
   * 
   * @static
   * @param {any} cb 
   * @memberof Store
   */
  static subscribe (cb) {
    if (!Store.subscriptions) Store.subscriptions = [];
    Store.subscriptions.push (cb);
  }
}
