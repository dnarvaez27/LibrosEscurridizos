const _entities = Symbol('entities');
const _depGraph = Symbol('depGraph');
const _operatros = Symbol('operators');
const _db = Symbol('db');

export default class Query {
  constructor(db) {
    this[_entities] = [
      'Editorial',
      'Editor',
      'Illustrator',
      'Writter',
      'Story'
    ];
    this[_depGraph] = {
      'Editorial': 'Story',
      'Editor': 'Story',
      'Illustrator': 'Story',
      'Writter': 'Story',
      'Story': 'undefined',
    };
    this[_operatros] = {
      'count': { type: 'numerical' },
      'avg': { type: 'numerical' },
      'graph': { type: 'relational' },
    };
    this[_db] = db;
  }

  get entities() {
    return this[_entities];
  }

  findDependency(a, b) {
    const getRoot = (i) => {
      if (i) {
        return [i, ...getRoot(this[_depGraph][i])];
      }
      return [];
    };
    const path = (p1, p2) => {
      const marked = {};
      let i1 = -1;
      let i2 = -1;

      p1.forEach((i, k) => marked[i] = k);
      p2.every((i, k) => {
        if (i in marked) {
          i1 = k;
          i2 = marked[i];
          return false;
        }
        return true;
      });

      const path1 = p1.slice(0, i1 + 1);
      const path2 = p2.slice(0, i2 + 1);

      return [path1, path2];
    };

    const dep_a = getRoot(a);
    const dep_b = getRoot(b);

    return path(dep_a, dep_b);
  }

  count(a, b, deps) {

  }

  fillOpts() {
    const entitites = document.getElementById('entities');
    this[_entities].forEach(e => {
      const container = document.createElement('div');
      const cbx = document.createElement('input');
      cbx.setAttribute('type', 'checkbox');
      cbx.setAttribute('id', e);
      const label = document.createElement('label');
      label.appendChild(document.createTextNode(e));
      label.setAttribute('for', e);

      container.appendChild(cbx);
      container.appendChild(label);
      entitites.appendChild(container);
    });
  }
}
