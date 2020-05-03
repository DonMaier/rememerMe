import { Injectable } from '@angular/core';
import {ShoppingList} from "../models/shopping-list";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ShoppingListItem} from "../models/shopping-list-item";

@Injectable({
  providedIn: 'root'
})
export class ShoppingListItemService {

  constructor(private httpClient: HttpClient) { }

  async getListItemsById(shoppingListId) : Promise<ShoppingListItem[]> {
    return this.httpClient.get<ShoppingListItem[]>(`${environment.serverUrl}shopping-list-items/${shoppingListId}`).toPromise();
  }

  async getItemById(itemId) : Promise<ShoppingListItem> {
    return this.httpClient.get<ShoppingListItem>(`${environment.serverUrl}shopping-list-items/item/${itemId}`).toPromise();
  }

  saveListItem(listItem: ShoppingListItem) {
    return this.httpClient.post(`${environment.serverUrl}shopping-list-items`, listItem, {observe: 'response'}).toPromise();
  }

  updateListItem(listItem: ShoppingListItem) {
    return this.httpClient.post(`${environment.serverUrl}shopping-list-items/update`, listItem, {observe: 'response'}).toPromise();
  }

  deleteItemById(itemId: number) {
    return this.httpClient.post(`${environment.serverUrl}shopping-list-items/delete/${itemId}`, {observe: 'response'}).toPromise();
  }

}
