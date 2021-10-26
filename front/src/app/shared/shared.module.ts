import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCustomToasterService } from './my-custom-toaster/my-custom-toaster.service';
import { MyCustomLoadingService } from './my-custom-loading/my-custom-loading.service';
import { MyCustomInputComponent } from './my-custom-input/my-custom-input.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MyCustomInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    MyCustomInputComponent
  ],
  providers: [
    MyCustomToasterService,
    MyCustomLoadingService
  ]
})
export class SharedModule { }
