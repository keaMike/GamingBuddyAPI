let currentUser
let userArray
const userHolder = $('#swipe-user-holder')

function getUsers(skip) {
    fetch(`./api/users?skip=${skip}&limit=200`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => {
        if (response.status === 200) {
            response.json()
            .then(result => {
                userArray = result.data
                showUser()
            })
        } else {
            response.json()
            .then(result => {
                alert(result.data)
                loadFragment('homepage')
            })
        }
    })
}

function showUser(next) {
    if (next) {
        userArray.shift()
    }
    
    currentUser = userArray[0]

    userHolder.html(makeUserCard(currentUser, false))
}

function swipe(swipeResult) {
    if (swipeResult) {
        fetch('./api/swipes/swipe', {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                otherUserId: currentUser.id
            })
        })
        .then(response => {
            if (response.status === 200) {
                response.json()
                .then(result => {
                    alert(result.data)
                    showUser(true)
                })   
            } else {
                response.json()
                .then(result => {
                    alert(result.data)
                })
            }
        })
    } else {
        showUser(true)
    }
}

getUsers(0)