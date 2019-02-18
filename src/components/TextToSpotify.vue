<template>
  <div class="flex flex-col items-center">
    <label for="playlist-title">Playlist Title</label>
    <input
      v-model="playlistTitle"
      type="text"
      name="playlist-title"
    >
    <textarea
      v-model="textToConvert"
      name="text-list"
      id="text-list"
      cols="30"
      rows="10">
    </textarea>
    <button
      @click.prevent="convertTextToPlaylist"
      class="bg-green-dark text-white no-underline px-4 py-2 rounded shadow-lg font-sans"
    >
      Make That Shit
    </button>
  </div>
</template>

<script>
import axios from 'axios';
import {
  getSpotifyUserId, createPlaylist, getTrackURIsFromText, addTracksToPlaylist,
} from '../utils';

export default {
  props: ['accessToken'],

  data() {
    return {
      textToConvert: '',
      playlistTitle: 'Playlist Title',
    };
  },

  updated() {
    axios.defaults.baseURL = 'https://api.spotify.com/v1';

    axios.defaults.headers.common = {
      Authorization: `Bearer ${this.accessToken}`,
    };
  },

  methods: {
    async convertTextToPlaylist() {
      const userId = await getSpotifyUserId(axios);

      const playlistId = await createPlaylist(userId, this.playlistTitle, axios);

      const trackURIs = await getTrackURIsFromText(this.textToConvert, axios);

      await addTracksToPlaylist(trackURIs, playlistId, axios);

      window.alert('done!');
    },
  },
};
</script>
