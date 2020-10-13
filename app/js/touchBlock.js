(function (win, doc) {
    'use strict'
    let posInitX = 0,
        posCurrentX = 0,
        posMoveX = 0,
        posFinalX = 0,
        posCurrentY = 0,
        posMoveY = 0
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
        }

    const TouchBlock = function (options) {
        const settings = {
            elementID: '',
            touchWidth: 0,
            threshold: .3,
            transitionSpeed: .5,
            executeBeforeStart: true,
            executeBeforeAction: true,
            executeAtClick: true
        },
            cache = {
                posThresholdX: 0,
                isSwipe: false,
                isClick: false,
                isScroll: false
            },
            touchStart = function (event) {
                const elEvent = getElement(event)
                if (!elEvent) { return }
                const executeBeforeStart = this.settings.executeBeforeStart,
                    resultExecute = (typeof executeBeforeStart === "function" ? executeBeforeStart(this) : executeBeforeStart)
                if (!resultExecute) { return }
                let evt = getEvent(event)
                if (!evt) { return }
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
                    let posY = Math.abs(posMoveY);
                    if (posY > 7 || posMoveX === 0) {
                        cache.isScroll = true;
                    } else if (posY < 7) {
                        cache.isSwipe = true;
                    }
                }
                const executeBeforeAction = this.settings.executeBeforeAction,
                    resultExecute = (typeof executeBeforeAction === "function" ? executeBeforeAction(this) : executeBeforeAction)
                if (!resultExecute) { return }
                if (cache.isScroll) { return }
                if (posInitX > posCurrentX && transform < cache.posThresholdX || posInitX < posCurrentX && transform > cache.posThresholdX) {
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
                    cache.isScroll = false
                    return
                }
                cache.isSwipe = false
                posFinalX = posInitX - posCurrentX
                let close = false
                if (Math.abs(posFinalX) > cache.posThresholdX) {
                    if (posInitX < posCurrentX) {
                        close = true
                    } else if (posInitX > posCurrentX) {
                        close = false
                    }
                }
                if (posInitX !== posCurrentX) {
                    this.swipe(close)
                    cache.isClick = false
                } else {
                    cache.isClick = true
                    const executeAtClick = this.settings.executeAtClick,
                        resultExecute = (typeof executeAtClick === "function" ? executeAtClick(this) : executeAtClick)
                    if (!resultExecute) { return }
                }
            }.bind(this)

        Object.assign(settings, options)
        cache.posThresholdX = settings.touchWidth * settings.threshold
        settings.cache = cache
        const element = doc.getElementById(settings.elementID)
        this.element = element
        this.settings = settings
        if (!element) { return }
        element.style.transform = 'translate3d(0px, 0px, 0px)'
        element.addEventListener('touchstart', touchStart, { passive: true })
        element.addEventListener('mousedown', touchStart)
        element.addEventListener('click', touchEnd)
    }
    TouchBlock.prototype.swipe = function (valueDefault = false, elDefault = undefined) {
        const settings = this.settings,
            element = elDefault ? elDefault : this.element
        element.style.transition = `transform ${settings.transitionSpeed}s ease`
        element.style.transform = `translate3d(-${valueDefault ? 0 : settings.touchWidth}px, 0px, 0px)`
    }
    win.TouchBlock = TouchBlock
})(window, document)
