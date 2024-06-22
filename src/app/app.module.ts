import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from "@angular/material/menu";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from "@angular/material/tabs";

import { MaterialModule } from "../shared/material.module";
import {AppComponent} from "./app.component";

@NgModule({
  declarations: [
  ],
  imports: [
    AppComponent,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MaterialModule,
    HttpClientModule,
    RouterModule,
    BrowserModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: []

})
export class AppModule { }
