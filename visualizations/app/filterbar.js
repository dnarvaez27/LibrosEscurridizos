import Filter from "./filter.js";

export default function initFilter(db) {
  db.collection("Editorials")
    .get()
    .then((querySnapshot) => {
      let cities = new Set();
      let names = new Set();
      let types = new Set();

      querySnapshot.forEach(doc => {
        const data = doc.data();
        cities.add(data.city);
        names.add(data.name);
        types.add(data.type);
      });

      const editorialsCityFilter = new Filter('Editorial-City', [...cities]);
      const editorialsNameFilter = new Filter('Editorial-Name', [...names]);
      const editorialsTypeFilter = new Filter('Editorial-Type', [...types]);

      console.log(editorialsCityFilter);
      console.log(editorialsNameFilter);
      console.log(editorialsTypeFilter);
    });
}
