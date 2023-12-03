/**
 * Create an actual web worker from an object url from a blob
 *
 * @param {Function} fn - the function to be put into the blog array.
 * @param {[{name: string, method: Function}} - a list of other functions to be available inside the worker function
 */
function createWorker(fn, otherScripts) {
  otherScripts = otherScripts || [];

  var blobArray = otherScripts.map(function (script) {
    return 'self.' + script.name + '=' + script.value.toString() + ';';
  });
  blobArray = blobArray.concat(['self.onmessage=', fn.toString(), ';']);

  var blob = new Blob(blobArray, { type: 'text/javascript' });
  var url = URL.createObjectURL(blob);

  let worker = new Worker(url);
  URL.revokeObjectURL(url);

  return {
    worker,
    // run the web worker
    run: (data) => __run(worker, data),

    // terminate the web worker
    terminate: () => worker.terminate(),

    // subscribe to the worker
    subscribe: fn => worker.addEventListener('message', fn),

    // ubsubscribe from the worker
    unsubscribe: fn => worker.removeEventListener('message', fn)
  };
}

/**
 * run the passed in web worker
 */
function __run(worker, data) {
  data = data || {};
  worker.postMessage(data);
  let promise = new Promise(function (resolve, reject) {
    worker.onmessage = resolve;
    worker.onerror = reject;
  });

  return promise;
}

/**
 * terminate the web worker;
 */
function __terminate(worker) {
  return worker.terminate();
}

export default createWorker;