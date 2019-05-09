const _db = Symbol('db');

export default class Story {
  constructor(db, qs) {
    this[_db] = db;

    const data = qs.data();

    this['titulo'] = data['titulo'];
    this['anio'] = data['anio'];
    this['tema'] = data['tema'];
    this['sinopsis'] = data['sinopsis'];
    this['tags'] = data['tags'];

    this['editorial'] = data['editorial'];
    this['ilustradores'] = data['ilustradores'];
    this['escritores'] = data['escritores'];
  }

  fetch_editorial() {
    return this.fetchAttribute('editorial');
  }

  fetch_illustrators() {
    return this.fetchAttributes('ilustradores');
  }

  fetch_writters() {
    return this.fetchAttributes('escritores');
  }

  fetchAttribute(attr) {
    return this[attr].get()
      .then(value => {
        this[attr] = value.data();
        return this;
      });
  }

  fetchAttributes(attr) {
    return Promise.all(this[attr].map(a => a.get()))
      .then(values => {
        this[attr] = values.map(v => v.data());
        return this;
      });
  }

  detail() {
    return Promise.all(
      [
        this['editorial'].get(),
        this['editors'].get(),
        ...this['illustrators'].map(i => i.get()),
        ...this['writters'].map(w => w.get())
      ])
      .then(values => {
        values = values.map(v => v.data());

        this['editorial'] = values[0];
        this['editor'] = values[1];
        this['illustrators'] = values[2];
        this['writters'] = values[3];

        return this;
      })
  }
}
