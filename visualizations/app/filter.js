const _args = Symbol('args');
const _name = Symbol('name');

export default class Filter {
  constructor(name, args = []) {
    this[_name] = name;
    this[_args] = args.reduce((o, i) => {
      o[i] = false;
      return o;
    }, {});
  }

  get name() {
    return this[_name];
  }

  hasArg(arg) {
    return arg in this[_args];
  }

  setFilter(arg, bool) {
    this[_args][arg] = bool;
    return this[_args][arg];
  }

  getFilter(arg) {
    return this[_args][arg];
  }

  get filters() {
    return this[_args];
  }

  toString() {
    return `${this[_name]}: ${JSON.stringify(this[_args])}`;
  }
}
