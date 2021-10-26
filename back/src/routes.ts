import { Router, Request, Response } from 'express';
import { usuarioCtrl } from './controllers/usuariocontroller';

const router = Router();

// Definição de rotas dos controllers
usuarioCtrl.definirRotas(router);

export { router }