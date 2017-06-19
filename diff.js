export default function diff(ot, nt) {
  // console.log(ot, nt);
  let patches = {};

  walk(ot, nt, parent);
  
  console.log('patches', patches);
  return patches;
}

function walk(ot, nt, patch) {
  console.log('-> walk')
  try {
    console.log('ot', `<${ot && ot.tagName}>`);
    console.log('nt', `<${nt && nt.tagName}>`);

    /*
     * 1. ot -> 文本 / nt -> 文本
     *  1.1 文本一致
     *  1.2 文本不一致 => 更换文本
     * 2. ot -> 元素 / nt -> 元素
     *  2.2.1 ot -> 元素 / nt -> 元素不同 => 替换
     *  2.2.2 ot -> 元素 / nt -> 元素相同
     *    ot -> attr / nt -> attr
     *      ot -> attr / nt -> attr 属性相同
     *      ot -> attr / nt -> attr 属性不同 => 改属性
     *    2.2.2.1 ot -> 有节点 / nt -> 有节点
     *    2.2.2.2 ot -> 有节点 / nt -> 无节点 => 替换
     * 4. => 替换
     */

    const textDiff = typeof ot === 'string' && typeof nt === 'string';
  
    const childrenDiff = (ot.children && ot.children.length) && (nt.children && nt.children.length);

    const nodeDiff = ot.tagName && nt.tagName;
    const noNewTree = !nt;

    if (textDiff) {
      if (ot !== nt) {
        console.log(`文本替换 ${ot} -> ${nt}`);
      }
    } else if (nodeDiff) {
      if (ot.tagName !== nt.tagName) {
        console.log(`节点替换 <${ot.tagName}> -> <${nt.tagName}>`)
      } else {
        diffAttr(ot, nt, patch);
        if (childrenDiff) {
          walkChildren(ot.children, nt.children, patch);
        } else if (nt && nt.children.length) {
          console.log(`节点替换 ${ot.tagName} -> ${nt.tagName}`)
        } else {
          console.log(`节点替换 ${ot.tagName} -> 空`)
        }
      }
    } else if (noNewTree) {
      console.log(`节点替换 ${ot.tagName} -> 空`)
    } else {
      console.log('节点替换');
    }
  } catch (error) {
    console.error(error, ot, nt);
  }
  
}

function walkChildren(oc, nc, patch) {
  console.log('--> children');
  oc.forEach((child, i) => {
    walk(child, nc[i], patch);
  })
}

function diffAttr(ot, nt, patch) {
  console.log('属性替换');
}
