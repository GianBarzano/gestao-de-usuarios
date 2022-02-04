import { Router, Request, Response } from 'express';
import { petCtrl } from './controllers/petcontroller';
import { usuarioCtrl } from './controllers/usuariocontroller';

const router = Router();

// Definição de rotas dos controllers
usuarioCtrl.definirRotas(router);
petCtrl.definirRotas(router);

export { router }