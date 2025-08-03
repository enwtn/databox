# databox

SPA that hides some text behind a password. You can host this for free on plaforms like Netlify and Cloudflare Workers.

Probably not very secure, I don't know anything about crypto and I copied most of the code from a random medium article.

I use this to store some phone numbers in case I lose my phone and can't remember anyones number.

## Deployment
You can deploy to any SPA host like Netlify or CloudFlare Workers. You just need to make sure the following environment variables are set during the build:
 - `SECRET_DATA` - the data to encrypt and store
 - `SECRET_PASSWORD` - the password to encrypt toe data with

### Cloudflare
Click the link and add the required variables to "Build variables" under advanced settings.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/enwtn/databox)

