fetch('/api/swipes/matches', {
    headers: {
        'Authorization': localStorage.getItem('token')
    }
})
.then(response => {
    if (response.status === 200) {
        response.json()
        .then(result => {
            const matchesHolder = $('#matches-holder')

            result.data.map(user => {
                const userHtml = makeUserCard(user, true)
                matchesHolder.append(userHtml + '<br>')
            })
        })
    } else {
        response.json()
        .then(result => {
            alert(result.data)
            loadFragment('homepage')
        })
    }
})