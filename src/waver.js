const waver = {}

waver.add = (x, y) => {
    window.wave_click_box.innerHTML = `
    <div class="wave active" style="transform: translate(${x}px, ${y}px)">
        <div></div>
        <div></div>
        <div></div>
    </div>`
}

window.addEventListener('mouseup', (event) => {
    waver.add(event.clientX, event.clientY)
})

export default waver
