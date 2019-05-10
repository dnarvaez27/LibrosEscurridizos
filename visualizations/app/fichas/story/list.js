
function removeContent(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export default class LibrosList {
  constructor(clickHandler) {
    const firebase = window.firebase;
    this.db = firebase.firestore();
    this.libros = [];
    this.clickHandler = clickHandler;
  }

  drawList(list) {
    const table = document.getElementById('libros-list');
    removeContent(table);

    list.forEach(data => {
      const row = document.createElement('tr');
      row.addEventListener('click', () => this.clickHandler(data));
      const title = document.createElement('td');
      title.appendChild(document.createTextNode(data.titulo));
      row.appendChild(title);
      table.appendChild(row);
    });
  }

  getAll() {
    if (this.libros.length === 0) {
      this.db
        .collection('Libros')
        .get()
        .then(qs => qs.forEach(l => this.libros.push(l.data())))
        .then(() => this.drawList(this.libros));
    }
    else {
      this.drawList(this.libros);
    }
  }

  search(i) {
    this.drawList(this.libros.filter(l => l['titulo'].toUpperCase().includes(i.toUpperCase())));
  }
}
