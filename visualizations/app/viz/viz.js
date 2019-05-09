import Story from '../story.js';

const _db = Symbol('db');
const d3 = window.d3;

export default class Viz {
  constructor(db) {
    this[_db] = db;
  }

  editorialWritter(svg_id) {
    const stories = [];
    this[_db].collection('Libros')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(s => {
          const st = new Story(this[_db], s);
          const p = st.fetch_writters()
            .then(s => s.fetch_editorial())
            .then(s => s.fetch_illustrators());
          stories.push(p);
        });
        return stories;
      })
      .then(ps => Promise.all(ps))
      .then(stories => {
        const editorials = {};

        stories.forEach(s => {
          const key = `${s['editorial']['nombre']} (${s['editorial']['ciudad']})`;
          if (!(key in editorials)) {
            editorials[key] = { type: 'Editorial', links: [], classname: s['editorial']['tipo'] };
          }
          editorials[key]['links'] = [
            ...editorials[key]['links'],
            ...(s['escritores'].map(w => ({ id: w['nombre'], type: 'Escritor' }))),
            ...(s['ilustradores'].map(w => ({ id: w['nombre'], type: 'Ilustrador' })))
          ];
        });

        makeGraph(svg_id, dictToGraph(editorials));
      });
  }

  editorialTheme(svg_id) {
    const stories = [];
    this[_db].collection('Libros')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(s => {
          const st = new Story(this[_db], s);
          stories.push(st.fetch_editorial());
        });
        return stories;
      })
      .then(sp => Promise.all(sp))
      .then(stories => {
        const editorials = {};
        stories.forEach(s => {
          const key = `${s['editorial']['nombre']} (${s['editorial']['ciudad']})`;

          if (!(key in editorials)) {
            editorials[key] = { type: 'Editorial', links: [], 'classname': s['editorial']['tipo'] };
          }
          editorials[key]['links'].push({ id: s['tema'], type: 'Tema' });
        });

        const d = dictToGraph(editorials);

        const t = {};
        d.links.forEach(l => {
          if (!(l.target in t)) {
            t[l.target] = 0;
          }
          t[l.target] = t[l.target] + 1;
        });

        d.nodes.forEach(n => {
          if (n.type === 'Tema') {
            if (n.id in t) {
              n.rad = t[n.id];
            }
          }
        });

        makeGraph(svg_id, d);
      });
  }
}

function dictToGraph(dict) {

  let nodes = {};
  let links = [];

  Object.keys(dict).forEach(n => {
    if (!(n in nodes)) {
      nodes[n] = { id: n, type: dict[n]['type'], 'classname': dict[n]['classname'] };
    }
    dict[n]['links'].forEach(l => {
      if (!(l['id'] in nodes)) {
        nodes[l['id']] = l;
      }
    });
    dict[n]['links'].forEach(nd => links.push({ source: n, target: nd['id'] }));
  });
  return { nodes: Object.values(nodes), links };
}

function makeGraph(_id, graph, _config = {}) {
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
    radius: 'radius' in _config ? _config['radius'] : 50,
    fill: 'fill' in _config ? _config['fill'] : '#212121',
    height: 'height' in _config ? _config['height'] : '500',
    width: 'width' in _config ? _config['width'] : '1000',
    'stroke-width': 'stroke-width' in _config ? _config['stroke-width'] : 2,
    stroke: 'stroke' in _config ? _config['stroke'] : '#DDDDDD',
    'font-size': 'font-size' in _config ? _config['font-size'] : '0.8em'
  };

  const svg = d3
    .select(_id);

  const dims = svg.node().getBoundingClientRect();

  const height = dims['height'];
  const width = dims['width'];

  const simulation = d3
    .forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).strength(.3).distance(d => d.rad ? (d.rad * config['radius'] * 5) + config['radius'] : config['radius'] * 5))
    .force('charge', d3.forceManyBody().strength(d => -(d.rad || 1) * config['radius'] * 5))
    .force('collide', d3.forceCollide().radius(d => d.rad ? (d.rad * config['radius'] / 5) + config['radius'] : config['radius']))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const g = svg.append('g');

  svg.call(d3
    .zoom()
    .scaleExtent([0.1, 10]) // Boundaries of zoom
    .on('zoom', () => g.attr('transform', d3.event.transform))
  );

  const links = g
    .append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(graph.links)
    .enter()
    .append('line')
    .attr('stroke-width', config['stroke-width'])
    .attr('stroke', config['stroke']);

  const nodes = g
    .append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(graph.nodes)
    .enter()
    .append('g')
    .attr('class', n => `node_${n.type} ${n['classname']}`)
    .call(d3.drag()
      .on('start', d => {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', d => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      })
      .on('end', d => {
        if (!d3.event.active) simulation.alphaTarget(0.0001);
        d.fx = null;
        d.fy = null;
      })
    );


  nodes
    .append('circle')
    .attr('r', d => d.rad ? (d.rad * config['radius'] / 5) + config['radius'] : config['radius'])
    .attr('fill', config['fill']);

  nodes
    .append('text')
    .text(d => `${d.type}:\n${d.id}`)
    .call(wrap, config['radius'] * 2)
    .attr('fill', 'white')
    .attr('stroke', 'black')
    .attr('stroke-width', '0.1');

  simulation
    .nodes(graph.nodes)
    .on('tick', () => {
      links
        .attr('x1', d => d.source.x + Math.cos(getAngle(d)) * config['radius'])
        .attr('y1', d => d.source.y + Math.sin(getAngle(d)) * config['radius'])
        .attr('x2', d => d.target.x - Math.cos(getAngle(d)) * config['radius'])
        .attr('y2', d => d.target.y - Math.sin(getAngle(d)) * config['radius']);

      nodes
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

  simulation
    .force('link')
    .links(graph.links);

  function wrap(text, width) {
    function group(text, words, num = -0.5) {
      let
        line = [],
        lineNumber = 0,
        lineHeight = 1, // ems
        dy = num,
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
}