import file_parser
from db.database import DB
from model.person import Person
from model.editorial import Editorial
from model.story import Story
import json

def run(path, db_config_file, separator=';', min_separator='@', tag_separator=','):
    database = DB(db_config_file).database
    file = file_parser.load(path, separator=separator)
    for entry in file:
        print(json.dumps(entry, indent=2, ensure_ascii=False))

        story = Story(title=entry['Título'],
                      year=entry['Año publicación'],
                      theme=entry['Tema'],
                      tags=[a.strip().upper() for a in entry['Tags'].split(tag_separator)],
                      synopsis=entry['Sinopsis'])

        writters = file_parser.multi_list(entry['Escritor'],
                                          entry['Género escritor'],
                                          entry['Descripción escritor'],
                                          headers=['Escritor', 'Género escritor', 'Descripción escritor'],
                                          separator=min_separator)
        for _writter in writters:
            story.add_writter(Person(_type="Escritor",
                                     name=_writter['Escritor'],
                                     gender=_writter['Género escritor'],
                                     description=_writter['Descripción escritor'])
                              .save_or_get(database))

        illustrators = file_parser.multi_list(entry['Ilustrador'],
                                              entry['Género ilustrador'],
                                              entry['Descripción ilustrador'],
                                              headers=['Ilustrador', 'Género ilustrador', 'Descripción ilustrador'],
                                              separator=min_separator)
        for _illustrator in illustrators:
            story.add_illustrator(Person(_type='Ilustrador',
                                         name=_illustrator['Ilustrador'],
                                         gender=_illustrator['Género ilustrador'],
                                         description=_illustrator['Descripción ilustrador'])
                                  .save_or_get(database))

        story.set_editorial(Editorial(name=entry['Editorial'],
                                      _type=entry['Tipo de editorial'],
                                      description=entry['Descripción editorial'],
                                      city=entry['Ciudad'])
                            .save_or_get(database))

        story.save(database)


if __name__ == "__main__":
    run('./data/Base de datos.csv', '../firebase-config-key.json', separator='|', min_separator='@')
