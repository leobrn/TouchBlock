(function (win, doc) {
    'use strict'
    let posInitX = 0,
        posCurrentX = 0,
        posMoveX = 0,
        posFinalX = 0,
        posCurrentY = 0,
        posMoveY = 0,
        nextTrf = 0,
        prevTrf = 0
    const trfRegExp = /[-0-9.]+(?=px)/,
        getEvent = function (event) {
            let evt = undefined
            if (event.type.search('touch') !== -1) {
                evt = event.touches[0]
            } else if (event.buttons === 1) {
                evt = event
            }
            return evt
        },
        getElement = function (event) {
            const element = event.currentTarget
            return element.id.search('touchBlock') !== -1 ? element : undefined
        },
        addPagination = function (obj) {
            const { isSlider, pagination, cache } = obj.settings,
                paginationElement = cache.paginationElement
            if (!paginationElement || !isSlider) { return }
            if (pagination === 'numbers') {
                paginationElement.classList.add('touch-block__pagination-numbers')
                paginationElement.innerHTML = `
                <span class="touch-block__pagination-current">${cache.slideIndex + 1}</span>
                <span class="touch-block__pagination-slash">/</span>
                <span class="touch-block__pagination-total">${cache.slidesLength}</span>`
            } else if (pagination === 'circles') {
                paginationElement.classList.add('touch-block__pagination-circles')
                let i = 0,
                    strings = []
                while (i <= cache.slidesLength - 1) {
                    let classActive = ''
                    if (i === cache.slideIndex) {
                        classActive = 'touch-block__pagination-circle--active'
                    }
                    strings.push(`<span class="touch-block__pagination-circle ${classActive}"></span>`)
                    i++
                }
                paginationElement.innerHTML = strings.join('')
            }
        }

    const TouchBlock = function (options) {
        const settings = {
            elementID: '',
            touchWidth: 0,
            threshold: .3,
            transitionSpeed: .5,
            executeBeforeStart: true,
            executeBeforeAction: true,
            executeAtClick: true,
            isSlider: false,
            slideDefault: 0,
            pagination: 'null', //numbers, circles
            jerking: true
        },
            cache = {
                posThresholdX: 0,
                isSwipe: false,
                isClick: false,
                isScroll: false,
                allowSwipe: true,
                slideIndex: 0,
                slidesLength: 0,
                paginationElement: undefined
            },
            touchStart = function (event) {
                const elEvent = getElement(event)
                if (!elEvent) { return }
                const executeBeforeStart = this.settings.executeBeforeStart,
                    resultExecute = (typeof executeBeforeStart === "function" ? executeBeforeStart(this) : executeBeforeStart)
                if (!resultExecute) { return }
                let evt = getEvent(event)
                if (!evt) { return }
                const settings = this.settings,
                    cache = settings.cache
                if (!cache.allowSwipe) { return }
                if (settings.isSlider) {
                    nextTrf = (cache.slideIndex + 1) * -settings.touchWidth
                    prevTrf = (cache.slideIndex - 1) * -settings.touchWidth
                }
                posInitX = posCurrentX = evt.clientX
                posCurrentY = evt.clientY
                this.element.style.transition = ''
                this.element.addEventListener('touchmove', touchAction, { passive: true })
                this.element.addEventListener('touchend', touchEnd)
                this.element.addEventListener('mousemove', touchAction)
                this.element.addEventListener('mouseup', touchEnd)
            }.bind(this),
            touchAction = function (event) {
                const elEvent = getElement(event)
                if (!elEvent) { return }
                const cache = this.settings.cache
                let evt = getEvent(event),
                    style = this.element.style.transform,
                    transform = +style.match(trfRegExp)[0]
                if (!evt) { return }
                posMoveX = posCurrentX - evt.clientX
                posCurrentX = evt.clientX
                posMoveY = posCurrentY - evt.clientY
                posCurrentY = evt.clientY
                if (!cache.isSwipe && !cache.isScroll) {
                    let posY = Math.abs(posMoveY)
                    if (posY > 7 || posMoveX === 0) {
                        cache.isScroll = true
                        cache.allowSwipe = false
                    } else if (posY < 7) {
                        cache.isSwipe = true
                    }
                }
                const executeBeforeAction = this.settings.executeBeforeAction,
                    resultExecute = (typeof executeBeforeAction === "function" ? executeBeforeAction(this) : executeBeforeAction)
                if (!resultExecute) { return }
                if (cache.isScroll) { return }
                if (cache.slideIndex === 0 && settings.isSlider) {
                    if (posInitX < posCurrentX) {
                        if (settings.jerking) {
                            prevTrf = cache.posThresholdX
                        } else {
                            this.swipe(false, undefined, 0)
                            return
                        }
                    } else {
                        cache.allowSwipe = true
                    }
                }
                let slidesLength = cache.slidesLength
                if (cache.slideIndex === --slidesLength) {
                    if (posInitX > posCurrentX) {
                        if (settings.jerking) {
                            nextTrf = nextTrf < 0 ? nextTrf + cache.posThresholdX : cache.posThresholdX
                        } else {
                            this.swipe(false, undefined, slidesLength)
                            return
                        }
                    } else {
                        cache.allowSwipe = true
                    }
                }
                const compareLeft = settings.isSlider ? nextTrf : cache.posThresholdX,
                    compareRight = settings.isSlider ? prevTrf : cache.posThresholdX
                if (posInitX > posCurrentX && transform < compareLeft || posInitX < posCurrentX && transform > compareRight) {
                    touchEnd(event)
                    return
                }
                this.element.style.transform = `translate3d(${transform - posMoveX}px, 0px, 0px)`
            }.bind(this),
            touchEnd = function (event) {
                this.element.removeEventListener('touchmove', touchAction, { passive: true })
                this.element.removeEventListener('mousemove', touchAction)
                this.element.removeEventListener('touchend', touchEnd)
                this.element.removeEventListener('mouseup', touchEnd)
                const elEvent = getElement(event)
                if (!elEvent) { return }
                const cache = this.settings.cache
                if (cache.isScroll) {
                    cache.allowSwipe = true
                    cache.isScroll = false
                    return
                }
                cache.isSwipe = false
                posFinalX = posInitX - posCurrentX
                let close = false
                if (!cache.allowSwipe) {
                    cache.allowSwipe = true
                    return
                }
                if (Math.abs(posFinalX) > cache.posThresholdX) {
                    if (posInitX < posCurrentX) {
                        close = true
                        if (cache.slideIndex > 0) {
                            cache.slideIndex--
                        }
                    } else if (posInitX > posCurrentX) {
                        close = false
                        if (cache.slideIndex < cache.slidesLength - 1) {
                            cache.slideIndex++
                        }
                    }
                }
                if (posInitX !== posCurrentX) {
                    cache.allowSwipe = false
                    if (settings.isSlider) {
                        this.swipe(false, undefined, cache.slideIndex)
                    } else {
                        this.swipe(close)
                    }
                    cache.isClick = false
                } else {
                    cache.allowSwipe = true
                    cache.isClick = true
                    const executeAtClick = this.settings.executeAtClick,
                        resultExecute = (typeof executeAtClick === "function" ? executeAtClick(this) : executeAtClick)
                    if (!resultExecute) { return }
                }
            }.bind(this)

        Object.assign(settings, options)
        cache.posThresholdX = settings.touchWidth * settings.threshold
        cache.slidesLength = settings.isSlider ? doc.querySelectorAll('.touch-block__slide').length : 0
        cache.slideIndex = settings.slideDefault > 0 ? settings.slideDefault : cache.slideIndex
        cache.paginationElement = document.querySelector('.touch-block__pagination')
        settings.cache = cache
        const element = doc.getElementById(settings.elementID)
        this.element = element
        this.settings = settings
        if (!element) { return }
        element.style.transform = 'translate3d(0px, 0px, 0px)'
        element.addEventListener('touchstart', touchStart, { passive: true })
        element.addEventListener('mousedown', touchStart)
        element.addEventListener('click', touchEnd)
        if (settings.isSlider) {
            this.swipe(false, undefined, settings.slideDefault)
        }
    }
    TouchBlock.prototype.swipe = function (valueDefault = false, elDefault = undefined, slideIndex = undefined) {
        const settings = this.settings,
            cache = settings.cache,
            element = elDefault ? elDefault : this.element
        let index = slideIndex || cache.slideIndex,
            factor = settings.isSlider ? index : 1
        element.style.transition = `transform ${settings.transitionSpeed}s ease`
        element.style.transform = `translate3d(-${valueDefault ? 0 : settings.touchWidth * factor}px, 0px, 0px)`
        addPagination(this)
        cache.allowSwipe = true
    }
    win.TouchBlock = TouchBlock
})(window, document)
