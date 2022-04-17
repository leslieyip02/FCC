import hashlib


def crack_sha1_hash(hash, use_salts=False):
  
  with open('./top-10000-passwords.txt', 'r') as f:
    for line in f.readlines():
      line = line.strip()
      unhashed = []
      unhashed.append(line)

      if use_salts:
        with open('./known-salts.txt') as salts:
          for salt in salts.readlines():
            salt = salt.strip()
            prepend = salt + line
            append = line + salt
            unhashed = unhashed + [prepend, append]
      
      for password in unhashed:
        password = password.encode('ascii')
        hashed = hashlib.sha1(password).hexdigest()
        if hash == hashed:
          return line

  return 'PASSWORD NOT IN DATABASE'
