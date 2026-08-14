import { customerRepository } from "../repositories/customer.repository";
import { Prisma, Customer } from "@prisma/client";
import { CustomerFilter } from "../types/customers";

export class CustomerService {
  async getAllCustomers(filters?: CustomerFilter): Promise<Customer[]> {
    return await customerRepository.findAll(filters);
  }

  async getCustomerById(id: string) {
    const customer = await customerRepository.findById(BigInt(id));
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }

  async createCustomer(data: any) {
    // Validate phone unique
    const existing = await customerRepository.findByPhone(data.phone_number);
    if (existing) {
      throw new Error("Phone number already exists");
    }

    const customerInput: Prisma.CustomerCreateInput = {
      phone_number: data.phone_number,
      full_name: data.full_name,
      email: data.email,
      gender: data.gender,
      date_of_birth: data.date_of_birth
        ? new Date(data.date_of_birth)
        : undefined,
      status: data.status || "ACTIVE",
    };

    return await customerRepository.create(customerInput);
  }

  async updateCustomer(id: string, data: any) {
    const customer = await customerRepository.findById(BigInt(id));
    if (!customer) {
      throw new Error("Customer not found");
    }

    if (data.phone_number && data.phone_number !== customer.phone_number) {
      const existing = await customerRepository.findByPhone(data.phone_number);
      if (existing) {
        throw new Error("Phone number already exists");
      }
    }

    const updateInput: Prisma.CustomerUpdateInput = {
      phone_number: data.phone_number,
      full_name: data.full_name,
      email: data.email,
      gender: data.gender,
      date_of_birth: data.date_of_birth
        ? new Date(data.date_of_birth)
        : undefined,
      status: data.status,
    };

    return await customerRepository.update(BigInt(id), updateInput);
  }

  async deleteCustomer(id: string): Promise<Customer> {
    const customerId = BigInt(id);
    await this.getCustomerById(id);
    return await customerRepository.delete(customerId);
  }

  async restoreCustomer(id: string): Promise<Customer> {
    const customerId = BigInt(id);
    await this.getCustomerById(id);
    return await customerRepository.restore(customerId);
  }

  async getCustomerByPhone(phone: string) {
    return await customerRepository.findByPhone(phone);
  }
}

export const customerService = new CustomerService();
