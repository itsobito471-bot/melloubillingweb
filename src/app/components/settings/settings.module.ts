import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// NG-ZORRO
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzGridModule } from 'ng-zorro-antd/grid';

const routes: Routes = [
    { path: '', component: SettingsComponent }
];

@NgModule({
    declarations: [SettingsComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        NzCardModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzMessageModule,
        NzSpinModule,
        NzGridModule
    ]
})
export class SettingsModule { }
