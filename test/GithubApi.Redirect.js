const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect } = require('chai');

describe('Consuming HEAD methods', () => {
  const oldRepositoryName = 'https://github.com/aperdomob/redirect-test';
  const newRepositoryName = 'https://github.com/aperdomob/new-redirect-test';

  describe('Consume the service https://github.com/aperdomob/redirect-test', () => {
    let newUrl;
    let statusCodeRequest;

    before(() => agent.head(oldRepositoryName)
      .catch((response) => {
        newUrl = response.response.headers.location;
        statusCodeRequest = response.status;
      }));

    it('Verify the status code 301 and have the redirection to the new url.', () => {
      expect(statusCodeRequest).to.equal(statusCode.MOVED_PERMANENTLY);
      expect(newUrl).to.equal(newRepositoryName);
    });
  });

  describe('Consume the url with redirect', () => {
    let statusCodeRequestOK;

    before(() => agent.get(oldRepositoryName)
      .then((response) => {
        statusCodeRequestOK = response.status;
      }));

    it('The url should be redirected', () => {
      expect(statusCodeRequestOK).to.equal(statusCode.OK);
    });
  });
});
