// Helpers
const promiseFromWorker = worker => {
  return new Promise((resolve, reject) => {
    worker.onmessage = resolve;
    worker.onerror = reject;
  });
};

const workerFromBlob = blob => {
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  URL.revokeObjectURL(url);
  return worker;
};

// create worke
export function createWorker(fn, otherFns) {
  const deps = ([...otherFns, fn]).map(f => `self.${f.name} = ${f.toString()};`);
  const onmessage = `self.onmessage = e => postMessage(${fn.name}(e.data));`;
  const blob = new Blob([...deps, onmessage], { type: 'text/javascript' });

  const worker = workerFromBlob(blob);

  return {
    // run the web worker function
    run: (data) => {
      worker.postMessage(data || {});
      return promiseFromWorker(worker);
    },

    // terminate the web worker
    terminate: () => worker.terminate()
  };
}
