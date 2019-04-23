import file_parser
from db import DB
from model.person import Person
from model.editorial import Editorial
from model.story import Story


def run(path, separator=';', min_separator='@'):
    database = DB('./firebase/firebase-config-key.json').get_db()
    file = file_parser.load(path, separator=separator)
    for entry in file:
        story = Story(title=entry['Título'],
                      year=entry['Año de publicación'],
                      theme=entry['Tema'],
                      tags=entry['Tags'],
                      synopsis=entry['Sinopsis'])

        writters = file_parser.multi_list(entry['Escritor'],
                                          entry['Género escritor'],
                                          entry['Descripción escritor'],
                                          headers=['Escritor', 'Género escritor', 'Descripción escritor'],
                                          separator=min_separator)
        for _writter in writters:
            story.add_writter(Person(_type="Writter",
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
            story.add_illustrator(Person(_type='Illustrator',
                                         name=_illustrator['Ilustrador'],
                                         gender=_illustrator['Género ilustrador'],
                                         description=_illustrator['Descripción ilustrador'])
                                  .save_or_get(database))

        editors = file_parser.multi_list(entry['Editor'],
                                         entry['Género editor'],
                                         entry['Descripción editor'],
                                         headers=['Editor', 'Género editor', 'Descripción editor'],
                                         separator=min_separator)
        for _editor in editors:
            story.add_editor(Person(_type='Editor',
                                    name=_editor['Editor'],
                                    gender=_editor['Género editor'],
                                    description=_editor['Descripción editor'])
                             .save_or_get(database))

        story.set_editorial(Editorial(name=entry['Editorial'],
                                      _type=entry['Tipo de editorial'],
                                      description=entry['Descripción editorial'],
                                      city=entry['Ciudad'])
                            .save_or_get(database))

        story.save(database)


if __name__ == "__main__":
    run('./data/Base de datos.csv', separator=';', min_separator='@')
