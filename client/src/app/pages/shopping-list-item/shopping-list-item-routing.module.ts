import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingListItemPage } from './shopping-list-item.page';

const routes: Routes = [
  {
    path: '',
    component: ShoppingListItemPage,
  },
  {
    path: 'details/:id',
    loadChildren: () => import('../../pages/shopping-list-item-details/shopping-list-item-details.module').then(m => m.ShoppingListItemDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingListItemPageRoutingModule {}
