import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateCurrentUser,
  updateProfile,
} from 'firebase/auth';
import { from } from 'rxjs';

import { getUserRole } from 'src/app/utils/util';
import { environment } from 'src/environments/environment';

const auth = getAuth(initializeApp(environment.firebase));

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
  // eslint-disable-next-line 
  signIn(credentials: ISignInCredentials) {
    return signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then(({ user }) => {
        return user;
      });
  }

  signOut = () => from(signOut(auth));

  // eslint-disable-next-line 
  register(credentials: ICreateCredentials) {
    return createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then(async ({ user }) => {
        await updateProfile(user, {
          displayName: credentials.displayName,
        });
        await updateCurrentUser(auth, user);
        return user;
      });
  }

  // eslint-disable-next-line 
  sendPasswordEmail(email) {
    return sendPasswordResetEmail(auth, email).then(() => {
      return true;
    });
  }

  // eslint-disable-next-line 
  resetPassword(credentials: IPasswordReset) {
    return confirmPasswordReset(auth, credentials.code, credentials.newPassword)
      .then((data) => {
        return data;
      });
  }

  // eslint-disable-next-line
  async getUser() {
    const u = auth.currentUser;
    return { ...u, role: getUserRole() };
  }
}
