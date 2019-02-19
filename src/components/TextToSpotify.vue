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
import Spotify from '../spotify-client';

export default {
  props: ['accessToken'],

  data() {
    return {
      textToConvert: '',
      playlistTitle: 'Playlist Title',
      client: {},
    };
  },

  watch: {
    accessToken(newToken) {
      this.client = Spotify.Client(newToken);
    },
  },

  methods: {
    async convertTextToPlaylist() {
      const userId = await this.client.getSpotifyUserId();

      const playlistId = await this.client.createPlaylist(userId, this.playlistTitle);

      const trackURIs = await this.client.getTrackURIsFromText(this.textToConvert);

      await this.client.addTracksToPlaylist(trackURIs, playlistId);

      window.alert('done!');
    },
  },
};
</script>
