import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IServiceResponse } from 'src/app/data/service-response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';

export interface IChatContact {
  designation: any;
  id: number;
  title: string;
  img: string;
  date: string;
  firstName: string,
  lastName: string,
}

export interface IChatConversation {
  id: number;
  users: number[];
  lastMessageTime: string;
  date: string;
  messages: IChatMessage[];
}

export interface IChatMessage {
  sender: number;
  time: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  getMsg() {
    throw new Error('Method not implemented.');
  }
  selectConversation() {
    throw new Error('Method not implemented.');
  }

  private socket: Socket;
  private socket2: Socket;
  private url = environment.chatUrl; // your server local path

  constructor(private http: HttpClient) { }

  searchContacts(userId: number, searchKey: string): Observable<IChatContact[]> {
    const url = `${environment.apiUrl}/contacts?search=${searchKey}`;
    return this.http.get(url).pipe(
      map((res: IServiceResponse<IChatContact>) => {
        return res.data.map((c) => {
          return {
            ...c,
            img: c.img.replace('profile-pic-', 'profiles/'),
          };
        });
      }),
    );
  }

  getContacts(): Observable<IChatContact[]> {
    const url = `${environment.apiUrl}/contacts`;
    return this.http.get(url).pipe(
      map((res: IServiceResponse<IChatContact>) => {
        return res.data.map((c) => {
          return {
            ...c,
            img: c.img.replace('profile-pic-', 'profiles/'),
          };
        });
      }),
    );
  }
  getConversations(userId: number): Observable<IChatConversation[]> {
    const url = `${environment.apiUrl}/conversations`;
    return this.http.get(url).pipe(
      map((res: IServiceResponse<IChatConversation>) => {
        return res.data;
      }),
    );
  }

  connect() {
    // this.socket = io(this.url, { transports: ['websocket'] });
    this.socket = io(this.url, {
      query: {
        Authorization: localStorage.getItem('token'),
      },
    });
    this.socket.connect(); // Call the connect method from ngx-socket-io
    // You can perform additional logic here if needed
  }

  chatBotConnect() {
    this.socket2 = io(this.url, {
      query: {
        Authorization: localStorage.getItem('token'),
      },
    });
    this.socket.connect(); // Call the connect method from ngx-socket-io
    // You can perform additional logic here if needed
  }

  // Sign in to the socket
  signIn(id: any): void {
    this.socket.emit('signin', id);
  }

  // List sign in to the socket
  listSignIn(id: any): void {
    this.socket.emit('listSignin', id);
  }

  // Send a message to the socket
  sendMessage(message: any): void {
    this.socket.emit('message', message);
  }

  // Delete a message
  deleteMessage(msg: any): void {
    this.socket.emit('deleteMessage', msg);
  }

  // Listen for messages
  onMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });
    });
  }

  // Listen for deleteMessage events
  onDeleteMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('deleteMessage', (data: any) => {
        observer.next(data);
      });
    });
  }

  // Add more methods for other events as needed

  listDisconnect(): void {
    this.socket.emit('listDisconnect');
  }

  // Disconnect from the socket
  disconnect(): void {
    this.socket.disconnect();
  }

  // Method to emit custom event
  sendCustomEvent(eventName: string, data: any, responseTo: string, childEvent?: string): void {
    this.socket2.emit(eventName, { message: data, responseTo, childEvent });
  }

  // Method to listen for 'nestedEvent' from the server
  getNestedEvent(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket2.on('botEvent', (data: any) => {
        observer.next(data);
      });
    });
  }
}
