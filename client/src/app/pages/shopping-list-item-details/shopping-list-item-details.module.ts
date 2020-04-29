import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingListItemDetailsPageRoutingModule } from './shopping-list-item-details-routing.module';

import { ShoppingListItemDetailsPage } from './shopping-list-item-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShoppingListItemDetailsPageRoutingModule
  ],
  declarations: [ShoppingListItemDetailsPage]
})
export class ShoppingListItemDetailsPageModule {}
