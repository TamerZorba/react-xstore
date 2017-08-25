import React from 'react';
import Watcher from './Watcher';
import ProxyManager from './Proxy';

/**
 * connect component to state manager
 * 
 * @func Connect
 * @author Tamer Zorba <abo.al.tot@gmail.com>
 */
export default function Connect (Component, linkedStores = []) {
  return class GlobalState extends Watcher (React.Component, linkedStores) {
    /**
     * make component state change subscribtion 
     */
    componentDidMount () {
      this.subscribe ();
    }

    /**
     * remove component state change subscribtion
     */
    componentWillUnmount () {
      this.unsubscribe ();
    }

    /**
     * render and link component to state
     * 
     * @returns 
     */
    render () {
      const proxy = ProxyManager (this);

      return <Component {...this.props} store={proxy} />;
    }
  };
}
