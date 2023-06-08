import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import * as xml2js from 'xml2js'
@Component({
  selector: 'app-localite',
  templateUrl: './localite.component.html',
  styleUrls: ['./localite.component.css']
})
export class LocaliteComponent {
  localites: any[] = [];

  constructor(private _http: HttpClient) { this.loadXML(); }   

  ngOnInit() {}

  async loadXML() {  
    const parser = new xml2js.Parser();
    // Charger le fichier localite.xml
    const localiteXML = await this.loadXMLFile('assets/localite.xml');
    const localiteJSON = await parser.parseStringPromise(localiteXML);
    this.localites = localiteJSON.ServiceResponse.Response[0].Object[0].ObjectLocalite;    
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

  getLocaliteZone(codePostal: string): string {
    const localite = this.localites.find(item => item.codePostal[0]._ === codePostal);    
    return localite ? localite.zone[0]._ : '';
  }
}
