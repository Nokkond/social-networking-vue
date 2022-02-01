<template lang="pug">
  .div
    h2 Статистика
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FriendsPossible from '@/components/Friends/Possible'
import FriendsBlock from '@/components/Friends/Block'
import FriendsRequest from '@/components/Friends/Request'
export default {
  name: 'Statistics',
  methods: {
    ...mapActions('profile/statistics', ['apiGetStatistics'])
  },
  mounted() {
    // if (this.requestFriends.length === 0)
    this.apiGetStatistics()
  }
}
</script>
