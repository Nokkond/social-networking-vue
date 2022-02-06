<template lang="pug">
  button-hover(@click.native="accountRecovery()") Восстановить аккаунт
  //modal(v-model="modalShow")
  //  p(v-if="modalText") {{modalText}}
  //  template(slot="actions")
  //    button-hover(v-if="modalType != 'requestReceived'" @click.native="onConfirm(info.id)") Да
  //    button-hover(v-else @click.native="onConfirm(info.id)") Принять
  //    button-hover(v-if="modalType != 'requestReceived'" variant="red" bordered @click.native="closeModal") Отмена
  //    button-hover(v-else variant="red" bordered @click.native="onDeclineFriendRequest(info.id)") Отклонить
</template>

<script>
import FriendsPossible from '@/components/Friends/Possible'
import ProfileInfo from '@/components/Profile/Info'
import NewsAdd from '@/components/News/Add'
import NewsBlock from '@/components/News/Block'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ProfileDeleted',
  //components: { FriendsPossible, ProfileInfo, NewsAdd, NewsBlock },
  data: () => ({
    //activeTab: 'POSTED',
    //is_deleted: false
  }),
  methods:{
    ...mapActions('profile/account',['accountRecovery'])
  },
  created() {
    if (this.getInfo) this.apiWall({ id: this.getInfo.id })
  }
}
</script>
