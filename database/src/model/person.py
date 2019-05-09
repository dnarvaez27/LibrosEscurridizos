from db.db_entity import DBEntity


class Person(DBEntity):
    def __init__(self, _type, name, gender, description):
        super().__init__("{}es".format(_type), {'name': name})

        self.type = _type
        self.name = name
        self.gender = gender
        self.description = description

    def to_dict(self):
        return {
            'nombre': self.name,
            'genero': self.gender,
            'descripcion': self.description
        }

    def __repr__(self):
        return '{}(name={}, gender={}, description={})'.format(self.type,
                                                               self.name,
                                                               self.gender,
                                                               self.description)
