import Filter from "./filter.js";

const _db = Symbol('db');
const _editorials = Symbol('db');
const _editors = Symbol('db');
const _illustrators = Symbol('db');
const _writters = Symbol('db');
const _stories = Symbol('db');

export class FilterBar {

  constructor(db) {
    this[_db] = db;
    this[_editorials] = undefined;
    this[_editors] = undefined;
    this[_illustrators] = undefined;
    this[_writters] = undefined;
    this[_stories] = undefined;
  }

  get editorials() {
    return this[_editorials];
  }

  setEditorials(data = null) {
    return dbToSet(this[_db], 'Editorials', { city: 'Editorial-Cities', name: 'Editorial-Names', type: 'Editorial-Types' }, data)
      .then(e => this[_editorials] = e);
  }

  get editors() {
    return this[_editors];
  }

  setEditors(data = null) {
    return dbToSet(this[_db], 'Editors', { gender: 'Editor-Genders' }, data)
      .then(e => this[_editors] = e);
  }

  get illustrators() {
    return this[_illustrators];
  }

  setIllustrators(data = null) {
    return dbToSet(this[_db], 'Illustrators', { gender: 'Illustrator-Genders' }, data)
      .then(i => this[_illustrators] = i);
  }

  get writters() {
    return this[_writters];
  }

  setWritters(data = null) {
    return dbToSet(this[_db], 'Writters', { gender: 'Writter-Genders' }, data)
      .then(w => this[_writters] = w);
  }

  get stories() {
    return this[_stories];
  }

  setStories(data = null) {
    return dbToSet(this[_db], 'Stories', { theme: 'Story-Themes', year: 'Story-Years' }, data)
      .then(s => this[_stories] = s);
  }

  init() {
    return this.setEditorials(null)
      .then(() => this.setEditors(null))
      .then(() => this.setIllustrators(null))
      .then(() => this.setWritters(null))
      .then(() => this.setStories(null));
  }
}

function iterateSnapshot(querySnapshot, fun, hasData = true) {
  querySnapshot.forEach(doc => {
    let data = hasData ? doc.data() : doc;
    fun(data);
  });
}

function dbToSet(db, collection, attrs, data = null) {

  function iterableToSet(iterable, hasData = true) {
    const sets = {};
    Object.keys(attrs).forEach(k => sets[k] = new Set());

    iterateSnapshot(iterable, data => {
      Object.keys(sets).forEach(a => sets[a].add(data[a]));
    }, hasData);

    return Object.keys(attrs).map(k => new Filter(attrs[k], [...sets[k]]))
  }

  if (data) {
    return new Promise((resolve, reject) => resolve(iterableToSet(data, false)));
  }
  else {
    return db.collection(collection)
      .get()
      .then(querySnapshot => iterableToSet(querySnapshot))
  }
}

export default function init(db) {
  function createBlock(filter, filters) {
    const container = document.createElement('div');
    filters.forEach(f => {
      const subcontainer = document.createElement('div');
      const title = document.createElement('span')
      title.innerText = f.name;
      const filtercontainer = document.createElement('div');
      console.log(f.filters);
      
      Object.keys(f.filters).forEach(ff => {
        const input = document.createElement('input');
        input.setAttribute('type', 'checkbox')
        input.setAttribute('name', filters.fi)
        input.setAttribute('value', f.name)
        input.setAttribute('id', `${f.name}_${ff}`);

        const text = document.createElement('label');
        text.setAttribute('for', `${f.name}_${ff}`);
        text.appendChild(document.createTextNode(ff));

        filtercontainer.appendChild(input);
        filtercontainer.appendChild(text);
        filtercontainer.appendChild(document.createElement('br'));
      });

      subcontainer.appendChild(title);
      subcontainer.appendChild(filtercontainer);
      container.appendChild(subcontainer);
    });

    filter.appendChild(container);
  }
  const logic = new FilterBar(db);
  const filter = document.getElementById('filter');

  logic.init()
    .then(() => {
      console.log(logic.stories);

      createBlock(filter, logic.editorials);
      createBlock(filter, logic.editors);
      createBlock(filter, logic.illustrators);
      createBlock(filter, logic.writters);

      createBlock(filter, logic.stories);
    });
}
