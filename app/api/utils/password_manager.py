import hashlib


def hash_password(password):
    m = hashlib.sha256()
    m.update(bytes(password, 'UTF-8'))
    enc_password = m.hexdigest()
    return enc_password
