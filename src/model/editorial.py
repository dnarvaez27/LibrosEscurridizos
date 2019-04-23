class Editorial:
    def __init__(self, name, _type, description, city):
        if not name:
            raise Exception("Editorial must have a name")

        self.name = name
        self.type = _type
        self.description = description
        self.city = city

    def to_dict(self):
        return {
            'name': self.name,
            'type': self.type,
            'description': self.description,
            'city': self.city
        }

    def save_or_get(self, database):
        doc_ref = database.collection('Editorials').document(self.name)
        if doc_ref.get().exists:
            return doc_ref
        return database.collection('Editorials').add(self.to_dict(), document_id=self.name)[1]

    def __repr__(self):
        return 'Editorial(name={}, type={}, description={}, city={})'.format(self.name,
                                                                             self.type,
                                                                             self.description,
                                                                             self.city)
