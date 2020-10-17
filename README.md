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

* `elementID`: 
* `touchWidth`: 
* `threshold`: 
* `transitionSpeed`: 
* `executeBeforeStart`: 
* `executeBeforeAction`: 
* `executeAtClick`:
* `isSlider`: 
* `slideDefault`: 
* `pagination`:  
* `jerkingEdge`:  

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
window.addEventListener('load', event => {
    setInterval(() => {
        if (touchBlockNumb.cache.slideIndex === touchBlockNumb.cache.slidesLength - 1) {
            forward = false
        } else if (touchBlockNumb.cache.slideIndex === 0) {
            forward = true
        }
        if (forward) {
            touchBlockNumb.cache.slideIndex++
        } else {
            touchBlockNumb.cache.slideIndex--
        }
        touchBlockNumb.swipe(touchBlockNumb.cache.slideIndex)
    }, 2000)
})
```

### - I have a functional proposal / I found a bug. Where can I write?

Telegram chat <a href="https://t.me/ovmst_chat" target="_blank">@ovmst_chat</a>

## Compliments

Subscribe to <a href="https://www.youtube.com/channel/UCkgcvGx_z49fiHJ_aiHAp3g?view_as=subscriber" target="_blank">Youtube</a> and <a href="https://t.me/ovmst" target="_blank">Telegram</a> channel

<a href="https://www.youtube.com/channel/UCkgcvGx_z49fiHJ_aiHAp3g?view_as=subscriber" target="_blank"><img src="https://i.ibb.co/sV96kqK/Subscribe.png"></a>
