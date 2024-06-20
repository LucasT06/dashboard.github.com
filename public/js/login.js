const loginUsernameInput = document.querySelector('.login-username');
const loginpPasswordInput = document.querySelector('.login-password');
const loginSendBtn = document.querySelector('.login-send-btn');

let login = false;

// als er op inlogen geklikt word dan word de data van /login opgehaald.
loginSendBtn.addEventListener('click', function () {
    fetch('/login')
        .then((data) => data.json())
        .then((data) => loginUser(data));
        login = false
})

// hier gaat die inlogen kijken of de user mag inlogen.
function loginUser(users) {
    for (let u = 0; u < users.length; u++) {
        const user = users[u];
        // hier kijkt die of de value van de login over heen komt met de data van de fetch.
        if (user.name == loginUsernameInput.value && user.password == loginpPasswordInput.value) {
            alert("u kan inlogen");
            login = true;
            // hier word die naar de vologende website gestuurt.
            window.location.href = 'home.html';
        }
    }
    // als het inloggen niet is gelukt dan word deze alert laten zien.
    if (login == false){
        alert('uw wachtwoord of user name is verkeerd.')
    }
}