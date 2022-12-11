let cur_page = 0
localStorage['selected_img'] = ''
localStorage.clear()

const change_page = (change = +16) => {
  const pair = new URLSearchParams();
  pair.append("from", cur_page);
  cur_page = Math.max(16, cur_page + change)
  pair.append("to", cur_page);

  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", '/thumbs?' + pair, true); // true for synchronous request
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      const thumbnails = JSON.parse(xmlHttp.response)
      create_image_list(thumbnails)
    }
  }
  xmlHttp.send(null);
  console.log(cur_page)
}



document.addEventListener('DOMContentLoaded', () => {
  change_page(+3)
})
const image_click = (ev) => {

}



document.querySelector('#open_image').addEventListener('click', (ev) => {
  thumbnail = localStorage['selected_img']
  document.querySelector('.menu').classList.remove('show')

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

document.querySelector('#save_image').addEventListener('click', (ev) => {
  thumbnail = localStorage['selected_img']
  const link = document.createElement("a");

  document.body.appendChild(link); // for Firefox

  link.setAttribute("href", `/../images/${thumbnail}`);
  link.setAttribute("download", '');
  link.click();
})



document.querySelector('.image-holder').addEventListener('scroll', () => {
  const img_holder = document.querySelector('.image-holder')
  // нижняя граница документа
  const scrollPos = img_holder.getBoundingClientRect().bottom
  const scrollHeight = img_holder.lastChild.getBoundingClientRect().bottom

  console.log(img_holder.getBoundingClientRect().bottom,)

  // если пользователь прокрутил достаточно далеко (< 100px до конца)
  if (scrollHeight < scrollPos + 100) {
    change_page(+3)
  }
})

const create_image_list = (thumb_array = []) => {
  const image_holder = document.querySelector('.image-holder')
  for (let i = 0; i < thumb_array.length; i++) {

    const div = document.createElement('div')
    div.classList.add('image')
    div.style = `background-image: url('/../images/thumbnails/${thumb_array[i]}')`
    div.setAttribute('value', thumb_array[i])


    div.addEventListener('click', (ev) => {
      const menu = document.querySelector('.menu')

      if (localStorage['selected_img'] == thumb_array[i]) {
        if (menu.classList.contains('show'))
          menu.classList.remove('show')
        else
          menu.classList.add('show')
      }
      else {
        menu.classList.add('show')
      }

      console.log(ev.clientX)
      menu.style.left = `${ev.clientX}px`
      menu.style.top = `${ev.clientY + 5}px`

      const cur = document.querySelector(`[value="${thumb_array[i]}"]`)
      cur.classList.add('selected')

      if (localStorage['selected_img']) {
        const prev = document.querySelector(`[value="${localStorage['selected_img']}"]`)

        if (prev) {
          prev.classList.remove('selected')
        }
      }

      if (localStorage['selected_img'] == thumb_array[i])
        localStorage['selected_img'] = ''
      else
        localStorage['selected_img'] = thumb_array[i]

    })
    image_holder.appendChild(div)
  }
}