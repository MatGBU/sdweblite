// JavaScript to control the TP-Link power strip
document.getElementById('myButton').addEventListener('click', function() {
    const action = this.dataset.action;  // Determine if the action is 'on' or 'off'
    const url = `http://127.0.0.1:5000/control/${action}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.status) {
            document.getElementById('output').textContent = `Power strip is now ${data.status}`;
            // Toggle action for next click
            this.dataset.action = data.status === 'on' ? 'off' : 'on';
            this.textContent = data.status === 'on' ? 'Turn Off' : 'Turn On';
        } else {
            document.getElementById('output').textContent = 'Failed to control the power strip!';
        }
    })
    .catch(error => {
        document.getElementById('output').textContent = 'Error: ' + error.message;
    });
});
