# TouchBlock.js
Interact with blocks using TouchBlock.js

<a href="https://youtu.be/VVCVbbOt_YA" target="_blank">View Video Preview ex.1</a>

<a href="https://leobrn.github.io/TouchBlock//" target="_blank">View Demos</a>

* [Installation](#installation)
* [Usage](#usage)
* [Settings &amp; Defaults](#settings-and-defaults)
* [Public Methods](#public-methods)
* [FAQ's](#faq)
* [Compliments](#compliments)

## Installation

As standalone just include the file in a tags:

```html
If you use for the slider include the css file:
<link rel="stylesheet" href="slideBlock.css">

<script src="touchBlock.js"></script>
```

## Usage
If using for slider:
```html
<div class="touch-block" id="touchBlockNumb">
   <div class="touch-block__slides">
   <div class="touch-block__slide"><img class="photo" src="./img/1.png"></div>
   <div class="touch-block__slide"><img class="photo" src="./img/2.png"></div>
   <div class="touch-block__slide"><img class="photo" src="./img/3.png"></div>
   <div class="touch-block__slide"><img class="photo" src="./img/4.png"></div>
 </div>
 <div class="touch-block__pagination"></div>
</div>
```
```javascript
const touchBlockNumb = new TouchBlock({
    elementID: 'touchBlockNumb',
    touchWidth: slide.offsetWidth,
    isSlider: true,
    slideDefault: 1,
    pagination: 1
})
```
For other occasions:
```javascript
const touchBlock = new TouchBlock({
            elementID: 'touchBlock',
            touchWidth: el.offsetWidth
})
```
## Settings and Defaults

```javascript
settings = {
    elementID: '',
    touchWidth: 0,
    threshold: .3,
    transitionSpeed: .5,
    executeBeforeStart: true,
    executeBeforeAction: true,
    executeAtClick: true,
    isSlider: false,
    slideDefault: 0,
    pagination: null, //1 - numbers, 2 -circles
    jerkingEdge: true
```

* `elementID`: The element ID which the user will be sliding 
* `touchWidth`: Element / slide width
* `threshold`: Response threshold
* `transitionSpeed`: Transition Speed
* `executeBeforeStart`: You can pass a function to be executed in 'touchStart' or cancel execution by passing false
* `executeBeforeAction`: You can pass a function to be executed in 'touchAction' or cancel execution by passing false
* `executeAtClick`: You can pass a function to be executed on 'touchEnd' on click event
* `isSlider`: Activate slider functionality by specifying true
* `slideDefault`: Default slider
* `pagination`: If the value is 1-numbers, if the value is 2-circles
* `jerkingEdge`: Twitching effect when pulling left on the first slide and right on the last slide (isSlider = true)

## Public Methods

### `swipe`: Swipe block

```javascript
touchBlock.swipe()
```
Return to standard position:
```javascript
touchBlock.swipe(null, true)
```
To set up a slide:
```javascript
touchBlockNumb.swipe(2)
```

## FAQ

### - How can i implement auto-flipping slides?

```javascript
const slide = document.querySelector('.touch-block__slide')
let forward = true

const touchBlockCirc = new TouchBlock({
    elementID: 'touchBlockCirc',
    touchWidth: slide.offsetWidth,
    executeBeforeStart: false,
    isSlider: true,
    pagination: 2,
    jerkingEdge: false
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
```

### - I have a functional proposal / I found a bug. Where can I write?

Telegram chat <a href="https://t.me/ovmst_chat" target="_blank">@ovmst_chat</a>

## Compliments

Subscribe to <a href="https://www.youtube.com/channel/UCkgcvGx_z49fiHJ_aiHAp3g?view_as=subscriber" target="_blank">Youtube</a> and <a href="https://t.me/ovmst" target="_blank">Telegram</a> channel

<a href="https://www.youtube.com/channel/UCkgcvGx_z49fiHJ_aiHAp3g?view_as=subscriber" target="_blank"><img src="https://i.ibb.co/sV96kqK/Subscribe.png"></a>
