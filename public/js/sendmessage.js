fetch(`./api/users/${sessionStorage.getItem('sendMessageId')}`,{
    headers: {
        'Authorization': localStorage.getItem('token')
    }
})
.then(response => {
    if (response.status === 200) {
        response.json()
        .then(result => {
            $('#sendmessage-receiver-username-holder').html(`Send message to: <b>${result.data.username}</b>`)
        })
    } else {
        response.json()
        .then(result => {
            alert(result.data)
            loadFragment('homepage')
        })
    }
})

function sendMessage() {
    const messageContent = $('#message-content-input').val()

    fetch(`./api/messages`, {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            receiverId: sessionStorage.getItem('sendMessageId'),
            content: messageContent
        })
    })
    .then(response => response.json())
    .then(result => {
        alert(result.data)
        loadFragment('homepage')
    })
}