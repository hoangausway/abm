import MagicString from "magic-string";
import { normalizePath } from "vite";

const strImportComlink = `import { expose } from 'comlink';\n`;
const strExpose = `expose({ info, init, step });`;
// const strComlinkWorker = 'new ComlinkWorker(url);';
// const strInsertWrap = `wrap(new Worker(url, { type: 'module' }));`;
// const strImportWrap = `import { wrap } from 'comlink';\n`;

// '/.../src/models/schelling.js' -> ['schelling.js', '/.../src/models']
const modelPath = (fullPath) => {
  let path = fullPath.split('/');
  return [path.pop(), path.join('/')];
};

const transformModelCode = (code) => {
  let sMagic = new MagicString(code);
  sMagic.appendLeft(0, strImportComlink);
  sMagic.appendRight(code.length, strExpose);
  return {
    code: sMagic.toString(),
    map: sMagic.generateMap(),
  };
};

// const transformWorkerCode = (code) => {
//   let sMagic = new MagicString(code);
//   const index = code.indexOf(strComlinkWorker);
//   sMagic.overwrite(index, index + strComlinkWorker.length, strInsertWrap);
//   sMagic.appendLeft(0, strImportWrap);
//   console.log('transformWorkerCode sMagic', sMagic.toString());
//   return {
//     code: sMagic.toString(),
//     map: sMagic.generateMap(),
//   };
// };

export function comlink(options = { modelsFolder: '/src/sims/models/' }) {
  return [
    {
      name: "mycomlink",
      transform(code, id) {
        if (id.includes(options.modelsFolder)) {
          return transformModelCode(code);
        }
        return;
      },
    }
  ];
}

export default comlink;