function loadFragment(page) {
    fetch(`./fragments/${page}.html`)
        .then(response => response.text())
        .then(result => {
            const holder = $('#content-holder')
            holder.empty()
            holder.html(result)
        })
}