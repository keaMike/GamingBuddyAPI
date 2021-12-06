function makeUserCard(user, haveMatched) {
    let gameString = ''
    let platformString = ''
    let messageButton = ''

    if (user.games !== null) {
        user.games.map(game => {
            gameString += `<li><b>${game.name}</b> - <i>${game.rank}</i></li>`
        })
    }

    if (user.platforms !== null) {
        user.platforms.map(platform => {
            platformString += `<li><b>${platform.platform}</b> - <b>${platform.gamertag}</b></li>`
        })
    }

    if (haveMatched) {
        messageButton = `<button class="btn btn-info" onclick="sessionStorage.setItem('sendMessageId', '${user.id}'); loadFragment('sendmessage')">Send message</button>`
    }
    
    return `<div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${user.username}</h5>
            <p class="card-text">
                ${user.bio}
            </p>
            <div>
                <h5>Games:</h5>
                <ul>
                    ${gameString}
                </ul>
            </div>
            <div>
                <h5>Platforms:</h5>
                <ul>
                    ${platformString}
                </ul>
            </div>
            ${messageButton}
        </div>
    </div>`
}

function makeMessageCard(message) {
    const cardBg = message.sent ? 'text-white bg-primary' : 'text-dark bg-light'
    const messageButton = message.sent ? '' : `<button class="btn btn-info" onclick="sessionStorage.setItem('sendMessageId', '${message.user.id}'); loadFragment('sendmessage')">Reply</button>`

    return `<div class="card ${cardBg}" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${message.user.username}</h5>
            <p class="card-text">
                ${message.content}
            </p>
            <p class="card-test">
                <i>${new Date(message.sentAt).toLocaleString()}</i>
            </p>
            ${messageButton}
        </div>
    </div>`
}