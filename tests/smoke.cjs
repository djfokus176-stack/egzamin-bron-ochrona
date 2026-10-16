const fs=require("node:fs");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const html=fs.readFileSync("index.html","utf8");
const script=html.match(/<script>([\s\S]*?)<\/script>/);
assert(script,"Skrypt powinien być osadzony w index.html");
new vm.Script(script[1],{filename:"app.js"});
const source=script[1].match(/^const RAW=(.+);$/m);
const key=script[1].match(/^const KEY=(.+);$/m);
assert(source&&key,"Brak bazy lub klucza");
const raw=JSON.parse(source[1]);
const answers=JSON.parse(key[1]);
assert.equal(answers.length,200);
assert.match(answers,/^[ABC]+$/);
const parts=raw.replace(/\r/g,"").split(/(?=^[ \t]*\d{1,3}\.[ \t]+[^\n])/gm);
const questions=[];
for (const part of parts) {
 const x=part.match(/^[ \t]*(\d{1,3})\.[ \t]+([\s\S]*)/); if(!x)continue;
 const m=[...x[2].matchAll(/^[ \t]*([abc])\.[ \t]+/gm)];
 assert.equal(m.length,3,"Brak A/B/C w pytaniu "+x[1]);
 assert.equal(m.map(y=>y[1]).join(""),"abc");
 questions.push(Number(x[1]));
}
assert.deepEqual(questions,Array.from({length:200},(_,i)=>i+1));
assert.equal(answers[133],"A","Pytanie 134 – art. 28");
assert(!/shuffle\(.*\.opts/.test(html),"Nie wolno mieszać A/B/C ze wzgl. na referencje w odpowiedziach");
console.log("OK: poprawna składnia JS, 200 pytań, warianty ABC, 200 liter klucza.");
