class vElement {
  constructor(tagName, attrs, children) {
    this.tagName = tagName;
    this.attrs = attrs || {};
    this.children = children || [];
  }

  render() {
    const el = document.createElement(this.tagName);
    for(let attr in this.attrs) {
      if (this.attrs.hasOwnProperty(attr)) {
        setAttr(el, attr, this.attrs[attr]);
      }
    }
    if (this.children.length) {
      this.children.forEach(child => {
        if (child instanceof vElement) {
          el.appendChild(child.render());
        } else {
          el.appendChild(document.createTextNode(child));
        }
      })
    }
    return el;
  }
}

export default function createElement(tagName, attrs, ...children) {
  return new vElement(tagName, attrs, children);
}

function setAttr(el, attr, value) {
  const tagName = (el.tagName || '').toLowerCase();
  if (attr === 'value') {
    if (tagName === 'input' || tagName === 'textarea') {
      el.value = value;
    } else {
      el.setAttribute(attr, value);
    }
  } else {
    el.setAttribute(attr, value);
  }
}
