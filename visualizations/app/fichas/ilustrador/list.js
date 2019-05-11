function removeContent(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }
  export default class IlustradorList {
    constructor(clickHandler) {
      const firebase = window.firebase;
      this.db = firebase.firestore();
      this.ilustradores = [];
      this.clickHandler = clickHandler;
    }

    drawList(list) {
        const table = document.getElementById('porIlustrador');
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
      if (this.ilustradores.length === 0) {
        this.db
          .collection('Ilustradores')
          .get()
          .then(qs => qs.forEach(l => this.ilustradores.push(l.data())))
          .then(() => this.drawList(this.ilustradores));
      }
      else {
        this.drawList(this.ilustradores);
      }
    }
    search(i) {
      this.drawList(this.ilustradores.filter(l => l['nombre'].toUpperCase().includes(i.toUpperCase())));
    }
  }