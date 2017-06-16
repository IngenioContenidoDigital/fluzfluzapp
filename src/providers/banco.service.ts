import { Injectable } from '@angular/core';
import { Banco } from '../models/banco';
import { BANCO } from '../data/banco';

@Injectable()
export class BancoService {
  getBanks(): Promise<Banco[]> {
    return Promise.resolve(BANCO);
  }
}