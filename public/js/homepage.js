$('#homepage-welcome-holder').html(`Welcome ${JSON.parse(localStorage.getItem('ownUser')).username}`)

function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('ownUser')
    loadFragment('login')
}