import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCustomToasterService } from './my-custom-toaster/my-custom-toaster.service';
import { MyCustomLoadingService } from './my-custom-loading/my-custom-loading.service';
import { MyCustomInputComponent } from './my-custom-input/my-custom-input.component';
import { FormsModule } from '@angular/forms';
import { MyCustomModalComponent } from './my-custom-modal/my-custom-modal.component';
import { MapasService } from './mapas/mapas.service';
import { MyCustomMapComponent } from './mapas/my-custom-map/my-custom-map.component';

@NgModule({
  declarations: [
    MyCustomInputComponent,
    MyCustomModalComponent,
    MyCustomMapComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    MyCustomInputComponent,
    MyCustomModalComponent,
    MyCustomMapComponent
  ]
})
export class SharedModule { 
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        MyCustomToasterService,
        MyCustomLoadingService,
        MapasService    
      ]
    };
  }
}