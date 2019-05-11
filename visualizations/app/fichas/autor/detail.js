export default class AutorDetail {
    constructor(autor) {
      this.autor = autor;
      this.autor['descripcion'] = this.autor['descripcion'].replace('\\n', '<br>');
    }
    drawDetail() {
        this.clear();
        document.getElementById('nombre').appendChild(document.createTextNode(this.autor['nombre']));
        document.getElementById('genero').appendChild(document.createTextNode(this.autor['genero']));
        document.getElementById('descripcion').innerHTML = this.autor['descripcion'];
    }
    clear() {
      document.getElementById('nombre').innerHTML = '';
      document.getElementById('genero').innerHTML = '';
      document.getElementById('descripcion').innerHTML = '';
    }
  }