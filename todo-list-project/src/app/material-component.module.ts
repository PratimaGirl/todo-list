import { NgModule } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule } from '@angular/material/paginator';
import {MatTabsModule } from '@angular/material/tabs';
import {MatFormFieldModule } from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [],
  
  exports:[
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatBadgeModule
  ]
})
export class MaterialComponentsModule { }
