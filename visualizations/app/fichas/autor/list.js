function removeContent(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }
  export default class AutorList {
    constructor() {
      const firebase = window.firebase;
      this.db = firebase.firestore();
      this.autores = [];
    }

    static drawList(list) {

        function addClick(data) {
          return () => {
            console.log(data);
          };
        }
    
        const table = document.getElementById('porAutor');
        removeContent(table);
    
        list.forEach(data => {
          const row = document.createElement('tr');
          row.addEventListener('click', addClick(data));
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
          .then(() => AutorList.drawList(this.autores));
      }
      else {
        AutorList.drawList(this.libros);
      }
    }
    search(i) {
      AutorList.drawList(this.autores.filter(l => l['nombre'].toUpperCase().includes(i.toUpperCase())));
    }
  }