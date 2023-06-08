import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import * as xml2js from 'xml2js'
@Component({
  selector: 'app-tarif',
  templateUrl: './tarif.component.html',
  styleUrls: ['./tarif.component.css']
})
export class TarifComponent {
  tarifs:  any[] = [];  
  
  constructor(private _http: HttpClient) { this.loadXML(); }  
  async loadXML() {  
    const parser = new xml2js.Parser();
    // Charger le fichier conditionTaxation.xml
    const tarifXML = await this.loadXMLFile('assets/tarif.xml');
    const tarifsJSON = await parser.parseStringPromise(tarifXML);
    this.tarifs = tarifsJSON.ServiceResponse.Response[0].Object[0].ObjectTarif
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
  getTarif(idClient: string, zone: string): any {
    return this.tarifs.find(item => item.idClient[0]._ === idClient && item.zone[0]._ === zone);    
  }
}
