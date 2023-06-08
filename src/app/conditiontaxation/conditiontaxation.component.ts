import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import * as xml2js from 'xml2js'

@Component({
  selector: 'app-conditiontaxation',
  templateUrl: './conditiontaxation.component.html',
  styleUrls: ['./conditiontaxation.component.css']
})
export class ConditiontaxationComponent {
   conditionTaxations:  any[] = [];  
  
  constructor(private _http: HttpClient) { this.loadXML(); }  
  async loadXML() {  
    const parser = new xml2js.Parser();
    // Charger le fichier conditionTaxation.xml
    const conditionTaxationseXML = await this.loadXMLFile('assets/conditiontaxation.xml');
    const conditionTaxationsJSON = await parser.parseStringPromise(conditionTaxationseXML);
    this.conditionTaxations = conditionTaxationsJSON.ServiceResponse.Response[0].Object[0].ObjectConditionTaxation
  }

  loadXMLFile(fileUrl: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', fileUrl, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(xhr.responseText);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          reject(xhr.statusText);
        }
      };
      xhr.send(null);
    });
  }
  getConditionTaxation(idClient: any): any {
    return this.conditionTaxations.find(item => item.idClient[0]._ === idClient);
  }
}

