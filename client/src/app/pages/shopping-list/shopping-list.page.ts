import {Component, OnInit} from '@angular/core';
import {ShoppingList} from "../../models/shopping-list";
import {ShoppingListService} from "../../services/shopping-list.service";
import {Plugins, KeyboardInfo, Capacitor} from '@capacitor/core';
const { Keyboard } = Plugins;

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.page.html',
    styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {

    showAddPanel = false;
    shoppingLists: ShoppingList[] = [];
    newShoppingList: ShoppingList;

    constructor(private shoppingListService: ShoppingListService) {
    }

    async ngOnInit() {
        this.shoppingLists = await this.shoppingListService.getShoppingLists();
        this.newShoppingList = new ShoppingList(null, '', '');
        console.log(this.shoppingLists);
    }

    async saveList() {
        console.log('method \'saveList\' called.');

        if(this.newShoppingList.title.length == 0) {
            this.showAddPanel = false;
            return;
        }

        try {
            let result = await this.shoppingListService.saveShoppingList(this.newShoppingList);
            console.log('post returned id: ', result.body['shopping_list_id']);
            let shoppingList = new ShoppingList(result.body['shopping_list_id'], this.newShoppingList.title, '');
            this.shoppingLists.push(shoppingList);
        } catch (error) {

            console.log('saveList: error: ', error);
        } finally {
            this.newShoppingList = new ShoppingList(null, '','');
        }

    }

    async deleteListById(listId: number) {
            // let result = await this.shoppingListService.deleteListById(listId);
        try {
            await this.shoppingListService.deleteListById(listId);
            let removeIndex = this.shoppingLists.map(function(item) { return item.shoppingListId; }).indexOf(listId);
            console.log('davor ' , this.shoppingLists.length);
            console.log('removeIndex: ', removeIndex);
            this.shoppingLists.splice(removeIndex,1);
            console.log('danach ' , this.shoppingLists.length);
        }
           catch (error) {
            console.log(error);
           } finally {

        }
    }

    openKeyBoard() {
        let Keyboard;
        if (Capacitor.platform !== "web") {
            Keyboard = Plugins.Keyboard
            Keyboard.show();
        }

    }

}
