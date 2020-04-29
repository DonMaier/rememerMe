import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingListItemPageRoutingModule } from './shopping-list-item-routing.module';

import { ShoppingListItemPage } from './shopping-list-item.page';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShoppingListItemPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [ShoppingListItemPage]
})
export class ShoppingListItemPageModule {}
