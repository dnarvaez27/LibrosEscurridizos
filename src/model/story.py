class Story:
    def __init__(self, title, year, theme, tags, synopsis):
        self.title = title
        self.year = year
        self.theme = theme
        self.tags = tags
        self.synopsis = synopsis
        self.writters = []
        self.illustrators = []
        self.editors = []
        self.editorial = None

    def to_dict(self):
        return {
            'title': self.title,
            'year': self.year,
            'theme': self.theme,
            'tags': self.tags,
            'synopsis': self.synopsis,
            'writters': self.writters,
            'illustrators': self.illustrators,
            'editors': self.editors,
            'editorial': self.editorial
        }

    def add_writter(self, writter):
        self.writters.append(writter)

    def add_illustrator(self, illustrator):
        self.illustrators.append(illustrator)

    def add_editor(self, editor):
        self.editors = editor

    def set_editorial(self, editorial):
        self.editorial = editorial

    def save(self, database):
        database.collection('Stories').add(self.to_dict())

    def __repr__(self):
        return 'Story(title={}, year={}, theme={}, tags={}, synopsis={})'.format(self.title,
                                                                                 self.year,
                                                                                 self.theme,
                                                                                 self.tags,
                                                                                 self.synopsis)
