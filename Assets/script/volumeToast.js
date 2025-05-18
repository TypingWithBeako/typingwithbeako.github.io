let volumeToastTimeout;
let volumeToastElement = null;

function showVolumeToast(volume) {
    // Clear any existing timeout
    clearTimeout(volumeToastTimeout);
    
    // Create toast if it doesn't exist
    if (!volumeToastElement) {
        volumeToastElement = document.createElement('div');
        volumeToastElement.className = 'volume-toast';
        document.body.appendChild(volumeToastElement);
        
        // Add styles if they don't exist
        if (!document.getElementById('volume-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'volume-toast-styles';
            style.textContent = `
                .volume-toast {
                    position: fixed;
                    bottom: 10%;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 9999;
                    opacity: 0;
                    transition: opacity 0.2s ease-in-out;
                    font-family: 'Arial', sans-serif;
                    backdrop-filter: blur(4px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }
                .volume-icon {
                    width: 20px;
                    height: 20px;
                }
                .volume-bar-container {
                    width: 100px;
                    height: 5px;
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 2.5px;
                    overflow: hidden;
                }
                .volume-bar {
                    height: 100%;
                    background-color: #4ade80;
                    border-radius: 2.5px;
                    transition: width 0.2s ease;
                }
                .volume-percentage {
                    margin-left: 8px;
                    min-width: 40px;
                    text-align: right;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Update volume bar and text
    let displayVolumeValue = videoPlayer.muted ? 0 : volume;
    const volumePercentage = Math.round(displayVolumeValue * 100);
    
    let iconPath;
    if (videoPlayer.muted || displayVolumeValue < 1e-9) { // If muted or volume is effectively zero
        iconPath = `<svg class="volume-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.5 8.43A4.985 4.985 0 0 1 17 12c0 1.126-.5 2.5-1.5 3.5m2.864-9.864A8.972 8.972 0 0 1 21 12c0 2.023-.5 4.5-2.5 6M7.8 7.5l2.56-2.133a1 1 0 0 1 1.64.768V12m0 4.5v1.365a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m1-4 14 14"/>
        </svg>`; // Mute icon (speaker with a cross)
    } else if (displayVolumeValue < 0.5) {
        iconPath = `<svg class="volume-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.5 8.43A4.985 4.985 0 0 1 19 12a4.984 4.984 0 0 1-1.43 3.5M14 6.135v11.73a1 1 0 0 1-1.64.768L8 15H6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l4.36-3.633a1 1 0 0 1 1.64.768Z"/>
        </svg>`; // Low volume icon
    } else {
        iconPath = `<svg class="volume-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.5 8.43A4.985 4.985 0 0 1 17 12a4.984 4.984 0 0 1-1.43 3.5m2.794 2.864A8.972 8.972 0 0 0 21 12a8.972 8.972 0 0 0-2.636-6.364M12 6.135v11.73a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l4.36-3.633a1 1 0 0 1 1.64.768Z"/>
        </svg>`; // High volume icon
    }
    
    volumeToastElement.innerHTML = `
        ${iconPath}
        <div class="volume-bar-container">
            <div class="volume-bar" style="width: ${volumePercentage}%;"></div>
        </div>
        <span class="volume-percentage">${volumePercentage}%</span>
    `;
    
    // Show the toast
    volumeToastElement.style.opacity = '1';
    
    // Set timeout to hide
    volumeToastTimeout = setTimeout(() => {
        volumeToastElement.style.opacity = '0';
    }, 1500);
}

// Export the function
window.showVolumeToast = showVolumeToast;