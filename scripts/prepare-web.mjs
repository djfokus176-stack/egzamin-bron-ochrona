import {mkdir,copyFile,rm} from "node:fs/promises";
import {join,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const out=join(root,"www");
await rm(out,{recursive:true,force:true});
await mkdir(join(out,"icons"),{recursive:true});
for(const file of ["index.html","report.js","sw.js","manifest.webmanifest","privacy.html","audit.html","icons/icon.svg","account.html","account.js","firebase-config.js"]){
 await copyFile(join(root,file),join(out,file));
}
console.log("Gotowe: www/ (strona + 200 pytań + zgłoszenia błędów + zasady prywatności).");
