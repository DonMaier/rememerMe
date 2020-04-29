import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ShoppingList} from "../models/shopping-list";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ShoppingListService {

    constructor(private httpClient: HttpClient) {
    }

    getShoppingLists(): Promise<ShoppingList[]> {
        return this.httpClient.get<ShoppingList[]>(`${environment.serverUrl}shopping-lists`).toPromise();
    }

    saveShoppingList(list: ShoppingList) {
        return this.httpClient.post(`${environment.serverUrl}shopping-lists`, list, {observe: 'response'}).toPromise();
    }

    deleteListById(listId: number) {
        return this.httpClient.post(`${environment.serverUrl}shopping-lists/delete/${listId}`, {observe: 'response'}).toPromise();
    }
}
