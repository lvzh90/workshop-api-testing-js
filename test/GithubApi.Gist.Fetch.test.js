const fetch = require('isomorphic-fetch');
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

    before(() => fetch(
      `${urlBase}/gists`,
      {
        method: 'POST',
        body: JSON.stringify(createGist),
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      }
    ).then((response) => {
      statusCodeRequest = response.status;
      return response.json();
    }).then((body) => {
      gist = body;
    }));

    it('Verify the response code, the description, if it is public and the contents of the file.', () => {
      expect(statusCodeRequest).to.equal(statusCode.CREATED);
      expect(gist.public).to.equal(true);
      expect(gist.description).to.equal(createGist.description);
      expect(gist).to.containSubset(createGist);
    });


    describe('Get the new gist', () => {
      let gistFound;

      before(() => fetch(
        gist.url,
        {
          method: 'GET',
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        }
      ).then(response => response.json()).then((body) => {
        gistFound = body;
      }));

      it('verify that the gist exists.', () => {
        assert.exists(gistFound);
      });


      describe('Delete the new gist', () => {
        let newStatusCodeRequest;

        before(() => fetch(
          gist.url,
          {
            method: 'DELETE',
            headers: {
              Authorization: `token ${process.env.ACCESS_TOKEN}`
            }
          }
        ).then((response) => {
          newStatusCodeRequest = response.status;
        }));

        it('verify that the gist does not exists.', () => {
          expect(newStatusCodeRequest).to.equal(statusCode.NO_CONTENT);
        });


        describe('Consult the gist again.', () => {
          let statusCodeRequestNotFound;

          before(() => fetch(
            gist.url,
            {
              method: 'GET',
              headers: {
                Authorization: `token ${process.env.ACCESS_TOKEN}`
              }
            }
          ).then((response) => {
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
