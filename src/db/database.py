import firebase_admin
from firebase_admin import credentials, firestore


class DB:
    def __init__(self, config):
        cred = credentials.Certificate(config)
        firebase_admin.initialize_app(cred)

        self.__database = firestore.client()

    @property
    def database(self):
        return self.__database
