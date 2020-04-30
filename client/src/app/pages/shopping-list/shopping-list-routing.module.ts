import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingListPage } from './shopping-list.page';

const routes: Routes = [
  {
    path: '',
    component: ShoppingListPage
  },
  {
    path: ':id',
    loadChildren: () =>
        import('../../pages/shopping-list-item/shopping-list-item.module').then(m => m.ShoppingListItemPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingListPageRoutingModule {}
