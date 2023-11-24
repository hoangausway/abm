# Agent Based Modelling: Svelte
BASE TEMPLATE: Vite + Svelte + Pico CSS + Responsive + Routing + JWT 
- Vite + Svelte
- Minimal CSS
- Responsive
- Simple routing
- Ready for JWT

SIMULATOR
- simStore: handles simulation activities
- SimControl: UI for actions Run/Pause, Stepping, Reset; accepted generic model

MODEL
- modelFactory: create a model based on model data like number of agents, environment space, model's parameters
and 2 model functions as `init` and `step`
- model: implement a particular model providing initialised data and the above model functions

VISUALIZATION
- VizModel: visualise model's progress
- VisParams: UI for changing parameters

TODOS:
- rectangle instead of square for enviroment space
- option for switching between local worker or remote workers calculatiing 2 model functions
- declarative input data including `number of agents`, `environment dimensions`, `model parameters`