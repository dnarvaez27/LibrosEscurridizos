const _db = Symbol('db');

export default class Story {
  constructor(db, qs) {
    this[_db] = db;

    const data = qs.data();

    this['title'] = data['title'];
    this['year'] = data['year'];
    this['theme'] = data['theme'];
    this['synopsis'] = data['synopsis'];
    this['tags'] = data['tags'];

    this['editorial'] = data['editorial'];
    this['editors'] = data['editors'];
    this['illustrators'] = data['illustrators'];
    this['writters'] = data['writters'];
  }

  fetch_editorial() {
    return this.fetchAttribute('editorial');
  }

  fetch_editor() {
    return this.fetchAttribute('editor');
  }

  fetch_illustrators() {
    return this.fetchAttributes('illustrators');
  }

  fetch_writters() {
    return this.fetchAttributes('writters');
  }

  fetchAttribute(attr) {
    return this[attr].get()
      .then(value => {
        this[attr] = value.data();
        return this;
      })
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
