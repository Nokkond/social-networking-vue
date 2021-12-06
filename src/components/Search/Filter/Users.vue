<template lang="pug">
  .search-filter
    .search-filter__block.name
      label.search__label(for="search-people-name") Имя:
      input.search__input(type="text" id="search-people-name" v-model="first_name")
    .search-filter__block.lastname
      label.search__label(for="search-people-lastname") Фамилия:
      input.search__input(type="text" id="search-people-lastname" v-model="last_name")
    .search-filter__block.age
      label.search__label Возраст:
      .search__row
        select.select.search-filter__select(v-model.number="age_from")
          option(value="" enabled) От
          option(v-for="from in fromYears" :value="from") От {{from}}
        span.search__age-defis —
        select.select.search-filter__select(v-model.number="age_to")
          option(value="" enabled) До
          option(v-for="to in toYears" :value="to") До {{to}}
    .search-filter__block.region
      label.search__label Регион:
      .search__row
        select.select.search-filter__select(v-model="country")
          option(value="" enabled) Страна
          option(v-for="country in countries" :value="country.title") {{country.title}}
        select.select.search-filter__select(v-model="city")
          option(value="" enabled) Город
          option(v-for="city in cities" :value="city.title") {{city.title}}
    .search-filter__block.btn-news(@click.prevent="onSearchUsers")
      button-hover Применить
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  name: 'SearchFilterUsers',
  data: () => ({
    first_name: null,
    last_name: null,
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
    ...mapActions('global/search', ['searchUsers']),
    ...mapActions('platform/cities', ['apiCities']),
    ...mapActions('platform/countries', ['apiCountries']),
    onSearchUsers() {
      let { first_name, last_name, age_from, age_to, country, city } = this
      this.searchUsers({ first_name, last_name, age_from, age_to, country, city })
    }
  },
  mounted() {
    this.apiCities()
    this.apiCountries()
  }
}
</script>
