/* eslint-disable */
/* jshint ignore: start */

const AlertCloser = function () {
    const alerts = document.querySelectorAll('div.alert');
    let timeoutStart = 4000;
    let timeoutIncrement = 500;
    let timeout = timeoutStart + timeoutIncrement;

    for (let i = 0; i < alerts.length; i++) {
        let alert = alerts[i];

        setTimeout(() => {
            $(alert).alert('close');
        }, timeout);

        timeout += timeoutIncrement;
    }
};