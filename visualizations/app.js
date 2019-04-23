const db = firebase.firestore();

class Story {
  constructor(story) {
    this.title = story.title;
    this.year = story.year;
    this.theme = story.theme;
    this.synopsis = story.synopsis;
    this.tags = story.tags;
    this.illustrators = [];
    this.writters = [];

    Promise.all(
      [
        story.editorial.get(),
        story.editors.get(),
        ...story.illustrators.map(i => i.get()),
        ...story.writters.map(w => w.get())
      ])
      .then(vals => {
        vals = vals.map(v => v.data());

        this.editorial = vals[0];
        this.editor = vals[1];
        this.illustrators = vals.slice(2, 2 + story.illustrators.length);
        this.writters = vals.slice(2 + story.illustrators.length);
      })
  }
}


db.collection("Stories")
  .get()
  .then((querySnapshot) => {
    let docs = [];
    querySnapshot.forEach(doc => docs.push(new Story(doc.data())));
    console.log(docs);

    const viz = d3.select('#viz')
    viz
      .append('ul')
      .selectAll('li')
      .data(docs)
      .enter()
      .append('li')
      .text(d => JSON.stringify(d));
  });
