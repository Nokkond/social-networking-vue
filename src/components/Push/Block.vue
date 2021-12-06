<template lang="pug">
  .push-block
    .push__img
      img(v-if="info.entity_author.photo" :src="info.entity_author.photo" :alt="info.entity_author.first_name")
      img(v-else src="/static/img/user/2.webp" :alt="info.entity_author.first_name")
    p.push__content
      router-link.push__content-name(:to="getRouteByNotification(info)")
        | {{info.entity_author.first_name + ' ' + info.entity_author.last_name}}
        |
        .push__content-event {{getNotificationsTextType(info.event_type)}}

        span.push__content-preview(v-if="info.event_type != 'FRIEND_REQUEST'") «{{info.info}}»
    span.push__time {{info.sent_time | moment('from')}}
    button.push-block__close(@click="readNotification(info.id)" title="скрыть уведомление") Х
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getRouteByNotification } from '@/utils/notifications.utils.js'
export default {
  name: 'PushBlock',
  props: {
    info: Object
  },
  computed: {
    ...mapGetters('profile/notifications', ['getNotificationsTextType'])
  },
  methods: {
    ...mapActions('profile/notifications', ['readNotificationItem']),
    getRouteByNotification,

    readNotification(id) {
      this.readNotificationItem(id)
    },
  }
}
</script>

<style lang="stylus">
.push-block {
  position: relative;
  background: #fff;
  padding: 25px 30px;
  box-shadow: 0px 2px 60px rgba(0, 0, 0, 0.1);
  display: flex;

  &+& {
    margin-top: 20px;
  }

  .push__img {
    flex: none;
  }

  .push__content {
    max-width: 650px;
  }

  .push__content-name {
    display inline-block
    margin-right 5px
  }

  .push__time {
    flex: none;
    padding-top: 20px;
  }

  .push-block__close {
    position absolute
    cursor: pointer
    top  8px
    right 8px
    z-index 11
    font-weight bold
    background transparent
  }

  .push-block__close:hover {
    color red
  }
}
</style>
