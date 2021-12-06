<template lang="pug">
  .news.inner-page
    .inner-page__main
      .news__add
        news-add(user)
      .news__list(v-if="getInfo")
        news-block(
          v-for="feed in getFeeds"
          :key="feed.id"
          :info="feed"
          :edit="getInfo.id === feed.author.id"
          :deleted="getInfo.id === feed.author.id"
        )
      pagination(
          v-model="page"
          :count="getTotalFeeds"
          :per-page="feedsPerPage"
        )
    .inner-page__aside
      friends-possible
 </template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FriendsPossible from '@/components/Friends/Possible'
import NewsBlock from '@/components/News/Block'
import NewsAdd from '@/components/News/Add'
import Pagination from '@/components/pagination/Pagination.vue';
export default {
  name: 'News',
  components: { FriendsPossible, NewsBlock, NewsAdd, Pagination },
  data() {
    return {
      page: 1,
      feedsPerPage: 3
    };
  },
  computed: {
    ...mapGetters('profile/feeds', ['getFeeds', 'getTotalFeeds']),
    ...mapGetters('profile/info', ['getInfo'])
  },
  methods: {
    ...mapActions('profile/feeds', ['apiFeeds'])
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.apiFeeds()
    })
  },
  watch: {
    page() {
      this.apiFeeds();
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.news__add {
  margin-bottom: 30px;
}
</style>
