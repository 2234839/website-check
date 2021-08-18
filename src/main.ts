import { DOMParser,Element } from "./deps.ts";
import { walk } from "https://deno.land/std@0.105.0/fs/mod.ts";
import type { allSrc } from "./model.ts";


const dirWalk= walk('D:/code/doc/docHTML',{
  exts: ['.html'],
})
let count = 0
console.time("walk")
const AllSrc:allSrc=[]

for await (const entry of dirWalk) {
  if(!entry.isFile) {
    continue
  }
  count++
  const html =await Deno.readTextFile(entry.path)
  const doc = new DOMParser().parseFromString(html, "text/html")
  if(doc===null){
    continue
  }
  const hrefList:string[] = []
  doc.querySelectorAll("A,OCEANPRESS-BLOCK-REF,OCEANPRESS-EMBEDDED-BLOCK,IFRAME,IMG").forEach(a=>{
    const el = (a as Element)
    let href:string|null = null
    if(el.tagName==="A"){
     href = el.getAttribute("href")
    }else if(el.tagName==="OCEANPRESS-BLOCK-REF"){
      href = el.getAttribute("src")
    }else if(el.tagName==="OCEANPRESS-EMBEDDED-BLOCK"){
      href = el.getAttribute("src")
    }else if(el.tagName==="IFRAME"){
      href = el.getAttribute("src")
    }else if(el.tagName==="IMG"){
      href = el.getAttribute("src")
    }
    if(href!==null && !href.startsWith('#') && !href.startsWith('data:') && !href.startsWith('mailto:')){
      hrefList.push(href)
    }
  })
  AllSrc.push({
    basePath:entry.path,
    srcList:hrefList
  })
}
console.timeEnd("walk")
console.log(count);
Deno.writeTextFile(`./allSrc.json`,JSON.stringify(AllSrc,null,2))