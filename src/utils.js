async function searchForTrack(track, axios) {
  const response = await axios.get(`search?q=${track}&type=track&limit=1`);

  return response;
}

export async function getSpotifyUserId(axios) {
  const { data } = await axios.get('me');

  return data.id;
}

export async function createPlaylist(username, title, axios) {
  const params = {
    name: title,
  };

  const { data } = await axios.post(`users/${username}/playlists`, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return data.id;
}

export async function getTrackURIsFromText(textToConvert, axios) {
  const parsedTracks = textToConvert.replace(/\r\n/, '\n').split('\n');

  const searchedTracks = parsedTracks.map(async (track) => {
    const searchQuery = encodeURIComponent(track);

    const { data } = await searchForTrack(searchQuery, axios);

    return data.tracks.items ? data.tracks.items[0] : null;
  });

  const results = await Promise.all(searchedTracks);

  return results.map(result => result.uri);
}

export async function addTracksToPlaylist(trackURIs, playlistId, axios) {
  const data = {
    uris: trackURIs,
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return axios.post(`playlists/${playlistId}/tracks`, data, config);
}
