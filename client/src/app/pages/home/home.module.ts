import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import {ShoppingListPageModule} from "../shopping-list/shopping-list.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        ShoppingListPageModule,
        TranslateModule
    ],
    exports: [
        HomePage
    ],
    declarations: [HomePage]
})
export class HomePageModule {}
