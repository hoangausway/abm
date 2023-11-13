import watchMedia from 'svelte-media';
import { derived } from 'svelte/store';

const media = watchMedia({ small: '(max-width: 42rem)' });
const smallPoint = derived(media, $media => $media.small);
export default smallPoint;
