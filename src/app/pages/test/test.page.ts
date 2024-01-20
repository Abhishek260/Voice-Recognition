import { Component, OnInit } from '@angular/core';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import {  MediaCapture, CaptureError, CaptureAudioOptions,  } from '@awesome-cordova-plugins/media-capture/ngx';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { FileTransferObject,FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Camera,CameraOptions  } from '@awesome-cordova-plugins/camera/ngx';
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { FileUploadOptions } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Platform } from '@ionic/angular';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';




@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  mediaObject: any;
  attachedFileName:any="";
  base64: string="";
  errtxt:any;
  private recognition: any;
  private recognitionAlert: any;
  recognisedtext: any;

  constructor(
    private media: Media,
    public androidPermissions: AndroidPermissions,
    private mediaCapture: MediaCapture,
    private toastController: ToastController,
    private transfer: FileTransfer,
    public actionSheetCtrl: ActionSheetController,
    private alertController: AlertController,
    private camera: Camera,
    private fileChooser: FileChooser,
    private file: File,
    private platform: Platform,
    private speechRecognition: SpeechRecognition
  ) {}

  ngOnInit() {
    
  }

  startRecording() {
    this.androidPermissions
      .requestPermissions([
        this.androidPermissions.PERMISSION.RECORD_AUDIO,
        // this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.READ_MEDIA_AUDIO,
      ])
      .then(
        (response: any) => {
          const filepath = 'internal://test/recordings/abc.mp3';
          this.mediaObject = this.media.create(filepath);
          this.mediaObject.startRecord();
        },
        (error: any) => console.log('Error requesting permissions', error)
      );
  }
  stopRecording() {
    this.mediaObject.stopRecord();
    this.convertToBase64();
   
  }

  playRecording() {
    this.mediaObject.play();
  }

  pauseRecording() {
    this.mediaObject.pause();
  }

  convertToBase64() {
    const fileReader = new FileReader();
    const filePath = 'internal://test/recordings/abc.3gp';

    fileReader.onloadend = () => {
      const base64String = fileReader.result as string;
      console.log('Base64 representation:', base64String);
      this.presentToast(base64String);
      
    };

    
    this.mediaObject.getCurrentPosition().then((position: any) => {
      this.mediaObject.seekTo(position);
      this.mediaObject.play();
      this.mediaObject.pause();
      this.mediaObject.getCurrentPosition().then(() => {
        this.mediaObject.pause();
        this.mediaObject.release();
      });
    });

    fileReader.readAsDataURL(new Blob([filePath], { type: 'audio/3gp' }));
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'middle',
    });

     (await toast).present();
  }

  attachedFile(){
    this.presentToast('Attached file clicked');
  }

  uploadFile() {
    const fileTransfer: FileTransferObject = this.transfer.create();
  
    const filePath = 'path/to/your/file.txt';
  
    const serverUrl = 'https://example.com/upload';
  
    const options = {
      fileKey: 'file',
      fileName: 'myfile.txt',
      chunkedMode: false,
      mimeType: 'text/plain',
      headers: {}
    };
  
 
    fileTransfer.upload(filePath, serverUrl, options)
      .then((data) => {

        console.log('File uploaded successfully:', data.response);
        this.presentToast('File uploaded successfully:'+ data.response);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        this.presentToast('Error uploading file:'+ error );
      });
  }
        pickImage(sourceType: number) {
          const options: CameraOptions = {
            quality: 60,
            sourceType: sourceType,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG, 
            mediaType: this.camera.MediaType.ALLMEDIA, 
          };
        
          this.camera.getPicture(options).then((fileData) => {
            if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
              this.handleFile(fileData, 'image/jpeg');
            } else if (sourceType === this.camera.PictureSourceType.CAMERA) {

              this.handleFile(fileData, 'image/jpeg');
            }
          }, (err) => {
            this.presentToast(err);
          });
        }
        
        handleFile(fileData: string, mimeType: string) {
          if (mimeType === 'image/jpeg') {
            this.attachedFileName = 'data:image/jpeg;base64,' + fileData;
            // Handle image file
          } else if (mimeType === 'application/pdf') {
            // Handle PDF file
          } else if (mimeType === 'text/plain') {
            // Handle TXT file
          } else if (mimeType === 'application/msword' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // Handle DOC file
          } else if (mimeType === 'application/vnd.ms-excel' || mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            // Handle Excel file
          }
        }
        
        async pickAttachment() {
          const actionSheet = await this.actionSheetCtrl.create({
            header: 'Select Attachment source',
            mode: 'ios',
            buttons: [
              {
                text: 'Load from Library',
                handler: () => {
                  this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
              },
              {
                text: 'Use Camera',
                handler: () => {
                  this.pickImage (this.camera.PictureSourceType.CAMERA);
                }
              },
              {
                text: 'Cancel',
                role: 'cancel'
              }
            ]
          });
        
          await actionSheet.present();
        }   
        
        uploadresume()
        {
            this.fileChooser.open()
            .then(uri => 
            {
              console.log(uri)
              this.presentToast(uri);
               const fileTransfer: FileTransferObject = this.transfer.create();
            let options1: FileUploadOptions = {
               fileKey: 'image_upload_file',
               fileName: 'name.pdf',
               headers: {},
               params: {"app_key":"Testappkey"},
               chunkedMode : false
            
            }
      
            fileTransfer.upload(uri, 'your API that can take the required type of file that you want to upload.', options1)
             .then((data) => {
             // success
             alert("success"+JSON.stringify(data));
             }, (err) => {
             // error
             alert("error"+JSON.stringify(err));
                 });
      
            })
            .catch(e => console.log(e));
        }
        
        uploadPdf(filePath: string) {
          const fileTransfer: FileTransferObject = this.transfer.create();
      
          const serverUrl = 'https://example.com/upload-pdf';
      
          const options = {
            fileKey: 'pdf_file',
            fileName: 'uploaded.pdf',
            chunkedMode: false,
            mimeType: 'application/pdf',
            headers: {},
          };
      
          fileTransfer.upload(filePath, serverUrl, options)
            .then((data) => {
              console.log('PDF uploaded successfully:', data.response);
              this.presentToast('PDF uploaded successfully: ' + data.response);
            })
            // .catch((error) => {
            //   console.error('Error uploading PDF:', error);
            //   this.presentToast('Error uploading PDF: ' + error);
            // });
            .catch((error) => {
              console.error('Error uploading PDF:', error);
            
              let errorMessage = 'Unknown error occurred during PDF upload.';
            
              if (error && error.body) {
                try {
                  const errorBody = JSON.parse(error.body);
                  if (errorBody && errorBody.message) {
                    errorMessage = errorBody.message;
                  }
                } catch (parseError) {
                  console.error('Error parsing error response body:', parseError);
                  this.presentToast('Error parsing error response body:'+parseError);
                }
              }
            
              this.presentToast('Error uploading PDF: ' + errorMessage);
            });
        }
      
        downloadPdf() {
          const serverUrl = 'https://example.com/download-pdf';
          const targetPath = this.file.externalRootDirectory + 'downloaded.pdf';
      
          const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer.download(serverUrl, targetPath, true)
            .then((entry) => {
              console.log('PDF downloaded successfully:', entry.toURL());
              this.presentToast('PDF downloaded successfully: ' + entry.toURL());
            })
            .catch((error) => {
              console.error('Error downloading PDF:', error);
              this.presentToast('Error downloading PDF: ' + error);
            });
        }



        selectPdfFile() {
          this.fileChooser.open().then(fileUri => {
            this.uploadPdf(fileUri);
          });
        }

        selectdownloadPdf() {
          const pdfUrl = 'https://greentrans.in:446/GreenSocanDocuments/902ab702-dfed-45b6-8e81-bb56001aee19_.pdf';
          window.open(pdfUrl, '_system');
        }

        chooseFile() {
          this.fileChooser.open()
            .then(uri => {
              // this.convertFileToBase64(uri);
              // this.presentToast('URI: '+uri);
            })
            .catch(error => {
              console.error('Error choosing file:', error);
              this.presentToast('Error choosing file:'+error);
            });
        }
 
  pickAndConvertToBase64() {
    this.fileChooser.open()
      .then(uri => {
        this.file.resolveLocalFilesystemUrl(uri)
          .then(entry => {
            (entry as any).file((file: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result as string;
                console.log('Base64 PDF:', base64String);
                this.presentToast('Base64 PDF:'+base64String);
                this.base64 = base64String;
              };
              reader.readAsDataURL(file);
            });
          })
          .catch(error =>
            //  console.error('Error resolving file:', error)
             this.presentToast('Error resolving file:'+ error)
             );
      })
      .catch(error => 
        // console.error('Error picking file:', error)
        this.presentToast('Error picking file:'+error)
        );
  }

  downloadFileFromBase64(x64: string, fileName: string, fileType: string) {
    const blob = this.dataURItoBlob(x64, fileType);
  
    this.platform.ready().then(() => {
      const filePath = this.file.dataDirectory; // or another directory you prefer
      const fileFullPath = filePath + fileName;
  
      this.file.writeFile(filePath, fileName, blob, { replace: true }).then(() => {
        console.log('File downloaded successfully at: ' + fileFullPath);
        this.presentToast('File downloaded successfully at: ' + fileFullPath);
      }).catch(err => {
        console.error('Error writing file: ' + err);
        this.presentToast('Error writing file: ' + JSON.stringify(err));
        // this.errtxt = JSON.stringify(err);
        this.errtxt = err;
      });
    });
  }
  
  dataURItoBlob(dataURI: string, fileType: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
  
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([ab], { type: fileType });
  }

  downloadbase64(){
    if(this.base64!=""){
      this.downloadFileFromBase64(this.base64,'','pdf');
    }
    else{
      this.presentToast('first make Base64 of this file');
    }
  }

  

  recognizeVoiceGoogle() {
    

    this.androidPermissions
      .requestPermissions([
        this.androidPermissions.PERMISSION.RECORD_AUDIO,
        // this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.READ_MEDIA_AUDIO,
      ])
      .then(
        (response: any) => {
          const filepath = 'internal://test/recordings/abc.mp3';
          this.mediaObject = this.media.create(filepath);
          // this.mediaObject.startRecord();
          this.speechRecognition.startListening()
          .subscribe(
            (matches: string[]) => {
              // 'matches' is an array of recognized words
              const recognizedText = matches.join(' ');
              console.log('Recognized Text:', recognizedText);
              this.presentToast(recognizedText);
              this.recognisedtext = recognizedText;
            },
            (err) => {
              console.error('Speech Recognition Error:', err);
              this.presentToast('Speech Recognition Error:'+ err);
            }
          );
        },
        (error: any) => console.log('Error requesting permissions', error)
      );
  }

  async presentRecognitionAlert() {
    this.recognitionAlert = await this.alertController.create({
      header: 'Speech Recognition',
      message: 'Listening...',
    });
    await this.recognitionAlert.present();
  }

  dismissRecognitionAlert() {
    if (this.recognitionAlert) {
      this.recognitionAlert.dismiss();
    }
  }

  recognizeVoice() {
    this.androidPermissions
      .requestPermissions([
        this.androidPermissions.PERMISSION.RECORD_AUDIO,
        this.androidPermissions.PERMISSION.READ_MEDIA_AUDIO,
      ])
      .then(
        (response: any) => {
          this.presentRecognitionAlert();
          this.startCustomRecognition().then((recognizedText: string) => {
            this.dismissRecognitionAlert();
            console.log('Recognized Text:', recognizedText);
            this.presentToast('Recognized Text: ' + recognizedText);
            this.recognisedtext = recognizedText;
          });
        },
        (error: any) => {
          console.log('Error requesting permissions', error);
          this.dismissRecognitionAlert(); 
        }
      );
  }

  startCustomRecognition(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.recognition) {
        this.recognition.abort();
      }

      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const recognizedText = event.results[0][0].transcript;
        resolve(recognizedText);
      };

      this.recognition.onerror = (event: any) => {
        reject('Custom Recognition Error:' + event.error); 
      };

      this.recognition.onend = () => {
        console.log('Custom Recognition Ended');
        reject('Custom Recognition Ended');
      };

      this.recognition.start();
    });
  }


  //   ionViewWillEnter(){
//     console.log("ionViewWillEnter")
//     this.presentToast("ionViewWillEnter");
// }

// ionViewDidEnter(){
//   console.log("ionViewDidEnter");
//   this.presentToast("ionViewDidEnter");
// }

// ionViewWillLeave(){
//   console.log("ionViewWillEnter")
//   this.presentToast("ionViewWillLeave");
// }

// ionViewDidLeave(){
//   console.log("ionViewWillEnter")
//   this.presentToast("ionViewDidLeave");
// }
// ngOnDestroy() {
//   this.presentToast("destroy");
// }

  // startRecording() {
  //   this.androidPermissions
  //     .requestPermissions([
  //       this.androidPermissions.PERMISSION.RECORD_AUDIO,
  //       // this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
  //       this.androidPermissions.PERMISSION.READ_MEDIA_AUDIO,
  //     ])
  //     .then(
  //       (response: any) => {
  //         const options: CaptureAudioOptions = {
  //           limit: 1,
  //           duration: 30, 
  //           // mediaType: this.mediaCapture.MediaType.AUDIO,
  //         };

  //         this.mediaCapture.captureAudio(options)
  //           .then(
  //             (data: any) => {
                
  //               const filepath = data[0].fullPath;
  //               this.mediaObject = this.media.create(filepath);
                
  //             },
  //             (error: CaptureError) => console.error('Error capturing audio', error)
  //           );
  //       },
  //       (error: any) => console.log('Error requesting permissions', error)
  //     );
  // }

  // startRecording() {
  //   const filepath = 'internal://test/recordings/abc.mp3';
  //   this.mediaObject = this.media.create(filepath);
  //   this.mediaObject.startRecord();
  // }

  // uploadFile() {
  //   const fileTransfer: FileTransferObject = this.transfer.create();
  
  //   // Get the file path using Cordova File plugin
  //   this.file.resolveLocalFilesystemUrl('path/to/your/file.txt')
  //     .then((data) => {
  //       const filePath = data.toURL();
  
  //       // Specify the server URL for file upload
  //       const serverUrl = 'https://example.com/upload';
  
  //       // Options for the file upload (customize based on your needs)
  //       const options = {
  //         fileKey: 'file',
  //         fileName: 'myfile.txt',
  //         chunkedMode: false,
  //         mimeType: 'text/plain',
  //         headers: {}
  //       };
  
  //       // Perform the file upload
  //       fileTransfer.upload(filePath, serverUrl, options)
  //         .then((data) => {
  //           // Success callback
  //           console.log('File uploaded successfully:', data.response);
  //         })
  //         .catch((error) => {
  //           // Error callback
  //           console.error('Error uploading file:', error);
  //         });
  //     })
  //     .catch((error) => {
  //       console.error('Error resolving file path:', error);
  //     });
  // }

  // async pickAttachment() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: "Select Image source",
  //     mode:"ios",
  //     buttons: [
  //       {
  //       text: 'Load from Library',
  //       handler: () => {
  //         this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
  //       }
  //     }, 
  //     {
  //       text: 'Use Camera',
  //       handler: () => {
  //         this.pickImage(this.camera.PictureSourceType.CAMERA);
  //       }
  //      },
  //      {
  //       text: 'Use Albun',
  //       handler: () => {
  //         this.pickImage(this.camera.PictureSourceType.SAVEDPHOTOALBUM);
  //       }
  //      },
  //      {
  //       text: 'Cancel',
  //       role: 'cancel'
  //     }
  //   ]
  //   });
  //   await actionSheet.present();
  //      }


      //  pickImage(sourceType:any) {
      //   const options: CameraOptions  = {
      //   quality: 60,
      //   sourceType: sourceType,
      //   destinationType: this.camera.DestinationType.DATA_URL,
      //   encodingType: this.camera.EncodingType.JPEG,
      //   mediaType: this.camera.MediaType.PICTURE
      //   }
      //   this.camera.getPicture(options).then((imageData:any) => {
      //       this.attachedFileName = 'data:image/jpeg;base64,' + imageData;
      //   }, (err:any) => {
      // });
  
      //   }
      
        // convertFileToBase64(filePath: string) {
        //   this.file.resolveLocalFilesystemUrl(filePath)
        //     .then((fileEntry) => {
        //       fileEntry.file((file: { name: string; }) => {
        //         const reader = new FileReader();
        //         reader.onloadend = () => {
        //           const base64String = reader.result as string;
        //           console.log('Base64 representation of the chosen file:', base64String);
        //           // Now you can use base64String as needed, e.g., upload it to a server
        //         };
      
        //         const fileReader = new FileReader();
        //         fileReader.onloadend = () => {
        //           reader.readAsDataURL(new Blob([fileReader.result]));
        //         };
      
        //         this.file.readAsArrayBuffer(fileEntry.nativeURL, file.name)
        //           .then((arrayBuffer) => {
        //             fileReader.readAsArrayBuffer(new Blob([arrayBuffer]));
        //           })
        //           .catch((error) => {
        //             console.error('Error reading file as array buffer:', error);
        //           });
        //       });
        //     })
        //     .catch((error) => {
        //       console.error('Error resolving file path:', error);
        //     });
        // }


        // convertFileToBase64(filePath: string) {
        //   this.file.resolveLocalFilesystemUrl(filePath)
        //     .then(fileEntry => {
        //       if(fileEntry.isFile){

        //       }
        //       fileEntry.file((file: any) => {
        //         const reader = new FileReader();
        //         reader.onloadend = () => {
        //           const base64String = reader.result as string;
        //           console.log('Base64 representation of the chosen file:', base64String);
        //           // Now you can use base64String as needed, e.g., upload it to a server
        //         };
      
        //         const blob = new Blob([file], { type: file.type });
        //         reader.readAsDataURL(blob);
        //       });
        //     })
        //     .catch(error => {
        //       console.error('Error resolving file path:', error);
        //     });
        // }

        // convertFileToBase64(filePath: string) {
        //   this.file.resolveLocalFilesystemUrl(filePath)
        //     .then(fileEntry => {
        //       const reader = new FileReader();
        //       reader.onloadend = () => {
        //         const base64String = reader.result as string;
        //         console.log('Base64 representation of the chosen file:', base64String);
        //         this.presentToast(base64String);
        //         // Now you can use base64String as needed, e.g., upload it to a server
        //       };
      
        //       this.file.readAsArrayBuffer(fileEntry.nativeURL, '')
        //         .then(arrayBuffer => {
        //           reader.readAsDataURL(new Blob([arrayBuffer]));
        //         })
        //         .catch(error => {
        //           console.error('Error reading file as array buffer:', error);
        //           this.presentToast('Error reading file as array buffer:'+ error);
        //         });
        //     })
        //     .catch(error => {
        //       console.error('Error resolving file path:', error);
        //       this.presentToast('Error resolving file path:'+ error);
        //     });
        // }

        // convertFileToBase64(filePath: string) {
        //   this.file.readAsArrayBuffer(this.file.externalRootDirectory, filePath.split('/').pop())
        //     .then(arrayBuffer => {
        //       const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        //       const reader = new FileReader();
        //       reader.onloadend = () => {
        //         const base64String = reader.result as string;
        //         console.log('Base64 representation of the chosen file:', base64String);
        //         // Now you can use base64String as needed, e.g., upload it to a server
        //       };
        //       reader.readAsDataURL(blob);
        //     })
        //     .catch(error => {
        //       console.error('Error reading file as array buffer:', error);
        //     });
        // }

        // convertFileToBase64(filePath: string) {
        //   this.file.resolveLocalFilesystemUrl(filePath)
        //     .then(fileEntry => {
        //       if (fileEntry.isFile) {
        //         const reader = new FileReader();
        //         reader.onloadend = () => {
        //           const base64String = reader.result as string;
        //           console.log('Base64 representation of the chosen file:', base64String);
        //           this.presentToast('Base64 representation of the chosen file:'+base64String);
        //         };
      
        //         this.file.readAsArrayBuffer(filePath, '')
        //           .then(arrayBuffer => {
        //             const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        //             reader.readAsDataURL(blob);
        //           })
        //           .catch(error => {
        //             console.error('Error reading file as array buffer:', error);
        //             this.presentToast('Error reading file as array buffer:'+ error);
        //           });
        //       } else {
        //         console.error('Selected file is not a valid file');
        //         this.presentToast('Selected file is not a valid file');
        //       }
        //     })
        //     .catch(error => {
        //       console.error('Error resolving file path:', error);
        //       this.presentToast('Error resolving file path:'+ error);
        //     });
        // }


        // convertFileToBase64(filePath: string) {
        //   this.file.readAsDataURL(filePath,'')
        //     .then(base64String => {
        //       console.log('Base64 representation of the chosen file:', base64String);
        //       this.presentToast('Base64 representation of the chosen file: ' + base64String);
        //     })
        //     .catch(error => {
        //       console.error('Error reading file as base64:', error);
        //       this.presentToast('Error reading file as base64: ' + error);
        //     });
        // }

        // convertFileToBase64(filePath: string | any) {
        //   if (typeof filePath !== 'string') {
        //     console.error('Invalid file path:', filePath);
        //     this.presentToast('Invalid file path');
        //     return;
        //   }
        
        //   this.file.readAsArrayBuffer(filePath, '')
        //     .then(arrayBuffer => {
        //       const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        //       const reader = new FileReader();
        //       reader.onloadend = () => {
        //         const base64String = reader.result as string;
        //         console.log('Base64 representation of the chosen file:', base64String);
        //         this.presentToast('Base64 representation of the chosen file:' + base64String);
        //       };
        //       reader.readAsDataURL(blob);
        //     })
        //     .catch(error => {
        //       console.error('Error reading file as array buffer:', error);
        //       this.presentToast('Error reading file as array buffer:' + error);
        //     });
        // }

        // convertFileToBase64(filePath: string) {
        //   console.log('File path:', filePath);
        
        //   if (typeof filePath !== 'string') {
        //     console.error('Invalid file path:', filePath);
        //     this.presentToast('Invalid file path');
        //     return;
        //   }
        
        //   this.file.readAsDataURL(filePath,'')
        //     .then(base64String => {
        //       console.log('Base64 representation of the chosen file:', base64String);
        //       this.presentToast('Base64 representation of the chosen file: ' + base64String);
        //     })
        //     .catch(error => {
        //       console.error('Error reading file as base64:', error);
        //       this.presentToast('Error reading file as base64: ' + JSON.stringify(error));
        //     });
        // }

        // downloadbase64() {
  //   if (this.base64 !== "") {
  //     try {
  //       const detectedFileType = fileType(Buffer.from(this.base64, 'base64'));
  
  //       if (detectedFileType) {
  //         const mimeType = detectedFileType.mime;
  //         const fileExtension = detectedFileType.ext;
  //         const fileName = filename.${fileExtension};
  //         // Use the detected MIME type and file extension
  //         this.downloadFileFromBase64(this.base64, fileName, mimeType);
  //       } else {
  //         console.error('Could not detect file type.');
  //         this.presentToast('Error: Could not detect file type.');
  //       }
  //     } catch (error) {
  //       console.error('Error in downloadbase64:', error);
  //       this.presentToast('Error downloading file. Check the console for details.');
  //     }
  //   } else {
  //     this.presentToast('First make a Base64 of this file.');
  //   }
  // }

  // downloadbase64() {
  //   if (this.base64 !== "") {
  //     try {
  //       const detectedFileType = fileType(Buffer.from(this.base64, 'base64'));
  
  //       if (detectedFileType) {
  //         const mimeType = detectedFileType.mime;
  //         const fileExtension = detectedFileType.ext;
  
  //         const fileName = filename.${fileExtension};
  //         this.downloadFileFromBase64(this.base64, fileName, mimeType);
  //       } else {
  //         console.error('Could not detect file type.');
  //         this.presentToast('Error: Could not detect file type.');
  //       }
  //     } catch (error) {
  //       console.error('Error in downloadbase64:', error);
  //       this.presentToast('Error downloading file. Check the console for details.');
  //     }
  //   } else {
  //     this.presentToast('First make a Base64 of this file.');
  //   }
  // }
    // async checkPermission() {
  //   try {
  //     const hasPermission = await this.speechRecognition.hasPermission();
  
  //     if (!hasPermission) {
  //       await this.speechRecognition.requestPermission();
  //     }
  
  //     this.recognizeVoice();
  //   } catch (err) {
  //     console.error('Speech Recognition Permission Error:', err);
  //   }
  // }
  
  // async recognizeVoice() {
  //   try {
  //     const matches: string[] = await this.speechRecognition.startListening().toPromise;
  //     const recognizedText = matches.join(' ');
  //     console.log('Recognized Text:', recognizedText);
  //   }
    
  //   catch (err) {
  //     console.error('Speech Recognition Error:', err);
  //   }
  // }

  // recognizeVoice() {
  //   this.androidPermissions
  //     .requestPermissions([
  //       this.androidPermissions.PERMISSION.RECORD_AUDIO,
  //       this.androidPermissions.PERMISSION.READ_MEDIA_AUDIO,
  //     ])
  //     .then(
  //       (response: any) => {
  //         this.startCustomRecognition();
  //       },
  //       (error: any) => console.log('Error requesting permissions', error)
  //     );
  // }

  // startCustomRecognition() {
  //   if (this.recognition) {
  //     this.recognition.abort(); // Abort the existing recognition if it's running
  //   }

  //   this.recognition = new (window as any).webkitSpeechRecognition();
  //   this.recognition.lang = 'en-US';

  //   this.recognition.onresult = (event: any) => {
  //     const recognizedText = event.results[0][0].transcript;
  //     console.log('Custom Recognition Text:', recognizedText);
  //     this.presentToast('Custom Recognition Text: ' + recognizedText);
  //     this.recognisedtext = recognizedText;
  //   };

  //   this.recognition.onerror = (event: any) => {
  //     console.error('Custom Recognition Error:', event.error);
  //     this.presentToast('Custom Recognition Error:' + event.error);
  //   };

  //   this.recognition.onend = () => {
  //     console.log('Custom Recognition Ended');
  //     this.presentToast('Custom Recognition Ended');
  //   };

  //   this.recognition.start();
  // }

// **********
  // recognizeVoice() {
  //   this.androidPermissions
  //     .requestPermissions([
  //       this.androidPermissions.PERMISSION.RECORD_AUDIO,
  //       this.androidPermissions.PERMISSION.READ_MEDIA_AUDIO,
  //     ])
  //     .then(
  //       (response: any) => {
  //         this.startCustomRecognition().then((recognizedText: string) => {
  //           // Now you can use the recognized text immediately
  //           console.log('Recognized Text:', recognizedText);
  //           this.presentToast('Recognized Text: ' + recognizedText);
  //           this.recognisedtext = recognizedText;
  //         });
  //       },
  //       (error: any) => console.log('Error requesting permissions', error)
  //     );
  // }

  // startCustomRecognition(): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     if (this.recognition) {
  //       this.recognition.abort(); // Abort the existing recognition if it's running
  //     }

  //     this.recognition = new (window as any).webkitSpeechRecognition();
  //     this.recognition.lang = 'en-US';

  //     this.recognition.onresult = (event: any) => {
  //       const recognizedText = event.results[0][0].transcript;
  //       resolve(recognizedText); // Resolve the promise with recognized text
  //     };

  //     this.recognition.onerror = (event: any) => {
  //       reject('Custom Recognition Error:' + event.error); // Reject the promise with an error
  //     };

  //     this.recognition.onend = () => {
  //       console.log('Custom Recognition Ended');
  //       reject('Custom Recognition Ended'); // Reject the promise if recognition ends without results
  //     };

  //     this.recognition.start();
  //   });
  // }
// *********
  // recognizeVoice() {
  //   this.androidPermissions
  //     .requestPermissions([
  //       this.androidPermissions.PERMISSION.RECORD_AUDIO,
  //       this.androidPermissions.PERMISSION.READ_MEDIA_AUDIO,
  //     ])
  //     .then(
  //       (response: any) => {
  //         this.startCustomRecognition();
  //       },
  //       (error: any) => 
  //       // console.log('Error requesting permissions', error)
  //       this.presentToast('Error requesting permissions'+error)
  //     );
  // }

  // startCustomRecognition() {
  //   const recognition = new (window as any).webkitSpeechRecognition();
  //   recognition.lang = 'en-US';

  //   recognition.onresult = (event: any) => {
  //     const recognizedText = event.results[0][0].transcript;
  //     console.log('Custom Recognition Text:', recognizedText);
  //     this.presentToast(recognizedText);
  //     this.recognisedtext = recognizedText;
  //   };

  //   recognition.onerror = (event: any) => {
  //     console.error('Custom Recognition Error:', event.error);
  //     this.presentToast('Custom Recognition Error:' + event.error);
  //   };

  //   recognition.onend = () => {
  //     console.log('Custom Recognition Ended');
  //     this.presentToast('Custom Recognition Ended');
  //   };

  //   recognition.start();
  // }

  // downloadFileFromBase64(mybase64: string,  fileType: string) {
  //   const blob = this.dataURItoBlob(mybase64, fileType);
  
  //   this.platform.ready().then(() => {
  //     const filePath = this.file.dataDirectory; // or another directory you prefer
  //     const fileFullPath = filePath ;
  
  //     this.file.writeFile(filePath, '', blob, {
  //        replace: true 
  //       }).then(() => {
  //       console.log('File downloaded successfully at: ' + fileFullPath);
  //       this.presentToast('File downloaded successfully at: ' + fileFullPath);
  //     }).catch(err => {
  //       console.error('Error writing file: ' + err);
  //       this.presentToast('Error writing file: ' + err);
  //     });
  //   });
  // }
  // dataURItoBlob(dataURI: string, fileType: string): Blob {
  //   const byteString = atob(dataURI.split(',')[1]);
  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);
  
  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  
  //   return new Blob([ab], { type: fileType });
  // }
  
}