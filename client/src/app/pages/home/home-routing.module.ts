import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import {ShoppingListPage} from "../shopping-list/shopping-list.page";

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'shopping-list',
    component: ShoppingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
