define('model/EntryModel', ['framework/core'], function(core){
  var EntryModel = core.Base.extend({
    constructor: function(options){
      _.extend(this, options);
      console.log(this);

      this.id = +new Date();
      this.slug = +new Date();
      this.title = +new Date();
      this.content = 'sawp {0}'.format(+new Date());
    }
  });

  return EntryModel;
});