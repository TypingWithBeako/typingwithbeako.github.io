// This script handles speech recognition for controlling video playback.
// Side note: Isn't included in offline mode due to browser limitations.

let recognition; // For Speech Recognition
let isSpeechRecognitionActive = false; // To track if recognition is intentionally active

// Function to set up and start speech recognition
function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showToast("Trình duyệt này không hỗ trợ Điều khiển bằng giọng nói.", "error");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening even after a result
    recognition.interimResults = false; // We only want final results
    recognition.lang = 'vi-VN'; // Set language to Vietnamese, can add en-US as fallback if needed

    recognition.onstart = function() {
        isSpeechRecognitionActive = true;
        console.log("Điều khiển bằng giọng nói đã được bật và đang lắng nghe...");
        // Optionally show a toast, but might be too frequent if it restarts often
    };

    recognition.onresult = function(event) {
        if (window.isEditingPlaylist) {
            console.log("Lệnh giọng nói bị bỏ qua: Đang trong chế độ chỉnh sửa danh sách phát.");
            return;
        }

        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript;
            }
        }
        transcript = transcript.toLowerCase().trim();
        transcript = wordsToNumbers(transcript);
        console.log("Đã nhận dạng giọng nói:", transcript);

        if (transcript.includes("tiếp") || transcript.includes("next") || transcript.includes("bài sau")) {
            showToast("Lệnh giọng nói: Chuyển bài kế tiếp", "info");
            nextVideoTrack();
        }
        if (transcript.includes("trước") || transcript.includes("previous") || transcript.includes("bài trước")) {
            showToast("Lệnh giọng nói: Quay lại bài trước", "info");
            previousVideoTrack();
        }
        if (transcript.includes("lặp") || transcript.includes("loop")) {
            loopVideo.click(); // This will also trigger its own toast
            showToast("Lệnh giọng nói: Bật/Tắt lặp video", "info");
        }
        if (transcript.includes("dừng") || transcript.includes("pause")) {
            if (!videoPlayer.paused) {
                videoPlayer.pause();
                showToast("Lệnh giọng nói: Tạm dừng", "info");
            }
        }
        if (transcript.includes("phát") || transcript.includes("play") || transcript.includes("tiếp tục")) {
            if (videoPlayer.paused) {
                videoPlayer.play();
                showToast("Lệnh giọng nói: Phát nhạc", "info");
            }
        }
        if (transcript.includes("ngẫu nhiên") || transcript.includes("random")){
            shuffleButton.click()
        }
        if (transcript.includes("default") || transcript.includes("mặc định")){
            loadPlaylist("default")
        }
        if (transcript.includes("âm lượng") || transcript.includes("volume")){
            const numberMatch = transcript.match(/[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/);
            volumePercent = parseFloat(numberMatch) / 100
            videoPlayer.volume = volumePercent
        }
        if (transcript.includes("độ trễ") || transcript.includes("delay")) {
            // Find any number in the transcript
            const numberMatch = transcript.match(/[+-]?([0-9]+([.,][0-9]*)?|[.][0-9]+)/);
            const delayString = numberMatch[0].replace(",", ".")
            
            if (numberMatch) {
                const delaySeconds = parseFloat(delayString, 10);
                if (isNaN(delaySeconds) || delaySeconds < 0) {
                    showToast("Độ trễ không đúng. Vui lòng nhập lại độ trễ.", "error");
                    return;
                }
                if (delaySeconds > 25) {
                    showToast("Đây không phải là nơi để bạn đi ngủ :V");
                    return;
                }
                updateDelay(delaySeconds)
                showToast(`Độ trễ được cập nhật thành: ${delaySeconds} giây`);
            } else {
                showToast("Không thể nhận dạng số giây cho độ trễ", "error");
            }
        }
    };

    recognition.onerror = function(event) {
        console.error("Lỗi nhận dạng giọng nói:", event.error);
        isSpeechRecognitionActive = false; // Assume it stopped
        if (event.error === 'no-speech') {
            // Restart if no speech was detected, browser might stop it.
            startSpeechRecognition();
        } else if (event.error === 'audio-capture') {
            showToast("Lỗi thu âm thanh cho điều khiển giọng nói.", "error");
        } else if (event.error === 'not-allowed') {
            showToast("Bạn cần cấp quyền truy cập micro cho điều khiển giọng nói.", "error");
        } else if (event.error === 'network') {
            // If network error, it might be good to retry after a delay
            // but continuous retries can be problematic. For now, just log.
            console.warn("Lỗi mạng với điều khiển giọng nói. Sẽ thử khởi động lại.");
            setTimeout(startSpeechRecognition, 1000); // Attempt restart after 1s
        }
    };

    recognition.onend = function() {
        console.log("Kết thúc phiên nhận dạng giọng nói.");
        // If it ended and we still want it active (e.g., not manually stopped), restart it.
        // This handles cases where continuous listening might stop after a while.
        if (isSpeechRecognitionActive) {
            console.log("Tự động khởi động lại điều khiển giọng nói.");
            try {
                recognition.start();
            } catch(e) {
                console.error("Lỗi khi tự động khởi động lại điều khiển giọng nói:", e);
                isSpeechRecognitionActive = false; // Mark as inactive if restart fails
            }
        }
    };
}

function startSpeechRecognition() {
    if (recognition && !isSpeechRecognitionActive) {
        try {
            recognition.start();
            // onstart will set isSpeechRecognitionActive = true
        } catch (e) {
            // This can happen if it's already started or due to other errors
            console.error("Lỗi khi bắt đầu nhận dạng giọng nói:", e);
            isSpeechRecognitionActive = false;
            if (e.name === 'InvalidStateError') {
                // It might be stuck in a weird state, try re-initializing
                console.log("Thử khởi tạo lại SpeechRecognition do InvalidStateError.");
                setupSpeechRecognition(); // Re-setup
                if(recognition) recognition.start(); // Try starting again
            }
        }
    } else if (!recognition) {
        console.log("SpeechRecognition chưa được thiết lập. Đang thử thiết lập...");
        setupSpeechRecognition();
        if (recognition) { // If setup was successful
            startSpeechRecognition(); // Try starting again
        }
    }
}

function stopSpeechRecognition() {
    if (recognition && isSpeechRecognitionActive) {
        isSpeechRecognitionActive = false; // Mark as intentionally stopped
        recognition.stop();
        console.log("Điều khiển bằng giọng nói đã được tắt.");
    }
}

function wordsToNumbers(text) {
  // Map of Vietnamese number words to digits
    const numberMap = {
        // Vietnamese numbers
        'không': '0', 'một': '1', 'hai': '2', 'ba': '3', 'bốn': '4',
        'năm': '5', 'sáu': '6', 'bảy': '7', 'tám': '8', 'chín': '9',
        'mười': '10',
        // English numbers
        'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
        'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
        'ten': '10',
    };
    
    // Try to replace known number words with digits
    let result = text.toLowerCase();
    Object.keys(numberMap).forEach(word => {
        result = result.replace(new RegExp('\\b' + word + '\\b', 'g'), numberMap[word]);
    });
    
    return result;
}

setupSpeechRecognition();
    if (recognition) {
        try {
            // Attempt to start. If it requires a user gesture, it might not start immediately
            // or might prompt for permission.
            startSpeechRecognition();
        } catch (e) {
            console.error("Không thể tự động bắt đầu nhận dạng giọng nói khi tải trang:", e);
            showToast("Nhấn vào trang để thử kích hoạt điều khiển giọng nói.", "info");
            // Add a one-time click listener to the document to try starting it after user interaction
            document.body.addEventListener('click', function attemptStartSpeechAfterInteraction() {
                console.log("Thử kích hoạt điều khiển giọng nói sau khi người dùng tương tác.");
                startSpeechRecognition();
                document.body.removeEventListener('click', attemptStartSpeechAfterInteraction); // Remove listener after first attempt
            }, { once: true });
        }
    }