from abc import ABC, abstractmethod


class DBEntity(ABC):

    def __init__(self, collection, doc_key):
        doc_key = tuple(doc_key.items())[0]

        self.collection = collection
        self.doc_key = doc_key[1]

        if not self.collection:
            raise Exception("Entity must have a collection name")
        if not self.doc_key:
            raise Exception("Entity of {} collection must have the argument {}".format(collection, doc_key[0]))

    @abstractmethod
    def to_dict(self):
        pass

    def save_or_get(self, database):
        doc_ref = database.collection(self.collection).document(self.doc_key)
        if doc_ref.get().exists:
            return doc_ref
        return database.collection(self.collection).add(self.to_dict(), document_id=self.doc_key)[1]
        # return self

    def save(self, database):
        database.collection(self.collection).add(self.to_dict())
        # return self
