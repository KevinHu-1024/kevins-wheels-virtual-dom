
import createElement from './vElement';

var list = (
  <ul id="list">
    <li class="item">this is text</li>
    <li class="item">
      <span style="font-size:26px">bigger text</span>
    </li>
    <li class="item">
      <input type="text" value="input text" />
    </li>
    <li class="item"></li>
  </ul>
);

console.log('list', list);

document.querySelector('#app').appendChild(list.render());
