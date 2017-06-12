import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterRoutes',
})
export class FilterRoutesPipe implements PipeTransform {
  returnRoutes: any[];
  
  transform(routes: any[], grade : any, searchTerm : string, stars: any) {
    this.returnRoutes = routes;
    if (grade != 'any' && grade){
      this.returnRoutes = this.returnRoutes.filter((route)=>{return route.grade === grade});
    }
    if (searchTerm) {
      this.returnRoutes = this.returnRoutes.filter((route)=>{return route.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1});
    }
    if (stars != 'any' && stars){
      this.returnRoutes = this.returnRoutes.filter((route)=>{return route.stars === stars});
    }

    return this.returnRoutes;
  }
}