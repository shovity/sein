const modal = {}

modal.hide = () => {
    window.modal.removeClass('modal-show')
}

modal.show = (content) => {
    window.modal_content.innerHTML = content
    window.modal.addClass('modal-show')
}

window.modal.addEventListener('click', ({ target }) => {
    if (target.id === 'modal') {
        modal.hide()
    }
})

export default modal
