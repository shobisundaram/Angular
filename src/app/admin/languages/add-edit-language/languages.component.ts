import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Language } from '../../../@theme/interface/interface';
import { DataService } from '../../data.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { ApiService } from '../../api.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {
  dataServiceSubscition: any;
  languageForm: FormGroup;
  checked: boolean = false;
  constructor(
    private dataService: DataService,
    private ActivatedRoute: ActivatedRoute,
    private location: Location,
    private toasterService: NbToastrService,
    private apiservice: ApiService,
  ) { }

  ngOnInit(): void {
    this.initializeLanguageForm();
    this.patchLanguageForm();
  }
  ngOnDestroy(): void {
    this.dataServiceSubscition.unsubscribe();
  }
  get indexName() {
    return this.languageForm.get("indexName");
  }
  get name() {
    return this.languageForm.get("name");
  }
  get file() {
    return this.languageForm.get("file");
  }
  get status() {
    return this.languageForm.get("status");
  }
  initializeLanguageForm(){
    this.languageForm = new FormGroup({
      id: new FormControl(""),
      indexName: new FormControl("", [
        Validators.required,
        Validators.pattern("[a-z]{2}( [a-z]{2})?"),
      ]),
      name: new FormControl("", [
        Validators.required,
        Validators.pattern("[a-zA-Z ]*"),
      ]),
      file: new FormControl(null, [
        Validators.required,
        this.validateFileType
      ]),
      status: new FormControl(false),
    })
  }
  patchLanguageForm(): void{
    this.dataServiceSubscition = this.dataService
    .getNewRowInfo()
    .subscribe((data) => {
      console.log(data)
      const rowData: Language = data;
      if (JSON.stringify(rowData) !== "{}") {
        const rowData: Language = data;
        this.languageForm.patchValue({
          id: rowData._id,
          indexName: rowData.indexName,
          name: rowData.name,
          file: rowData.file,
          status: rowData.status,
        });
      } else {
        this.dataFetchWhileReload();
      }
    });
  }
  dataFetchWhileReload() {
    let id = this.ActivatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.apiservice.CommonGetApi("module/translation/language/" + id).subscribe((res) => {
        const data = res.data.language[0];
        this.dataService.setNewRowInfo(data);
      });
    }
  }
  onChange(files: FileList) {
    const file = files.item(0);
    this.languageForm.get('file').setValue(file);
  }

  validateFileType(control: FormControl) {
    const file = control.value;
    console.log(file)
    if (file && file.type !== 'application/json') {
      return { invalidFileType: true };
    }
    return null;
  }
  goBackBtn() {
    this.location.back();
  }
  addOrEditLanguage(){
    if(this.languageForm.invalid){
      this.languageForm.markAllAsTouched();
    }else{
      const formData = new FormData();
      formData.append("indexName", this.languageForm.value.indexName);
      formData.append("name", this.languageForm.value.name);
      if(this.languageForm.value.file){
      formData.append("file", this.languageForm.value.file);
      }
      formData.append("status", this.languageForm.value.status);
      if (this.languageForm.value.id) {
        this.apiservice.CommonPostApi(formData,"module/translation/language/"+ this.languageForm.value.id)
        .subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, data.message);
          },
          error: (error) => {
            this.toasterService.danger(error.error.message);
          },
        })
      }else{
        this.apiservice.CommonPostApi(formData,"module/translation/language")
        .subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, data.message);
            this.goBackBtn();
          },
          error: (error) => {
            this.toasterService.danger(error.error.message);
          },
        })
      }
    }
  }
}
