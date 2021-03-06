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


  describe('Number of users by default', () => {
    let allUsers;

    before(() => agent.get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        allUsers = response.body;
      }));

    it('Verify the number of users.', () => {
      expect(allUsers.length).to.equal(30);
    });
  });

  describe('Get 10 users.', () => {
    let tenUsers;

    before(() => agent.get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .query({ per_page: 10 })
      .then((response) => {
        tenUsers = response.body;
      }));

    it('Verify the number of users is 10.', () => {
      expect(tenUsers.length).to.equal(10);
    });
  });


  describe('Get 50 users.', () => {
    let fiftyUsers;

    before(() => agent.get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .query({ per_page: 50 })
      .then((response) => {
        fiftyUsers = response.body;
      }));

    it('Verify the number of users is 50.', () => {
      expect(fiftyUsers.length).to.equal(50);
    });
  });
});
