import * as admin from "firebase-admin";

export interface IFirebaseUsuarioCriar {
  uid?: string;
  email: string;
  password: string;
  displayName: string;
}

export interface IFirebaseUsuarioAlterar {
  email?: string;
  password?: string;
  displayName?: string;
}

class FirebaseModel {
  /**
   * Cria usuário no firebase
   * @param dados 
   */
  criarUsuario(dados: IFirebaseUsuarioCriar): Promise<any> {
    return new Promise((resolve, reject) => {
      admin
        .auth()
        .createUser(dados)
        .then((userRecord) => {
          resolve(userRecord);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }

  // Altera usuário no firebase
  alterarUsuario(idUsuario: string, dados: IFirebaseUsuarioAlterar): Promise<any> {
    return new Promise((resolve, reject) => {
      admin
        .auth()
        .updateUser(idUsuario, dados)
        .then((userRecord) => {
          resolve(userRecord);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }

  /**
   * Exclui um usuário do firebase
   * @param idUsuario 
   */
  excluirUsuario(idUsuario: string): Promise<void>{
    return new Promise((res, rej) => {
      admin
        .auth()
        .deleteUser(idUsuario)
        .then(() => {
          res();
        })
        .catch((error) => {
          rej(error);
        });
    });
  }

  /**
   * Vefifica token de login
   * @param token 
   */
  verificaToken(token): Promise<any> {
    return new Promise((resolve, reject) => {
      admin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
          resolve(decodedToken);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }
  
  /**
   * Cria token customizado para um id de usuário
   * @param userId 
   * @param dados 
   */
  criarCustomToken(userId: string, dados = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      admin
        .auth()
        .createCustomToken(userId, dados)
        .then((customToken) => {
          resolve(customToken);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }

  /**
   * Busca usuário no firebase por id
   * @param id 
   */
  buscarUsuarioPorId(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      admin
        .auth()
        .getUser(id)
        .then((userRecord) => {
          resolve(userRecord);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }

  /**
   * Busca usuário no firebase por e-mail
   * @param email 
   */
  buscarUsuarioPorEmail(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      admin
        .auth()
        .getUserByEmail(email)
        .then((userRecord) => {
          resolve(userRecord);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }
}

const firebaseModel = new FirebaseModel();
export default firebaseModel;
