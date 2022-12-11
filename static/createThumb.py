from PIL import Image
from os import listdir, rename
from os.path import isfile, join

PATH = r"E:\repos\web\kurs\static\images"
MAX_SIZE = (200, 200)



onlyfiles = [f for f in listdir(PATH) if isfile(join(PATH, f))]

for i in onlyfiles:
  name = i
  name = name.replace(' ', '_')
  rename(join(PATH, i), join(PATH, name))

  image = Image.open(join(PATH, name))
  image.thumbnail(MAX_SIZE)
  image.save(join(PATH, r"thumbnails", name))
