from itertools import zip_longest


def as_list(line, separator):
    return line.strip().split(separator)


def load(path, separator=';', encoding='utf-8-sig'):
    with open(path, 'r', encoding=encoding) as file:
        header = as_list(file.readline(), separator)
        for line in file:
            yield dict(zip(header, as_list(line, separator)))


def multi_list(*fields, headers, separator='@'):
    arr = []
    for field in fields:
        arr.append(field.split(separator))
    rta = []
    values = zip_longest(*arr, fillvalue='')
    for value in values:
        rta.append(dict(zip(headers, value)))
    return rta
