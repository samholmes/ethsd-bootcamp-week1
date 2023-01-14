## ETH SD Bootcamp Week 1

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

This project achieves the goal of using a locally constructed signature to verify
the spending of funds to the server. It accomplishes this using a prompt to the user for a passphrase which is then hashed and used as a seed for a new private key.
The private key immediately signs the transaction and sends it to the server.
Never is there a private key held in long-term memory (RAM).

Humans are bad at random entropy, so a generator tool is provided which uses 5
words from a BIP39 mnemonic phrase and passes this to ChatGPT in order to construct
and new mnemonic that is actually memorable.

Improvements needed: Use a KDF function on the passphrase.

### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `npm run dev` to start the server 

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.

### Generator

The generator is a separate server which the client is meant to run and connect to in order to generate unique phrases for addresses. To run it follow the steps:

1. Open the terminal within the `server/` folder
2. Run `npm install` to install all dependencies
2. Add a `.env` file with ChatGPT login credentials
    1. Create a new file named `.env` and open it in editor
    2. Add the following config:`OPENAI_EMAIL=<email address>;OPENAI_PASSWORD=<password>`
3. Run `npm run generator` (or `npx tsx generate.ts`)

This will start an program and launch a chrome browser window to ChatGPT.
It'll automatically log-in, but any captchas must be completed manually.
Once logged in, it'll minimize the window. You can then use the generator in the
command line by pressing `Enter`/`Return` to generate now phrases, or you can
generate phrases from the web client interface.