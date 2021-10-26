import { Request, Response } from "express";
import firebaseModel from "../models/firebasemodel";
import { IUsuario } from "../models/usuariomodel";

const autenticacaoMiddleware = async (req: Request, res: Response, next: any) => {
    const authHeader = req.headers.authorization;

    // Verifico se token foi enviado
    if (!authHeader) {
        return res.status(401).send({error: 'Token não informado'});
    }

    // Verifico se token foi possui duas partes
    const partes = authHeader.split(' ');

    if (partes.length != 2) {
        return res.status(401).send({error: 'Token com formatação incorreta'});
    }

    // Verifico se é um token válido
    const [ scheme, token ] = partes;

    if (!/^Bearer$/i.test(scheme)){
        return res.status(401).send({error: 'Token com formatação incorreta'});
    }
    
    // Verifico token
    firebaseModel.verificaToken(token).then((tokenDecoded) => {
        // Crio objeto de usuário com dados do token
        const usuario: IUsuario = {
            id: tokenDecoded.user_id,
            nome: tokenDecoded.name,
            email: tokenDecoded.email
        };
        // Adiciono dados do usuário a requisição
        (<any>req).usuario = usuario;
        
        return next();
    }).catch((err) => {
        return res.status(401).send({ 
            error: 'Token inválido'
        });
    });
}

export { autenticacaoMiddleware }