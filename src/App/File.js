import snackbar from './tools/snackbar'
class File {
  constructor(options) {
    this.id = options.id
    this.onremove = options.onremove;
    options.maxSize = options.maxSize || 100000000
    const reader = new FileReader()
    reader.readAsDataURL(options.file)
    reader.onloadstart = e => {
      if (!checkSize(e)) return
      options.onloadstart()
      this.render(options.file.name, options.renderTo)
      // this.loaded = 0
    }
    reader.onprogress = e => {
      this.loading((e.loaded / e.total) * 100)
    }
    reader.onload = e => {
      if (!checkSize(e)) return
      this.src = e.target.result
      options.onload(options.file.name, e.target.result, this.id)
      this.loaded(e.target.result, options.onremove)
    }
    function checkSize(e) {
      if (e.total > options.maxSize) {
        snackbar.add(
          `${options.file.name} must me less than ${options.maxSize /
            1024 /
            1024} MB`,
          'danger'
        )
        reader.abort()
      } else return true
    }
  }
  render(name, renderTo) {
    if (!name) return
    this.el = document.createElement('div')
    this.el.classList.add('file')
    this.el.innerHTML = `
    <div class="file-thumbnail"></div>
    <div class="file-name">${name}</div>
    <div class="file-loader"></div>
    `
    renderTo.appendChild(this.el)
    this.loader = this.el.querySelector('.file-loader')
  }
  loading(percent) {
    this.loader.style.width = percent + '%'
  }
  loaded(src) {
    const thumbnailBlock = this.el.querySelector('.file-thumbnail')
    thumbnailBlock.innerHTML = `
    <div class="file-remove">
      <span class="icons-cancel-button"></span>
    </div>
    <img
      src="${src}"
      alt=""
  />`
    thumbnailBlock
      .querySelector('.file-remove')
      .addEventListener('click', () => this.remove())
  }
  remove () {
    this.el.remove();
    this.onremove(this.id);
  }
}
File.formats = ['jpg', 'jpeg', 'gif', 'png', 'pdf']
File.isValid = file => {
  return (
    (file.type.match('image.*') || file.type.match('application/pdf')) &&
    ~File.formats.indexOf(file.name.split('.')[1])
  )
}
export default File
