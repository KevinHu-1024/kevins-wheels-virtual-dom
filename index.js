
import createElement from './vElement';

var list = (
  <ul id="list">
    <li class="item">this is text</li>
    <li class="item"></li>
    <li class="item"></li>
    <li class="item"></li>
  </ul>
);

console.log('list', list);

document.querySelector('#app').appendChild(list.render());
