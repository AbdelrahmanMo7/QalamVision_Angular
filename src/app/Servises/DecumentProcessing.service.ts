import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DecumentProcessing {
  private  db_URL = "http://41.33.149.211:1331/api/v1/ocr/?doc_type=ocr&lang=auto";

  constructor(private  DecumentProcessingClient :HttpClient) { }
 
  Process(file:File){
   


    return this.DecumentProcessingClient.post(this.db_URL, file);
    
    // const formData = new FormData();
    // formData.append('file', file, file.name);

    // return this.DecumentProcessingClient.post(this.db_URL, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
 

}
