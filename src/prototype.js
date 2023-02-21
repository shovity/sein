Array.prototype.sum = function () {
    return this.reduce((acc, e) => acc + e)
}

HTMLElement.prototype.addClass = function (className) {
    const regex = new RegExp( `^${className}$|^${className} | ${className}$| ${className}( )`, 'g')
    if (!regex.test(this.className)) {
        this.className = `${this.className} ${className}`.trim()
    }
}

HTMLElement.prototype.removeClass = function (className) {
    const regex = new RegExp( `^${className}$|^${className} | ${className}$| ${className}( )`, 'g')
    this.className = this.className.replace(regex, '$1').trim()
}

HTMLCollection.prototype.toArray = function () {
    return [...this]
}

NodeList.prototype.toArray = function () {
    return [...this]
}