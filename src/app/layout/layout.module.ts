/** Angular core */
import { NgModule } from '@angular/core'
import { LayoutRoutingModule } from './layout-routing.module'

/** App imports */
import { LayoutComponent } from '@layout/pages/layout.component'
import { HeaderComponent } from './components/header/header.component'
import { FooterComponent } from './components/footer/footer.component'
import { MenuComponent } from './components/menu/menu.component'
import { SharedModule } from '@shared/shared.module'

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent
  ],
  imports: [
    SharedModule,
    LayoutRoutingModule
  ]
})
export class LayoutModule { }
