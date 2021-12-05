function signUp() {
    const email = $('#email-input').val()
    const username = $('#username-input').val()
    const bio = $('#bio-input').val()
    const password = $('#password-input').val()

    fetch('./api/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            email,
            password,
            bio
        })
    })
    .then(response => {
        if (response.status === 201) {
            response.json()
            .then(result => {
                alert(result.data)
                loadFragment('login')
            })
        } else {
            response.json()
            .then(result => {
                alert(result.data)
            })
        }
    })
}