function removeContent(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }
  export default class EditorialList {
    constructor(clickHandler) {
      const firebase = window.firebase;
      this.db = firebase.firestore();
      this.editoriales = [];
      this.clickHandler = clickHandler;
    }

    drawList(list) {
      const table = document.getElementById('porEditorial');
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
      if (this.editoriales.length === 0) {
        this.db
          .collection('Editoriales')
          .get()
          .then(qs => qs.forEach(l => this.editoriales.push(l.data())))
          .then(() => this.drawList(this.editoriales));
      }
      else {
        this.drawList(this.editoriales);
      }
    }
    search(i) {
      this.drawList(this.editoriales.filter(l => l['nombre'].toUpperCase().includes(i.toUpperCase())));
    }
  }