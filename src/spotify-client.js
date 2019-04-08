import { chunk } from 'lodash';
import axios from 'axios';


function makeSpotifyClient(accessToken) {
  const options = {
    baseURL: 'https://api.spotify.com/v1',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return axios.create(options);
}

const Spotify = {
  Client(accessToken) {
    const clientInstance = Object.create(this.clientModel);

    clientInstance.client = makeSpotifyClient(accessToken);

    return clientInstance;
  },

  clientModel: {
    client: {},

    async getSpotifyUserId() {
      const { data } = await this.client.get('me');

      return data.id;
    },

    async createPlaylist(username, title) {
      const params = {
        name: title,
      };

      const { data } = await this.client.post(`users/${username}/playlists`, params, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return data.id;
    },

    async getTrackURIsFromText(textToConvert) {
      const encodedQueries = textToConvert.replace(/\r\n/, '\n').split('\n').flatMap(encodeURIComponent);

      const searchedTracks = [];

      // eslint-disable-next-line
      for (const query of encodedQueries) {
        let result;

        if (query.length > 0) {
          // eslint-disable-next-line
          result = await this.searchForTrack(query);
        }

        if (result) {
          searchedTracks.push(result.uri);
        }
      }

      return searchedTracks.filter((value, index, self) => self.indexOf(value) === index);
    },

    async searchForTrack(track) {
      const { data } = await this.client.get(`search?q=${track}&type=track&limit=1`);

      if (data) {
        return data.tracks.items[0];
      }

      return false;
    },

    async addTracksToPlaylist(trackURIs, playlistId) {
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

        return this.client.post(`playlists/${playlistId}/tracks`, data, config);
      }));
    },
  },
};

export default Spotify;
