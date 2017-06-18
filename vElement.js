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
        el.setAttribute(attr, this.attrs[attr]);
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
