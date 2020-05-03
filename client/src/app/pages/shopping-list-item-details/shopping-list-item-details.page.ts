import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Plugins, CameraResultType, CameraSource} from '@capacitor/core';
import {ShoppingListItem} from "../../models/shopping-list-item";
import {ShoppingListItemService} from "../../services/shopping-list-item.service";
import {ActivatedRoute} from "@angular/router";

const {Camera, Filesystem} = Plugins;

@Component({
    selector: 'app-shopping-list-item-details',
    templateUrl: './shopping-list-item-details.page.html',
    styleUrls: ['./shopping-list-item-details.page.scss'],
})


export class ShoppingListItemDetailsPage implements OnInit {

    photo: SafeResourceUrl;
    listItem: ShoppingListItem;
    itemId: number;
    options = {
        resultType: CameraResultType.Uri
    };

    constructor(private sanitizer: DomSanitizer, private listItemService: ShoppingListItemService, private route: ActivatedRoute) {
    }

    async ngOnInit() {
        this.itemId = this.route.snapshot.params['id'];
        this.listItem = await this.listItemService.getItemById(this.itemId);
        console.log('listItem: ', this.listItem);

    }

    ionViewWillLeave() {

    }

    async takePicture() {
        const image = await Plugins.Camera.getPhoto({
            quality: 100,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera
        });
        // console.log(image.dataUrl);
        console.log('image: ', image);
        console.log('image.webpath: ', image.webPath);
        this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
    }


}
