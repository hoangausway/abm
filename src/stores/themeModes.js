import { get, writable } from 'svelte/store';

const themeModes = writable('light');

export const toggleMode = () => {
  const mode = get(themeModes);
  themeModes.update(() => mode === 'dark' ? 'light' : 'dark');
};

export default themeModes;