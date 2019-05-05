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

  fillOpts() {

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

    const config = {
      'radius': 50,
      'fill': '#212121',
      'padding': 10,
      'font-size': '0.8em'
    };

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

    const _nodes = this[_entities].map(e => ({ id: e }));
    const _links = Object.keys(this[_depGraph])
      .filter(d => this[_depGraph][d])
      .map(d => ({ target: d, source: this[_depGraph][d] }));
    const _selected = [];

    const d3 = window.d3;
    const svg = d3.select('#entities');

    const dims = svg.node().getBoundingClientRect();
    const width = dims['width'];

    const simulation = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(config['radius'] * 3).strength(0.1))
      .force('charge', d3.forceManyBody().strength(-config['radius']))
      .force('collide', d3.forceCollide().radius(config['radius']))
      .force('center', d3.forceCenter().x(width / 2).y(config['radius'] + config['padding']))
      .force('forceY', d3.forceY().y(config['radius'] * 2 + config['padding']).strength(1));

    const position = (d, i, c) => {
      // const x = width / 2 + (config['radius'] * 2 + config['padding']) * (i - _nodes.length / 2);
      const t = d3.select(c[i]).attr('transform');
      if (t) {
        const x = +t.match(/\([\d.]+/g)[0].slice(1);
        const y = config['radius'] + config['padding'] + (d.added ? config['radius'] * 2 : 0);
        return `translate(${x}, ${y})`;
      }
    };

    const nodes = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(_nodes)
      .enter()
      .append('g')
      .on('click', (d, i, c) => {
        if (!d.disabled) {
          d.added = !d.added;
          d3.select(c[i])
            .transition()
            .ease(d3.easeQuad)
            .duration(200)
            .attr('transform', position(d, i, c));
        }
      })
      // .attr('transform', position);

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

    const links = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(_links)
      .enter()
      .append('line')
      .attr('stroke-width', config['stroke-width'])
      .attr('stroke', config['stroke']);

    simulation
      .nodes(_nodes)
      .on('tick', () => {
        links
          .attr('x1', d => d.source.x + Math.cos(getAngle(d)) * config['radius'])
          .attr('y1', d => d.source.y + Math.sin(getAngle(d)) * config['radius'])
          .attr('x2', d => d.target.x - Math.cos(getAngle(d)) * config['radius'])
          .attr('y2', d => d.target.y - Math.sin(getAngle(d)) * config['radius']);

        nodes.attr('transform', d => `translate(${d.x}, ${d.y})`);
      });

    simulation
      .force('link')
      .links(_links);
  }
}
