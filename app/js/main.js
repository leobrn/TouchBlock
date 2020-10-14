const slide = document.querySelector('.touch-block__slide')

const touchBlockNumb= new TouchBlock({
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
    touchBlock.settings.touchWidth = slide.offsetWidth
    touchBlock.swipe(false, undefined, touchBlock.settings.cache.slideIndex)
})