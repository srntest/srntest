define(['lib/Base'], function (Base) {
  var EntryService = Base.extend({
    constructor: function(){
      this.entries = [];
      this.entries.push({slug: 'test', title: +new Date()});
    },

    getBySlug: function(slug){
      var filter = _.filter(this.entries, function(entry){
        return entry.slug === slug;
      });

      return _.first(filter);
    }
  });

  return EntryService;
});