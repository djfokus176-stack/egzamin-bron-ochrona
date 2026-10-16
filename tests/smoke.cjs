const fs=require("node:fs");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const html=fs.readFileSync("index.html","utf8");
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
assert.equal(scripts.length,2,"Aplikacja i rozbudowana baza błędów muszą być dostępne w HTML");
for(let i=0;i<scripts.length;i++)new vm.Script(scripts[i],{filename:"script-"+i+".js"});
const source=scripts[0].match(/^const RAW=(.+);$/m);
const key=scripts[0].match(/^const KEY=(.+);$/m);
assert(source&&key,"Brak bazy lub klucza");
const raw=JSON.parse(source[1]),answers=JSON.parse(key[1]);
assert.equal(answers.length,200);
assert.match(answers,/^[ABC]+$/);
const parts=raw.replace(/\r/g,"").split(/(?=^[ \t]*\d{1,3}\.[ \t]+[^\n])/gm);
const questions=[];
for(const part of parts){
 const x=part.match(/^[ \t]*(\d{1,3})\.[ \t]+([\s\S]*)/);
 if(!x)continue;
 const m=[...x[2].matchAll(/^[ \t]*([abc])\.[ \t]+/gm)];
 assert.equal(m.length,3,"Brak A/B/C w pytaniu "+x[1]);
 assert.equal(m.map(y=>y[1]).join(""),"abc");
 questions.push(Number(x[1]));
}
assert.deepEqual(questions,Array.from({length:200},(_,i)=>i+1));
assert.equal(answers[133],"A","Pytanie 134 – art. 28");

// Symulacja przeglądarki z danymi utworzonymi przez starą wersję aplikacji.
let savedStr=JSON.stringify({wrong:{"7":2},seen:{},history:[]});
let rendered="";
const screen={
 set innerHTML(s){rendered=s},get innerHTML(){return rendered},
 querySelector(){return {appendChild(){}}},
 addEventListener(){}
};
const elements={screen,bankStatus:{textContent:""}};
const document={
 getElementById:(id)=>elements[id]||null,
 querySelectorAll:()=>[],
 createElement:()=>({className:"",innerHTML:""})
};
const ctx=vm.createContext({
 console,document,
 localStorage:{getItem:()=>savedStr,setItem:(_k,v)=>{savedStr=v}},
 setInterval:()=>1,clearInterval:()=>{},
 setTimeout:(fn)=>fn(),confirm:()=>true,alert:()=>{},Date,Math,JSON,Number,Object,Array,Error
});
ctx.window=ctx;ctx.scrollTo=()=>{};
vm.runInContext(scripts[0],ctx,{timeout:1000});
vm.runInContext(scripts[1],ctx,{timeout:1000});
const read=(s)=>vm.runInContext(s,ctx,{timeout:1000});
assert.equal(read('Q.length'),200);
assert.equal(read('saved.mistakes[7].wrong'),2,"Stare błędy powinny się przenieść");
assert.equal(read('wrongNum()'),1);
read('initLesson("all",1);pickLesson((Q[0].correct+1)%3)');
assert.equal(read('saved.mistakes[1].wrong'),1);
assert.equal(read('wrongNum()'),2);
for(let i=0;i<3;i++)read('initLesson("all",1);pickLesson(Q[0].correct)');
assert.equal(read('saved.mistakes[1].streak'),3);
assert.equal(read('saved.mistakes[1].mastered'),true);
assert.equal(read('wrongNum()'),1);
assert.equal(read('Object.keys(saved.mistakes).length'),2,"Opanowane pytanie musi zostać w historii");
read('switchView("mistakes")');
assert.match(rendered,/Moja baza błędnych odpowiedzi/);
assert.match(rendered,/Ćwicz całą bazę/);
read('initLesson("all",2);recordShownForReview(Q[1].n)');
assert.equal(read('saved.mistakes[2].shown'),1);
read('initLesson("wrong")');
assert.equal(read('lesson.questions.length'),2,"Powtórki muszą obejmować stare błędy i ujawnione odpowiedzi");
read('startExam("quick")');
read('exam.answers=exam.questions.map(q=>q.correct);exam.answers[0]=(exam.questions[0].correct+1)%3;finishExam()');
assert.equal(read('exam.active'),false);
assert.equal(read('saved.history.length'),1);
assert.ok(JSON.parse(savedStr).mistakes,"Baza błędów musi być zapisywana w localStorage");
console.log("OK: 200 pytań, składnia obu skryptów, migracja historii, trwała baza błędów, opanowanie po 3 poprawnych, powtórki, szybki test.");
