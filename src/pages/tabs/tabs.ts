import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { VaultPage } from '../vault/vault';
import { RedemptionPage } from '../redemption/redemption';
import { NetworkPage } from '../network/network';
import { MorePage } from '../more/more';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = VaultPage;
  tab3Root = RedemptionPage;
  tab4Root = NetworkPage;
  tab5Root = MorePage;

  constructor() {

  }
}
