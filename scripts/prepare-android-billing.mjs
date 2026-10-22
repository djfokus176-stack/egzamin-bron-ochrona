import {readFile,writeFile,mkdir} from "node:fs/promises";
import {join,dirname} from "node:path";
const root=new URL("../",import.meta.url);
const p=url=>new URL(url,root);
const packageName="pl.djfokus176.quizochrona";
const dir="android/app/src/main/java/"+packageName.replaceAll(".","/")+"/";
await mkdir(p(dir),{recursive:true});
const source=await readFile(p("native/PlayBillingPlugin.java"),"utf8");
if(!source.includes("@CapacitorPlugin(name = \"PlayBilling\")"))throw Error("invalid billing native plugin");
await writeFile(p(dir+"PlayBillingPlugin.java"),source);
await writeFile(p(dir+"MainActivity.java"),\`package \${packageName};

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle state) {
        registerPlugin(PlayBillingPlugin.class);
        super.onCreate(state);
    }
}
\`);
const gradlePath=p("android/app/build.gradle");
let gradle=await readFile(gradlePath,"utf8");
if(!gradle.includes("com.android.billingclient:billing:9.1.0")){
  gradle+=\`
dependencies {
    implementation 'com.android.billingclient:billing:9.1.0'
}
\`;
  await writeFile(gradlePath,gradle);
}
console.log("PlayBilling: dodano most Java i bibliotekę Google Play Billing 9.1.0 do Android.");
