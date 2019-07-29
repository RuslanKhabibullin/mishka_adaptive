'use strict'

const SliderUI = {
  sliderList: 'slider__list',
  sliderItem: 'slider__item',
  prevSliderButton: 'slider__prev',
  nextSliderButton: 'slider__next',
  activeSliderItem: 'slider__item--active',
}

class Slider {
  constructor(sliderList) {
    this.sliderItems = this._buildSliderItems(sliderList)
    this.prevSliderButton = sliderList.getElementsByClassName(SliderUI.prevSliderButton)[0]
    this.nextSliderButton = sliderList.getElementsByClassName(SliderUI.nextSliderButton)[0]
  }

  _buildSliderItems(sliderList) {
    const sliderItems = sliderList.getElementsByClassName(SliderUI.sliderItem)

    return Array.from(sliderItems).map((element, index) => {
      return { element, index, isActive: element.classList.contains(SliderUI.activeSliderItem) }
    })
  }

  _switchSlideIterator(activeIndex) {
    return sliderItem => {
      sliderItem.isActive = sliderItem.index === activeIndex
      if (sliderItem.isActive) {
        sliderItem.element.classList.toggle(SliderUI.activeSliderItem, true)
      } else {
        sliderItem.element.classList.remove(SliderUI.activeSliderItem)
      }
    }
  }

  _navigationButtonClickHandler(moveValue = 1) {
    return () => {
      const activeSliderIndex = this.sliderItems.find(element => element.isActive).index
      let newActiveSliderIndex = activeSliderIndex + moveValue
      if (activeSliderIndex <= 0 && moveValue < 0) {
        newActiveSliderIndex = this.sliderItems.length - 1
      } else if (activeSliderIndex >= this.sliderItems.length - 1 && moveValue > 0) {
        newActiveSliderIndex = 0
      }
      this.sliderItems.forEach(this._switchSlideIterator(newActiveSliderIndex))
    }
  }

  init() {
    this.prevSliderButton.addEventListener('click', this._navigationButtonClickHandler(-1))
    this.nextSliderButton.addEventListener('click', this._navigationButtonClickHandler(1))
  }
}

export function initSliders() {
  document.querySelectorAll(`.${SliderUI.sliderList}`).forEach(sliderList => {
    const slider = new Slider(sliderList)
    slider.init()
  })
}
