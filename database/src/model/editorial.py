from db.db_entity import DBEntity


class Editorial(DBEntity):

    def __init__(self, name, _type, description, city):
        super().__init__('Editoriales', {'name': name})

        self.name = name
        self.type = _type
        self.description = description
        self.city = city

    def to_dict(self):
        return {
            'nombre': self.name,
            'tipo': self.type,
            'descripcion': self.description,
            'ciudad': self.city
        }

    def __repr__(self):
        return 'Editorial(name={}, type={}, description={}, city={})'.format(self.name,
                                                                             self.type,
                                                                             self.description,
                                                                             self.city)
