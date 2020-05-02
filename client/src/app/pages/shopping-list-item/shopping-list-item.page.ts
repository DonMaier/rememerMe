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

    isEditMode = false;
    oldListSize:number;
    shoppingListItems: ShoppingListItem[] = [];
    shoppingListId;
    selectedListItem = new ShoppingListItem(0, '', '', '', this.shoppingListId);
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
                if(this.inputs.length > this.oldListSize) {
                    setTimeout(async (args) => {
                        // console.log('event');
                        // Keyboard.show() // for android

                        await this.inputs.last.setFocus();
                    },150); //a least 150ms.
                }
                this.oldListSize = this.inputs.length;
            })
    }

    async saveUpdateOrDeleteItem(item: ShoppingListItem) {
        console.log('method \'addUpdateOrDeleteItem\' called.');
        console.log(item);
        this.isEditMode = false;
        if (item.shoppingListItemId == 0) {
            if (item.title.length == 0) {
                console.log('delete item, since no title has been given');
                // console.log('after :', JSON.stringify(this.shoppingListItems));
                return;
            }
            try {
                let result = await this.listItemService.saveListItem(item);
                console.log('post returned id: ', result.body['shopping_list_item_id']);
                item.shoppingListItemId = result.body['shopping_list_item_id'];
            } catch (error) {
                console.log('saveList: error: ', error);
            } finally {

            }
        }

        else {
            // if (list.title != this.tempList.title) {
            if (item.title.length == 0) {
                console.log('title.length == 0 ---> deleteList shoppingListItemId: ', item.shoppingListItemId);
                await this.deleteItemById(item.shoppingListItemId);
            } else {
                console.log('updateList');
                await this.listItemService.updateListItem(item);
            }
            // }
        }
    }

    async deleteItemById(itemId: number) {
        // let result = await this.shoppingListService.deleteListById(listId);
        try {
            await this.listItemService.deleteItemById(itemId);
            let removeIndex = this.shoppingListItems.map(function (item) {
                return item.shoppingListItemId;
            }).indexOf(itemId);
            this.shoppingListItems.splice(removeIndex, 1);
        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    addItemToList() {
        console.log('method addItemToList called, isEditMode: ', this.isEditMode);

        if (!this.isEditMode) {
            this.shoppingListItems.push(new ShoppingListItem(0, '', '', '', this.shoppingListId));
            this.isEditMode = true;
        } else {
            let result = this.saveUpdateOrDeleteItem(this.selectedListItem);
        }
    }

    onFocus(item: ShoppingListItem) {
        console.log('method onFocus called');
        this.selectedListItem = item;
        console.log('tempListItem: ', JSON.stringify(this.selectedListItem));
        this.isEditMode = true;
    }

    onFocusOut() {
        if(this.shoppingListItems[this.shoppingListItems.length-1].title == '') {
            this.shoppingListItems.pop();
        }
        let result = this.saveUpdateOrDeleteItem(this.selectedListItem);
    }

}
