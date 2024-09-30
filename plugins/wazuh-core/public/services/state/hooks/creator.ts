import useObservable from 'react-use/lib/useObservable';
import { State } from '../types';

export const createHooks = ({ state }: { state: State }) => {
  function useStateContainer<T>(name: string) {
    const value: T = useObservable(
      state.getStateContainer(name).updater$,
      state.get(name),
    );
    function setValue(value) {
      state.set(name, value);
    }
    function removeValue() {
      state.remove(name, value);
    }
    return [value, { set: setValue, remove: removeValue }];
  }
  return {
    useStateContainer,
  };
};
