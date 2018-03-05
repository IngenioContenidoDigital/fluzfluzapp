import { Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { TRACKER_ID } from './config';
import { TRACKER_INTERVAL } from './config';
import { DEV_MODE } from './config';


@Injectable()
export class AnalyticsService {
  
  public ga:GoogleAnalytics = new GoogleAnalytics;
  
  constructor() {}
  
  public analytictsStart(){
    this.debugMode(DEV_MODE);
    this.startTrackerWithId();
  }
  
  public startTrackerWithId(id:string = TRACKER_ID, interval:number = TRACKER_INTERVAL){
    this.ga.startTrackerWithId(id, interval)
      .then(() => {
      }
    )
    .catch(e => console.log('Error: \n iniciando GoogleAnalytics \n', e));
  }
  
  public trackEvent(category:string = 'FluzFluzApp', action:string = '', label:string = '', value:number = 0, newSession:boolean = false){
    this.ga.trackEvent(category, action, label, value, newSession)
    .catch(error=>{
      console.error("Analytics Error: \n"+error);
    });
  }
  
  public trackView(title:string = '', campaignUrl:string = '', newSession:boolean = false){
    this.ga.trackView(title, campaignUrl, newSession)
    .catch(error=>{
      console.error(error);
    });
  }
  
  public setUserId(id:string){
    this.ga.setUserId(id)
    .catch(error=>{
      console.error(error);
    });
  }
  
  public debugMode(debug:boolean){
    if(debug){
      this.ga.debugMode()
      .catch(error=>{
        console.error(error);
      });
      this.ga.enableUncaughtExceptionReporting(true)
      .catch(error=>{
        console.error(error);
      });
    }
  }
  
}