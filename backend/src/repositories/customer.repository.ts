import prisma from "../prisma";
import { Prisma, Customer } from "@prisma/client";
import { CustomerFilter } from "../types/customers";
export class CustomerRepository {
  async findAll(filters?: CustomerFilter): Promise<Customer[]> {
    // Khởi tạo điều kiện mặc định
    const whereCondition: Prisma.CustomerWhereInput = {
      is_deleted: filters?.is_deleted || false,
    };

    // Tìm theo Email
    if (filters?.email) {
      whereCondition.email = { contains: filters.email, mode: "insensitive" };
    }

    // Tìm theo tên
    if (filters?.full_name) {
      whereCondition.full_name = {
        contains: filters.full_name,
        mode: "insensitive",
      };
    }

    // Tìm chính xác theo Customer ID
    if (filters?.customer_id) {
      whereCondition.customer_id = BigInt(filters.customer_id);
    }

    // 4. Lọc theo trạng thái (Active/Inactive)
    if (filters?.status) {
      whereCondition.status = filters.status;
    }

    // Lọc theo phân loại khách hàng
    if (filters?.segment_id) {
      whereCondition.segments = {
        some: {
          segment_id: Number(filters.segment_id), // Nhớ check kiểu dữ liệu của segment_id trong schema, dùng Number hoặc BigInt tùy DB của bạn
        },
      };
    }

    return prisma.customer.findMany({
      where: whereCondition,
      orderBy: { created_at: "desc" },
      include: {
        tier: true,
      },
    });
  }

  async findById(id: bigint): Promise<any> {
    return prisma.customer.findUnique({
      where: { customer_id: id },
      include: { 
        tier: true,
        vouchers: {
          where: { status: "active" },
          orderBy: { expired_at: "asc" }
        }
      },
    });
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return prisma.customer.findUnique({
      where: { phone_number: phone },
      include: { 
        tier: true,
        vouchers: {
          where: { status: "active" },
          orderBy: { expired_at: "asc" }
        }
      },
    });
  }

  async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
    return prisma.customer.create({
      data,
    });
  }

  async update(
    id: bigint,
    data: Prisma.CustomerUpdateInput,
  ): Promise<Customer> {
    return prisma.customer.update({
      where: { customer_id: id },
      data,
    });
  }

  async delete(id: bigint): Promise<Customer> {
    return prisma.customer.update({
      where: { customer_id: id },
      data: { is_deleted: true },
    });
  }

  async restore(id: bigint): Promise<Customer> {
    return prisma.customer.update({
      where: { customer_id: id },
      data: { is_deleted: false },
    });
  }
}

export const customerRepository = new CustomerRepository();
