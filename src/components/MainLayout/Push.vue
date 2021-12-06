<template lang="pug">
  .push(:class="{open: isOpen}")
    .push__overlay(@click.stop="closePush")
    .push__wrap(:class="{open: isOpen}" ref="wrap")
      button.push__close(@click="closeReadNotifications" title="скрыть все уведомления") Скрыть все уведомления
      .push__list(ref="list")
        .push__item(v-for="info in getNotifications.slice(0, 10)" :key="info.id" @click.stop="")
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
          button.push__close.push__close_item(@click="closeReadNotificationItem(info.id)" title="скрыть уведомление") X
      router-link.push__btn(:to="{name: 'Push'}" v-if="getNotificationsLength > 1") Показать все ({{getNotificationsLength}})
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getRouteByNotification } from '@/utils/notifications.utils.js';
export default {
  name: 'Push',
  props: {
    isOpen: Boolean
  },
  computed: {
    ...mapGetters('profile/notifications', ['getNotifications', 'getNotificationsLength', 'getNotificationsTextType']),
  },
  methods: {
    ...mapActions('profile/notifications', ['apiNotifications', 'readNotifications', 'readNotificationItem']),
    getRouteByNotification,
    closePush() {
      if (!this.isOpen) return
      this.$emit('close-push')
    },

    closeReadNotifications() {
      this.readNotifications()
    },

    closeReadNotificationItem(id) {
      this.readNotificationItem(id)
    },
  },
  mounted() {
    if (this.getNotificationsLength === 0) this.apiNotifications()
    if (window.innerHeight - this.$refs.wrap.getBoundingClientRect().top - this.$refs.wrap.offsetHeight < 0) {
      this.$refs.wrap.style.maxHeight = `${window.innerHeight - this.$refs.wrap.getBoundingClientRect().top}px`
    }
    window.onscroll = () => {
      this.closePush()
    }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.push {
  .push__overlay {
    display: none;
  }

  &.open {
    .push__overlay {
      display: block;
    }
  }
}

.push__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  cursor: default;
}

.push__wrap {
  position: fixed;
  background: #FFf;
  box-shadow: 0px 2px 60px rgba(0, 0, 0, 0.1);
  right: 50px;
  top: header-height;
  width: 100%;
  max-width: 710px;
  max-height: 675px;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-20px);
  transition: all 0.2s;
  overflow-y: auto;

  &.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  &:before, &:after {
    content: '';
    display: block;
    width: 19px;
    height: 38px;
    position: absolute;
    top: -16px;
  }

  &:before {
    background-image: linear-gradient(115deg, transparent 50%, #fff 50%);
    right: 223px;
  }

  &:after {
    background-image: linear-gradient(245deg, transparent 50%, #fff 50%);
    right: 205px;
  }
}

.push__list {
  overflow-y: auto;
  max-height: 400px;
}

.push__item {
  position relative
  display: flex;
  align-items: center;
  padding: 35px 0;
  margin: 0 40px;
  cursor default

  &+& {
    border-top: 1px solid #E7E7E7;
  }
}

.push__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 15px;
  letter-spacing: 0.01em;
  color: eucalypt;
  border-top: 1px solid #E7E7E7;
  height: 85px;
}

.push__close {
  position sticky
  z-index 2000
  top 12px
  right 12px
  background transparent
  cursor: pointer
  padding 4px
  display: block;
  margin-left: auto;
  transform: translateX(-40px)
  color red
  transition color .3s ease
}

.push__close:hover {
  color: #000
}

.push__close.push__close_item {
  position absolute
  top 16px
  right 0
  padding 4px
  font-weight bold
  color #000
}

.push__close.push__close_item:hover {
  color: red
}
</style>
