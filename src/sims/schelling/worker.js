import registerPromiseWorker from 'promise-worker/register';
import { initCalculation, stepCalculation } from './calculation';

registerPromiseWorker(({ type, data }) => {
  if (type === 'INIT')
    return initCalculation(data);
  else if (type === 'STEP') {
    return stepCalculation(data);
  }
  return [];
});