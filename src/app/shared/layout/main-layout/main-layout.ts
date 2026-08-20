import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
import { DashboardTabs } from '../dashboard-tabs/dashboard-tabs';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet,Sidebar,Topbar,DashboardTabs],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
    pageTitle = 'Environment 360';

}
