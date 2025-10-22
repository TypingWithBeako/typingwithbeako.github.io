// @ts-nocheck
//ts-nocheck
// Function to get the song ID from the URL
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

function convertToUrl(songId) {
  // Find song in master list
  const song = MASTER_SONGS.find((s) => s.id === songId);
  if (song) {
    return `${URL}${song.filename}`;
  }
}

// Function to handle routing and load the video
function handleRouting() {
  const playlistParam = getQueryParam("playlist");
  const songId = getQueryParam("songId");

  if (playlistParam) {
    handlePlaylistRouting(playlistParam);
  } else if (songId) {
    handleSingleVideoRouting(songId);
  }
}

function handleSingleVideoRouting(songId) {
  if (!MASTER_SONGS || MASTER_SONGS.length === 0) {
    console.error("MASTER_SONGS is not loaded or empty.");
    return;
  }

  const song = MASTER_SONGS.find((s) => s.id === songId)
  if (!song) {
    console.error(`Song with ID "${songId}" not found.`);
    return;
  }

  // Update the video player with the selected song
  videoPlayer.src = `${URL}${song.filename}`;
}

function handlePlaylistRouting(playlistParam) {
  // Split the playlist parameter into an array of song IDs
  const songIds = playlistParam.split(",")
                  .map((songId) => convertToUrl(songId))
                  .filter((url) => url !== undefined); // Remove undefined values

  if (!songIds || songIds.length === 0) {
    console.error("Playlist is empty or invalid.");
    return;
  }

  console.log("Extracted song IDs:", songIds);
  videoUrls = songIds
  videoPlayer.src = videoUrls[0]
}