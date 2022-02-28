<template lang="pug">
  .h2
    .friends__title
      .header Статистика
    .statistics
      .stat_block
        .square2
          .img_stat
            simple-svg(:filepath="'/static/img/stat-mess.svg'").img_plus
        .title Комментариев оставлено
        .num {{getResult.statistics.comments}}
      .stat_block
        .square2
          .img_stat
            simple-svg(:filepath="'/static/img/stat-posts.svg'").img_plus
        .title    Постов опубликовано
        .num {{getResult.statistics.posts}}
      .stat_block
        .square2
          .img_stat
            simple-svg(:filepath="'/static/img/stat-likes.svg'").img_plus
        .title Лайков поставлено
        .num {{getResult.statistics.likes}}
      .stat_block
        .square
          .img_stat
            simple-svg(:filepath="'/static/img/stat-user.svg'").img_plus
        .title Первая публикация
        .numData {{getResult.statistics.first_publication!=="Нет постов" ? (getResult.statistics.first_publication.split('-')[2][0] + (getResult.statistics.first_publication.split('-')[2][1] !== 'T' ? getResult.statistics.first_publication.split('-')[2][1] : '') + ' ' + months[getResult.statistics.first_publication.split('-')[1]] + ' ' + getResult.statistics.first_publication.split('-')[0] + ' года') : getResult.statistics.first_publication}}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FriendsPossible from '@/components/Friends/Possible'
import FriendsBlock from '@/components/Friends/Block'
import FriendsRequest from '@/components/Friends/Request'
export default {
  name: 'Statistics',
  data: () => ({
    months: [
      'Января',
      'Февраля' ,
      'Марта' ,
      'Апреля' ,
      'Мая' ,
      'Июня' ,
      'Июля' ,
      'Августа' ,
      'Сентября' ,
      'Октября' ,
      'Ноября' ,
      'Декабря'
    ],
  }),
  methods: {
    ...mapActions('profile/statistics', ['apiGetStatistics']),
    ...mapActions('profile/feeds', ['apiFeeds']),
    getRes() {
      let arr = this.getResult.statistics.first_publication;
      return arr[0]
    }
  },
  computed: {
    ...mapGetters('profile/statistics', ['getResult']),

  },

  mounted() {
    // if (this.requestFriends.length === 0)
    this.apiGetStatistics();
    //this.apiFeeds({offset: 1})
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';
.statistics {
  max-width: 1000px;
  min-width: 600px;
  display flex;
  //flex-direction row;
  flex-wrap: wrap;
}
.stat_block{
  background-color: white-lilac
  width: 40%;
  min-width: 300px;
  height: 150px;
  box-shadow: 0px 0px 10px grey;
  margin: 20px 10px 10px 20px
}
.square{
  padding-top 25px;
  display: table-cell;
  vertical-align: middle
  height: 150px;
  width: 150px;
  background-color: eucalypt;
  float: left
}
.square2{
  padding-top 40px;
  display: table-cell;
  vertical-align: middle
  height: 150px;
  width: 150px;
  background-color: eucalypt;
  float: left
}
.img_stat {

  width: 100px;
  margin-left: auto;
  margin-right: auto;

  margin-top: auto;
  margin-bottom: auto;
  //stroke: #D6D6E2;
}
.title{
  text-align center
  margin-top 20px
  padding-right: 10px;
  font-family: font-exo;
  font-weight: 100;
  font-size: 20px;
  color: #000;
}
.num{
   text-align center
   margin-top 10px
   font-family: Open Sans, Arial, sans-serifSans;
   font-weight: 300px;
   font-size: 50px;
   color: #000;
 }
.numData{
  text-align center
  margin-top 10px
  font-family: Open Sans, Arial, sans-serifSans;
  font-weight: 3px;
  line-height: 23px;
  font-size: 20px;
  color: #000;
}
.header{
  margin 30px 25px 20px
}
</style>
