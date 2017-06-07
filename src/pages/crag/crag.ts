import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { DeviceFeedback } from '@ionic-native/device-feedback';

import { ApiService } from '../../app/api/api.service';

import { RoutePage } from '../route/route';

import _ from 'lodash';

@Component({
  selector: 'page-crag',
  templateUrl: 'crag.html',
})
export class CragPage {

  cragId;
  crag;
  routes;
  routeOrder = 'Left to Right';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiService,
    private actionSheetCtrl: ActionSheetController,
    private deviceFeedback: DeviceFeedback
  ){
    this.cragId = this.navParams.get('id');
    this.crag = this.apiService.getCragById(this.cragId);
    this.routes = this.apiService.getRoutesByCrag(this.cragId);
    this.routes.map(route=>{
      route.starArray = [];
      for (let i = 0; i < route.stars; i++){
        route.starArray.push(0);
      }
    })
  }

  goToRoute(id: number) {
     this.navCtrl.push(RoutePage, {
       id: id
    });
  }

  openOrderActionSheet(){
    this.deviceFeedback.haptic(1);
    let actionSheet = this.actionSheetCtrl.create({
      title: "Order Routes by",
      buttons: [
        {
          text: 'Left to Right',
          handler: ()=>{
            this.orderRoutes('leftRight');
          }
        },
        {
          text: 'Right to Left',
          handler: ()=>{
            this.orderRoutes('rightLeft');
          }
        },
        {
          text: 'Grade - Low to High',
          handler: ()=>{
            this.orderRoutes('lowHigh');
          }
        },
        {
          text: 'Grade - High to Low',
          handler: ()=>{
           this.orderRoutes('highLow');
          }
        },
        {
          text: 'Star Rating',
          handler: ()=>{
            this.orderRoutes('stars');
          }
        }
      ]
    });
    actionSheet.present();
  }

  orderRoutes(order){
    this.deviceFeedback.haptic(1);
    switch(order){
      case 'leftRight':
        this.routes = _.orderBy(this.routes,['order'], ['asc']);
        this.routeOrder = 'Left to Right';
        break;
      case 'rightLeft':
        this.routes = _.orderBy(this.routes,['order'], ['desc']);
        this.routeOrder = 'Right to Left';
        break;
      case 'lowHigh':
        this.routes = _.orderBy(this.routes,['grade'], ['asc']);
        this.routeOrder = 'Grade - Low to High';
        break;
      case 'highLow':
        this.routes = _.orderBy(this.routes,['grade'], ['desc']);
        this.routeOrder = 'Grade - High to Low';
        break;
      case 'stars':
        this.routes = _.orderBy(this.routes,['stars'], ['desc']);
        this.routeOrder = 'Star Rating';
        break;
    }
  }

  openRouteActionSheet(route){
    this.deviceFeedback.haptic(3);
    let buttons = [];
    if (route.sent){
      buttons.push(
        {
          text: 'Mark as Not Sent',
          handler: ()=>{
            this.markRouteAsNotSent(route);
          }
        }
      );
    } else {
      buttons.push(
        {
          text: 'Mark as Sent',
          handler: ()=>{
            this.markRouteAsSent(route);
          }
        }
      );
    }
    if (route.ticklisted){
      buttons.push(
        {
          text: 'Remove from Ticklist',
          handler: ()=>{
            this.removeRouteFromTicklist(route);
          }
        }
      );
    } else {
      buttons.push(
        {
          text: 'Add to Ticklist',
          handler: ()=>{
            this.addRouteToTicklist(route);
          }
        }
      );
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: "Route Actions",
      buttons: buttons
    });
    actionSheet.present();
  }

  markRouteAsSent(route) {
    this.deviceFeedback.haptic(1);
    route.sent = true;
    route.ticklisted = false;
  }

  markRouteAsNotSent(route) {
    this.deviceFeedback.haptic(1);
    route.sent = false;
  }

  addRouteToTicklist(route) {
    this.deviceFeedback.haptic(1);
    route.ticklisted = true;
  }

  removeRouteFromTicklist(route) {
    this.deviceFeedback.haptic(1);
    route.ticklisted = false;
  }

}
