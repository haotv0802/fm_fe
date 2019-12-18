import { Component, OnInit } from '@angular/core';
import {ExpensesService} from './expenses.service';
import {Observable} from "rxjs/Rx";

@Component({
  selector: 'app-cities',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {

  cityList = [ { city_name: "Bandung", prov_name: "Jawa Barat" },
               { city_name: "Jakarta", prov_name: "DKI Jakarta" },
               { city_name: "Surabaya", prov_name: "Jawa Timur" },
               { city_name: "Yogyakarta", prov_name: "DI Yogyakarta" },
               { city_name: "Semarang", prov_name: "Jawa Tengah" },
               { city_name: "Medan", prov_name: "Sumatera Utara" },
               { city_name: "Tangerang", prov_name: "Banten" },
               { city_name: "Denpasar", prov_name: "Bali" },
               { city_name: "Makasar", prov_name: "Sulawesi Selatan" }];

  constructor(
    private _expensesService: ExpensesService,
  ) { }

  ngOnInit() {
    console.log("City Component Init");
    Observable.forkJoin(
      this._expensesService.getExpenses()
    ).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    )
    ;
  }
}
