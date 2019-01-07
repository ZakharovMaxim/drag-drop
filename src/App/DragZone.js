import File from './File';

export default class DragZone {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.addListeners();
  }
  addListeners() {
    if (!this.el) throw new Error('Element is not found');

    this.el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.state === 'dragover') return;
      this.setActiveState('dragover')
    })
    this.el.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setDefaultState()
    })
    this.el.addEventListener('drop', (e) => {
      e.preventDefault();
      for(let i = 0; i < e.dataTransfer.files.length; i++) {
        if (!File.isValid(e.dataTransfer.files[i])) continue;
        new File({
          id: i + 1,
          file: e.dataTransfer.files[i],
          maxSize: null,
          renderTo: this.el.querySelector('.dragged'),
          onload: this.newFile.bind(this),
          onremove: this.removeFile.bind(this)
        })
      }
      this.setDefaultState()
    })
  }
  newFile(src, name, id) {
    if (!this.files) this.files = [];
    this.files.push({
      name,
      src,
      id
    });
    this.el.classList.add('loaded');
  }
  removeFile(id) {
    console.log(this.files, id);
    this.files = this.files.filter(file => file.id !== id);
    if (this.files.length === 0) this.el.classList.remove('loaded');
  }
  setActiveState(state) {
    this.setDefaultState()
    this.state = state;
    switch(state) {
      case 'loading': this.el.classList.add('loading'); break;
      case 'dragover': this.el.classList.add('dragover'); break;
    }
  }
  setDefaultState() {
    this.state = '';
    this.el.classList.remove('loading');
    this.el.classList.remove('dragover');
  }
}