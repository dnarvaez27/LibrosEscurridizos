class Person:
    def __init__(self, _type, name, gender, description):
        if not name:
            raise Exception("{} Person must have a name".format(_type))

        self.type = _type
        self.name = name
        self.gender = gender
        self.description = description

    def to_dict(self):
        return {
            'name': self.name,
            'gender': self.gender,
            'description': self.description
        }

    def save_or_get(self, database):
        if self.name:
            doc_ref = database.collection("{}s".format(self.type)).document(self.name)
            if doc_ref.get().exists:
                return doc_ref
            return database.collection("{}s".format(self.type)).add(self.to_dict(), document_id=self.name)[1]
        return None

    def __repr__(self):
        return '{}(name={}, gender={}, description={})'.format(self.type,
                                                               self.name,
                                                               self.gender,
                                                               self.description)
