import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  unreadCount: number = 0;
  private userSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.authService.autoLogin();
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.loadUnreadNotifications();
    });
  }

  loadUnreadNotifications(): void {
    if (this.isAuthenticated) {
      this.notificationService.getNotifications(this.authService.user.value._id).subscribe(
        (response) => {
          const notifications = response.notifications || [];
          this.unreadCount = notifications.filter(notification => !notification.isRead).length;
        },
        (error) => {
          console.error('Error loading notifications:', error);
        }
      );
    }
  }

  onLogout() {
    this.authService.logout();
  }

  newNotifications() {
    this.router.navigate(['/notifications']);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
