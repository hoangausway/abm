// import default pico css
import '@picocss/pico'
// import customised theme
import './customised.css'

import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')
})

export default app
