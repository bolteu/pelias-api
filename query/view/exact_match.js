var peliasQuery = require('pelias-query');

module.exports = function (vs) {
    const view_name = 'first_tokens_only';

    // get a copy of the *complete* tokens produced from the input:name
    const tokens = vs.var('input:name:tokens_complete').get();

    // set the 'input' variable to all but the last token
    vs.var(`match_phrase:${view_name}:input`).set( tokens.join(' ') );
    vs.var(`match_phrase:${view_name}:field`).set(vs.var('phrase:field').get());

    vs.var(`match_phrase:${view_name}:analyzer`).set(vs.var('phrase:analyzer').get());
    vs.var(`match_phrase:${view_name}:boost`).set(vs.var('phrase:boost').get());
    vs.var(`match_phrase:${view_name}:slop`).set(vs.var('phrase:slop').get());

    return peliasQuery.view.leaf.match_phrase(view_name);
};

