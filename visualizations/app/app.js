import initFilterBar from './filter/filterbar.js';
import Viz from './viz/viz.js';
import Query from './query/query.js';

const firebase = window.firebase;
const db = firebase.firestore();

const q = new Query(db);
// q.findDependency(q.entities[0], q.entities[2]);
q.fillOpts();

// initFilterBar(db);

// const viz = new Viz(db);
// viz.editorialWritter();
// viz.editorialTheme('#viz1');

