const listPublicEventsSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          actor: {
            type: 'object',
            properties: {
              avatar_url: { type: 'string' },
              display_login: { type: 'string' },
              gravatar_id: { type: 'string' },
              id: { type: 'number' },
              login: { type: 'string' },
              url: { type: 'string' }
            }
          },
          created_at: { type: 'string' },
          id: { type: 'string' },
          payload: {
            type: 'object',
            properties: {
              before: { type: 'string' },
              commits: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    author: {
                      type: 'object',
                      properties: {
                        email: { type: 'string' },
                        name: { type: 'string' }
                      }
                    },
                    distinct: { type: 'boolean' },
                    message: { type: 'string' },
                    sha: { type: 'string' },
                    url: { type: 'string' }
                  }
                }
              },
              distinct_size: { type: 'number' },
              head: { type: 'string' },
              push_id: { type: 'number' },
              ref: { type: 'string' },
              size: { type: 'number' }
            }
          },
          public: { type: 'boolean' },
          repo: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              url: { type: 'string' }
            }
          },
          type: { type: 'string' }
        }
      }
    },
    status: { type: 'number' }
  }
};

exports.listPublicEventsSchema = listPublicEventsSchema;
