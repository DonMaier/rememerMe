import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ShoppingList} from "../../models/shopping-list";
import {ShoppingListService} from "../../services/shopping-list.service";
import {IonInput} from "@ionic/angular";



@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.page.html',
    styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {

    newListAdded = false;
    shoppingLists: ShoppingList[] = [];
    newShoppingList: ShoppingList;
    tempList = new ShoppingList(null, '', '');
    @ViewChildren(IonInput) inputs: QueryList<IonInput>;


    constructor(private shoppingListService: ShoppingListService) {
    }

    async ngOnInit() {

        this.shoppingLists = await this.shoppingListService.getShoppingLists();
        this.newShoppingList = new ShoppingList(null, '', '');
        console.log(this.shoppingLists);
    }

     ngAfterViewInit(): void {
        this.inputs.changes
            .subscribe((input) => {
                if(this.newListAdded) {
                    setTimeout(async (args) => {
                        // Keyboard.show() // for android

                        await this.inputs.last.setFocus();
                    },150); //a least 150ms.
                }
            })
    }

    async saveList() {
        console.log('method \'saveList\' called.');
0
        if (this.newShoppingList.title.length == 0) {
            return;
        }

        try {
            console.log('AHA!');
            let result = await this.shoppingListService.saveShoppingList(this.newShoppingList);
            console.log('post returned id: ', result.body['shopping_list_id']);
            let shoppingList = new ShoppingList(result.body['shopping_list_id'], this.newShoppingList.title, '');
            this.shoppingLists.push(shoppingList);
        } catch (error) {

            console.log('saveList: error: ', error);
        } finally {
            this.newShoppingList = new ShoppingList(null, '', '');
        }

    }

    async saveOrUpdateOrDeleteList(list: ShoppingList) {
        console.log('method \'saveOrUpdateOrDeleteList\' called.');
        console.log(this.shoppingLists);
        if (list.shoppingListId == 0) {
            if (list.title.length == 0) {
                let item = this.shoppingLists.pop();

                console.log('delete');
                console.log(this.shoppingLists);
                return;
            }
            try {
                let result = await this.shoppingListService.saveShoppingList(list);
                console.log('post returned id: ', result.body['shopping_list_item_id']);
                list.shoppingListId = result.body['shopping_list_id'];
            } catch (error) {
                console.log('saveList: error: ', error);
            } finally {

            }
        } else {
            if (list.title != this.tempList.title) {

                if (list.title.length == 0) {
                    console.log('title.length == 0 ---> delete shoppingListItemId: ', list.shoppingListId);
                    await this.deleteListById(list.shoppingListId);
                } else {
                    console.log('updateList');
                    await this.shoppingListService.updateList(list);
                }
            }
        }

    }


    async deleteListById(listId: number) {
        // let result = await this.shoppingListService.deleteListById(listId);
        try {
            await this.shoppingListService.deleteListById(listId);
            let removeIndex = this.shoppingLists.map(function (item) {
                return item.shoppingListId;
            }).indexOf(listId);
            console.log('davor ', this.shoppingLists.length);
            console.log('removeIndex: ', removeIndex);
            this.shoppingLists.splice(removeIndex, 1);
            console.log('danach ', this.shoppingLists.length);
        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    addList() {
        if(!this.newListAdded) {
            console.log('addList');
            this.shoppingLists.push(new ShoppingList(0, '', ''));
            console.log(this.shoppingLists);
            this.newListAdded = true;
        } else {
            this.newListAdded = false;
        }
    }

    // needed to check if listValues changed. If not, prevent update
    setTempList(list: ShoppingList) {
        this.tempList.title = list.title;
    }

}
