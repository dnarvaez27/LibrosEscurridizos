export default class EditorialDetail {
    constructor(editorial) {
      this.editorial = editorial;
      this.editorial['descripcion'] = this.editorial['descripcion'].replace('\\n', '<br>');
    }
    drawDetail() {
        this.clear();
        document.getElementById('nombre').appendChild(document.createTextNode(this.editorial['nombre']));
        document.getElementById('tipo').appendChild(document.createTextNode(this.editorial['tipo']));
        document.getElementById('descripcion').innerHTML = this.editorial['descripcion'];
    }
    clear() {
      document.getElementById('nombre').innerHTML = '';
      document.getElementById('tipo').innerHTML = '';
      document.getElementById('descripcion').innerHTML = '';
    }
  }