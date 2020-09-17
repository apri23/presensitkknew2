import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresensiPage } from './presensi.page';

const routes: Routes = [
  {
    path: '',
    component: PresensiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresensiPageRoutingModule {}
