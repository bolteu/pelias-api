module.exports = {
  'query': {
    'bool': {
      'must': [{
        'match': {
          'name.default': {
            'analyzer': 'peliasQuery',
            'boost': 1,
            'fuzziness': 'AUTO',
            'prefix_length': 1,
            'max_expansions': 10,
            'operator': 'and',
            'cutoff_frequency': 0.01,
            'query': '1 2'
          }
        }
      },
        {
          'constant_score': {
            'filter': {
              'match': {
                'name.default': {
                  'analyzer': 'peliasQuery',
                  'boost': 100,
                  'query': 'three',
                  'fuzziness': 'AUTO',
                  'prefix_length': 1,
                  'max_expansions': 10,
                  'operator': 'and',
                  'cutoff_frequency': 0.01,
                }
              }
            }
          }
        }],
      'should': [
        {
          'function_score': {
            'query': {
              'match_all': {}
            },
            'max_boost': 20,
            'score_mode': 'first',
            'boost_mode': 'replace',
            'functions': [{
              'field_value_factor': {
                'modifier': 'log1p',
                'field': 'popularity',
                'missing': 1
              },
              'weight': 1
            }]
          }
        }, {
          'function_score': {
            'query': {
              'match_all': {}
            },
            'max_boost': 20,
            'score_mode': 'first',
            'boost_mode': 'replace',
            'functions': [{
              'field_value_factor': {
                'modifier': 'log1p',
                'field': 'population',
                'missing': 1
              },
              'weight': 3
            }]
          }
        }]
    }
  },
  'sort': ['_score'],
  'size': 20,
  'track_scores': true
};
