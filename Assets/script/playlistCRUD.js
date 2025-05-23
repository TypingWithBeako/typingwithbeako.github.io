// Modal interaction functions
let currentEditingPlaylist = '';
let tempPlaylistSongs = [];

function loadPlaylist(playlistName) {
    // Handle "All Songs" special case
    if (playlistName === 'default') {
        // Reset to original arrays - combine both videoUrls and newvideoUrls
        var originalVideoUrls = [
            `${URL}OP1 - Redo.mp4`,
            `${URL}ED1 - STYX HELIX.mp4`,
            `${URL}OP2 - Paradisus - Paradoxum.mp4`,
            `${URL}ED2 - Stay Alive.webm`,
            `${URL}OP3 - Realize.mp4`,
            `${URL}ED3 - Memento.mp4`,
            `${URL}OP4 - Long shot.mp4`,
            `${URL}ED4 - Believe in you.webm`,
            `${URL}OP5 - Reweave.mp4`,
            `${URL}ED5 - NOX LUX.mp4`,
        ];
        var originalNewVideoUrls = [
            `${URL}STRAIGHT BET.mp4`,
            `${URL}Bouya no Yume yo.mp4`,
            `${URL}Memories.mp4`,
            `${URL}White White Snow.mp4`,
            `${URL}Requiem of Silence.mp4`,
            `${URL}Wishing.mp4`,
            `${URL}Yuki no hate ni Kimi no na wo.mp4`,
            `${URL}Door.mp4`,
            `${URL}What you don't know.mp4`,
            `${URL}I Trust You.mp4`,
        ];
        
        videoUrls = originalVideoUrls;
        newvideoUrls = originalNewVideoUrls;
        playVideo(videoUrls[0]);
        return;
    }

    // Get playlist from localStorage
    let playlists = JSON.parse(localStorage.getItem('playlists')) || {};
    let playlist = playlists[playlistName];
    
    if (playlist && playlist.songs) {
        // BOOM: Just replace the entire array
        videoUrls = playlist.songs.map(songName => convertToUrl(songName));
        currentIndex = 0; // Reset to start of playlist
        
        // Player doesn't even know anything changed!
        playVideo(videoUrls[0]);
    }
}

function convertToUrl(songName) {
    if (songName === "ED2 - Stay Alive" || songName === "ED4 - Believe in you" || songName === "S1 Ending")
        return `${URL}${songName}.webm`
    return `${URL}${songName}.mp4`; // or whatever your URL structure is
}

// ...existing loadPlaylist and convertToUrl functions...

function populateSidebarPlaylists() {
    const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
    const container = document.getElementById('dynamic-playlists');
    
    container.innerHTML = ''; // Clear existing
    
    Object.keys(playlists).forEach(playlistName => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-blue-100">
                <button onclick="loadPlaylist('${playlistName}')" class="flex-1 text-left">
                    ${playlistName} (${playlists[playlistName].songs.length})
                </button>
                <div class="flex gap-1">
                    <button onclick="editPlaylist('${playlistName}')" class="text-blue-500 hover:text-blue-700" title="Chỉnh sửa">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                    </button>
                    <button onclick="deletePlaylist('${playlistName}')" class="text-red-500 hover:text-red-700" title="Xóa">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(li);
    });
}

function createNewPlaylist() {
    const name = prompt('Tên danh sách phát:');
    if (name && name.trim()) {
        const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
        playlists[name.trim()] = {
            songs: [],
            created: new Date().toISOString(),
            description: ''
        };
        localStorage.setItem('playlists', JSON.stringify(playlists));
        populateSidebarPlaylists();
        
        // Open playlist editor
        editPlaylist(name.trim());
    }
}

function deletePlaylist(name) {
    if (confirm(`Xóa danh sách "${name}"?`)) {
        const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
        delete playlists[name];
        localStorage.setItem('playlists', JSON.stringify(playlists));
        populateSidebarPlaylists();
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', populateSidebarPlaylists);

// ...existing code...

function editPlaylist(playlistName) {
    const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
    const playlist = playlists[playlistName];
    
    // MISSING: Initialize tempPlaylistSongs with current playlist
    currentEditingPlaylist = playlistName;
    tempPlaylistSongs = [...playlist.songs]; // ADD THIS LINE!

    window.isEditingPlaylist = true; // Set editing mode

    if (!playlist) return;
    
    // Create modal dynamically
    const modal = createPlaylistEditorModal(playlistName, playlist);
    document.body.appendChild(modal);
    
    // Show modal with fade-in effect
    setTimeout(() => modal.style.opacity = '1', 10);
}

function createPlaylistEditorModal(playlistName, playlist) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300';
    modal.style.opacity = '0';
    modal.id = 'playlist-editor-modal';
    
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-6xl w-full mx-4 h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div class="flex justify-between items-center mb-6 flex-shrink-0">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Chỉnh sửa danh sách</h2>
                    <h4 class="mt-1 font-medium text-gray-600 dark:text-gray-400">${playlistName} • ${playlist.songs.length} bài hát</h4>
                </div>
                <button onclick="closePlaylistEditor()" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                <!-- Available Songs -->
                <div class="flex flex-col min-h-0">
                    <div class="flex items-center justify-between mb-4 flex-shrink-0">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Bài hát có sẵn</h3>
                        <input type="text" id="song-search" placeholder="Tìm kiếm..." 
                               class="px-3 py-1 border rounded text-sm w-48 dark:bg-gray-700 dark:border-gray-600" 
                               oninput="filterAvailableSongs()">
                    </div>
                    <div id="available-songs" class="border rounded-lg p-4 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 min-h-0">
                        ${generateAvailableSongsList(playlist.songs)}
                    </div>
                </div>
                
                <!-- Current Playlist -->
                <div class="flex flex-col min-h-0">
                    <div class="flex items-center justify-between mb-4 flex-shrink-0">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Danh sách hiện tại</h3>
                        <button onclick="clearPlaylist('${playlistName}')" class="text-red-500 hover:text-red-700 text-sm">
                            Xóa tất cả
                        </button>
                    </div>
                    <div id="current-playlist" class="border rounded-lg p-4 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 min-h-0">
                        ${generateCurrentPlaylistList(playlist.songs)}
                    </div>
                </div>
            </div>
            
            <div class="flex justify-between items-center mt-6 flex-shrink-0">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                    Kéo thả để sắp xếp lại • Nhấp đúp để thêm/xóa
                </div>
                <div class="flex gap-3">
                    <button onclick="closePlaylistEditor()" class="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">
                        Hủy
                    </button>
                    <button onclick="savePlaylist('${playlistName}')" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Close modal on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closePlaylistEditor();
    });
    
    return modal;
}

function clearPlaylist(playlistName) {
    if (confirm(`Xóa tất cả bài hát khỏi danh sách "${playlistName}"?`)) {
        tempPlaylistSongs = [];
        refreshModalContent();
    }
}

let draggedIndex = null;

function dragStart(event, index) {
    draggedIndex = index;
    event.dataTransfer.effectAllowed = 'move';
    event.target.style.opacity = '0.5';
}

function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function dragDrop(event, targetIndex) {
    event.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
        // Reorder the tempPlaylistSongs array
        const draggedSong = tempPlaylistSongs[draggedIndex];
        tempPlaylistSongs.splice(draggedIndex, 1);
        tempPlaylistSongs.splice(targetIndex, 0, draggedSong);
        
        refreshModalContent();
    }
    
    // Reset dragged state
    draggedIndex = null;
    event.target.style.opacity = '1';
}

function dragEnd(event) {
    event.target.style.opacity = '1';
    draggedIndex = null;
}

function filterAvailableSongs() {
    const searchTerm = document.getElementById('song-search').value.toLowerCase();
    const availableContainer = document.getElementById('available-songs');
    const songElements = availableContainer.querySelectorAll('[data-song]');
    
    songElements.forEach(element => {
        const songName = element.getAttribute('data-song').toLowerCase();
        if (songName.includes(searchTerm)) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

function generateAvailableSongsList(currentSongs) {
    const allSongs = getAllAvailableSongs();
    return allSongs.map(song => {
        const isInPlaylist = currentSongs.includes(song);
        return `
            <div class="flex items-center justify-between p-2 rounded hover:bg-white dark:hover:bg-gray-600 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-500 ${isInPlaylist ? 'opacity-50' : ''}" 
                 ondblclick="addSongToCurrentPlaylist('${song}')" 
                 data-song="${song}">
                <span class="text-sm font-medium ${isInPlaylist ? 'line-through' : ''}">${song}</span>
                <button onclick="addSongToCurrentPlaylist('${song}')" 
                        class="text-blue-500 hover:text-blue-700 ${isInPlaylist ? 'opacity-50 cursor-not-allowed' : ''}"
                        ${isInPlaylist ? 'disabled' : ''}>
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;
    }).join('');
}

function generateCurrentPlaylistList(songs) {
    if (songs.length === 0) {
        return '<div class="text-center text-gray-500 dark:text-gray-400 py-8">Danh sách trống<br><small>Thêm bài hát từ cột bên trái</small></div>';
    }
    
    return songs.map((song, index) => `
        <div class="flex items-center justify-between p-3 rounded bg-white dark:bg-gray-600 border dark:border-gray-500 mb-2 cursor-move" 
             draggable="true" 
             ondragstart="dragStart(event, ${index})" 
             ondragover="dragOver(event)" 
             ondrop="dragDrop(event, ${index})"
             ondragend="dragEnd(event)"
             ondblclick="removeSongFromCurrentPlaylist('${song}')">
            <div class="flex items-center">
                <span class="text-gray-400 mr-3 font-mono text-sm">${(index + 1).toString().padStart(2, '0')}</span>
                <span class="font-medium">${song}</span>
            </div>
            <button onclick="removeSongFromCurrentPlaylist('${song}')" class="text-red-500 hover:text-red-700">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

function getAllAvailableSongs() {
    const allSongs = [];
    
    // Extract from both arrays (your existing logic)
    const allUrls = [...videoUrls, ...newvideoUrls];
    allUrls.forEach(url => {
        const songName = cleanVideoSrcName(url);
        if (!allSongs.includes(songName)) {
            allSongs.push(songName);
        }
    });
    
    return allSongs.sort(); // Alphabetical order
}


function addSongToCurrentPlaylist(songName) {
    if (!tempPlaylistSongs.includes(songName)) {
        tempPlaylistSongs.push(songName);
        refreshModalContent();
    }
}

function removeSongFromCurrentPlaylist(songName) {
    tempPlaylistSongs = tempPlaylistSongs.filter(song => song !== songName);
    refreshModalContent();
}

function refreshModalContent() {
    const availableContainer = document.getElementById('available-songs');
    const currentContainer = document.getElementById('current-playlist');
    
    if (availableContainer && currentContainer) {
        availableContainer.innerHTML = generateAvailableSongsList(tempPlaylistSongs);
        currentContainer.innerHTML = generateCurrentPlaylistList(tempPlaylistSongs);
    }
}

function closePlaylistEditor() {
    const modal = document.getElementById('playlist-editor-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove()
            window.isEditingPlaylist = false;
        },300);
    }
}

function savePlaylist(playlistName) {
    const playlists = JSON.parse(localStorage.getItem('playlists')) || {};
    playlists[playlistName].songs = [...tempPlaylistSongs];
    localStorage.setItem('playlists', JSON.stringify(playlists));
    
    populateSidebarPlaylists();
    closePlaylistEditor();
}
