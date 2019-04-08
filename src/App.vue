<template>
<body class="flex flex-col bg-grey-darkest items-center justify-center h-screen">
  <h1 class="font-sans mb-6 text-white antialiased">Spotify Taffy</h1>
  <a
    v-if="!isAuthed"
    :href="authLink"
    class="bg-green-dark text-white no-underline px-4 py-2 rounded shadow-lg font-sans"
  >
    Login with Spotify
  </a>
  <text-to-spotify v-else :accessToken="accessToken"/>
</body>
</template>

<script>
import TextToSpotify from './components/TextToSpotify.vue';

export default {
  name: 'app',
  components: { TextToSpotify },
  data() {
    return {
      authLink:
        'https://accounts.spotify.com/authorize?'
        + 'client_id=b4e7382becec48aabd131f0704fd575b'
        + `&redirect_uri=${encodeURIComponent(window.location.origin)}`
        // + `&redirect_uri=http:%2F%2Flocalhost:8080`
        + '&scope=user-read-private playlist-read-private'
        + '&response_type=token'
        + '&state=123',
      accessToken: '',
    };
  },
  computed: {
    isAuthed() {
      return window.location.hash.length > 0;
    },
  },
  mounted() {
    if (this.isAuthed) {
      const hashFragment = window.location.hash.substr(1).split('&');

      const vm = this;

      hashFragment.forEach((fragment) => {
        const pair = fragment.split('=');

        if (pair[0] === 'access_token') {
          [, vm.accessToken] = pair;
        }
      });
    }
  },
};
</script>
