const form = document.getElementById('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = document.getElementById('text').value;

    fetch('/bcrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text
        })
    }).then(response => response.json())
        .then(data => {
            document.getElementById('hash').innerHTML = data.hash;
        });
})