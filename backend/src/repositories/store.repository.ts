import { Prisma, Store } from '@prisma/client';
import prisma from '../prisma';

export class StoreRepository {
  async create(data: Prisma.StoreCreateInput): Promise<Store> {
    return prisma.store.create({ data });
  }

  async findAll(is_deleted: boolean = false): Promise<Store[]> {
    return prisma.store.findMany({
      where: { is_deleted },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number): Promise<Store | null> {
    return prisma.store.findUnique({
      where: { id },
    });
  }

  async findByCode(storeCode: string): Promise<Store | null> {
    return prisma.store.findUnique({
      where: { storeCode },
    });
  }

  async update(id: number, data: Prisma.StoreUpdateInput): Promise<Store> {
    return prisma.store.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Store> {
    return prisma.store.update({
      where: { id },
      data: { is_deleted: true },
    });
  }

  async restore(id: number): Promise<Store> {
    return prisma.store.update({
      where: { id },
      data: { is_deleted: false },
    });
  }
}