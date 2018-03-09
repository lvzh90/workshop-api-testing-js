const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const chai = require('chai');

const { assert, expect } = chai;
chai.use(require('chai-subset'));

describe('Consuming DELETE methods', () => {
  const urlBase = 'https://api.github.com';

  describe('Consume the service https://api.github.com/gists', () => {
    const jsCode = `
            const createPromise = (index, time) =>
              new Promeise ((resolve, reject) => {
                  setTimeout(() => {
                      console.log('I am a callback ', index);
                      resolve(index);
                  }, time);
              });

              const main = async () => {
                  await createPromise(1, 1000);
                  await createPromise(2, 100);
              }

              main();
              console.log('finished');
        `;

    const createGist = {
      public: true,
      description: 'new description',
      files: {
        'promise.js': {
          content: jsCode
        }
      }
    };

    let gist;
    let statusCodeRequest;

    before(() => agent.post(`${urlBase}/gists`, createGist)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        gist = response.body;
        statusCodeRequest = response.status;
      }));

    it('Verify the response code, the description, if it is public and the contents of the file.', () => {
      expect(statusCodeRequest).to.equal(statusCode.CREATED);
      expect(gist.public).to.equal(true);
      expect(gist.description).to.equal(createGist.description);
      expect(gist).to.containSubset(createGist);
    });


    describe('Get the new gist', () => {
      let gistFound;

      before(() => agent.get(gist.url)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          gistFound = response.body;
        }));

      it('verify that the gist exists.', () => {
        assert.exists(gistFound);
      });


      describe('Delete the new gist', () => {
        let gistDeleted;
        let newStatusCodeRequest;

        before(() => agent.del(gist.url)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            gistDeleted = response.body;
            newStatusCodeRequest = response.status;
          }));

        it('verify that the gist does not exists.', () => {
          expect(newStatusCodeRequest).to.equal(statusCode.NO_CONTENT);
          expect(gistDeleted).to.eql({});
        });


        describe('Consult the gist again.', () => {
          let statusCodeRequestNotFound;

          before(() => agent.get(gist.url)
            .auth('token', process.env.ACCESS_TOKEN)
            .catch((response) => {
              statusCodeRequestNotFound = response.status;
            }));

          it('verify that the gist does not exists.', () => {
            expect(statusCodeRequestNotFound).to.equal(statusCode.NOT_FOUND);
          });
        });
      });
    });
  });
});
