const _entities = Symbol('entities');
const _depGraph = Symbol('depGraph');
const _operatros = Symbol('operators');
const _db = Symbol('db');

export default class Query {
  constructor(db) {
    this[_entities] = [
      'Editorials',
      'Editors',
      'Stories',
      'Illustrators',
      'Writters'
    ];
    this[_depGraph] = {
      'Editorials': 'Stories',
      'Editors': 'Stories',
      'Illustrators': 'Stories',
      'Writters': 'Stories',
      'Story': undefined,
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

  findDependants(a) {
    return Object.keys(this[_depGraph]).filter(d => this[_depGraph][d] === a);
  }

  findDependency(a, b = undefined) {
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

  fillOpts(id) {
    const d3 = window.d3;

    const lines = (a, elem) => {
      const [x, y] = d3.select(elem).attr('transform').match(/[0-9.]+/g);

      const _out = this.findDependants(a);
      const _in = this[_depGraph][a];

      if (_out) {
        _out.forEach(o => {
          const dd = d3.select(`#node_${o}`);
          const tr0 = dd.attr('transform').match(/[0-9.]+/g);
          const d0 = { x: tr0[0], y: tr0[1] };


          const angle = getAngle({ source: { x: +x, y: +y }, target: { x: d0.x, y: d0.y } });

          const data = [
            {
              x: +x + Math.cos(angle) * config['radius'],
              y: +y + Math.sin(angle) * config['radius']
            },
            {
              x: d0.x - Math.cos(angle) * config['radius'],
              y: d0.y - Math.sin(angle) * config['radius']
            }
          ];

          links
            .append('path')
            .attr('id', `line_${o}`)
            .attr('class', `node_path ${a} ${o}`)
            .style('fill', 'none')
            .style('stroke', '#707070')
            .style('stroke-width', '3px')
            .attr('d', line(data));
        });
        if (_in) {
          const o = _in;
          const dd = d3.select(`#node_${o}`);
          const tr0 = dd.attr('transform').match(/[0-9.]+/g);
          const d0 = { x: tr0[0], y: tr0[1] };

          const angle = getAngle({ source: { x: +x, y: +y }, target: { x: d0.x, y: d0.y } });

          const data = [
            {
              x: +x + Math.cos(angle) * config['radius'],
              y: +y + Math.sin(angle) * config['radius']
            },
            {
              x: d0.x - Math.cos(angle) * config['radius'],
              y: d0.y - Math.sin(angle) * config['radius']
            }
          ];

          links
            .append('path')
            .attr('id', `line_${o}`)
            .attr('class', `node_path ${a} ${o}`)
            .style('fill', 'none')
            .style('stroke', '#707070')
            .style('stroke-width', '3px')
            .attr('d', line(data));
        }
      }
    };

    const angles = {};
    function getAngle(d) {
      const a = d.target.y - d.source.y;
      const b = d.target.x - d.source.x;

      const key = (a / b).toFixed(4);
      if (!(key in angles)) {
        const angle = Math.atan2(a, b).toFixed(4);
        angles[key] = +angle;
      }
      return angles[key];
    }

    function wrap(text, width) {
      function group(text, words) {
        let
          line = [],
          lineNumber = 0,
          lineHeight = 1, // ems
          dy = 0.5,
          tspan = text
            .append('tspan')
            .attr('x', 0)
            .attr('y', text.attr('y'))
            .attr('dy', `${dy}em`)
            .style('font-size', config['font-size'])
            .attr('text-anchor', 'middle');

        words.forEach(word => {
          line.push(word);

          tspan.text(line.join(' '));
          const textWidth = tspan.node().getComputedTextLength();

          if (textWidth > width) {
            line.pop();
            tspan.text(line.join(' '));

            line = [word];

            tspan = text
              .append('tspan')
              .style('font-size', config['font-size'])
              .attr('x', 0)
              .attr('y', text.attr('y'))
              .attr('dy', `${Math.min(lineNumber, 1) * lineHeight}em`)
              .text(word)
              .attr('text-anchor', 'middle');
          }
          lineNumber++;
        });
      }

      text.each(function () {
        let text = d3.select(this);
        const groups = text.text().split(/\n/);
        text.text(null);
        groups.forEach((g, i) => {
          group(text, g.split(/\s+/), i === 0 ? -0.5 : 1);
        });
      });
    }

    const position = (d, i, c) => {
      // const x = width / 2 + (config['radius'] * 2 + config['padding']) * (i - _nodes.length / 2);
      const t = d3.select(c[i]).attr('transform');
      if (t) {
        const x = +t.match(/\([\d.]+/g)[0].slice(1);
        const y = config['radius'] + config['padding'] + (d.added ? config['radius'] * 3 : 0);
        return [x, y];
      }
    };

    const line = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveBasis);

    const config = {
      'radius': 50,
      'fill': '#212121',
      'padding': 10,
      'font-size': '0.8em',
      'stroke-width': 2,
      'stroke': 'red'
    };

    let _selected = [];
    const _nodes = this[_entities].map(e => ({ id: e }));

    const svg = d3.select(id);

    const dims = svg.node().getBoundingClientRect();
    const width = dims['width'];

    const simulation = d3
      .forceSimulation()
      .force('charge', d3.forceManyBody().strength(-config['radius']))
      .force('collide', d3.forceCollide().radius(config['radius']))
      .force('center', d3.forceCenter().x(width / 2).y(config['radius'] + config['padding']))
      .force('forceY', d3.forceY().y(config['radius'] + config['padding']).strength(1));


    const links = svg
      .append('g')
      .attr('class', 'links');

    const nodes = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(_nodes, d => d.id)
      .enter()
      .append('g')
      .attr('id', d => `node_${d.id}`);

    nodes.append('g');

    nodes
      .on('click', (d, i, c) => {
        if (!d.disabled) {
          d.added = !d.added;

          const [x, y] = position(d, i, c);
          d3.select(c[i])
            .transition()
            .ease(d3.easeQuad)
            .duration(100)
            .attr('transform', `translate(${x}, ${y})`)
            .attr('x', x)
            .attr('y', y)
            .on('start', (_, i, c) => {
              if (!d.added) {
                _selected = _selected.filter(e => e[0] !== d.id);
              }
              else {
                _selected.push([d.id, c[i]]);
              }
              links
                .selectAll('.node_path')
                .remove();
            })
            .on('end', (_, i, c) => {
              _selected.forEach(s => lines(s[0], s[1]));
              if (d.added) {
                d3.select(c[i])
                  .append('foreignObject')
                  .attr('class', 'config')
                  .attr('x', '-10')
                  .attr('y', `${config['radius'] - 20}`)
                  .attr('width', '20')
                  .attr('height', '20')
                  .append('xhtml:button')
                  .style('width', '20px')
                  .attr('onclick', '() => {alert(123);}')
                  .append('i')
                  .attr('class', 'fas fa-cog');
              }
              else {
                d3.select(c[i])
                  .select('foreignObject.config')
                  .remove();
              }
            });
        }
      })
      .on('contextmenu', (d, i, c) => {
        if (d.added) {
          d3.event.preventDefault();
        }
      });

    nodes
      .append('circle')
      .attr('r', config['radius'])
      .attr('fill', config['fill']);

    nodes
      .append('text')
      .text(d => d.id)
      .call(wrap, config['radius'] * 2)
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', '0.1');

    simulation
      .nodes(_nodes)
      .on('tick', () => {
        nodes.attr('transform', d => `translate(${d.x}, ${d.y})`);
      });
  }

  static match(a) {
    if (a.toLowerCase() === 'editorials') {
      return 'editorial';
    }
    return a;
  }

  make(arr) {

    function same_from_one(qs, start, end) {
      const data = {};
      qs.forEach(q => {
        const d = q.data();
        if (!(d[start[1]] in data)) {
          data[d[start[1]]] = [];
        }

        if (d[end[1]] instanceof Array) {
          data[d[start[1]]] = [...data[d[start[1]]], ...d[end[1]]];
        }
        else {
          data[d[start[1]]].push(d[end[1]]);
        }
      });
      return data;
    }

    function diff_from_one(qs, start, end) {
      const arr = [];
      qs.forEach(s => {
        const data = s.data();
        const _at = Query.match(end[0].toLowerCase());

        if (data[_at] instanceof Array) {
          arr.push(
            Promise
              .all(data[_at].map(i => i.get()))
              .then(d => {
                data[_at] = d.map(i => i.data());
                return data;
              })
          );
        }
        else {
          arr.push(
            data[_at]
              .get()
              .then(res => {
                data[_at] = res.data();
                return data;
              })
          );
        }
      });

      return Promise
        .all(arr)
        .then(entities => {
          const data = {};
          entities.forEach(entry => {
            const attr1 = entry[Query.match(end[0].toLowerCase())];
            if (attr1 instanceof Array) {
              attr1.forEach(a => {
                if (!(a[end[1]] in data)) {
                  data[a[end[1]]] = [];
                }
                data[a[end[1]]].push(entry[start[1]]);
              });
            }
            else {
              if (!(attr1[end[1]] in data)) {
                data[attr1[end[1]]] = [];
              }
              data[attr1[end[1]]].push(entry[start[1]]);
            }
          });
          return data;
        });
    }

    if (arr.length === 2) {
      const end = arr[0];
      const start = arr[1];

      if (end[0] === start[0]) {
        this[_db]
          .collection(start[0])
          .get()
          .then(qs => same_from_one(qs, start, end))
          .then(data => console.log(data));
      }
      else {
        if (this[_depGraph][end[0]] === start[0]) {
          this[_db].collection(start[0])
            .get()
            .then(qs => diff_from_one(qs, start, end))
            .then(data => console.log(data));
        }
        else if(this[_depGraph][start[0]] === end[0]){
          console.log(123);
          
          this[_db].collection(end[0])
            .get()
            .then(qs => diff_from_one(qs, end, start))
            .then(data => console.log(data));
        }
      }
    }
    else if (arr.length === 3) {
      
    }
  }
}
