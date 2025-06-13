function showFullscreenToast(message, duration = 5000) {
    // Create a dedicated container for fullscreen toasts if it doesn't exist
    const existingToast = document.querySelector('#fullscreen-toast-container .fullscreen-toast');
    if (existingToast) {
        return;
    }

    let fullscreenToastContainer = document.getElementById('fullscreen-toast-container');
    if (!fullscreenToastContainer) {
        fullscreenToastContainer = document.createElement('div');
        fullscreenToastContainer.id = 'fullscreen-toast-container';
        fullscreenToastContainer.className = 'fixed top-0 left-0 right-0 flex justify-center pt-4 z-[999999] pointer-events-none';
        document.body.appendChild(fullscreenToastContainer);
    }

    // Create the toast element
    const toast = document.createElement('div');
    // Add fullscreen-toast class so we can detect it with the selector above
    toast.className = 'fullscreen-toast flex items-center p-4 mx-4 rounded-lg bg-white shadow-lg border border-gray-200 transition-all duration-300 ease-in-out opacity-0 -translate-y-full pointer-events-auto max-w-md';    toast.setAttribute('role', 'info');
    
    // Make toast clickable for fullscreen
    toast.style.cursor = 'pointer';
    toast.onclick = () => {
        // Request fullscreen on the document body or any other appropriate element
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { /* Safari */
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE11 */
            element.msRequestFullscreen();
        }
        // Close the toast after clicking
        closeToast();
    };

    // Create icon
    const iconContainer = document.createElement('div');
    iconContainer.className = 'inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-500';

    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('class', 'w-5 h-5');
    iconSvg.setAttribute('aria-hidden', 'true');
    iconSvg.setAttribute('fill', 'currentColor');
    iconSvg.setAttribute('viewBox', '0 0 20 20');

    const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconPath.setAttribute('fill-rule', 'evenodd');
    iconPath.setAttribute('d', 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z');
    iconPath.setAttribute('clip-rule', 'evenodd');

    iconSvg.appendChild(iconPath);
    iconContainer.appendChild(iconSvg);

    // Create message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'ms-3 text-sm font-medium text-gray-800';
    messageDiv.textContent = message;

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'ms-auto -mx-1.5 -my-1.5 bg-transparent text-gray-400 hover:text-gray-900 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8';
    closeButton.setAttribute('aria-label', 'Close');

    const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    closeSvg.setAttribute('class', 'w-3 h-3');
    closeSvg.setAttribute('aria-hidden', 'true');
    closeSvg.setAttribute('fill', 'none');
    closeSvg.setAttribute('viewBox', '0 0 14 14');

    const closePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    closePath.setAttribute('stroke', 'currentColor');
    closePath.setAttribute('stroke-linecap', 'round');
    closePath.setAttribute('stroke-linejoin', 'round');
    closePath.setAttribute('stroke-width', '2');
    closePath.setAttribute('d', 'm1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6');

    closeSvg.appendChild(closePath);
    closeButton.appendChild(closeSvg);

    // Function to close the toast
    function closeToast() {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('-translate-y-full', 'opacity-0');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }

    closeButton.onclick = (e) => {
        e.stopPropagation(); // Prevent triggering toast's click event
        closeToast();
    };

    // Assemble the toast
    toast.appendChild(iconContainer);
    toast.appendChild(messageDiv);
    toast.appendChild(closeButton);
    fullscreenToastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('-translate-y-full', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Auto-dismiss
    const timeoutId = setTimeout(() => {
        closeToast();
    }, duration);

    // Return the toast element in case you need to manipulate it further
    return toast;
}