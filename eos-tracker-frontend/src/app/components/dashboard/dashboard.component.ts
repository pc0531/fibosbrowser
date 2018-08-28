import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { BlockService } from '../../services/block.service';
import { TransactionService } from '../../services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/takeWhile';
import { environment } from '../../../environments/environment';
// const Eos = require('eosjs');
import Eos from 'eosjs';
import { async } from 'q';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats = [0, 0, 0, 0];
  blocks = null; // Block[]
  transactions = null; // Transaction[]
  producers = null;

  blocksChain = null;

  CNYRate = null;

  FoPrice = null;

  private alive: boolean; // used to unsubscribe from the TimerObservable

  constructor(private dashboardService: DashboardService, private blockService: BlockService, private transactionService: TransactionService, private http: HttpClient) {
    this.alive = true;
  }

  ngOnInit() {

    var config = {
      "chainId": "6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a",
      "producer-name": "eosio",
      "httpEndpoint": "http://ln-rpc.fibos.io:8870",
    };

    var eos = Eos({
      chainId: config.chainId,
      httpEndpoint: config.httpEndpoint,
      logger: {
        log: null,
        error: null
      }
    });


    // let config = {
    //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    //   httpEndpoint: 'http://api.mainnet.eospace.io',
    // };

    // let eos = EOS.Localnet({
    //   chainId: config['chainId'],
    //   keyProvider: config['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'],
    //   httpEndpoint: config['httpEndpoint'],
    //   logger: {
    //     log: null,
    //     error: null
    //   }
    // });

    // function getFOPrice() {
    //   eos.(true, 'eosio.token', 'eosio', 'stats', (err, result) => {
    //     if (!err) {
    //       console.log(result);
    //       var connector = parseFloat(result.rows[0].connector_balance.split('')[0]) + parseFloat(result.rows[0].reserve_connector_balance.split('')[0]);
    //       var supply = parseFloat(result.rows[0].reserve_supply.split('')[0]) + parseFloat(result.rows[0].supply.split('')[0]);
    //       console.log(supply);
    //       var cw = result.rows[0].connector_weight;
    //       var price = connector / (supply * cw);
    //       console.log('PRICE:' + price);
    //       return price;
    //     } else {
    //       console.error('PRICE:' + price);
    //     }
    //   })
    // }



    // TimerObservable.create(0, 2000)
    //   .takeWhile(() => this.alive)
    //   .subscribe(async () => {
    //     this.http.get('https://api.coinmarketcap.com/v1/ticker/eos/?convert=CNY').subscribe(data => {
    //       this.CNYRate = data[0];
    //     });
    //     let price = getFOPrice();
    //     this.FoPrice = this.CNYRate.price_cny * Number(price);
    //   });




    // TODO: move from here and conver to objects https://medium.com/codingthesmartway-com-blog/angular-4-3-httpclient-accessing-rest-web-services-with-angular-2305b8fd654b
    // TimerObservable.create(0, 2000)
    //   .takeWhile(() => this.alive)
    //   .subscribe(() => {

    //     this.http.get(environment.apiUrl + '/blocks?size=20').subscribe(data => {
    //       this.blocks = data;
    //     });
    //   });


    // TimerObservable.create(0, 2000)
    //   .takeWhile(() => this.alive)
    //   .subscribe(() => {

    //     this.http.get(environment.apiUrl + '/transactions?size=20').subscribe(data => {
    //       this.transactions = data;
    //     });
    //   });
    // TimerObservable.create(0, 2000)
    //   .takeWhile(() => this.alive)
    //   .subscribe(() => {

    //     this.http.get(environment.apiUrl + '/stats').subscribe(data => {
    //       this.stats = <number[]>data;
    //     });
    //   });
    // TimerObservable.create(0, 2000)
    //   .takeWhile(() => this.alive)
    //   .subscribe(() => {

    //     this.http.get(environment.apiUrl + '/producers').subscribe(data => {
    //       // for (let key in data) {
    //       //   data[key].num = Number(key) + 1;
    //       // }
    //       this.producers = data;
    //     });
    //   });
    // TimerObservable.create(0, 2000)
    //   .takeWhile(() => this.alive)
    //   .subscribe(() => {
    //     this.http.get(environment.blockchainUrl + '/v1/chain/get_info').subscribe(data => {
    //       this.blocksChain = data;
    //     });
    //   });


    TimerObservable.create(0, 2000)
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.http.get('http://se-rpc.fibos.io:8870/v1/chain/get_info').subscribe(data => {
          this.blocksChain = data;
        });
      });

    TimerObservable.create(0, 1000000000)
      .takeWhile(() => this.alive)
      .subscribe(() => {
        eos.getTableRows(true, 'eosio', 'eosio', 'producers', (err, res) => {
          this.producers = res.rows;
        })
      })
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
