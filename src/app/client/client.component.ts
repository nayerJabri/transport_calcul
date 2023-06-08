import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LocaliteComponent } from '../localite/localite.component';
import * as xml2js from 'xml2js'
import { getLocaleDirection } from '@angular/common';
import { TarifComponent } from '../tarif/tarif.component';
import { ConditiontaxationComponent } from '../conditiontaxation/conditiontaxation.component';
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent {
  clients: any[] = [];
  selectedResp: any = '';
  selectedExped: any = '';
  selectedDest: any = '';
  Destinataire : any;
  montantHtTarif: number = 0;
  montantTaxe: number = 0;
  montantTotal: number = 0;
  portPaye!: boolean;
  portDu: boolean = true;
  //montantHtTarif: number;
  Expediteur : any;
  onRadioChange(event:any){
      this.selectedResp = event.target.value;    
  }

	selectDest(value: any) {
    this.selectedDest= value.target.value;
    this.Destinataire = this.clients.find(client =>
      client.idClient[0]._ === value.target.value     
    );
  }

	selectExped(value: any) {
    this.selectedExped = value.target.value;
    this.Expediteur = this.clients.find(client =>
      client.idClient[0]._ === value.target.value     
    );    
  }

  constructor(
    private _http: HttpClient,
    private localite: LocaliteComponent,
    private conditiontaxation: ConditiontaxationComponent,
    private tarif: TarifComponent) {
    this.loadXML();
  }

  ngOnInit() {
    this.localite.ngOnInit();
  }
  
  async loadXML() {  
    const parser = new xml2js.Parser();    
    // Charger le fichier client.xml
    const clientXML = await this.loadXMLFile('assets/client.xml');
    const clientJSON = await parser.parseStringPromise(clientXML);
    this.clients = clientJSON.ServiceResponse.Response[0].Object[0].ObjectClient
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
  calculateTotal() {   
    if (this.checkValues()){
      const destinataireZone = this.localite.getLocaliteZone(this.Destinataire.codePostal[0]._);
      const Tarif = this.tarif.getTarif(this.Destinataire.idClient[0]._, destinataireZone)
      
      if(Tarif) {
        //utilise le talif de clientHeritage au lieu de client si il existe
        if(Tarif.idClientHeritage[0]._ !== undefined) {
          const newTarif = this.tarif.getTarif(Tarif.idClientHeritage[0]._, destinataireZone)
          this.montantHtTarif = parseFloat(newTarif.montant[0]._); 
        }
        this.montantHtTarif = parseFloat(Tarif.montant[0]._); 
      } else {
        const TarifzoneInferieur = this.tarif.getTarif(this.Destinataire.idClient[0]._, (parseInt(destinataireZone, 10) - 1).toString())
        if(TarifzoneInferieur) {
          this.montantHtTarif = parseFloat(TarifzoneInferieur.montant[0]._); 
        } else {
          // Tarif de client générale
          const TarifGenral = this.tarif.getTarif('0', destinataireZone)
          if(TarifGenral) {
            this.montantHtTarif = parseFloat(TarifGenral.montant[0]._); 
          } else {
            // zone de client générale n'existe pas
            const TarifzoneInferieur = this.tarif.getTarif('0', (parseInt(destinataireZone, 10) - 1).toString())
            this.montantHtTarif = parseFloat(TarifzoneInferieur.montant[0]._); 
          }
        }
      }
      let user
      if(this.selectedResp === "1") {
            //Expidateur qui paye
          user = this.Expediteur.idClient[0]._
      } else {
            //Destinatiare qui paye
          user = this.Destinataire.idClient[0]._
      }
      const conditionTaxation = this.conditiontaxation.getConditionTaxation(user);
      if(conditionTaxation) {
        
        //si le client posséde condition de taxe
        if(conditionTaxation.useTaxePortDuGenerale[0]._ === 'true') {
          this.montantTaxe = parseFloat(conditionTaxation.taxePortDu[0]._)

        }
        if(conditionTaxation.useTaxePortPayeGenerale[0]._ === 'true'){
          this.montantTaxe = this.montantTaxe + parseFloat(conditionTaxation.taxePortPaye[0]._)
        }
      } else {
        //si le client ne posséde pas condition de taxe on utilise les conditions générales
        const conditionTaxation = this.conditiontaxation.getConditionTaxation(undefined);
        this.montantTaxe = parseFloat(conditionTaxation.taxePortPaye[0]._) + parseFloat(conditionTaxation.taxePortDu[0]._)

      }
      this.montantTotal = this.montantHtTarif + this.montantTaxe
    }
  }

  checkValues(): boolean {
    let colis = (document.getElementById("colis") as  HTMLInputElement).value
    let poid = (document.getElementById("poid") as  HTMLInputElement).value
    
    if((this.selectedExped == '') || (this.selectedDest == '') || (colis.length == 0)
    || (poid.length == 0) ||(this.selectedResp == '')) {
      alert("remplir les champs!");
      return false
    } 
    return true
  }
    
}
