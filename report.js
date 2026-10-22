/* Zgłoszenia błędów, v1.2. GitHub Issues jest publiczny, wymaga konta GitHub. */
"use strict";
(function(){
 const issuesUrl="https://github.com/djfokus176-stack/egzamin-bron-ochrona/issues/new";
 const confirmed=new Map([[11,"art. 5 ust. 3"],[50,"art. 10 ust. 6 pkt 4"],[67,"art. 12 ust. 2"],[155,"art. 34 ust. 1"]]);
 const originalQuestion=qMarkup;
 qMarkup=function(q,answer,lock,selected){
  const original=originalQuestion(q,answer,lock,selected);
  const note=q.n===134?'<div class="note">Pytanie 134: niejednoznaczne sformułowanie względem art. 28 ustawy. Pozostaje dostępne do nauki, ale nie jest uwzględniane w losowych testach ocenianych do czasu weryfikacji.</div>':'';
  return original+note+'<div class="actions'><button type="button" class="btn ghost" data-report-question="'+q.n+'">⚑ Zgłoś błąd w pytaniu #'+q.n+'</button></div>'+
   '<p class="muted">Klucz nieoficjalny. '+(confirmed.has(q.n)?'Zweryfikowano poprawkę na podstawie '+h(confirmed.get(q.n))+'.':'Odpowiedź nie została jeszcze indywidualnie zatwierdzona po audycie prawnym.')+'</p>';
 };
 const dialog=document.createElement("dialog");
 dialog.id="appReportDialog";
 dialog.setAttribute("aria-label","Zgłoszenie błędu w pytaniu");
 dialog.style.cssText="width:min(96vw,560px);border:1px solid #50708d;border-radius:16px;padding:22px;background:#162238;color:#f1f6ff;box-shadow:0 0 0 100vmax #0009";
 dialog.innerHTML='<form method="dialog"><h2>⚑ Zgłoś błąd moderatorowi</h2><p class="muted">Pytanie nr <b id="reportNumber"></b>. Zgłoszenia przez GitHub Issues są PUBLICZNE i wymagają konta GitHub. Nie podawaj danych osobowych.</p><label for="reportKind">Rodzaj błędu</label><select id="reportKind" style="display:block;width:100%;margin:8px 0 14px"><option>Błędna poprawna odpowiedź</option><option>Nieaktualny przepis</option><option>Literówka w treści pytania</option><option>Inny problem</option></select><label for="reportMessage">Opis (opcjonalnie)</label><textarea id="reportMessage" maxlength="1200" placeholder="Opisz problem lub podaj artykuł ustawy..." rows="4" style="display:block;width:100%;box-sizing:border-box;padding:12px;margin:8px 0 12px;border-radius:8px;background:#0d1b2d;color:white;border:1px solid #50708d"></textarea><div class="actions"><button type="button" class="btn" id="reportSend">Zgłoś na GitHubie</button><button type="button" class="btn ghost" id="reportCopy">Kopiuj zgłoszenie</button><button type="submit" class="btn ghost">Anuluj</button></div><p class="muted">Moderator najpierw sprawdzi źródła. Zgłoszenie nie zmienia odpowiedzi automatycznie.</p></form>';
 document.body.appendChild(dialog);
 let current=0;
 document.addEventListener("click",function(ev){
  const reportButton=ev.target.closest("[data-report-question]");
  if(!reportButton)return;
  current=Number(reportButton.dataset.reportQuestion);
  if(current<1||current>200)return;
  dialog.querySelector("#reportNumber").textContent=String(current);
  dialog.querySelector("#reportMessage").value="";
  if(typeof dialog.showModal==="function")dialog.showModal();
  else dialog.setAttribute("open","");
 });
 function reportText(){
  const q=Q.find(x=>x.n===current);
  return "Pytanie nr: "+current+"\nRodzaj: "+dialog.querySelector("#reportKind").value+
   "\nOpis: "+(dialog.querySelector("#reportMessage").value.trim()||"Proszę sprawdzić odpowiedź.")+
   "\nTreść pytania: "+q.stem+
   "\nPodstawa w pytaniu: "+q.reference+
   "\nOficjalny wykaz: https://ksp.policja.gov.pl/download/188/236472/PYTANIAEGZAMINACYJNE.pdf";
 }
 dialog.querySelector("#reportSend").addEventListener("click",async function(){
  const title="[Pytanie #"+current+"] "+dialog.querySelector("#reportKind").value;
  const url=issuesUrl+"?title="+encodeURIComponent(title)+"&body="+encodeURIComponent(reportText());
  // Capacitor: otwórz zgłoszenie w systemowej przeglądarce, aby logowanie na GitHub działało na Androidzie i iOS.
  let opened=false;
  try{
   const b=window.Capacitor?.Plugins?.Browser;
   if(window.Capacitor?.isNativePlatform?.() && b?.open){await b.open({url});opened=true;}
  }catch(e){console.warn("Nie udało się uruchomić przeglądarki systemowej",e);}
  if(!opened){const w=window.open(url,"_blank","noopener,noreferrer");if(!w)window.location.href=url;}
  if(typeof dialog.close==="function")dialog.close();else dialog.removeAttribute("open");
 });
 dialog.querySelector("#reportCopy").addEventListener("click",async function(){
  try{await navigator.clipboard.writeText(reportText());alert("Skopiowano zgłoszenie.");}
  catch(err){alert("Nie udało się skopiować. Możesz otworzyć zgłoszenie na GitHubie.");}
 });
 // Dodanie raportowania do szczegółowego podsumowania po zakończeniu egzaminu.
 const oldFinish=finishExam;
 finishExam=function(){
  oldFinish();
  if(exam?.active || !lastResult)return;
  scr.querySelectorAll(".review").forEach(el=>{
   if(el.querySelector("[data-report-question]"))return;
   const text=el.querySelector("b")?.textContent||"";
   const number=text.match(/Pytanie nr (\d+)/)?.[1];
   if(number)el.insertAdjacentHTML("beforeend",'<p><button type="button" class="btn ghost" data-report-question="'+number+'">⚑ Zgłoś błąd #'+number+'</button></p>');
  });
 };
 if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
 }
})();