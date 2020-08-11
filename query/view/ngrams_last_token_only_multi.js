const peliasQuery = require('pelias-query');
var ngrams_last_token_only = require('./ngrams_last_token_only');
var ngrams_last_token_only_fuzzy = require('./ngrams_last_token_only_fuzzy');

module.exports = function (adminFields){
  const subview = peliasQuery.view.admin_multi_match( adminFields, 'peliasQuery' );

  return function (vs) {
    var last_token_view = ngrams_last_token_only;
    if (vs.isset('use_fuzzy')) {
      last_token_view = ngrams_last_token_only_fuzzy;
    }

    // return the simple view for address queries
    if( vs.isset('input:street') ){ return last_token_view(vs); }

    // get a copy of the *tokens_incomplete* tokens produced from the input:name
    var tokens = vs.var('input:name:tokens_incomplete').get();

    // no valid tokens to use, fail now, don't render this view.
    if (!tokens || tokens.length < 1) { return null; }

    // return the simple view for queries with no complete tokens
    var complete_tokens = vs.var('input:name:tokens_complete').get();
    if (!complete_tokens || complete_tokens.length < 1) { return last_token_view(vs); }

    // return the simple view when every complete token is numeric
    var all_complete_tokens_numeric = complete_tokens.every(token => !token.replace(/[0-9]/g, '').length);
    if (all_complete_tokens_numeric) { return last_token_view(vs); }

    // make a copy Vars so we don't mutate the original
    var vsCopy = new peliasQuery.Vars( vs.export() );

    adminFields.forEach(field => {
      // set the admin variables in the copy to only the last token
      vsCopy.var(`input:${field}`).set(tokens.join(' '));
    });

    var rendered = subview( vsCopy );
    if( !rendered ){ return rendered; }

    // return the view rendered using the copy
    return {
      'constant_score': {
        'filter': rendered
      }
    };
  };
};
