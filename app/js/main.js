const slide = document.querySelector('.touch-block__slide'),
    action = document.querySelector('.actions__item-action'),
    touchItems = []

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

const closeActions = obj => {
    const { element, cache } = obj
    if (!element) { return true }
    let active = (element.dataset.active === 'true')
    if (!active && !cache.isScroll) {
        const activeElements = document.querySelectorAll('.actions__item-inner[data-active="true"]')
        activeElements.forEach(item => {
            item.dataset.active = false
            obj.swipe(null, item, true)
        })
        element.dataset.active = true
    }
    return true
}

const createTouchActions = () => {
    const actionsItems = document.querySelectorAll('.actions__item-inner')
    actionsItems.forEach(item => {
        touchItems.push(new TouchBlock({
            elementID: item.id,
            touchWidth: action.offsetWidth,
            executeBeforeAction: closeActions
        }))
    })
}

createTouchActions()

window.addEventListener('resize', event => {
    touchBlockNumb.settings.touchWidth = slide.offsetWidth
    touchBlockNumb.swipe(false, undefined, touchBlockNumb.cache.slideIndex)
    touchBlockCirc.settings.touchWidth = slide.offsetWidth
    touchBlockCirc.swipe(false, undefined, touchBlockNumb.cache.slideIndex)
})

window.addEventListener('load', event => {
    setInterval(() => {
        if (touchBlockCirc.cache.slideIndex === touchBlockCirc.cache.slidesLength - 1) {
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
