const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect: exp } = require('chai');

describe('First Api Tests', () => {
  it('Consume GET Service', () => agent.get('https://httpbin.org/ip').then((response) => {
    exp(response.status).to.equal(statusCode.OK);
    exp(response.body).to.have.property('origin');
  }));

  it('Consume GET Service with query parameters', () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    return agent.get('https://httpbin.org/get')
      .query(query)
      .then((response) => {
        exp(response.status).to.equal(statusCode.OK);
        exp(response.body.args).to.eql(query);
      });
  });

  it('Consume HEAD Service', () => {
    agent.head('https://httpbin.org/headers')
      .then((response) => {
        exp(response.status).to.equal(statusCode.OK);
        exp(response.body).to.eql({});
      });
  });

  it('Consume PATCH Service', () => {
    const body = { name: 'Linda', lastname: 'Zapata' };

    return agent.patch('https://httpbin.org/patch')
      .send(body)
      .then((response) => {
        exp(response.status).to.equal(statusCode.OK);
        exp(response.body.json).to.eql(body);
      });
  });

  it('Consume PUT Service', () => {
    const body = { name: 'Linda', lastname: 'Zapata' };

    return agent.put('https://httpbin.org/put')
      .send(body)
      .then((response) => {
        exp(response.status).to.equal(statusCode.OK);
        exp(response.body.json).to.eql(body);
      });
  });

  it('Consume DELETE Service', () => {
    const body = { name: 'Linda', lastname: 'Zapata' };

    return agent.del('https://httpbin.org/delete')
      .send(body)
      .then((response) => {
        exp(response.status).to.equal(statusCode.OK);
        exp(response.body.json).to.eql(body);
      });
  });
});
