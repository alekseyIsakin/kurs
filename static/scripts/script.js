let cur_page = 0
let show_bookmarks = false

if (localStorage['saved_images'] == undefined)
  localStorage['saved_images'] = []
const saved_images = new Set(localStorage['saved_images'].split(','))
saved_images.delete('')

localStorage['selected_img'] = ''
localStorage.clear()

const change_page = (change = +16) => {

  const pair = new URLSearchParams();
  pair.append("from", 0);
  cur_page = Math.max(16, cur_page + change)
  pair.append("to", change);

  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", '/thumbs?' + pair, true); // true for synchronous request
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      const thumbnails = JSON.parse(xmlHttp.response)
      create_image_list(thumbnails)
    }
  }
  xmlHttp.send(null);
}


const clear_images = () => {
  const img_holder = document.querySelector('.image-holder')
  while (img_holder.firstChild) {
    img_holder.removeChild(img_holder.lastChild);
  }
}


const first_load_image = () => {
  const img_holder_bound = document.querySelector('.image-holder').getBoundingClientRect()
  let cnt = Math.floor(img_holder_bound.width / 100)
  cnt *= Math.ceil(img_holder_bound.height / 100)
  console.log('>>', cnt)
  change_page(cnt)
}


window.addEventListener("unload", function () {
  saved_images.delete('')
  localStorage['saved_images'] = Array.from(saved_images).join(',')
});



document.addEventListener('DOMContentLoaded', () => {
  first_load_image()
})



// ************************************
// ************************************
// ************************************

document.querySelector('.svg-close').addEventListener('click', (ev) => {
  const image_holder = document.querySelector('.image-holder')
  const viewer = document.querySelector('.image-viewer')
  const icon = document.querySelector('.svg-holder');
  const orig_image = document.querySelector('#orig-image')

  if (localStorage['selected_img']) {
    const cur = image_holder.children[localStorage['selected_img']]

    cur.classList.remove('selected')
    viewer.classList.remove('show')
    orig_image.classList.remove('orig-image-h')
    icon.style.right = ''
  }
})

document.querySelector('.svg-bookmarks').addEventListener('click', (ev) => {
  clear_images()

  if (show_bookmarks == false) {
    create_image_list(Array.from(saved_images))
  } else {
    first_load_image()
  }
  show_bookmarks = !show_bookmarks
})

document.querySelector('.svg-star').addEventListener('click', (ev) => {
  const img_holder = document.querySelector('.image-holder')
  thumbnail = img_holder.children[localStorage['selected_img']].value


  if (saved_images.has(thumbnail)) {
    ev.target.src = 'svg/bookmark.svg'
    saved_images.delete(thumbnail)
  } else {
    ev.target.src = 'svg/bookmarked.svg'
    saved_images.add(thumbnail)
  }
})

document.querySelector('.svg-download').addEventListener('click', (ev) => {
  const img_holder = document.querySelector('.image-holder')
  thumbnail = img_holder.children[localStorage['selected_img']].value

  let w = window.open(`/../images/${thumbnail}`)

  w.addEventListener('dblclick', (ev) => {
    w.close()
  })
  w.addEventListener('keydown', (ev) => {
    console.log(ev.key)
    if (ev.key == 'Escape')
      w.close()
  })
})



// ************************************
// ************************************
// ************************************

document.querySelector('.image-holder').addEventListener('scroll', () => {
  if (show_bookmarks) return

  const img_holder = document.querySelector('.image-holder')
  // ???????????? ?????????????? ??????????????????
  const scrollPos = img_holder.getBoundingClientRect().bottom
  const scrollHeight = img_holder.lastChild ? img_holder.lastChild.getBoundingClientRect().bottom : 0

  // ???????? ???????????????????????? ?????????????????? ???????????????????? ???????????? (< 100px ???? ??????????)
  if (scrollHeight < scrollPos + 100) {
    let cnt = Math.floor(img_holder.getBoundingClientRect().width / 200)
    change_page(cnt)
  }
})

const create_image_list = (thumb_array = []) => {
  const image_holder = document.querySelector('.image-holder')

  for (let i = 0; i < thumb_array.length; i++) {

    const img = document.createElement('img')
    img.classList.add('image')
    img.classList.add('background')

    img.src = `images/thumbnails/${thumb_array[i]}`
    img.value = thumb_array[i]
    img.setAttribute('value', thumb_array[i])
    img.alt = 'can`t download ' + thumb_array[i]

    img.addEventListener('click', (ev) => {

      const viewer = document.querySelector('.image-viewer')
      const orig_image = document.querySelector('#orig-image')
      const icon = document.querySelector('.svg-holder');

      const cur = ev.target //document.querySelector(`[value="${thumb_array[i]}"]`)
      const cur_ind = Array.from(image_holder.children).indexOf(cur)

      if (cur.classList.contains('selected')) {
        cur.classList.remove('selected')
        viewer.classList.remove('show')
        icon.style.right = ''

      } else {
        cur.classList.add('selected')
        viewer.classList.add('show')
        orig_image.src = `images/${thumb_array[i]}`

        icon.style.right = '20px'
        if (saved_images.has(thumb_array[i])) {
          document.querySelector('.svg-star').src = 'svg/bookmarked.svg'
        } else {
          document.querySelector('.svg-star').src = 'svg/bookmark.svg'
        }

        const fac = new FastAverageColor();
        const container = document.querySelector('.image-viewer');


        fac.getColorAsync(`${window.location.href}/images/${thumb_array[i]}`)
          .then(color => {
            container.style.background = `linear-gradient(90deg, white 0%, ${color.rgba} 20%, ${color.rgba} 80%, white 100%)`
          })
          .catch(e => {
            console.log(e);
          });

      }

      if (localStorage['selected_img']) {
        const prev = image_holder.children[localStorage['selected_img']]
        if (prev) {
          prev.classList.remove('selected')
        }
      }

      if (localStorage['selected_img'] == String(cur_ind)) {
        localStorage['selected_img'] = ''
        orig_image.classList.remove('orig-image-h')
      }
      else
        localStorage['selected_img'] = cur_ind

    })
    image_holder.appendChild(img)
  }
}

document.querySelector('#orig-image').addEventListener('click', () => {
  const viewer = document.querySelector('.image-viewer')
  const orig_image = document.querySelector('#orig-image')

  orig_image.classList.toggle('orig-image-h')
})
