var videoUrls = [
    "Openings_and_Endings/OP1 - Redo.mp4",
    "Openings_and_Endings/ED1 - STYX HELIX.mp4",
    "Openings_and_Endings/OP2 - Paradisus - Paradoxum.mp4",
    "Openings_and_Endings/ED2 - Stay Alive.mp4",
    "Openings_and_Endings/OP3 - Realize.mp4",
    "Openings_and_Endings/ED3 - Memento.mp4",
    "Openings_and_Endings/OP4 - Long shot.mp4",
    "Openings_and_Endings/ED4 - Believe in you.mp4",
    "Openings_and_Endings/OP5 - Reweave.mp4",
    "Openings_and_Endings/ED5 - NOX LUX.mp4",
];
var newvideoUrls = [
    "Insert_Songs/STRAIGHT BET.mp4",
    "Insert_Songs/Memories.mp4",
    "Insert_Songs/White White Snow.mp4",
    "Insert_Songs/Yuki no hate ni Kimi no na wo.mp4",
    "Insert_Songs/Wishing.mp4",
    "Insert_Songs/Door.mp4",
    "Insert_Songs/What you don't know.mp4",
    "Insert_Songs/I Trust You.mp4",
];
    
let isPosterSet = false; //Track if poster is set
let currentIndex = 0; // For videoUrls
let newcurrentIndex =0; // For newvideoUrls
let isSwitching = false;
let clickCount = 0;
let preloadedVideos = [];
let disablePreloading = false;
let nextVideoTimeout;
let loopcurrentIndex = 0;
let loopclickCount = 0;
let enableLoopingListener = null;
let delay = 0;
let isAnimating = false;
let intervalId;
let isIntervalActive = true;
let FclickCount = 0;
let nextClickCount = 0;
let keyB = 0

function playVideo(videoName) {
    nextVideo.src = '';
    // Extract the file name from the full path
    const songName = videoName.split('/').pop(); // Get the last part of the path after splitting by '/'
    // Update the video player screen with the selected video
    // For example, you can set the video source and play the video
    document.getElementById('videoPlayer').src = videoName;
    document.getElementById('videoPlayer').play();
    console.log('Video selected:',songName)
    // Update the currentIndex and newcurrentIndex based on the selected video
    currentIndex = videoUrls.indexOf(videoName);
    newcurrentIndex = newvideoUrls.indexOf(videoName);
    if (!isPosterSet) {
        videoPlayer.poster = "Other_Files/black.png";
        isPosterSet = true;
    }
    // Clear the timeout for playNextVideo
    clearTimeout(nextVideoTimeout); 
    // When playVideo is executed, reset isSwitching.
    isSwitching = false; 
    simulateClick();
}
const videoPlayer = document.getElementById('videoPlayer');
videoPlayer.addEventListener('play',function(){
    clearTimeout(nextVideoTimeout);
    isSwitching = false;
    if (!isPosterSet) {
    videoPlayer.poster = "Other_Files/black.png";
    isPosterSet = true;
    }
    var name = ''
    var artist = ''
    let musicArtwork = ''
    const songName = videoPlayer.src.split('/').pop(); // Get the last part of the path after splitting by '/'
    if (songName == "S1%20Ending.mp4"){
        name = 'Season 1 Ending'
        artist = 'Myth & Roid'
        musicArtwork = {
            src: "Icons/artworks/STYX_HELIX_Cover.webp",
            sizes: "1008x1000",
            type: "image/png",
          }
    }
    else if (songName == "S2%20Ending.mp4"){
        name = 'Season 2 Ending'
        artist = 'Mayu Maeshima'
        musicArtwork = {
            src: "Icons/artworks/Long_Shot_Cover.webp",
            sizes: "997x992",
            type: "image/png",
          }
    }
    else if (songName == "Theater%20D.mp4"){
        name = 'Theater D'
        artist = 'Myth & Roid'
        musicArtwork = {
            src: "Icons/artworks/Theater_D_Cover.jpg",
            sizes: "1080x1080",
            type: "image/png",
          }
    }
    else if (songName == 'ED1%20-%20STYX%20HELIX%20slow.mp4') {
        name = 'STYX HELIX (slow ver.)'
        artist = 'Mayu Maeshima'
        musicArtwork = {
            src: "Icons/artworks/STYX_HELIX_Cover.webp",
            sizes: "997x992",
            type: "image/png",
          }
    }
    else if (clickCount %2 == 1){
        const songName = newvideoUrls[newcurrentIndex].split('/').pop();
        const lastDot = songName.lastIndexOf('.'); // exactly what it says on the tin
        name = songName.slice(0, lastDot); // characters from the start to the last dot
    }
    else {
        const songName = videoUrls[currentIndex].split('/').pop();
        const lastDot = songName.lastIndexOf('.'); // exactly what it says on the tin
        name = songName.slice(6, lastDot)
    }
    if (name == 'STYX HELIX' || name == 'Paradisus - Paradoxum' || name == 'NOX LUX' ||name == 'STRAIGHT BET'){
        artist = 'Myth & Roid'
        if (name == 'STYX HELIX')
            musicArtwork = {
                src: "Icons/artworks/STYX_HELIX_Cover.webp",
                sizes: "1008x1000",
                type: "image/png",
              }
        else if (name == 'Paradisus - Paradoxum')
            musicArtwork = {
                src: "Icons/artworks/Paradisus-Paradoxum_Cover.webp",
                sizes: "1000x993",
                type: "image/png",
              }
        else if (name == 'NOX LUX')
            musicArtwork = {
                src: "Icons/artworks/NOX_LOX_Cover.webp",
                sizes: "1080x1080",
                type: "image/png",
              }
        else if (name == 'STRAIGHT BET')
            musicArtwork = {
                src: "Icons/artworks/STRAIGHT_BET_Cover.jpg",
                sizes: "721x720",
                type: "image/png",
              }
        }
    else if (name == 'STYX HELIX nocut') {
        name = 'STYX HELIX'
        artist = 'Myth & Roid'
        musicArtwork = {
            src: "Icons/artworks/STYX_HELIX_Cover.webp",
            sizes: "997x992",
            type: "image/png",
          }
    }
    else if (name == 'Long shot'){
        artist = 'Mayu Maeshima'
        musicArtwork = {
            src: "Icons/artworks/Long_Shot_Cover.webp",
            sizes: "1400x1400",
            type: "image/png",
          }
    }
    else if (name == 'Redo' || name == 'Realize' || name == 'Reweave'){
        artist = 'Konomi Suzuki'
        if (name == 'Redo')
            musicArtwork = {
                src: "Icons/artworks/Redo_Cover.webp",
                sizes: "997x992",
                type: "image/png",
            }
        else if (name == 'Realize')
            musicArtwork = {
                src: "Icons/artworks/Realize_cover.webp",
                sizes: "500x500",
                type: "image/png",
            }
        else if (name == 'Reweave')
            musicArtwork = {
                src: "Icons/artworks/Reweave_Cover.webp",
                sizes: "1600x1600",
                type: "image/png",
            }
        }
    else if (name == 'Stay Alive' || name == 'Door' || name == 'I Trust You'){
        artist = 'Emilia (CV: 高橋李依)'
        if (name == 'Stay Alive')
            musicArtwork = {
                src: "Icons/artworks/Stay_Alive_Cover.webp",
                sizes: "1280x1281",
                type: "image/png",
            }
        else if (name == 'Door')
            musicArtwork = {
                src: "Icons/artworks/Character_song_album.webp",
                sizes: "1280x1280",
                type: "image/png",
            }
        else if (name == 'I Trust You')
            musicArtwork = {
                src: "Icons/artworks/Character_song_album.webp",
                sizes: "1280x1280",
                type: "image/png",
            }
    }
    else if (name == 'Memento' || name == 'Believe in you' || name == 'Yuki no hate ni Kimi no na wo' || name == 'White White Snow'){
        artist = 'nonoc'
        if (name == 'Memento')
            musicArtwork = {
                src: "Icons/artworks/Memento_cover.webp",
                sizes: "500x500",
                type: "image/png",
            }
        else if (name == 'Believe in you')
            musicArtwork = {
                src: "Icons/artworks/Believe_in_you_cover.webp",
                sizes: "500x500",
                type: "image/png",
            }
        else if (name == 'Yuki no hate ni Kimi no na wo')
            musicArtwork = {
                src: "Icons/artworks/Memory_Snow_OVA_Music_Cover.webp",
                sizes: "640x640",
                type: "image/png",
            }
        else if (name == 'White White Snow')
            musicArtwork = {
                src: "Icons/artworks/Memory_Snow_OVA_Music_Cover.webp",
                sizes: "640x640",
                type: "image/png",
            }
    }
    else if (name == 'Memories'){
        artist = 'Azuna Riko'
        musicArtwork = {
            src: "Icons/artworks/Memory_Snow_OVA_Music_Cover.webp",
            sizes: "640x640",
            type: "image/png",
        }
    }
    else if (name == 'Wishing'){
        artist = 'Rem (CV: Inori Minase)'
        musicArtwork = {
            src: "Icons/artworks/Character_song_album.webp",
            sizes: "1280x1280",
            type: "image/png",
        }
    }
    else if (name == 'What you don\'t know'){
        artist = 'Ram (CV: Rie Murakawa)'
        musicArtwork = {
            src: "Icons/artworks/Character_song_album.webp",
            sizes: "1280x1280",
            type: "image/png",
        }
    }
    
    navigator.mediaSession.metadata = new MediaMetadata({
        title: name,//the title of the media
        artist: artist,//the artist of the media
        artwork: [
            musicArtwork
        ]
      });
    document.title = name;
    navigator.mediaSession.setActionHandler("previoustrack", () => {
        previousVideoTrack()
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
        nextVideoTrack()
    });
})
// Automatically play next video after ending with a delay
function playNextVideo() {
    if (!isSwitching) {
        isSwitching = true;
        // Delay before switching to the next video
        nextVideoTimeout = setTimeout(function() {
            if (clickCount % 2 === 1) {
                newcurrentIndex = (newcurrentIndex + 1) % newvideoUrls.length;
                videoPlayer.src = newvideoUrls[newcurrentIndex];
            } else {
                currentIndex = (currentIndex + 1) % videoUrls.length;
                videoPlayer.src = videoUrls[currentIndex];
            }
            videoPlayer.poster = "Other_Files/black.png"; // Clear the poster attribute
            videoPlayer.play();
            isSwitching = false;
        }, delay);     
    }
}

// Add event listener to stop the timeout if playVideo is pressed while setTimeout is running
videoPlayer.addEventListener('play', function() {
    clearTimeout(nextVideoTimeout);
});

const mediaQuery = window.matchMedia('(max-width: 722px)'); // Define a media query for mobile devices
const moveableimg = document.querySelector('.moveable_img');
const textToChange = document.getElementById('text_to_change');
const navbarContent = document.getElementById('oldnavbarContent');
const newnavbarContent = document.getElementById('newnavbarContent');
const bodytext =document.getElementById('bodytext');
const songname =document.getElementById('songname');
const disablePreloadingbutton = document.querySelector('.subaru');
const enablePreloadingbutton = document.querySelector('.trademark');
const nextButton = document.getElementById('nextButton');
const backButton = document.getElementById('backButton');
const S3 = document.getElementById('Season3Content');
const SidebarButton = document.getElementById('SidebarButton');
const Trademark = document.getElementById('trademark');

moveableimg.addEventListener('click', function(){
        
    if (isAnimating || this.hasAttribute('disabled')) {
    return; // Exit the function if an animation is already in progress or the element is disabled
    }
    isAnimating = true; // Set the flag to indicate that an animation is in progress
    this.setAttribute('disabled', 'disabled'); // Disable the clickable element
    clickCount++;
    nextClickCount = 0;
    console.log("Image clicked!"); // Add this line for testing
    if (clickCount % 2 === 1) {
        textToChange.innerHTML = "All <s> OPs and EDs</s> Insert Songs";
        bodytext.innerHTML = "Nhạc chủ đề"
        songname.innerHTML = "Mở đầu và Kết thúc"
        navbarContent.style.display = 'none';
        newnavbarContent.style.display ='flex';
        videoPlayer.src= newvideoUrls[0];
        newcurrentIndex=0;
        clearTimeout(nextVideoTimeout);
        isSwitching = false; 
        textToChange.classList.add('fade-in-title');
        bodytext.classList.add('fade-in-bodytext');
        songname.classList.add('fade-in-songname');
        newnavbarContent.classList.add('slide-in');
        moveableimg.classList.add('fade-in');
        backButton.style.display ='none';
        nextButton.style.display ='none';
        S3.style.display='none';
        Insert_Songs.style.display = '';
        Endings.style.display = 'none';
        Openings.style.display = 'none';
        Openings_Content.style.display = 'none';
        Endings_Content.style.display = 'none';
        Insert_Songs_Content.style.display = '';
        SidebarButton.innerHTML = "Chuyển sang OPs và EDs";
    }
    else {
        textToChange.innerHTML = " All OPs and EDs ";
        bodytext.innerHTML = "Mở đầu và Kết thúc";
        songname.innerHTML = "Nhạc chủ đề"
        navbarContent.style.display ='flex';
        newnavbarContent.style.display ='none';
        videoPlayer.src=videoUrls[0];
        videoPlayer.src = videoUrls[0];
        currentIndex=0;
        clearTimeout(nextVideoTimeout); 
        isSwitching = false; 
        textToChange.classList.add('fade-in-title');
        bodytext.classList.add('fade-in-bodytext');
        songname.classList.add('fade-in-songname');
        navbarContent.classList.add('slide-in');
        moveableimg.classList.add('fade-in');
        nextButton.style.display ='inline';
        nextButton.classList.add('fade-in-songname')
        Insert_Songs.style.display='none';
        Openings.style.display = '';
        Endings.style.display = '';
        Openings_Content.style.display = '';
        Endings_Content.style.display = '';
        Insert_Songs_Content.style.display = 'none';
        SidebarButton.innerHTML = "Chuyển sang Nhạc chủ đề";
    }
    setTimeout(() => {
    isAnimating = false; // Reset the flag once the animation is complete
    this.removeAttribute('disabled'); // Re-enable the clickable element
    }, 5751); // Adjust the timeout value to match your animation duration
});
// Remove the animation class after the animation ends
textToChange.addEventListener('animationend', () => {
textToChange.classList.remove('fade-in-title');
});
bodytext.addEventListener('animationend', () => {
bodytext.classList.remove('fade-in-bodytext');
});
songname.addEventListener('animationend', () => {
songname.classList.remove('fade-in-songname');
});
navbarContent.addEventListener('animationend', () => {
navbarContent.classList.remove('slide-in');
});
newnavbarContent.addEventListener('animationend', () => {
newnavbarContent.classList.remove('slide-in');
});
moveable_img.addEventListener('animationend', () => {
moveable_img.classList.remove('fade-in');
});
nextButton.addEventListener('animationend', () => {
nextButton.classList.remove('fade-in-songname');
});

function handleFontSizeChange(mediaQuery) {
    // Change font size for mobile devices
    if (mediaQuery.matches) {
        textToChange.style.fontSize = '4.2vw';
    }
    // Reset font size for non-mobile devices
    else {
        textToChange.style.fontSize = 'inherit'; 
    }
}

// Initial call to set font size based on device width
handleFontSizeChange(mediaQuery);
// Add event listener for changes in media query
mediaQuery.addEventListener('change', handleFontSizeChange);

const root = document.documentElement;
// Disable preloading when clicking on re:zero cast image
disablePreloadingbutton.addEventListener('click',function(){
    if (!disablePreloading) {
        alert("Preloading disabled!");
        console.log('Preloading disabled!');
        disablePreloading = true;
        root.style.setProperty('--subarumouse', 'image-set(url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAllBMVEUAAAAkJCQfHx8SEhIMDAwNDQ0JCQkKCgoODg7x8fFycnL8/Pz9/f3Dw8MJCQn6+vqNjY3////y8vLp6ene3t7u7u7S0tLr6+vDw8P09PT29vb4+Pju7u7a2trw8PClpaVbW1ubm5utra0jKDP///8/Q03j5OWtrrNaXmbx8vLIycyRk5loa3MxNkCDhox2eYDx8fK6vL8DdzWRAAAAI3RSTlMABAcIDQsSFQ+YJePhKhrUOvCojG5nYVdUyMa0iYN3My0cGZgGfOIAAAD+SURBVDjLzZLZcsIwDEWxvJJAwtZC98WKk5LQ5f9/rso4Mx4UwjN61RndI9mzmypxvStAghDTEOzXOF/KSUTIMtS4eNUwQYDK/3xFyB0hFweo+Zf3vgm42JPLGAC1w8ZT/QR8WsYgFpHht/cDsult2ZLa5kcfq2qRFgJGaEMSQ0XbGJMk3D1JJOS4/hTMkiRSv6vx4zyEJMpB4tQGRHxWwC5BEqe+3/3iw8shMzoCI4kOy1VRWKOkGF+ipfSQvxfGaZmWSBKPJFHjyjqdHp5LVLgpXDzjGHAHbGiA0anNMrIccWsVTPRpxNt2Z5k9+xSGbccAkJJ/Fo70NbvB+gfwVhoJL6w+jwAAAABJRU5ErkJggg==) 1x, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAvVBMVEUAAAAdHR0TExMSEhIODg4KCgoHBwcGBgYHBwcJCQkMDAwGBgb+/v78/PwGBgYGBgbBwcH39/dra2vq6urExMT19fXu7u74+Pj09PTk5OTs7OzQ0NDm5ub+/v75+fn7+/vo6Oji4uLv7+/X19e1tbWysrKIiIjX19fa2trg4ODU1NRSUlKEhIS1tbW8vLwjKDP////j5OU/Q012eICtrrNaXmbx8fKfoaaRlJkxNkDIyczW19loa3ODhoxNUFlr0DWwAAAAL3RSTlMABgoIDQ8XEhUUERnx4yAbKsYnjFOmm7SXfWhiWeHU0p+Rd3JaRT1zS0k7Mh8YF+5vndUAAAIwSURBVFjD7ZbbUttAEERhtaurLcl2HDCXBJJA7tFYiMQBkv//rPRIU0FClFcrqige3O/d6jmz4/LeTju9UO1DT3F7P7573tgQ+PMZ0emRUsgY4/fyU2JNT5RCD/fvqyXcPwk6yDVP4lpAvyW6KzfEWuaug6AAB1wXRVkR6zDXLhEooMwh0aaAmojpO6cETBAfE90Uta7XdcSR5kGGB8xh+l00umoiTga34AD/TQ2hE3EgKIYFvCb6VfxXZyGDIIYCQdRaiFL2EvvKRAJB1F0IWtgqmKALobsQKwpACB5AeGQhW5+ijsNXRLf3zt5CkOAEobeQz0iwzDDDPRWiPs2JRoDLS+hG4NK/YJ1bZ2hB6OuW6JOyQpg8CqG8+1MxyG+DIFw9fAkVytdaxNshKEBYAEJ/hbUmq0hvbyAQ1u3uN413dvbxIgkDDQZOEP6u2X3+IU3TDH6jPEuADhKG0N4cnX2FO0v8KDCYYM92Dm0I5Rqfx9fhDtluPWpAiNsQKvgv0/rjMezit0FIAKFs+KP/cZr5mB323jXbIWCAJfyR2K1+OWl/RVRJgekl/LHuuC0U5SVIgfMswep4d0PlYQaBwAXm6K+76OwQ5Bx4he8TH/3Z7pCgTbjiH/cNCmR4u/369kVe1H8TuEBklHOApw1+llizJIydCzBGE4SLKU0Wc/hrgK4VOMGf4/W7+4WCMnEU4HgEgHMAYzBGaz3OjwBMwZL+4zpA/PzHi9077fRs+gdaMIOfVRGM4AAAAABJRU5ErkJggg==) 2x) 8 8, default');
        Trademark.style.cursor = "var(--pointermouse)"
        // Added failsafe if mistakenly clicked on picture (in IF statements: "!const" = "const === false")
        if (disablePreloading){
            enablePreloadingbutton.addEventListener('click',function(){
                alert("Preloading enabled!");
                console.log('Preloading enabled!');
                disablePreloading = false;
                root.style.setProperty('--subarumouse', 'image-set(url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAmVBMVEUAAAAbGxsZGRkTExMICAgJCQkPDw8QEBB1YfIICAh0X/BwXeltWuFZSrdyXuxpV9xnVdZiU8tvXehyX+1wXehuXOZfT8VdUcE0LWxyX+1zX+1lU8xmU81hUchVSbJYTLdSR6P///91YfOGdfX39f6pnPfLxPvu6/3Y0/zCuvq6sPmxpviXiPaPfvV+a/R9a/TDuvqhkvegkvdrWLcYAAAAIXRSTlMABQcLEBQNCfEX45aKVcaOfye4lId2Tykk1LRycWFCQBntRKz0AAABCUlEQVQ4y83S11LDMBAF0KhLNm6k0tmVbCchBfj/j8MaGHmIZHhjuLNve7xWm/2vkF/azXze0Ok+Xesz6vX0FJVj359zNSlYfnJwyDibEIStcAs73HCmKEkBucFX2KLWt1ovWGwIE1kLPbatr3zZREKJmzdwCOALMXsmEbg+AnyBvsclJRGwAKFwwcjFGp7wHcbglfwOqCyt+xFw/QIAnQUA23nAaQrs0X+9T04oT26c4LCW9OIkH/VxXESHq2gX4h4PAdhMBBD+Ye6w/Wy7Fh84jc6amwpt58DtLFZCRoAwbooMfcrCcJW4ccWFKeqqLoxIvxtC2UCMb/ubSomBSCnDm0qjIbM/zgdM/h9ZMvytJwAAAABJRU5ErkJggg==) 1x, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAsVBMVEUAAAAlJSUVFRUODg4KCgoICAgGBgYHBwcJCQkHBwd0YPIHBwcGBgYLCwtjU810X+9zX+9kU8xRQp5vXOdEOox0YPBzX+9wXelvXOZnVtdQRKc0LWpxXupyX+1rWd5tXORhUclWR7JkVMxORKJwXedwXupqWdtYSbZiVcv///91YfOGdfXu6/26sPn39f6onPfd1/x+a/TUzvuxpvipnffDuvqXiPbl4f3LxPuhkveypviacpDcAAAAKXRSTlMABQkMDxMWEBIY8RseFXLj00wZhzjiw5aof0Ylx8SeZmFXOTG4tmpXJ53eMHQAAAJ8SURBVFjD7ZfXdtswEEQTopAARXVbzXZc0jSUZFWX/P+HZQkgKocyQDMvOUnmAUcvczG7WEjQh//6a/XxN+1W9e0H1fVH3e/3UWQItfzdngb0oBvVIJjt2zBq1yGQPxoAyHMAPUaE9wdgGphPp3NAd+sQ2D2QT0k50GHROwlFgAcH2ACDmJXaEAZMNDAjwBq4FpwIVpUBXHwBdgRYAFomRCBZRlXACNi6JvSliBkrMfyAbOya8Aq0NK6/di41Lj85RhjAxASA7eKxeswhwiWolu3iDifqcGYJoQSJvALW9hgeF7PHX6u2hQQIBjAEXgjwbIIs3EoKTbdLEMseMCfAzLbCrU6dIoMfwLMRsHHWw+oKuWRBQJw1gW0J4ArR3EugDhHgFni1pvKKOBDBJXgyo5gfrw4gOPMmIMCDdoCyAGQ88gN4cgHks7cBMaNCfYAOTMPeAkhvE4pTHJozCAB8LWgDy6nVHPP9h+qAi0MFAPYfTgDeuxQAqMSfgAtTQv0EPBkAT2cBdpSDPUg6cBHKTVwC7cxMovc2fwZWz9Nz2gBDEfsnkXExaRHh7CjlwC2NsjcB1aD6rfPD/AJcqIQHb6NQfX2OMMuBpu1h6Fs1HRtC2d9S/ttMADMKMr2DJZz60d+PkTcCFyptAljt9vbFfAWgqdxlrkpAvl0uaPP1j8Kum6m0AQIA00iZ0lmcqD1OpeCRAYQJnAiN5hFCjxqF3waoREikShvfbq40mds3d41UycT5qxJEgXAiu4iN3wHChIjHSSaVUmlKixTF9tZfmcAoRSJEJoRIaHdW/m0PI4hhxDyvC++j+0h1nr1OUf3HPzFqmf+ov0//hn4CGZ+XfMz98P8AAAAASUVORK5CYII=) 2x) 10 6, pointer');
                Trademark.style.cursor = "var(--normalmouse)"
            }, {once :  true});
        }
    }
}, );

const nextVideo = document.createElement('video');
// Video preloading 
videoPlayer.addEventListener('timeupdate', function() {
    const currentTime = videoPlayer.currentTime;
    const duration = videoPlayer.duration;
    if (duration - currentTime <= 5 && !disablePreloading) {

    // Preload multiple videos based on the current video type
        if (clickCount % 2 === 1) {
            const nextNewIndex = (newcurrentIndex + 1) % newvideoUrls.length;
            if (!preloadedVideos.includes(newvideoUrls[nextNewIndex])) {
                nextVideo.src = newvideoUrls[nextNewIndex];
                nextVideo.preload = 'auto';
                preloadedVideos.push(newvideoUrls[nextNewIndex]);
                console.log('Next new video preloaded:', newvideoUrls[nextNewIndex]);                                      
            }
        }
        else {
            const nextIndex = (currentIndex + 1) % videoUrls.length;
            if (!preloadedVideos.includes(videoUrls[nextIndex])) {
                nextVideo.src = videoUrls[nextIndex];
                nextVideo.preload = 'auto';
                preloadedVideos.push(videoUrls[nextIndex]);
                console.log('Next video preloaded:', videoUrls[nextIndex]);  
            }
        }
    }      
});
function disableFocus(element) {
    element.addEventListener('mousedown', function(event) {
        event.preventDefault();
    });
}
disableFocus(videoPlayer);

// Reset preloadedVideos array every 60 seconds (worst case scenario) to optimize playback.
function ResetArray(){
    preloadedVideos = [];
}
videoPlayer.addEventListener('ended',ResetArray)

function cleanVideoSrc(src) {
    const startIndex = src.lastIndexOf("/") - 20; 
    const cleanedPath = src.substring(startIndex);
    return cleanedPath.replace(/%20/g, ' ');
}

// Enable and Disable Looping functions
enableLoopingListener = function EnableLooping() {
    const currentVideo = cleanVideoSrc(videoPlayer.src)
    if (!videoUrls.includes(currentVideo) && !newvideoUrls.includes(currentVideo)){
        clearTimeout(nextVideoTimeout);
    }
    else if (clickCount % 2 == 1) {
        loopcurrentIndex = newcurrentIndex;
        videoPlayer.src = newvideoUrls[loopcurrentIndex];
        clearTimeout(nextVideoTimeout);
    }
    else {
        loopcurrentIndex = currentIndex;
        videoPlayer.src = videoUrls[loopcurrentIndex];
        clearTimeout(nextVideoTimeout);
    }
    videoPlayer.play();
    isSwitching = false;
};
const loopVideo = document.querySelector('#loop')
const loopText = document.querySelector('.looptext')
loopVideo.addEventListener('click',function() {
    loopclickCount++
    if (loopclickCount % 2 == 1){
        loopText.innerHTML = "Tắt lặp video";
        videoPlayer.removeEventListener('ended',ResetArray);
        videoPlayer.addEventListener('ended', enableLoopingListener);
        const currentVideo = cleanVideoSrc(videoPlayer.src)
        if (!videoUrls.includes(currentVideo) && !newvideoUrls.includes(currentVideo)){
            const songName = currentVideo.split('/').pop(); // Get the last part of the path after splitting by '/'
            const lastDot = songName.lastIndexOf('.'); // exactly what it says on the tin
            const name = songName.slice(0, lastDot); // characters from the start to the last dot
            console.log('Video looping enabled for:', songName);
            alert("Bật tính năng lặp cho: " + name);   
        }
        else if (clickCount % 2 == 1){ 
            const songName = newvideoUrls[newcurrentIndex].split('/').pop(); // Get the last part of the path after splitting by '/'   
            console.log('Video looping enabled for:', songName);
            alert("Bật tính năng lặp cho: " + songName);
        }
        else {
            const songName = videoUrls[currentIndex].split('/').pop();
            const lastDot = songName.lastIndexOf('.'); // exactly what it says on the tin
            const name = songName.slice(0, lastDot); // characters from the start to the last dot
            console.log('Video looping enabled for:', songName);
            alert("Bật tính năng lặp cho: " + name);   
        }
    }
    else {
        loopText.innerHTML = "Bật lặp video";
        videoPlayer.removeEventListener('ended', enableLoopingListener);
        videoPlayer.addEventListener('ended',ResetArray);
        const currentVideo = cleanVideoSrc(videoPlayer.src)
        if (!videoUrls.includes(currentVideo) && !newvideoUrls.includes(currentVideo)){
            const songName = currentVideo.split('/').pop(); // Get the last part of the path after splitting by '/'
            const lastDot = songName.lastIndexOf('.'); // exactly what it says on the tin
            const name = songName.slice(0, lastDot); // characters from the start to the last dot
            console.log('Video looping disabled for:', name);
            alert("Tắt tính năng lặp cho: " + name);
        }
        else if (clickCount % 2 == 1){
            const songName = newvideoUrls[newcurrentIndex].split('/').pop();
            console.log('Video looping disabled for:', songName)
            alert("Tắt tính năng lặp cho: " + songName);
        }
        else {
            const songName = videoUrls[currentIndex].split('/').pop();
            const lastDot = songName.lastIndexOf('.'); // exactly what it says on the tin
            const name = songName.slice(0, lastDot); // characters from the start to the last dot
            console.log('Video looping disabled for:', name);
            alert("Tắt tính năng lặp cho: " + name);
        }
    }
});

// Function to shuffle the array elements randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
return array;
}
// Get a reference to the shuffle button element
const shuffleButton = document.getElementById('randomize');
// Add an event listener to the shuffle button to randomize the order of songs
shuffleButton.addEventListener('click', function() {
// Shuffle the videoUrls array
    if (clickCount % 2 == 1){
        newvideoUrls = shuffleArray(newvideoUrls);
        playVideo(newvideoUrls[0]);
        preloadedVideos = [];
    }
    else {
        videoUrls = shuffleArray(videoUrls);
        playVideo(videoUrls[0]);
        preloadedVideos = [];
    }
    alert("Video đã được xáo (vào console log để biết thêm)");
// You can now use the shuffled videoUrls array for playing the songs in a random order
    if (clickCount % 2 == 1)
        console.log('Shuffled videos to:', newvideoUrls);
    else
        console.log('Shuffled videos to:', videoUrls);
});
    
// Update the delay variable
function updateDelay(newDelay) {
    delay = newDelay; 
}
// Add event listener for button click
document.getElementById("Delay").addEventListener("click", function() {
    // Prompt user for new delay
    let newDelay = parseInt(prompt("Nhập độ trễ mới bằng mili giây: (Độ trễ hiện tại: " + delay + "ms)"));
    // Validate user input
    if (isNaN(newDelay) || newDelay < 0) {
        alert("Độ trễ không đúng. Vui lòng nhập lại độ trễ.");
    return;
    }
    if (newDelay > 10000) {
        alert("Đây không phải là nơi để bạn đi ngủ :V");
    return;
    }
    // Update delay and optionally display confirmation
    updateDelay(newDelay);
    console.log("Độ trễ được cập nhật thành: ", newDelay, "mili giây");
});

Fullscreen = function(){
    document.documentElement.requestFullscreen();
}

// Check for orientation change using matchMedia (for mobile devices)
const checkOrientation = () => {
    if (window.matchMedia("(max-width: 768px) and (orientation: landscape)").matches) {
        body.addEventListener('click',Fullscreen(),{once :  true})
        body.removeEventListener('click', Fullscreen(),{once : true})
        setTimeout(function(){
            videoPlayer.style.width = "auto";
            videoPlayer.style.height = "100vh";
            videoPlayer.style.margin = "0 auto";
        },700)
    }
    else if (window.matchMedia("(max-width: 768px) and (orientation: portrait").matches) {
        videoPlayer.style.height = "auto";
        videoPlayer.style.marginTop = "6vw"; 
    }
    else {
        videoPlayer.style.height = "46.855vh"
        videoPlayer.style.marginTop = "2vh"
    }
};

// Listen for orientation changes
window.addEventListener("resize", checkOrientation);

function nextVideoTrack(){
    if (clickCount % 2 === 1) {
        const nextnewcurrentIndex = (newcurrentIndex + 1) % newvideoUrls.length;
        playVideo(newvideoUrls[nextnewcurrentIndex]);
    }
    else {
        const nextcurrentIndex = (currentIndex + 1) % videoUrls.length;
        playVideo(videoUrls[nextcurrentIndex]);
    }
}

function previousVideoTrack() {
    if (clickCount % 2 === 1) {
        if (newcurrentIndex > 0) {
            prevnewIndex = newcurrentIndex - 1;
            playVideo(newvideoUrls[prevnewIndex]);
        }
    }   
    else {
        if (currentIndex > 0) {
            prevIndex = currentIndex - 1;
            playVideo(videoUrls[prevIndex]);
        }
    }
}

// Register key being pressed
document.addEventListener("keydown", function(event) {
    // Play/pause the video when pressing space
    if (event.code === "Space") {
        if (videoPlayer.paused)
            videoPlayer.play();
        else 
            videoPlayer.pause();
    }
    // Skipping to the next video using the playVideo function when pressing right arrow key
    if (event.code === "ArrowRight") {
        nextVideoTrack()
    }
    // Returning to the previous video using the playVideo function (doesn't work if used on first video)
    if (event.code === "ArrowLeft") {
        previousVideoTrack()
    }
    if (event.code === "Numpad1"||event.code === "Digit1")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[0]);
        }   
        else {
            playVideo(videoUrls[0]);
        }
    }
    if (event.code === "Numpad2"||event.code === "Digit2")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[1]);
        }   
        else {
           playVideo(videoUrls[1]);
            }
    }
    if (event.code === "Numpad3"||event.code === "Digit3")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[2]);
        }   
        else {
            playVideo(videoUrls[2]);
        }
    }
    if (event.code === "Numpad4"||event.code === "Digit4")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[3]);
        }   
        else {
            playVideo(videoUrls[3]);
        }
    }
    if (event.code === "Numpad5"||event.code === "Digit5")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[4]);
        }   
        else {
            playVideo(videoUrls[4]);
        }
    }
    if (event.code === "Numpad6"||event.code === "Digit6")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[5]);
        }   
        else {
            playVideo(videoUrls[5]);
        }
    }
    if (event.code === "Numpad7"||event.code === "Digit7")  {
        if (clickCount % 2 === 1) {
            playVideo(newvideoUrls[6]);
        }   
        else {
            playVideo(videoUrls[6]);
            }
    }
    if (event.code === "Numpad8"||event.code === "Digit8")  {
        if (clickCount % 2 === 0) {
            playVideo(videoUrls[7]);
        }
        else{
            playVideo(newvideoUrls[7]);
        }      
    }
    if (event.code === 'Numpad9'||event.code === "Digit9") {
        if (clickCount % 2 === 0) {
            playVideo(videoUrls[8]);
        }   
    }
    if (event.code === 'Numpad0'||event.code === "Digit0") {
        if (clickCount % 2 === 0) {
            playVideo(videoUrls[9]);
        }   
    }
    if (event.code === 'Tab') {
        event.preventDefault(); // Prevent the default tab behavior
        moveableimg.click();
        if (TheaterModeFlag){
            newnavbarContent.style.display='none';
            navbarContent.style.display='none';
        }
    }
    if (event.code === 'KeyQ') {
        shuffleButton.click();
    }   
    if (event.code === 'KeyW') {
        loopVideo.click();
    }   
    if (event.code === 'KeyE') {
        document.getElementById("Delay").click();
    }
    if (event.code === 'KeyR') {
        togglePictureInPicture();
    }
    if (event.code === 'KeyF'){
        if ((document.fullscreenElement && document.fullscreenElement === videoPlayer) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement === videoPlayer) ||
            (document.msFullscreenElement && document.msFullscreenElement === videoPlayer)
        ) 
            closeFullscreen(); // Video is currently in fullscreen mode, so close fullscreen
        else 
            openFullscreen();  // Video is not in fullscreen mode, so open fullscreen
    }
    if (event.code === "KeyT"){
        TheaterMode.click();
    }
    if (event.code === "KeyD"){
        videoPlayer.src = "Insert_Songs/Theater D.mp4";
        videoPlayer.play();
        currentIndex = -1;
        newcurrentIndex = -1;
    }
    if (event.code === "KeyO"){
        videoPlayer.src = "Openings_and_Endings/S1 Ending.mp4";
        videoPlayer.play();
        currentIndex = -1;
        newcurrentIndex = -1;
    }
    if (event.code === "KeyP"){
        videoPlayer.src = "Openings_and_Endings/S2 Ending.mp4";
        videoPlayer.play();
        currentIndex = -1;
        newcurrentIndex = -1;
    }
    if (event.code === "KeyS"){
        videoPlayer.src = "Openings_and_Endings/ED1 - STYX HELIX slow.mp4";
        videoPlayer.play();
        currentIndex = -1;
        newcurrentIndex = -1;
    }
});
    
let isAnimatingbutton = false;
// Next and Back button implementation:
nextButton.addEventListener('click',function(){
    if (isAnimating || this.hasAttribute('disabled')) {
        return; // Exit the function if an animation is already in progress or the element is disabled
    }
    nextClickCount++;
    isAnimating = true; // Set the flag to indicate that an animation is in progress
    this.setAttribute('disabled', 'disabled'); // Disable the clickable element
    backButton.disabled = true;
    navbarContent.style.display = 'none';
    S3.style.display = 'flex';
    nextButton.style.display ='none';
    backButton.style.display ='inline';
    S3.classList.add('fade-in');
    backButton.classList.add('fade-in');
    setTimeout(() => {
        isAnimating = false; // Reset the flag once the animation is complete
        this.removeAttribute('disabled'); // Re-enable the clickable element
        backButton.disabled = false;
        }, 2501);
})
backButton.addEventListener('click',function(){
    if (isAnimating || this.hasAttribute('disabled')) {
        return; // Exit the function if an animation is already in progress or the element is disabled
    }
    nextClickCount++;
    isAnimating = true; // Set the flag to indicate that an animation is in progress
    this.setAttribute('disabled', 'disabled'); // Disable the clickable element
    nextButton.disabled = true; // Disable the clickable element
    navbarContent.style.display = 'flex';
    S3.style.display = 'none';
    nextButton.style.display ='inline';
    backButton.style.display ='none';
    navbarContent.classList.add('fade-in');
    nextButton.classList.add('fade-in');
    setTimeout(() => {
        isAnimating = false; // Reset the flag once the animation is complete
        this.removeAttribute('disabled'); // Re-enable the clickable element
        nextButton.disabled = false; // Disable the clickable element
        }, 2501);
})
S3.addEventListener('animationend', () => {
    S3.classList.remove('fade-in');
})
backButton.addEventListener('animationend', () => {
    backButton.classList.remove('fade-in');
})
navbarContent.addEventListener('animationend', () => {
navbarContent.classList.remove('fade-in');
})
nextButton.addEventListener('animationend', () => {
    nextButton.classList.remove('fade-in');
})
/*
window.addEventListener('load', function() {
    setTimeout(function(){ 
        Swal.fire({
            html: '<b>Happy Halloween!</b> 🎃',
            imageUrl: "Other_Files/Halloween_poster.jpg",
            imageHeight: "80vh",
            imageWidth: "auto",
            showCloseButton: true,
            showConfirmButton: false,
            background: "#716add",
            color: "#eb6123",
            backdrop: `
                rgba(0,0,123,0.4)
            `,
            showClass: {
                popup: `
                    animate__animated
                    animate__fadeIn
                    animate__faster
                `
            },
            hideClass: {
                popup: `
                    animate__animated
                    animate__fadeOut
                    animate__faster
                `
            },
    })},2000)
});
*/
function simulateClick() {
    // Get the element at the bottom right corner of the screen
    const elementAtPoint = document.elementFromPoint(window.innerWidth - 10, window.innerHeight - 100);
    // Check if the element is found and trigger a click event
    if (elementAtPoint) {
        elementAtPoint.click();
    }
}

async function togglePictureInPicture() {
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else {
        try {
            await videoPlayer.requestPictureInPicture();
        } catch (error) {
            console.error('Error entering Picture-in-Picture mode:', error);
        }
    }
}

function openFullscreen() {
    if (videoPlayer.requestFullscreen) {
      videoPlayer.requestFullscreen();
    } else if (videoPlayer.webkitRequestFullscreen) { /* Safari */
      videoPlayer.webkitRequestFullscreen();
    } else if (videoPlayer.msRequestFullscreen) { /* IE11 */
      videoPlayer.msRequestFullscreen();
    }
  }

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

const TheaterMode = document.getElementById('Theater');
const ButtonContainer = document.getElementsByClassName('button-container');
const paragraph = document.getElementById('paragraph');
const body = document.getElementById('body');
const ReZeroCast = document.getElementById('subaru');
const GitHub = document.getElementById('github');
let TheaterModeFlag = false;
let TheaterModeClickCount = 0;
const ExitTheaterModeButton = document.getElementById('ExitTheaterModeButton');
const KeyboardControls = document.getElementById("KeyboardControls")

TheaterMode.addEventListener('click',function() {
    TheaterModeClickCount++;
    if (TheaterModeClickCount%2==1){
        navbarContent.style.display = 'none';
        newnavbarContent.style.display = 'none';
        S3.style.display = 'none';
        paragraph.style.display = 'none';
        ReZeroCast.style.display = 'none';
        Trademark.style.display = 'none';
        GitHub.style.display = 'none';
        KeyboardControls.style.display = 'none';
        moveableimg.style.setProperty('display', 'none', 'important');
        textToChange.style.display = 'none';
        for (let i = 0; i < ButtonContainer.length; i++) {
            ButtonContainer[i].style.display = 'none';
        }
        videoPlayer.style.position = 'relative';
        videoPlayer.style.width =  '160vh';
        videoPlayer.style.height = '90vh';
        videoPlayer.style.marginTop = '4vh';
        videoPlayer.style.marginBottom = '5vh';
        body.style.backgroundColor = '#000000';
        body.style.backgroundImage = 'none';
        document.documentElement.requestFullscreen();
        TheaterModeFlag = true;
        ExitTheaterModeButton.style.display ='flex';
    }
    else
        if (clickCount%2==1){
            newnavbarContent.style.display = 'flex';
            paragraph.style.display = 'block';
            ReZeroCast.style.display = 'block';
            Trademark.style.display = 'block';
            GitHub.style.display = 'none';
            KeyboardControls.style.display = 'flex';
            moveableimg.style.setProperty('display', 'inline', 'important');
            textToChange.style.display = 'inline';
            for (let i = 0; i < ButtonContainer.length; i++) {
                ButtonContainer[i].style.display = 'block';
            }
            body.style.backgroundImage = 'url(Other_Files/bg-tv.png)';
            body.style.backgroundColor = '#FFFFFF';
            videoPlayer.style.width =  'auto';
            videoPlayer.style.height = '46.855vh';
            videoPlayer.style.margin = '0 auto';
            videoPlayer.style.marginTop = '2vh';
            ExitTheaterModeButton.style.display ='none';
            TheaterModeFlag = false;
            closeFullscreen();
        }
        else {
            if (nextClickCount%2==1){
                S3.style.display = 'flex';
                navbarContent.style.display = 'none';
            }
            else {
                S3.style.display = 'none';
                navbarContent.style.display = 'flex';
            }
            paragraph.style.display = 'block';
            ReZeroCast.style.display = 'block';
            Trademark.style.display = 'block';
            GitHub.style.display = 'block';
            KeyboardControls.style.display = 'flex';
            moveableimg.style.setProperty('display', 'inline', 'important');
            textToChange.style.display = 'inline';
            for (let i = 0; i < ButtonContainer.length; i++) {
                ButtonContainer[i].style.display = 'block';
            }
            body.style.backgroundImage = 'url(Other_Files/bg-tv.png)';
            body.style.backgroundColor = '#FFFFFF';
            videoPlayer.style.width =  'auto';
            videoPlayer.style.height = '46.855vh';
            videoPlayer.style.margin = '0 auto';
            videoPlayer.style.marginTop = '2vh';
            ExitTheaterModeButton.style.display ='none';
            TheaterModeFlag = false;
            closeFullscreen();
        }

})
function ChangeToInsertSongs() {
        moveableimg.click();
        if (TheaterModeFlag==true) {
            newnavbarContent.style.display='none';
            navbarContent.style.display='none';
        }
}
function ExitTheaterMode() {
        TheaterMode.click();
}
document.addEventListener("DOMContentLoaded", function() {
MicroModal.init({
    onShow: modal => console.info(`${modal.id} is shown`), // [1]
    onClose: modal => console.info(`${modal.id} is hidden`), // [2]
    openTrigger: 'data-custom-open', // [3]
    closeTrigger: 'data-custom-close', // [4]
    openClass: 'is-open', // [5]
    disableScroll: true, // [6]
    disableFocus: true, // [7]
    awaitOpenAnimation: true, // [8]
    awaitCloseAnimation: true, // [9]
    debugMode: false // [10]
  });
})
var button = document.querySelector('#KeyboardControls');
button.addEventListener('click', function(){
    MicroModal.show('modal-1', { awaitCloseAnimation: true,})
});

const FULL = document.getElementById('STYX_HELIX_FULL');
const FULL_sidebar = document.getElementById('STYX_HELIX_FULL_sidebar')
const OG = document.getElementById('STYX_HELIX_OG')
const OG_sidebar = document.getElementById('STYX_HELIX_OG_sidebar')
const SeasonsEndings = document.getElementsByClassName('Endings--Seasons')

// Switch OP1 - STYX HELIX between cut and full version
function ChangeStyxHelix(){
    keyB++;
        if (keyB%2==1)
        {
            originalIndex = videoUrls.indexOf('Openings_and_Endings/ED1 - STYX HELIX.mp4');
            videoUrls[originalIndex] = 'Openings_and_Endings/ED1 - STYX HELIX nocut.mp4';
            OG.style.display = 'none';
            OG_sidebar.style.display = 'none';
            FULL.style.display = 'inline';
            FULL_sidebar.style.display = 'flex';
            for (let i = 0; i < SeasonsEndings.length; i++) {
                SeasonsEndings[i].style.display = 'flex';
            }
            alert("Changed ED1 - STYX HELIX to full version")
        }
        else
        {
            originalIndex = videoUrls.indexOf('Openings_and_Endings/ED1 - STYX HELIX nocut.mp4');
            videoUrls[originalIndex] = 'Openings_and_Endings/ED1 - STYX HELIX.mp4';
            OG.style.display = 'inline';
            OG_sidebar.style.display = 'flex';
            FULL.style.display = 'none';
            FULL_sidebar.style.display = 'none';
            for (let i = 0; i < SeasonsEndings.length; i++) {
                SeasonsEndings[i].style.display = 'none';
            }
            alert("Reverted changes to ED1 - STYX HELIX")
        }
}

document.addEventListener('keydown',function(event){
    if (event.code === "KeyB"){
        ChangeStyxHelix();
    }
})
songname.addEventListener('click',function(){
    ChangeStyxHelix();
})
