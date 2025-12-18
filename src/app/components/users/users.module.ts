import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';

// NG-ZORRO imports
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
    declarations: [
        UserListComponent
    ],
    imports: [
        CommonModule,
        UsersRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NzTableModule,
        NzButtonModule,
        NzCardModule,
        NzTagModule,
        NzIconModule,
        NzModalModule,
        NzFormModule,
        NzInputModule,
        NzSelectModule,
        NzMessageModule,
        NzPopconfirmModule,
        NzPageHeaderModule,
        NzSpaceModule
    ]
})
export class UsersModule { }
