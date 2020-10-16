const slide = document.querySelector('.touch-block__slide')
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
