const emailInput = document.querySelector('.email');
const questionInput = document.querySelector(".qestion");
const supportSendBnt = document.querySelector(".send");

registerSendBtn.addEventListener('click', function (event) {
    try {
        event.preventDefault();
        event.stopPropagation();
        const registerName = registerUsernameInput.value;
        const registerEmail = registerEmailLoginInput.value;
        const registerPassword = registerPasswordInput.value;
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
                console.log(content);
                if (content.userAdded) {
                    alert('user is toegevoegd');
                    window.location.href = 'index.html';
                } else {
                    alert('Er ging iets mis bij het toevoegen van de user');
                }
            })();
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
    }
});