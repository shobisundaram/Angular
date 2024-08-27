import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../@theme/interface/interface';
import { ApiService } from '../../api.service';
import { DataService } from '../../data.service';
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss']
})
export class TranslationComponent implements OnInit {
  dataServiceSubscition: any;
  translationForm: FormGroup;
  groupData: any;
  constructor(
    private apiservice: ApiService,
    private dataService: DataService,
    private location: Location,
    private fb: FormBuilder,
    private toasterService: NbToastrService,
    private ActivatedRoute: ActivatedRoute,
  ) { }

ngOnInit(): void {
  this.initializeLanguageForm();
  this.patchLanguageForm();
  this.getGroupData()
}
ngOnDestroy(): void {
  this.dataServiceSubscition.unsubscribe();
}
  get interpret() {
    console.log(this.translationForm.get("interpret"))
  return this.translationForm.get("interpret");
}

initializeLanguageForm() {
  this.translationForm = this.fb.group({
    id: [''], // Adding id field to the form group
    interpret:[''],
    group: ['']
  });
}
patchLanguageForm(): void {
  this.dataServiceSubscition = this.dataService
    .getNewRowInfo()
    .subscribe((data) => {
      console.log(data)
      const rowData: translation = data;
      if (JSON.stringify(rowData) !== "{}") {
        const rowData: translation = data;
        this.translationForm.patchValue({
          id: rowData._id,
          interpret: rowData.interpret,
          group: rowData.group
        });
      } else {
        this.dataFetchWhileReload();
      }
    });
}
dataFetchWhileReload() {
  let id = this.ActivatedRoute.snapshot.paramMap.get("id");
  if (id) {
    this.apiservice.CommonGetApi("module/translation/"+ id).subscribe((res) => {
      const data = res.data.translations[0];
      this.dataService.setNewRowInfo(data);
    });
  }
}
getGroupData(): void {
  let id = this.ActivatedRoute.snapshot.paramMap.get("id");
  if (id) {
    this.apiservice.CommonGetApi("module/translation/transcribe/" + id).subscribe((res) => {
      this.groupData = res.data.languages;
      this.generateFormFields();
  })
}
}
generateFormFields(): void {
  // Dynamically create form controls based on received data
  this.groupData.forEach(group => {
    console.log(group.transcribe.describe)
    this.translationForm.addControl(group.transcribe.describe, new FormControl(group.transcribe.describe, Validators.required));
  });
}

goBackBtn() {
  this.location.back();
}
addOrEditTranslation(){
  if (this.translationForm.invalid) {
    console.log("is invalid")
    this.translationForm.markAllAsTouched();
  } else {
    const formData = new FormData();
    console.log(this.translationForm.value)
    const transcribeArray = this.groupData.map(group => ({
      language: group._id, // Assuming _id is the language ID
      describe: this.translationForm.value[group.transcribe.describe]
    }));
    let payload = {
      translationId:  this.translationForm.value.id ?  this.translationForm.value.id : null,
      interpret:  this.translationForm.value.interpret,
      group: this.translationForm.value.group ? this.translationForm.value.group._id: null,
      isGroup: this.translationForm.value.group? true : false,
      transcribe: transcribeArray
    };
    console.log(payload)
    // formData.append("translationId", this.translationForm.value.id ? this.translationForm.value.id : null);
    // formData.append("interpret", this.translationForm.value.interpret);
    if (this.translationForm.value.id) {
      this.apiservice.CommonPostApi(payload, "module/translation/transcribe/" + this.translationForm.value.id)
        .subscribe({
          next: (res) => {
            const data = res.data;
            this.toasterService.success(res.type, data.message);
          },
          error: (error) => {
            this.toasterService.danger(error.error.message);
          },
        })
    } else {
      this.apiservice.CommonPostApi(payload, "module/translation/transcribe")
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
