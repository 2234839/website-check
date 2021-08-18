import * as path from "https://deno.land/std@0.105.0/path/mod.ts";
import type { allSrc } from "./model.ts";
import { exists } from "https://deno.land/std@0.105.0/fs/mod.ts";

export async function check(allSrc: allSrc) {
  const root = "D:/code/doc/docHTML";
  function inRoot(p: string) {
    return p.replaceAll(path.SEP, "/").startsWith(root);
  }

  for (const item of allSrc) {
    const dir = path.dirname(item.basePath);
    const list = (
      await Promise.all(
        item.srcList
          .filter((src) => !/[a-zA-Z]:\/\//.test(src))
          .map(async (src) => {
            const assetsPath = decodeURIComponent(src).replace(
              /(\?|#)[\s\S]*$/g,
              ""
            );
            const targetUrl = path.resolve(
              dir,
              /** 这里的正则用于去除路径后面的参数 */
              assetsPath
            );
            let isExists = false;
            try {
              isExists = await exists(targetUrl);
            } catch (error) {
              console.log("exists", item, error);
            }
            return [targetUrl, isExists,assetsPath] as const;
          })
      )
    )
      .filter(([_, b]) => !b)
    if (list.length) {
      console.log(item.basePath, list);
      // break;
    }
  }
}
