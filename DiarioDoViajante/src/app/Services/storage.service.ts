import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa o storage
  async init() {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
  }

  // Guarda um valor no storage
  async set(key: string, value: any): Promise<void> {
    await this.init();
    return this._storage!.set(key, value);
  }

  // Vai buscar um valor ao storage
  async get(key: string): Promise<any> {
    await this.init();
    return this._storage!.get(key);
  }

  // Remove um valor do storage
  async remove(key: string): Promise<void> {
    await this.init();
    return this._storage!.remove(key);
  }

  // Limpa todo o storage
  async clear(): Promise<void> {
    await this.init();
    return this._storage!.clear();
  }
}