import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ActionSheetController } from '@ionic/angular';
import { AppComponent } from '../app.component';

import { ActivatedRoute} from '@angular/router';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
// import * as vision from'@google-cloud/vision';


@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.page.html',
  styleUrls: ['./photo-detail.page.scss'],
})
export class PhotoDetailPage implements OnInit {
  tags = [];
  ParPhoto = null;

 // Imports the Google Cloud client library

// Creates a client
// client = new vision.ImageAnnotatorClient();

// Performs label detection on the image file

  constructor(public navCtrl: NavController,
    public alertController: AlertController,
    public appcomponent: AppComponent,
    public actionSheetController: ActionSheetController,
    private socialSharing: SocialSharing,
    private file: File
    , private activatedRoute: ActivatedRoute
    ) {

      this.tags = [
        'full',
        'door',
        'knock',
       ];
    }

    ngOnInit() {
      this.ParPhoto = this.activatedRoute.snapshot.paramMap.get('photo');
      // this.ParPhoto = this.Pre.concat(this.ParPhoto);
      // this.ParPhoto = this.ParPhoto.split(',').join('/');
    }

  public tagBtnClick() {
    this.navCtrl.navigateForward('/tagview');
  }

  gotoBack() {
    this.navCtrl.pop();
  }

  // tslint:disable-next-line:member-ordering
  hiddenFlag: boolean = false;
  edit_tags() {
    this.hiddenFlag = true;
  }
  backtoDetail() {
    this.hiddenFlag = false;
  }

  // React to click Tag Button; delete tag()은 여기서 끝
  async tagModifyBtnClick(oldtagId: any) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text : '수정하기',
        handler: () => {
          console.log('수정하기 clicked');

          this.presentAlertPromptModify(oldtagId);
        }
      },
      {
        text : '삭제하기',
        handler: () => {
          console.log('삭제하기 clicked');
          // 직접 태그 눌러서 삭제하기 기능
          console.log('oldtagID: ' + oldtagId);

          this.tags.splice(this.tags.indexOf(oldtagId), 1);
        }
      },
    {
      text: '취소',
      role: 'destructive',

      handler: () => {
        console.log('취소 clicked');
      }
    }]
    });
    await actionSheet.present();
  }


  // Modify tag
  async presentAlertPromptModify(oldtagId: any) {
    const alertModify = await this.alertController.create({
      header: '태그 입력',
      inputs: [
        {
          name: 'newtag',
          type: 'text',
          placeholder: oldtagId,
        }
      ],
      buttons: [
        {
          text: '취소',
          role: 'cancle',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: '완료',
          handler: data => {
            console.log('Modify tag: ' + document.getElementById('oldtag{{tags.indexOf(item)}}') + ' => ' + data.newtag);
            this.tags.splice(this.tags.indexOf(oldtagId), 1, data.newtag);
        }
        }
      ],
    });


    await alertModify.present();
  }

   // Add Tag
   async presentAlertPromptAdd() {
    const alertModify = await this.alertController.create({
      header: '새로운 태그 입력',
      inputs: [
        {
          name: 'newtag',
          type: 'text',
          placeholder: ''
        }
      ],
      buttons: [
        {
          text: '취소',
          handler: () => {
            console.log('Footer Add Cancel');
          }
        },
        {
          text: '완료',
          handler: data => {
            console.log('Add newtag:' + data.newtag);
            this.tags.push(data.newtag);
        }
        }
      ],
    });
    await alertModify.present();
  }

  async shareBntClick() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
        text : '이미지 공유',
        handler: () => {
          console.log('이미지공유 clicked');
          this.shareOnlyImage();
          // this.presentAlertPromptModify(oldtagId);
        }
      },
      {
        text : '태그 공유',
        handler: () => {
          console.log('태그공유 clicked');
          this.shareOnlyTags();

          // this.tags.splice(this.tags.indexOf(oldtagId), 1);
        }
      },
    {
      text: '취소',
      role: 'destructive',

      handler: () => {
        console.log('취소 clicked');
      }
    }]
    });
    await actionSheet.present();

  }

  async resolveLocalFile() {
    return this.file.copyFile(`${this.file.applicationDirectory}www/assets/imgs/`, '4.jpg',
    this.file.cacheDirectory, `${new Date().getTime()}.jpg`);
  }

  removeTempFile(name) {
    this.file.removeFile(this.file.cacheDirectory, name);
  }

  async shareOnlyImage() {
    // tslint:disable-next-line:prefer-const
    let file = await this.resolveLocalFile();

    this.socialSharing.share(null, null, file.nativeURL, null)
    .then((entries) => {
      this.removeTempFile(file.name);
    }).catch((e) => {
      // Error!
    });

  }
  async shareOnlyTags() {
    const arr = this.tags.toString();
    this.socialSharing.share(arr, null, null, null)
    .then((entries) => {
      // Success
    }).catch((e) => {
      // Error
    });
  }

}
