<script>
import { mapGetters, mapActions } from 'vuex'

const INTERVAL_DIALOG_MS = 5000;
const INTERVAL_NOTIFICATIONS_MS = 5000;
const INTERVAL_CHECK_ONLINE_MS = 60000;

export default {
  data() {
    return {
      intervalForMessages: null,
      intervalForNotifications: null,
      intervalForCheckOnline: null,
    }
  },

  mounted () {
    this.intervalForMessages = setInterval(() => {
      if (this.activeDialog) {
        this.loadFreshMessages(this.activeDialog.id)
        this.apiLoadAllDialogs()
      }
        this.apiUnreadedMessages()
    }, INTERVAL_DIALOG_MS)

    this.intervalForNotifications = setInterval(() => {
      this.apiNotifications()
    }, INTERVAL_NOTIFICATIONS_MS)

    this.intervalForCheckOnline = setInterval(() => {
      this.checkOnline()
    }, INTERVAL_CHECK_ONLINE_MS)
  },
  computed: {
    ...mapGetters('profile/dialogs', ['activeDialog']),
  },
  methods: {
    ...mapActions('profile/dialogs', ['loadFreshMessages', 'apiLoadAllDialogs', 'apiUnreadedMessages']),
    ...mapActions('profile/notifications', ['apiNotifications']),
    ...mapActions('users/info', ['checkOnline']),
  },
  beforeDestroy () {
    window.clearInterval(this.intervalForMessages);
    window.clearInterval(this.intervalForNotifications);
    window.clearInterval(this.intervalForCheckOnline);
  },
  render: () => null,
}
</script>
