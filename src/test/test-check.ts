import { check } from "../check.ts";
// deno --unstable run --allow-all .\src\test\test-check.ts
const json =JSON.parse( await Deno.readTextFile("./allSrc.json"))
check(json)