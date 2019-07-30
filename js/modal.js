'use strict'

export function initModal() {
  document.querySelectorAll('[data-modal]').forEach(element => {
    element.addEventListener('click', event => {
      event.preventDefault()
      const modalId = element.getAttribute('data-modal')
      document.querySelector(`#${modalId}`).classList.toggle('modal--closed', false)
    })
  })

  document.querySelectorAll('.modal--close').forEach(element => {
    element.addEventListener('click', event => {
      event.preventDefault()
      element.closest('.modal').classList.toggle('modal--closed', true)
    })
  })
}
