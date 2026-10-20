import {chromium} from "playwright";
import {fileURLToPath} from "node:url";
import {dirname,join} from "node:path";
import {mkdir} from "node:fs/promises";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const out=join(root,"store","screenshots");
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const page=await browser.newPage({viewport:{width:360,height:640},deviceScaleFactor:3,isMobile:true,hasTouch:true,locale:"pl-PL"});
const url="file://"+join(root,"index.html");
try{
 await page.goto(url,{waitUntil:"load",timeout:30000});
 await page.waitForFunction(()=>document.getElementById("bankStatus")?.textContent.includes("200"),{timeout:20000});
 const shoot=async file=>{await page.screenshot({path:join(out,file),fullPage:false});};
 await shoot("01_start.png");
 await page.locator('[data-nav="learn"]').click();
 await page.waitForSelector(".choice");
 await shoot("02_nauka.png");
 await page.locator('[data-nav="exam"]').click();
 await page.locator('[data-action="startFull"]').click();
 await page.waitForSelector(".choice");
 await shoot("03_egzamin.png");
 await page.locator('[data-nav="bank"]').click();
 await page.waitForSelector(".item");
 await shoot("04_200_pytan.png");
 console.log("Zapisano 4 autentyczne zrzuty ekranu 1080x1920 w store/screenshots");
}finally{await browser.close();}
