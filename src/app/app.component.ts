import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppServiceService } from "./services/app-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedFiles: any;
  progress: number;
  currentFileUpload: any;
  imageUploaded:number;
  pdfUploaded:number;
  infoUploaded:number;
  form:FormGroup;
  formsubmitted=false;

  constructor(private appService:AppServiceService,
    private fb:FormBuilder,){
      this.createForm();
    }
  createForm() {
    this.form=this.fb.group({
      page:[null,Validators.required],
      x:[null,Validators.required],
      y:[null,Validators.required]
    });
  }
  get f() { return this.form.controls; }
  
  onSelectedFile(event){
    this.selectedFiles=event.target.files;
  }

  uploadPdf(){
    this.progress=0;
    this.currentFileUpload=this.selectedFiles.item(0);
    this.appService.uploadPdf(this.currentFileUpload)
    .subscribe(
    event=>{if(event.type===HttpEventType.UploadProgress){
        this.progress=Math.round(100*event.loaded/event.total);
        this.pdfUploaded=1;
        console.log(this.progress)
    }else if (event instanceof HttpResponse){
      
    this.pdfUploaded=1;
    }},
    error=>{alert("Problème de téléchargement...")}
    );
  }

  uploadImage(){
    this.progress=0;
    this.currentFileUpload=this.selectedFiles.item(0);
    this.appService.uploadImage(this.currentFileUpload)
    .subscribe(

    event=>{if(event.type===HttpEventType.UploadProgress){
        this.progress=Math.round(100*event.loaded/event.total);
        this.imageUploaded=1;
        console.log(this.progress)
    }else if (event instanceof HttpResponse){
      this.imageUploaded=1;
    }},
    error=>{alert("Problème de téléchargement...")}
    );
  }

  insertInfo(){
    this.formsubmitted=true;
    if (this.form.invalid){
      return;
    }
    this.appService.info(this.form.value).subscribe(
      resp=>{console.log('yesss');
              this.infoUploaded=1;},
      err=>console.log('nooooo')
    );
  }

  makepdf(){
    this.appService.makePdf().subscribe(
      resp=>{console.log('gooood');
            this.imageUploaded=0;
            this.infoUploaded=0;
            this.pdfUploaded=0;
            this.downloadFile()
          },
      err=>console.log('error making')
    )
  }

  makepdfBox(){
    this.appService.makePdfBox().subscribe(
      resp=>{console.log('gooood');
            this.imageUploaded=0;
            this.infoUploaded=0;
            this.pdfUploaded=0;
            this.downloadFile()
            },
      err=>console.log('yarraaaah')
    )
  }

  downloadFile(){
    this.appService.download().subscribe(
      resp=>{console.log('downloaded');
      console.log(resp);
        var binaryData = [];
        binaryData.push(resp.data);
        var url = window.URL.createObjectURL(new Blob(binaryData, {type: "application/pdf"}));
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.setAttribute('target', 'blank');
        a.href = url;
        a.download = resp.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();},
      err=>console.log('try again')
    );
  }

}
