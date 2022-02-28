import { Router, Request, Response } from 'express';
import { IUsuario, usuarioModel } from '../models/usuariomodel';
import bcrypt from 'bcryptjs';
import { autenticacaoMiddleware } from '../middlewares/autenticacaomiddleware';
import firebaseModel from '../models/firebasemodel';
import bancoDados from '../database';
import { validarCEP, validarCPF, validarEmail, validarPIS } from '../utils';
import { enderecoModel, IEndereco } from '../models/enderecomodel';
import uuid from 'node-uuid';
import { IPet, petModel } from '../models/petmodel';

class PetController {

    /**
     * Define as rotas utilizadas pelo controller
     * @param router 
     */
    public definirRotas(router: Router){
        router.get('/meus-pets', autenticacaoMiddleware, (req, res) => {
            this.listar(req, res);
        });
        router.get('/meus-pets/:id', autenticacaoMiddleware, (req, res) => {
            this.buscar(req, res);
        });
        router.post('/meus-pets', autenticacaoMiddleware, (req, res) => {
            this.criar(req, res);
        });
        router.patch('/meus-pets/:id', autenticacaoMiddleware, (req, res) => {
            this.alterar(req, res);
        });
        router.delete('/meus-pets/:id', autenticacaoMiddleware, (req, res) => {
            this.excluir(req, res);
        });
    }

    /**
     * Realiza a listagem de pets do usuário
     * @param req 
     * @param res 
     */
    public async listar(req: Request, res: Response) {
        try {
            const usuarioReq: IUsuario = (<any>req).usuario;

            // Busco lista de pets
            const pets = await petModel.listarPorUsuario(usuarioReq.id);
            
            return res.status(200).send(pets);
        } catch (error) {
            console.log("erro", error.message);
            return res.status(500).send({
                message: 'Ocorreu um erro ao buscar seus pets'
            });
        }
    }

    /**
     * Realiza busca de um pet
     * @param req 
     * @param res 
     */
    public async buscar(req: Request, res: Response) {
        try {
            const usuarioReq: IUsuario = (<any>req).usuario;

            // Valido se o usuário logado é o mesmo usuário da busca
            if (usuarioReq.id != req.params.id){
                return res.status(403).send({
                    message: 'Você não tem permissão para buscar este registro.'
                })
            }

            // Busco usuário pelo id
            const usuario = await usuarioModel.buscar(req.params.id);
            
            // Busco endereço do usuário
            if (usuario != null) {
                if (usuario.id_endereco != null) {
                    usuario.objs = {
                        endereco: null
                    }
                    usuario.objs.endereco = await enderecoModel.buscar(usuario.id_endereco);
                }

                // Removo senha do retorno
                delete usuario.senha;

                return res.status(200).send(usuario);
            } else {
                return res.status(404).send({
                    message: 'Usuário não encontrado.'
                })
            }
        } catch (error) {
            return res.status(500).send({
                message: 'Ocorreu um erro ao buscar usuário'
            });
        }
    }

    /**
     * Realiza atualização do pet
     * @param req 
     * @param res 
     */
    public async alterar(req: Request, res: Response) {
        try {
            const usuarioReq: IUsuario = (<any>req).usuario;

            // Valido se o usuário logado é o mesmo usuário a ser alterado
            if (usuarioReq.id != req.params.id){
                return res.status(403).send({
                    message: 'Você não tem permissão para alterar este registro.'
                })
            }

            // Busco usuário atual
            const usuario = await usuarioModel.buscar(usuarioReq.id);

            // Pego dados da requisição
            let { 
                nome, senha, senhaatual, email, cpf, pis, endereco 
            } = req.body;

            // Defino variáveis de controle de alteração
            /**
             * True quando for modificar qualquer informação do usuário
             */
            let alterarUsuario = false;
            /**
             * Objeto de usuário utilizado na atualização
             */
            let usuarioAlterar: IUsuario = {
                id: usuarioReq.id
            };
            /**
             * True quando for modificar alguma informação do usuário no firebase
             * E-mail, nome e/ou senha
             */
            let alterarUsuarioFirebase = false;
            /**
             * True quando for modificar/criar o endereço do usuário
             */
            let alterarEndereco = false;
            /**
             * Objeto de endereço utilizado na atualização/criação
             */
            let enderecoAlterar: IEndereco = {};

            // Valido nome
            if (nome) {
                nome = nome.trim();
                if (nome != usuario.nome) {
                    if (nome.length < 2) {
                        return res.status(400).send({
                            message: 'Nome deve ter pelo menos 2 caracteres.'
                        });
                    }

                    if (nome.length > 50) {
                        return res.status(400).send({
                            message: 'Nome deve até 50 caracteres.'
                        });
                    }
    
                    usuarioAlterar.nome = nome;
                    alterarUsuario = true;
                    alterarUsuarioFirebase = true;
                }
            }

            // Valido senha
            if (senha) {
                senha = senha.trim();

                if (!senhaatual) {
                    return res.status(400).send({
                        message: 'Senha atual deve ser informada.'
                    });
                }

                if (senha == senhaatual) {
                    return res.status(400).send({
                        message: 'Nova senha deve ser diferente da atual'
                    });
                }

                if (senha.length > 12) {
                    return res.status(400).send({
                        message: 'Senha deve até 12 caracteres.'
                    });
                }

                if (senha.length < 6) {
                    return res.status(400).send({
                        message: 'Senha deve ter pelo menos 6 caracteres.'
                    });
                }

                // Se a senha for diferente da atual
                if (!await bcrypt.compare(senha, usuario.senha)) {
                    if (!await bcrypt.compare(senhaatual, usuario.senha)) {
                        return res.status(400).send({
                            message: 'Senha atual incorreta.'
                        });
                    }
    
                    usuarioAlterar.senha = await bcrypt.hash(senha, 10);
                    alterarUsuario = true;
                    alterarUsuarioFirebase = true;
                } else {
                    return res.status(400).send({
                        message: 'Nova senha deve ser diferente da atual.'
                    });
                }
            }
            
            // Valido e-mail
            if (email) {
                email = email.trim();

                if (email != usuario.email) {
                    if (email.length > 50) {
                        return res.status(400).send({
                            message: 'E-mail deve até 50 caracteres.'
                        });
                    }

                    if (!validarEmail(email)) {
                        return res.status(400).send({
                            message: 'E-mail inválido.'
                        });
                    }
    
                    // Verifico se e-mail já está em uso
                    try {
                        await firebaseModel.buscarUsuarioPorEmail(email);
    
                        return res.status(400).send({
                            message: "Já existe uma conta com esse endereço de e-mail"
                        });
                    } catch (error) {}
    
                    usuarioAlterar.email = email;
                    alterarUsuario = true;
                    alterarUsuarioFirebase = true;
                }
            }

            // Valido CPF
            if (cpf != null) {
                cpf = cpf.trim();

                if (cpf != usuario.cpf) {
                    if (cpf != '' && !validarCPF(cpf)) {
                        return res.status(400).send({
                            message: 'CPF inválido.'
                        });
                    }
    
                    // Verifico se já existe alguém com esse CPF
                    const usuarioCpf = await usuarioModel.buscarPorCpf(cpf);
                    if (usuarioCpf != null && usuario.id != usuarioCpf.id) {
                        return res.status(400).send({
                            message: 'Já existe uma conta utilizando esse CPF.'
                        });
                    }
    
                    usuarioAlterar.cpf = cpf;
                    alterarUsuario = true;
                }
            }

            // Valido PIS
            if (pis != null) {
                if (pis != usuario.pis) {
                    if (pis != '' && !validarPIS(pis)) {
                        return res.status(400).send({
                            message: 'PIS inválido.'
                        });
                    }
    
                    // Verifico se já existe alguém com esse PIS
                    const usuarioPIS = await usuarioModel.buscarPorPis(pis);
                    if (usuarioPIS != null && usuario.id != usuarioPIS.id) {
                        return res.status(400).send({
                            message: 'Já existe uma conta utilizando esse PIS.'
                        });
                    }
    
                    usuarioAlterar.pis = pis;
                    alterarUsuario = true;
                }
            }

            // Valido Endereço
            if (endereco) {
                let enderecoUsuario: IEndereco = {};

                if (usuario.id_endereco != null) {
                    enderecoUsuario = await enderecoModel.buscar(usuario.id_endereco);
                    enderecoAlterar.id = usuario.id_endereco;
                } else {
                    // Se não possui endereço, valido obrigatoriedade dos campos
                    if (!endereco.pais) {
                        return res.status(400).send({
                            message: 'País deve ser informado.'
                        });
                    }
                    if (!endereco.estado) {
                        return res.status(400).send({
                            message: 'UF deve ser informado.'
                        });
                    }
                    if (!endereco.municipio) {
                        return res.status(400).send({
                            message: 'Município deve ser informado.'
                        });
                    }
                    if (!endereco.cep) {
                        return res.status(400).send({
                            message: 'CEP deve ser informado.'
                        });
                    }
                    if (!endereco.rua) {
                        return res.status(400).send({
                            message: 'Rua deve ser informada.'
                        });
                    }
                    if (!endereco.numero) {
                        return res.status(400).send({
                            message: 'Numero deve ser informado.'
                        });
                    }
                }

                // Valido País
                if (
                    endereco.pais
                    && !(usuario.id_endereco != null && endereco.pais == enderecoUsuario.pais)    
                ) {
                    if (endereco.pais.length < 3) {
                        return res.status(400).send({
                            message: 'País deve ter pelo menos 3 caracteres.'
                        });
                    }

                    if (endereco.pais.length > 50) {
                        return res.status(400).send({
                            message: 'País deve ter no máximo 50 caracteres.'
                        });
                    }

                    enderecoAlterar.pais = endereco.pais;
                    alterarEndereco = true;
                }

                // Valido Estado
                if (
                    endereco.estado
                    && !(usuario.id_endereco != null && endereco.estado == enderecoUsuario.estado)    
                ) {
                    if (endereco.estado.length != 2) {
                        return res.status(400).send({
                            message: 'UF deve ter 2 caracteres.'
                        });
                    }

                    enderecoAlterar.estado = endereco.estado;
                    alterarEndereco = true;
                }

                // Valido Municipio
                if (
                    endereco.municipio
                    && !(usuario.id_endereco != null && endereco.municipio == enderecoUsuario.municipio)    
                ) {
                    if (endereco.municipio.length < 3) {
                        return res.status(400).send({
                            message: 'Municipio deve ter pelo menos 3 caracteres.'
                        });
                    }

                    if (endereco.municipio.length > 50) {
                        return res.status(400).send({
                            message: 'Municipio deve ter no máximo 50 caracteres.'
                        });
                    }

                    enderecoAlterar.municipio = endereco.municipio;
                    alterarEndereco = true;
                }

                // Valido Cep
                if (
                    endereco.cep
                    && !(usuario.id_endereco != null && endereco.cep == enderecoUsuario.cep)    
                ) {
                    if (!validarCEP(endereco.cep)) {
                        return res.status(400).send({
                            message: 'CEP inválido.'
                        });
                    }

                    enderecoAlterar.cep = endereco.cep;
                    alterarEndereco = true;
                }
                
                // Valido Rua
                if (
                    endereco.rua
                    && !(usuario.id_endereco != null && endereco.rua == enderecoUsuario.rua)    
                ) {
                    if (endereco.rua.length < 3) {
                        return res.status(400).send({
                            message: 'Rua deve ter pelo menos 3 caracteres.'
                        });
                    }

                    if (endereco.rua.length > 50) {
                        return res.status(400).send({
                            message: 'Rua deve ter no máximo 50 caracteres.'
                        });
                    }

                    enderecoAlterar.rua = endereco.rua;
                    alterarEndereco = true;
                }

                // Valido Numero
                if (
                    endereco.numero
                    && !(usuario.id_endereco != null && endereco.numero == enderecoUsuario.numero)    
                ) {
                    if (endereco.numero.length < 1) {
                        return res.status(400).send({
                            message: 'Número deve ter pelo menos 1 caractere.'
                        });
                    }

                    if (endereco.numero.length > 20) {
                        return res.status(400).send({
                            message: 'Número deve ter no máximo 20 caracteres.'
                        });
                    }

                    enderecoAlterar.numero = endereco.numero;
                    alterarEndereco = true;
                }

                // Valido Complemento
                if (
                    endereco.complemento
                    && !(usuario.id_endereco != null && endereco.complemento == enderecoUsuario.complemento)    
                ) {
                    if (endereco.complemento.length < 3) {
                        return res.status(400).send({
                            message: 'Complemento deve ter pelo menos 3 caracteres.'
                        });
                    }

                    if (endereco.complemento.length > 50) {
                        return res.status(400).send({
                            message: 'Complemento deve ter no máximo 50 caracteres.'
                        });
                    }

                    enderecoAlterar.complemento = endereco.complemento;
                    alterarEndereco = true;
                }

                // Se o endereço for ser criado, preciso alterar o usuário para atualizar id do endereço
                if (alterarEndereco && usuario.id_endereco == null) {
                    alterarUsuario = true;
                }
            }
            
            // Se alguma alteração será feita
            if (alterarUsuario || alterarEndereco) {
                // Inicio transação
                const [transactionId] = await bancoDados.initTransaction();
                
                try {
                    let criandoEndereco = false;
                    // Se existem alterações a fazer no endereço
                    if (alterarEndereco) {
                        // Se endereço existe
                        if (usuario.id_endereco != null) {
                            await enderecoModel.alterar(enderecoAlterar);
                        } else {
                            // Crio endereço
                            enderecoAlterar.id = uuid.v4();
                            await enderecoModel.criar(enderecoAlterar);
                            // Seto id do endereço no usuário
                            usuarioAlterar.id_endereco = enderecoAlterar.id;
                            criandoEndereco = true;
                        }
                    }

                    // Se existem alterações a fazer no usuário
                    if (alterarUsuario) {
                        await usuarioModel.alterar(usuarioAlterar);
                    }

                    // Se existem alterações a fazer no usuário do Firebase
                    if (alterarUsuarioFirebase) {
                        let usuarioFirebaseAtualizar: any = {};
                        if (usuarioAlterar.email) {
                            usuarioFirebaseAtualizar.email = email;
                        }
                        if (usuarioAlterar.senha) {
                            usuarioFirebaseAtualizar.password = senha;
                        }
                        if (usuarioAlterar.nome) {
                            usuarioFirebaseAtualizar.displayName = nome;
                        }
                        firebaseModel.alterarUsuario(usuario.id, usuarioFirebaseAtualizar);
                    }

                    // Salvo transação
                    await bancoDados.commitTransaction(transactionId);

                    // Se criou endereço, retorno novo id
                    if (criandoEndereco) {
                        return res.status(201).send({
                            id_endereco: usuarioAlterar.id_endereco
                        })
                    }

                    return res.status(204).send();
                } catch (error) {
                    await bancoDados.rollbackTransaction(transactionId);

                    throw error;
                }
            }

            return res.status(204).send();            
        } catch (error) {
            return res.status(500).send({
                message: 'Ocorreu um erro ao atualizar usuário'
            });
        }
    }

    /**
     * Realiza cadastro do pet
     * @param req 
     * @param res 
     */
    public async criar(req: Request, res: Response) {
        try {
            // Pego dados da requisição
            const { nome, nascimento, porte, sexo, especie, raca  } = req.body;
            const usuarioReq: IUsuario = (<any>req).usuario;

            // Valido nome
            if (!nome) {
                return res.status(400).send({
                    message: 'Nome não preenchido.'
                });
            }

            if (nome.length < 2) {
                return res.status(400).send({
                    message: 'Nome deve ter pelo menos 2 caracteres.'
                });
            }

            if (nome.length > 50) {
                return res.status(400).send({
                    message: 'Nome deve até 50 caracteres.'
                });
            }

            const [transactionId] = await bancoDados.initTransaction();
            
            try {
                // Crio pet no banco de dados
                const pet: IPet = {
                    nome,
                    nascimento: new Date(nascimento),
                    porte,
                    sexo,
                    especie,
                    raca,
                    id_usuario: usuarioReq.id
                }
                pet.id = uuid.v4();

                await petModel.criar(pet);

                await bancoDados.commitTransaction(transactionId);

                // Retorno token
                return res.status(201).send({
                    pet
                });
            } catch (error) {
                await bancoDados.rollbackTransaction(transactionId);

                throw error;
            }
        } catch (error) {
            return res.status(500).send({
                message: 'Ocorreu um erro ao cadastrar pet',
                error
            });
        }
    }

    /**
     * Realiza exclusão de um pet
     * @param req 
     * @param res 
     */
    public async excluir(req: Request, res: Response) {
        try {
            const usuarioReq: IUsuario = (<any>req).usuario;

            // Valido se o usuário logado é o mesmo usuário da busca
            if (usuarioReq.id != req.params.id){
                return res.status(403).send({
                    message: 'Você não tem permissão para excluir este registro.'
                })
            }

            // Busco usuário pelo id
            const usuario = await usuarioModel.buscar(req.params.id);
            
            // Se usuário existe
            if (usuario != null) {
                // Inicio transação
                const [transactionId] = await bancoDados.initTransaction();
                
                try {
                    // Excluo usuário
                    await usuarioModel.excluir(usuario.id);

                    // Excluo endereço do usuário
                    if (usuario.id_endereco != null) {
                        await enderecoModel.excluir(usuario.id_endereco);
                    }

                    // Excluo usuário do Firebase
                    firebaseModel.excluirUsuario(usuario.id);

                    // Salvo transação
                    await bancoDados.commitTransaction(transactionId);

                    return res.status(204).send();
                } catch (error) {
                    await bancoDados.rollbackTransaction(transactionId);

                    throw error;
                }
            } else {
                return res.status(404).send({
                    message: 'Usuário não encontrado.'
                })
            }
        } catch (error) {
            return res.status(500).send({
                message: 'Ocorreu um erro ao excluir usuário'
            });
        }
    }
}

const petCtrl = new PetController();
export { petCtrl };