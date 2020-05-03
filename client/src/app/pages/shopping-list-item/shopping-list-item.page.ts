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
    oldListSize: number;
    shoppingListId;
    shoppingListItems: ShoppingListItem[] = [];
    newShoppingListItem: ShoppingListItem;
    @ViewChildren(IonInput) inputs: QueryList<IonInput>;
    currListItem = new ShoppingListItem(0, '', '', '', this.shoppingListId);

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
                if (this.inputs.length > this.oldListSize) {
                    setTimeout(async (args) => {
                        // console.log('event');
                        // Keyboard.show() // for android

                        await this.inputs.last.setFocus();
                    }, 150); //a least 150ms.
                }
                this.oldListSize = this.inputs.length;
            })
    }

    onFocus(item: ShoppingListItem) {
        this.isEditMode = true;
        this.currListItem.shoppingListItemId = item.shoppingListItemId;
        this.currListItem.shoppingListId = item.shoppingListId;
        this.currListItem.title = item.title;
        this.currListItem.description = item.description;
        this.currListItem.imagePath = item.imagePath;

    }

    async onFocusOut(item: ShoppingListItem) {
        console.log('--------------------------');
        this.isEditMode = false;
        console.log('[ onFocusOut ]');
        console.log(item);

        if (item.title == '') {
            await this.deleteItemById(item.shoppingListItemId);
        } else {
            if (item.shoppingListItemId == 0) {
                let result = await this.listItemService.saveListItem(item);
                console.log(result.body['shopping_list_item_id']);
                item.shoppingListItemId = result.body['shopping_list_item_id'];
            } else {
                console.log(this.currListItem.title);
                console.log(item.title);
                if (this.currListItem.title != item.title) {
                    console.log('update');
                    await this.listItemService.updateListItem(item);
                }
            }
        }
        console.log(this.shoppingListItems);
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

    pushItem() {
        console.log('--------------------------')
        console.log('[ pushItem ]');
        console.log(this.shoppingListItems);

        let newListIndex = this.shoppingListItems.map(function (item) {
            return item.shoppingListItemId;
        }).indexOf(0);
        if (newListIndex == -1 && this.currListItem.shoppingListItemId == 0) { // Wenn noch keine Liste hinzugefügt (keine Liste mit ID 0) und zuletzt geklicktes Item nicht in DB gespeicherte Liste ist
            console.log('newListIndex:', newListIndex);
            this.shoppingListItems.push(new ShoppingListItem(0, '', '', '', this.shoppingListId));
            console.log(this.shoppingListItems);

        }
        this.currListItem = new ShoppingListItem(0, '', '', '', this.shoppingListId);
    }

}
