import File from './File';
import snackbar from './tools/snackbar'
export default class DragZone {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.addListeners();
    this.fileCounter = 1;
    this.files = [];
  }
  addListeners() {
    if (!this.el) throw new Error('Element is not found');
    this.dragOverCounter = 0;
    this.el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setActiveState('dragover')
    })
    this.el.addEventListener('dragenter', (e) => {
      e.preventDefault();
      this.dragOverCounter++;
    })
    this.el.addEventListener('dragleave', (e) => {
      this.dragOverCounter--;
      if (this.dragOverCounter === 0) {
        this.setDefaultState()
      }
    })
    this.el.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dragOverCounter = 0;
      for(let i = 0; i < e.dataTransfer.files.length; i++) {
        if (!File.isValid(e.dataTransfer.files[i])) {
          snackbar.add(`file ${e.dataTransfer.files[i].name} has incorrect format`, 'danger');
          continue;
        };
        this.files.push(new File({
          id: this.fileCounter++,
          file: e.dataTransfer.files[i],
          maxSize: null,
          renderTo: this.el.querySelector('.dragged'),
          onload: this.newFile.bind(this),
          onremove: this.removeFile.bind(this),
          onloadstart: this.loadStart.bind(this)
        }))
      }
      this.setDefaultState()
    })
    const saveBtn = this.el.querySelector('.drag-save button');
    if (saveBtn) saveBtn.addEventListener('click', (e) => { this.save(e.target) })
  }
  loadStart() {
    this.el.classList.add('file-loading');
  }
  newFile(name, src, id) {
    const file = this.files.find(file => file.id === id);
    if (!file) return;
    file.name = name;
    file.src = src;
    this.el.classList.remove('file-loading');
    this.el.classList.add('loaded');
  }
  save (btn) {
    btn.disabled = true;
    if (!this.files.length) return;

    const xhr = new XMLHttpRequest();

    const json = JSON.stringify({
      files: this.files.map(file => ({src: file.src, name: file.name}))
    });

    xhr.open("POST", 'http://localhost:3000/load', true)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.onreadystatechange = e => {
      if (xhr.readyState != 4) return;
      if (xhr.status !== 200) {
        snackbar.add(`Error: ${xhr.statusText}, try later`, danger);
      } else {
        snackbar.add('Files has been upload successfully');
        btn.disabled = false;
        this.files.forEach(file => file.remove())
      }
    };
    xhr.send(json);
  }
  removeFile(id) {
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