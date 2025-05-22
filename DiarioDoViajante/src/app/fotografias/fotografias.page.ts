import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fotografias',
  templateUrl: './fotografias.page.html',
  styleUrls: ['./fotografias.page.scss'],
  standalone: false
})
export class FotografiasPage implements OnInit {
   selectedTab: string = 'fotos';

  constructor() { }

  ngOnInit() {
  }
  segmentChanged(event: any) {
    this.selectedTab = event.detail.value;
  }

}
