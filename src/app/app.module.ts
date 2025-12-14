import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// NG-ZORRO imports
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import {
  UserOutline,
  PlusOutline,
  CloseOutline,
  SaveOutline,
  ShoppingCartOutline,
  FileTextOutline,
  DeleteOutline,
  CheckCircleOutline,
  EditOutline,
  HistoryOutline,
  EnvironmentOutline,
  TeamOutline,
  FileAddOutline,
  ShoppingOutline,
  SearchOutline,
  DownloadOutline,
  ArrowLeftOutline
} from '@ant-design/icons-angular/icons';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

const icons = [
  UserOutline,
  PlusOutline,
  CloseOutline,
  SaveOutline,
  ShoppingCartOutline,
  FileTextOutline,
  DeleteOutline,
  CheckCircleOutline,
  EditOutline,
  HistoryOutline,
  EnvironmentOutline,
  TeamOutline,
  FileAddOutline,
  ShoppingOutline,
  SearchOutline,
  DownloadOutline,
  ArrowLeftOutline
];

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    InventoryComponent,
    AnalyticsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzTableModule,
    NzCardModule,
    NzSelectModule,
    NzInputNumberModule,
    NzMessageModule,
    NzModalModule,
    NzGridModule,
    NzIconModule,
    NzStatisticModule,
    NzDividerModule,
    NzSpaceModule,
    NzTagModule,
    NzBadgeModule,
    NzDropDownModule,
    NzDatePickerModule,
    NzToolTipModule,

  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
