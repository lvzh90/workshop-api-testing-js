const agent = require('superagent-promise')(require('superagent'), Promise);
const responseTime = require('superagent-response-time');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

describe('Response Times', () => {
  const urlBase = 'https://api.github.com';

  describe('Consume the service https://api.github.com/users', () => {
    let queryTime;
    let statusCodeRequest;

    before(() => agent.get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .use(responseTime((request, time) => {
        queryTime = time;
      }))
      .end((err, res) => {
        statusCodeRequest = res.status;
      }));

    it('Verify that the response time is less than 5 seconds.', () => {
      expect(statusCodeRequest).to.equal(statusCode.OK);
      expect(queryTime).to.be.at.below(5000);
    });
  });
});
