const slide = document.querySelector('.touch-block__slide')

const touchBlockNumb = new TouchBlock({
    elementID: 'touchBlock_numbers',
    touchWidth: slide.offsetWidth,
    isSlider: true,
    pagination: 'numbers'
})

const touchBlockCirc = new TouchBlock({
    elementID: 'touchBlock_circles',
    touchWidth: slide.offsetWidth,
    isSlider: true,
    pagination: 'circles',
    slideDefault: 2,
    jerking: false
})


window.addEventListener('resize', event => {
    touchBlockNumb.settings.touchWidth = slide.offsetWidth
    touchBlockNumb.swipe(false, undefined, touchBlockNumb.settings.cache.slideIndex)
    touchBlockCirc.settings.touchWidth = slide.offsetWidth
    touchBlockCirc.swipe(false, undefined, touchBlockNumb.settings.cache.slideIndex)
})