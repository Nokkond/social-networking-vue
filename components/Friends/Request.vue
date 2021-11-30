<template lang="pug">
  .friends-application(v-if="requestFriends.request.length > 0")
    ul.friends-application__list
      li.friends-application__item(v-for="user in requestFriends.request" :key="user.id")
        .friends-application__pic
          img(v-if="user.photo" :src="user.photo" :alt="user.first_name")
          img(v-else src="/static/img/user/2.webp" :alt="user.first_name")
        router-link.friends-application__name(:to="{name: 'ProfileId', params: {id: user.id}}") {{user.first_name + ' ' + user.last_name}}
        a.friends-application__link(href="#" @click.prevent="apiAcceptFriendRequest(user.id)") Добавить
        br
        br
        a.friends-application__link(href="#" @click.prevent="apiDeclineFriendRequest(user.id)") Отклонить
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'FriendsApplication',
  computed: {
    ...mapGetters('profile/friends', ['getResult']),
    requestFriends() {
      return this.getResult
    }
  },
  methods: {
    ...mapActions('profile/friends', ['apiAcceptFriendRequest', 'apiDeclineFriendRequest'])
  },
  mounted() {
    if (this.requestFriends.length === 0) this.apiRequest()
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.friends-application {
  background: #fff;
  box-shadow: standart-boxshadow;
  padding: 20px;
  width: 100%;
  margin: 16px 0 20px;
  max-width: calc(50% - 20px);
}

.friends-application__pic {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 30px;
  flex: none;

  @media (max-width: breakpoint-xxl) {
    margin-right: 10px;
  }

  img {
    width: 100%;
    max-width 100%
    height 100%
    object-fit cover
  }
}

.friends-application__list {
  width 100%
}

.friends-application__item {
  align-items: center;
  display: flex;
  justify-content space-between
}

.friends-application__item:not(:last-child) {
  border-bottom : 1px solid #e6e6e6;
}

.friends-application__name {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  color: steel-gray;
  display: block;
  margin-right: auto;

  @media (max-width: breakpoint-xxl) {
    font-size: 14px;
  }
}

.friends-application__link {
  font-size: 13px
  color: #21a45d
  display contents
}
</style>
