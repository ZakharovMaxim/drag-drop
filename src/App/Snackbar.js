export default class SnackBar {
  constructor(el) {
    this.el = el;
    this.items = [];
  }
  add(title, className) {
    console.log(title);
    const item = document.createElement('div');
    item.classList.add('snackbar-item');
    if (className) item.classList.add(`snackbar-item--${className}`);
    item.textContent = title;
    setTimeout(() => {
      item.classList.add('snackbar-item--removing');
    }, 2000)
    item.addEventListener('transitionend', (e) => {
      if (e.property !== 'opacity') return;
      e.target.remove();
    })
    this.el.appendChild(item);
  }
}