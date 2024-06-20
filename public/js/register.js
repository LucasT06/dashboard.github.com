const registerUsernameInput = document.querySelector('.register-username');
const registerEmailLoginInput = document.querySelector('.register-email');
const registerPasswordInput = document.querySelector('.register-password');
const registerSendBtn = document.querySelector('.register-send-btn');

// wanneer er geklikt word word de data in de input naar de websiet gestuurt.
registerSendBtn.addEventListener('click', function (event) {
    try {
        event.preventDefault();
        event.stopPropagation();
        const registerName = registerUsernameInput.value;
        const registerEmail = registerEmailLoginInput.value;
        const registerPassword = registerPasswordInput.value;
        // de data word als een object naar de /add-user gestuurt naar de database.
            (async () => {
                const rawResponse = await fetch('/add-user', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: registerName, email: registerEmail, password: registerPassword })
                });
                const content = await rawResponse.json();
                    //als de data is aangekomen bij de database word er een alert gestuurt dat het gelukt is en zo niet dan word er een alert gestuurt met dat het niet is gelukt
                if (content.userAdded) {
                    alert('user is toegevoegd');
                    window.location.href = 'index.html';
                } else {
                    alert('Er ging iets mis bij het toevoegen van de user');
                }
            })();
    }
    // hier kijkt die of er een error is tijdens het fetchen.
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
});