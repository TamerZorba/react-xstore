import Watcher from './Watcher';
import ProxyManager from './Proxy';

/**
 * create fake setState function to handle state update for external
 * 
 * @class ExternalWatcher
 * @author Tamer Zorba <abo.al.tot@gmail.com>
 */
class ExternalWatcher extends Watcher () {
  setState (obj) {
    this.state = obj;
  }
}

/**
 * create and subscribe watcher
 */
const watcher = new ExternalWatcher ();
watcher.subscribe ();

/**
 * set proxy manager 
 */
let proxy = ProxyManager (watcher);

export default proxy;
