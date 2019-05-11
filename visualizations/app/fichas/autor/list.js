function removeContent(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }
  export default class AutorList {
    constructor(clickHandler) {
      const firebase = window.firebase;
      this.db = firebase.firestore();
      this.autores = [];
      this.clickHandler = clickHandler;
    }

    drawList(list) {
      const table = document.getElementById('porAutor');
      removeContent(table);
      list.forEach(data => {
        const row = document.createElement('tr');
        row.addEventListener('click', () => this.clickHandler(data));
        const title = document.createElement('td');
        title.appendChild(document.createTextNode(data.nombre));
        row.appendChild(title);
        table.appendChild(row);
      });
    }
  
    getAll() {
      if (this.autores.length === 0) {
        this.db
          .collection('Escritores')
          .get()
          .then(qs => qs.forEach(l => this.autores.push(l.data())))
          .then(() => this.drawList(this.autores));
      }
      else {
        this.drawList(this.libros);
      }
    }
    search(i) {
      this.drawList(this.autores.filter(l => l['nombre'].toUpperCase().includes(i.toUpperCase())));
    }
  }