// DONE: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'o0rtgtdcob'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-1.amazonaws.com/dev`

export const authConfig = {
  // DONE: reate an Auth0 application and copy values from it into this map
  domain: 'dev--0e2i-ly.us.auth0.com',  // Auth0 domain
  clientId: 'wBPhekx3KqZrE3bX08PN8GDqDpeV7fZ3',  // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
