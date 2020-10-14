const slide = document.querySelector('.touch-block__slide')

const touchBlock = new TouchBlock({
    elementID: 'touchBlock',
    touchWidth: slide.offsetWidth,
    isSlider: true,
    pagination: 'numbers'
})

window.addEventListener('resize', event => {
    touchBlock.settings.touchWidth = slide.offsetWidth
    touchBlock.swipe(false, undefined, touchBlock.settings.cache.slideIndex)
})