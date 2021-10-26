import express from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';
// const cors = require('cors');

// import bodyParser from 'body-parser';
import firebaseConfig from './firebase';

import { router } from './routes';

class AppController {
    public express: any;

    constructor() {
        this.express = express();
        this.middlewares();
        this.routes();
        this.inicializarFirebase();
    }

    private middlewares() {
        this.express.use(cors());
        this.express.use(express.json());
    }

    private routes() {
        this.express.use(router);
    }

    private inicializarFirebase(){
        admin.initializeApp({
            credential: admin.credential.cert(<admin.ServiceAccount>firebaseConfig)
        });
    }
}
const app = new AppController().express;
export { app };