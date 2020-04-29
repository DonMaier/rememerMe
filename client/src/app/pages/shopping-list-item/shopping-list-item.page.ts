import { Component, OnInit } from '@angular/core';
import {ShoppingListItem} from "../../models/shopping-list-item";
import {ShoppingListItemService} from "../../services/shopping-list-item.service";
import {ActivatedRoute} from "@angular/router";
import {ShoppingList} from "../../models/shopping-list";


@Component({
  selector: 'app-shopping-list-items',
  templateUrl: './shopping-list-item.page.html',
  styleUrls: ['./shopping-list-item.page.scss'],
})
export class ShoppingListItemPage implements OnInit {

  newListItem: ShoppingListItem;
  showAddPanel = false;
  shoppingListItems: ShoppingListItem[] = [];
  shoppingListId;
  constructor(private shoppingListItemService: ShoppingListItemService,
              private route: ActivatedRoute){ }

  async ngOnInit() {
    console.log('shoppingListItem loaded');
    this.shoppingListId = this.route.snapshot.params['id'];
    this.newListItem = new ShoppingListItem(null, '', '', this.shoppingListId);
    this.shoppingListItems = await this.shoppingListItemService.getListItemsById(this.shoppingListId);
  }

  async saveListItem() {
    console.log('method \'saveItem\' called.');

    if(this.newListItem.title.length == 0) {
      this.showAddPanel = false;
      return;
    }

    try {
      let result = await this.shoppingListItemService.saveListItem(this.newListItem);
      console.log('post returned id: ', result.body['shopping_list_item_id']);
      let shoppingListItem = new ShoppingListItem(result.body['shopping_list_item_id'], this.newListItem.title, '', this.shoppingListId);
      this.shoppingListItems.push(shoppingListItem);
    } catch (error) {
      console.log('saveList: error: ', error);
    } finally {
      this.newListItem = new ShoppingListItem(null, '', '', this.shoppingListId);
    }
  }

  async deleteItemById(itemId: number) {
    // let result = await this.shoppingListService.deleteListById(listId);
    try {
      await this.shoppingListItemService.deleteItemById(itemId);
      let removeIndex = this.shoppingListItems.map(function(item) { return item.shoppingListItemId; }).indexOf(itemId);
      console.log('davor: ' , this.shoppingListItems.length);
      console.log('removeIndex: ', removeIndex);
      this.shoppingListItems.splice(removeIndex,1);
      console.log('danach: ' , this.shoppingListItems.length);
    }
    catch (error) {
      console.log(error);
    } finally {

    }
  }

}
