function login() {
    const email = $('#email-input').val()
    const password = $('#password-input').val()
    
    fetch('/api/users/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    }).then(response => {
        if (response.status === 200) {
            response.json()
            .then(result => {
                localStorage.setItem('token', result.token)
                localStorage.setItem('ownUser', JSON.stringify(result.user))
                loadFragment('homepage')
            })
        } else {
            response.json()
            .then(result => {
                alert(result.data)
            })
        }
    })
}

if (localStorage.getItem('token')) loadFragment('homepage')