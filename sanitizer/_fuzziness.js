const _ = require('lodash');

function _sanitize( raw, clean ){
    // error & warning messages
    var messages = { errors: [], warnings: [] };

    if (_.isUndefined(raw)) {
        return messages;
    }

    if (_.has(raw, 'fuzziness')) {
        clean.fuzziness = raw.fuzziness;
    }
    if (_.has(raw, 'max_expansions')) {
        clean.max_expansions = raw.max_expansions;
    }

    return messages;
}

function _expected() {
    return [
        { name: 'fuzziness' },
        { name: 'max_expansions' }];
}

module.exports = () => ({
    sanitize: _sanitize,
    expected: _expected
});
