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

    isEditMode = false;
    oldListSize: number;
    shoppingLists: ShoppingList[] = [];
    newShoppingList: ShoppingList;
    @ViewChildren(IonInput) inputs: QueryList<IonInput>;
    currList: ShoppingList = new ShoppingList(0, '', '');


    constructor(private shoppingListService: ShoppingListService) {
    }

    async ngOnInit() {

        this.shoppingLists = await this.shoppingListService.getShoppingLists();
        console.log(this.shoppingLists);
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

    onFocus(list: ShoppingList) {


    }

    async onFocusOut(list: ShoppingList) {
        console.log('--------------------------')
        console.log('[ onFocusOut ]');
        console.log(list);
        this.currList = list;

        if(list.title == '') {
            await this.deleteListById(list.shoppingListId);
        } else {
            if(list.shoppingListId == 0) {
                let result = await this.shoppingListService.saveShoppingList(list);
                console.log(result.body['shopping_list_id']);
                list.shoppingListId = result.body['shopping_list_id'];
            } else {
                await this.shoppingListService.updateList(list);
            }
        }
        console.log(this.shoppingLists);
    }

    async deleteListById(listId: number) {
        // let result = await this.shoppingListService.deleteListById(listId);
        try {
            await this.shoppingListService.deleteListById(listId);
            let removeIndex = this.shoppingLists.map(function (list) {
                return list.shoppingListId;
            }).indexOf(listId);
            this.shoppingLists.splice(removeIndex, 1);
        } catch (error) {
            console.log(error);
        } finally {

        }
    }


    pushList() {
        console.log('--------------------------')
        console.log('[ pushList ]');
        console.log(this.shoppingLists);

        let newListIndex = this.shoppingLists.map(function (list) {
            return list.shoppingListId;
        }).indexOf(0);
        if(newListIndex == -1 && this.currList.shoppingListId == 0) { // Wenn in shoppingsLists keine Liste mit ID 0 und ListItem, in dem ich zuletzt war, noch nicht in DB gespeichert wurde (noch keine gültige ID hatte)
            console.log('newListIndex:', newListIndex);
            this.shoppingLists.push(new ShoppingList(0, '', ''));
            console.log(this.shoppingLists);
        }
        this.currList = new ShoppingList(0, '', '');
    }
}
