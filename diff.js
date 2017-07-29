// import listDiff from './list-diff'

const REPLACE = 'REPLACE'
const ATTRS   = 'ATTRS'
const TEXT    = 'TEXT'
const REORDER = 'REORDER'

// diff 入口，比较新旧两棵树的差异
function diff (oldTree, newTree) {
  let index   = 0
  let patches = {} // 用来记录每个节点差异的补丁对象
  walk(oldTree, newTree, index, patches)
  return patches
}

/**
 * walk 遍历查找节点差异
 * @param  { Object } oldNode
 * @param  { Object } newNode
 * @param  { Number } index   - currentNodeIndex
 * @param  { Object } patches - 记录节点差异的对象
 */
function walk (oldNode, newNode, index, patches) {

  let currentPatch = []

  // 如果oldNode被remove掉了，即 newNode === null的时候
  if (newNode === null || newNode === undefined) {
    // 先不做操作, 具体交给 list diff 处理
  }
  // 比较文本之间的不同
  else if (typeof oldNode === 'string' && typeof newNode === 'string') {
    if (newNode !== oldNode) currentPatch.push({ type: TEXT, content: newNode })
  }
  // 比较attrs的不同
  else if (
    oldNode.tagName === newNode.tagName &&
    oldNode.key     === newNode.key
  ) {
    let attrsPatches = diffAttrs(oldNode, newNode)
    if (attrsPatches) {
      currentPatch.push({ type: ATTRS, attrs: attrsPatches })
    }
    // 递归进行子节点的diff比较
    diffChildren(oldNode.children, newNode.children, index, patches, currentPatch)
  }
  else {
    currentPatch.push({ type: REPLACE, node: newNode})
  }

  if (currentPatch.length) {
    patches[index] = currentPatch
  }
}

function diffAttrs (oldNode, newNode) {
  let count    = 0
  let oldAttrs = oldNode.attrs
  let newAttrs = newNode.attrs

  let key, value
  let attrsPatches = {}

  // 如果存在不同的 attrs
  for (key in oldAttrs) {
    value = oldAttrs[key]
    // 如果 oldAttrs 移除掉一些 attrs, newAttrs[key] === undefined
    if (newAttrs[key] !== value) {
      count++
      attrsPatches[key] = newAttrs[key]
    }
  }
  // 如果存在新的 attr
  for (key in newAttrs) {
    value = newAttrs[key]
    if (!oldAttrs.hasOwnProperty(key)) {
      attrsPatches[key] = value
    }
  }

  if (count === 0) {
    return null
  }

  return attrsPatches
}

// 设置节点唯一标识
let key_id = 0
// diff with children
function diffChildren (oldChildren, newChildren, index, patches, currentPatch) {
  let diffs = listDiff(oldChildren, newChildren, 'key')
  console.log(JSON.stringify(diffs, null ,2));
  // newChildren = diffs.children

  // if (diffs.moves.length) {
  //   let reorderPatch = { type: REORDER, moves: diffs.moves }
  //   currentPatch.push(reorderPatch)
  // }

  // 存放当前node的标识，初始化值为 0
  let currentNodeIndex = index

  oldChildren.forEach((child, i) => {
    key_id++
    let newChild = newChildren[i]
    currentNodeIndex = key_id

    // 递归继续比较
    walk(child, newChild, currentNodeIndex, patches)
  })
}

/**
 * Diff two list in O(max(m, n)).
 * @param {Array} oldList - 原始列表
 * @param {Array} newList - 经过一些操作的得出的新列表
 * @return {Object} - {moves: <Array>}
 *                  - moves list操作记录的集合
 */
function listDiff(oldList, newList, key) {
  const oldMap = objectify(oldList, key)
  const newMap = objectify(newList, key)
  const record = []

  // 最后再处理删除的情况，否则后面的索引就对不上了
  // 这也意味着oldToNew的数组和map都不能用了
  // 其实也无所谓，因为在后面删除同样是索引对不上
  // 这要求在list diff之后，马上就要把需要replace掉的元素删除，来避免对索引产生影响
  // const oldToNew = [];
  // for (let key in oldMap) {
  //   const newHasItem = key => !!newMap[key]
  //   if (!newHasItem(key)) {
  //     record.push({ type: REPLACE, index: oldMap[key].index })
  //   } else {
  //     oldToNew.push(oldMap[key])
  //   }
  // }

  // const oldToNewMap = {}
  // oldToNew.forEach(item => oldToNewMap[getKey(item.item, key)] = item)
  // console.log('oldtonewmap', JSON.stringify(oldToNewMap, null, 2))

  newList.forEach((item, i) => {
    const curKey = getKey(item, key)
    const oldHas = key => !!oldMap[key]

    if (oldHas(curKey)) {
      // 顺序
      if (i > oldMap[curKey].index) {
        // 新位置比原来的位置大
        record.push({ type: REORDER, index: oldMap[curKey].index, to: i })
      }
    } else {
      // 新增元素
      record.push({ type: ATTRS, index: i })
    }
  })

  for (let key in oldMap) {
    const newHasItem = key => !!newMap[key]
    if (!newHasItem(key)) {
      record.push({ type: REPLACE, index: oldMap[key].index })
    }
  }

// list diff 结果
// [
//    原来的1位，进行下一步处理（最后是insetAfter）
//   {
//     "type": "ATTRS",
//     "index": 1
//   },
//   原来的2位移动到3位
//   {
//     "type": "REORDER",
//     "index": 2,
//     "to": 3
//   },
//   原来的4位，进行下一步处理
//   {
//     "type": "ATTRS",
//     "index": 4
//   },
//   原来的1位，删除
//   {
//     "type": "REPLACE",
//     "index": 1
//   }
// ]

  function objectify(list, key) {
    const res = {}
    list.forEach((item, i) => {
      if (getKey(item, key)) {
        res[getKey(item, key)] = {
          item,
          index: i,
        }
      }
    })
    return res;
  }

  function getKey(item, key) {
    return item && item.attrs && item.attrs[key] || ''
  }

  return record;
}

module.exports = diff