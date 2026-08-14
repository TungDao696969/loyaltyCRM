import { Store, StoreStatus } from '@prisma/client';
import crypto from 'crypto';
import { StoreRepository } from '../repositories/store.repository';

export class StoreService {
  private storeRepository: StoreRepository;

  constructor() {
    this.storeRepository = new StoreRepository();
  }

  async createStore(data: { storeCode: string; storeName: string; address: string; status?: StoreStatus }): Promise<Store> {
    // Kiểm tra trùng lặp mã cửa hàng
    const existingStore = await this.storeRepository.findByCode(data.storeCode);
    if (existingStore) {
      throw new Error('Store code already exists');
    }

    // Tự động sinh apiKey bằng thư viện crypto có sẵn của Node.js
    const apiKey = crypto.randomUUID();

    return this.storeRepository.create({
      ...data,
      apiKey,
      status: data.status || 'ACTIVE',
    });
  }

  async getAllStores(is_deleted: boolean = false): Promise<Store[]> {
    return this.storeRepository.findAll(is_deleted);
  }

  async getStoreById(id: number): Promise<Store | null> {
    const store = await this.storeRepository.findById(id);
    if (!store) throw new Error('Store not found');
    return store;
  }

  async updateStore(id: number, data: Partial<{ storeName: string; address: string; status: StoreStatus }>): Promise<Store> {
    // Đảm bảo cửa hàng có tồn tại trước khi update
    await this.getStoreById(id);
    
    return this.storeRepository.update(id, data);
  }

  async deleteStore(id: number): Promise<Store> {
    await this.getStoreById(id);
    return this.storeRepository.delete(id);
  }

  async restoreStore(id: number): Promise<Store> {
    await this.getStoreById(id);
    return this.storeRepository.restore(id);
  }
}