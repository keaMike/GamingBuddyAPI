fetch('/api/messages', {
    headers: {
        'Authorization': localStorage.getItem('token')
    }
})
.then(response => {
    if (response.status === 200) {
        response.json()
        .then(result => {
            const messagesHolder = $('#messages-holder')

            result.data.map(message => {
                const messageHtml = makeMessageCard(message)
                messagesHolder.append(messageHtml + '<br>')
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