import { Client, Pool } from 'pg';
import uuid from 'node-uuid';

// Monto configuração de acesso ao banco
let dbConfig: any = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
}

if (process.env.DATABASE_URL) {
    dbConfig = {
        connectionString: process.env.DATABASE_URL
    }
}

class Banco {
    private client: Client = null;
    private transacao = {
        id: '',
        iniciada: false
    };
    
    private pool: Pool = null;

    constructor(){}

    getPool(): Pool {
        if (!this.pool) {
            this.pool = new Pool(dbConfig)
        }

        return this.pool;
    }

    getClient(): Promise<Client> {
        return new Promise(async (res, rej) => {
            try {
                if (!this.client) {
                    this.client = await this.getPool().connect();
                }
    
                res(this.client);
            } catch (error) {
                rej(error);
            }
        });
    }

    releaseClient(): void{
        if (!this.transacao.iniciada) {
            // Libero conexão
            this.client.release(true);
            this.client = null;
        }
    }

    initTransaction(): Promise<[string, Client]>{
        return new Promise(async (res, rej) => {
            if (this.transacao.iniciada) {
                res([this.transacao.id, this.client]);
            } else {
                try {
                    // Abro conexão
                    this.client = await this.getPool().connect();
                    
                    try {
                        // Inicio transação
                        await this.client.query('BEGIN');

                        // Gero chave da transação
                        this.transacao.id = uuid.v4();
                        this.transacao.iniciada = true;
                        // Retorno chave e client
                        res([this.transacao.id, this.client]);
                    } catch (error) {
                        this.client.release();
                        rej('Erro ao iniciar transação');
                    }
                } catch (error) {
                    rej(error);
                }
            }
        });
    }

    commitTransaction(id: string): Promise<void>{
        return new Promise(async (res, rej) => {
            if (this.transacao.iniciada) {
                if (this.transacao.id == id) {
                    try {
                        // Salvo transação
                        await this.client.query('COMMIT');
                        res();
                    } catch (error) {
                        rej('Erro ao salvar transação');
                    } finally {
                        this.transacao.id = '';
                        this.transacao.iniciada = false;

                        // Libero conexão
                        this.releaseClient();
                    }
                } else {
                    res();
                }
            } else {
                rej('Transação não está aberta');
            }
        });
    }

    rollbackTransaction(id: string): Promise<void>{
        return new Promise(async (res, rej) => {
            if (this.transacao.iniciada) {
                if (this.transacao.id == id) {
                    try {
                        // Salvo transação
                        await this.client.query('ROLLBACK');
                        res();
                    } catch (error) {
                        rej('Erro ao cancelar transação');
                    } finally {
                        this.transacao.id = '';
                        this.transacao.iniciada = false;
                        // Libero conexão
                        this.releaseClient();
                    }
                } else {
                    res();
                }
            } else {
                rej('Transação não está aberta');
            }
        });
    }
}

let bancoDados: Banco = new Banco();

export default bancoDados;