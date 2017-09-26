import { Component, ViewChild } from '@angular/core';
import { HomePage } from '../home/home';
import { MapPage } from '../map/map';
import { PasscodePage } from '../passcode/passcode';
import { NetworkPage } from '../network/network';
import { MorePage } from '../more/more';
import { TabsService } from '../../providers/tabs.service';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})

export class TabsPage {
  @ViewChild('myTabs') tabRef;

  tab1Root = HomePage;
  tab2Root = PasscodePage;
  tab3Root = MapPage;
  tab4Root = NetworkPage;
  tab5Root = MorePage;
  
  constructor(private tabsService: TabsService) {
    this.tabsService.tabChange.subscribe((index) => {
      this.tabRef.select(index);
    });
  }
  
}
