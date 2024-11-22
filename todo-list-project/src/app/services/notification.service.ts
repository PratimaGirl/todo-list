import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'http://localhost:5000/api/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  createNotification(
    userId: string,
    message: string,
    type: string
  ): Observable<any> {
    return this.http.post(this.apiUrl, { userId, message, type });
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${notificationId}`, {
      isRead: true,
    });
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${notificationId}`);
  }

  deleteAllNotifications(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/all/${userId}`);
  }
}
