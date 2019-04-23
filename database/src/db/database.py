from firebase_admin import credentials, firestore, initialize_app


class DB:
    def __init__(self, config):
        cred = credentials.Certificate(config)
        self.__app = initialize_app(cred)
        self.__database = firestore.client()

    @property
    def database(self):
        return self.__database

    def __repr__(self):
        return "{} {}".format(self.__app.name, self.__app.project_id)
