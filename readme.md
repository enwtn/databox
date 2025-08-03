# databox

SPA that hides some text behind a password. You can host this for free on plaforms like Netlify and Cloudflare Workers.

Probably not very secure, I don't know anything about crypto and I copied most of the code from a random medium article.

I use this to store some phone numbers in case I lose my phone and can't remember anyones number.

## Explanation
You provide the data and the password via environment variables, the data is encrypted with the password and written to a binary file. The binary file is distributed as part of the bundle. The app is just a form that takes a password, uses it to decrypt the file and displays the data.

## Deployment
You can deploy to any SPA host like Netlify or CloudFlare Workers. Just provide the following environment variables at build time:
 - `SECRET_DATA` - the data to encrypt and store
 - `SECRET_PASSWORD` - the password to encrypt toe data with

### Cloudflare
Click the link and add the required variables to "Build variables" under advanced settings.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/enwtn/databox)

