import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import * as cordovaGallery from 'cordova-gallery-access';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  imgs = ['assets/imgs/1.jpg', 'assets/imgs/2.jpg', 'assets/imgs/3.jpg', 'assets/imgs/4.jpg',
  'assets/imgs/5.jpg', 'assets/imgs/6.jpg', ];

  // imgParm = null;
  constructor(public navCtrl: NavController,
     private photoLibrary: PhotoLibrary,
     private photoViewer: PhotoViewer
    , private router: Router
     ) {
      console.log('#home들어감');

    /***Using cordovaGallery plugin***/
      cordovaGallery.load({count: 10 }).then(items => { // count :10

        items.forEach(item => {
          // let imgPath = 'file://';
          // imgPath += item.thumbnail;
          // this.imgs.push(imgPath);
          // this.imgParm = imgPath.split('/').join(',');
          // this.gotoDetail(imgPath);
          this.imgs.push('file://' + item.thumbnail);
          console.log('#Item.thumbnail: ' + item.thumbnail);

        });

    }).catch(e => console.error('#cordovaGallery Error' + e));

  }

  navigate() {  // 좋아하는 사진 페이지로 이동
    this.navCtrl.navigateForward('/photo-like');
  }


  gotoDetail(image) {
    const imgPath = this.imgs[this.imgs.indexOf(image)];
    // imgPath = imgPath.replace('file://', '');
    // imgPath = imgPath.split('/').join(',');
    this.router.navigate(['photo-detail', imgPath]);
  }

  // gotoDetail() {
    // this.navCtrl.navigateForward('/photo-detail', );
  // }

  gotoSearch() { // 검색창 페이지로 이동
    this.navCtrl.navigateForward('/search');
  }

}
