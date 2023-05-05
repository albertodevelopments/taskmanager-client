/** Angular core */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

/** App imports */
import { MessagesRoutingModule, MessagesComponent } from '@modules/messages'
import { SharedModule } from '@shared/index'

@NgModule({
  declarations: [MessagesComponent],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    SharedModule
  ],
  exports: [
    MessagesComponent
  ]
})
export class MessagesModule { }
