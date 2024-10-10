document.getElementById('turnOnButton').addEventListener('click', function() {
    fetch('127.0.0.1:5001/turn_on')
        .then(response => response.json())

        .catch(error => console.error('Error:', error));
});

document.getElementById('turnOffButton').addEventListener('click', function() {
    fetch('127.0.0.1:5001/turn_off')
        .then(response => response.json())

        .catch(error => console.error('Error:', error));
});
