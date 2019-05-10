export default class LibroDetail {
  constructor(libro) {
    this.libro = libro;
    this.libro['sinopsis'] = this.libro['sinopsis'].replace('\\n', '<br>');
  }

  drawDetail() {
    Promise
      .all(this.libro['escritores'].map(e => e.get()))
      .then(values => Promise.all(values))
      .then(es => this.libro['escritores'] = es.map(e => e.data()))
      .then(() => Promise.all(this.libro['ilustradores'].map(e => e.get())))
      .then(ils => this.libro['ilustradores'] = ils.map(i => i.data()))
      .then(() => this.libro['editorial'].get())
      .then(editorial => this.libro['editorial'] = editorial.data())
      .then(() => {
        this.clear();
        document.getElementById('titulo').appendChild(document.createTextNode(this.libro['titulo']));
        document.getElementById('anio').appendChild(document.createTextNode(this.libro['anio']));
        document.getElementById('tema').appendChild(document.createTextNode(this.libro['tema']));
        document.getElementById('editorial').appendChild(document.createTextNode(this.libro['editorial']['nombre']));
        document.getElementById('sinopsis').innerHTML = this.libro['sinopsis'];
        const tags = document.getElementById('tags');
        this.libro['tags'].forEach(t => {
          if (t) {
            const sp = document.createElement('span');
            sp.appendChild(document.createTextNode(t));
            tags.appendChild(sp);
          }
        });
        const escritores = document.getElementById('escritores');
        this.libro['escritores'].forEach(e => {
          const span = document.createElement('span');
          span.appendChild(document.createTextNode(e['nombre']));
          escritores.appendChild(span);
        });
        const ilustradores = document.getElementById('ilustradores');
        this.libro['ilustradores'].forEach(e => {
          const span = document.createElement('span');
          span.appendChild(document.createTextNode(e['nombre']));
          ilustradores.appendChild(span);
        });

      });
  }

  clear() {
    document.getElementById('titulo').innerHTML = '';
    document.getElementById('anio').innerHTML = '';
    document.getElementById('tema').innerHTML = '';
    document.getElementById('sinopsis').innerHTML = '';
    document.getElementById('tags').innerHTML = '';
    document.getElementById('editorial').innerHTML = '';
    document.getElementById('ilustradores').innerHTML = '';
    document.getElementById('escritores').innerHTML = '';
  }
}