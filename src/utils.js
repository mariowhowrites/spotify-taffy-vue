import { chunk } from 'lodash';

async function searchForTrack(track, axios) {
  const { data } = await axios.get(`search?q=${track}&type=track&limit=1`);

  if (data) {
    return data.tracks.items[0];
  }

  return false;
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
  const encodedQueries = textToConvert.replace(/\r\n/, '\n').split('\n').flatMap(encodeURIComponent);

  const searchedTracks = [];

  // eslint-disable-next-line
  for (const query of encodedQueries) {
    let result;

    if (query.length > 0) {
      // eslint-disable-next-line
      result = await searchForTrack(query, axios);
    }

    if (result) {
      searchedTracks.push(result.uri);
    }
  }

  return searchedTracks.filter((value, index, self) => self.indexOf(value) === index);
}

export async function addTracksToPlaylist(trackURIs, playlistId, axios) {
  const uriChunks = chunk(trackURIs, 100); // 100 = max tracks per endpoint request

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return Promise.all(uriChunks.map(async (uriChunk) => {
    const data = {
      uris: uriChunk,
    };

    return axios.post(`playlists/${playlistId}/tracks`, data, config);
  }));
}
