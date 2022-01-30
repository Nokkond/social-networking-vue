<template lang="pug">
  .change-password-success
    simple-svg(:filepath="'/static/img/success-change-password.svg'")
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'ForgotSuccess',
    methods: {
      ...mapActions('auth/api', ['deleteUserToken']),
    },
    created() {
      this.deleteUserToken();
    }
}
</script>

<style lang="stylus">
.change-password-success {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .simple-svg-wrapper {
    width: 90px;
  }
}
</style>
