// Function to make an API request to turn on the light
document.getElementById('turnOnButton').addEventListener('click', function() {
    fetch('/turn_on')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'on') {
                document.getElementById('statusMessage').textContent = 'The light is ON.';
            } else {
                document.getElementById('statusMessage').textContent = 'The light is ON.';  //fix it later
            }
        })
        .catch(error => console.error('Error:', error));
});

// Function to make an API request to turn off the light
document.getElementById('turnOffButton').addEventListener('click', function() {
    fetch('/turn_off')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'off') {
                document.getElementById('statusMessage').textContent = 'The light is OFF.';
            } else {
                document.getElementById('statusMessage').textContent = 'The light is OFF.';  //fix it later
            }
        })
        .catch(error => console.error('Error:', error));
});