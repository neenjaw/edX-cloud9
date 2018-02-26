/* eslint-disable */
/* jshint ignore: start */

const CloseNav = function() {
    window.addEventListener('click', function(e) {
        // console.log(e);
        let isClickOutsideOfNav = true;
        let currentElement = e.target;
        let currentLocalName = currentElement.localName;

        while (currentLocalName !== 'body') {
            if (currentLocalName === 'nav') {
                isClickOutsideOfNav = false;
            }

            currentElement = currentElement.parentElement;
            currentLocalName = currentElement.localName;
        }

        if (isClickOutsideOfNav) {
            $('.navbar-collapse').collapse('hide');
        }
    });
};