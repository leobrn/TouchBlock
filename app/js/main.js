const slide = document.querySelector('.touch-block__slide'),
  action = document.querySelector('.actions__item-action')

let forward = true

const touchBlockNumb = new TouchBlock({
  elementID: 'touchBlockNumb',
  touchWidth: slide.offsetWidth,
  isSlider: true,
  slideDefault: 1,
  pagination: 1
})

const touchBlockCirc = new TouchBlock({
  elementID: 'touchBlockCirc',
  touchWidth: slide.offsetWidth,
  executeBeforeStart: false,
  isSlider: true,
  pagination: 2,
  jerkingEdge: false
})

const activeSlide = obj => {
  event.stopPropagation()
  event.preventDefault()
  const target = event.target
  if (!target.classList.contains('text-slide')) {
    return false
  }
  const { settings, element } = obj,
    activEl = element.querySelectorAll('.text-slide')
  activEl.forEach(item => {
    item.classList.remove('text-slide--active')
  })
  target.classList.add('text-slide--active')
  const current = target.closest(`.touch-block__slide`),
    slides = element.querySelectorAll('.touch-block__slide'),
    index = Array.from(slides).indexOf(current),
    middle = settings.slidesPerView / 2,
    indexSetup = Math.round(index - middle)
  obj.swipe(indexSetup)
  return true
}

const touchBlockMenu = new TouchBlock({
  elementID: 'touchBlockMenu',
  isSlider: true,
  threshold: 0,
  slidesPerView: 3,
  executeAtClick: activeSlide
})

const closeActions = obj => {
  const { cache } = obj
  let element = obj.getTargetElement(event)
  if (!element) {
    return true
  }
  let active = element.dataset.active === 'true'
  if (!active && !cache.isScroll) {
    const activeElements = document.querySelectorAll(
      '.actions__item-inner[data-active="true"]'
    )
    activeElements.forEach(item => {
      item.dataset.active = false
      item.style.transform = `translate3d(0px, 0px, 0px)`
    })
    element.dataset.active = true
  }
  return true
}

const actionsTouch = new TouchBlock({
  elementID: 'actions',
  touchWidth: action.offsetWidth,
  executeBeforeAction: closeActions,
  targetSelector: '[data-touch]'
})

window.addEventListener('resize', event => {
  touchBlockNumb.settings.touchWidth = slide.offsetWidth
  touchBlockNumb.swipe(touchBlockNumb.cache.slideIndex)
  touchBlockCirc.settings.touchWidth = slide.offsetWidth
  touchBlockCirc.swipe(touchBlockNumb.cache.slideIndex)
  touchBlockMenu.initWidthSlide()
  touchBlockMenu.swipe(0)
})

window.addEventListener('load', event => {
  setInterval(() => {
    if (
      touchBlockCirc.cache.slideIndex ===
      touchBlockCirc.cache.slidesLength - 1
    ) {
      forward = false
    } else if (touchBlockCirc.cache.slideIndex === 0) {
      forward = true
    }
    if (forward) {
      touchBlockCirc.cache.slideIndex++
    } else {
      touchBlockCirc.cache.slideIndex--
    }
    touchBlockCirc.swipe(touchBlockCirc.cache.slideIndex)
  }, 2000)
})
