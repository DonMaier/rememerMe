import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingListItemPage } from './shopping-list-item.page';

const routes: Routes = [
  {
    path: '',
    component: ShoppingListItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingListItemPageRoutingModule {}
