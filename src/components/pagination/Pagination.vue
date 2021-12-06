<template>
  <ul class="pagination">
    <li class="pagination__item" v-for="pageNumber in croppedPagesList" :key="pageNumber">
      <a href="#" class="pagination__link"
         :class="{
          'pagination__link--current': pageNumber === page,
          'pagination__link--display-none': pageNumber === '',
          'pagination__link--default': pageNumber === '...',
          }"
         @click.prevent="paginate(pageNumber)">
        {{ pageNumber }}
      </a>
    </li>
  </ul>
</template>

<script>

const MAX_PAGES = 20;

export default {
  model: {
    prop: 'page',
    event: 'paginate',
  },
  props: ['page', 'count', 'perPage'],
  computed: {
    maxPages() {
      return MAX_PAGES;
    },
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
    croppedPagesList() {
      // if (this.count < this.pages) {
      //   return [
      //     this.page >= this.pages ? '' : this.pages,
      //   ];
      // }
      return this.pages;
    },
  },
  methods: {
    paginate(page) {
      if (page && page <= this.pages) {
        this.$emit('paginate', page);
      }
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl';

.pagination {
  display flex
  margin-top 32px
}
.pagination__item {
  margin-right 16px
}
.pagination__link {
  display flex
  align-items center
  justify-content center
  width 32px
  height 32px
  background red
  border-radius 50%
  color white
}
</style>
