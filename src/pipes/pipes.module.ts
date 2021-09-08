import { NgModule } from '@angular/core';
import { OrderbyIdxPipe } from './orderby-idx/orderby-idx';
import { SafePipe } from './safe/safe';
@NgModule({
	declarations: [OrderbyIdxPipe,
    SafePipe,
    SafePipe],
	imports: [],
	exports: [OrderbyIdxPipe,
    SafePipe,
    SafePipe]
})
export class PipesModule {}
