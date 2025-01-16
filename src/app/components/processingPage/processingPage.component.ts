import { Component } from '@angular/core';
import { DecumentProcessing } from '../../Servises/DecumentProcessing.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-processingPage',
  standalone: true,
  imports: [ HttpClientModule],
  providers:[
   DecumentProcessing
  ],
  templateUrl: './processingPage.component.html',
  styleUrl: './processingPage.component.css'
})
export class ProcessingPageComponent {

  // Maximum allowed file size in MB
  MAX_FILE_SIZE_MB = 10; 
  Processing_Status ='... Waiting for file ';
  extracted_Data="extracted Data";
  isProcesSuccessful_=false;
  constructor(private DecumentProcessing_service: DecumentProcessing ){
  }

   //  Handle drag-and-drop file uploads.
  onFileDrop(event: DragEvent): void {
   this.onDragOperation(event);
    const files = event.dataTransfer?.files;
   // this.Processing_Status = 'Processing ...';

    if (files && files.length > 0) {
      this.Processing_Status = '... Processing ';
      this.validateAndUploadFile(files[0]);
    }
  }

  // Prevent default behavior during drag over/leaves event.
  onDragOperation(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

 
  /**
   * Handle file selection from the file input.
   */
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validateAndUploadFile(input.files[0]);
    }
  }

 

  // Validate the uploaded file and check its size.
   
  private validateAndUploadFile(file: File): void {
    this.Processing_Status = '... Processing ';
 
    // Check file size (convert size from bytes to MB)
    const fileSizeInMB = file.size / (1024 * 1024);
    const types: string []=["png", "jpg","pdf"  ]
    var selectedtype : string=file.type.toLowerCase().split("/")[1];
    if (fileSizeInMB > this.MAX_FILE_SIZE_MB) {
      alert("File size exceeds the maximum allowed size of 10 MB.");
      return;
    }
    
    types.forEach(type=>
      {
        if (selectedtype===type)
          {alert(type+" + "+selectedtype);
            // If validation passes, proceed to upload
            let files=[file];
            this.uploadFile(file);
           }
      } );

    
  }

  // Upload the validated file.

  private uploadFile(files: File): void {
    console.log('File ready for upload:', files);

     this.DecumentProcessing_service.Process(files).subscribe({
      next:(response)=>{
        console.log("response : data  : ");
        console.log(response);
        this.extractArabicText( JSON.stringify(response, null, 2));
        
       this.isProcesSuccessful_=true
        this.Processing_Status = '.Processing complete';
       alert("ok")
        
      },
      error:(err)=>{
        console.log(err);
        this.isProcesSuccessful_=false;
        this.Processing_Status = '.Error during upload';
        alert(`Upload failed (Server Problem): ${err.message}`);
      }
    });
  
  }

  // Extract Arabic text
  extractArabicText( data:string): void {
    const parsedData = JSON.parse(data);
    const responses = parsedData.modified_response;
    const arabicTexts: string[] = [];

    responses.forEach((responseGroup: any) => {
      responseGroup.forEach((response: any) => {
        response.forEach((item: any) => {
          if (item.text && /[\u0600-\u06FF]/.test(item.text)) {
            arabicTexts.push(item.text);
          }
        });
      });
    });

    this.extracted_Data= arabicTexts.join('\n');
  }

  // Download extracted Arabic text
  downloadTextFile() {
    const arabicText = this.extracted_Data;
    const blob = new Blob([arabicText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Extracted_Arabic_Text.txt';
    a.click();

    window.URL.revokeObjectURL(url);
  }
}
