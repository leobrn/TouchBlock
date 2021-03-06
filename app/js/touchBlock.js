'use strict'
class TouchBlock {
  constructor(options) {
    const settings = {
        elementID: '',
        targetSelector: null,
        touchWidth: 0,
        threshold: 0.3,
        transitionSpeed: 0.5,
        executeBeforeStart: true,
        executeBeforeAction: true,
        executeBeforeEnd: true,
        executeAtClick: true,
        isSlider: false,
        slideDefault: 0,
        pagination: null, //1 - numbers, 2 -circles
        jerkingEdge: true,
        slidesPerView: 1,
        spaceBetween: 30
      },
      cache = {
        posThresholdX: 0,
        isSwipe: false,
        isClick: false,
        isScroll: false,
        allowSwipe: true,
        parentBlock: null,
        slidesLength: 0,
        slideIndex: 0,
        paginationElement: null
      },
      vars = {
        posInitX: 0,
        posCurrentX: 0,
        posMoveX: 0,
        posFinalX: 0,
        posCurrentY: 0,
        posMoveY: 0,
        nextTrf: 0,
        prevTrf: 0,
        trfRegExp: /[-0-9.]+(?=px)/
      }
    Object.assign(settings, options)
    this.settings = settings
    this.cache = cache
    this.vars = vars
    const element = this.mainElement
    if (!element) {
      return
    }
    this.element = element
    this.initWidthSlide()
    this.#initCache()
    this.#initEvent()
    this.#initSlider()
  }

  get mainElement() {
    const { settings, cache } = this
    let element
    if (settings.isSlider) {
      const parentBlock = document.getElementById(settings.elementID)
      if (!parentBlock) {
        return
      }
      element = parentBlock.querySelector('.touch-block__slides')
      cache.parentBlock = parentBlock
    } else {
      element = document.getElementById(settings.elementID)
    }
    return element
  }

  #getEventElement(event) {
    const element = event.target.closest(`#${this.settings.elementID}`)
    return element
  }

  getTargetElement(event) {
    const targetSelector = this.settings.targetSelector
    let element = this.element
    if (targetSelector && event) {
      const targetElement = event.target.closest(targetSelector)
      element = targetElement
    }
    return element
  }

  #getMainEvent(event) {
    let mainEvent = null
    if (event.type.search('touch') !== -1) {
      mainEvent = event.touches[0]
    } else if (event.buttons === 1) {
      mainEvent = event
    }
    return mainEvent
  }

  #initCache() {
    const { cache, settings, element } = this
    cache.posThresholdX = settings.touchWidth * settings.threshold
    cache.slidesLength = settings.isSlider
      ? element.querySelectorAll('.touch-block__slide').length
      : 0
    cache.slideIndex =
      settings.slideDefault > 0 ? settings.slideDefault : cache.slideIndex
    cache.paginationElement = cache.parentBlock
      ? cache.parentBlock.querySelector(`.touch-block__pagination`)
      : null
  }

  #initEvent() {
    const { element, settings } = this,
      targetSelector = settings.targetSelector
    element.style.transform = 'translate3d(0px, 0px, 0px)'
    this.touchStart = this.touchStart.bind(this)
    element.addEventListener('touchstart', this.touchStart, { passive: true })
    element.addEventListener('mousedown', this.touchStart)
    if (targetSelector) {
      const elements = document.querySelectorAll(targetSelector)
      elements.forEach(item => {
        item.style.transform = 'translate3d(0px, 0px, 0px)'
      })
    }
  }

  #initSlider() {
    const { settings, cache, element } = this
    if (!settings.isSlider) {
      return
    }
    const setAllowSwipe = () => {
        cache.allowSwipe = true
      },
      allowSwipe = setAllowSwipe.bind(this)
    element.addEventListener('transitionend', allowSwipe)
    cache.slideIndex = settings.slideDefault
    this.swipe(settings.slideDefault)
  }

  #initPagination() {
    const { settings, cache } = this,
      { isSlider, pagination } = settings,
      paginationElement = cache.paginationElement
    if (!paginationElement || !isSlider) {
      return
    }
    if (pagination === 1) {
      paginationElement.classList.add('touch-block__pagination-numbers')
      paginationElement.innerHTML = `
            <span class="touch-block__pagination-current">${
              cache.slideIndex + 1
            }</span>
            <span class="touch-block__pagination-slash">/</span>
            <span class="touch-block__pagination-total">${
              cache.slidesLength
            }</span>`
    } else if (pagination === 2) {
      paginationElement.classList.add('touch-block__pagination-circles')
      let i = 0,
        strings = []
      while (i <= cache.slidesLength - 1) {
        let classActive =
          i === cache.slideIndex ? 'touch-block__pagination-circle--active' : ''
        strings.push(
          `<span class="touch-block__pagination-circle ${classActive}"></span>`
        )
        i++
      }
      paginationElement.innerHTML = strings.join('')
    }
  }

  #resetVars() {
    const vars = this.vars
    vars.posInitX = 0
    vars.posCurrentX = 0
    vars.posMoveX = 0
    vars.posFinalX = 0
    vars.posCurrentY = 0
    vars.posMoveY = 0
    vars.nextTrf = 0
    vars.prevTrf = 0
  }

  initWidthSlide() {
    const { settings, cache, element } = this
    if (!settings.isSlider || settings.slidesPerView <= 1) {
      return
    }
    const slides = element.querySelectorAll('.touch-block__slide'),
      widthSlider = element.offsetWidth,
      widthSlide =
        (widthSlider - (settings.slidesPerView - 1) * settings.spaceBetween) /
        settings.slidesPerView
    slides.forEach(item => {
      item.style.width = `${widthSlide}px`
      item.style.marginRight = `${settings.spaceBetween}px`
    })
    settings.touchWidth = widthSlide + settings.spaceBetween
  }

  touchStart(event) {
    this.#resetVars()
    const eventElement = this.#getEventElement(event)
    if (!eventElement) {
      return
    }
    const { settings, cache, vars, element } = this,
      { executeBeforeStart } = settings
    const resultExecute =
      typeof executeBeforeStart === 'function'
        ? executeBeforeStart(this)
        : executeBeforeStart
    if (!resultExecute) {
      return
    }
    const mainEvent = this.#getMainEvent(event)
    if (!mainEvent || !cache.allowSwipe) {
      return
    }
    if (settings.isSlider) {
      vars.nextTrf = (cache.slideIndex + 1) * -settings.touchWidth
      vars.prevTrf = (cache.slideIndex - 1) * -settings.touchWidth
    }
    vars.posInitX = vars.posCurrentX = mainEvent.clientX
    vars.posCurrentY = mainEvent.clientY
    this.touchAction = this.touchAction.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
    element.style.transition = ''
    element.addEventListener('touchmove', this.touchAction, { passive: true })
    element.addEventListener('touchend', this.touchEnd)
    element.addEventListener('mousemove', this.touchAction)
    element.addEventListener('mouseup', this.touchEnd)
    element.addEventListener('mouseout', this.touchEnd)
    element.addEventListener('touchcancel', this.touchEnd)
  }

  touchAction(event) {
    const eventElement = this.#getEventElement(event)
    if (!eventElement) {
      return
    }
    const { settings, cache, vars } = this,
      { executeBeforeAction } = settings
    const mainEvent = this.#getMainEvent(event)
    if (!mainEvent || !cache.allowSwipe) {
      return
    }
    let element = this.getTargetElement(event)
    if (!element) {
      return
    }
    let style = element.style.transform,
      transform = +style.match(vars.trfRegExp)[0]
    vars.posMoveX = vars.posCurrentX - mainEvent.clientX
    vars.posCurrentX = mainEvent.clientX
    vars.posMoveY = vars.posCurrentY - mainEvent.clientY
    vars.posCurrentY = mainEvent.clientY
    if (!cache.isSwipe && !cache.isScroll) {
      let posY = Math.abs(vars.posMoveY)
      if (posY > 7 || vars.posMoveX === 0) {
        cache.isScroll = true
        cache.allowSwipe = false
      } else if (posY < 7) {
        cache.isSwipe = true
      }
    }
    const resultExecute =
      typeof executeBeforeAction === 'function'
        ? executeBeforeAction(this)
        : executeBeforeAction
    if (!resultExecute || cache.isScroll) {
      return
    }
    if (cache.slideIndex === 0 && settings.isSlider) {
      if (vars.posInitX < vars.posCurrentX) {
        if (settings.jerkingEdge) {
          vars.prevTrf = cache.posThresholdX
        } else {
          this.swipe(0)
          return
        }
      } else {
        cache.allowSwipe = true
      }
    }
    let slidesLength = cache.slidesLength
    if (cache.slideIndex === --slidesLength) {
      if (vars.posInitX > vars.posCurrentX) {
        if (settings.jerkingEdge) {
          vars.nextTrf =
            vars.nextTrf < 0
              ? vars.nextTrf + cache.posThresholdX
              : cache.posThresholdX
        } else {
          this.swipe(slidesLength)
          return
        }
      } else {
        cache.allowSwipe = true
      }
    }
    if (settings.isSlider && settings.slidesPerView > 1) {
      if (
        vars.posInitX > vars.posCurrentX &&
        settings.slidesPerView >= cache.slidesLength - cache.slideIndex
      ) {
        cache.allowSwipe = false
        return
      }
    }
    const swipeRight = settings.isSlider ? vars.nextTrf : cache.posThresholdX,
      swipeLeft = settings.isSlider ? vars.prevTrf : cache.posThresholdX
    if (
      (vars.posInitX > vars.posCurrentX && transform < swipeRight) ||
      (vars.posInitX < vars.posCurrentX && transform > swipeLeft)
    ) {
      this.touchEnd(event)
      return
    }
    element.style.transform = `translate3d(${
      transform - vars.posMoveX
    }px, 0px, 0px)`
  }

  touchEnd(event) {
    const { settings, cache, vars } = this,
      mainElement = this.element
    let element = this.getTargetElement(event)
    if (!element) {
      return
    }

    mainElement.removeEventListener('touchmove', this.touchAction, {
      passive: true
    })
    mainElement.removeEventListener('mousemove', this.touchAction)
    mainElement.removeEventListener('touchend', this.touchEnd)
    mainElement.removeEventListener('mouseup', this.touchEnd)
    mainElement.removeEventListener('mouseout', this.touchEnd)
    mainElement.removeEventListener('touchcancel', this.touchEnd)

    const eventElement = this.#getEventElement(event)
    if (!eventElement) {
      return
    }
    if (cache.isScroll) {
      cache.allowSwipe = true
      cache.isScroll = false
      return
    }
    cache.isSwipe = false
    if (!cache.allowSwipe) {
      cache.allowSwipe = true
      return
    }
    const executeBeforeEnd = settings.executeBeforeEnd,
      resultExecute =
        typeof executeBeforeEnd === 'function'
          ? executeBeforeEnd(this)
          : executeBeforeEnd
    if (!resultExecute) {
      return
    }
    vars.posFinalX = vars.posInitX - vars.posCurrentX
    let close = false
    if (Math.abs(vars.posFinalX) > cache.posThresholdX) {
      if (vars.posInitX < vars.posCurrentX) {
        close = true
        if (cache.slideIndex > 0) {
          cache.slideIndex--
        }
      } else if (vars.posInitX > vars.posCurrentX) {
        close = false
        if (cache.slideIndex < cache.slidesLength - 1) {
          cache.slideIndex++
        }
      }
    }
    if (vars.posInitX !== vars.posCurrentX) {
      cache.allowSwipe = false
      if (settings.isSlider) {
        this.swipe(cache.slideIndex)
      } else {
        this.swipe(null, close)
      }
      cache.isClick = false
    } else {
      cache.allowSwipe = true
      cache.isClick = true
      const executeAtClick = settings.executeAtClick,
        resultExecute =
          typeof executeAtClick === 'function'
            ? executeAtClick(this)
            : executeAtClick
      if (!resultExecute) {
        return
      }
    }
  }

  swipe(slideIndex = null, valueDefault = false) {
    const { settings, cache } = this
    let element = this.getTargetElement(event)
    if (
      settings.isSlider &&
      slideIndex !== null &&
      slideIndex !== cache.slideIndex
    ) {
      if (slideIndex < 0 || slideIndex > cache.slidesLength - 1) {
        return
      } else {
        cache.slideIndex = slideIndex
      }
    }
    let index = slideIndex || cache.slideIndex,
      factor = settings.isSlider ? index : 1
    if (settings.isSlider) {
      if (settings.slidesPerView > 1) {
        factor =
          settings.slidesPerView >= cache.slidesLength - cache.slideIndex
            ? cache.slidesLength - settings.slidesPerView
            : index
      } else {
        factor = index
      }
    } else {
      factor = 1
    }
    element.style.transition = `transform ${settings.transitionSpeed}s ease`
    element.style.transform = `translate3d(-${
      valueDefault ? 0 : settings.touchWidth * factor
    }px, 0px, 0px)`
    this.#initPagination()
    cache.allowSwipe = true
  }
}
