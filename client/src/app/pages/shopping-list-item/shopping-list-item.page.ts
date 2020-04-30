import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ShoppingListItem} from "../../models/shopping-list-item";
import {ShoppingListItemService} from "../../services/shopping-list-item.service";
import {ActivatedRoute} from "@angular/router";
import {ShoppingList} from "../../models/shopping-list";
import {IonInput} from "@ionic/angular";


@Component({
    selector: 'app-shopping-list-items',
    templateUrl: './shopping-list-item.page.html',
    styleUrls: ['./shopping-list-item.page.scss'],
})
export class ShoppingListItemPage implements OnInit {

    newItemAdded = false;
    shoppingListItems: ShoppingListItem[] = [];
    shoppingListId;
    tempListItem = new ShoppingListItem(null, '', '', '', this.shoppingListId);
    @ViewChildren(IonInput) inputs: QueryList<IonInput>;

    constructor(private listItemService: ShoppingListItemService,
                private route: ActivatedRoute) {
    }

    async ngOnInit() {
        console.log('shoppingListItem loaded');
        this.shoppingListId = this.route.snapshot.params['id'];
        this.shoppingListItems = await this.listItemService.getListItemsById(this.shoppingListId);
    }

    ngAfterViewInit(): void {
        this.inputs.changes
            .subscribe((input) => {
                if(this.newItemAdded) {
                    setTimeout(async (args) => {
                        // Keyboard.show() // for android

                        await this.inputs.last.setFocus();
                    },150); //a least 150ms.
                }
            })
    }

    async saveOrUpdateOrDeleteListItem(listItem: ShoppingListItem) {
        console.log('method \'saveOrUpdateOrDeleteListItem\' called.');

        if (listItem.shoppingListItemId == 0) {
            if (listItem.title.length == 0) {
                let item = this.shoppingListItems.pop();
                console.log('deleted item: ', JSON.stringify(item));
                return;
            }
            try {
                let result = await this.listItemService.saveListItem(listItem);
                console.log('post returned id: ', result.body['shopping_list_item_id']);
                listItem.shoppingListItemId = result.body['shopping_list_item_id'];
            } catch (error) {
                console.log('saveList: error: ', error);
            } finally {

            }
        } else {

            if (listItem.title != this.tempListItem.title) {


                if (listItem.title.length == 0) {
                    console.log('title.length == 0 ---> delete shoppingListItemId: ', listItem.shoppingListItemId);
                    await this.deleteItemById(listItem.shoppingListItemId);
                } else {
                    await this.listItemService.updateListItem(listItem);
                }
            }
        }
    }

    async deleteItemById(itemId: number) {
        // let result = await this.shoppingListService.deleteListById(listId);
        try {
            await this.listItemService.deleteItemById(itemId);
            let removeIndex = this.shoppingListItems.map(function (item) {
                return item.shoppingListItemId;
            }).indexOf(itemId);
            console.log('davor: ', this.shoppingListItems.length);
            console.log('removeIndex: ', removeIndex);
            this.shoppingListItems.splice(removeIndex, 1);
            console.log('danach: ', this.shoppingListItems.length);
        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    addItemToList() {

        if(!this.newItemAdded) {
            console.log('addList');
            this.shoppingListItems.push(new ShoppingListItem(0, '', '', '', this.shoppingListId));
            this.newItemAdded = true;
        } else {
            this.newItemAdded = false;
        }
    }

    setTempListItem(item: ShoppingListItem) {
        this.tempListItem.title = item.title;
    }

}
