class File {
  constructor(options) {
    this.id = options.id;
    const reader = new FileReader()
    reader.readAsDataURL(options.file)
    reader.onloadstart = e => {
      this.render(options.file.name, options.renderTo)
      // this.loaded = 0
      // if (e.total > maxSize) reader.abort()
    }
    reader.onload = e => {
      this.src = e.target.result;
      options.onload(options.file.name, e.target.result, this.id)
      this.loaded(e.target.result, options.onremove)
    }
  }
  render(name, renderTo) {
    if (!name) return
    this.el = document.createElement('div')
    this.el.classList.add('file')
    this.el.innerHTML = `
    <div class="file-thumbnail"></div>
    <div class="file-name">${name}</div>`
    renderTo.appendChild(this.el);
  }
  loaded(src, onremove) {
    const thumbnailBlock = this.el.querySelector('.file-thumbnail');
    thumbnailBlock.innerHTML = `
    <div class="file-remove">
      <span class="icons-cancel-button"></span>
    </div>
    <img
      src="${src}"
      alt=""
  />`;
    thumbnailBlock.querySelector('.file-remove').addEventListener('click', () => {
      this.el.remove();
      onremove(this.id);
    })
  }
}
File.isValid = file => {
  return file.type.match('image.*') || file.type.match('application/pdf')
}
export default File
