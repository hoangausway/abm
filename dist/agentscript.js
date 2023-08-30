function inMain() {
    return globalThis.document !== undefined
}
function inWorker() {
    return globalThis.WorkerGlobalScope !== undefined
}
function inNode() {
    return typeof globalThis.require !== 'undefined'
}
function inDeno() {
    return typeof globalThis.Deno !== 'undefined'
}
function AsyncFunction(argsArray, fcnBody) {
    const ctor = Object.getPrototypeOf(async function () {}).constructor;
    const asyncFcn = new ctor(...argsArray, fcnBody);
    return asyncFcn
}
function blobToData(blob, type = 'dataURL') {
    type = type[0].toUpperCase() + type.slice(1);
    const types = ['Text', 'ArrayBuffer', 'DataURL'];
    if (!types.includes(type))
        throw Error('blobToData: data must be one of ' + types.toString())
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.addEventListener('load', () => resolve(reader.result));
        reader.addEventListener('error', e => reject(e));
        reader['readAs' + type](blob);
    })
}
function toDataURL(data, type = undefined) {
    if (data.toDataURL) return data.toDataURL(type, type)
    if (!type) type = 'text/plain;charset=US-ASCII';
    return `data:${type};base64,${btoa(data)}}`
}
async function blobsEqual(blob0, blob1) {
    const text0 = await blob0.text();
    const text1 = await blob1.text();
    return text0 === text1
}
function pause(ms = 1000) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    })
}
async function timeoutLoop(fcn, steps = -1, ms = 0) {
    let i = 0;
    while (i++ !== steps) {
        fcn(i - 1);
        await pause(ms);
    }
}
function waitUntilDone(done, ms = 10) {
    return new Promise(resolve => {
        function waitOnDone() {
            if (done()) return resolve()
            else setTimeout(waitOnDone, ms);
        }
        waitOnDone();
    })
}
async function fetchImageBitmap(url) {
    const blob = await fetch(url).then(res => res.blob());
    const ibm = await createImageBitmap(blob);
    return ibm
}
let skipChecks = false;
function skipErrorChecks(bool) {
    skipChecks = bool;
}
function checkArg$1(arg, type = 'number', name = 'Function') {
    if (skipChecks) return
    const argType = typeof arg;
    if (argType !== type) {
        throw new Error(`${name} expected a ${type}, got ${arg}`)
    }
}
function checkArgs$1(argsArray, type = 'number', name = 'Function') {
    if (skipChecks) return
    if (typeOf(argsArray) === 'arguments') argsArray = Array.from(argsArray);
    argsArray.forEach(val => {
        checkArg$1(val, type, name);
    });
}
const logOnceMsgSet = new Set();
function logOnce(msg, useWarn = false) {
    if (!logOnceMsgSet.has(msg)) {
        if (useWarn) {
            console.warn(msg);
        } else {
            console.log(msg);
        }
        logOnceMsgSet.add(msg);
    }
}
function warn(msg) {
    logOnce(msg, true);
}
function timeit(f, runs = 1e5, name = 'test') {
    name = name + '-' + runs;
    console.time(name);
    for (let i = 0; i < runs; i++) f(i);
    console.timeEnd(name);
}
function fps() {
    const timer = typeof performance === 'undefined' ? Date : performance;
    const start = timer.now();
    let steps = 0;
    function perf() {
        steps++;
        const ms = timer.now() - start;
        const fps = parseFloat((steps / (ms / 1000)).toFixed(2));
        Object.assign(perf, { fps, ms, start, steps });
    }
    perf.steps = 0;
    return perf
}
function pps(obj, title = '') {
    if (title) console.log(title);
    let count = 1;
    let str = '';
    while (obj) {
        if (typeof obj === 'function') {
            str = obj.constructor.toString();
        } else {
            const okeys = Object.keys(obj);
            str =
                okeys.length > 0
                    ? `[${okeys.join(', ')}]`
                    : `[${obj.constructor.name}]`;
        }
        console.log(`[${count++}]: ${str}`);
        obj = Object.getPrototypeOf(obj);
    }
}
function logAll(obj) {
    Object.keys(obj).forEach(key => console.log('  ', key, obj[key]));
}
const PI$1 = Math.PI;
function randomInt(max) {
    return Math.floor(Math.random() * max)
}
function randomInt2(min, max) {
    return min + Math.floor(Math.random() * (max - min))
}
function randomFloat(max) {
    return Math.random() * max
}
function randomFloat2(min, max) {
    return min + Math.random() * (max - min)
}
function randomCentered(r) {
    return randomFloat2(-r / 2, r / 2)
}
function randomNormal(mean = 0.0, sigma = 1.0) {
    const [u1, u2] = [1.0 - Math.random(), Math.random()];
    const norm = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * PI$1 * u2);
    return norm * sigma + mean
}
function randomSeed(seed = 123456) {
    seed = seed % 2147483647;
    Math.random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646
    };
}
function precision(num, digits = 4) {
    if (Math.abs(num) === 0) return 0
    if (Array.isArray(num)) return num.map(val => precision(val, digits))
    const mult = 10 ** digits;
    return Math.round(num * mult) / mult
}
const isPowerOf2 = num => (num & (num - 1)) === 0;
const nextPowerOf2 = num => Math.pow(2, Math.ceil(Math.log2(num)));
function mod(v, n) {
    return ((v % n) + n) % n
}
const wrap = (v, min, max) => min + mod(v - min, max - min);
function clamp(v, min, max) {
    if (v < min) return min
    if (v > max) return max
    return v
}
const isBetween = (val, min, max) => min <= val && val <= max;
const lerp = (lo, hi, scale) =>
    lo <= hi ? lo + (hi - lo) * scale : lo - (lo - hi) * scale;
function lerpScale(number, lo, hi) {
    if (lo === hi) throw Error('lerpScale: lo === hi')
    number = clamp(number, lo, hi);
    return (number - lo) / (hi - lo)
}
const toDeg$1 = 180 / Math.PI;
const toRad$1 = Math.PI / 180;
function degToRad(degrees) {
    return mod2pi(degrees * toRad$1)
}
function radToDeg(radians) {
    return mod360(radians * toDeg$1)
}
const degToHeading = degrees => mod360(90 - degrees);
const headingToDeg = heading => mod360(90 - heading);
function mod360(degrees) {
    return mod(degrees, 360)
}
function mod2pi(radians) {
    return mod(radians, 2 * PI$1)
}
function modpipi(radians) {
    return mod(radians, 2 * PI$1) - PI$1
}
function mod180180(degrees) {
    return mod360(degrees) - 180
}
function radToHeading(radians) {
    const deg = radians * toDeg$1;
    return mod360(90 - deg)
}
function headingToRad(heading) {
    const deg = mod360(90 - heading);
    return deg * toRad$1
}
function radToHeadingAngle(radians) {
    return -radToDeg(radians)
}
function headingAngleToRad(headingAngle) {
    return -degToRad(headingAngle)
}
function degreesEqual(deg1, deg2) {
    return mod360(deg1) === mod360(deg2)
}
function radsEqual(rads1, rads2) {
    return mod2pi(rads1) === mod2pi(rads2)
}
const headingsEq = degreesEqual;
function subtractRadians(rad1, rad0) {
    let dr = mod2pi(rad1 - rad0);
    if (dr > PI$1) dr = dr - 2 * PI$1;
    return dr
}
function subtractDegrees(deg1, deg0) {
    let dAngle = mod360(deg1 - deg0);
    if (dAngle > 180) dAngle = dAngle - 360;
    return dAngle
}
function subtractHeadings(head1, head0) {
    return -subtractDegrees(head1, head0)
}
function radiansTowardXY(x, y, x1, y1) {
    return Math.atan2(y1 - y, x1 - x)
}
function headingTowardXY(x, y, x1, y1) {
    return radToHeading(radiansTowardXY(x, y, x1, y1))
}
function degreesTowardXY(x, y, x1, y1) {
    return radToDeg(radiansTowardXY(x, y, x1, y1))
}
function inCone(x, y, radius, coneAngle, direction, x0, y0) {
    if (sqDistance(x0, y0, x, y) > radius * radius) return false
    const angle12 = radiansTowardXY(x0, y0, x, y);
    return coneAngle / 2 >= Math.abs(subtractRadians(direction, angle12))
}
const sqDistance = (x, y, x1, y1) => (x - x1) ** 2 + (y - y1) ** 2;
const distance = (x, y, x1, y1) => Math.sqrt(sqDistance(x, y, x1, y1));
const sqDistance3 = (x, y, z, x1, y1, z1) =>
    (x - x1) ** 2 + (y - y1) ** 2 + (z - z1) ** 2;
const distance3 = (x, y, z, x1, y1, z1) =>
    Math.sqrt(sqDistance3(x, y, z, x1, y1, z1));
async function runModel(model, steps = 500, useSeed = true) {
    console.log('runModel: model', model);
    if (useSeed) randomSeed();
    if (isString(model)) model = (await import(model)).default;
    if (isFunction(model)) model = new model();
    await model.startup();
    model.setup();
    if (inMain()) {
        await timeoutLoop(() => {
            model.step();
        }, steps);
    } else {
        for (let i = 0; i < steps; i++) model.step();
    }
    return model
}
function toJSON(obj, indent = 0, topLevelArrayOK = true) {
    let firstCall = topLevelArrayOK;
    const blackList = ['rectCache'];
    const json = JSON.stringify(
        obj,
        (key, val) => {
            if (blackList.includes(key)) {
                return undefined
            }
            const isAgentArray =
                Array.isArray(val) &&
                val.length > 0 &&
                Number.isInteger(val[0].id);
            if (isAgentArray && !firstCall) {
                return val.map(v => v.id)
            }
            firstCall = false;
            return val
        },
        indent
    );
    return json
}
function sampleModel(model) {
    const obj = {
        ticks: model.ticks,
        model: Object.keys(model),
        patches: model.patches.length,
        patch: model.patches.oneOf(),
        turtles: model.turtles.length,
        turtle: model.turtles.oneOf(),
        links: model.links.length,
        link: model.links.oneOf(),
    };
    const json = toJSON(obj);
    return JSON.parse(json)
}
const identityFcn = o => o;
const noopFcn = () => {};
const propFcn = prop => o => o[prop];
function arraysEqual(a1, a2) {
    if (a1.length !== a2.length) return false
    for (let i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) return false
    }
    return true
}
function removeArrayItem(array, item) {
    const ix = array.indexOf(item);
    if (ix !== -1) {
        array.splice(ix, 1);
    } else {
        throw Error(`removeArrayItem: ${item} not in array`)
    }
    return array
}
const arraysToString = arrays => arrays.map(a => `${a}`).join(',');
function forLoop(arrayOrObj, fcn) {
    if (arrayOrObj.slice) {
        for (let i = 0, len = arrayOrObj.length; i < len; i++) {
            fcn(arrayOrObj[i], i, arrayOrObj);
        }
    } else {
        Object.keys(arrayOrObj).forEach(k => fcn(arrayOrObj[k], k, arrayOrObj));
    }
}
function repeat(n, f, a = []) {
    for (let i = 0; i < n; i++) f(i, a);
    return a
}
function step(n, step, f) {
    for (let i = 0; i < n; i += step) f(i);
}
function range(length) {
    return repeat(length, (i, a) => {
        a[i] = i;
    })
}
function grep(array, regex) {
    return array.reduce((acc, val) => {
        if (regex.test(val)) acc.push(val);
        return acc
    }, [])
}
function concatArrays(array1, array2) {
    const Type = array1.constructor;
    if (Type === Array) {
        return array1.concat(convertArrayType(array2, Array))
    }
    const array = new Type(array1.length + array2.length);
    array.set(array1);
    array.set(array2, array1.length);
    return array
}
function objectToString(obj, indent = 2, jsKeys = true) {
    let str = JSON.stringify(obj, null, indent);
    if (jsKeys) str = str.replace(/"([^"]+)":/gm, '$1:');
    return str
}
const objectsEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function oneOf(array) {
    return array[randomInt(array.length)]
}
function otherOneOf(array, item) {
    if (array.length < 2) throw Error('otherOneOf: array.length < 2')
    let other;
    do {
        other = oneOf(array);
    } while (item === other)
    return other
}
const oneKeyOf = obj => oneOf(Object.keys(obj));
const oneValOf = obj => obj[oneKeyOf(obj)];
function sortNums(array, ascending = true) {
    return array.sort((a, b) => (ascending ? a - b : b - a))
}
function sortObjs(array, fcn, ascending = true) {
    if (typeof fcn === 'string') fcn = propFcn(fcn);
    const comp = (a, b) => fcn(a) - fcn(b);
    return array.sort((a, b) => (ascending ? comp(a, b) : -comp(a, b)))
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = randomInt(i)
        ;[array[j], array[i]] = [array[i], array[j]];
    }
    return array
}
function union(a1, a2) {
    return Array.from(new Set(a1.concat(a2)))
}
function intersection(a1, a2) {
    const set2 = new Set(a2);
    return a1.filter(x => set2.has(x))
}
function difference(a1, a2) {
    const set2 = new Set(a2);
    return a1.filter(x => !set2.has(x))
}
function floatRamp(start, stop, numItems) {
    if (numItems <= 1) throw Error('floatRamp: numItems must be > 1')
    const a = [];
    for (let i = 0; i < numItems; i++) {
        a.push(start + (stop - start) * (i / (numItems - 1)));
    }
    return a
}
function integerRamp(start, stop, numItems = stop - start + 1) {
    return floatRamp(start, stop, numItems).map(a => Math.round(a))
}
function nestedProperty(obj, path) {
    if (typeof path === 'string') path = path.split('.');
    switch (path.length) {
        case 1:
            return obj[path[0]]
        case 2:
            return obj[path[0]][path[1]]
        case 3:
            return obj[path[0]][path[1]][path[2]]
        case 4:
            return obj[path[0]][path[1]][path[2]][path[3]]
        default:
            return path.reduce((obj, param) => obj[param], obj)
    }
}
const arrayLast = array => array[array.length - 1];
const arrayMax = array => array.reduce((a, b) => Math.max(a, b));
const arrayMin = array => array.reduce((a, b) => Math.min(a, b));
const arrayExtent = array => [arrayMin(array), arrayMax(array)];
const arraysDiff = (a1, a2, ifcn = i => i) => {
    if (a1.length !== a2.length)
        return console.log('lengths differ', a1.length, a2.length)
    const diffs = [];
    for (let i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) diffs.push([ifcn(i), a1[i], a2[i]]);
    }
    return diffs
};
function arrayToMatrix(array, width, height) {
    if (array.length !== width * height)
        throw Error('arrayToMatrix: length !== width * height')
    const matrix = [];
    for (let i = 0; i < height; i++) {
        const row = array.slice(i * width, (i + 1) * width);
        matrix.push(row);
    }
    return matrix
}
const matrixToArray = matrix => matrix.flat();
function isOofA(data) {
    if (!isObject$1(data)) return false
    return Object.values(data).every(v => isTypedArray(v))
}
function toOofA(aofo, spec) {
    const length = aofo.length;
    const keys = Object.keys(spec);
    const oofa = {};
    keys.forEach(k => {
        oofa[k] = new spec[k](length);
    });
    forLoop(aofo, (o, i) => {
        keys.forEach(key => (oofa[key][i] = o[key]));
    });
    return oofa
}
function oofaObject(oofa, i, keys) {
    const obj = {};
    keys.forEach(key => {
        obj[key] = oofa[key][i];
    });
    return obj
}
function toAofO(oofa, keys = Object.keys(oofa)) {
    const length = oofa[keys[0]].length;
    const aofo = new Array(length);
    forLoop(aofo, (val, i) => {
        aofo[i] = oofaObject(oofa, i, keys);
    });
    return aofo
}
function oofaBuffers(postData) {
    const buffers = [];
    forLoop(postData, obj => forLoop(obj, a => buffers.push(a.buffer)));
    return buffers
}
const typeOf = obj =>
    ({}.toString
        .call(obj)
        .match(/\s(\w+)/)[1]
        .toLowerCase());
const isType = (obj, string) => typeOf(obj) === string;
const isOneOfTypes = (obj, array) => array.includes(typeOf(obj));
const isString = obj => isType(obj, 'string');
const isObject$1 = obj => isType(obj, 'object');
const isArray = obj => Array.isArray(obj);
const isNumber$1 = obj => isType(obj, 'number');
const isInteger = n => Number.isInteger(n);
const isFunction = obj => isType(obj, 'function');
const isImage = obj => isType(obj, 'image');
const isCanvas = obj =>
    isOneOfTypes(obj, ['htmlcanvaselement', 'offscreencanvas']);
const isImageable = obj =>
    isOneOfTypes(obj, [
        'image',
        'htmlimageelement',
        'htmlcanvaselement',
        'offscreencanvas',
        'imagebitmap',
    ]);
const isTypedArray = obj => typeOf(obj.buffer) === 'arraybuffer';
const isUintArray = obj => /^uint.*array$/.test(typeOf(obj));
const isIntArray = obj => /^int.*array$/.test(typeOf(obj));
const isFloatArray = obj => /^float.*array$/.test(typeOf(obj));
const isArrayLike = obj => isArray(obj) || isTypedArray(obj);
const isColorLikeArray = obj =>
    isArrayLike(obj) &&
    [3, 4].includes(obj.length) &&
    obj.every(
        i =>
            (isInteger(i) && isBetween(i, 0, 255)) ||
            (isNumber$1(i) && isBetween(i, 0, 1))
    );
function isLittleEndian() {
    const d32 = new Uint32Array([0x01020304]);
    return new Uint8ClampedArray(d32.buffer)[0] === 4
}
function convertArrayType(array, Type) {
    const Type0 = array.constructor;
    if (Type0 === Type) return array
    return Type.from(array)
}
function isDataSet(obj) {
    return typeOf(obj) === 'object' && obj.width && obj.height && obj.data
}

function downloadCanvas(can, name = 'download.png', quality = null) {
    if (!(name.endsWith('.png') || name.endsWith('.jpeg'))) name = name + '.png';
    const type = name.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const url = typeOf(can) === 'string' ? can : can.toDataURL(type, quality);
    const link = document.createElement('a');
    link.download = name;
    link.href = url;
    link.click();
}
function downloadBlob(blobable, name = 'download', format = true) {
    if (isDataSet(blobable) && !Array.isArray(blobable.data))
        blobable.data = Array.from(blobable.data);
    if (isTypedArray(blobable)) blobable = Array.from(blobable);
    if (isObject$1(blobable) || Array.isArray(blobable))
        blobable = format
            ? JSON.stringify(blobable, null, 2)
            : JSON.stringify(blobable);
    const blob = typeOf(blobable) === 'blob' ? blobable : new Blob([blobable]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = name;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
}
async function imagePromise(url, preferDOM = true) {
    if ((inMain() && preferDOM) || inDeno()) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(`Could not load image ${url}`);
            img.src = url;
        })
    } else if (inWorker() || !preferDOM) {
        const blob = await fetch(url).then(response => response.blob());
        return createImageBitmap(blob)
    }
}
function createCanvas(width, height, preferDOM = true) {
    if (inMain() && preferDOM) {
        const can = document.createElement('canvas');
        can.width = width;
        can.height = height;
        return can
    } else if (inDeno()) {
        return globalThis.createCanvas(width, height)
    } else if (inWorker() || !preferDOM) {
        return new OffscreenCanvas(width, height)
    }
}
function createCtx(width, height, preferDOM = true, attrs = {}) {
    const can = createCanvas(width, height, preferDOM);
    const ctx = can.getContext('2d', attrs);
    if (inDeno()) {
        const ctxObj = {
            canvas: can,
        };
        Object.setPrototypeOf(ctxObj, ctx);
        return ctxObj
    } else {
        return ctx
    }
}
function cloneCanvas(can, preferDOM = true) {
    const ctx = createCtx(can.width, can.height, preferDOM);
    ctx.drawImage(can, 0, 0);
    return ctx.canvas
}
function resizeCtx(ctx, width, height) {
    const copy = cloneCanvas(ctx.canvas);
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.drawImage(copy, 0, 0);
}
function setCanvasSize(can, width, height) {
    if (can.width !== width || can.height != height) {
        can.width = width;
        can.height = height;
    }
}
function setIdentity(ctx) {
    ctx.save();
    ctx.resetTransform();
}
function setTextProperties(
    ctx,
    font,
    textAlign = 'center',
    textBaseline = 'middle'
) {
    Object.assign(ctx, { font, textAlign, textBaseline });
}
let bboxCtx;
function stringMetrics(
    string,
    font,
    textAlign = 'center',
    textBaseline = 'middle'
) {
    if (!bboxCtx) bboxCtx = createCtx(0, 0);
    setTextProperties(bboxCtx, font, textAlign, textBaseline);
    const metrics = bboxCtx.measureText(string);
    metrics.height =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    return metrics
}
function drawText(ctx, string, x, y, color, useIdentity = true) {
    if (useIdentity) setIdentity(ctx);
    ctx.fillStyle = color.css || color;
    ctx.fillText(string, x, y);
    if (useIdentity) ctx.restore();
}
function ctxImageData(ctx) {
    return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
}
function ctxImageColors(ctx) {
    const typedArray = ctxImageData(ctx).data;
    const colors = [];
    step(typedArray.length, 4, i => colors.push(typedArray.subarray(i, i + 4)));
    return colors
}
function ctxImagePixels(ctx) {
    const imageData = ctxImageData(ctx);
    const pixels = new Uint32Array(imageData.data.buffer);
    return pixels
}
function clearCtx(ctx, cssColor = undefined) {
    const { width, height } = ctx.canvas;
    setIdentity(ctx);
    if (!cssColor || cssColor === 'transparent') {
        ctx.clearRect(0, 0, width, height);
    } else {
        cssColor = cssColor.css || cssColor;
        ctx.fillStyle = cssColor;
        ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();
}
function imageToCtx(img) {
    const { width, height } = img;
    const ctx = createCtx(width, height);
    fillCtxWithImage(ctx, img);
    return ctx
}
function imageToCanvas(img) {
    return imageToCtx(img).canvas
}
function fillCtxWithImage(ctx, img) {
    setIdentity(ctx);
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
}
function setCtxImage(ctx, img) {
    setCanvasSize(ctx.canvas, img.width, img.height);
    fillCtxWithImage(ctx, img);
}
function toWindow(obj) {
    Object.assign(window, obj);
    console.log('toWindow:', Object.keys(obj).join(', '));
}
function dump(model = window.model) {
    const { patches: ps, turtles: ts, links: ls } = model;
    Object.assign(window, { ps, ts, ls });
    window.p = ps.length > 0 ? ps.oneOf() : {};
    window.t = ts.length > 0 ? ts.oneOf() : {};
    window.l = ls.length > 0 ? ls.oneOf() : {};
    console.log('debug: ps, ts, ls, p, t, l dumped to window');
}
function addCssLink(url) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', url);
    document.head.appendChild(link);
}
async function fetchCssStyle(url) {
    const response = await fetch(url);
    if (!response.ok) throw Error(`fetchCssStyle: Not found: ${url}`)
    const css = await response.text();
    addCssStyle(css);
    return css
}
function addCssStyle(css) {
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
}
function getQueryString() {
    return window.location.search.substr(1)
}
function parseQueryString(
    paramsString = getQueryString()
) {
    const results = {};
    const searchParams = new URLSearchParams(paramsString);
    for (const pair of searchParams.entries()) {
        let [key, val] = pair;
        if (val.match(/^[0-9.]+$/) || val.match(/^[0-9.]+e[0-9]+$/))
            val = Number(val);
        if (['true', 't', ''].includes(val)) val = true;
        if (['false', 'f'].includes(val)) val = false;
        results[key] = val;
    }
    return results
}
function RESTapi(parameters) {
    return Object.assign(parameters, parseQueryString())
}
function printToPage(msg, element = document.body) {
    if (typeof msg === 'object') {
        msg = JSON.stringify(msg, null, 2);
    }
    msg = '<pre>' + msg + '</pre>';
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    element.style.fontFamily = 'monospace';
    element.innerHTML += msg;
}
function getEventXY(element, evt) {
    const rect = element.getBoundingClientRect();
    return [evt.clientX - rect.left, evt.clientY - rect.top]
}

var util = /*#__PURE__*/Object.freeze({
    __proto__: null,
    inMain: inMain,
    inWorker: inWorker,
    inNode: inNode,
    inDeno: inDeno,
    AsyncFunction: AsyncFunction,
    blobToData: blobToData,
    toDataURL: toDataURL,
    blobsEqual: blobsEqual,
    pause: pause,
    timeoutLoop: timeoutLoop,
    waitUntilDone: waitUntilDone,
    fetchImageBitmap: fetchImageBitmap,
    skipErrorChecks: skipErrorChecks,
    checkArg: checkArg$1,
    checkArgs: checkArgs$1,
    logOnce: logOnce,
    warn: warn,
    timeit: timeit,
    fps: fps,
    pps: pps,
    logAll: logAll,
    PI: PI$1,
    randomInt: randomInt,
    randomInt2: randomInt2,
    randomFloat: randomFloat,
    randomFloat2: randomFloat2,
    randomCentered: randomCentered,
    randomNormal: randomNormal,
    randomSeed: randomSeed,
    precision: precision,
    isPowerOf2: isPowerOf2,
    nextPowerOf2: nextPowerOf2,
    mod: mod,
    wrap: wrap,
    clamp: clamp,
    isBetween: isBetween,
    lerp: lerp,
    lerpScale: lerpScale,
    toDeg: toDeg$1,
    toRad: toRad$1,
    degToRad: degToRad,
    radToDeg: radToDeg,
    degToHeading: degToHeading,
    headingToDeg: headingToDeg,
    mod360: mod360,
    mod2pi: mod2pi,
    modpipi: modpipi,
    mod180180: mod180180,
    radToHeading: radToHeading,
    headingToRad: headingToRad,
    radToHeadingAngle: radToHeadingAngle,
    headingAngleToRad: headingAngleToRad,
    degreesEqual: degreesEqual,
    radsEqual: radsEqual,
    headingsEq: headingsEq,
    subtractRadians: subtractRadians,
    subtractDegrees: subtractDegrees,
    subtractHeadings: subtractHeadings,
    radiansTowardXY: radiansTowardXY,
    headingTowardXY: headingTowardXY,
    degreesTowardXY: degreesTowardXY,
    inCone: inCone,
    sqDistance: sqDistance,
    distance: distance,
    sqDistance3: sqDistance3,
    distance3: distance3,
    runModel: runModel,
    toJSON: toJSON,
    sampleModel: sampleModel,
    identityFcn: identityFcn,
    noopFcn: noopFcn,
    propFcn: propFcn,
    arraysEqual: arraysEqual,
    removeArrayItem: removeArrayItem,
    arraysToString: arraysToString,
    forLoop: forLoop,
    repeat: repeat,
    step: step,
    range: range,
    grep: grep,
    concatArrays: concatArrays,
    objectToString: objectToString,
    objectsEqual: objectsEqual,
    oneOf: oneOf,
    otherOneOf: otherOneOf,
    oneKeyOf: oneKeyOf,
    oneValOf: oneValOf,
    sortNums: sortNums,
    sortObjs: sortObjs,
    shuffle: shuffle,
    union: union,
    intersection: intersection,
    difference: difference,
    floatRamp: floatRamp,
    integerRamp: integerRamp,
    nestedProperty: nestedProperty,
    arrayLast: arrayLast,
    arrayMax: arrayMax,
    arrayMin: arrayMin,
    arrayExtent: arrayExtent,
    arraysDiff: arraysDiff,
    arrayToMatrix: arrayToMatrix,
    matrixToArray: matrixToArray,
    isOofA: isOofA,
    toOofA: toOofA,
    oofaObject: oofaObject,
    toAofO: toAofO,
    oofaBuffers: oofaBuffers,
    typeOf: typeOf,
    isType: isType,
    isOneOfTypes: isOneOfTypes,
    isString: isString,
    isObject: isObject$1,
    isArray: isArray,
    isNumber: isNumber$1,
    isInteger: isInteger,
    isFunction: isFunction,
    isImage: isImage,
    isCanvas: isCanvas,
    isImageable: isImageable,
    isTypedArray: isTypedArray,
    isUintArray: isUintArray,
    isIntArray: isIntArray,
    isFloatArray: isFloatArray,
    isArrayLike: isArrayLike,
    isColorLikeArray: isColorLikeArray,
    isLittleEndian: isLittleEndian,
    convertArrayType: convertArrayType,
    isDataSet: isDataSet,
    downloadCanvas: downloadCanvas,
    downloadBlob: downloadBlob,
    imagePromise: imagePromise,
    createCanvas: createCanvas,
    createCtx: createCtx,
    cloneCanvas: cloneCanvas,
    resizeCtx: resizeCtx,
    setCanvasSize: setCanvasSize,
    setIdentity: setIdentity,
    setTextProperties: setTextProperties,
    stringMetrics: stringMetrics,
    drawText: drawText,
    ctxImageData: ctxImageData,
    ctxImageColors: ctxImageColors,
    ctxImagePixels: ctxImagePixels,
    clearCtx: clearCtx,
    imageToCtx: imageToCtx,
    imageToCanvas: imageToCanvas,
    fillCtxWithImage: fillCtxWithImage,
    setCtxImage: setCtxImage,
    toWindow: toWindow,
    dump: dump,
    addCssLink: addCssLink,
    fetchCssStyle: fetchCssStyle,
    addCssStyle: addCssStyle,
    getQueryString: getQueryString,
    parseQueryString: parseQueryString,
    RESTapi: RESTapi,
    printToPage: printToPage,
    getEventXY: getEventXY
});

async function toContext(img) {
    const type = typeOf(img);
    switch (type) {
        case 'string':
            img = await imagePromise(img);
        case 'htmlimageelement':
            return imageToCtx(img)
        case 'htmlcanvaselement':
        case 'offscreencanvas':
            return img.getContext('2d')
        case 'canvasrenderingcontext2d':
            return img
        default:
            throw Error('toContext: bad img type: ' + type)
    }
}
function toUint8Array(msg) {
    const type = typeOf(msg);
    switch (type) {
        case 'number':
            msg = String.fromCharCode(msg);
        case 'string':
            return new TextEncoder().encode(msg)
        case 'uint8array':
        case 'uint8clampedarray':
            return msg
        default:
            throw Error('toUint8Array: bad msg type: ' + type)
    }
}
function charToBits(char) {
    return [
        char >> bits[0].shift,
        (char >> bits[1].shift) & bits[1].msgMask,
        char & bits[2].msgMask,
    ]
}
const bits = [
    { shift: 5, msgMask: 0b00000111, dataMask: 0b11111000 },
    { shift: 3, msgMask: 0b00000011, dataMask: 0b11111100 },
    { shift: 0, msgMask: 0b00000111, dataMask: 0b11111000 },
];
function checkSize(msg, width, height) {
    const imgSize = width * height;
    if (imgSize < msg.length)
        throw Error(`encode: image size < msg.length: ${imgSize} ${msg.length}`)
}
function stegMsgSize(imgData) {
    for (let i = 3; i < imgData.length; i = i + 4) {
        if (imgData[i] === 254) return (i - 3) / 4
    }
    throw Error(
        `decode: no message terminator in image data, length = ${imgData.length}`
    )
}
async function encode(img, msg) {
    const ctx = await toContext(img);
    const { width, height } = ctx.canvas;
    checkSize(msg, width, height);
    const msgArray = toUint8Array(msg);
    console.log('msg buffer', msgArray);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    console.log('imgageData.data', data);
    let ix;
    msgArray.forEach((char, i) => {
        const [ch0, ch1, ch2] = charToBits(char);
        ix = i * 4;
        data[ix] = (data[ix++] & bits[0].dataMask) + ch0;
        data[ix] = (data[ix++] & bits[1].dataMask) + ch1;
        data[ix] = (data[ix++] & bits[2].dataMask) + ch2;
        data[ix] = 255;
    });
    data[ix + 4] = 254;
    console.log('encoded imgageData.data', data);
    ctx.putImageData(imageData, 0, 0);
    console.log('msg length', msg.length);
    console.log('encode: embedded msg size', stegMsgSize(data));
    return ctx
}
async function decode(img, returnU8 = false) {
    const ctx = await toContext(img);
    const { width, height } = ctx.canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    const msgSize = stegMsgSize(data);
    console.log('decode: embedded msg size', msgSize);
    const msgArray = new Uint8Array(msgSize);
    msgArray.forEach((char, i) => {
        let ix = i * 4;
        const ch0 = (bits[0].msgMask & data[ix++]) << bits[0].shift;
        const ch1 = (bits[1].msgMask & data[ix++]) << bits[1].shift;
        const ch2 = (bits[2].msgMask & data[ix++]) << bits[2].shift;
        msgArray[i] = ch0 + ch1 + ch2;
    });
    console.log('decode msgArray', msgArray);
    if (returnU8) return msgArray
    return new TextDecoder().decode(msgArray)
}

var steg = /*#__PURE__*/Object.freeze({
    __proto__: null,
    stegMsgSize: stegMsgSize,
    encode: encode,
    decode: decode
});

var earthRadius = 6371008.8;
var factors = {
    centimeters: earthRadius * 100,
    centimetres: earthRadius * 100,
    degrees: earthRadius / 111325,
    feet: earthRadius * 3.28084,
    inches: earthRadius * 39.37,
    kilometers: earthRadius / 1000,
    kilometres: earthRadius / 1000,
    meters: earthRadius,
    metres: earthRadius,
    miles: earthRadius / 1609.344,
    millimeters: earthRadius * 1000,
    millimetres: earthRadius * 1000,
    nauticalmiles: earthRadius / 1852,
    radians: 1,
    yards: earthRadius * 1.0936,
};
var areaFactors = {
    acres: 0.000247105,
    centimeters: 10000,
    centimetres: 10000,
    feet: 10.763910417,
    hectares: 0.0001,
    inches: 1550.003100006,
    kilometers: 0.000001,
    kilometres: 0.000001,
    meters: 1,
    metres: 1,
    miles: 3.86e-7,
    millimeters: 1000000,
    millimetres: 1000000,
    yards: 1.195990046,
};
function feature(geom, properties, options) {
    if (options === void 0) { options = {}; }
    var feat = { type: "Feature" };
    if (options.id === 0 || options.id) {
        feat.id = options.id;
    }
    if (options.bbox) {
        feat.bbox = options.bbox;
    }
    feat.properties = properties || {};
    feat.geometry = geom;
    return feat;
}
function geometry(type, coordinates, _options) {
    switch (type) {
        case "Point":
            return point(coordinates).geometry;
        case "LineString":
            return lineString(coordinates).geometry;
        case "Polygon":
            return polygon(coordinates).geometry;
        case "MultiPoint":
            return multiPoint(coordinates).geometry;
        case "MultiLineString":
            return multiLineString(coordinates).geometry;
        case "MultiPolygon":
            return multiPolygon(coordinates).geometry;
        default:
            throw new Error(type + " is invalid");
    }
}
function point(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    if (!coordinates) {
        throw new Error("coordinates is required");
    }
    if (!Array.isArray(coordinates)) {
        throw new Error("coordinates must be an Array");
    }
    if (coordinates.length < 2) {
        throw new Error("coordinates must be at least 2 numbers long");
    }
    if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) {
        throw new Error("coordinates must contain numbers");
    }
    var geom = {
        type: "Point",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
function points(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    return featureCollection(coordinates.map(function (coords) {
        return point(coords, properties);
    }), options);
}
function polygon(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
        var ring = coordinates_1[_i];
        if (ring.length < 4) {
            throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
        }
        for (var j = 0; j < ring[ring.length - 1].length; j++) {
            if (ring[ring.length - 1][j] !== ring[0][j]) {
                throw new Error("First and last Position are not equivalent.");
            }
        }
    }
    var geom = {
        type: "Polygon",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
function polygons(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    return featureCollection(coordinates.map(function (coords) {
        return polygon(coords, properties);
    }), options);
}
function lineString(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    if (coordinates.length < 2) {
        throw new Error("coordinates must be an array of two or more positions");
    }
    var geom = {
        type: "LineString",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
function lineStrings(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    return featureCollection(coordinates.map(function (coords) {
        return lineString(coords, properties);
    }), options);
}
function featureCollection(features, options) {
    if (options === void 0) { options = {}; }
    var fc = { type: "FeatureCollection" };
    if (options.id) {
        fc.id = options.id;
    }
    if (options.bbox) {
        fc.bbox = options.bbox;
    }
    fc.features = features;
    return fc;
}
function multiLineString(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "MultiLineString",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
function multiPoint(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "MultiPoint",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
function multiPolygon(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "MultiPolygon",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
function geometryCollection(geometries, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "GeometryCollection",
        geometries: geometries,
    };
    return feature(geom, properties, options);
}
function radiansToLength(radians, units) {
    if (units === void 0) { units = "kilometers"; }
    var factor = factors[units];
    if (!factor) {
        throw new Error(units + " units is invalid");
    }
    return radians * factor;
}
function lengthToRadians(distance, units) {
    if (units === void 0) { units = "kilometers"; }
    var factor = factors[units];
    if (!factor) {
        throw new Error(units + " units is invalid");
    }
    return distance / factor;
}
function lengthToDegrees(distance, units) {
    return radiansToDegrees(lengthToRadians(distance, units));
}
function bearingToAzimuth(bearing) {
    var angle = bearing % 360;
    if (angle < 0) {
        angle += 360;
    }
    return angle;
}
function radiansToDegrees(radians) {
    var degrees = radians % (2 * Math.PI);
    return (degrees * 180) / Math.PI;
}
function convertLength(length, originalUnit, finalUnit) {
    if (originalUnit === void 0) { originalUnit = "kilometers"; }
    if (finalUnit === void 0) { finalUnit = "kilometers"; }
    if (!(length >= 0)) {
        throw new Error("length must be a positive number");
    }
    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
}
function convertArea(area, originalUnit, finalUnit) {
    if (originalUnit === void 0) { originalUnit = "meters"; }
    if (finalUnit === void 0) { finalUnit = "kilometers"; }
    if (!(area >= 0)) {
        throw new Error("area must be a positive number");
    }
    var startFactor = areaFactors[originalUnit];
    if (!startFactor) {
        throw new Error("invalid original units");
    }
    var finalFactor = areaFactors[finalUnit];
    if (!finalFactor) {
        throw new Error("invalid final units");
    }
    return (area / startFactor) * finalFactor;
}
function isNumber(num) {
    return !isNaN(num) && num !== null && !Array.isArray(num);
}
function isObject(input) {
    return !!input && input.constructor === Object;
}
function coordEach(geojson, callback, excludeWrapCoord) {
  if (geojson === null) return;
  var j,
    k,
    l,
    geometry,
    stopG,
    coords,
    geometryMaybeCollection,
    wrapShrink = 0,
    coordIndex = 0,
    isGeometryCollection,
    type = geojson.type,
    isFeatureCollection = type === "FeatureCollection",
    isFeature = type === "Feature",
    stop = isFeatureCollection ? geojson.features.length : 1;
  for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
    geometryMaybeCollection = isFeatureCollection
      ? geojson.features[featureIndex].geometry
      : isFeature
      ? geojson.geometry
      : geojson;
    isGeometryCollection = geometryMaybeCollection
      ? geometryMaybeCollection.type === "GeometryCollection"
      : false;
    stopG = isGeometryCollection
      ? geometryMaybeCollection.geometries.length
      : 1;
    for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
      var multiFeatureIndex = 0;
      var geometryIndex = 0;
      geometry = isGeometryCollection
        ? geometryMaybeCollection.geometries[geomIndex]
        : geometryMaybeCollection;
      if (geometry === null) continue;
      coords = geometry.coordinates;
      var geomType = geometry.type;
      wrapShrink =
        excludeWrapCoord &&
        (geomType === "Polygon" || geomType === "MultiPolygon")
          ? 1
          : 0;
      switch (geomType) {
        case null:
          break;
        case "Point":
          if (
            callback(
              coords,
              coordIndex,
              featureIndex,
              multiFeatureIndex,
              geometryIndex
            ) === false
          )
            return false;
          coordIndex++;
          multiFeatureIndex++;
          break;
        case "LineString":
        case "MultiPoint":
          for (j = 0; j < coords.length; j++) {
            if (
              callback(
                coords[j],
                coordIndex,
                featureIndex,
                multiFeatureIndex,
                geometryIndex
              ) === false
            )
              return false;
            coordIndex++;
            if (geomType === "MultiPoint") multiFeatureIndex++;
          }
          if (geomType === "LineString") multiFeatureIndex++;
          break;
        case "Polygon":
        case "MultiLineString":
          for (j = 0; j < coords.length; j++) {
            for (k = 0; k < coords[j].length - wrapShrink; k++) {
              if (
                callback(
                  coords[j][k],
                  coordIndex,
                  featureIndex,
                  multiFeatureIndex,
                  geometryIndex
                ) === false
              )
                return false;
              coordIndex++;
            }
            if (geomType === "MultiLineString") multiFeatureIndex++;
            if (geomType === "Polygon") geometryIndex++;
          }
          if (geomType === "Polygon") multiFeatureIndex++;
          break;
        case "MultiPolygon":
          for (j = 0; j < coords.length; j++) {
            geometryIndex = 0;
            for (k = 0; k < coords[j].length; k++) {
              for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                if (
                  callback(
                    coords[j][k][l],
                    coordIndex,
                    featureIndex,
                    multiFeatureIndex,
                    geometryIndex
                  ) === false
                )
                  return false;
                coordIndex++;
              }
              geometryIndex++;
            }
            multiFeatureIndex++;
          }
          break;
        case "GeometryCollection":
          for (j = 0; j < geometry.geometries.length; j++)
            if (
              coordEach(geometry.geometries[j], callback, excludeWrapCoord) ===
              false
            )
              return false;
          break;
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
  }
}
function coordReduce(geojson, callback, initialValue, excludeWrapCoord) {
  var previousValue = initialValue;
  coordEach(
    geojson,
    function (
      currentCoord,
      coordIndex,
      featureIndex,
      multiFeatureIndex,
      geometryIndex
    ) {
      if (coordIndex === 0 && initialValue === undefined)
        previousValue = currentCoord;
      else
        previousValue = callback(
          previousValue,
          currentCoord,
          coordIndex,
          featureIndex,
          multiFeatureIndex,
          geometryIndex
        );
    },
    excludeWrapCoord
  );
  return previousValue;
}
function propEach(geojson, callback) {
  var i;
  switch (geojson.type) {
    case "FeatureCollection":
      for (i = 0; i < geojson.features.length; i++) {
        if (callback(geojson.features[i].properties, i) === false) break;
      }
      break;
    case "Feature":
      callback(geojson.properties, 0);
      break;
  }
}
function propReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  propEach(geojson, function (currentProperties, featureIndex) {
    if (featureIndex === 0 && initialValue === undefined)
      previousValue = currentProperties;
    else
      previousValue = callback(previousValue, currentProperties, featureIndex);
  });
  return previousValue;
}
function featureEach(geojson, callback) {
  if (geojson.type === "Feature") {
    callback(geojson, 0);
  } else if (geojson.type === "FeatureCollection") {
    for (var i = 0; i < geojson.features.length; i++) {
      if (callback(geojson.features[i], i) === false) break;
    }
  }
}
function featureReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  featureEach(geojson, function (currentFeature, featureIndex) {
    if (featureIndex === 0 && initialValue === undefined)
      previousValue = currentFeature;
    else previousValue = callback(previousValue, currentFeature, featureIndex);
  });
  return previousValue;
}
function coordAll(geojson) {
  var coords = [];
  coordEach(geojson, function (coord) {
    coords.push(coord);
  });
  return coords;
}
function geomEach(geojson, callback) {
  var i,
    j,
    g,
    geometry,
    stopG,
    geometryMaybeCollection,
    isGeometryCollection,
    featureProperties,
    featureBBox,
    featureId,
    featureIndex = 0,
    isFeatureCollection = geojson.type === "FeatureCollection",
    isFeature = geojson.type === "Feature",
    stop = isFeatureCollection ? geojson.features.length : 1;
  for (i = 0; i < stop; i++) {
    geometryMaybeCollection = isFeatureCollection
      ? geojson.features[i].geometry
      : isFeature
      ? geojson.geometry
      : geojson;
    featureProperties = isFeatureCollection
      ? geojson.features[i].properties
      : isFeature
      ? geojson.properties
      : {};
    featureBBox = isFeatureCollection
      ? geojson.features[i].bbox
      : isFeature
      ? geojson.bbox
      : undefined;
    featureId = isFeatureCollection
      ? geojson.features[i].id
      : isFeature
      ? geojson.id
      : undefined;
    isGeometryCollection = geometryMaybeCollection
      ? geometryMaybeCollection.type === "GeometryCollection"
      : false;
    stopG = isGeometryCollection
      ? geometryMaybeCollection.geometries.length
      : 1;
    for (g = 0; g < stopG; g++) {
      geometry = isGeometryCollection
        ? geometryMaybeCollection.geometries[g]
        : geometryMaybeCollection;
      if (geometry === null) {
        if (
          callback(
            null,
            featureIndex,
            featureProperties,
            featureBBox,
            featureId
          ) === false
        )
          return false;
        continue;
      }
      switch (geometry.type) {
        case "Point":
        case "LineString":
        case "MultiPoint":
        case "Polygon":
        case "MultiLineString":
        case "MultiPolygon": {
          if (
            callback(
              geometry,
              featureIndex,
              featureProperties,
              featureBBox,
              featureId
            ) === false
          )
            return false;
          break;
        }
        case "GeometryCollection": {
          for (j = 0; j < geometry.geometries.length; j++) {
            if (
              callback(
                geometry.geometries[j],
                featureIndex,
                featureProperties,
                featureBBox,
                featureId
              ) === false
            )
              return false;
          }
          break;
        }
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
    featureIndex++;
  }
}
function geomReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  geomEach(
    geojson,
    function (
      currentGeometry,
      featureIndex,
      featureProperties,
      featureBBox,
      featureId
    ) {
      if (featureIndex === 0 && initialValue === undefined)
        previousValue = currentGeometry;
      else
        previousValue = callback(
          previousValue,
          currentGeometry,
          featureIndex,
          featureProperties,
          featureBBox,
          featureId
        );
    }
  );
  return previousValue;
}
function flattenEach(geojson, callback) {
  geomEach(geojson, function (geometry, featureIndex, properties, bbox, id) {
    var type = geometry === null ? null : geometry.type;
    switch (type) {
      case null:
      case "Point":
      case "LineString":
      case "Polygon":
        if (
          callback(
            feature(geometry, properties, { bbox: bbox, id: id }),
            featureIndex,
            0
          ) === false
        )
          return false;
        return;
    }
    var geomType;
    switch (type) {
      case "MultiPoint":
        geomType = "Point";
        break;
      case "MultiLineString":
        geomType = "LineString";
        break;
      case "MultiPolygon":
        geomType = "Polygon";
        break;
    }
    for (
      var multiFeatureIndex = 0;
      multiFeatureIndex < geometry.coordinates.length;
      multiFeatureIndex++
    ) {
      var coordinate = geometry.coordinates[multiFeatureIndex];
      var geom = {
        type: geomType,
        coordinates: coordinate,
      };
      if (
        callback(feature(geom, properties), featureIndex, multiFeatureIndex) ===
        false
      )
        return false;
    }
  });
}
function flattenReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  flattenEach(
    geojson,
    function (currentFeature, featureIndex, multiFeatureIndex) {
      if (
        featureIndex === 0 &&
        multiFeatureIndex === 0 &&
        initialValue === undefined
      )
        previousValue = currentFeature;
      else
        previousValue = callback(
          previousValue,
          currentFeature,
          featureIndex,
          multiFeatureIndex
        );
    }
  );
  return previousValue;
}
function segmentEach(geojson, callback) {
  flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
    var segmentIndex = 0;
    if (!feature.geometry) return;
    var type = feature.geometry.type;
    if (type === "Point" || type === "MultiPoint") return;
    var previousCoords;
    var previousFeatureIndex = 0;
    var previousMultiIndex = 0;
    var prevGeomIndex = 0;
    if (
      coordEach(
        feature,
        function (
          currentCoord,
          coordIndex,
          featureIndexCoord,
          multiPartIndexCoord,
          geometryIndex
        ) {
          if (
            previousCoords === undefined ||
            featureIndex > previousFeatureIndex ||
            multiPartIndexCoord > previousMultiIndex ||
            geometryIndex > prevGeomIndex
          ) {
            previousCoords = currentCoord;
            previousFeatureIndex = featureIndex;
            previousMultiIndex = multiPartIndexCoord;
            prevGeomIndex = geometryIndex;
            segmentIndex = 0;
            return;
          }
          var currentSegment = lineString(
            [previousCoords, currentCoord],
            feature.properties
          );
          if (
            callback(
              currentSegment,
              featureIndex,
              multiFeatureIndex,
              geometryIndex,
              segmentIndex
            ) === false
          )
            return false;
          segmentIndex++;
          previousCoords = currentCoord;
        }
      ) === false
    )
      return false;
  });
}
function segmentReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  var started = false;
  segmentEach(
    geojson,
    function (
      currentSegment,
      featureIndex,
      multiFeatureIndex,
      geometryIndex,
      segmentIndex
    ) {
      if (started === false && initialValue === undefined)
        previousValue = currentSegment;
      else
        previousValue = callback(
          previousValue,
          currentSegment,
          featureIndex,
          multiFeatureIndex,
          geometryIndex,
          segmentIndex
        );
      started = true;
    }
  );
  return previousValue;
}
function lineEach(geojson, callback) {
  if (!geojson) throw new Error("geojson is required");
  flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
    if (feature.geometry === null) return;
    var type = feature.geometry.type;
    var coords = feature.geometry.coordinates;
    switch (type) {
      case "LineString":
        if (callback(feature, featureIndex, multiFeatureIndex, 0, 0) === false)
          return false;
        break;
      case "Polygon":
        for (
          var geometryIndex = 0;
          geometryIndex < coords.length;
          geometryIndex++
        ) {
          if (
            callback(
              lineString(coords[geometryIndex], feature.properties),
              featureIndex,
              multiFeatureIndex,
              geometryIndex
            ) === false
          )
            return false;
        }
        break;
    }
  });
}
function lineReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  lineEach(
    geojson,
    function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
      if (featureIndex === 0 && initialValue === undefined)
        previousValue = currentLine;
      else
        previousValue = callback(
          previousValue,
          currentLine,
          featureIndex,
          multiFeatureIndex,
          geometryIndex
        );
    }
  );
  return previousValue;
}
function findSegment(geojson, options) {
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var featureIndex = options.featureIndex || 0;
  var multiFeatureIndex = options.multiFeatureIndex || 0;
  var geometryIndex = options.geometryIndex || 0;
  var segmentIndex = options.segmentIndex || 0;
  var properties = options.properties;
  var geometry;
  switch (geojson.type) {
    case "FeatureCollection":
      if (featureIndex < 0)
        featureIndex = geojson.features.length + featureIndex;
      properties = properties || geojson.features[featureIndex].properties;
      geometry = geojson.features[featureIndex].geometry;
      break;
    case "Feature":
      properties = properties || geojson.properties;
      geometry = geojson.geometry;
      break;
    case "Point":
    case "MultiPoint":
      return null;
    case "LineString":
    case "Polygon":
    case "MultiLineString":
    case "MultiPolygon":
      geometry = geojson;
      break;
    default:
      throw new Error("geojson is invalid");
  }
  if (geometry === null) return null;
  var coords = geometry.coordinates;
  switch (geometry.type) {
    case "Point":
    case "MultiPoint":
      return null;
    case "LineString":
      if (segmentIndex < 0) segmentIndex = coords.length + segmentIndex - 1;
      return lineString(
        [coords[segmentIndex], coords[segmentIndex + 1]],
        properties,
        options
      );
    case "Polygon":
      if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
      if (segmentIndex < 0)
        segmentIndex = coords[geometryIndex].length + segmentIndex - 1;
      return lineString(
        [
          coords[geometryIndex][segmentIndex],
          coords[geometryIndex][segmentIndex + 1],
        ],
        properties,
        options
      );
    case "MultiLineString":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      if (segmentIndex < 0)
        segmentIndex = coords[multiFeatureIndex].length + segmentIndex - 1;
      return lineString(
        [
          coords[multiFeatureIndex][segmentIndex],
          coords[multiFeatureIndex][segmentIndex + 1],
        ],
        properties,
        options
      );
    case "MultiPolygon":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      if (geometryIndex < 0)
        geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
      if (segmentIndex < 0)
        segmentIndex =
          coords[multiFeatureIndex][geometryIndex].length - segmentIndex - 1;
      return lineString(
        [
          coords[multiFeatureIndex][geometryIndex][segmentIndex],
          coords[multiFeatureIndex][geometryIndex][segmentIndex + 1],
        ],
        properties,
        options
      );
  }
  throw new Error("geojson is invalid");
}
function findPoint(geojson, options) {
  options = options || {};
  if (!isObject(options)) throw new Error("options is invalid");
  var featureIndex = options.featureIndex || 0;
  var multiFeatureIndex = options.multiFeatureIndex || 0;
  var geometryIndex = options.geometryIndex || 0;
  var coordIndex = options.coordIndex || 0;
  var properties = options.properties;
  var geometry;
  switch (geojson.type) {
    case "FeatureCollection":
      if (featureIndex < 0)
        featureIndex = geojson.features.length + featureIndex;
      properties = properties || geojson.features[featureIndex].properties;
      geometry = geojson.features[featureIndex].geometry;
      break;
    case "Feature":
      properties = properties || geojson.properties;
      geometry = geojson.geometry;
      break;
    case "Point":
    case "MultiPoint":
      return null;
    case "LineString":
    case "Polygon":
    case "MultiLineString":
    case "MultiPolygon":
      geometry = geojson;
      break;
    default:
      throw new Error("geojson is invalid");
  }
  if (geometry === null) return null;
  var coords = geometry.coordinates;
  switch (geometry.type) {
    case "Point":
      return point(coords, properties, options);
    case "MultiPoint":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      return point(coords[multiFeatureIndex], properties, options);
    case "LineString":
      if (coordIndex < 0) coordIndex = coords.length + coordIndex;
      return point(coords[coordIndex], properties, options);
    case "Polygon":
      if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
      if (coordIndex < 0)
        coordIndex = coords[geometryIndex].length + coordIndex;
      return point(coords[geometryIndex][coordIndex], properties, options);
    case "MultiLineString":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      if (coordIndex < 0)
        coordIndex = coords[multiFeatureIndex].length + coordIndex;
      return point(coords[multiFeatureIndex][coordIndex], properties, options);
    case "MultiPolygon":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      if (geometryIndex < 0)
        geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
      if (coordIndex < 0)
        coordIndex =
          coords[multiFeatureIndex][geometryIndex].length - coordIndex;
      return point(
        coords[multiFeatureIndex][geometryIndex][coordIndex],
        properties,
        options
      );
  }
  throw new Error("geojson is invalid");
}
function bbox(geojson) {
    var result = [Infinity, Infinity, -Infinity, -Infinity];
    coordEach(geojson, function (coord) {
        if (result[0] > coord[0]) {
            result[0] = coord[0];
        }
        if (result[1] > coord[1]) {
            result[1] = coord[1];
        }
        if (result[2] < coord[0]) {
            result[2] = coord[0];
        }
        if (result[3] < coord[1]) {
            result[3] = coord[1];
        }
    });
    return result;
}
bbox["default"] = bbox;
function bboxPolygon(bbox, options) {
    if (options === void 0) { options = {}; }
    var west = Number(bbox[0]);
    var south = Number(bbox[1]);
    var east = Number(bbox[2]);
    var north = Number(bbox[3]);
    if (bbox.length === 6) {
        throw new Error("@turf/bbox-polygon does not support BBox with 6 positions");
    }
    var lowLeft = [west, south];
    var topLeft = [west, north];
    var topRight = [east, north];
    var lowRight = [east, south];
    return polygon([[lowLeft, lowRight, topRight, topLeft, lowLeft]], options.properties, { bbox: bbox, id: options.id });
}
function getCoord(coord) {
    if (!coord) {
        throw new Error("coord is required");
    }
    if (!Array.isArray(coord)) {
        if (coord.type === "Feature" &&
            coord.geometry !== null &&
            coord.geometry.type === "Point") {
            return coord.geometry.coordinates;
        }
        if (coord.type === "Point") {
            return coord.coordinates;
        }
    }
    if (Array.isArray(coord) &&
        coord.length >= 2 &&
        !Array.isArray(coord[0]) &&
        !Array.isArray(coord[1])) {
        return coord;
    }
    throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function getCoords(coords) {
    if (Array.isArray(coords)) {
        return coords;
    }
    if (coords.type === "Feature") {
        if (coords.geometry !== null) {
            return coords.geometry.coordinates;
        }
    }
    else {
        if (coords.coordinates) {
            return coords.coordinates;
        }
    }
    throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
}
function containsNumber(coordinates) {
    if (coordinates.length > 1 &&
        isNumber(coordinates[0]) &&
        isNumber(coordinates[1])) {
        return true;
    }
    if (Array.isArray(coordinates[0]) && coordinates[0].length) {
        return containsNumber(coordinates[0]);
    }
    throw new Error("coordinates must only contain numbers");
}
function geojsonType(value, type, name) {
    if (!type || !name) {
        throw new Error("type and name required");
    }
    if (!value || value.type !== type) {
        throw new Error("Invalid input to " +
            name +
            ": must be a " +
            type +
            ", given " +
            value.type);
    }
}
function featureOf(feature, type, name) {
    if (!feature) {
        throw new Error("No feature passed");
    }
    if (!name) {
        throw new Error(".featureOf() requires a name");
    }
    if (!feature || feature.type !== "Feature" || !feature.geometry) {
        throw new Error("Invalid input to " + name + ", Feature with geometry required");
    }
    if (!feature.geometry || feature.geometry.type !== type) {
        throw new Error("Invalid input to " +
            name +
            ": must be a " +
            type +
            ", given " +
            feature.geometry.type);
    }
}
function collectionOf(featureCollection, type, name) {
    if (!featureCollection) {
        throw new Error("No featureCollection passed");
    }
    if (!name) {
        throw new Error(".collectionOf() requires a name");
    }
    if (!featureCollection || featureCollection.type !== "FeatureCollection") {
        throw new Error("Invalid input to " + name + ", FeatureCollection required");
    }
    for (var _i = 0, _a = featureCollection.features; _i < _a.length; _i++) {
        var feature = _a[_i];
        if (!feature || feature.type !== "Feature" || !feature.geometry) {
            throw new Error("Invalid input to " + name + ", Feature with geometry required");
        }
        if (!feature.geometry || feature.geometry.type !== type) {
            throw new Error("Invalid input to " +
                name +
                ": must be a " +
                type +
                ", given " +
                feature.geometry.type);
        }
    }
}
function getGeom(geojson) {
    if (geojson.type === "Feature") {
        return geojson.geometry;
    }
    return geojson;
}
function getType(geojson, _name) {
    if (geojson.type === "FeatureCollection") {
        return "FeatureCollection";
    }
    if (geojson.type === "GeometryCollection") {
        return "GeometryCollection";
    }
    if (geojson.type === "Feature" && geojson.geometry !== null) {
        return geojson.geometry.type;
    }
    return geojson.type;
}
function booleanPointInPolygon(point, polygon, options) {
    if (options === void 0) { options = {}; }
    if (!point) {
        throw new Error("point is required");
    }
    if (!polygon) {
        throw new Error("polygon is required");
    }
    var pt = getCoord(point);
    var geom = getGeom(polygon);
    var type = geom.type;
    var bbox = polygon.bbox;
    var polys = geom.coordinates;
    if (bbox && inBBox(pt, bbox) === false) {
        return false;
    }
    if (type === "Polygon") {
        polys = [polys];
    }
    var insidePoly = false;
    for (var i = 0; i < polys.length && !insidePoly; i++) {
        if (inRing(pt, polys[i][0], options.ignoreBoundary)) {
            var inHole = false;
            var k = 1;
            while (k < polys[i].length && !inHole) {
                if (inRing(pt, polys[i][k], !options.ignoreBoundary)) {
                    inHole = true;
                }
                k++;
            }
            if (!inHole) {
                insidePoly = true;
            }
        }
    }
    return insidePoly;
}
function inRing(pt, ring, ignoreBoundary) {
    var isInside = false;
    if (ring[0][0] === ring[ring.length - 1][0] &&
        ring[0][1] === ring[ring.length - 1][1]) {
        ring = ring.slice(0, ring.length - 1);
    }
    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        var xi = ring[i][0];
        var yi = ring[i][1];
        var xj = ring[j][0];
        var yj = ring[j][1];
        var onBoundary = pt[1] * (xi - xj) + yi * (xj - pt[0]) + yj * (pt[0] - xi) === 0 &&
            (xi - pt[0]) * (xj - pt[0]) <= 0 &&
            (yi - pt[1]) * (yj - pt[1]) <= 0;
        if (onBoundary) {
            return !ignoreBoundary;
        }
        var intersect = yi > pt[1] !== yj > pt[1] &&
            pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi;
        if (intersect) {
            isInside = !isInside;
        }
    }
    return isInside;
}
function inBBox(pt, bbox) {
    return (bbox[0] <= pt[0] && bbox[1] <= pt[1] && bbox[2] >= pt[0] && bbox[3] >= pt[1]);
}

var turfImports = /*#__PURE__*/Object.freeze({
    __proto__: null,
    bbox: bbox,
    bboxPolygon: bboxPolygon,
    bearingToAzimuth: bearingToAzimuth,
    booleanPointInPolygon: booleanPointInPolygon,
    collectionOf: collectionOf,
    containsNumber: containsNumber,
    convertArea: convertArea,
    convertLength: convertLength,
    coordAll: coordAll,
    coordEach: coordEach,
    coordReduce: coordReduce,
    feature: feature,
    featureCollection: featureCollection,
    featureEach: featureEach,
    featureOf: featureOf,
    featureReduce: featureReduce,
    findPoint: findPoint,
    findSegment: findSegment,
    flattenEach: flattenEach,
    flattenReduce: flattenReduce,
    geojsonType: geojsonType,
    geomEach: geomEach,
    geomReduce: geomReduce,
    geometry: geometry,
    geometryCollection: geometryCollection,
    getCoord: getCoord,
    getCoords: getCoords,
    getGeom: getGeom,
    getType: getType,
    lengthToDegrees: lengthToDegrees,
    lengthToRadians: lengthToRadians,
    lineEach: lineEach,
    lineReduce: lineReduce,
    lineString: lineString,
    lineStrings: lineStrings,
    multiLineString: multiLineString,
    multiPoint: multiPoint,
    multiPolygon: multiPolygon,
    point: point,
    points: points,
    polygon: polygon,
    polygons: polygons,
    propEach: propEach,
    propReduce: propReduce,
    radiansToLength: radiansToLength,
    segmentEach: segmentEach,
    segmentReduce: segmentReduce
});

class AgentArray extends Array {
    static get [Symbol.species]() {
        return AgentArray
    }
    static fromArray(array) {
        const aarray = Object.setPrototypeOf(array, AgentArray.prototype);
        return aarray
    }
    constructor(...args) {
        super(...args);
    }
    toArray() {
        Object.setPrototypeOf(this, Array.prototype);
        return this
    }
    isEmpty() {
        return this.length === 0
    }
    first() {
        return this[0]
    }
    last() {
        return this[this.length - 1]
    }
    atIndex(i) {
        if (this.length === 0) return undefined
        const index = mod(i, this.length);
        return this[index]
    }
    all(fcn) {
        return this.every(fcn)
    }
    props(key, type = AgentArray) {
        const result = new type(this.length);
        for (let i = 0; i < this.length; i++) {
            result[i] = this[i][key];
        }
        return result
    }
    typedSample(obj) {
        const result = {};
        forLoop(obj, (val, key) => {
            result[key] = this.props(key, val);
        });
        return result
    }
    uniq() {
        return AgentArray.from(new Set(this))
    }
    forLoop(fcn) {
        for (let i = 0, len = this.length; i < len; i++) {
            fcn(this[i], i, this);
        }
        return this
    }
    ask(fcn) {
        const length = this.length;
        for (let i = 0; i < Math.min(length, this.length); i++) {
            fcn(this[i], i, this);
        }
        if (length != this.length) {
            const name = this.name || this.constructor.name;
            const direction = this.length < length ? 'decreasing' : 'increasing';
            warn(`AgentArray.ask array mutation: ${name}: ${direction}`);
        }
    }
    with(fcn) {
        return this.filter(fcn)
    }
    other(t) {
        return this.filter(o => o !== t)
    }
    getValues(fcn) {
        const props = new AgentArray();
        if (isString(fcn)) {
            this.forLoop(obj => props.push(obj[fcn]));
        } else {
            this.forLoop(obj => props.push(fcn(obj)));
        }
        return props
    }
    count(reporter) {
        return this.reduce((prev, o) => prev + (reporter(o) ? 1 : 0), 0)
    }
    sum(key) {
        return this.reduce((prev, o) => prev + (key ? o[key] : o), 0)
    }
    avg(key) {
        return this.sum(key) / this.length
    }
    min(key) {
        return this.reduce(
            (prev, o) => Math.min(prev, key ? o[key] : o),
            Infinity
        )
    }
    max(key) {
        return this.reduce(
            (prev, o) => Math.max(prev, key ? o[key] : o),
            -Infinity
        )
    }
    extent(key) {
        return [this.min(key), this.max(key)]
    }
    histogram(key, bins = 10, min = this.min(key), max = this.max(key)) {
        const binSize = (max - min) / bins;
        const aa = new AgentArray(bins);
        aa.fill(0);
        this.ask(a => {
            const val = key ? a[key] : a;
            if (val < min || val > max) {
                warn(`histogram bounds error: ${val}: ${min}-${max}`);
            } else {
                let bin = Math.floor((val - min) / binSize);
                if (bin === bins) bin--;
                aa[bin]++;
            }
        });
        aa.parameters = { key, bins, min, max, binSize, arraySize: this.length };
        return aa
    }
    clone() {
        return this.slice(0)
    }
    shuffle() {
        return shuffle(this)
    }
    sortBy(reporter, ascending = true) {
        sortObjs(this, reporter, ascending);
        return this
    }
    remove(o, f) {
        const i = this.agentIndex(o, f);
        if (i !== -1) this.splice(i, 1);
        else warn(`remove: ${o} not in AgentArray`);
        return this
    }
    insert(o, f) {
        const i = this.sortedIndex(o, f);
        if (this[i] === o) throw Error('insert: item already in AgentArray')
        this.splice(i, 0, o);
    }
    sortedIndex(item, f = identityFcn) {
        if (isString(f)) f = propFcn(f);
        const value = f(item);
        let low = 0;
        let high = this.length;
        while (low < high) {
            const mid = (low + high) >>> 1;
            if (f(this[mid]) < value) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low
    }
    agentIndex(item, property) {
        if (!property) return this.indexOf(item)
        const i = this.sortedIndex(item, property);
        return this[i] === item ? i : -1
    }
    contains(item, f) {
        return this.agentIndex(item, f) >= 0
    }
    oneOf() {
        return oneOf(this)
    }
    otherOneOf(agent) {
        return otherOneOf(this, agent)
    }
    otherNOf(n, item) {
        if (this.length < n) throw Error('AgentArray: otherNOf: length < N')
        return this.clone().remove(item).shuffle().slice(0, n)
    }
    minOrMaxOf(min, reporter, valueToo = false) {
        if (this.isEmpty()) throw Error('min/max OneOf: empty array')
        if (typeof reporter === 'string') reporter = propFcn(reporter);
        let o = null;
        let val = min ? Infinity : -Infinity;
        for (let i = 0; i < this.length; i++) {
            const a = this[i];
            const aval = reporter(a);
            if ((min && aval < val) || (!min && aval > val)) {
[o, val] = [a, aval];
            }
        }
        return valueToo ? [o, val] : o
    }
    minOneOf(reporter) {
        return this.minOrMaxOf(true, reporter)
    }
    maxOneOf(reporter) {
        return this.minOrMaxOf(false, reporter)
    }
    minValOf(reporter) {
        return this.minOrMaxOf(true, reporter, true)
    }
    maxValOf(reporter) {
        return this.minOrMaxOf(false, reporter, true)
    }
    nOf(n) {
        if (n > this.length) throw Error('nOf: n larger than AgentArray')
        if (n === this.length) return this
        const result = new AgentArray();
        while (result.length < n) {
            const o = this.oneOf();
            if (!(o in result)) result.push(o);
        }
        return result
    }
    minOrMaxNOf(min, n, reporter) {
        if (n > this.length) {
            throw Error('min/max nOf: n larger than AgentArray')
        }
        const as = this.clone().sortBy(reporter);
        return min ? as.slice(0, n) : as.slice(as.length - n)
    }
    minNOf(n, reporter) {
        return this.minOrMaxNOf(true, n, reporter)
    }
    maxNOf(n, reporter) {
        return this.minOrMaxNOf(false, n, reporter)
    }
}

class AgentList extends AgentArray {
    constructor(model, ...args) {
        if (!model) throw Error('AgentList requires model')
        super(...args);
        this.model = model;
    }
    inRect(agent, dx, dy = dx, meToo = false) {
        const agents = new AgentList(this.model);
        const minX = agent.x - dx;
        const maxX = agent.x + dx;
        const minY = agent.y - dy;
        const maxY = agent.y + dy;
        this.ask(a => {
            if (minX <= a.x && a.x <= maxX && minY <= a.y && a.y <= maxY) {
                if (meToo || agent !== a) agents.push(a);
            }
        });
        return agents
    }
    inRadius(agent, radius, meToo = false) {
        const agents = new AgentList(this.model);
        const d2 = radius * radius;
        const sqDistance$1 = sqDistance;
        this.ask(a => {
            if (sqDistance$1(agent.x, agent.y, a.x, a.y) <= d2) {
                if (meToo || agent !== a) agents.push(a);
            }
        });
        return agents
    }
    inCone(agent, radius, coneAngle, heading, meToo = false) {
        heading = this.model.toRads(heading);
        coneAngle = this.model.toAngleRads(coneAngle);
        const agents = new AgentList(this.model);
        this.ask(a => {
            if (
                inCone(
                    a.x,
                    a.y,
                    radius,
                    coneAngle,
                    heading,
                    agent.x,
                    agent.y
                )
            ) {
                if (meToo || agent !== a) agents.push(a);
            }
        });
        return agents
    }
}

class AgentSet extends AgentArray {
    model
    name
    baseSet
    AgentClass
    static get [Symbol.species]() {
        return AgentArray
    }
    constructor(model, AgentClass, name, baseSet = null) {
        super();
        baseSet = baseSet || this;
        Object.assign(this, { model, name, baseSet, AgentClass });
        if (this.isBaseSet()) {
            this.breeds = {};
            this.ID = 0;
        } else {
            Object.setPrototypeOf(this, Object.getPrototypeOf(baseSet));
            this.baseSet.breeds[name] = this;
        }
        this.ownVariables = [];
        this.agentProto = new AgentClass(this);
        this.protoMixin(this.agentProto, AgentClass);
    }
    protoMixin(agentProto, AgentClass) {
        Object.assign(agentProto, {
            agentSet: this,
            model: this.model,
        });
        agentProto[this.baseSet.name] = this.baseSet;
        if (!AgentClass.prototype.setBreed) {
            Object.assign(AgentClass.prototype, {
                setBreed(breed) {
                    breed.setBreed(this);
                },
                getBreed() {
                    return this.agentSet
                },
                isBreed(breed) {
                    return this.agentSet === breed
                },
            });
            Object.defineProperty(AgentClass.prototype, 'breed', {
                get: function () {
                    return this.agentSet
                },
            });
        }
    }
    newBreed(name) {
        return new AgentSet(this.model, this.AgentClass, name, this)
    }
    isBreedSet() {
        return this.baseSet !== this
    }
    isBaseSet() {
        return this.baseSet === this
    }
    withBreed(breed) {
        return this.filter(a => a.agentSet === breed)
    }
    create() {
        console.log(`AgentSet: Abstract method called: ${this}`);
    }
    addAgent(o = undefined) {
        o = o || Object.create(this.agentProto);
        if (this.isBreedSet()) {
            this.baseSet.addAgent(o);
        } else {
            o.id = this.ID++;
            if (o.agentConstructor) o.agentConstructor();
        }
        this.push(o);
        return o
    }
    clear() {
        while (!this.isEmpty()) this.last().die();
    }
    removeAgent(o) {
        if (o.id != -1) {
            if (this.isBreedSet()) this.baseSet.remove(o, 'id');
            this.remove(o, 'id');
        }
        return this
    }
    setDefault(name, value) {
        this.agentProto[name] = value;
        return this
    }
    getDefault(name) {
        return this.agentProto[name]
    }
    setBreed(a) {
        if (a.agentSet === this) return
        if (a.agentSet.isBreedSet()) a.agentSet.remove(a, 'id');
        if (this.isBreedSet()) this.insert(a, 'id');
        const avars = a.agentSet.ownVariables;
        for (const avar of avars) {
            if (!this.ownVariables.includes(avar)) delete a[avar];
        }
        for (const ownvar of this.ownVariables) {
            if (!avars.includes(ownvar)) a[ownvar] = 0;
        }
        return Object.setPrototypeOf(a, this.agentProto)
    }
    ask(fcn) {
        if (this.length === 0) return
        const lastID = this.last().id;
        for (let i = 0; i < this.length && this[i].id <= lastID; i++) {
            fcn(this[i], i, this);
        }
    }
    askSet(fcn) {
        if (this.length === 0) return
        if (this.name === 'patches') super.forLoop(fcn);
        else if (this.isBaseSet()) this.baseSetAsk(fcn);
        else if (this.isBreedSet()) this.cloneAsk(fcn);
    }
    baseSetAsk(fcn) {
        if (this.length === 0) return
        const lastID = this.last().id;
        for (let i = 0; i < this.length; i++) {
            const obj = this[i];
            const id = obj.id;
            if (id > lastID) break
            fcn(obj, i, this);
            if (i >= this.length) break
            if (this[i].id > id) {
                while (i >= 0 && this[i].id > id) i--;
            }
        }
    }
    cloneAsk(fcn) {
        const clone = this.clone();
        for (let i = 0; i < clone.length; i++) {
            const obj = clone[i];
            if (obj.breed == this && obj.id > 0) {
                fcn(obj, i, clone);
            }
        }
    }
}

class DataSet {
    width
    height
    data
    static emptyDataSet(width, height, Type = Array) {
        return new DataSet(width, height, new Type(width * height))
    }
    constructor(width, height, data) {
        if (data.length !== width * height) {
            throw Error(
                `new DataSet length: ${data.length} !== ${width} * ${height}`
            )
        }
        Object.assign(this, { width, height, data });
    }
    checkXY(x, y) {
        if (!this.inBounds(x, y)) {
            throw Error(`DataSet: x,y out of range: ${x}, ${y}`)
        }
    }
    inBounds(x, y) {
        return (
            isBetween(x, 0, this.width - 1) &&
            isBetween(y, 0, this.height - 1)
        )
    }
    dataType() {
        return this.data.constructor
    }
    type() {
        return this.constructor
    }
    toIndex(x, y) {
        return x + y * this.width
    }
    toXY(i) {
        return [i % this.width, Math.floor(i / this.width)]
    }
    getXY(x, y) {
        return this.data[this.toIndex(x, y)]
    }
    setXY(x, y, num) {
        this.data[this.toIndex(x, y)] = num;
    }
    sample(x, y, useNearest = true) {
        this.checkXY(x, y);
        return useNearest ? this.nearest(x, y) : this.bilinear(x, y)
    }
    nearest(x, y) {
        return this.getXY(Math.round(x), Math.round(y))
    }
    bilinear(x, y) {
        const x0 = Math.floor(x);
        const y0 = Math.floor(y);
        const i = this.toIndex(x0, y0);
        const w = this.width;
        const dx = x - x0;
        const dy = y - y0;
        const dx1 = 1 - dx;
        const dy1 = 1 - dy;
        const f00 = this.data[i];
        const f10 = this.data[i + 1] || 0;
        const f01 = this.data[i + w] || 0;
        const f11 = this.data[i + 1 + w] || 0;
        return f00 * dx1 * dy1 + f10 * dx * dy1 + f01 * dx1 * dy + f11 * dx * dy
    }
    clone() {
        return new DataSet(this.width, this.height, this.data.slice(0))
    }
    emptyDataSet(width, height, type = this.dataType()) {
        return DataSet.emptyDataSet(width, height, type)
    }
    emptyArray(length) {
        const Type = this.type();
        return new Type(length)
    }
    resample(width, height, useNearest = true, Type = Array) {
        if (width === this.width && height === this.height) return this.clone()
        const ds = DataSet.emptyDataSet(width, height, Type);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                ds.setXY(
                    x,
                    y,
                    this.sample(
                        (x * (this.width - 1)) / (width - 1),
                        (y * (this.height - 1)) / (height - 1),
                        useNearest
                    )
                );
            }
        }
        return ds
    }
    scale(min, max) {
        const dsMin = this.min();
        const dsMax = this.max();
        const dsDelta = dsMax - dsMin;
        const delta = max - min;
        const m = delta / dsDelta;
        const b = min - m * dsMin;
        return this.map(x => m * x + b)
    }
    subset(x, y, width, height) {
        if (x + width > this.width || y + height > this.height) {
            console.log('subset: x+width', x + width, 'this.width', this.width);
            console.log(
                'subset: y+height',
                y + height,
                'this.height',
                this.height
            );
            throw Error('DataSet.subSet: params out of range')
        }
        const ds = this.emptyDataSet(width, height);
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                ds.setXY(i, j, this.getXY(i + x, j + y));
            }
        }
        return ds
    }
    crop(top, bottom, left, right) {
        if (bottom === undefined) {
            var { top, bottom, left, right } = top;
        }
        const width = this.width - left - right;
        const height = this.height - top - bottom;
        return this.subset(left, top, width, height)
    }
    map(f) {
        return new DataSet(this.width, this.height, this.data.map(f))
    }
    col(x) {
        const [w, h, data] = [this.width, this.height, this.data];
        if (x >= w) throw Error(`col: x out of range width: ${w} x: ${x}`)
        const colData = this.emptyArray(h);
        for (let i = 0; i < h; i++) colData[i] = data[x + i * w];
        return colData
    }
    row(y) {
        const [w, h] = [this.width, this.height];
        if (y >= h) throw Error(`row: y out of range height: ${h} x: ${y}`)
        return this.data.slice(y * w, (y + 1) * w)
    }
    convertType(type) {
        this.data = convertArrayType(this.data, type);
    }
    concatEast(ds) {
        const [w, h] = [this.width, this.height];
        const [w1, h1] = [ds.width, ds.height];
        if (h !== h1) throw Error(`concatEast: heights not equal ${h}, ${h1}`)
        const ds1 = this.emptyDataSet(w + w1, h);
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                ds1.setXY(x, y, this.getXY(x, y));
            }
        }
        for (let x = 0; x < w1; x++) {
            for (let y = 0; y < h1; y++) {
                ds1.setXY(x + w, y, ds.getXY(x, y));
            }
        }
        return ds1
    }
    concatSouth(dataset) {
        const [w, h, data] = [this.width, this.height, this.data];
        if (w !== dataset.width) {
            throw Error(`concatSouth: widths not equal ${w}, ${dataset.width}`)
        }
        const data1 = concatArrays(data, dataset.data);
        return new DataSet(w, h + dataset.height, data1)
    }
    transformCoords(x, y, tlx, tly, w, h) {
        const xs = ((x - tlx) * (this.width - 1)) / w;
        const ys = ((tly - y) * (this.height - 1)) / h;
        return [xs, ys]
    }
    coordSample(x, y, tlx, tly, w, h, useNearest = true) {
        const [xs, ys] = this.transformCoords(x, y, tlx, tly, w, h);
        return this.sample(xs, ys, useNearest)
    }
    neighborhood(x, y, array = []) {
        array.length = 0;
        const clampNeeded =
            x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1;
        for (let dy = -1; dy <= +1; dy++) {
            for (let dx = -1; dx <= +1; dx++) {
                let x0 = x + dx;
                let y0 = y + dy;
                if (clampNeeded) {
                    x0 = clamp(x0, 0, this.width - 1);
                    y0 = clamp(y0, 0, this.height - 1);
                }
                array.push(this.data[this.toIndex(x0, y0)]);
            }
        }
        return array
    }
    convolve(kernel, factor = 1, crop = false) {
        const [x0, y0, h, w] = crop
            ? [1, 1, this.height - 1, this.width - 1]
            : [0, 0, this.height, this.width];
        const newDS = this.emptyDataSet(w, h);
        const newData = newDS.data;
        let i = 0;
        for (let y = y0; y < h; y++) {
            for (let x = x0; x < w; x++) {
                const nei = this.neighborhood(x, y);
                let sum2 = 0;
                for (let i2 = 0; i2 < kernel.length; i2++) {
                    sum2 = sum2 + kernel[i2] * nei[i2];
                }
                newData[i++] = sum2 * factor;
            }
        }
        return newDS
    }
    dzdx(n = 2, factor = 1 / 8) {
        return this.convolve([-1, 0, 1, -n, 0, n, -1, 0, 1], factor)
    }
    dzdy(n = 2, factor = 1 / 8) {
        return this.convolve([1, n, 1, 0, 0, 0, -1, -n, -1], factor)
    }
    laplace8() {
        return this.convolve([-1, -1, -1, -1, 8, -1, -1, -1, -1])
    }
    laplace4() {
        return this.convolve([0, -1, 0, -1, 4, -1, 0, -1, 0])
    }
    blur(factor = 0.0625) {
        return this.convolve([1, 2, 1, 2, 4, 2, 1, 2, 1], factor)
    }
    edge() {
        return this.convolve([1, 1, 1, 1, -7, 1, 1, 1, 1])
    }
    slopeAndAspect(cellSize = 1, posAngle = true) {
        const dzdx = this.dzdx();
        const dzdy = this.dzdy();
        let [aspect, slope] = [[], []];
        const [h, w] = [dzdx.height, dzdx.width];
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const [gx, gy] = [dzdx.getXY(x, y), dzdy.getXY(x, y)];
                slope.push(Math.atan(distance(0, 0, gx, gy)) / cellSize);
                let rad = Math.atan2(-gy, -gx);
                if (posAngle && rad < 0) rad += 2 * Math.PI;
                aspect.push(rad);
            }
        }
        slope = new DataSet(w, h, slope);
        aspect = new DataSet(w, h, aspect);
        return { slope, aspect, dzdx, dzdy }
    }
    max() {
        return this.data.reduce((a, b) => Math.max(a, b))
    }
    min() {
        return this.data.reduce((a, b) => Math.min(a, b))
    }
    extent() {
        return [this.min(), this.max()]
    }
    sum() {
        return this.data.reduce((a, b) => a + b)
    }
    normalize(lo = 0, hi = 1, round = false) {
        const [min, max] = this.extent();
        const scale = 1 / (max - min);
        let data = this.data.map(n => lerp(lo, hi, scale * (n - min)));
        if (round) data = data.map(n => Math.round(n));
        return new DataSet(this.width, this.height, data)
    }
    equals(dataset) {
        return (
            this.width === dataset.width &&
            this.height === dataset.height &&
            arraysEqual(this.data, dataset.data)
        )
    }
}

class Link {
    hidden = false
    end0 = null
    end1 = null
    width = 1
    agentSet
    model
    name
    init(from, to) {
        this.end0 = from;
        this.end1 = to;
        from.links.push(this);
        to.links.push(this);
    }
    die() {
        if (this.id === -1) return
        this.agentSet.removeAgent(this);
        removeArrayItem(this.end0.links, this);
        removeArrayItem(this.end1.links, this);
        this.id = -1;
    }
    isDead() {
        return this.id === -1
    }
    bothEnds() {
        return AgentArray.fromArray([this.end0, this.end1])
    }
    length() {
        return this.end0.distance(this.end1)
    }
    get heading() {
        const { x0, x1, y0, y1 } = this;
        const rads = Math.atan2(y1 - y0, x1 - x0);
        return this.model.fromRads(rads)
    }
    otherEnd(turtle) {
        if (turtle === this.end0) return this.end1
        if (turtle === this.end1) return this.end0
        throw Error(`Link.otherEnd: turtle not a link turtle: ${turtle}`)
    }
    distanceXY(x, y) {
        return (
            this.bothEnds()
                .map(t => t.distanceXY(x, y))
                .sum() - this.length()
        )
    }
    get x0() {
        return this.end0.x
    }
    get y0() {
        return this.end0.y
    }
    get z0() {
        return this.end0.z ? this.end0.z : 0
    }
    get x1() {
        return this.end1.x
    }
    get y1() {
        return this.end1.y
    }
    get z1() {
        return this.end1.z ? this.end1.z : 0
    }
}

class Links extends AgentSet {
    createOne(from, to, initFcn = link => {}) {
        const link = this.addAgent();
        link.init(from, to);
        initFcn(link);
        return link
    }
    create(from, to, initFcn = link => {}) {
        if (!Array.isArray(to)) to = [to];
        return to.map(t => {
            return this.createOne(from, t, initFcn)
        })
    }
}

class World {
    maxX = 16
    minX = -16
    maxY = 16
    minY = -16
    maxZ = 16
    minZ = -16
    static defaultOptions(maxX = 16, maxY = maxX, maxZ = Math.max(maxX, maxY)) {
        return {
            minX: -maxX,
            maxX: maxX,
            minY: -maxY,
            maxY: maxY,
            minZ: -maxZ,
            maxZ: maxZ,
        }
    }
    static defaultWorld(maxX = 16, maxY = maxX, maxZ = maxX) {
        return new World(World.defaultOptions(maxX, maxY, maxZ))
    }
    constructor(options = {}) {
        Object.assign(this, options);
        this.setWorld();
    }
    setWorld() {
        let { minX, maxX, minY, maxY, minZ, maxZ } = this;
        forLoop({ minX, maxX, minY, maxY, minZ, maxZ }, (val, key) => {
            if (!Number.isInteger(val))
                throw Error(`World: ${key}:${val} must be an integer`)
        });
        this.numX = this.width = maxX - minX + 1;
        this.numY = this.height = maxY - minY + 1;
        this.numZ = this.depth = maxZ - minZ + 1;
        this.minXcor = minX - 0.5;
        this.maxXcor = maxX + 0.5;
        this.minYcor = minY - 0.5;
        this.maxYcor = maxY + 0.5;
        this.minZcor = minZ - 0.5;
        this.maxZcor = maxZ + 0.5;
        this.centerX = (minX + maxX) / 2;
        this.centerY = (minY + maxY) / 2;
        this.centerZ = (minZ + maxZ) / 2;
        this.numPatches = this.numX * this.numY;
    }
    getOptions() {
        const { minX, minY, minZ, maxX, maxY, maxZ } = this;
        return { minX, minY, minZ, maxX, maxY, maxZ }
    }
    randomPoint() {
        return [
            randomFloat2(this.minXcor, this.maxXcor),
            randomFloat2(this.minYcor, this.maxYcor),
        ]
    }
    random3DPoint() {
        return [
            randomFloat2(this.minXcor, this.maxXcor),
            randomFloat2(this.minYcor, this.maxYcor),
            randomFloat2(this.minZcor, this.maxZcor),
        ]
    }
    randomPatchPoint() {
        return [
            randomInt2(this.minX, this.maxX),
            randomInt2(this.minY, this.maxY),
        ]
    }
    isOnWorld(x, y, z = this.centerZ) {
        return (
            this.minXcor <= x &&
            x <= this.maxXcor &&
            this.minYcor <= y &&
            y <= this.maxYcor &&
            this.minZcor <= z &&
            z <= this.maxZcor
        )
    }
    bboxTransform(minX, minY, maxX, maxY) {
        return new BBoxTransform(minX, minY, maxX, maxY, this)
    }
    getWorldSize(patchSize = 1) {
        return [this.numX * patchSize, this.numY * patchSize]
    }
    setEuclideanTransform(ctx, patchSize) {
        this.setCanvasSize(ctx.canvas, patchSize);
        ctx.restore();
        ctx.save();
        ctx.scale(patchSize, -patchSize);
        ctx.translate(-this.minXcor, -this.maxYcor);
    }
    patchSize(canvas) {
        const { numX, numY } = this;
        const { clientWidth: width, clientHeight: height } = canvas;
        const xSize = width / numX;
        const ySize = height / numY;
        if (xSize !== ySize) {
            throw Error(`World patchSize: x/y sizes differ ${xSize}, ${ySize}`)
        }
        return xSize
    }
    setCanvasSize(canvas, patchSize) {
        const [width, height] = this.getWorldSize(patchSize);
        setCanvasSize(canvas, width, height);
    }
    pixelXYtoPatchXY(x, y, patchSize) {
        return [this.minXcor + x / patchSize, this.maxYcor - y / patchSize]
    }
    patchXYtoPixelXY(x, y, patchSize) {
        return [(x - this.minXcor) * patchSize, (this.maxYcor - y) * patchSize]
    }
    xyToPatchIndex(x, y) {
        if (!this.isOnWorld(x, y)) return undefined
        const { minX, maxX, maxY, numX, maxXcor, maxYcor } = this;
        x = x === maxXcor ? maxX : Math.round(x);
        y = y === maxYcor ? maxY : Math.round(y);
        return x - minX + numX * (maxY - y)
    }
}
class BBoxTransform {
    constructor(minX, minY, maxX, maxY, world) {
        this.bbox = [minX, minY, maxX, maxY];
        if (minX < maxX) console.log('flipX');
        if (maxY < minY) console.log('flipY');
        if (minX < maxX) [minX, maxX] = [maxX, minX];
        if (maxY < minY) [maxY, minY] = [minY, maxY];
        const { maxXcor, maxYcor, minXcor, minYcor } = world;
        const mx = (minX - maxX) / (maxXcor - minXcor);
        const my = (maxY - minY) / (maxYcor - minYcor);
        const bx = (minX + maxX - mx * (maxXcor + minXcor)) / 2;
        const by = (maxY + minY - my * (maxYcor + minYcor)) / 2;
        Object.assign(this, { mx, my, bx, by });
    }
    toWorld(bboxPoint) {
        const { mx, my, bx, by } = this;
        const [bboxX, bboxY] = bboxPoint;
        const x = (bboxX - bx) / mx;
        const y = (bboxY - by) / my;
        return [x, y]
    }
    toBBox(worldPoint) {
        const { mx, my, bx, by } = this;
        const [worldX, worldY] = worldPoint;
        const x = mx * worldX + bx;
        const y = my * worldY + by;
        return [x, y]
    }
}

const { PI, atan, atan2, cos, floor, log, pow, sin, sinh, sqrt, tan, abs } =
    Math;
const radians = degrees => (degrees * PI) / 180;
const degrees = radians => (radians * 180) / PI;
function latlon(lonlat) {
    if (typeof lonlat[0] !== 'number') return lonlat.map(val => latlon(val))
    return [lonlat[1], lonlat[0]]
}
function lonz2xFloat(lon, z) {
    return ((lon + 180) / 360) * pow(2, z)
}
function lonz2x(lon, z) {
    return floor(lonz2xFloat(lon, z))
}
function latz2yFloat(lat, z) {
    const latRads = radians(lat);
    return (1 - log(tan(latRads) + 1 / cos(latRads)) / PI) * pow(2, z - 1)
}
function latz2y(lat, z) {
    return floor(latz2yFloat(lat, z))
}
function lonlatz2xyFloat(lon, lat, z) {
    return [lonz2xFloat(lon, z), latz2yFloat(lat, z)]
}
function lonlatz2xy(lon, lat, z) {
    return [lonz2x(lon, z), latz2y(lat, z)]
}
function xz2lon(x, z) {
    return (x / pow(2, z)) * 360 - 180
}
function yz2lat(y, z) {
    const rads = atan(sinh(PI - (2 * PI * y) / pow(2, z)));
    return degrees(rads)
}
function xyz2lonlat(x, y, z) {
    return [xz2lon(x, z), yz2lat(y, z)]
}
function xyz2centerLonlat(x, y, z) {
    return [xz2lon(x + 0.5, z), yz2lat(y + 0.5, z)]
}
function xyz2bbox(x, y, z, digits = null) {
    const [west, north] = xyz2lonlat(x, y, z);
    const [east, south] = xyz2lonlat(x + 1, y + 1, z);
    if (!digits) return [west, south, east, north]
    return precision([west, south, east, north], digits)
}
function xyInBBox(bbox, pt) {
    const [west, south, east, north] = bbox;
    const [x, y] = pt;
    return isBetween(x, west, east) && isBetween(y, south, north)
}
function lonLatz2bbox(lon, lat, z) {
    const [x, y] = lonlatz2xy(lon, lat, z);
    return xyz2bbox(x, y, z)
}
function Lbounds2bbox(leafletBounds) {
    let { lng: west, lat: north } = leafletBounds.getNorthWest();
    let { lng: east, lat: south } = leafletBounds.getSouthEast();
    return [west, south, east, north]
}
function tilesBBox(bbox, z) {
    const [west, south, east, north] = bbox;
    const [westX, northY] = lonlatz2xy(west, north, z);
    let [eastX, southY] = lonlatz2xyFloat(east, south, z);
    eastX = floor(eastX);
    southY = Number.isInteger(southY) ? southY - 1 : floor(southY);
    return [westX, southY, eastX, northY]
}
function bboxCenter(bbox) {
    const [west, south, east, north] = bbox;
    return [(west + east) / 2, (south + north) / 2]
}
function bboxCoords(bbox) {
    const [west, south, east, north] = bbox;
    return [
        [west, north],
        [east, north],
        [east, south],
        [west, south],
    ]
}
function bboxBounds(bbox) {
    const [west, south, east, north] = bbox;
    return [
        [west, north],
        [east, south],
    ]
}
function bboxFeature$1(bbox, properties = {}) {
    const coords = bboxCoords(bbox);
    coords.push(coords[0]);
    return {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [coords],
        },
        properties,
    }
}
function bboxFromCenter(center, dLon = 1, dLat = dLon) {
    let [lon, lat] = center;
    return [lon - dLon, lat - dLat, lon + dLon, lat + dLat]
}
const santaFeCenter = [-105.978, 35.66];
const santaFeBBox = bboxFromCenter(santaFeCenter, 0.2, 0.1);
const newMexicoBBox = [-109.050044, 31.332301, -103.001964, 37.000104];
const newMexicoCenter = bboxCenter(newMexicoBBox);
const usaBBox = [-124.733174, 24.544701, -66.949895, 49.384358];
const usaCenter = bboxCenter(usaBBox);
function bboxSize(bbox) {
    const [west, south, east, north] = bbox;
    const width = abs(west - east);
    const height = abs(north - south);
    return [width, height]
}
function bboxAspect(bbox) {
    const [width, height] = bboxSize(bbox);
    return width / height
}
function bboxMetricSize(bbox) {
    const [west, south, east, north] = bbox;
    const topLeft = [west, north];
    const botLeft = [west, south];
    const topRight = [east, north];
    const width = lonLat2meters(topLeft, topRight);
    const height = lonLat2meters(topLeft, botLeft);
    return [width, height]
}
function bboxMetricAspect(bbox) {
    const [width, height] = bboxMetricSize(bbox);
    return width / height
}
function getOsmURL(south, west, north, east) {
    const url = 'https://overpass-api.de/api/interpreter?data=';
    const params = `\
[out:json][timeout:180][bbox:${south},${west},${north},${east}];
way[highway];
(._;>;);
out;`;
    return url + encodeURIComponent(params)
}
async function bbox2osm(bbox) {
    const [west, south, east, north] = bbox;
    const url = getOsmURL(south, west, north, east);
    const osm = await fetch(url).then(resp => resp.json());
    return osm
}
function lonLat2meters(pt1, pt2) {
    const [lon1, lat1] = pt1.map(val => radians(val));
    const [lon2, lat2] = pt2.map(val => radians(val));
    const R = 6378.137;
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = sin(dLat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dLon / 2) ** 2;
    const c = 2 * atan2(sqrt(a), sqrt(1 - a));
    const d = R * c;
    return d * 1000
}
function attribution(who = 'osm') {
    const prefix = 'Map data &copy; ';
    switch (who) {
        case 'osm':
            return (
                prefix + '<a href="https://openstreetmap.org">OpenStreetMap</a>'
            )
        case 'topo':
            return prefix + '<a href="https://opentopomap.org">OpenTopoMap</a>'
        case 'topo1':
            return (
                prefix + '<a  href="https://www.maptiler.com">OpenTopoMap</a>'
            )
        case 'smooth':
            return prefix + '<a href="https://stadiamaps.com/">Stadia Maps</a>'
        case 'usgs':
            return (
                prefix +
                'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
            )
    }
    throw Error('gis.attribution: name unknown:', who)
}
function template(who = 'osm') {
    switch (who) {
        case 'osm':
            return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        case 'topo':
            return 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png'
        case 'topo1':
            return 'https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=iQurAP6lArV1UP4gfSVs'
        case 'smooth':
            return 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
        case 'usgs':
            return 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}'
        case 'contour':
            return 'https://api.maptiler.com/tiles/contours/tiles.json?key=iQurAP6lArV1UP4gfSVs'
    }
    throw Error('gis.template: name unknown:', who)
}
function url(z, x, y, who = 'osm') {
    switch (who) {
        case 'osm':
            return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
        case 'topo':
            return `https://tile.opentopomap.org/${z}/${x}/${y}.png`
        case 'topo1':
            return `https://api.maptiler.com/maps/topo/${z}/${x}/${y}.png?key=iQurAP6lArV1UP4gfSVs`
        case 'smooth':
            return `https://tiles.stadiamaps.com/tiles/alidade_smooth/${z}/${x}/${y}{r}.png`
        case 'usgs':
            return `https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/${z}/${y}/${x}`
    }
    throw Error('gis.url: name unknown:', who)
}
function elevationTemplate(who = 'mapzen') {
    switch (who) {
        case 'mapzen':
            return `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`
        case 'maptiler':
            return `https://api.maptiler.com/tiles/terrain-rgb/{z}/{x}/{y}.png?key=iQurAP6lArV1UP4gfSVs`
        case 'redfishUSA':
            return `https://s3-us-west-2.amazonaws.com/simtable-elevation-tiles/{z}/{x}/{y}.png`
        case 'redfishWorld':
            return `https://s3-us-west-2.amazonaws.com/world-elevation-tiles/DEM_tiles/{z}/{x}/{y}.png`
        case 'mapbox':
            return (
                `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token=` +
                'pk.eyJ1IjoiYmFja3NwYWNlcyIsImEiOiJjanVrbzI4dncwOXl3M3ptcGJtN3oxMmhoIn0.x9iSCrtm0iADEqixVgPwqQ'
            )
    }
    throw Error('gis.elevationTemplate: name unknown:', who)
}

var gis = /*#__PURE__*/Object.freeze({
    __proto__: null,
    latlon: latlon,
    lonz2xFloat: lonz2xFloat,
    lonz2x: lonz2x,
    latz2yFloat: latz2yFloat,
    latz2y: latz2y,
    lonlatz2xyFloat: lonlatz2xyFloat,
    lonlatz2xy: lonlatz2xy,
    xz2lon: xz2lon,
    yz2lat: yz2lat,
    xyz2lonlat: xyz2lonlat,
    xyz2centerLonlat: xyz2centerLonlat,
    xyz2bbox: xyz2bbox,
    xyInBBox: xyInBBox,
    lonLatz2bbox: lonLatz2bbox,
    Lbounds2bbox: Lbounds2bbox,
    tilesBBox: tilesBBox,
    bboxCenter: bboxCenter,
    bboxCoords: bboxCoords,
    bboxBounds: bboxBounds,
    bboxFeature: bboxFeature$1,
    bboxFromCenter: bboxFromCenter,
    santaFeCenter: santaFeCenter,
    santaFeBBox: santaFeBBox,
    newMexicoBBox: newMexicoBBox,
    newMexicoCenter: newMexicoCenter,
    usaBBox: usaBBox,
    usaCenter: usaCenter,
    bboxSize: bboxSize,
    bboxAspect: bboxAspect,
    bboxMetricSize: bboxMetricSize,
    bboxMetricAspect: bboxMetricAspect,
    getOsmURL: getOsmURL,
    bbox2osm: bbox2osm,
    lonLat2meters: lonLat2meters,
    attribution: attribution,
    template: template,
    url: url,
    elevationTemplate: elevationTemplate
});

class GeoWorld extends World {
    static defaultOptions(bbox = newMexicoBBox, patchesWidth = 100) {
        return {
            bbox,
            patchesWidth,
        }
    }
    constructor(options = GeoWorld.defaultOptions()) {
        let { bbox: bbox$1, patchesWidth } = options;
        let json;
        if (!Array.isArray(bbox$1)) {
            json = bbox$1;
            bbox$1 = bbox(json);
        }
        const aspect = bboxMetricAspect(bbox$1);
        const maxZ = Math.round(patchesWidth / 2);
        super({
            minX: 0,
            maxX: patchesWidth - 1,
            minY: 0,
            maxY: Math.round(patchesWidth / aspect),
            minZ: -maxZ,
            maxZ: maxZ,
        });
        this.bbox = bbox$1;
        this.xfm = this.bboxTransform(...bbox$1);
        if (json) this.geojson = json;
    }
    toGeo(x, y) {
        return this.xfm.toBBox([x, y])
    }
    toWorld(geoX, geoY) {
        return this.xfm.toWorld([geoX, geoY])
    }
    bboxCenter() {
        return bboxCenter(this.bbox)
    }
    bboxCoords() {
        return bboxCoords(this.bbox)
    }
    bboxFeature(options = {}) {
        return bboxFeature$1(this.bbox, options)
    }
}

class Patches extends AgentSet {
    constructor(model, AgentClass, name) {
        super(model, AgentClass, name);
        if (this.isBreedSet()) return
        this.populate();
        this.labels = [];
    }
    populate() {
        repeat(this.model.world.numX * this.model.world.numY, i => {
            this.addAgent();
        });
    }
    neighborsOffsets(x, y) {
        const { minX, maxX, minY, maxY, numX } = this.model.world;
        if (x === minX) {
            if (y === minY) return [-numX, -numX + 1, 1]
            if (y === maxY) return [1, numX + 1, numX]
            return [-numX, -numX + 1, 1, numX + 1, numX]
        }
        if (x === maxX) {
            if (y === minY) return [-numX - 1, -numX, -1]
            if (y === maxY) return [numX, numX - 1, -1]
            return [-numX - 1, -numX, numX, numX - 1, -1]
        }
        if (y === minY) return [-numX - 1, -numX, -numX + 1, 1, -1]
        if (y === maxY) return [1, numX + 1, numX, numX - 1, -1]
        return [-numX - 1, -numX, -numX + 1, 1, numX + 1, numX, numX - 1, -1]
    }
    neighbors4Offsets(x, y) {
        const numX = this.model.world.numX;
        return this.neighborsOffsets(x, y).filter(
            n => Math.abs(n) === 1 || Math.abs(n) === numX
        )
    }
    neighbors(patch) {
        const { id, x, y } = patch;
        const offsets = this.neighborsOffsets(x, y);
        const as = new AgentList(this.model, offsets.length);
        offsets.forEach((o, i) => {
            as[i] = this[o + id];
        });
        return as
    }
    neighbors4(patch) {
        const { id, x, y } = patch;
        const offsets = this.neighbors4Offsets(x, y);
        const as = new AgentList(this.model, offsets.length);
        offsets.forEach((o, i) => {
            as[i] = this[o + id];
        });
        return as
    }
    importDataSet(dataSet, property, useNearest = false) {
        if (this.isBreedSet()) {
            warn('Patches: exportDataSet called with breed, using patches');
            this.baseSet.importDataSet(dataSet, property, useNearest);
            return
        }
        const { numX, numY } = this.model.world;
        const dataset = dataSet.resample(numX, numY, useNearest);
        this.ask(p => {
            p[property] = dataset.data[p.id];
        });
    }
    exportDataSet(property, Type = Array) {
        if (this.isBreedSet()) {
            warn('Patches: exportDataSet called with breed, using patches');
            return this.baseSet.exportDataSet(property, Type)
        }
        const { numX, numY } = this.model.world;
        let data = this.props(property);
        data = convertArrayType(data, Type);
        return new DataSet(numX, numY, data)
    }
    patchIndex(x, y) {
        const { minX, maxY, numX } = this.model.world;
        return x - minX + numX * (maxY - y)
    }
    patch(x, y) {
        if (!this.model.world.isOnWorld(x, y)) return undefined
        const intX =
            x === this.model.world.maxXcor
                ? this.model.world.maxX
                : Math.round(x);
        const intY =
            y === this.model.world.maxYcor
                ? this.model.world.maxY
                : Math.round(y);
        return this.patchXY(intX, intY)
    }
    patchXY(x, y) {
        return this[this.patchIndex(x, y)]
    }
    patchRect(p, dx, dy = dx, meToo = true) {
        if (p.rectCache) {
            const index = this.cacheIndex(dx, dy, meToo);
            const rect = p.rectCache[index];
            if (rect) return rect
        }
        const rect = new AgentList(this.model);
        let { minX, maxX, minY, maxY } = this.model.world;
        minX = Math.max(minX, p.x - dx);
        maxX = Math.min(maxX, p.x + dx);
        minY = Math.max(minY, p.y - dy);
        maxY = Math.min(maxY, p.y + dy);
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const pnext = this.patchXY(x, y);
                if (p !== pnext || meToo) rect.push(pnext);
            }
        }
        return rect
    }
    patchRectXY(x, y, dx, dy = dx, meToo = true) {
        return this.patchRect(this.patch(x, y), dx, dy, meToo)
    }
    cacheIndex(dx, dy = dx, meToo = true) {
        return (2 * dx + 1) * (2 * dy + 1) + (meToo ? 0 : -1)
    }
    cacheRect(dx, dy = dx, meToo = true, clear = true) {
        const index = this.cacheIndex(dx, dy, meToo);
        this.ask(p => {
            if (!p.rectCache || clear) p.rectCache = [];
            const rect = this.inRect(p, dx, dy, meToo);
            p.rectCache[index] = rect;
        });
    }
    inRect(patch, dx, dy = dx, meToo = true) {
        const pRect = this.patchRect(patch, dx, dy, meToo);
        if (this.isBaseSet()) return pRect
        return pRect.withBreed(this)
    }
    inRadius(patch, radius, meToo = true) {
        const dxy = Math.ceil(radius);
        const pRect = this.inRect(patch, dxy, dxy, meToo);
        return pRect.inRadius(patch, radius, meToo)
    }
    inCone(patch, radius, coneAngle, heading, meToo = true) {
        const dxy = Math.ceil(radius);
        const pRect = this.inRect(patch, dxy, dxy, meToo);
        return pRect.inCone(patch, radius, coneAngle, heading, meToo)
    }
    patchAtHeadingAndDistance(agent, heading, distance) {
        heading = this.model.toRads(heading);
        let { x, y } = agent;
        x = x + distance * Math.cos(heading);
        y = y + distance * Math.sin(heading);
        return this.patch(x, y)
    }
    isOnEdge(patch) {
        const { x, y } = patch;
        const { minX, maxX, minY, maxY } = this.model.world;
        return x === minX || x === maxX || y === minY || y === maxY
    }
    edgePatches() {
        return this.filter(p => this.isOnEdge(p))
    }
    diffuse(v, rate) {
        this.diffuseN(8, v, rate);
    }
    diffuse4(v, rate) {
        this.diffuseN(4, v, rate);
    }
    diffuseN(n, v, rate) {
        if (this[0]._diffuseNext === undefined) {
            for (let i = 0; i < this.length; i++) this[i]._diffuseNext = 0;
        }
        for (let i = 0; i < this.length; i++) {
            const p = this[i];
            const dv = p[v] * rate;
            const dvn = dv / n;
            const neighbors = n === 8 ? p.neighbors : p.neighbors4;
            const nn = neighbors.length;
            p._diffuseNext += p[v] - dv + (n - nn) * dvn;
            for (let i = 0; i < neighbors.length; i++) {
                neighbors[i]._diffuseNext += dvn;
            }
        }
        for (let i = 0; i < this.length; i++) {
            const p = this[i];
            p[v] = p._diffuseNext;
            p._diffuseNext = 0;
        }
    }
}

class Patch {
    agentSet
    model
    name
    turtles
    z = 0
    get x() {
        return (this.id % this.model.world.width) + this.model.world.minX
    }
    get y() {
        return (
            this.model.world.maxY - Math.floor(this.id / this.model.world.width)
        )
    }
    isOnEdge() {
        return this.patches.isOnEdge(this)
    }
    get neighbors() {
        const n = this.patches.neighbors(this);
        Object.defineProperty(this, 'neighbors', { value: n, enumerable: true });
        return n
    }
    get neighbors4() {
        const n = this.patches.neighbors4(this);
        Object.defineProperty(this, 'neighbors4', {
            value: n,
            enumerable: true,
        });
        return n
    }
    get turtlesHere() {
        if (this.turtles == null) {
            this.patches.ask(p => {
                p.turtles = new AgentList(this.model);
            });
            this.model.turtles.ask(t => {
                t.patch.turtles.push(t);
            });
        }
        return this.turtles
    }
    breedsHere(breed) {
        const turtles = this.turtlesHere;
        return turtles.withBreed(breed)
    }
    distanceXY(x, y, z = null) {
        const useZ = z != null && this.z != null;
        return useZ
            ? distance3(this.x, this.y, this.z, x, y, z)
            : distance(this.x, this.y, x, y)
    }
    distance(agent) {
        const { x, y, z } = agent;
        return this.distanceXY(x, y, z)
    }
    towards(agent) {
        return this.towardsXY(agent.x, agent.y)
    }
    towardsXY(x, y) {
        let rads = radiansTowardXY(this.x, this.y, x, y);
        return this.model.fromRads(rads)
    }
    patchAt(dx, dy) {
        return this.patches.patch(this.x + dx, this.y + dy)
    }
    patchAtHeadingAndDistance(heading, distance) {
        return this.patches.patchAtHeadingAndDistance(this, heading, distance)
    }
    sprout(num = 1, breed = this.model.turtles, initFcn = turtle => {}) {
        return breed.create(num, turtle => {
            turtle.setxy(this.x, this.y);
            initFcn(turtle);
        })
    }
}

class Turtles extends AgentSet {
    constructor(model, AgentClass, name, baseSet = null) {
        super(model, AgentClass, name, baseSet);
    }
    createOne(initFcn = turtle => {}) {
        const turtle = this.addAgent();
        turtle.heading = this.model.fromRads(randomFloat(Math.PI * 2));
        const p = turtle.patch;
        if (p.turtles != null) {
            p.turtles.push(turtle);
        }
        initFcn(turtle);
        return turtle
    }
    create(num, initFcn = turtle => {}) {
        return repeat(num, (i, a) => {
            a.push(this.createOne(initFcn));
        })
    }
    closestTurtle(x, y, radius) {
        const ts = this.inPatchRectXY(x, y, radius);
        if (ts.length === 0) return null
        return ts.minOneOf(t => t.distanceXY(x, y))
    }
    inPatches(patches) {
        let array = new AgentList(this.model);
        for (const p of patches) array.push(...p.turtlesHere);
        if (this.isBreedSet()) array = array.filter(a => a.agentSet === this);
        return array
    }
    inPatchRect(turtle, dx, dy = dx, meToo = false) {
        const agents = this.inPatchRectXY(turtle.x, turtle.y, dx, dy);
        if (!meToo) removeArrayItem(agents, turtle);
        return agents
    }
    inPatchRectXY(x, y, dx, dy = dx) {
        const patches = this.model.patches.patchRectXY(x, y, dx, dy, true);
        return this.inPatches(patches)
    }
    inRadius(turtle, radius, meToo = false) {
        const agents = this.inPatchRect(turtle, radius, radius, true);
        return agents.inRadius(turtle, radius, meToo)
    }
    inCone(turtle, radius, coneAngle, meToo = false) {
        const agents = this.inPatchRect(turtle, radius, radius, true);
        return agents.inCone(turtle, radius, coneAngle, turtle.heading, meToo)
    }
    layoutCircle(radius = this.model.world.maxX * 0.9, center = [0, 0]) {
        const startAngle = Math.PI / 2;
        const direction = -1;
        const dTheta = (2 * Math.PI) / this.length;
        const [x0, y0] = center;
        this.ask((turtle, i) => {
            turtle.setxy(x0, y0);
            turtle.theta = startAngle + direction * dTheta * i;
            turtle.forward(radius);
        });
    }
}

class Turtle {
    atEdge = 'wrap'
    hidden = false
    agentSet
    model
    name
    agentConstructor() {
        this.theta = null;
        this.x = 0;
        this.y = 0;
        this.agentSet.setDefault('z', null);
    }
    die() {
        if (this.id === -1) return
        this.agentSet.removeAgent(this);
        if (this.hasOwnProperty('links')) {
            while (this.links.length > 0) this.links[0].die();
        }
        if (this.patch && this.patch.turtles)
            removeArrayItem(this.patch.turtles, this);
        this.id = -1;
    }
    isDead() {
        return this.id === -1
    }
    hatch(num = 1, breed = this.agentSet, init = turtle => {}) {
        return breed.create(num, turtle => {
            turtle.setxy(this.x, this.y, this.z);
            turtle.theta = this.theta;
            for (const key of breed.ownVariables) {
                if (turtle[key] == null) turtle[key] = this[key];
            }
            init(turtle);
        })
    }
    get links() {
        Object.defineProperty(this, 'links', {
            value: new AgentList(this.model),
            enumerable: true,
        });
        return this.links
    }
    get patch() {
        return this.model.patches.patch(this.x, this.y)
    }
    get heading() {
        return this.model.fromRads(this.theta)
    }
    set heading(heading) {
        this.theta = this.model.toRads(heading);
    }
    subtractHeading(heading) {
        return subtractHeadings(heading, this.heading)
    }
    setxy(x, y, z = undefined) {
        const p0 = this.patch;
        this.x = x;
        this.y = y;
        if (z != null) this.z = z;
        this.checkXYZ(p0);
    }
    checkXYZ(p0) {
        this.checkEdge();
        this.checkPatch(p0);
    }
    checkEdge() {
        const { x, y, z } = this;
        if (!this.model.world.isOnWorld(x, y, z) && this.atEdge !== 'OK') {
            this.handleEdge(x, y, z);
        }
    }
    checkPatch(p0) {
        const p = this.patch;
        if (p != p0) {
            if (p0 && p0.turtles) removeArrayItem(p0.turtles, this);
            if (p && p.turtles) p.turtles.push(this);
        }
    }
    handleEdge(x, y, z = undefined) {
        let atEdge = this.atEdge;
        if (isString(atEdge)) {
            const { minXcor, maxXcor, minYcor, maxYcor, minZcor, maxZcor } =
                this.model.world;
            if (atEdge === 'wrap') {
                this.x = wrap(x, minXcor, maxXcor);
                this.y = wrap(y, minYcor, maxYcor);
                if (z != null) this.z = wrap(z, minZcor, maxZcor);
            } else if (atEdge === 'die') {
                this.die();
            } else if (atEdge === 'random') {
                this.setxy(...this.model.world.randomPoint());
            } else if (atEdge === 'clamp' || atEdge === 'bounce') {
                this.x = clamp(x, minXcor, maxXcor);
                this.y = clamp(y, minYcor, maxYcor);
                if (z != null) this.z = clamp(z, minZcor, maxZcor);
                if (atEdge === 'bounce') {
                    if (this.x === minXcor || this.x === maxXcor) {
                        this.theta = Math.PI - this.theta;
                    } else if (this.y === minYcor || this.y === maxYcor) {
                        this.theta = -this.theta;
                    } else if (this.z === minZcor || this.z === maxZcor) {
                        if (this.pitch) {
                            this.pitch = -this.pitch;
                        } else {
                            this.z = wrap(z, minZcor, maxZcor);
                        }
                    }
                }
            } else {
                throw Error(`turtle.handleEdge: bad atEdge: ${atEdge}`)
            }
        } else {
            this.atEdge(this);
        }
    }
    moveTo(agent) {
        this.setxy(agent.x, agent.y, agent.z);
    }
    forward(d) {
        this.setxy(
            this.x + d * Math.cos(this.theta),
            this.y + d * Math.sin(this.theta)
        );
    }
    rotate(angle) {
        angle = this.model.toCCW(angle);
        this.heading += angle;
    }
    right(angle) {
        this.rotate(-angle);
    }
    left(angle) {
        this.rotate(angle);
    }
    face(agent) {
        this.heading = this.towards(agent);
    }
    facexy(x, y) {
        this.heading = this.towardsXY(x, y);
    }
    patchAhead(distance) {
        return this.patchAtHeadingAndDistance(this.heading, distance)
    }
    patchRightAndAhead(angle, distance) {
        angle = this.model.toCCW(angle);
        return this.patchAtHeadingAndDistance(this.heading - angle, distance)
    }
    patchLeftAndAhead(angle, distance) {
        return this.patchRightAndAhead(-angle, distance)
    }
    canMove(distance) {
        return this.patchAhead(distance) != null
    }
    distanceXY(x, y, z = null) {
        const useZ = z != null && this.z != null;
        return useZ
            ? distance3(this.x, this.y, this.z, x, y, z)
            : distance(this.x, this.y, x, y)
    }
    distance(agent) {
        const { x, y, z } = agent;
        return this.distanceXY(x, y, z)
    }
    get dx() {
        return Math.cos(this.theta)
    }
    get dy() {
        return Math.sin(this.theta)
    }
    towards(agent) {
        return this.towardsXY(agent.x, agent.y)
    }
    towardsXY(x, y) {
        let rads = radiansTowardXY(this.x, this.y, x, y);
        return this.model.fromRads(rads)
    }
    patchAt(dx, dy) {
        return this.model.patches.patch(this.x + dx, this.y + dy)
    }
    patchAtHeadingAndDistance(heading, distance) {
        return this.model.patches.patchAtHeadingAndDistance(
            this,
            heading,
            distance
        )
    }
    otherEnd(l) {
        return l.end0 === this ? l.end1 : l.end0
    }
    linkNeighbors() {
        return this.links.map(l => this.otherEnd(l))
    }
    isLinkNeighbor(t) {
        return t in this.linkNeighbors()
    }
}

class Model {
    world
    patches
    turtles
    links
    ticks
    constructor(worldOptions = World.defaultOptions()) {
        this.resetModel(worldOptions);
        this.setAutoTick(true);
        this.setGeometry('heading');
    }
    initAgentSet(name, AgentsetClass, AgentClass) {
        this[name] = new AgentsetClass(this, AgentClass, name);
    }
    options2world(worldOptions) {
        return worldOptions.bbox
            ? new GeoWorld(worldOptions)
            : new World(worldOptions)
    }
    resetModel(worldOptions) {
        this.ticks = 0;
        this.world =
            worldOptions.maxXcor === undefined
                ? this.options2world(worldOptions)
                : worldOptions;
        this.initAgentSet('patches', Patches, Patch);
        this.initAgentSet('turtles', Turtles, Turtle);
        this.initAgentSet('links', Links, Link);
    }
    reset(worldOptions = this.world) {
        this.resetModel(worldOptions);
    }
    tick() {
        this.ticks++;
    }
    async startup() {}
    setup() {}
    step() {}
    setAutoTick(autoTick = true) {
        const isAutoTick = this.hasOwnProperty('step');
        if (autoTick) {
            if (isAutoTick) return
            this.step0 = this.step;
            this.step = this.stepAndTick;
        } else {
            delete this.step;
            delete this.step0;
        }
    }
    stepAndTick() {
        this.step0();
        this.tick();
    }
    patchBreeds(breedNames) {
        for (const breedName of breedNames.split(' ')) {
            this[breedName] = this.patches.newBreed(breedName);
        }
    }
    turtleBreeds(breedNames) {
        for (const breedName of breedNames.split(' ')) {
            this[breedName] = this.turtles.newBreed(breedName);
        }
    }
    linkBreeds(breedNames) {
        for (const breedName of breedNames.split(' ')) {
            this[breedName] = this.links.newBreed(breedName);
        }
    }
    setGeometry(name = 'heading') {
        const geometry = geometries[name];
        if (!geometry) throw Error(`setGeometry: ${name} geometry not defined`)
        Object.assign(this, geometry);
    }
}
const toDeg = 180 / Math.PI;
const toRad = Math.PI / 180;
const geometries = {
    radians: {
        toRads: rads => rads,
        fromRads: rads => rads,
        toAngleRads: rads => rads,
        fromAngleRads: rads => rads,
        toCCW: angle => angle,
    },
    degrees: {
        toRads: deg => deg * toRad,
        fromRads: rads => rads * toDeg,
        toAngleRads: deg => deg * toRad,
        fromAngleRads: rads => rads * toDeg,
        toCCW: angle => angle,
    },
    heading: {
        toRads: deg => (90 - deg) * toRad,
        fromRads: rads => 90 - rads * toDeg,
        toAngleRads: deg => deg * toRad,
        fromAngleRads: rads => rads * toDeg,
        toCCW: angle => -angle,
    },
};

const _lut = [];
for ( let i = 0; i < 256; i ++ ) {
	_lut[ i ] = ( i < 16 ? '0' : '' ) + ( i ).toString( 16 );
}
let _seed = 1234567;
const MathUtils = {
	DEG2RAD: Math.PI / 180,
	RAD2DEG: 180 / Math.PI,
	generateUUID: function () {
		const d0 = Math.random() * 0xffffffff | 0;
		const d1 = Math.random() * 0xffffffff | 0;
		const d2 = Math.random() * 0xffffffff | 0;
		const d3 = Math.random() * 0xffffffff | 0;
		const uuid = _lut[ d0 & 0xff ] + _lut[ d0 >> 8 & 0xff ] + _lut[ d0 >> 16 & 0xff ] + _lut[ d0 >> 24 & 0xff ] + '-' +
			_lut[ d1 & 0xff ] + _lut[ d1 >> 8 & 0xff ] + '-' + _lut[ d1 >> 16 & 0x0f | 0x40 ] + _lut[ d1 >> 24 & 0xff ] + '-' +
			_lut[ d2 & 0x3f | 0x80 ] + _lut[ d2 >> 8 & 0xff ] + '-' + _lut[ d2 >> 16 & 0xff ] + _lut[ d2 >> 24 & 0xff ] +
			_lut[ d3 & 0xff ] + _lut[ d3 >> 8 & 0xff ] + _lut[ d3 >> 16 & 0xff ] + _lut[ d3 >> 24 & 0xff ];
		return uuid.toUpperCase();
	},
	clamp: function ( value, min, max ) {
		return Math.max( min, Math.min( max, value ) );
	},
	euclideanModulo: function ( n, m ) {
		return ( ( n % m ) + m ) % m;
	},
	mapLinear: function ( x, a1, a2, b1, b2 ) {
		return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );
	},
	lerp: function ( x, y, t ) {
		return ( 1 - t ) * x + t * y;
	},
	smoothstep: function ( x, min, max ) {
		if ( x <= min ) return 0;
		if ( x >= max ) return 1;
		x = ( x - min ) / ( max - min );
		return x * x * ( 3 - 2 * x );
	},
	smootherstep: function ( x, min, max ) {
		if ( x <= min ) return 0;
		if ( x >= max ) return 1;
		x = ( x - min ) / ( max - min );
		return x * x * x * ( x * ( x * 6 - 15 ) + 10 );
	},
	randInt: function ( low, high ) {
		return low + Math.floor( Math.random() * ( high - low + 1 ) );
	},
	randFloat: function ( low, high ) {
		return low + Math.random() * ( high - low );
	},
	randFloatSpread: function ( range ) {
		return range * ( 0.5 - Math.random() );
	},
	seededRandom: function ( s ) {
		if ( s !== undefined ) _seed = s % 2147483647;
		_seed = _seed * 16807 % 2147483647;
		return ( _seed - 1 ) / 2147483646;
	},
	degToRad: function ( degrees ) {
		return degrees * MathUtils.DEG2RAD;
	},
	radToDeg: function ( radians ) {
		return radians * MathUtils.RAD2DEG;
	},
	isPowerOfTwo: function ( value ) {
		return ( value & ( value - 1 ) ) === 0 && value !== 0;
	},
	ceilPowerOfTwo: function ( value ) {
		return Math.pow( 2, Math.ceil( Math.log( value ) / Math.LN2 ) );
	},
	floorPowerOfTwo: function ( value ) {
		return Math.pow( 2, Math.floor( Math.log( value ) / Math.LN2 ) );
	},
	setQuaternionFromProperEuler: function ( q, a, b, c, order ) {
		const cos = Math.cos;
		const sin = Math.sin;
		const c2 = cos( b / 2 );
		const s2 = sin( b / 2 );
		const c13 = cos( ( a + c ) / 2 );
		const s13 = sin( ( a + c ) / 2 );
		const c1_3 = cos( ( a - c ) / 2 );
		const s1_3 = sin( ( a - c ) / 2 );
		const c3_1 = cos( ( c - a ) / 2 );
		const s3_1 = sin( ( c - a ) / 2 );
		switch ( order ) {
			case 'XYX':
				q.set( c2 * s13, s2 * c1_3, s2 * s1_3, c2 * c13 );
				break;
			case 'YZY':
				q.set( s2 * s1_3, c2 * s13, s2 * c1_3, c2 * c13 );
				break;
			case 'ZXZ':
				q.set( s2 * c1_3, s2 * s1_3, c2 * s13, c2 * c13 );
				break;
			case 'XZX':
				q.set( c2 * s13, s2 * s3_1, s2 * c3_1, c2 * c13 );
				break;
			case 'YXY':
				q.set( s2 * c3_1, c2 * s13, s2 * s3_1, c2 * c13 );
				break;
			case 'ZYZ':
				q.set( s2 * s3_1, s2 * c3_1, c2 * s13, c2 * c13 );
				break;
			default:
				console.warn( 'THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: ' + order );
		}
	}
};
class Quaternion {
	constructor( x = 0, y = 0, z = 0, w = 1 ) {
		Object.defineProperty( this, 'isQuaternion', { value: true } );
		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;
	}
	static slerp( qa, qb, qm, t ) {
		return qm.copy( qa ).slerp( qb, t );
	}
	static slerpFlat( dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t ) {
		let x0 = src0[ srcOffset0 + 0 ],
			y0 = src0[ srcOffset0 + 1 ],
			z0 = src0[ srcOffset0 + 2 ],
			w0 = src0[ srcOffset0 + 3 ];
		const x1 = src1[ srcOffset1 + 0 ],
			y1 = src1[ srcOffset1 + 1 ],
			z1 = src1[ srcOffset1 + 2 ],
			w1 = src1[ srcOffset1 + 3 ];
		if ( w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1 ) {
			let s = 1 - t;
			const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
				dir = ( cos >= 0 ? 1 : - 1 ),
				sqrSin = 1 - cos * cos;
			if ( sqrSin > Number.EPSILON ) {
				const sin = Math.sqrt( sqrSin ),
					len = Math.atan2( sin, cos * dir );
				s = Math.sin( s * len ) / sin;
				t = Math.sin( t * len ) / sin;
			}
			const tDir = t * dir;
			x0 = x0 * s + x1 * tDir;
			y0 = y0 * s + y1 * tDir;
			z0 = z0 * s + z1 * tDir;
			w0 = w0 * s + w1 * tDir;
			if ( s === 1 - t ) {
				const f = 1 / Math.sqrt( x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0 );
				x0 *= f;
				y0 *= f;
				z0 *= f;
				w0 *= f;
			}
		}
		dst[ dstOffset ] = x0;
		dst[ dstOffset + 1 ] = y0;
		dst[ dstOffset + 2 ] = z0;
		dst[ dstOffset + 3 ] = w0;
	}
	static multiplyQuaternionsFlat( dst, dstOffset, src0, srcOffset0, src1, srcOffset1 ) {
		const x0 = src0[ srcOffset0 ];
		const y0 = src0[ srcOffset0 + 1 ];
		const z0 = src0[ srcOffset0 + 2 ];
		const w0 = src0[ srcOffset0 + 3 ];
		const x1 = src1[ srcOffset1 ];
		const y1 = src1[ srcOffset1 + 1 ];
		const z1 = src1[ srcOffset1 + 2 ];
		const w1 = src1[ srcOffset1 + 3 ];
		dst[ dstOffset ] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
		dst[ dstOffset + 1 ] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
		dst[ dstOffset + 2 ] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
		dst[ dstOffset + 3 ] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;
		return dst;
	}
	get x() {
		return this._x;
	}
	set x( value ) {
		this._x = value;
		this._onChangeCallback();
	}
	get y() {
		return this._y;
	}
	set y( value ) {
		this._y = value;
		this._onChangeCallback();
	}
	get z() {
		return this._z;
	}
	set z( value ) {
		this._z = value;
		this._onChangeCallback();
	}
	get w() {
		return this._w;
	}
	set w( value ) {
		this._w = value;
		this._onChangeCallback();
	}
	set( x, y, z, w ) {
		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;
		this._onChangeCallback();
		return this;
	}
	clone() {
		return new this.constructor( this._x, this._y, this._z, this._w );
	}
	copy( quaternion ) {
		this._x = quaternion.x;
		this._y = quaternion.y;
		this._z = quaternion.z;
		this._w = quaternion.w;
		this._onChangeCallback();
		return this;
	}
	setFromEuler( euler, update ) {
		if ( ! ( euler && euler.isEuler ) ) {
			throw new Error( 'THREE.Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.' );
		}
		const x = euler._x, y = euler._y, z = euler._z, order = euler._order;
		const cos = Math.cos;
		const sin = Math.sin;
		const c1 = cos( x / 2 );
		const c2 = cos( y / 2 );
		const c3 = cos( z / 2 );
		const s1 = sin( x / 2 );
		const s2 = sin( y / 2 );
		const s3 = sin( z / 2 );
		switch ( order ) {
			case 'XYZ':
				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;
				break;
			case 'YXZ':
				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;
				break;
			case 'ZXY':
				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;
				break;
			case 'ZYX':
				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;
				break;
			case 'YZX':
				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;
				break;
			case 'XZY':
				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;
				break;
			default:
				console.warn( 'THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + order );
		}
		if ( update !== false ) this._onChangeCallback();
		return this;
	}
	setFromAxisAngle( axis, angle ) {
		const halfAngle = angle / 2, s = Math.sin( halfAngle );
		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos( halfAngle );
		this._onChangeCallback();
		return this;
	}
	setFromRotationMatrix( m ) {
		const te = m.elements,
			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],
			trace = m11 + m22 + m33;
		if ( trace > 0 ) {
			const s = 0.5 / Math.sqrt( trace + 1.0 );
			this._w = 0.25 / s;
			this._x = ( m32 - m23 ) * s;
			this._y = ( m13 - m31 ) * s;
			this._z = ( m21 - m12 ) * s;
		} else if ( m11 > m22 && m11 > m33 ) {
			const s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );
			this._w = ( m32 - m23 ) / s;
			this._x = 0.25 * s;
			this._y = ( m12 + m21 ) / s;
			this._z = ( m13 + m31 ) / s;
		} else if ( m22 > m33 ) {
			const s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );
			this._w = ( m13 - m31 ) / s;
			this._x = ( m12 + m21 ) / s;
			this._y = 0.25 * s;
			this._z = ( m23 + m32 ) / s;
		} else {
			const s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );
			this._w = ( m21 - m12 ) / s;
			this._x = ( m13 + m31 ) / s;
			this._y = ( m23 + m32 ) / s;
			this._z = 0.25 * s;
		}
		this._onChangeCallback();
		return this;
	}
	setFromUnitVectors( vFrom, vTo ) {
		const EPS = 0.000001;
		let r = vFrom.dot( vTo ) + 1;
		if ( r < EPS ) {
			r = 0;
			if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {
				this._x = - vFrom.y;
				this._y = vFrom.x;
				this._z = 0;
				this._w = r;
			} else {
				this._x = 0;
				this._y = - vFrom.z;
				this._z = vFrom.y;
				this._w = r;
			}
		} else {
			this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
			this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
			this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
			this._w = r;
		}
		return this.normalize();
	}
	angleTo( q ) {
		return 2 * Math.acos( Math.abs( MathUtils.clamp( this.dot( q ), - 1, 1 ) ) );
	}
	rotateTowards( q, step ) {
		const angle = this.angleTo( q );
		if ( angle === 0 ) return this;
		const t = Math.min( 1, step / angle );
		this.slerp( q, t );
		return this;
	}
	identity() {
		return this.set( 0, 0, 0, 1 );
	}
	inverse() {
		return this.conjugate();
	}
	conjugate() {
		this._x *= - 1;
		this._y *= - 1;
		this._z *= - 1;
		this._onChangeCallback();
		return this;
	}
	dot( v ) {
		return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
	}
	lengthSq() {
		return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
	}
	length() {
		return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );
	}
	normalize() {
		let l = this.length();
		if ( l === 0 ) {
			this._x = 0;
			this._y = 0;
			this._z = 0;
			this._w = 1;
		} else {
			l = 1 / l;
			this._x = this._x * l;
			this._y = this._y * l;
			this._z = this._z * l;
			this._w = this._w * l;
		}
		this._onChangeCallback();
		return this;
	}
	multiply( q, p ) {
		if ( p !== undefined ) {
			console.warn( 'THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
			return this.multiplyQuaternions( q, p );
		}
		return this.multiplyQuaternions( this, q );
	}
	premultiply( q ) {
		return this.multiplyQuaternions( q, this );
	}
	multiplyQuaternions( a, b ) {
		const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
		const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;
		this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
		this._onChangeCallback();
		return this;
	}
	slerp( qb, t ) {
		if ( t === 0 ) return this;
		if ( t === 1 ) return this.copy( qb );
		const x = this._x, y = this._y, z = this._z, w = this._w;
		let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
		if ( cosHalfTheta < 0 ) {
			this._w = - qb._w;
			this._x = - qb._x;
			this._y = - qb._y;
			this._z = - qb._z;
			cosHalfTheta = - cosHalfTheta;
		} else {
			this.copy( qb );
		}
		if ( cosHalfTheta >= 1.0 ) {
			this._w = w;
			this._x = x;
			this._y = y;
			this._z = z;
			return this;
		}
		const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;
		if ( sqrSinHalfTheta <= Number.EPSILON ) {
			const s = 1 - t;
			this._w = s * w + t * this._w;
			this._x = s * x + t * this._x;
			this._y = s * y + t * this._y;
			this._z = s * z + t * this._z;
			this.normalize();
			this._onChangeCallback();
			return this;
		}
		const sinHalfTheta = Math.sqrt( sqrSinHalfTheta );
		const halfTheta = Math.atan2( sinHalfTheta, cosHalfTheta );
		const ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
			ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;
		this._w = ( w * ratioA + this._w * ratioB );
		this._x = ( x * ratioA + this._x * ratioB );
		this._y = ( y * ratioA + this._y * ratioB );
		this._z = ( z * ratioA + this._z * ratioB );
		this._onChangeCallback();
		return this;
	}
	equals( quaternion ) {
		return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );
	}
	fromArray( array, offset ) {
		if ( offset === undefined ) offset = 0;
		this._x = array[ offset ];
		this._y = array[ offset + 1 ];
		this._z = array[ offset + 2 ];
		this._w = array[ offset + 3 ];
		this._onChangeCallback();
		return this;
	}
	toArray( array, offset ) {
		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;
		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._w;
		return array;
	}
	fromBufferAttribute( attribute, index ) {
		this._x = attribute.getX( index );
		this._y = attribute.getY( index );
		this._z = attribute.getZ( index );
		this._w = attribute.getW( index );
		return this;
	}
	_onChange( callback ) {
		this._onChangeCallback = callback;
		return this;
	}
	_onChangeCallback() {}
}
class Vector3 {
	constructor( x = 0, y = 0, z = 0 ) {
		Object.defineProperty( this, 'isVector3', { value: true } );
		this.x = x;
		this.y = y;
		this.z = z;
	}
	set( x, y, z ) {
		if ( z === undefined ) z = this.z;
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}
	setScalar( scalar ) {
		this.x = scalar;
		this.y = scalar;
		this.z = scalar;
		return this;
	}
	setX( x ) {
		this.x = x;
		return this;
	}
	setY( y ) {
		this.y = y;
		return this;
	}
	setZ( z ) {
		this.z = z;
		return this;
	}
	setComponent( index, value ) {
		switch ( index ) {
			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			default: throw new Error( 'index is out of range: ' + index );
		}
		return this;
	}
	getComponent( index ) {
		switch ( index ) {
			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			default: throw new Error( 'index is out of range: ' + index );
		}
	}
	clone() {
		return new this.constructor( this.x, this.y, this.z );
	}
	copy( v ) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	}
	add( v, w ) {
		if ( w !== undefined ) {
			console.warn( 'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );
		}
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}
	addScalar( s ) {
		this.x += s;
		this.y += s;
		this.z += s;
		return this;
	}
	addVectors( a, b ) {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		return this;
	}
	addScaledVector( v, s ) {
		this.x += v.x * s;
		this.y += v.y * s;
		this.z += v.z * s;
		return this;
	}
	sub( v, w ) {
		if ( w !== undefined ) {
			console.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );
		}
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}
	subScalar( s ) {
		this.x -= s;
		this.y -= s;
		this.z -= s;
		return this;
	}
	subVectors( a, b ) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		return this;
	}
	multiply( v, w ) {
		if ( w !== undefined ) {
			console.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
			return this.multiplyVectors( v, w );
		}
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		return this;
	}
	multiplyScalar( scalar ) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	}
	multiplyVectors( a, b ) {
		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;
		return this;
	}
	applyEuler( euler ) {
		if ( ! ( euler && euler.isEuler ) ) {
			console.error( 'THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.' );
		}
		return this.applyQuaternion( _quaternion$2.setFromEuler( euler ) );
	}
	applyAxisAngle( axis, angle ) {
		return this.applyQuaternion( _quaternion$2.setFromAxisAngle( axis, angle ) );
	}
	applyMatrix3( m ) {
		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;
		this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
		this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
		this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;
		return this;
	}
	applyNormalMatrix( m ) {
		return this.applyMatrix3( m ).normalize();
	}
	applyMatrix4( m ) {
		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;
		const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );
		this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
		this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
		this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;
		return this;
	}
	applyQuaternion( q ) {
		const x = this.x, y = this.y, z = this.z;
		const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
		const ix = qw * x + qy * z - qz * y;
		const iy = qw * y + qz * x - qx * z;
		const iz = qw * z + qx * y - qy * x;
		const iw = - qx * x - qy * y - qz * z;
		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;
		return this;
	}
	project( camera ) {
		return this.applyMatrix4( camera.matrixWorldInverse ).applyMatrix4( camera.projectionMatrix );
	}
	unproject( camera ) {
		return this.applyMatrix4( camera.projectionMatrixInverse ).applyMatrix4( camera.matrixWorld );
	}
	transformDirection( m ) {
		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;
		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;
		return this.normalize();
	}
	divide( v ) {
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;
		return this;
	}
	divideScalar( scalar ) {
		return this.multiplyScalar( 1 / scalar );
	}
	min( v ) {
		this.x = Math.min( this.x, v.x );
		this.y = Math.min( this.y, v.y );
		this.z = Math.min( this.z, v.z );
		return this;
	}
	max( v ) {
		this.x = Math.max( this.x, v.x );
		this.y = Math.max( this.y, v.y );
		this.z = Math.max( this.z, v.z );
		return this;
	}
	clamp( min, max ) {
		this.x = Math.max( min.x, Math.min( max.x, this.x ) );
		this.y = Math.max( min.y, Math.min( max.y, this.y ) );
		this.z = Math.max( min.z, Math.min( max.z, this.z ) );
		return this;
	}
	clampScalar( minVal, maxVal ) {
		this.x = Math.max( minVal, Math.min( maxVal, this.x ) );
		this.y = Math.max( minVal, Math.min( maxVal, this.y ) );
		this.z = Math.max( minVal, Math.min( maxVal, this.z ) );
		return this;
	}
	clampLength( min, max ) {
		const length = this.length();
		return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );
	}
	floor() {
		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );
		this.z = Math.floor( this.z );
		return this;
	}
	ceil() {
		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );
		this.z = Math.ceil( this.z );
		return this;
	}
	round() {
		this.x = Math.round( this.x );
		this.y = Math.round( this.y );
		this.z = Math.round( this.z );
		return this;
	}
	roundToZero() {
		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
		this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );
		return this;
	}
	negate() {
		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;
		return this;
	}
	dot( v ) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
	lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	length() {
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
	}
	manhattanLength() {
		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );
	}
	normalize() {
		return this.divideScalar( this.length() || 1 );
	}
	setLength( length ) {
		return this.normalize().multiplyScalar( length );
	}
	lerp( v, alpha ) {
		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;
		return this;
	}
	lerpVectors( v1, v2, alpha ) {
		this.x = v1.x + ( v2.x - v1.x ) * alpha;
		this.y = v1.y + ( v2.y - v1.y ) * alpha;
		this.z = v1.z + ( v2.z - v1.z ) * alpha;
		return this;
	}
	cross( v, w ) {
		if ( w !== undefined ) {
			console.warn( 'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
			return this.crossVectors( v, w );
		}
		return this.crossVectors( this, v );
	}
	crossVectors( a, b ) {
		const ax = a.x, ay = a.y, az = a.z;
		const bx = b.x, by = b.y, bz = b.z;
		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;
		return this;
	}
	projectOnVector( v ) {
		const denominator = v.lengthSq();
		if ( denominator === 0 ) return this.set( 0, 0, 0 );
		const scalar = v.dot( this ) / denominator;
		return this.copy( v ).multiplyScalar( scalar );
	}
	projectOnPlane( planeNormal ) {
		_vector.copy( this ).projectOnVector( planeNormal );
		return this.sub( _vector );
	}
	reflect( normal ) {
		return this.sub( _vector.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );
	}
	angleTo( v ) {
		const denominator = Math.sqrt( this.lengthSq() * v.lengthSq() );
		if ( denominator === 0 ) return Math.PI / 2;
		const theta = this.dot( v ) / denominator;
		return Math.acos( MathUtils.clamp( theta, - 1, 1 ) );
	}
	distanceTo( v ) {
		return Math.sqrt( this.distanceToSquared( v ) );
	}
	distanceToSquared( v ) {
		const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
		return dx * dx + dy * dy + dz * dz;
	}
	manhattanDistanceTo( v ) {
		return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y ) + Math.abs( this.z - v.z );
	}
	setFromSpherical( s ) {
		return this.setFromSphericalCoords( s.radius, s.phi, s.theta );
	}
	setFromSphericalCoords( radius, phi, theta ) {
		const sinPhiRadius = Math.sin( phi ) * radius;
		this.x = sinPhiRadius * Math.sin( theta );
		this.y = Math.cos( phi ) * radius;
		this.z = sinPhiRadius * Math.cos( theta );
		return this;
	}
	setFromCylindrical( c ) {
		return this.setFromCylindricalCoords( c.radius, c.theta, c.y );
	}
	setFromCylindricalCoords( radius, theta, y ) {
		this.x = radius * Math.sin( theta );
		this.y = y;
		this.z = radius * Math.cos( theta );
		return this;
	}
	setFromMatrixPosition( m ) {
		const e = m.elements;
		this.x = e[ 12 ];
		this.y = e[ 13 ];
		this.z = e[ 14 ];
		return this;
	}
	setFromMatrixScale( m ) {
		const sx = this.setFromMatrixColumn( m, 0 ).length();
		const sy = this.setFromMatrixColumn( m, 1 ).length();
		const sz = this.setFromMatrixColumn( m, 2 ).length();
		this.x = sx;
		this.y = sy;
		this.z = sz;
		return this;
	}
	setFromMatrixColumn( m, index ) {
		return this.fromArray( m.elements, index * 4 );
	}
	setFromMatrix3Column( m, index ) {
		return this.fromArray( m.elements, index * 3 );
	}
	equals( v ) {
		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );
	}
	fromArray( array, offset ) {
		if ( offset === undefined ) offset = 0;
		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];
		return this;
	}
	toArray( array, offset ) {
		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;
		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		array[ offset + 2 ] = this.z;
		return array;
	}
	fromBufferAttribute( attribute, index, offset ) {
		if ( offset !== undefined ) {
			console.warn( 'THREE.Vector3: offset has been removed from .fromBufferAttribute().' );
		}
		this.x = attribute.getX( index );
		this.y = attribute.getY( index );
		this.z = attribute.getZ( index );
		return this;
	}
	random() {
		this.x = Math.random();
		this.y = Math.random();
		this.z = Math.random();
		return this;
	}
}
const _vector = new Vector3();
const _quaternion$2 = new Quaternion();
class Matrix4 {
	constructor() {
		Object.defineProperty( this, 'isMatrix4', { value: true } );
		this.elements = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
		if ( arguments.length > 0 ) {
			console.error( 'THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.' );
		}
	}
	set( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {
		const te = this.elements;
		te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
		te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
		te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
		te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;
		return this;
	}
	identity() {
		this.set(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);
		return this;
	}
	clone() {
		return new Matrix4().fromArray( this.elements );
	}
	copy( m ) {
		const te = this.elements;
		const me = m.elements;
		te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ]; te[ 3 ] = me[ 3 ];
		te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ]; te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ];
		te[ 8 ] = me[ 8 ]; te[ 9 ] = me[ 9 ]; te[ 10 ] = me[ 10 ]; te[ 11 ] = me[ 11 ];
		te[ 12 ] = me[ 12 ]; te[ 13 ] = me[ 13 ]; te[ 14 ] = me[ 14 ]; te[ 15 ] = me[ 15 ];
		return this;
	}
	copyPosition( m ) {
		const te = this.elements, me = m.elements;
		te[ 12 ] = me[ 12 ];
		te[ 13 ] = me[ 13 ];
		te[ 14 ] = me[ 14 ];
		return this;
	}
	extractBasis( xAxis, yAxis, zAxis ) {
		xAxis.setFromMatrixColumn( this, 0 );
		yAxis.setFromMatrixColumn( this, 1 );
		zAxis.setFromMatrixColumn( this, 2 );
		return this;
	}
	makeBasis( xAxis, yAxis, zAxis ) {
		this.set(
			xAxis.x, yAxis.x, zAxis.x, 0,
			xAxis.y, yAxis.y, zAxis.y, 0,
			xAxis.z, yAxis.z, zAxis.z, 0,
			0, 0, 0, 1
		);
		return this;
	}
	extractRotation( m ) {
		const te = this.elements;
		const me = m.elements;
		const scaleX = 1 / _v1$1.setFromMatrixColumn( m, 0 ).length();
		const scaleY = 1 / _v1$1.setFromMatrixColumn( m, 1 ).length();
		const scaleZ = 1 / _v1$1.setFromMatrixColumn( m, 2 ).length();
		te[ 0 ] = me[ 0 ] * scaleX;
		te[ 1 ] = me[ 1 ] * scaleX;
		te[ 2 ] = me[ 2 ] * scaleX;
		te[ 3 ] = 0;
		te[ 4 ] = me[ 4 ] * scaleY;
		te[ 5 ] = me[ 5 ] * scaleY;
		te[ 6 ] = me[ 6 ] * scaleY;
		te[ 7 ] = 0;
		te[ 8 ] = me[ 8 ] * scaleZ;
		te[ 9 ] = me[ 9 ] * scaleZ;
		te[ 10 ] = me[ 10 ] * scaleZ;
		te[ 11 ] = 0;
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;
		return this;
	}
	makeRotationFromEuler( euler ) {
		if ( ! ( euler && euler.isEuler ) ) {
			console.error( 'THREE.Matrix4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );
		}
		const te = this.elements;
		const x = euler.x, y = euler.y, z = euler.z;
		const a = Math.cos( x ), b = Math.sin( x );
		const c = Math.cos( y ), d = Math.sin( y );
		const e = Math.cos( z ), f = Math.sin( z );
		if ( euler.order === 'XYZ' ) {
			const ae = a * e, af = a * f, be = b * e, bf = b * f;
			te[ 0 ] = c * e;
			te[ 4 ] = - c * f;
			te[ 8 ] = d;
			te[ 1 ] = af + be * d;
			te[ 5 ] = ae - bf * d;
			te[ 9 ] = - b * c;
			te[ 2 ] = bf - ae * d;
			te[ 6 ] = be + af * d;
			te[ 10 ] = a * c;
		} else if ( euler.order === 'YXZ' ) {
			const ce = c * e, cf = c * f, de = d * e, df = d * f;
			te[ 0 ] = ce + df * b;
			te[ 4 ] = de * b - cf;
			te[ 8 ] = a * d;
			te[ 1 ] = a * f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b;
			te[ 2 ] = cf * b - de;
			te[ 6 ] = df + ce * b;
			te[ 10 ] = a * c;
		} else if ( euler.order === 'ZXY' ) {
			const ce = c * e, cf = c * f, de = d * e, df = d * f;
			te[ 0 ] = ce - df * b;
			te[ 4 ] = - a * f;
			te[ 8 ] = de + cf * b;
			te[ 1 ] = cf + de * b;
			te[ 5 ] = a * e;
			te[ 9 ] = df - ce * b;
			te[ 2 ] = - a * d;
			te[ 6 ] = b;
			te[ 10 ] = a * c;
		} else if ( euler.order === 'ZYX' ) {
			const ae = a * e, af = a * f, be = b * e, bf = b * f;
			te[ 0 ] = c * e;
			te[ 4 ] = be * d - af;
			te[ 8 ] = ae * d + bf;
			te[ 1 ] = c * f;
			te[ 5 ] = bf * d + ae;
			te[ 9 ] = af * d - be;
			te[ 2 ] = - d;
			te[ 6 ] = b * c;
			te[ 10 ] = a * c;
		} else if ( euler.order === 'YZX' ) {
			const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
			te[ 0 ] = c * e;
			te[ 4 ] = bd - ac * f;
			te[ 8 ] = bc * f + ad;
			te[ 1 ] = f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b * e;
			te[ 2 ] = - d * e;
			te[ 6 ] = ad * f + bc;
			te[ 10 ] = ac - bd * f;
		} else if ( euler.order === 'XZY' ) {
			const ac = a * c, ad = a * d, bc = b * c, bd = b * d;
			te[ 0 ] = c * e;
			te[ 4 ] = - f;
			te[ 8 ] = d * e;
			te[ 1 ] = ac * f + bd;
			te[ 5 ] = a * e;
			te[ 9 ] = ad * f - bc;
			te[ 2 ] = bc * f - ad;
			te[ 6 ] = b * e;
			te[ 10 ] = bd * f + ac;
		}
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;
		return this;
	}
	makeRotationFromQuaternion( q ) {
		return this.compose( _zero, q, _one );
	}
	lookAt( eye, target, up ) {
		const te = this.elements;
		_z.subVectors( eye, target );
		if ( _z.lengthSq() === 0 ) {
			_z.z = 1;
		}
		_z.normalize();
		_x.crossVectors( up, _z );
		if ( _x.lengthSq() === 0 ) {
			if ( Math.abs( up.z ) === 1 ) {
				_z.x += 0.0001;
			} else {
				_z.z += 0.0001;
			}
			_z.normalize();
			_x.crossVectors( up, _z );
		}
		_x.normalize();
		_y.crossVectors( _z, _x );
		te[ 0 ] = _x.x; te[ 4 ] = _y.x; te[ 8 ] = _z.x;
		te[ 1 ] = _x.y; te[ 5 ] = _y.y; te[ 9 ] = _z.y;
		te[ 2 ] = _x.z; te[ 6 ] = _y.z; te[ 10 ] = _z.z;
		return this;
	}
	multiply( m, n ) {
		if ( n !== undefined ) {
			console.warn( 'THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
			return this.multiplyMatrices( m, n );
		}
		return this.multiplyMatrices( this, m );
	}
	premultiply( m ) {
		return this.multiplyMatrices( m, this );
	}
	multiplyMatrices( a, b ) {
		const ae = a.elements;
		const be = b.elements;
		const te = this.elements;
		const a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		const a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		const a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		const a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];
		const b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		const b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		const b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		const b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];
		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
		te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
		return this;
	}
	multiplyScalar( s ) {
		const te = this.elements;
		te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
		te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
		te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
		te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;
		return this;
	}
	determinant() {
		const te = this.elements;
		const n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
		const n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
		const n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
		const n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];
		return (
			n41 * (
				+ n14 * n23 * n32
				 - n13 * n24 * n32
				 - n14 * n22 * n33
				 + n12 * n24 * n33
				 + n13 * n22 * n34
				 - n12 * n23 * n34
			) +
			n42 * (
				+ n11 * n23 * n34
				 - n11 * n24 * n33
				 + n14 * n21 * n33
				 - n13 * n21 * n34
				 + n13 * n24 * n31
				 - n14 * n23 * n31
			) +
			n43 * (
				+ n11 * n24 * n32
				 - n11 * n22 * n34
				 - n14 * n21 * n32
				 + n12 * n21 * n34
				 + n14 * n22 * n31
				 - n12 * n24 * n31
			) +
			n44 * (
				- n13 * n22 * n31
				 - n11 * n23 * n32
				 + n11 * n22 * n33
				 + n13 * n21 * n32
				 - n12 * n21 * n33
				 + n12 * n23 * n31
			)
		);
	}
	transpose() {
		const te = this.elements;
		let tmp;
		tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
		tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
		tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;
		tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
		tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
		tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;
		return this;
	}
	setPosition( x, y, z ) {
		const te = this.elements;
		if ( x.isVector3 ) {
			te[ 12 ] = x.x;
			te[ 13 ] = x.y;
			te[ 14 ] = x.z;
		} else {
			te[ 12 ] = x;
			te[ 13 ] = y;
			te[ 14 ] = z;
		}
		return this;
	}
	getInverse( m, throwOnDegenerate ) {
		if ( throwOnDegenerate !== undefined ) {
			console.warn( "THREE.Matrix4: .getInverse() can no longer be configured to throw on degenerate." );
		}
		const te = this.elements,
			me = m.elements,
			n11 = me[ 0 ], n21 = me[ 1 ], n31 = me[ 2 ], n41 = me[ 3 ],
			n12 = me[ 4 ], n22 = me[ 5 ], n32 = me[ 6 ], n42 = me[ 7 ],
			n13 = me[ 8 ], n23 = me[ 9 ], n33 = me[ 10 ], n43 = me[ 11 ],
			n14 = me[ 12 ], n24 = me[ 13 ], n34 = me[ 14 ], n44 = me[ 15 ],
			t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
			t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
			t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
			t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
		const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
		if ( det === 0 ) return this.set( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 );
		const detInv = 1 / det;
		te[ 0 ] = t11 * detInv;
		te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
		te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
		te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;
		te[ 4 ] = t12 * detInv;
		te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
		te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
		te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;
		te[ 8 ] = t13 * detInv;
		te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
		te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
		te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;
		te[ 12 ] = t14 * detInv;
		te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
		te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
		te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;
		return this;
	}
	scale( v ) {
		const te = this.elements;
		const x = v.x, y = v.y, z = v.z;
		te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
		te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
		te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
		te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;
		return this;
	}
	getMaxScaleOnAxis() {
		const te = this.elements;
		const scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
		const scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
		const scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];
		return Math.sqrt( Math.max( scaleXSq, scaleYSq, scaleZSq ) );
	}
	makeTranslation( x, y, z ) {
		this.set(
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1
		);
		return this;
	}
	makeRotationX( theta ) {
		const c = Math.cos( theta ), s = Math.sin( theta );
		this.set(
			1, 0, 0, 0,
			0, c, - s, 0,
			0, s, c, 0,
			0, 0, 0, 1
		);
		return this;
	}
	makeRotationY( theta ) {
		const c = Math.cos( theta ), s = Math.sin( theta );
		this.set(
			 c, 0, s, 0,
			 0, 1, 0, 0,
			- s, 0, c, 0,
			 0, 0, 0, 1
		);
		return this;
	}
	makeRotationZ( theta ) {
		const c = Math.cos( theta ), s = Math.sin( theta );
		this.set(
			c, - s, 0, 0,
			s, c, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);
		return this;
	}
	makeRotationAxis( axis, angle ) {
		const c = Math.cos( angle );
		const s = Math.sin( angle );
		const t = 1 - c;
		const x = axis.x, y = axis.y, z = axis.z;
		const tx = t * x, ty = t * y;
		this.set(
			tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1
		);
		return this;
	}
	makeScale( x, y, z ) {
		this.set(
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
		);
		return this;
	}
	makeShear( x, y, z ) {
		this.set(
			1, y, z, 0,
			x, 1, z, 0,
			x, y, 1, 0,
			0, 0, 0, 1
		);
		return this;
	}
	compose( position, quaternion, scale ) {
		const te = this.elements;
		const x = quaternion._x, y = quaternion._y, z = quaternion._z, w = quaternion._w;
		const x2 = x + x,	y2 = y + y, z2 = z + z;
		const xx = x * x2, xy = x * y2, xz = x * z2;
		const yy = y * y2, yz = y * z2, zz = z * z2;
		const wx = w * x2, wy = w * y2, wz = w * z2;
		const sx = scale.x, sy = scale.y, sz = scale.z;
		te[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
		te[ 1 ] = ( xy + wz ) * sx;
		te[ 2 ] = ( xz - wy ) * sx;
		te[ 3 ] = 0;
		te[ 4 ] = ( xy - wz ) * sy;
		te[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
		te[ 6 ] = ( yz + wx ) * sy;
		te[ 7 ] = 0;
		te[ 8 ] = ( xz + wy ) * sz;
		te[ 9 ] = ( yz - wx ) * sz;
		te[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
		te[ 11 ] = 0;
		te[ 12 ] = position.x;
		te[ 13 ] = position.y;
		te[ 14 ] = position.z;
		te[ 15 ] = 1;
		return this;
	}
	decompose( position, quaternion, scale ) {
		const te = this.elements;
		let sx = _v1$1.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
		const sy = _v1$1.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
		const sz = _v1$1.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();
		const det = this.determinant();
		if ( det < 0 ) sx = - sx;
		position.x = te[ 12 ];
		position.y = te[ 13 ];
		position.z = te[ 14 ];
		_m1$1.copy( this );
		const invSX = 1 / sx;
		const invSY = 1 / sy;
		const invSZ = 1 / sz;
		_m1$1.elements[ 0 ] *= invSX;
		_m1$1.elements[ 1 ] *= invSX;
		_m1$1.elements[ 2 ] *= invSX;
		_m1$1.elements[ 4 ] *= invSY;
		_m1$1.elements[ 5 ] *= invSY;
		_m1$1.elements[ 6 ] *= invSY;
		_m1$1.elements[ 8 ] *= invSZ;
		_m1$1.elements[ 9 ] *= invSZ;
		_m1$1.elements[ 10 ] *= invSZ;
		quaternion.setFromRotationMatrix( _m1$1 );
		scale.x = sx;
		scale.y = sy;
		scale.z = sz;
		return this;
	}
	makePerspective( left, right, top, bottom, near, far ) {
		if ( far === undefined ) {
			console.warn( 'THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.' );
		}
		const te = this.elements;
		const x = 2 * near / ( right - left );
		const y = 2 * near / ( top - bottom );
		const a = ( right + left ) / ( right - left );
		const b = ( top + bottom ) / ( top - bottom );
		const c = - ( far + near ) / ( far - near );
		const d = - 2 * far * near / ( far - near );
		te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
		te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;
		return this;
	}
	makeOrthographic( left, right, top, bottom, near, far ) {
		const te = this.elements;
		const w = 1.0 / ( right - left );
		const h = 1.0 / ( top - bottom );
		const p = 1.0 / ( far - near );
		const x = ( right + left ) * w;
		const y = ( top + bottom ) * h;
		const z = ( far + near ) * p;
		te[ 0 ] = 2 * w;	te[ 4 ] = 0;	te[ 8 ] = 0;	te[ 12 ] = - x;
		te[ 1 ] = 0;	te[ 5 ] = 2 * h;	te[ 9 ] = 0;	te[ 13 ] = - y;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = - 2 * p;	te[ 14 ] = - z;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = 0;	te[ 15 ] = 1;
		return this;
	}
	equals( matrix ) {
		const te = this.elements;
		const me = matrix.elements;
		for ( let i = 0; i < 16; i ++ ) {
			if ( te[ i ] !== me[ i ] ) return false;
		}
		return true;
	}
	fromArray( array, offset ) {
		if ( offset === undefined ) offset = 0;
		for ( let i = 0; i < 16; i ++ ) {
			this.elements[ i ] = array[ i + offset ];
		}
		return this;
	}
	toArray( array, offset ) {
		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;
		const te = this.elements;
		array[ offset ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];
		array[ offset + 3 ] = te[ 3 ];
		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];
		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];
		array[ offset + 8 ] = te[ 8 ];
		array[ offset + 9 ] = te[ 9 ];
		array[ offset + 10 ] = te[ 10 ];
		array[ offset + 11 ] = te[ 11 ];
		array[ offset + 12 ] = te[ 12 ];
		array[ offset + 13 ] = te[ 13 ];
		array[ offset + 14 ] = te[ 14 ];
		array[ offset + 15 ] = te[ 15 ];
		return array;
	}
}
const _v1$1 = new Vector3();
const _m1$1 = new Matrix4();
const _zero = new Vector3( 0, 0, 0 );
const _one = new Vector3( 1, 1, 1 );
const _x = new Vector3();
const _y = new Vector3();
const _z = new Vector3();
function EventDispatcher() {}
Object.assign( EventDispatcher.prototype, {
	addEventListener: function ( type, listener ) {
		if ( this._listeners === undefined ) this._listeners = {};
		const listeners = this._listeners;
		if ( listeners[ type ] === undefined ) {
			listeners[ type ] = [];
		}
		if ( listeners[ type ].indexOf( listener ) === - 1 ) {
			listeners[ type ].push( listener );
		}
	},
	hasEventListener: function ( type, listener ) {
		if ( this._listeners === undefined ) return false;
		const listeners = this._listeners;
		return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;
	},
	removeEventListener: function ( type, listener ) {
		if ( this._listeners === undefined ) return;
		const listeners = this._listeners;
		const listenerArray = listeners[ type ];
		if ( listenerArray !== undefined ) {
			const index = listenerArray.indexOf( listener );
			if ( index !== - 1 ) {
				listenerArray.splice( index, 1 );
			}
		}
	},
	dispatchEvent: function ( event ) {
		if ( this._listeners === undefined ) return;
		const listeners = this._listeners;
		const listenerArray = listeners[ event.type ];
		if ( listenerArray !== undefined ) {
			event.target = this;
			const array = listenerArray.slice( 0 );
			for ( let i = 0, l = array.length; i < l; i ++ ) {
				array[ i ].call( this, event );
			}
		}
	}
} );
class Euler {
	constructor( x = 0, y = 0, z = 0, order = Euler.DefaultOrder ) {
		Object.defineProperty( this, 'isEuler', { value: true } );
		this._x = x;
		this._y = y;
		this._z = z;
		this._order = order;
	}
	get x() {
		return this._x;
	}
	set x( value ) {
		this._x = value;
		this._onChangeCallback();
	}
	get y() {
		return this._y;
	}
	set y( value ) {
		this._y = value;
		this._onChangeCallback();
	}
	get z() {
		return this._z;
	}
	set z( value ) {
		this._z = value;
		this._onChangeCallback();
	}
	get order() {
		return this._order;
	}
	set order( value ) {
		this._order = value;
		this._onChangeCallback();
	}
	set( x, y, z, order ) {
		this._x = x;
		this._y = y;
		this._z = z;
		this._order = order || this._order;
		this._onChangeCallback();
		return this;
	}
	clone() {
		return new this.constructor( this._x, this._y, this._z, this._order );
	}
	copy( euler ) {
		this._x = euler._x;
		this._y = euler._y;
		this._z = euler._z;
		this._order = euler._order;
		this._onChangeCallback();
		return this;
	}
	setFromRotationMatrix( m, order, update ) {
		const clamp = MathUtils.clamp;
		const te = m.elements;
		const m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
		const m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
		const m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];
		order = order || this._order;
		switch ( order ) {
			case 'XYZ':
				this._y = Math.asin( clamp( m13, - 1, 1 ) );
				if ( Math.abs( m13 ) < 0.9999999 ) {
					this._x = Math.atan2( - m23, m33 );
					this._z = Math.atan2( - m12, m11 );
				} else {
					this._x = Math.atan2( m32, m22 );
					this._z = 0;
				}
				break;
			case 'YXZ':
				this._x = Math.asin( - clamp( m23, - 1, 1 ) );
				if ( Math.abs( m23 ) < 0.9999999 ) {
					this._y = Math.atan2( m13, m33 );
					this._z = Math.atan2( m21, m22 );
				} else {
					this._y = Math.atan2( - m31, m11 );
					this._z = 0;
				}
				break;
			case 'ZXY':
				this._x = Math.asin( clamp( m32, - 1, 1 ) );
				if ( Math.abs( m32 ) < 0.9999999 ) {
					this._y = Math.atan2( - m31, m33 );
					this._z = Math.atan2( - m12, m22 );
				} else {
					this._y = 0;
					this._z = Math.atan2( m21, m11 );
				}
				break;
			case 'ZYX':
				this._y = Math.asin( - clamp( m31, - 1, 1 ) );
				if ( Math.abs( m31 ) < 0.9999999 ) {
					this._x = Math.atan2( m32, m33 );
					this._z = Math.atan2( m21, m11 );
				} else {
					this._x = 0;
					this._z = Math.atan2( - m12, m22 );
				}
				break;
			case 'YZX':
				this._z = Math.asin( clamp( m21, - 1, 1 ) );
				if ( Math.abs( m21 ) < 0.9999999 ) {
					this._x = Math.atan2( - m23, m22 );
					this._y = Math.atan2( - m31, m11 );
				} else {
					this._x = 0;
					this._y = Math.atan2( m13, m33 );
				}
				break;
			case 'XZY':
				this._z = Math.asin( - clamp( m12, - 1, 1 ) );
				if ( Math.abs( m12 ) < 0.9999999 ) {
					this._x = Math.atan2( m32, m22 );
					this._y = Math.atan2( m13, m11 );
				} else {
					this._x = Math.atan2( - m23, m33 );
					this._y = 0;
				}
				break;
			default:
				console.warn( 'THREE.Euler: .setFromRotationMatrix() encountered an unknown order: ' + order );
		}
		this._order = order;
		if ( update !== false ) this._onChangeCallback();
		return this;
	}
	setFromQuaternion( q, order, update ) {
		_matrix.makeRotationFromQuaternion( q );
		return this.setFromRotationMatrix( _matrix, order, update );
	}
	setFromVector3( v, order ) {
		return this.set( v.x, v.y, v.z, order || this._order );
	}
	reorder( newOrder ) {
		_quaternion$1.setFromEuler( this );
		return this.setFromQuaternion( _quaternion$1, newOrder );
	}
	equals( euler ) {
		return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );
	}
	fromArray( array ) {
		this._x = array[ 0 ];
		this._y = array[ 1 ];
		this._z = array[ 2 ];
		if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];
		this._onChangeCallback();
		return this;
	}
	toArray( array, offset ) {
		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;
		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._order;
		return array;
	}
	toVector3( optionalResult ) {
		if ( optionalResult ) {
			return optionalResult.set( this._x, this._y, this._z );
		} else {
			return new Vector3( this._x, this._y, this._z );
		}
	}
	_onChange( callback ) {
		this._onChangeCallback = callback;
		return this;
	}
	_onChangeCallback() {}
}
Euler.DefaultOrder = 'XYZ';
Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];
const _matrix = new Matrix4();
const _quaternion$1 = new Quaternion();
class Layers {
	constructor() {
		this.mask = 1 | 0;
	}
	set( channel ) {
		this.mask = 1 << channel | 0;
	}
	enable( channel ) {
		this.mask |= 1 << channel | 0;
	}
	enableAll() {
		this.mask = 0xffffffff | 0;
	}
	toggle( channel ) {
		this.mask ^= 1 << channel | 0;
	}
	disable( channel ) {
		this.mask &= ~ ( 1 << channel | 0 );
	}
	disableAll() {
		this.mask = 0;
	}
	test( layers ) {
		return ( this.mask & layers.mask ) !== 0;
	}
}
class Matrix3 {
	constructor() {
		Object.defineProperty( this, 'isMatrix3', { value: true } );
		this.elements = [
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		];
		if ( arguments.length > 0 ) {
			console.error( 'THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.' );
		}
	}
	set( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {
		const te = this.elements;
		te[ 0 ] = n11; te[ 1 ] = n21; te[ 2 ] = n31;
		te[ 3 ] = n12; te[ 4 ] = n22; te[ 5 ] = n32;
		te[ 6 ] = n13; te[ 7 ] = n23; te[ 8 ] = n33;
		return this;
	}
	identity() {
		this.set(
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		);
		return this;
	}
	clone() {
		return new this.constructor().fromArray( this.elements );
	}
	copy( m ) {
		const te = this.elements;
		const me = m.elements;
		te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ];
		te[ 3 ] = me[ 3 ]; te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ];
		te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ]; te[ 8 ] = me[ 8 ];
		return this;
	}
	extractBasis( xAxis, yAxis, zAxis ) {
		xAxis.setFromMatrix3Column( this, 0 );
		yAxis.setFromMatrix3Column( this, 1 );
		zAxis.setFromMatrix3Column( this, 2 );
		return this;
	}
	setFromMatrix4( m ) {
		const me = m.elements;
		this.set(
			me[ 0 ], me[ 4 ], me[ 8 ],
			me[ 1 ], me[ 5 ], me[ 9 ],
			me[ 2 ], me[ 6 ], me[ 10 ]
		);
		return this;
	}
	multiply( m ) {
		return this.multiplyMatrices( this, m );
	}
	premultiply( m ) {
		return this.multiplyMatrices( m, this );
	}
	multiplyMatrices( a, b ) {
		const ae = a.elements;
		const be = b.elements;
		const te = this.elements;
		const a11 = ae[ 0 ], a12 = ae[ 3 ], a13 = ae[ 6 ];
		const a21 = ae[ 1 ], a22 = ae[ 4 ], a23 = ae[ 7 ];
		const a31 = ae[ 2 ], a32 = ae[ 5 ], a33 = ae[ 8 ];
		const b11 = be[ 0 ], b12 = be[ 3 ], b13 = be[ 6 ];
		const b21 = be[ 1 ], b22 = be[ 4 ], b23 = be[ 7 ];
		const b31 = be[ 2 ], b32 = be[ 5 ], b33 = be[ 8 ];
		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
		te[ 3 ] = a11 * b12 + a12 * b22 + a13 * b32;
		te[ 6 ] = a11 * b13 + a12 * b23 + a13 * b33;
		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
		te[ 4 ] = a21 * b12 + a22 * b22 + a23 * b32;
		te[ 7 ] = a21 * b13 + a22 * b23 + a23 * b33;
		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
		te[ 5 ] = a31 * b12 + a32 * b22 + a33 * b32;
		te[ 8 ] = a31 * b13 + a32 * b23 + a33 * b33;
		return this;
	}
	multiplyScalar( s ) {
		const te = this.elements;
		te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
		te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
		te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;
		return this;
	}
	determinant() {
		const te = this.elements;
		const a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
			d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
			g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];
		return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
	}
	getInverse( matrix, throwOnDegenerate ) {
		if ( throwOnDegenerate !== undefined ) {
			console.warn( "THREE.Matrix3: .getInverse() can no longer be configured to throw on degenerate." );
		}
		const me = matrix.elements,
			te = this.elements,
			n11 = me[ 0 ], n21 = me[ 1 ], n31 = me[ 2 ],
			n12 = me[ 3 ], n22 = me[ 4 ], n32 = me[ 5 ],
			n13 = me[ 6 ], n23 = me[ 7 ], n33 = me[ 8 ],
			t11 = n33 * n22 - n32 * n23,
			t12 = n32 * n13 - n33 * n12,
			t13 = n23 * n12 - n22 * n13,
			det = n11 * t11 + n21 * t12 + n31 * t13;
		if ( det === 0 ) return this.set( 0, 0, 0, 0, 0, 0, 0, 0, 0 );
		const detInv = 1 / det;
		te[ 0 ] = t11 * detInv;
		te[ 1 ] = ( n31 * n23 - n33 * n21 ) * detInv;
		te[ 2 ] = ( n32 * n21 - n31 * n22 ) * detInv;
		te[ 3 ] = t12 * detInv;
		te[ 4 ] = ( n33 * n11 - n31 * n13 ) * detInv;
		te[ 5 ] = ( n31 * n12 - n32 * n11 ) * detInv;
		te[ 6 ] = t13 * detInv;
		te[ 7 ] = ( n21 * n13 - n23 * n11 ) * detInv;
		te[ 8 ] = ( n22 * n11 - n21 * n12 ) * detInv;
		return this;
	}
	transpose() {
		let tmp;
		const m = this.elements;
		tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
		tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
		tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;
		return this;
	}
	getNormalMatrix( matrix4 ) {
		return this.setFromMatrix4( matrix4 ).getInverse( this ).transpose();
	}
	transposeIntoArray( r ) {
		const m = this.elements;
		r[ 0 ] = m[ 0 ];
		r[ 1 ] = m[ 3 ];
		r[ 2 ] = m[ 6 ];
		r[ 3 ] = m[ 1 ];
		r[ 4 ] = m[ 4 ];
		r[ 5 ] = m[ 7 ];
		r[ 6 ] = m[ 2 ];
		r[ 7 ] = m[ 5 ];
		r[ 8 ] = m[ 8 ];
		return this;
	}
	setUvTransform( tx, ty, sx, sy, rotation, cx, cy ) {
		const c = Math.cos( rotation );
		const s = Math.sin( rotation );
		this.set(
			sx * c, sx * s, - sx * ( c * cx + s * cy ) + cx + tx,
			- sy * s, sy * c, - sy * ( - s * cx + c * cy ) + cy + ty,
			0, 0, 1
		);
	}
	scale( sx, sy ) {
		const te = this.elements;
		te[ 0 ] *= sx; te[ 3 ] *= sx; te[ 6 ] *= sx;
		te[ 1 ] *= sy; te[ 4 ] *= sy; te[ 7 ] *= sy;
		return this;
	}
	rotate( theta ) {
		const c = Math.cos( theta );
		const s = Math.sin( theta );
		const te = this.elements;
		const a11 = te[ 0 ], a12 = te[ 3 ], a13 = te[ 6 ];
		const a21 = te[ 1 ], a22 = te[ 4 ], a23 = te[ 7 ];
		te[ 0 ] = c * a11 + s * a21;
		te[ 3 ] = c * a12 + s * a22;
		te[ 6 ] = c * a13 + s * a23;
		te[ 1 ] = - s * a11 + c * a21;
		te[ 4 ] = - s * a12 + c * a22;
		te[ 7 ] = - s * a13 + c * a23;
		return this;
	}
	translate( tx, ty ) {
		const te = this.elements;
		te[ 0 ] += tx * te[ 2 ]; te[ 3 ] += tx * te[ 5 ]; te[ 6 ] += tx * te[ 8 ];
		te[ 1 ] += ty * te[ 2 ]; te[ 4 ] += ty * te[ 5 ]; te[ 7 ] += ty * te[ 8 ];
		return this;
	}
	equals( matrix ) {
		const te = this.elements;
		const me = matrix.elements;
		for ( let i = 0; i < 9; i ++ ) {
			if ( te[ i ] !== me[ i ] ) return false;
		}
		return true;
	}
	fromArray( array, offset ) {
		if ( offset === undefined ) offset = 0;
		for ( let i = 0; i < 9; i ++ ) {
			this.elements[ i ] = array[ i + offset ];
		}
		return this;
	}
	toArray( array, offset ) {
		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;
		const te = this.elements;
		array[ offset ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];
		array[ offset + 3 ] = te[ 3 ];
		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];
		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];
		array[ offset + 8 ] = te[ 8 ];
		return array;
	}
}
let _object3DId = 0;
const _v1 = new Vector3();
const _q1 = new Quaternion();
const _m1 = new Matrix4();
const _target = new Vector3();
const _position = new Vector3();
const _scale = new Vector3();
const _quaternion = new Quaternion();
const _xAxis = new Vector3( 1, 0, 0 );
const _yAxis = new Vector3( 0, 1, 0 );
const _zAxis = new Vector3( 0, 0, 1 );
const _addedEvent = { type: 'added' };
const _removedEvent = { type: 'removed' };
function Object3D() {
	Object.defineProperty( this, 'id', { value: _object3DId ++ } );
	this.uuid = MathUtils.generateUUID();
	this.name = '';
	this.type = 'Object3D';
	this.parent = null;
	this.children = [];
	this.up = Object3D.DefaultUp.clone();
	const position = new Vector3();
	const rotation = new Euler();
	const quaternion = new Quaternion();
	const scale = new Vector3( 1, 1, 1 );
	function onRotationChange() {
		quaternion.setFromEuler( rotation, false );
	}
	function onQuaternionChange() {
		rotation.setFromQuaternion( quaternion, undefined, false );
	}
	rotation._onChange( onRotationChange );
	quaternion._onChange( onQuaternionChange );
	Object.defineProperties( this, {
		position: {
			configurable: true,
			enumerable: true,
			value: position
		},
		rotation: {
			configurable: true,
			enumerable: true,
			value: rotation
		},
		quaternion: {
			configurable: true,
			enumerable: true,
			value: quaternion
		},
		scale: {
			configurable: true,
			enumerable: true,
			value: scale
		},
		modelViewMatrix: {
			value: new Matrix4()
		},
		normalMatrix: {
			value: new Matrix3()
		}
	} );
	this.matrix = new Matrix4();
	this.matrixWorld = new Matrix4();
	this.matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate;
	this.matrixWorldNeedsUpdate = false;
	this.layers = new Layers();
	this.visible = true;
	this.castShadow = false;
	this.receiveShadow = false;
	this.frustumCulled = true;
	this.renderOrder = 0;
	this.userData = {};
}
Object3D.DefaultUp = new Vector3( 0, 1, 0 );
Object3D.DefaultMatrixAutoUpdate = true;
Object3D.prototype = Object.assign( Object.create( EventDispatcher.prototype ), {
	constructor: Object3D,
	isObject3D: true,
	onBeforeRender: function () {},
	onAfterRender: function () {},
	applyMatrix4: function ( matrix ) {
		if ( this.matrixAutoUpdate ) this.updateMatrix();
		this.matrix.premultiply( matrix );
		this.matrix.decompose( this.position, this.quaternion, this.scale );
	},
	applyQuaternion: function ( q ) {
		this.quaternion.premultiply( q );
		return this;
	},
	setRotationFromAxisAngle: function ( axis, angle ) {
		this.quaternion.setFromAxisAngle( axis, angle );
	},
	setRotationFromEuler: function ( euler ) {
		this.quaternion.setFromEuler( euler, true );
	},
	setRotationFromMatrix: function ( m ) {
		this.quaternion.setFromRotationMatrix( m );
	},
	setRotationFromQuaternion: function ( q ) {
		this.quaternion.copy( q );
	},
	rotateOnAxis: function ( axis, angle ) {
		_q1.setFromAxisAngle( axis, angle );
		this.quaternion.multiply( _q1 );
		return this;
	},
	rotateOnWorldAxis: function ( axis, angle ) {
		_q1.setFromAxisAngle( axis, angle );
		this.quaternion.premultiply( _q1 );
		return this;
	},
	rotateX: function ( angle ) {
		return this.rotateOnAxis( _xAxis, angle );
	},
	rotateY: function ( angle ) {
		return this.rotateOnAxis( _yAxis, angle );
	},
	rotateZ: function ( angle ) {
		return this.rotateOnAxis( _zAxis, angle );
	},
	translateOnAxis: function ( axis, distance ) {
		_v1.copy( axis ).applyQuaternion( this.quaternion );
		this.position.add( _v1.multiplyScalar( distance ) );
		return this;
	},
	translateX: function ( distance ) {
		return this.translateOnAxis( _xAxis, distance );
	},
	translateY: function ( distance ) {
		return this.translateOnAxis( _yAxis, distance );
	},
	translateZ: function ( distance ) {
		return this.translateOnAxis( _zAxis, distance );
	},
	localToWorld: function ( vector ) {
		return vector.applyMatrix4( this.matrixWorld );
	},
	worldToLocal: function ( vector ) {
		return vector.applyMatrix4( _m1.getInverse( this.matrixWorld ) );
	},
	lookAt: function ( x, y, z ) {
		if ( x.isVector3 ) {
			_target.copy( x );
		} else {
			_target.set( x, y, z );
		}
		const parent = this.parent;
		this.updateWorldMatrix( true, false );
		_position.setFromMatrixPosition( this.matrixWorld );
		if ( this.isCamera || this.isLight ) {
			_m1.lookAt( _position, _target, this.up );
		} else {
			_m1.lookAt( _target, _position, this.up );
		}
		this.quaternion.setFromRotationMatrix( _m1 );
		if ( parent ) {
			_m1.extractRotation( parent.matrixWorld );
			_q1.setFromRotationMatrix( _m1 );
			this.quaternion.premultiply( _q1.inverse() );
		}
	},
	add: function ( object ) {
		if ( arguments.length > 1 ) {
			for ( let i = 0; i < arguments.length; i ++ ) {
				this.add( arguments[ i ] );
			}
			return this;
		}
		if ( object === this ) {
			console.error( "THREE.Object3D.add: object can't be added as a child of itself.", object );
			return this;
		}
		if ( ( object && object.isObject3D ) ) {
			if ( object.parent !== null ) {
				object.parent.remove( object );
			}
			object.parent = this;
			this.children.push( object );
			object.dispatchEvent( _addedEvent );
		} else {
			console.error( "THREE.Object3D.add: object not an instance of THREE.Object3D.", object );
		}
		return this;
	},
	remove: function ( object ) {
		if ( arguments.length > 1 ) {
			for ( let i = 0; i < arguments.length; i ++ ) {
				this.remove( arguments[ i ] );
			}
			return this;
		}
		const index = this.children.indexOf( object );
		if ( index !== - 1 ) {
			object.parent = null;
			this.children.splice( index, 1 );
			object.dispatchEvent( _removedEvent );
		}
		return this;
	},
	attach: function ( object ) {
		this.updateWorldMatrix( true, false );
		_m1.getInverse( this.matrixWorld );
		if ( object.parent !== null ) {
			object.parent.updateWorldMatrix( true, false );
			_m1.multiply( object.parent.matrixWorld );
		}
		object.applyMatrix4( _m1 );
		object.updateWorldMatrix( false, false );
		this.add( object );
		return this;
	},
	getObjectById: function ( id ) {
		return this.getObjectByProperty( 'id', id );
	},
	getObjectByName: function ( name ) {
		return this.getObjectByProperty( 'name', name );
	},
	getObjectByProperty: function ( name, value ) {
		if ( this[ name ] === value ) return this;
		for ( let i = 0, l = this.children.length; i < l; i ++ ) {
			const child = this.children[ i ];
			const object = child.getObjectByProperty( name, value );
			if ( object !== undefined ) {
				return object;
			}
		}
		return undefined;
	},
	getWorldPosition: function ( target ) {
		if ( target === undefined ) {
			console.warn( 'THREE.Object3D: .getWorldPosition() target is now required' );
			target = new Vector3();
		}
		this.updateMatrixWorld( true );
		return target.setFromMatrixPosition( this.matrixWorld );
	},
	getWorldQuaternion: function ( target ) {
		if ( target === undefined ) {
			console.warn( 'THREE.Object3D: .getWorldQuaternion() target is now required' );
			target = new Quaternion();
		}
		this.updateMatrixWorld( true );
		this.matrixWorld.decompose( _position, target, _scale );
		return target;
	},
	getWorldScale: function ( target ) {
		if ( target === undefined ) {
			console.warn( 'THREE.Object3D: .getWorldScale() target is now required' );
			target = new Vector3();
		}
		this.updateMatrixWorld( true );
		this.matrixWorld.decompose( _position, _quaternion, target );
		return target;
	},
	getWorldDirection: function ( target ) {
		if ( target === undefined ) {
			console.warn( 'THREE.Object3D: .getWorldDirection() target is now required' );
			target = new Vector3();
		}
		this.updateMatrixWorld( true );
		const e = this.matrixWorld.elements;
		return target.set( e[ 8 ], e[ 9 ], e[ 10 ] ).normalize();
	},
	raycast: function () {},
	traverse: function ( callback ) {
		callback( this );
		const children = this.children;
		for ( let i = 0, l = children.length; i < l; i ++ ) {
			children[ i ].traverse( callback );
		}
	},
	traverseVisible: function ( callback ) {
		if ( this.visible === false ) return;
		callback( this );
		const children = this.children;
		for ( let i = 0, l = children.length; i < l; i ++ ) {
			children[ i ].traverseVisible( callback );
		}
	},
	traverseAncestors: function ( callback ) {
		const parent = this.parent;
		if ( parent !== null ) {
			callback( parent );
			parent.traverseAncestors( callback );
		}
	},
	updateMatrix: function () {
		this.matrix.compose( this.position, this.quaternion, this.scale );
		this.matrixWorldNeedsUpdate = true;
	},
	updateMatrixWorld: function ( force ) {
		if ( this.matrixAutoUpdate ) this.updateMatrix();
		if ( this.matrixWorldNeedsUpdate || force ) {
			if ( this.parent === null ) {
				this.matrixWorld.copy( this.matrix );
			} else {
				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );
			}
			this.matrixWorldNeedsUpdate = false;
			force = true;
		}
		const children = this.children;
		for ( let i = 0, l = children.length; i < l; i ++ ) {
			children[ i ].updateMatrixWorld( force );
		}
	},
	updateWorldMatrix: function ( updateParents, updateChildren ) {
		const parent = this.parent;
		if ( updateParents === true && parent !== null ) {
			parent.updateWorldMatrix( true, false );
		}
		if ( this.matrixAutoUpdate ) this.updateMatrix();
		if ( this.parent === null ) {
			this.matrixWorld.copy( this.matrix );
		} else {
			this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );
		}
		if ( updateChildren === true ) {
			const children = this.children;
			for ( let i = 0, l = children.length; i < l; i ++ ) {
				children[ i ].updateWorldMatrix( false, true );
			}
		}
	},
	toJSON: function ( meta ) {
		const isRootObject = ( meta === undefined || typeof meta === 'string' );
		const output = {};
		if ( isRootObject ) {
			meta = {
				geometries: {},
				materials: {},
				textures: {},
				images: {},
				shapes: {}
			};
			output.metadata = {
				version: 4.5,
				type: 'Object',
				generator: 'Object3D.toJSON'
			};
		}
		const object = {};
		object.uuid = this.uuid;
		object.type = this.type;
		if ( this.name !== '' ) object.name = this.name;
		if ( this.castShadow === true ) object.castShadow = true;
		if ( this.receiveShadow === true ) object.receiveShadow = true;
		if ( this.visible === false ) object.visible = false;
		if ( this.frustumCulled === false ) object.frustumCulled = false;
		if ( this.renderOrder !== 0 ) object.renderOrder = this.renderOrder;
		if ( JSON.stringify( this.userData ) !== '{}' ) object.userData = this.userData;
		object.layers = this.layers.mask;
		object.matrix = this.matrix.toArray();
		if ( this.matrixAutoUpdate === false ) object.matrixAutoUpdate = false;
		if ( this.isInstancedMesh ) {
			object.type = 'InstancedMesh';
			object.count = this.count;
			object.instanceMatrix = this.instanceMatrix.toJSON();
		}
		function serialize( library, element ) {
			if ( library[ element.uuid ] === undefined ) {
				library[ element.uuid ] = element.toJSON( meta );
			}
			return element.uuid;
		}
		if ( this.isMesh || this.isLine || this.isPoints ) {
			object.geometry = serialize( meta.geometries, this.geometry );
			const parameters = this.geometry.parameters;
			if ( parameters !== undefined && parameters.shapes !== undefined ) {
				const shapes = parameters.shapes;
				if ( Array.isArray( shapes ) ) {
					for ( let i = 0, l = shapes.length; i < l; i ++ ) {
						const shape = shapes[ i ];
						serialize( meta.shapes, shape );
					}
				} else {
					serialize( meta.shapes, shapes );
				}
			}
		}
		if ( this.material !== undefined ) {
			if ( Array.isArray( this.material ) ) {
				const uuids = [];
				for ( let i = 0, l = this.material.length; i < l; i ++ ) {
					uuids.push( serialize( meta.materials, this.material[ i ] ) );
				}
				object.material = uuids;
			} else {
				object.material = serialize( meta.materials, this.material );
			}
		}
		if ( this.children.length > 0 ) {
			object.children = [];
			for ( let i = 0; i < this.children.length; i ++ ) {
				object.children.push( this.children[ i ].toJSON( meta ).object );
			}
		}
		if ( isRootObject ) {
			const geometries = extractFromCache( meta.geometries );
			const materials = extractFromCache( meta.materials );
			const textures = extractFromCache( meta.textures );
			const images = extractFromCache( meta.images );
			const shapes = extractFromCache( meta.shapes );
			if ( geometries.length > 0 ) output.geometries = geometries;
			if ( materials.length > 0 ) output.materials = materials;
			if ( textures.length > 0 ) output.textures = textures;
			if ( images.length > 0 ) output.images = images;
			if ( shapes.length > 0 ) output.shapes = shapes;
		}
		output.object = object;
		return output;
		function extractFromCache( cache ) {
			const values = [];
			for ( const key in cache ) {
				const data = cache[ key ];
				delete data.metadata;
				values.push( data );
			}
			return values;
		}
	},
	clone: function ( recursive ) {
		return new this.constructor().copy( this, recursive );
	},
	copy: function ( source, recursive ) {
		if ( recursive === undefined ) recursive = true;
		this.name = source.name;
		this.up.copy( source.up );
		this.position.copy( source.position );
		this.rotation.order = source.rotation.order;
		this.quaternion.copy( source.quaternion );
		this.scale.copy( source.scale );
		this.matrix.copy( source.matrix );
		this.matrixWorld.copy( source.matrixWorld );
		this.matrixAutoUpdate = source.matrixAutoUpdate;
		this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;
		this.layers.mask = source.layers.mask;
		this.visible = source.visible;
		this.castShadow = source.castShadow;
		this.receiveShadow = source.receiveShadow;
		this.frustumCulled = source.frustumCulled;
		this.renderOrder = source.renderOrder;
		this.userData = JSON.parse( JSON.stringify( source.userData ) );
		if ( recursive === true ) {
			for ( let i = 0; i < source.children.length; i ++ ) {
				const child = source.children[ i ];
				this.add( child.clone() );
			}
		}
		return this;
	}
} );

const { checkArg, checkArgs } = util;
class Turtle3D extends Turtle {
    static defaultVariables() {
        return {
            atEdge: 'wrap',
            hidden: false,
        }
    }
    constructor() {
        super();
        Object.assign(this, Turtle3D.defaultVariables());
    }
    agentConstructor() {
        this.obj3d = new Object3D();
        this.obj3d.rotation.order = 'ZYX';
        this.reset();
    }
    reset() {
        this.obj3d.position.set(0, 0, 0);
        this.obj3d.rotation.set(0, 0, 0);
        this.heading = 0;
    }
    setxyz(x, y, z) {
        checkArgs(arguments);
        super.setxy(x, y, z);
    }
    getxyz() {
        return this.obj3d.position.toArray()
    }
    setRotation(x, y, z) {
        checkArgs(arguments);
        this.obj3d.rotation.set(x, y, z);
    }
    getRotation() {
        const { x, y, z } = this.obj3d.rotation;
        return [x, y, z]
    }
    getThetaPhiPsi() {
        return this.getRotation().reverse()
    }
    getHeadingPitchRoll() {
        const [psi, phi, theta] = this.getRotation();
        const heading = radToHeading(theta);
        const pitch = radToDeg(-phi);
        const roll = radToDeg(psi);
        return [heading, pitch, roll]
    }
    getDxDyDz() {
        return [this.dx, this.dy, this.dz]
    }
    get x() {
        return this.obj3d.position.x
    }
    set x(d) {
        checkArg(d);
        this.obj3d.position.x = d;
    }
    get y() {
        return this.obj3d.position.y
    }
    set y(d) {
        checkArg(d);
        this.obj3d.position.y = d;
    }
    get z() {
        return this.obj3d.position.z
    }
    set z(d) {
        checkArg(d);
        this.obj3d.position.z = d;
    }
    get theta() {
        return this.obj3d.rotation.z
    }
    set theta(rad) {
        checkArg(rad);
        if (this.obj3d) this.obj3d.rotation.z = rad;
    }
    get heading() {
        return this.model.fromRads(this.obj3d.rotation.z)
    }
    set heading(angle) {
        checkArg(angle);
        this.obj3d.rotation.z = this.model.toRads(angle);
    }
    get pitch() {
        return -this.model.fromAngleRads(this.obj3d.rotation.y)
    }
    set pitch(angle) {
        checkArg(angle);
        this.obj3d.rotation.y = -this.model.toAngleRads(angle);
    }
    get roll() {
        return this.model.fromAngleRads(this.obj3d.rotation.x)
    }
    set roll(angle) {
        checkArg(angle);
        this.obj3d.rotation.x = this.model.toAngleRads(angle);
    }
    forward(d) {
        checkArg(d);
        const p0 = this.patch;
        this.obj3d.translateX(d);
        super.checkXYZ(p0);
    }
    right(angle) {
        this.left(-angle);
    }
    left(angle) {
        checkArg(angle);
        this.obj3d.rotateZ(this.model.toAngleRads(angle));
    }
    tiltUp(angle) {
        this.tiltDown(-angle);
    }
    tiltDown(angle) {
        checkArg(angle);
        this.obj3d.rotateY(this.model.toAngleRads(angle));
    }
    rollRight(angle) {
        checkArg(angle);
        this.obj3d.rotateX(this.model.toAngleRads(angle));
    }
    rollLeft(angle) {
        this.rollRight(-angle);
    }
    facexyz(x1, y1, z1) {
        checkArgs(arguments);
        const headingTowards = this.towardsXY(x1, y1);
        const pitchTowards = this.towardsPitchXYZ(x1, y1, z1);
        this.heading = headingTowards;
        this.pitch = pitchTowards;
    }
    face(agent) {
        checkArg(agent, 'object');
        const { x, y, z } = agent;
        this.facexyz(x, y, z);
    }
    towardsPitchXYZ(x1, y1, z1) {
        checkArgs(arguments);
        const [x, y, z] = this.getxyz();
        const [dx, dy, dz] = [x1 - x, y1 - y, z1 - z];
        const xyhypot = Math.hypot(dx, dy);
        const pitchRads = Math.atan2(dz, xyhypot);
        return this.model.fromAngleRads(pitchRads)
    }
    towardsPitch(agent) {
        checkArg(agent, 'object');
        const { x, y, z } = agent;
        this.towardsPitchXYZ(x, y, z);
    }
    distance(agent) {
        checkArg(agent, 'object');
        const { x, y, z } = agent;
        return this.distanceXYZ(x, y, z)
    }
    distanceXYZ(x1, y1, z1) {
        checkArgs(arguments);
        const { x, y, z } = this;
        return distance3(x, y, z, x1, y1, z1)
    }
    get dx() {
        const { y: pitch, z: heading } = this.obj3d.rotation;
        return Math.cos(pitch) * Math.cos(heading)
    }
    get dy() {
        const { y: pitch, z: heading } = this.obj3d.rotation;
        return Math.cos(pitch) * Math.sin(heading)
    }
    get dz() {
        const pitch = this.obj3d.rotation.y;
        return Math.sin(pitch)
    }
}

class Model3D extends Model {
    initAgentSet(name, AgentsetClass, AgentClass) {
        if (name === 'turtles') AgentClass = Turtle3D;
        super.initAgentSet(name, AgentsetClass, AgentClass);
    }
}

const Color = {
    rgbaCssColor(r, g, b, a = 255) {
        a = a / 255;
        const a2 = a.toPrecision(2);
        return a === 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a2})`
    },
    hslCssColor(h, s = 100, l = 50, a = 255) {
        a = a / 255;
        const a4 = a.toPrecision(4);
        return a === 1
            ? `hsl(${h},${s}%,${l}%)`
            : `hsla(${h},${s}%,${l}%,${a4})`
    },
    hexCssColor(r, g, b) {
        return `#${(0x1000000 | (b | (g << 8) | (r << 16)))
            .toString(16)
            .slice(-6)}`
    },
    cssColor(r, g, b, a = 255) {
        return a === 255
            ? this.hexCssColor(r, g, b)
            : this.rgbaCssColor(r, g, b, a)
    },
    randomCssColor() {
        const r255 = () => randomInt(256);
        return this.cssColor(r255(), r255(), r255())
    },
    randomGrayCssColor(min = 0, max = 255) {
        const gray = randomInt2(min, max);
        return this.cssColor(gray, gray, gray)
    },
    cssToPixel(string) {
        const rgba = this.cssToUint8Array(string);
        return this.rgbaToPixel(...rgba)
    },
    rgbaToPixel(r, g, b, a = 255) {
        const rgba = new Uint8Array([r, g, b, a]);
        const pixels = new Uint32Array(rgba.buffer);
        return pixels[0]
    },
    randomPixel() {
        const r255 = () => randomInt(256);
        return this.rgbaToPixel(r255(), r255(), r255())
    },
    randomGrayPixel(min = 0, max = 255) {
        const gray = randomInt2(min, max);
        return this.rgbaToPixel(gray, gray, gray)
    },
    sharedCtx1x1: createCtx(1, 1, false, { willReadFrequently: true }),
    cssToUint8Array(string) {
        this.sharedCtx1x1.clearRect(0, 0, 1, 1);
        this.sharedCtx1x1.fillStyle = string;
        this.sharedCtx1x1.fillRect(0, 0, 1, 1);
        return this.sharedCtx1x1.getImageData(0, 0, 1, 1).data
    },
    typedColor(r, g, b, a = 255) {
        if (g === undefined) return this.toTypedColor(r)
        const u8array = new Uint8ClampedArray([r, g, b, a]);
        u8array.pixelArray = new Uint32Array(u8array.buffer);
        Object.setPrototypeOf(u8array, TypedColorProto);
        return u8array
    },
    isTypedColor(any) {
        return any && any.constructor === Uint8ClampedArray && any.pixelArray
    },
    toTypedColor(value, colorType) {
        if (this.isTypedColor(value)) return value
        const tc = this.typedColor(0, 0, 0, 0);
        if (colorType == null) {
            if (isString(value)) tc.css = value;
            else if (isNumber$1(value)) tc.pixel = value;
            else if (isArray(value)) tc.rgb = value;
            else if (isTypedArray(value)) tc.rgb = value;
            else throw Error(`toTypedColor: illegal value ${value}`)
        } else {
            tc[colorType] = value;
        }
        return tc
    },
    randomTypedColor() {
        const r255 = () => randomInt(256);
        return this.typedColor(r255(), r255(), r255())
    },
    randomGrayTypedColor(min = 0, max = 255) {
        const gray = randomInt2(min, max);
        return this.typedColor(gray, gray, gray)
    },
    randomColorArray(length) {
        const colors = new Array(length);
        forLoop(colors, (c, i) => (colors[i] = this.randomTypedColor()));
        return colors
    },
    randomGrayArray(length, min = 0, max = 255) {
        const grays = new Array(length);
        forLoop(
            grays,
            (g, i) => (grays[i] = this.randomGrayTypedColor(min, max))
        );
        return grays
    },
};
const TypedColorProto = {
    __proto__: Uint8ClampedArray.prototype,
    setColor(r, g, b, a = 255) {
        this.checkColorChange();
        this[0] = r;
        this[1] = g;
        this[2] = b;
        this[3] = a;
    },
    set rgb(rgbaArray) {
        this.setColor(...rgbaArray);
    },
    get rgb() {
        return this
    },
    setAlpha(alpha) {
        this.checkColorChange();
        this[3] = alpha;
    },
    getAlpha() {
        return this[3]
    },
    get alpha() {
        return this.getAlpha()
    },
    set alpha(alpha) {
        this.setAlpha(alpha);
    },
    setPixel(pixel) {
        this.checkColorChange();
        this.pixelArray[0] = pixel;
    },
    getPixel() {
        return this.pixelArray[0]
    },
    get pixel() {
        return this.getPixel()
    },
    set pixel(pixel) {
        this.setPixel(pixel);
    },
    setCss(string) {
        return this.setColor(...Color.cssToUint8Array(string))
    },
    getCss() {
        if (this.string == null) this.string = Color.cssColor(...this);
        return this.string
    },
    get css() {
        return this.getCss()
    },
    set css(string) {
        this.setCss(string);
    },
    setWebgl(array) {
        if (array.length !== 3)
            throw Error(
                'setWebgl array length must be 3, length:',
                array.length
            )
        this.setColor(
            array[0] * 255,
            array[1] * 255,
            array[2] * 255
        );
    },
    getWebgl() {
        return [this[0] / 255, this[1] / 255, this[2] / 255]
    },
    get webgl() {
        return this.getWebgl()
    },
    set webgl(array) {
        this.setWebgl(array);
    },
    checkColorChange() {
        this.string = null;
    },
    equals(color) {
        return this.getPixel() === color.getPixel()
    },
    toString() {
        return `[${Array.from(this).toString()}]`
    },
    rgbDistance(r, g, b) {
        const [r1, g1, b1] = this;
        const rMean = Math.round((r1 + r) / 2);
        const [dr, dg, db] = [r1 - r, g1 - g, b1 - b];
        const [dr2, dg2, db2] = [dr * dr, dg * dg, db * db];
        const distanceSq =
            (((512 + rMean) * dr2) >> 8) +
            4 * dg2 +
            (((767 - rMean) * db2) >> 8);
        return distanceSq
    },
};

function getPixel(color) {
    if (typeof color === 'number') return color
    if (color.pixel) return color.pixel
    if (color === 'transparent') return 0
    return Color.toTypedColor(color).pixel
}
class PatchesView {
    constructor(width, height) {
        this.ctx = createCtx(width, height);
        this.resetImageData();
        this.useImageSmoothing = false;
    }
    resetImageData() {
        this.imageData = ctxImageData(this.ctx);
        this.pixels = new Uint32Array(this.imageData.data.buffer);
    }
    setPatchesSmoothing(smoothting) {
        this.useImageSmoothing = smoothting;
    }
    setPixels(data, pixelFcn = d => d) {
        if (isOofA(data)) data = toAofO(data);
        if (data.length !== this.pixels.length) {
            throw Error(
                'setPixels, data.length != pixels.length ' +
                    data.length +
                    ' ' +
                    this.pixels.length
            )
        }
        forLoop(data, (d, i) => {
            this.pixels[i] = getPixel(pixelFcn(d));
        });
    }
    createPixels(pixelFcn) {
        repeat(this.pixels.length, i => {
            this.pixels[i] = getPixel(pixelFcn(i));
        });
    }
    setPixel(index, pixel) {
        this.pixels[index] = getPixel(pixel);
    }
    draw(ctx) {
        const smoothing = this.ctx.imageSmoothingEnabled;
        ctx.imageSmoothingEnabled = this.useImageSmoothing;
        this.ctx.putImageData(this.imageData, 0, 0);
        fillCtxWithImage(ctx, this.ctx.canvas);
        ctx.imageSmoothingEnabled = smoothing;
    }
    clear(color) {
        color = color.css || color;
        if (!color || typeof color === 'string') {
            clearCtx(this.ctx, color);
        } else if (typeof color === 'number') {
            this.createPixels(() => color);
        } else {
            throw Error('patchesView.clear(): illegal color ' + color)
        }
        if (typeof color === 'number') {
            this.updateCanvas();
        } else {
            this.resetImageData();
        }
    }
    getImageBitmap(options = {}) {
        return createImageBitmap(this.imageData, options)
    }
    drawImageBitmap(ctx, options = {}) {
        createImageBitmap(this.imageData, options).then(img =>
            fillCtxWithImage(ctx, img)
        );
    }
    updateCanvas() {
        this.ctx.putImageData(this.imageData, 0, 0);
        return this.ctx.canvas
    }
}

class RGBDataSet extends DataSet {
    static rgbToInt24(r, g, b) {
        return r * 256 * 256 + g * 256 + b
    }
    static rgbScaleFunction(min, scale) {
        return (r, g, b) => min + rgbToInt24(r, g, b) * scale
    }
    constructor(
        img,
        rgbToData = RGBDataSet.rgbToInt24,
        ArrayType = Float32Array
    ) {
        const { width, height } = img;
        super(width, height, new ArrayType(width * height));
        const ctx = imageToCtx(img);
        const imgData = ctxImageData(ctx);
        const convertedData = this.data;
        for (var i = 0; i < convertedData.length; i++) {
            const r = imgData.data[4 * i];
            const g = imgData.data[4 * i + 1];
            const b = imgData.data[4 * i + 2];
            convertedData[i] = rgbToData(r, g, b);
        }
    }
}

class RGBADataSet extends DataSet {
    constructor(img, Type = Float32Array, options = {}) {
        const bytes = imageToBytes(img);
        const data = new Type(bytes.buffer);
        const dataPerPixel = (4 * data.length) / bytes.length;
        const width = dataPerPixel * img.width;
        const height = img.height;
        super(width, height, data);
        Object.assign(this, options);
        this.src = img.src;
    }
}
let imageToBytesCtx = null;
function imageToBytes(img, flipY = false, imgFormat = 'RGBA') {
    if (!imageToBytesCtx) {
        const can = createCanvas(0, 0);
        imageToBytesCtx = can.getContext('webgl', {
            premultipliedAlpha: false,
        });
    }
    const { width, height } = img;
    const gl = imageToBytesCtx;
    Object.assign(gl.canvas, { width, height });
    const fmt = gl[imgFormat];
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if (flipY) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    }
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, fmt, fmt, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
    );
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
        throw Error(`imageToBytes: status not FRAMEBUFFER_COMPLETE: ${status}`)
    }
    const pixSize = imgFormat === 'RGB' ? 3 : 4;
    const pixels = new Uint8Array(pixSize * width * height);
    gl.readPixels(0, 0, width, height, fmt, gl.UNSIGNED_BYTE, pixels);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return pixels
}

var RGBADataSet$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    imageToBytes: imageToBytes,
    default: RGBADataSet
});

class GeoDataSet extends DataSet {
    constructor(width, height, bbox, data) {
        super(width, height, data);
        this.bbox = bbox;
    }
    static viewFromDataSet(dataSet, bbox) {
        return new GeoDataSet(dataSet.width, dataSet.height, bbox, dataSet.data)
    }
    lat2y(lat) {
        const [west, south, east, north] = this.bbox;
        const y = Math.round(this.height * (lat - south) / (north - south));
        return y
    }
    lon2x(lng) {
        const [west, south, east, north] = this.bbox;
        const x = Math.round(this.width * (lng - west) / (east - west));
        return x
    }
    toPixel(geoX, geoY) {
        return [this.lon2x(geoX), this.lat2y(geoY)]
    }
    getGeo(geoX, geoY) {
        const [x, y] = this.toPixel(geoX, geoY);
        return this.getXY(x, y)
    }
    setGeo(geoX, geoY, value) {
        const [x, y] = this.toPixel(geoX, geoY);
        return this.setXY(x, y, value)
    }
    sampleGeo(geoX, geoY, useNearest = true) {
        const [x, y] = this.toPixel(geoX, geoY);
        return this.sample(x, y, useNearest)
    }
    dzdx() {
        const [widthMeters, heightMeters] = bboxMetricSize(this.bbox);
        const pixelScale = widthMeters / this.width;
        const dzdx = super.dzdx(2, (1 / 8) * (1 / pixelScale));
        const dzdx2 = GeoDataSet.viewFromDataSet(dzdx, this.bbox);
        return dzdx2
    }
    dzdy() {
        const [widthMeters, heightMeters] = bboxMetricSize(this.bbox);
        const pixelScale = heightMeters / this.height;
        const dzdy = super.dzdy(2, (1 / 8) * (1 / pixelScale));
        const dzdy2 = GeoDataSet.viewFromDataSet(dzdy, this.bbox);
        return dzdy2
    }
    slopeAndAspect() {
        const dzdx = this.dzdx();
        const dzdy = this.dzdy();
        const slope = this.slope(dzdx, dzdy);
        const aspect = this.aspect(dzdx, dzdy);
        return { dzdx, dzdy, slope, aspect }
    }
    aspect(dzdx = this.dzdx(), dzdy = this.dzdy()) {
        const asp = dzdx.map((x, i) => {
            const y = dzdy.data[i];
            const a = Math.atan2(-y, -x);
            return a
        });
        return asp
    }
    slope(dzdx = this.dzdx(), dzdy = this.dzdy()) {
        const slop = dzdx.map((x, i) => {
            const y = dzdy.data[i];
            const a = Math.hypot(-x, -y);
            const sl = (Math.PI / 2) - Math.atan2(1, a);
            return sl
        });
        return slop
    }
    clone() {
        return new GeoDataSet(this.width, this.height, this.bbox, this.data)
    }
    resample(width, height, useNearest = true, Type = Array) {
        const a = super.resample(width, height, useNearest, Type);
        const b = GeoDataSet.viewFromDataSet(a, this.bbox);
        return b
    }
    convolve(kernel, factor = 1, crop = false) {
        const a = super.convolve(kernel, factor, crop);
        const b = GeoDataSet.viewFromDataSet(a, this.bbox);
        return b
    }
    normalize(lo = 0, hi = 1, round = false) {
        const a = super.normalize(lo, hi, round);
        const b = GeoDataSet.viewFromDataSet(a, this.bbox);
        return b
    }
    map(f) {
        const a = super.map(f);
        const b = GeoDataSet.viewFromDataSet(a, this.bbox);
        return b
    }
}

function rgbToInt24$1(r, g, b) {
    return r * 256 * 256 + g * 256 + b
}
function rgbScaleFunction(min, scale) {
    return (r, g, b) => min + rgbToInt24$1(r, g, b) * scale
}
function redfishElevation(r, g, b) {
    let negative = 1;
    if (r > 63) {
        negative = -1;
        r = 0;
    }
    return (negative * rgbToInt24$1(r, g, b)) / 10
}
const sharedTileObject = {
    zxyToTile: async function (z, x, y) {
        const tileUrl = this.zxyUrl(z, x, y);
        const img = await imagePromise(tileUrl);
        img.zxy = [z, x, y];
        return img
    },
    zxyToDataSet: async function (z, x, y, ArrayType = Float32Array) {
        const img = await this.zxyToTile(z, x, y);
        const dataSet = this.tileDataSet(img, ArrayType);
        const bbox = xyz2bbox(x, y, z);
        const geoDS = GeoDataSet.viewFromDataSet(dataSet, bbox);
        geoDS.zxy = [z, x, y];
        return geoDS
    },
    tileDataSet: function (img, ArrayType = Float32Array) {
        const tileDecoder = this.elevationFcn;
        return new RGBDataSet(img, tileDecoder, ArrayType)
    },
    tileSize: 256,
};
const maptiler = Object.assign(
    {
        elevationFcn: rgbScaleFunction(-10000, 0.1),
        zxyUrl: (z, x, y) =>
            `https://api.maptiler.com/tiles/terrain-rgb/${z}/${x}/${y}.png?key=iQurAP6lArV1UP4gfSVs`,
        zxyTemplate:
            'https://api.maptiler.com/tiles/terrain-rgb/{z}/{x}/{y}.png?key=iQurAP6lArV1UP4gfSVs',
        minZoom: 0,
        maxZoom: 15,
    },
    sharedTileObject
);
const mapzen = Object.assign(
    {
        elevationFcn: rgbScaleFunction(-32768, 1 / 256),
        zxyUrl: (z, x, y) =>
            `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`,
        zxyTemplate:
            'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
        minZoom: 0,
        maxZoom: 15,
    },
    sharedTileObject
);
const redfishUSA = Object.assign(
    {
        elevationFcn: redfishElevation,
        zxyUrl: (z, x, y) =>
            `https://s3-us-west-2.amazonaws.com/simtable-elevation-tiles/${z}/${x}/${y}.png`,
        zxyTemplate:
            'https://s3-us-west-2.amazonaws.com/simtable-elevation-tiles/{z}/{x}/{y}.png',
        minZoom: 10,
        maxZoom: 14,
    },
    sharedTileObject
);
const redfishWorld = Object.assign(
    {
        elevationFcn: redfishElevation,
        zxyUrl: (z, x, y) =>
            `https://s3-us-west-2.amazonaws.com/world-elevation-tiles/DEM_tiles/${z}/${x}/${y}.png`,
        zxyTemplate:
            'https://s3-us-west-2.amazonaws.com/world-elevation-tiles/DEM_tiles/{z}/{x}/{y}.png',
        minZoom: 7,
        maxZoom: 13,
    },
    sharedTileObject
);
const mapboxToken =
    'pk.eyJ1IjoiYmFja3NwYWNlcyIsImEiOiJjanVrbzI4dncwOXl3M3ptcGJtN3oxMmhoIn0.x9iSCrtm0iADEqixVgPwqQ';
const mapbox = Object.assign(
    {
        elevationFcn: rgbScaleFunction(-10000, 0.1),
        zxyUrl: (z, x, y) =>
            `https://api.mapbox.com/v4/mapbox.terrain-rgb/${z}/${x}/${y}.png?access_token=` +
            mapboxToken,
        zxyTemplate:
            'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token=' +
            mapboxToken,
        minZoom: 0,
        maxZoom: 18,
    },
    sharedTileObject
);
const maplibre = mapzen;

var TileData = /*#__PURE__*/Object.freeze({
    __proto__: null,
    maptiler: maptiler,
    mapzen: mapzen,
    redfishUSA: redfishUSA,
    redfishWorld: redfishWorld,
    mapbox: mapbox,
    maplibre: maplibre
});

const ColorMap = {
    gradientImageData(nColors, stops, locs) {
        const ctx = createCtx(nColors, 1);
        if (!locs) locs = floatRamp(0, 1, stops.length);
        const grad = ctx.createLinearGradient(0, 0, nColors, 0);
        repeat(stops.length, i => grad.addColorStop(locs[i], stops[i]));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, nColors, 1);
        return ctxImageColors(ctx)
    },
    arrayToTypedColors(array) {
        return array.map(a => Color.toTypedColor(a))
    },
    permuteArrays(A1, A2 = A1, A3 = A1) {
        const array = [];
        for (const a3 of A3) {
            for (const a2 of A2) for (const a1 of A1) array.push([a1, a2, a3]);
        }
        return array
    },
    permuteRGBColors(numRs, numGs = numRs, numBs = numRs) {
        const toRamp = num => integerRamp(0, 255, num);
        const ramps = [numRs, numGs, numBs].map(toRamp);
        return this.permuteArrays(...ramps)
    },
    ColorMapProto: {
        __proto__: Array.prototype,
        createIndex() {
            this.index = [];
            repeat(this.length, i => {
                const px = this[i].getPixel();
                this.index[px] = i;
                if (this.cssNames) this.index[this.cssNames[i]] = i;
            });
        },
        randomColor() {
            return this[randomInt(this.length)]
        },
        setAlpha(alpha) {
            forLoop(this, color => color.setAlpha(alpha));
        },
        clone() {
            return this.cloneColorMap(this)
        },
        atIndex(index) {
            return this[index % this.length]
        },
        indexOf(color) {
            if (this.index) return this.index[color.getPixel()]
            for (let i = 0; i < this.length; i++) {
                if (color.equals(this[i])) return i
            }
            return undefined
        },
        scaleColor(number, min = 0, max = this.length - 1) {
            if (min === max) return this[min]
            const scale = lerpScale(number, min, max);
            const index = Math.round(lerp(0, this.length - 1, scale));
            return this[index]
        },
        toString() {
            return `${this.length} ${arraysToString(this)}`
        },
        rgbClosestIndex(r, g, b) {
            let minDist = Infinity;
            let ixMin = 0;
            for (var i = 0; i < this.length; i++) {
                const d = this[i].rgbDistance(r, g, b);
                if (d < minDist) {
                    minDist = d;
                    ixMin = i;
                    if (d === 0) return ixMin
                }
            }
            return ixMin
        },
        rgbClosestColor(r, g, b) {
            return this[this.rgbClosestIndex(r, g, b)]
        },
        cubeClosestIndex(r, g, b) {
            const cube = this.cube;
            if (!cube) throw Error('cubeClosestIndex: requires the cube arrays')
            const rgbSteps = cube.map(c => 255 / (c - 1));
            const rgbLocs = [r, g, b].map((c, i) => Math.round(c / rgbSteps[i]));
            const [rLoc, gLoc, bLoc] = rgbLocs;
            return rLoc + gLoc * cube[0] + bLoc * cube[0] * cube[1]
        },
        cubeClosestColor(r, g, b) {
            return this[this.cubeClosestIndex(r, g, b)]
        },
        closestIndex(r, g, b) {
            return this.cube
                ? this.cubeClosestIndex(r, g, b)
                : this.rgbClosestIndex(r, g, b)
        },
        closestColor(r, g, b) {
            return this[this.closestIndex(r, g, b)]
        },
    },
    basicColorMap(colors) {
        colors = this.arrayToTypedColors(colors);
        Object.setPrototypeOf(colors, this.ColorMapProto);
        return colors
    },
    grayColorMap(min = 0, max = 255, size = max - min + 1) {
        const ramp = integerRamp(min, max, size);
        return this.basicColorMap(ramp.map(i => [i, i, i]))
    },
    rgbColorCube(numRs, numGs = numRs, numBs = numRs) {
        const array = this.permuteRGBColors(numRs, numGs, numBs);
        const map = this.basicColorMap(array);
        map.cube = [numRs, numGs, numBs];
        return map
    },
    rgbColorMap(R, G, B) {
        const array = this.permuteArrays(R, G, B);
        return this.basicColorMap(array)
    },
    hslColorMap(num = 360, S = 100, L = 50) {
        const hues = integerRamp(1, 360, num);
        const colors = hues.map(h => Color.hslCssColor(h));
        const typedColors = colors.map(c => Color.toTypedColor(c));
        return this.basicColorMap(typedColors)
    },
    transparentColorMap(num = 1) {
        return this.staticColorMap(0, num)
    },
    staticColorMap(color, num = 1) {
        color = Color.toTypedColor(color);
        const array = Array(num).fill(color);
        return this.basicColorMap(array)
    },
    gradientColorMap(nColors, stops, locs) {
        stops = stops.map(c => c.css || c);
        const uint8arrays = this.gradientImageData(nColors, stops, locs);
        const typedColors = this.arrayToTypedColors(uint8arrays);
        Object.setPrototypeOf(typedColors, this.ColorMapProto);
        return typedColors
    },
    jetColors: [
        'rgb(0, 0, 127)',
        'rgb(0, 0, 255)',
        'rgb(0, 127, 255)',
        'rgb(0, 255, 255)',
        'rgb(127, 255, 127)',
        'rgb(255, 255, 0)',
        'rgb(255, 127, 0)',
        'rgb(255, 0, 0)',
        'rgb(127, 0, 0)',
    ],
    basicColorNames:
        'white silver gray black red maroon yellow orange olive lime green cyan teal blue navy magenta purple'.split(
            ' '
        ),
    brightColorNames:
        'white silver red maroon yellow orange olive lime green cyan teal blue navy magenta purple'.split(
            ' '
        ),
    cssColorMap(cssArray, createNameIndex = false) {
        const array = cssArray.map(str => Color.cssToUint8Array(str));
        const map = this.basicColorMap(array);
        map.cssNames = cssArray;
        if (createNameIndex) {
            cssArray.forEach((name, ix) => {
                map[name] = map[ix];
            });
            if (map.cyan) map.aqua = map.cyan;
            if (map.magenta) map.fuchsia = map.magenta;
        }
        return map
    },
    cloneColorMap(colorMap) {
        const keys = Object.keys(colorMap);
        const clone = this.basicColorMap(colorMap);
        forLoop(keys, (val, i) => {
            if (clone[i] === undefined) clone[val] = colorMap[val];
        });
        return clone
    },
    LazyMap(name, map) {
        Object.defineProperty(this, name, { value: map, enumerable: true });
        return map
    },
    get Gray() {
        return this.LazyMap('Gray', this.grayColorMap())
    },
    get Hue() {
        return this.LazyMap('Hue', this.hslColorMap())
    },
    get LightGray() {
        return this.LazyMap('LightGray', this.grayColorMap(200))
    },
    get DarkGray() {
        return this.LazyMap('DarkGray', this.grayColorMap(0, 100))
    },
    get Jet() {
        return this.LazyMap('Jet', this.gradientColorMap(256, this.jetColors))
    },
    get Rgb256() {
        return this.LazyMap('Rgb256', this.rgbColorCube(8, 8, 4))
    },
    get Rgb() {
        return this.LazyMap('Rgb', this.rgbColorCube(16))
    },
    get Transparent() {
        return this.LazyMap('Transparent', this.transparentColorMap())
    },
    get Basic16() {
        return this.LazyMap(
            'Basic16',
            this.cssColorMap(this.basicColorNames, true)
        )
    },
};

function cssColor$1(color) {
    if (color) return color.css || color
    return color
}
class Shapes {
    constructor() {
        this.cache = {};
        this.paths = paths;
    }
    addPath(name, pathFunction) {
        if (this.getPath(name)) ;
        paths[name] = pathFunction;
    }
    needsStrokeColor(shapeName) {
        return shapeName.endsWith('2')
    }
    getPathNames() {
        return Object.keys(paths)
    }
    getPath(name) {
        return paths[name]
    }
    oneOf() {
        return oneValOf(paths)
    }
    nameAtIndex(index) {
        const names = this.getPathNames();
        return names[mod(index, names.length)]
    }
    atIndex(index) {
        const name = this.nameAtIndex(index);
        return paths[name]
    }
    imagePathPromise(name, imgURL) {
        return imagePromise(imgURL).then(img => {
            this.createImagePath(name, img);
        })
    }
    createImagePath(name, img, flip = true) {
        if (!isImageable(img)) {
            throw Error('Shapes createImagePath: img not an imageable ' + img)
        }
        if (flip) img = flipImage(img);
        function imagePath(ctx) {
            ctx.drawImage(img, -0.5, -0.5, 1, 1);
        }
        this.addPath(name, imagePath);
    }
    imageName(name, pixels, fill, stroke) {
        const path = this.getPath(name);
        if (!Number.isInteger(pixels))
            throw Error(`imageName: pixels is not integer: ${name}`)
        if (!path) throw Error(`imageName: ${name} not in Shapes`)
        if (path.name === 'imagePath') return `${name}_${pixels}_image`
        if (!fill) throw Error(`imageName: No color for shape ${name}`)
        if (!this.needsStrokeColor(name)) stroke = null;
        return `${name}_${pixels}_${fill}${stroke ? `_${stroke}` : ''}`
    }
    shapeToImage(name, pixels, fill, stroke) {
        pixels = Math.ceil(pixels);
        const imgName = this.imageName(name, pixels, fill, stroke);
        if (this.cache && this.cache[imgName]) return this.cache[imgName]
        const ctx = createCtx(pixels, pixels);
        ctx.fillStyle = cssColor$1(fill);
        ctx.strokeStyle = cssColor$1(stroke);
        ctx.scale(pixels, -pixels);
        ctx.translate(0.5, -0.5);
        ctx.beginPath();
        paths[name](ctx);
        ctx.closePath();
        ctx.fill();
        ctx.canvas.name = imgName;
        if (this.cache) this.cache[imgName] = ctx.canvas;
        return ctx.canvas
    }
    imageNameToImage(imageName) {
        const [name, pixels, fill, stroke] = imageName.split('_');
        return this.shapeToImage(name, pixels, fill, stroke)
    }
}
function flipImage(img) {
    const { width, height } = img;
    const ctx = createCtx(width, height);
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, -height);
    return ctx.canvas
}
function poly(ctx, points) {
    points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt[0], pt[1]);
        else ctx.lineTo(pt[0], pt[1]);
    });
}
function circle(ctx, x, y, radius, anticlockwise = false) {
    ctx.arc(x, y, radius, 0, 2 * Math.PI, anticlockwise);
}
function square(ctx, x, y, size) {
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
}
const paths = {
    arrow(ctx) {
        poly(ctx, [
            [0.5, 0],
            [0, 0.5],
            [0, 0.2],
            [-0.5, 0.2],
            [-0.5, -0.2],
            [0, -0.2],
            [0, -0.5],
        ]);
    },
    bug(ctx) {
        ctx.strokeStyle = ctx.fillStyle;
        this.bug2(ctx);
    },
    bug2(ctx) {
        ctx.lineWidth = 0.05;
        poly(ctx, [
            [0.4, 0.225],
            [0.2, 0],
            [0.4, -0.225],
        ]);
        ctx.stroke();
        ctx.beginPath();
        circle(ctx, 0.12, 0, 0.13);
        circle(ctx, -0.05, 0, 0.13);
        circle(ctx, -0.27, 0, 0.2);
    },
    circle(ctx) {
        circle(ctx, 0, 0, 0.5);
    },
    dart(ctx) {
        poly(ctx, [
            [0.5, 0],
            [-0.5, 0.4],
            [-0.25, 0],
            [-0.5, -0.4],
        ]);
    },
    frame(ctx) {
        const inset = 0.2;
        const r = 0.5 - inset;
        poly(ctx, [
            [-0.5, -0.5],
            [0.5, -0.5],
            [0.5, 0.5],
            [-0.5, 0.5],
        ]);
        ctx.closePath();
        poly(ctx, [
            [-r, -r],
            [-r, r],
            [r, r],
            [r, -r],
        ]);
    },
    frame2(ctx) {
        const inset = 0.2;
        square(ctx, 0, 0, 1);
        ctx.fillStyle = ctx.strokeStyle;
        square(ctx, 0, 0, 1 - 2 * inset);
    },
    person(ctx) {
        ctx.strokeStyle = ctx.fillStyle;
        this.person2(ctx);
    },
    person2(ctx) {
        poly(ctx, [
            [0.15, 0.2],
            [0.3, 0],
            [0.125, -0.1],
            [0.125, 0.05],
            [0.1, -0.15],
            [0.25, -0.5],
            [0.05, -0.5],
            [0, -0.25],
            [-0.05, -0.5],
            [-0.25, -0.5],
            [-0.1, -0.15],
            [-0.125, 0.05],
            [-0.125, -0.1],
            [-0.3, 0],
            [-0.15, 0.2],
        ]);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = ctx.strokeStyle;
        circle(ctx, 0, 0.35, 0.15);
    },
    ring(ctx) {
        const [rOuter, rInner] = [0.5, 0.3];
        circle(ctx, 0, 0, rOuter);
        ctx.lineTo(rInner, 0);
        circle(ctx, 0, 0, rInner, true);
    },
    ring2(ctx) {
        const [rOuter, rInner] = [0.5, 0.3];
        circle(ctx, 0, 0, rOuter);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = ctx.strokeStyle;
        circle(ctx, 0, 0, rInner);
    },
    square(ctx) {
        square(ctx, 0, 0, 1);
    },
    triangle(ctx) {
        poly(ctx, [
            [0.5, 0],
            [-0.5, -0.4],
            [-0.5, 0.4],
        ]);
    },
};

class SpriteSheet {
    constructor(spriteSize = 64, cols = 16, usePowerOf2 = false) {
        spriteSize = Math.ceil(spriteSize);
        Object.assign(this, { spriteSize, cols, usePowerOf2 });
        this.rows = 1;
        this.nextCol = 0;
        this.nextRow = 0;
        this.spritesIndex = {};
        this.sprites = [];
        this.shapes = new Shapes();
        if (usePowerOf2) this.checkPowerOf2();
        this.ctx = createCtx(this.width, this.height);
        this.texture = null;
    }
    getSprite(shapeName, color, strokeColor) {
        return this.newSprite(shapeName, color, strokeColor)
    }
    oneOf() {
        return oneOf(this.sprites)
    }
    draw(ctx, sprite, x, y, theta, world, patchSize, noRotate = false) {
        const [x0, y0] = world.patchXYtoPixelXY(x, y, patchSize);
        const theta0 = -theta;
        this.drawCanvas(ctx, sprite, x0, y0, theta0, noRotate);
    }
    drawCanvas(ctx, sprite, x, y, theta = 0, noRotate = false) {
        const { x: x0, y: y0, size } = sprite;
        const halfSize = size / 2;
        if (noRotate) theta = 0;
        if (theta === 0) {
            ctx.drawImage(
                this.ctx.canvas,
                x0,
                y0,
                size,
                size,
                x - halfSize,
                y - halfSize,
                size,
                size
            );
        } else {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(theta);
            ctx.drawImage(
                this.ctx.canvas,
                x0,
                y0,
                size,
                size,
                -halfSize,
                -halfSize,
                size,
                size
            );
            ctx.restore();
        }
    }
    newSprite(shapeName, color, strokeColor = null) {
        const name = this.shapes.imageName(
            shapeName,
            this.spriteSize,
            color,
            strokeColor
        );
        if (this.spritesIndex[name]) return this.spritesIndex[name]
        const img = this.shapes.shapeToImage(
            shapeName,
            this.spriteSize,
            color,
            strokeColor
        );
        this.checkSheetSize();
        const [x, y, size] = [this.nextX, this.nextY, this.spriteSize];
        this.ctx.drawImage(img, x, y, size, size);
        const { nextRow: row, nextCol: col } = this;
        const sprite = {
            name,
            id: this.sprites.length,
            x,
            y,
            row,
            col,
            size,
            sheet: this,
        };
        sprite.uvs = this.getUVs(sprite);
        this.incrementRowCol();
        this.spritesIndex[name] = sprite;
        this.sprites.push(sprite);
        if (this.texture) this.texture.needsUpdate = true;
        return sprite
    }
    get width() {
        return this.spriteSize * this.cols
    }
    get height() {
        return this.spriteSize * this.rows
    }
    get nextX() {
        return this.spriteSize * this.nextCol
    }
    get nextY() {
        return this.spriteSize * this.nextRow
    }
    checkPowerOf2() {
        const { width, height } = this;
        if (!(isPowerOf2(width) && isPowerOf2(height))) {
            throw Error(`SpriteSheet non power of 2: ${width}x${height}`)
        }
    }
    checkSheetSize() {
        if (this.nextRow === this.rows) {
            this.rows = this.usePowerOf2 ? this.rows * 2 : this.rows + 1;
            resizeCtx(this.ctx, this.width, this.height);
            forLoop(this.sprites, sprite => {
                sprite.uvs = this.getUVs(sprite);
            });
        }
    }
    incrementRowCol() {
        this.nextCol += 1;
        if (this.nextCol < this.cols) return
        this.nextCol = 0;
        this.nextRow += 1;
    }
    getUVs(sprite) {
        const { row, col } = sprite;
        const { rows, cols } = this;
        const u0 = col / cols;
        const v0 = (rows - (row + 1)) / rows;
        const u1 = (col + 1) / cols;
        const v1 = (rows - row) / rows;
        return [u0, v0, u1, v0, u1, v1, u0, v1]
    }
}

function cssColor(color) {
    if (color) return color.css || color
    return color
}
class TurtlesView {
    static defaultOptions() {
        return {
            useSprites: false,
            patchSize: 10,
        }
    }
    constructor(ctx, world, options = {}) {
        options = Object.assign(TurtlesView.defaultOptions(), options);
        Object.assign(this, { ctx, world }, options);
        this.shapes = new Shapes();
        this.reset(this.patchSize, this.useSprites);
    }
    reset(patchSize, useSprites = this.useSprites) {
        this.useSprites = useSprites;
        this.resetCtx(patchSize);
    }
    getImageBitmap() {
        return createImageBitmap(this.ctx.canvas)
    }
    resetCtx(patchSize) {
        this.patchSize = patchSize;
        if (this.useSprites) {
            this.world.setCanvasSize(this.ctx.canvas, patchSize);
            this.ctx.restore();
        } else {
            this.world.setEuclideanTransform(this.ctx, patchSize);
        }
    }
    drawTurtles(data, viewFcn) {
        if (isOofA(data)) data = toAofO(data);
        const constantView = isObject$1(viewFcn);
        forLoop(data, (turtle, i) => {
            const viewData = constantView ? viewFcn : viewFcn(turtle, i, data);
            this.drawTurtle(turtle, viewData);
        });
    }
    drawTurtle(turtle, viewData) {
        if (turtle.hidden) return
        if (viewData.size === 0) return
        if (this.useSprites) {
            let { sprite, noRotate } = viewData;
            if (!sprite) {
                const { shape, color, strokeColor, size } = viewData;
                const pixels = size * this.patchSize;
                sprite = this.shapes.shapeToImage(
                    shape,
                    pixels,
                    color,
                    strokeColor
                );
            }
            if (sprite.sheet) {
                sprite.sheet.draw(
                    this.ctx,
                    sprite,
                    turtle.x,
                    turtle.y,
                    turtle.theta,
                    this.world,
                    this.patchSize,
                    noRotate
                );
            } else {
                this.drawImage(
                    sprite,
                    turtle.x,
                    turtle.y,
                    noRotate ? 0 : turtle.theta
                );
            }
        } else {
            const { shape, color, strokeColor, size, noRotate } = viewData;
            this.drawShape(
                shape,
                turtle.x,
                turtle.y,
                noRotate ? 0 : turtle.theta,
                size,
                color,
                strokeColor
            );
        }
    }
    drawShape(name, x, y, theta = 0, size = 1, fill, stroke) {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = cssColor(fill);
        ctx.strokeStyle = cssColor(stroke);
        ctx.translate(x, y);
        ctx.scale(size, size);
        if (theta !== 0) ctx.rotate(theta);
        ctx.beginPath();
        this.shapes.paths[name](ctx);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    drawImage(img, x, y, theta = 0) {
        const halfPix = img.width / 2;
        const patchSize = this.patchSize;
        const [x0, y0] = this.world.patchXYtoPixelXY(x, y, patchSize);
        const ctx = this.ctx;
        if (theta === 0) {
            ctx.drawImage(img, x0 - halfPix, y0 - halfPix);
        } else {
            ctx.save();
            ctx.translate(x0, y0);
            ctx.rotate(-theta);
            ctx.drawImage(img, -halfPix, -halfPix);
            ctx.restore();
        }
    }
    drawLinks(data, viewFcn) {
        if (isOofA(data)) data = toAofO(data);
        const uniformLinks = isObject$1(viewFcn);
        const ctx = this.ctx;
        setIdentity(this.ctx);
        if (uniformLinks) {
            ctx.strokeStyle = cssColor(viewFcn.color);
            ctx.lineWidth = viewFcn.width || 1;
            ctx.beginPath();
        }
        forLoop(data, (link, i) => {
            if (uniformLinks) {
                this.drawLink(link);
            } else {
                const { color, width } = viewFcn(link, i, data);
                this.drawLink(link, color, width);
            }
        });
        if (uniformLinks) {
            ctx.closePath();
            ctx.stroke();
        }
        this.ctx.restore();
    }
    drawLink(link, color, width = 1) {
        this.drawLine(link.x0, link.y0, link.x1, link.y1, color, width);
    }
    drawLine(x0, y0, x1, y1, stroke, width = 1) {
        const ctx = this.ctx
        ;[x0, y0] = this.world.patchXYtoPixelXY(x0, y0, this.patchSize)
        ;[x1, y1] = this.world.patchXYtoPixelXY(x1, y1, this.patchSize);
        if (stroke) {
            ctx.strokeStyle = cssColor(stroke);
            ctx.lineWidth = width;
            ctx.beginPath();
        }
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        if (stroke) {
            ctx.closePath();
            ctx.stroke();
        }
    }
}

class TwoView {
    static defaultOptions() {
        return {
            div: document.body,
            useSprites: false,
            patchSize: 10,
        }
    }
    constructor(world, options = {}) {
        if (world.world) world = world.world;
        options = Object.assign(TwoView.defaultOptions(), options);
        if (options.width) {
            options.patchSize = options.width / world.width;
            delete options.width;
        }
        let div = options.div;
        let can = div;
        div = isString(div) ? document.getElementById(div) : div;
        if (!isCanvas(can)) {
            can = createCanvas(0, 0, true);
            div.appendChild(can);
        }
        this.ctx = can.getContext('2d');
        this.world = world;
        this.patchesView = new PatchesView(this.world.width, this.world.height);
        this.turtlesView = new TurtlesView(this.ctx, this.world, options);
        this.ticks = 0;
        this.clear();
    }
    tick() {
        this.ticks++;
    }
    get canvas() {
        return this.ctx.canvas
    }
    reset(patchSize, useSprites = this.useSprites) {
        this.turtlesView.reset(patchSize, useSprites);
    }
    downloadCanvas(name = undefined) {
        if (!name)
            name = this.model.constructor.name
                .toLowerCase()
                .replace(/model$/, '');
        downloadCanvas(this.canvas, name);
    }
    get width() {
        return this.world.width * this.patchSize
    }
    set width(val) {
        this.reset(val / this.world.width);
    }
    get patchSize() {
        return this.turtlesView.patchSize
    }
    set patchSize(val) {
        this.reset(val);
    }
    get useSprites() {
        return this.turtlesView.useSprites
    }
    set useSprites(val) {
        this.reset(this.patchSize, val);
    }
    clear(cssColor) {
        clearCtx(this.ctx, cssColor);
    }
    createPatchPixels(pixelFcn) {
        this.patchesView.createPixels(pixelFcn);
    }
    setPatchPixel(index, pixel) {
        this.patchesView.setPixel(index, pixel);
    }
    setPatchesPixels(data, pixelFcn) {
        this.patchesView.setPixels(data, pixelFcn);
    }
    setPatchesSmoothing(smoothing) {
        this.patchesView.setPatchesSmoothing(smoothing);
    }
    drawPatchesImage(img) {
        fillCtxWithImage(this.ctx, img);
    }
    drawPatches(data, pixelFcn) {
        if (data != null) {
            this.patchesView.setPixels(data, pixelFcn);
        }
        this.patchesView.draw(this.ctx);
    }
    drawTurtles(data, viewFcn) {
        this.turtlesView.drawTurtles(data, viewFcn);
    }
    drawLinks(data, viewFcn) {
        this.turtlesView.drawLinks(data, viewFcn);
    }
    setTextProperties(font, textAlign = 'center', textBaseline = 'middle') {
        if (typeof font === 'number')
            font = `${this.patchSize * font}px sans-serif`;
        setTextProperties(this.ctx, font, textAlign, textBaseline);
    }
    drawText(string, x, y, color = 'black') {
[x, y] = this.world.patchXYtoPixelXY(x, y, this.patchSize);
        string = '' + string;
        drawText(this.ctx, string, x, y, color);
    }
}

class TwoDraw extends TwoView {
    static defaultOptions(model) {
        return {
            patchesColor: 'random',
            initPatches: null,
            turtles: model.turtles,
            turtlesColor: 'random',
            turtlesStrokeColor: 'random',
            turtlesShape: 'dart',
            turtlesSize: 1,
            turtlesRotate: true,
            links: model.links,
            linksColor: 'random',
            linksWidth: 1,
            textProperty: null,
            textSize: 0.5,
            textColor: 'black',
            patchesMap: 'DarkGray',
            turtlesMap: 'Basic16',
        }
    }
    static separateDrawOptions(viewOptions, drawOptions) {
        if (viewOptions.drawOptions) {
            Object.assign(drawOptions, viewOptions.drawOptions);
            delete viewOptions.drawOptions;
        }
        return drawOptions
    }
    constructor(model, viewOptions = {}, drawOptions = {}) {
        drawOptions = TwoDraw.separateDrawOptions(viewOptions, drawOptions);
        drawOptions = Object.assign(
            TwoDraw.defaultOptions(model),
            drawOptions
        );
        super(model, viewOptions);
        this.model = model;
        this.checkOptions(drawOptions);
        this.drawOptions = drawOptions;
    }
    checkOptions(drawOptions) {
        const keys = Object.keys(drawOptions);
        const defaults = TwoDraw.defaultOptions(this.model);
        keys.forEach(k => {
            if (defaults[k] === undefined) {
                console.log(
                    'Legal TwoDraw parameters',
                    Object.keys(TwoDraw.defaultOptions(this.model))
                );
                throw Error('Unknown TwoDraw parameter: ' + k)
            }
        });
        if (typeof drawOptions.patchesMap === 'string') {
            drawOptions.patchesMap = ColorMap[drawOptions.patchesMap];
            if (!drawOptions.patchesMap)
                Error('Unknown patchMap: ' + drawOptions.patchesMap);
        }
        if (typeof drawOptions.turtlesMap === 'string') {
            drawOptions.turtlesMap = ColorMap[drawOptions.turtlesMap];
            if (!drawOptions.turtlesMap)
                Error('Unknown turtlesMap: ' + drawOptions.turtlesMap);
        }
    }
    resetOptions(drawOptions = this.drawOptions) {
        this.checkOptions(drawOptions);
        this.drawOptions = drawOptions;
        this.ticks = 0;
        return drawOptions
    }
    draw() {
        const model = this.model;
        const view = this;
        let {
            patchesColor,
            initPatches,
            turtles,
            turtlesColor,
            turtlesStrokeColor,
            turtlesShape,
            turtlesSize,
            turtlesRotate,
            links,
            linksColor,
            linksWidth,
            textProperty,
            textSize,
            textColor,
            patchesMap,
            turtlesMap,
        } = this.drawOptions;
        if (view.ticks === 0) {
            if (textProperty) view.setTextProperties(textSize);
            if (initPatches) {
                const colors = initPatches(model, view);
                view.createPatchPixels(i => colors[i]);
            } else if (patchesColor === 'random') {
                view.createPatchPixels(i => patchesMap.randomColor());
            }
        }
        if (patchesColor === 'random' || initPatches) {
            view.clear();
            view.drawPatches();
        } else if (typeof patchesColor === 'function') {
            view.drawPatches(model.patches, p => patchesColor(p));
        } else if (isImageable(patchesColor)) {
            view.drawPatchesImage(patchesColor);
        } else {
            view.clear(patchesColor);
        }
        const checkColor = (agent, color) =>
            color === 'random' ? turtlesMap.atIndex(agent.id).css : color;
        view.drawLinks(links, l => ({
            color:
                linksColor === 'random'
                    ? turtlesMap.atIndex(l.id)
                    : typeof linksColor === 'function'
                    ? checkColor(l, linksColor(l))
                    : linksColor,
            width: linksWidth,
        }));
        view.drawTurtles(turtles, t => ({
            shape:
                typeof turtlesShape === 'function'
                    ? turtlesShape(t)
                    : turtlesShape,
            color:
                turtlesColor === 'random'
                    ? turtlesMap.atIndex(t.id).css
                    : typeof turtlesColor === 'function'
                    ? checkColor(t, turtlesColor(t))
                    : turtlesColor,
            strokeColor:
                turtlesStrokeColor === 'random'
                    ? turtlesMap.atIndex(t.id + 4).css
                    : typeof turtlesColor === 'function'
                    ? checkColor(t, turtlesColor(t))
                    : turtlesColor,
            size:
                typeof turtlesSize === 'function'
                    ? turtlesSize(t)
                    : turtlesSize,
            noRotate:
                typeof turtlesRotate === 'function'
                    ? !turtlesRotate(t)
                    : !turtlesRotate,
        }));
        if (textProperty) {
            turtles.ask(t => {
                if (t[textProperty] != null)
                    view.drawText(t[textProperty], t.x, t.y, textColor);
            });
        }
        view.tick();
    }
}

var Stats = function () {
	var mode = 0;
	var container = document.createElement( 'div' );
	container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
	container.addEventListener( 'click', function ( event ) {
		event.preventDefault();
		showPanel( ++ mode % container.children.length );
	}, false );
	function addPanel( panel ) {
		container.appendChild( panel.dom );
		return panel;
	}
	function showPanel( id ) {
		for ( var i = 0; i < container.children.length; i ++ ) {
			container.children[ i ].style.display = i === id ? 'block' : 'none';
		}
		mode = id;
	}
	var beginTime = ( performance || Date ).now(), prevTime = beginTime, frames = 0;
	var fpsPanel = addPanel( new Stats.Panel( 'FPS', '#0ff', '#002' ) );
	var msPanel = addPanel( new Stats.Panel( 'MS', '#0f0', '#020' ) );
	if ( self.performance && self.performance.memory ) {
		var memPanel = addPanel( new Stats.Panel( 'MB', '#f08', '#201' ) );
	}
	showPanel( 0 );
	return {
		REVISION: 16,
		dom: container,
		addPanel: addPanel,
		showPanel: showPanel,
		begin: function () {
			beginTime = ( performance || Date ).now();
		},
		end: function () {
			frames ++;
			var time = ( performance || Date ).now();
			msPanel.update( time - beginTime, 200 );
			if ( time >= prevTime + 1000 ) {
				fpsPanel.update( ( frames * 1000 ) / ( time - prevTime ), 100 );
				prevTime = time;
				frames = 0;
				if ( memPanel ) {
					var memory = performance.memory;
					memPanel.update( memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576 );
				}
			}
			return time;
		},
		update: function () {
			beginTime = this.end();
		},
		domElement: container,
		setMode: showPanel
	};
};
Stats.Panel = function ( name, fg, bg ) {
	var min = Infinity, max = 0, round = Math.round;
	var PR = round( window.devicePixelRatio || 1 );
	var WIDTH = 80 * PR, HEIGHT = 48 * PR,
		TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
		GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
		GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;
	var canvas = document.createElement( 'canvas' );
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.cssText = 'width:80px;height:48px';
	var context = canvas.getContext( '2d' );
	context.font = 'bold ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
	context.textBaseline = 'top';
	context.fillStyle = bg;
	context.fillRect( 0, 0, WIDTH, HEIGHT );
	context.fillStyle = fg;
	context.fillText( name, TEXT_X, TEXT_Y );
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );
	context.fillStyle = bg;
	context.globalAlpha = 0.9;
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );
	return {
		dom: canvas,
		update: function ( value, maxValue ) {
			min = Math.min( min, value );
			max = Math.max( max, value );
			context.fillStyle = bg;
			context.globalAlpha = 1;
			context.fillRect( 0, 0, WIDTH, GRAPH_Y );
			context.fillStyle = fg;
			context.fillText( round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')', TEXT_X, TEXT_Y );
			context.drawImage( canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT );
			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT );
			context.fillStyle = bg;
			context.globalAlpha = 0.9;
			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round( ( 1 - ( value / maxValue ) ) * GRAPH_HEIGHT ) );
		}
	};
};

class Animator {
    constructor(fcn, steps = -1, fps = 30) {
        Object.assign(this, { fcn, steps, fps, timeoutID: null, ticks: 0 });
        this.start();
    }
    start() {
        if (this.timeoutID) return
        this.timeoutID = setInterval(() => this.step(), 1000 / this.fps);
        return this
    }
    stop() {
        if (this.timeoutID) clearInterval(this.timeoutID);
        this.timeoutID = null;
        return this
    }
    step() {
        if (this.ticks === this.steps) return this.stop()
        this.ticks++;
        this.fcn();
        if (this.stats) this.stats.update();
        return this
    }
    isRunning() {
        return this.timeoutID != null
    }
    startStats(left = '0px') {
        if (this.stats) return console.log('startStats: already running')
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
        this.stats.dom.style.left = left;
        return this
    }
    setFps(fps) {
        this.reset(this.steps, fps);
    }
    setSteps(steps) {
        this.reset(steps, this.fps);
    }
    reset(steps = this.steps, fps = this.fps) {
        this.stop();
        this.steps = steps;
        this.ticks = 0;
        this.fps = fps;
        this.start();
    }
    toggle() {
        if (this.timeoutID) this.stop();
        else if (this.steps === 0) this.reset();
        else this.start();
    }
    once() {
        this.stop();
        this.step();
    }
}

class Evented {
    events = {}
    on(name, callback) {
        if (!this.events[name]) {
            this.events[name] = [];
        }
        this.events[name].push(callback);
        return callback
    }
    off(name, callback = null) {
        if (this.events[name]) {
            if (callback) {
                this.events[name] = this.events[name].filter(
                    cb => cb !== callback
                );
            }
            if (this.events[name].length === 0 || !callback) {
                delete this.events[name];
            }
        }
    }
    emit(name, ...args) {
        if (this.events[name]) {
            this.events[name].forEach(callback => callback(...args));
        }
    }
}

class Mouse {
    constructor(canvas, world, callback = (evt, mouse) => {}) {
        if (typeof canvas === 'string') {
            canvas = document.getElementById(canvas);
        }
        Object.assign(this, { canvas, world, callback });
        this.mouseDown = e => this.handleMouseDown(e);
        this.mouseUp = e => this.handleMouseUp(e);
        this.mouseMove = e => this.handleMouseMove(e);
    }
    resetParams() {
        this.x = this.y = NaN;
        this.moved = this.down = false;
    }
    start() {
        this.canvas.addEventListener('mousedown', this.mouseDown);
        document.body.addEventListener('mouseup', this.mouseUp);
        this.canvas.addEventListener('mousemove', this.mouseMove);
        this.resetParams();
        return this
    }
    stop() {
        this.canvas.removeEventListener('mousedown', this.mouseDown);
        document.body.removeEventListener('mouseup', this.mouseUp);
        this.canvas.removeEventListener('mousemove', this.mouseMove);
        this.resetParams();
        return this
    }
    get running() {
        return !isNaN(this.x)
    }
    run(on = true) {
        if (on) this.start();
        else this.stop();
    }
    generalHandler(e, down, moved) {
        this.down = down;
        this.moved = moved;
        this.setXY(e);
        this.callback(this, e);
    }
    handleMouseDown(e) {
        this.action = 'down';
        this.generalHandler(e, true, false);
    }
    handleMouseUp(e) {
        this.action = 'up';
        this.generalHandler(e, false, false);
    }
    handleMouseMove(e) {
        this.action = this.down ? 'drag' : 'move';
        this.generalHandler(e, this.down, true);
    }
    setXY(e) {
        const { canvas, world } = this;
        const patchSize = world.patchSize(canvas);
        const rect = this.canvas.getBoundingClientRect();
        const pixX = e.clientX - rect.left;
        const pixY = e.clientY - rect.top
        ;[this.x, this.y] = world.pixelXYtoPatchXY(pixX, pixY, patchSize);
    }
}

function isGeojson(obj) {
    return typeof obj === 'object' && obj.type === 'FeatureCollection'
}
function clone(json) {
    return JSON.parse(JSON.stringify(json))
}
function minify(json) {
    if (typeof json === 'string') json = JSON.parse(json);
    const str = JSON.stringify(json);
    return str.replace(/},{/g, '},\n\n{')
}
function bboxFeature(bbox, properties = {}) {
    const coords = bboxCoords(bbox);
    coords.push(coords[0]);
    return {
        type: 'Feature',
        geometry: {
            cordinates: coords,
            type: 'Polygon',
        },
        properties,
    }
}
function flattenMultiLineStrings(geojson, cloneJson = true) {
    if (cloneJson) geojson = clone(geojson);
    const features = geojson.features || geojson;
    const lineStrings = features.reduce((acc, obj) => {
        const geom = obj.geometry;
        if (geom.type === 'LineString') {
            geom.coordinates.properties = obj.properties;
            acc.push(geom.coordinates);
        } else if (geom.type === 'MultiLineString') {
            geom.coordinates.forEach(a => {
                a.properties = obj.properties;
                acc.push(a);
            });
        }
        return acc
    }, []);
    return lineStrings
}
function lineStringsToLinks(model, bbox, lineStrings) {
    const xfm = model.world.xfm || model.world.bboxTransform(...bbox);
    lineStrings = flattenMultiLineStrings(lineStrings);
    const nodeCache = {};
    const newTurtles = [];
    const newLinks = [];
    function getNode(pt) {
        const key = pt.toString();
        let node = nodeCache[key];
        if (node) return node
        node = model.turtles.createOne(t => {
            t.setxy(...xfm.toWorld(pt));
            t.lon = pt[0];
            t.lat = pt[1];
        });
        nodeCache[key] = node;
        newTurtles.push(node);
        return node
    }
    function newLink(pt0, pt1) {
        const t0 = getNode(pt0);
        const t1 = getNode(pt1);
        const link = model.links.createOne(t0, t1);
        newLinks.push(link);
        return link
    }
    function lineStringToLinks(lineString) {
        lineString.reduce((acc, pt, i, a) => {
            const link = newLink(a[i - 1], pt);
            if (i === 1) {
                acc = [link];
                acc.properties = lineString.properties;
            } else {
                acc.push(link);
            }
            link.lineString = acc;
            return acc
        });
    }
    lineStrings.forEach(lineString => lineStringToLinks(lineString));
    return [newTurtles, newLinks]
}
function flatten(gj, cloneJson = true) {
    if (cloneJson) gj = clone(gj);
    switch ((gj && gj.type) || null) {
        case 'FeatureCollection':
            gj.features = gj.features.reduce(function (mem, feature) {
                return mem.concat(flatten(feature))
            }, []);
            return gj
        case 'Feature':
            if (!gj.geometry) return [gj]
            return flatten(gj.geometry).map(function (geom) {
                var data = {
                    type: 'Feature',
                    properties: JSON.parse(JSON.stringify(gj.properties)),
                    geometry: geom,
                };
                if (gj.id !== undefined) {
                    data.id = gj.id;
                }
                return data
            })
        case 'MultiPoint':
            return gj.coordinates.map(function (_) {
                return { type: 'Point', coordinates: _ }
            })
        case 'MultiPolygon':
            return gj.coordinates.map(function (_) {
                return { type: 'Polygon', coordinates: _ }
            })
        case 'MultiLineString':
            return gj.coordinates.map(function (_) {
                return { type: 'LineString', coordinates: _ }
            })
        case 'GeometryCollection':
            return gj.geometries.map(flatten).reduce(function (memo, geoms) {
                return memo.concat(geoms)
            }, [])
        case 'Point':
        case 'Polygon':
        case 'LineString':
            return [gj]
    }
}
function geojsonBBox(gj) {
    var coords, bbox;
    if (!gj.hasOwnProperty('type')) return
    coords = getCoordinates(gj);
    bbox = [
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
    ];
    return coords.reduce(function (prev, coord) {
        return [
            Math.min(coord[0], prev[0]),
            Math.min(coord[1], prev[1]),
            Math.max(coord[0], prev[2]),
            Math.max(coord[1], prev[3]),
        ]
    }, bbox)
}
function getCoordinates(gj) {
    switch (gj.type) {
        case 'Point':
            return [gj.coordinates]
        case 'LineString':
        case 'MultiPoint':
            return gj.coordinates
        case 'Polygon':
        case 'MultiLineString':
            return gj.coordinates.reduce(function (dump, part) {
                return dump.concat(part)
            }, [])
        case 'MultiPolygon':
            return gj.coordinates.reduce(function (dump, poly) {
                return dump.concat(
                    poly.reduce(function (points, part) {
                        return points.concat(part)
                    }, [])
                )
            }, [])
        case 'Feature':
            return getCoordinates(gj.geometry)
        case 'GeometryCollection':
            return gj.geometries.reduce(function (dump, g) {
                return dump.concat(getCoordinates(g))
            }, [])
        case 'FeatureCollection':
            return gj.features.reduce(function (dump, f) {
                return dump.concat(getCoordinates(f))
            }, [])
    }
}

var geojson = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isGeojson: isGeojson,
    clone: clone,
    minify: minify,
    bboxFeature: bboxFeature,
    flattenMultiLineStrings: flattenMultiLineStrings,
    lineStringsToLinks: lineStringsToLinks,
    flatten: flatten,
    geojsonBBox: geojsonBBox,
    getCoordinates: getCoordinates
});

export { AgentArray, AgentList, AgentSet, Animator, Color, ColorMap, DataSet, Evented, GeoWorld, Link, Links, Model, Model3D, Mouse, Object3D, Patch, Patches, PatchesView, RGBADataSet$1 as RGBADataSet, RGBDataSet, Shapes, SpriteSheet, TileData, Turtle, Turtle3D, Turtles, TurtlesView, TwoDraw, TwoView, World, geojson, gis, steg, turfImports, util as utils };
