import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];
  unreadCount: number = 0;
  userId: string;
  private userSub: Subscription;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.userId = user._id;
      this.loadNotifications();
    });
  }

  loadNotifications(): void {
    if (!this.userId) return;

    this.notificationService.getNotifications(this.userId).subscribe(
      (response) => {
        this.notifications = response.notifications || [];
        this.updateUnreadCount();
      },
      (error) => {
        console.error('Error loading notifications:', error);
      }
    );
  }

  updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(notification => !notification.isRead).length;
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      this.loadNotifications();
    });
  }

  deleteNotification(notificationId: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this notification?');
    if (confirmed) {
      this.notificationService.deleteNotification(notificationId).subscribe(() => {
        this.loadNotifications();
      });
    }
  }

  deleteAllNotifications(): void {
    const confirmed = window.confirm('Are you sure you want to delete all the notifications?');
    if (confirmed) {
      this.notificationService.deleteAllNotifications(this.userId).subscribe(() => {
        this.loadNotifications();
      });
    }
  }
}
