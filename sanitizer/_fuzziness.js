const _ = require('lodash');

function _sanitize( raw, clean ){
    const IS_NUMERIC_REGEXP = /^\d+$/;

    // error & warning messages
    var messages = { errors: [], warnings: [] };

    if (_.isUndefined(raw)) {
        return messages;
    }

    if (_.has(raw, 'fuzziness')) {
        if (raw.fuzziness === 'AUTO') {
            clean.fuzziness = raw.fuzziness;
        } else if (IS_NUMERIC_REGEXP.test(raw.fuzziness) && raw.fuzziness > 0 && raw.fuzziness <= 2) {
            clean.fuzziness = parseInt(raw.fuzziness);
        }

        if (_.has(raw, 'max_expansions') &&
            IS_NUMERIC_REGEXP.test(raw.max_expansions) &&
            raw.max_expansions >= 0 &&
            raw.max_expansions <= 50) {

            clean.max_expansions = parseInt(raw.max_expansions);
        }
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
