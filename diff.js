export default function diff(ot, nt) {
  // console.log(ot, nt);
  let patches = {};

  walk(ot, nt, 0, patches);
  
  console.log('patches', patches);
  return patches;
}

function walk(ot, nt, patches) {
  // ot: text | vElement
  // nt: text | vElement | undefined
  try {
    const isTextNode = (t) => typeof t === 'string';
    const isElement = (t) => !!t.tagName;
    const hasChildren = (t) => t.children.length > 0;
    const curPatch = [];
    
    if (!nt) {
      curPatch.push({
        type: 'replace',
        content: null
      });
    } else if (isTextNode(ot) && isTextNode(nt) && ot !== nt) {
      curPatch.push({
        type: 'text',
        content: nt
      });
    } else if (isElement(ot) && isElement(nt) && ot.tagName === nt.tagName) {
      diffAttr(ot, nt);
      walkChildren(ot.children, nt.children);
    } else {
      curPatch.push({
        type: 'replace',
        content: nt
      });
    }
    
    console.log(JSON.stringify(curPatch, null, 2));
  } catch (error) {
    console.error(error, ot, nt);
  }
  
}

function walkChildren(oc, nc, patch) {
  oc.forEach((child, i) => {
    walk(child, nc[i])
  })
}

function diffAttr(ot, nt, patch) {
  console.log('属性diff');
}
