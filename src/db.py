import firebase_admin
from firebase_admin import credentials, firestore


class DB:
    def __init__(self, config):
        self.cred = credentials.Certificate(config)
        firebase_admin.initialize_app(self.cred)

        self.database = firestore.client()

    def get_db(self):
        return self.database
