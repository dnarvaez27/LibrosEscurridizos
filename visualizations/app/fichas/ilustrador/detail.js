export default class IlustradorDetail {
    constructor(ilustrador) {
      this.ilustrador = ilustrador;
      this.ilustrador['descripcion'] = this.ilustrador['descripcion'].replace('\\n', '<br>');
    }
    drawDetail() {
        this.clear();
        document.getElementById('nombre').appendChild(document.createTextNode(this.ilustrador['nombre']));
        document.getElementById('genero').appendChild(document.createTextNode(this.ilustrador['genero']));
        document.getElementById('descripcion').innerHTML = this.ilustrador['descripcion'];
    }
    clear() {
      document.getElementById('nombre').innerHTML = '';
      document.getElementById('genero').innerHTML = '';
      document.getElementById('descripcion').innerHTML = '';
    }
  }