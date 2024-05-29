const clientId = '7c775fb3a5b04fe388364f9aafb354e2';  // Replace with your actual Client ID
const redirectUri = 'https://git-angel06.github.io/callback.html';
let accessToken = '';

document.getElementById('login-button')?.addEventListener('click', () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=playlist-modify-public`;
    window.location = authUrl;
});

window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    accessToken = params.get('access_token');

    if (accessToken && window.location.pathname.includes('callback.html')) {
        window.location = 'generator.html';
    }

    if (accessToken && window.location.pathname.includes('generator.html')) {
        document.getElementById('input-section').classList.remove('hidden');
    }
});

document.getElementById('next-button')?.addEventListener('click', () => {
    document.getElementById('selection-section').classList.remove('hidden');
});

document.getElementById('generate-button')?.addEventListener('click', async () => {
    const selfMood = document.getElementById('self-mood').value;
    const musicMood = document.getElementById('music-mood').value;
    const songType = document.getElementById('song-type').value;
    const playlist = await generatePlaylist(selfMood, musicMood, songType);
    displayPlaylist(playlist, selfMood, musicMood);
});

async function generatePlaylist(selfMood, musicMood, songType) {
    const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${musicMood}&limit=50`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    const tracks = data.tracks.map(track => track.uri);
    return tracks;
}

function displayPlaylist(tracks, selfMood, musicMood) {
    const playlistElement = document.getElementById('playlist');
    const playlistTitleElement = document.getElementById('playlist-title');
    playlistElement.innerHTML = '';
    tracks.forEach(track => {
        const li = document.createElement('li');
        li.textContent = track;  // Display track name instead of URI in real implementation
        playlistElement.appendChild(li);
    });
    playlistTitleElement.textContent = `'${selfMood}' but need '${musicMood}'`;
    document.getElementById('playlist-section').classList.remove('hidden');
}

document.getElementById('save-button')?.addEventListener('click', async () => {
    const tracks = Array.from(document.getElementById('playlist').children).map(li => li.textContent);
    await savePlaylist(tracks);
});

async function savePlaylist(tracks) {
    const userIdResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const userIdData = await userIdResponse.json();
    const userId = userIdData.id;

    const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: document.getElementById('playlist-title').textContent,
            description: 'A playlist based on your mood',
            public: true
        })
    });
    const createPlaylistData = await createPlaylistResponse.json();
    const playlistId = createPlaylistData.id;

    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uris: tracks
        })
    });

    alert('Playlist saved successfully!');
}

document.getElementById('delete-button')?.addEventListener('click', () => {
    document.getElementById('playlist').innerHTML ='';
    document.getElementById('playlist-selection').classList.add('hidden');
    alert('playlist deleted');
});

