import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from } from 'rxjs';

import { getUserRole } from 'src/app/utils/util';

export interface ISignInCredentials {
  email: string;
  password: string;
}

export interface ICreateCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface IPasswordReset {
  code: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: AngularFireAuth) {}

  // eslint-disable-next-line 
  signIn(credentials: ISignInCredentials) {
    return this.auth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(({ user }) => {
        return user;
      });
  }

  signOut = () => from(this.auth.signOut());

  // eslint-disable-next-line 
  register(credentials: ICreateCredentials) {
    return this.auth
      .createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(async ({ user }) => {
        user.updateProfile({
          displayName: credentials.displayName,
        });
        this.auth.updateCurrentUser(user);
        return user;
      });
  }

  // eslint-disable-next-line 
  sendPasswordEmail(email) {
    return this.auth.sendPasswordResetEmail(email).then(() => {
      return true;
    });
  }

  // eslint-disable-next-line 
  resetPassword(credentials: IPasswordReset) {
    return this.auth
      .confirmPasswordReset(credentials.code, credentials.newPassword)
      .then((data) => {
        return data;
      });
  }

  // eslint-disable-next-line
  async getUser() {
    // Original code - restore once our own Firebase keys are added in environment files:
    // const u = await this.auth.currentUser;

    // Temporary: Firebase rejects when its config is empty; fall back to no Firebase user.
    const u = await this.auth.currentUser.catch(() => null);
    return { ...u, role: getUserRole() };
  }
}
