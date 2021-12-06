<template lang="pug">
  .profile.inner-page
    .inner-page__main
      .profile__info
        profile-info(me online :info="getInfo")
      .profile__news
        .profile__tabs
          span.profile__tab(@click="changeTab('POSTED')" :class="{active: activeTab === 'published'}") Мои публикации ({{getWallPostedLength}})
          span.profile__tab(@click="changeTab('QUEUED')" :class="{active: activeTab === 'queue'}" v-if="getWallQueuedLength > 0") Отложенные публикации ({{getWallQueuedLength}})
        .profile__add
          news-add
        .profile__news-list
          news-block(edit deleted :deffered="activeTab === 'queue'" v-for="news in activeWall" :key="news.id" :info="news")
    .inner-page__aside
      friends-possible
</template>

<script>
import FriendsPossible from '@/components/Friends/Possible'
import ProfileInfo from '@/components/Profile/Info'
import NewsAdd from '@/components/News/Add'
import NewsBlock from '@/components/News/Block'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Profile',
  components: { FriendsPossible, ProfileInfo, NewsAdd, NewsBlock },
  data: () => ({
    activeTab: 'POSTED'
  }),
  computed: {
    ...mapGetters('profile/info', ['getInfo']),
    ...mapGetters('users/info', ['getWall', 'getWallPostedLength', 'getWallQueuedLength']),
    activeWall() {
      return this.getWall.filter(el => el.type === this.activeTab)
    }
  },
  methods: {
    ...mapActions('users/info', ['apiWall']),
    changeTab(tab) {
      this.activeTab = tab
    }
  },
  created() {
    if (this.getInfo) this.apiWall({ id: this.getInfo.id })
  }
}
</script>
