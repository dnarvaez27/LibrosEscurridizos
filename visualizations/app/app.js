import FilterBar from "./filterbar.js";

const db = firebase.firestore();

FilterBar(db);

function solveStory(story) {
  return new Promise((resolve, reject) => {
    Promise.all(
      [
        story.editorial.get(),
        story.editors.get(),
        ...story.illustrators.map(i => i.get()),
        ...story.writters.map(w => w.get())
      ])
      .then(vals => {
        vals = vals.map(v => v.data());
        resolve({
          title: story.title,
          year: story.year,
          theme: story.theme,
          synopsis: story.synopsis,
          tags: story.tags,

          editorial: vals[0],
          editor: vals[1],
          illustrators: vals.slice(2, 2 + story.illustrators.length),
          writters: vals.slice(2 + story.illustrators.length),
        });
      })
      .catch(reject)
  })
}

function fetchStories() {
  db.collection("Stories")
    .get()
    .then((querySnapshot) => {
      let docs = [];
      querySnapshot.forEach(doc => docs.push(solveStory(doc.data())));

      Promise.all(docs)
        .then((vals) => {
          const viz = d3.select('#viz')
          viz
            .append('ul')
            .selectAll('li')
            .data(vals)
            .enter()
            .append('li')
            .text(d => JSON.stringify(d));
        })
    });
}
