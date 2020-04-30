import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingListItemDetailsPage } from './shopping-list-item-details.page';

const routes: Routes = [
  {
    path: '',
    component: ShoppingListItemDetailsPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingListItemDetailsPageRoutingModule {}
