// ... (highlightKeywords function if it exists) ...

function showToast(message, type = 'success', duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    toastContainer.style.zIndex = "999999"; // Always on top of everything
    if (!toastContainer) {
        console.error('Toast container not found!');
        alert(message); // Fallback
        return;
    }

    // Main toast element
    const toast = document.createElement('div');
    toast.className = 'flex items-center w-full p-4 rounded-lg shadow-sm transition-all duration-300 ease-in-out transform translate-x-full opacity-0'; // Base classes + animation start
    toast.setAttribute('role', 'alert');

    // Icon container and SVG
    const iconContainer = document.createElement('div');
    iconContainer.className = 'inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg';

    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('class', 'w-5 h-5'); // Adjusted size
    iconSvg.setAttribute('aria-hidden', 'true');
    iconSvg.setAttribute('fill', 'currentColor');
    iconSvg.setAttribute('viewBox', '0 0 24 24'); // Adjusted viewBox

    const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // Removed general stroke attributes as icons might be filled

    const srOnlyIconSpan = document.createElement('span');
    srOnlyIconSpan.className = 'sr-only';

    // Message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'font-medium ms-3 text-sm text-black';
    const highlightedMessage = highlightKeywords(message);
    messageDiv.appendChild(highlightedMessage);


    // Close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8';
    closeButton.setAttribute('aria-label', 'Close');

    const srOnlyCloseSpan = document.createElement('span');
    srOnlyCloseSpan.className = 'sr-only';
    srOnlyCloseSpan.textContent = 'Close';

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

    // Apply type-specific styling
    let mainBgColor, mainTextColor, iconBg, iconText, closeHoverBg, closeFocusRing;

    // Define your Re:Zero SVG paths here (these are placeholders)
    const reZeroInfoIconPath = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"; // Example: Info Circle
    const reZeroWarningIconPath = "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"; 
    const reZeroErrorIconPath = "m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"; 

    switch (type) {
        case 'success':
            mainBgColor = 'bg-green-100';
            mainTextColor = 'text-green-700';
            iconBg = 'bg-green-200';
            iconText = 'text-green-700';
            
            // Clear any existing paths
            while (iconSvg.firstChild) {
                iconSvg.removeChild(iconSvg.firstChild);
            }
            
            // Create outer crystal shape
            const outerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            outerPath.setAttribute('d', 'M12 3L8 10L12 21L16 10L12 3z');
            outerPath.setAttribute('fill', 'currentColor');
            outerPath.setAttribute('opacity', '0.7');
            
            // Create middle layer
            const middlePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            middlePath.setAttribute('d', 'M12 6L9.5 10L12 17.5L14.5 10L12 6z');
            middlePath.setAttribute('fill', 'currentColor');
            middlePath.setAttribute('opacity', '0.85');
            
            // Create center glow
            const centerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            centerPath.setAttribute('d', 'M12 8.5L11 11L12 14L13 11L12 8.5z');
            centerPath.setAttribute('fill', 'currentColor');
            centerPath.setAttribute('opacity', '1');
            
            iconSvg.appendChild(outerPath);
            iconSvg.appendChild(middlePath);
            iconSvg.appendChild(centerPath);
            
            srOnlyIconSpan.textContent = 'Success - Emilia\'s Crystal';
            closeHoverBg = 'hover:bg-green-500/10';
            closeFocusRing = 'focus:ring-green-400';
            break;
        case 'error':
            mainBgColor = 'bg-red-100';
            mainTextColor = 'text-red-700';
            iconBg = 'bg-red-200';
            iconText = 'text-red-700';
            iconPath.setAttribute('d', reZeroErrorIconPath);
            iconPath.setAttribute('stroke', 'currentColor');
            iconPath.setAttribute('stroke-linecap', 'round');
            iconPath.setAttribute('stroke-linejoin', 'round');
            iconPath.setAttribute('stroke-width', '2');
            iconPath.setAttribute('fill', 'none');
            srOnlyIconSpan.textContent = 'Error - Re:Zero Theme';
            closeHoverBg = 'hover:bg-red-500/10';
            closeFocusRing = 'focus:ring-red-400';
            break;
        case 'warning':
            mainBgColor = 'bg-yellow-100';
            mainTextColor = 'text-yellow-700'; // For yellow, text-black on messageDiv might be better
            iconBg = 'bg-yellow-200';
            iconText = 'text-yellow-700';
            iconPath.setAttribute('d', reZeroWarningIconPath);
            srOnlyIconSpan.textContent = 'Warning - Re:Zero Theme';
            closeHoverBg = 'hover:bg-yellow-500/10';
            closeFocusRing = 'focus:ring-yellow-400';
            break;
        default: // info
            mainBgColor = 'bg-white'; // Flowbite default
            mainTextColor = 'text-gray-500'; // Applied to toast
            iconBg = 'bg-blue-100';
            iconText = 'text-blue-500';
            iconPath.setAttribute('d', reZeroInfoIconPath);
            srOnlyIconSpan.textContent = 'Info - Re:Zero Theme';
            closeHoverBg = 'hover:bg-gray-500/10';
            closeFocusRing = 'focus:ring-gray-300';
            break;
    }

    toast.classList.add(mainBgColor, mainTextColor); // mainTextColor applies to the toast div
    iconContainer.classList.add(iconBg, iconText);
    closeButton.classList.add(
        'bg-transparent',
        'text-gray-400',      // Base text color for close icon
        'hover:text-gray-900',// Text color on hover for close icon
        closeHoverBg,
        closeFocusRing
    );

    // Assemble toast
    iconSvg.appendChild(iconPath);
    iconContainer.appendChild(iconSvg);
    iconContainer.appendChild(srOnlyIconSpan);

    closeButton.appendChild(srOnlyCloseSpan);
    closeButton.appendChild(closeSvg);

    toast.appendChild(iconContainer);
    toast.appendChild(messageDiv); 
    toast.appendChild(closeButton);

    toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    });

    // Handle close button click
    closeButton.onclick = () => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300); // Remove after animation
    };

    // Auto-dismiss
    setTimeout(() => {
        if (toast.parentElement) { // Check if not already closed
            closeButton.onclick(); // Trigger the close animation and removal
        }
    }, duration);
}

function highlightKeywords(text) {
    const keywords = [
        "Bật", 
        "Tắt", 
        "OP1 - Redo",
        "ED1 - STYX HELIX",
        "OP2 - Paradisus - Paradoxum",
        "ED2 - Stay Alive",
        "OP3 - Realize",
        "ED3 - Memento",
        "OP4 - Long shot",
        "ED4 - Believe in you",
        "OP5 - Reweave",
        "ED5 - NOX LUX",
        "STRAIGHT BET",
        "Bouya no Yume yo",
        "Memories",
        "White White Snow",
        "Requiem of Silence",
        "Wishing",
        "Yuki no hate ni Kimi no na wo",
        "Door",
        "What you don't know",
        "I Trust You",
        "Theater D"
    ]; // Updated keywords
    let content = document.createElement('span');

    const parts = text.split(new RegExp(`(${keywords.join('|')})`, 'gi'));

    parts.forEach(part => {
        if (keywords.some(kw => kw.toLowerCase() === part.toLowerCase())) {
            const strong = document.createElement('strong');
            strong.textContent = part;
            strong.className = 'whitespace-nowrap'; 
            content.appendChild(strong);
        } else {
            content.appendChild(document.createTextNode(part));
        }
    });
    return content;
}