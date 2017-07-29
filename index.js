
import createElement from './vElement';
import diff from './diff';

var list = (
  <ul id="list">
    <li class="item" key="key1">this is text key1</li>
    <li class="item" key="key4">
      <span style="font-size:26px">bigger <a href="#">link</a> text key4</span>
    </li>
    <li class="item" key="key2">
      <input type="text" value="input text key2" />
    </li>
    <li class="item" key="key3">key3</li>
  </ul>
);

// console.log('list', list);

var list2 = (
  <ul id="list2">
    <li class="item" key="key1">this is a text key1</li>
    <li class="item">
      <p>this is a p</p>
    </li>
    <li class="item" key="key3"> key3  </li>
    <li class="item" key="key2">
      <input type="text" value="other text key2" />
    </li>
    <li>last</li>
  </ul>
);

document.querySelector('#diff1').innerText = json(list)
document.querySelector('#diff2').innerText = json(list2)
function json(j) {
  return JSON.stringify(j, null, 2);
}
console.log(diff(list, list2));

document.querySelector('#app').appendChild(list.render());document.querySelector('#app2').appendChild(list2.render());