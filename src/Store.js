/**
 * @class Store
 * @author Tamer Zorba <abo.al.tot@gmail.com>
 */
export default class Store {
  constructor (store) {
    if (!Store.stores) {
      Store.stores = {};
    }
    Store.stores[store.name] = store;
  }
}
