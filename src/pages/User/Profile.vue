<template lang="pug">
  .div
    .profile.inner-page(v-if='getInfo.is_deleted===true')
      profile-deleted
    .profile.inner-page(v-if='getInfo.is_deleted===false')
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
            pagination(
              v-model="page"
              :count="getTotalFeeds"
              :per-page="feedsPerPage"
            )
      .inner-page__aside
        friends-possible
</template>

<script>
import FriendsPossible from '@/components/Friends/Possible'
import ProfileInfo from '@/components/Profile/Info'
import NewsAdd from '@/components/News/Add'
import NewsBlock from '@/components/News/Block'
import ProfileDeleted from '@/pages/User/ProfileDeleted'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Profile',
  components: { FriendsPossible, ProfileInfo, NewsAdd, NewsBlock,ProfileDeleted },
  data: () => ({
    activeTab: 'POSTED',
    is_deleted: false
  }),
  computed: {
    ...mapGetters('profile/info', ['getInfo']),
    ...mapGetters('users/info', ['getWall', 'getWallPostedLength', 'getWallQueuedLength']),
    activeWall() {
      return this.getWall.filter(el => el.type === this.activeTab)
    },
    deletedCheck(){
      return this.getInfo.is_deleted;
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
