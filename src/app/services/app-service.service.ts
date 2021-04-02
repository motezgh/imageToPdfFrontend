import { Injectable } from '@angular/core';

import { host } from "../domain/domain";
import { Test } from "../model/test";

import { HttpClient, HttpEvent, HttpHeaders,HttpRequest,HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";



@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor( private http : HttpClient) { }

  public uploadPdf(file:File):Observable<HttpEvent<{}>>{
    let formData=new FormData();
    formData.append('file',file);
    const req=new HttpRequest('Post',host+'/uploadPDF',formData,{reportProgress:true,responseType:'text'});
    return this.http.request(req);
  }

  public uploadImage(file:File):Observable<HttpEvent<{}>>{
    let formData=new FormData();
    formData.append('file',file);
    const req=new HttpRequest('Post',host+'/uploadImage',formData,{reportProgress:true,responseType:'text'});
    return this.http.request(req);
  }

  

  public  info(test):Observable<Test>{
    return this.http.post<Test>(host+'/insertInfo',test)
  }

  public makePdf():Observable<any>{
    return this.http.get(host+'/pdf')
  }

  public makePdfBox():Observable<any>{
    return this.http.get(host+'/pdfBox')
  }

  public download():Observable<any>{
    return this.http.get(host+'/download' , { responseType: 'blob' }).pipe(map((response)=>{
      return {
          filename: 'final.pdf',
          data: response.arrayBuffer()
      };
  }));
  
  }

}
