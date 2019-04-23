from db.db_entity import DBEntity


class Story(DBEntity):
    def __init__(self, title, year, theme, tags, synopsis):
        super().__init__('Stories', {'title': title})

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

    def __repr__(self):
        return 'Story(title={}, year={}, theme={}, tags={}, synopsis={})'.format(self.title,
                                                                                 self.year,
                                                                                 self.theme,
                                                                                 self.tags,
                                                                                 self.synopsis)
