
import createElement from './vElement';
import diff from './diff';

var list = (
  <ul id="list">
    <li class="item">this is text</li>
    <li class="item">
      <span style="font-size:26px">bigger <a href="#">link</a> text</span>
    </li>
    <li class="item">
      <input type="text" value="input text" />
    </li>
    <li class="item"></li>
  </ul>
);

// console.log('list', list);

var list2 = (
  <ul id="list2">
    <li class="item">this is a text</li>
    <li class="item">
      <p>this is a p</p>
    </li>
    <li class="item"></li>
    <li class="item">
      <input type="text" value="other text" />
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