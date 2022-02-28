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
            span.profile__tab(@click="type='posted';changeTab('POSTED');" :class="{active: activeTab === 'published'}") Мои публикации
            span.profile__tab(@click="type='queued'; changeTab('QUEUED');" :class="{active: activeTab === 'queue'}" ) Отложенные публикации
          .profile__add
            news-add
          .profile__news-list
            news-block(edit deleted :deffered="activeTab === 'queue'" v-for="news in activeWall" :key="news.id" :info="news")
            pagination(
              v-model="page"
              :count="getTotalFeeds"
              :per-page="feedsPerPage"
              :type='type'
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
import Pagination from '../../components/pagination/Pagination'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Profile',
  components: { FriendsPossible, ProfileInfo, NewsAdd, NewsBlock,ProfileDeleted,Pagination  },
  data: () => ({
    activeTab: 'POSTED',
    is_deleted: false,
    page: 1,
    //getTotalFeeds: 6,
    feedsPerPage: 5,
    itemPerPage: 5,
    offset: 0,
    type: 'posted'
  }),
  computed: {
    ...mapGetters('profile/info', ['getInfo']),
    ...mapGetters('users/info', ['getWall', 'getWallPostedLength', 'getWallQueuedLength', 'getTotalFeeds']),
    activeWall() {
      return this.getWall.filter(el => el.type === this.activeTab)
    },
    deletedCheck(){
      return this.getInfo.is_deleted;
    },
  },
  methods: {
    ...mapActions('users/info', ['apiWall']),
    changeTab(tab) {
      this.activeTab = tab
      this.apiWall({ 'id': this.getInfo.id, 'offset': this.offset, 'itemPerPage': this.itemPerPage, 'type': this.type })
    }
  },
  created() {
    if (this.getInfo) this.apiWall({ 'id': this.getInfo.id, 'offset': this.offset, 'itemPerPage': this.itemPerPage, 'type': this.type })
    // this.getTotalFeeds = this.apiWall({ id: this.getInfo.id,
    //   offset: this.offset}).total
  }
}
</script>
