from PIL import Image
from os import listdir, rename,getcwd
from os.path import isfile, join

PATH = join(getcwd(), "images")
MAX_SIZE = (192, 192)

onlyfiles = [f for f in listdir(PATH) if isfile(join(PATH, f))]

for i in onlyfiles:
  name = i
  name = name.replace(' ', '_')
  rename(join(PATH, i), join(PATH, name))

  image = Image.open(join(PATH, name))
  image.thumbnail(MAX_SIZE)
  image.save(join(PATH, r"thumbnails", name))
