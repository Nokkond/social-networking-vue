<template lang="pug">
  form.friends-possible(@submit.prevent="onSearchUsers" action="#")
    h4.friends-possible__title Параметры поиска
    .friends-search
      .friends-search__row
        .friends-search__block
          label.search__label(for="friends-search-name") Имя:
          input.search__input(type="text" id="friends-search-name" v-model="first_name")
        .friends-search__block
          label.search__label(for="friends-search-lastname") Фамилия:
          input.search__input(type="text" id="friends-search-lastname" v-model="last_name")
      .friends-search__block
        label.search__label Возраст:
        .search__row
          select.select.friends-search__select(v-model.number="age_from")
            option(value="" enabled) От
            option(v-for="from in fromYears" :value="from") От {{from}}
          span.search__age-defis —
          select.select.friends-search__select(v-model.number="age_to")
            option(value="" enabled) До
            option(v-for="to in toYears" :value="to") До {{to}}
      .friends-search__block
        label.search__label Регион:
        .search__row
          select.select.friends-search__select(v-model="country")
            option(value="" enabled) Страна
            option(v-for="country in countries" :value="country.title") {{country.title}}
          select.select.friends-search__select(v-model="city")
            option(value="" enabled) Город
            option(v-for="city in cities" :value="city.title") {{city.title}}
    button.friends-possible__btn(type="submit")
      simple-svg(:filepath="'/static/img/search.svg'")
      span.friends-possible__link Искать друзей
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import NameField from '@/components/FormElements/NameField'

export default {
  name: 'FriendsSearch',
  components: { NameField },
  data: () => ({
    first_name: '',
    last_name: '',
    age_from: null,
    age_to: null,
    country: null,
    city: null,
    offset: 0,
    itemPerPage: 20
  }),
  computed: {
    ...mapGetters('platform/cities', ['getCities']),
    cities() {
      return this.getCities;
    },
    ...mapGetters('platform/countries', ['getCountries']),
    countries() {
      return this.getCountries;
    },
    fromYears() {
      var foo = [];
      var to;
      if (this.age_to === null || this.age_to === "") {
        to = 70;
      } else {
        to = this.age_to;
      }
      for (var i = 18; i <= to; i++) {
        foo.push(i);
      }
      return foo;
    },
    toYears() {
      var foo = [];
      var from;
      if (this.age_from === null || this.age_from === "") {
        from = 18;
      } else {
        from = this.age_from;
      }
      for (var i = from; i <= 70; i++) {
        foo.push(i);
      }
      return foo;
    }
  },
  methods: {
    ...mapActions('global/search', ['searchUsers', 'clearSearch']),
    ...mapActions('platform/countries', ['apiCountries']),
    ...mapMutations('platform/cities', ['setDefaultCities']),
    ...mapActions('platform/cities', ['apiCities']),
    onSearchUsers() {
      let { first_name, last_name, age_from, age_to, country, city } = this;
      this.searchUsers({ first_name, last_name, age_from, age_to, country, city })
    },
  },
  // beforeDestroy() {
  //   this.clearSearch()
  // },
  created() {
    this.apiCountries()
    this.apiCities()
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.friends-search {
  margin-top: 25px;
  padding-top: 20px;
  margin-bottom: 30px;
  border-top: 1px solid #E6E6E6;
}

.friends-search__row {
  @media (max-width: breakpoint-xl) {
    display: flex;

    .friends-search__block {
      flex: auto;
    }

    .friends-search__block + .friends-search__block {
      margin-top: 0;
      margin-left: 12px;
    }
  }
}

.friends-search__row + .friends-search__block {
  margin-top: 15px;
}

.friends-search__block {
  &+& {
    margin-top: 15px;
  }
}

.friends-search__select {
  display: block;
  width: 100%;

  &+& {
    margin-left: 12px;
  }
}

.error {
  color red
  font-size 12px
}

.friends-possible__btn:disabled {
  opacity .5
  cursor not-allowed
}
</style>
