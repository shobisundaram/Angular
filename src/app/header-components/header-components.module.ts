import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponentsRoutingModule } from './header-components-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbButtonModule, NbCardModule, NbDialogModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeModule } from '../@theme/theme.module';
// import { HeaderComponentsComponent } from './header-components.component';


@NgModule({
  declarations: [
    // HeaderComponentsComponent
  ],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbTooltipModule,
    TranslateModule,
    ThemeModule,
    NbButtonModule,
    NbIconModule,
    NbDialogModule.forRoot(),
    // HeaderComponentsRoutingModule
  ],
  exports: [
    // other shared components
  ]
})
export class HeaderComponentsModule { }
