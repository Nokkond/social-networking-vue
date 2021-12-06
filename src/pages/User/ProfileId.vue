<template lang="pug">
  .profile.inner-page(v-if="getUsersInfo")
    .inner-page__main
      .profile__info
        profile-info(
          :info="getUsersInfo"
          :me="getUsersInfo.me"
          :meBlocked="getUsersInfo.is_you_blocked"
          :blocked="getUsersInfo.is_blocked"
          :friend="getUsersInfo.is_friend"
          :online="getUsersInfo.is_onlined")
      .profile__news
        .profile__tabs
          span.profile__tab.active Публикации {{getUsersInfo.first_name}} ({{getWall.length}})
        .profile__news-list
          news-block(v-for="news in getWall" :key="news.id" :info="news")
    .inner-page__aside
      friends-possible
</template>

<script>
import FriendsPossible from '@/components/Friends/Possible'
import ProfileInfo from '@/components/Profile/Info'
import NewsBlock from '@/components/News/Block'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ProfileId',
  components: { FriendsPossible, ProfileInfo, NewsBlock },
  data: () => ({
    loading: false
  }),
  computed: {
    ...mapGetters('users/info', ['getUsersInfo', 'getWall'])
  },
  methods: {
    ...mapActions('users/info', ['userInfoId'])
  },
  created() {
    this.userInfoId(this.$route.params.id)
  }
}
</script>
