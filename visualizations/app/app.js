import initFilterBar from './filter/filterbar.js';
import Viz from './viz/viz.js';

const firebase = window.firebase;
const db = firebase.firestore();
initFilterBar(db);

const viz = new Viz(db);
// viz.editorialWritter();
viz.editorialTheme('#viz1');
