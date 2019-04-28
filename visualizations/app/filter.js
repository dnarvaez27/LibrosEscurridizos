const _args = Symbol('args');

export default class Filter {
  constructor(name, args = []) {
    this.name = name;
    this[_args] = args.reduce((o, i) => {
      o[i] = false;
      return o;
    }, {});
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

  toString(){
    return `${this.name}: ${this.args}`;
  }
}
