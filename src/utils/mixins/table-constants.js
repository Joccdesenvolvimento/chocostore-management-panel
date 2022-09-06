export default {
  data () {
    return {
      tableConstants: {
        page: 1,
        pageCount: 0,
        itemsPerPage: 9,
        totalVisible: 7,
        reset () {
          this.page = 1;
        }
      }
    };
  }
};
