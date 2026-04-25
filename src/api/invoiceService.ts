import axiosInstance from './axios';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid';
  createdAt: number;
}

export interface InvoicesResponse {
  items: Invoice[];
  totalCount: number;
  page: number;
  limit: number;
}

const invoiceService = {
  getInvoices: async (params: { page?: number; limit?: number; search?: string; status?: string }) => {
    const response = await axiosInstance.get<InvoicesResponse>('/invoices', { params });
    return response.data;
  },

  getInvoiceById: async (id: string) => {
    const response = await axiosInstance.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (data: { customerName: string; amount: number }) => {
    const response = await axiosInstance.post<Invoice>('/invoices', data);
    return response.data;
  },

  updateInvoice: async (id: string, data: Partial<Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>>) => {
    const response = await axiosInstance.patch<Invoice>(`/invoices/${id}`, data);
    return response.data;
  },

  deleteInvoice: async (id: string) => {
    await axiosInstance.delete(`/invoices/${id}`);
  }
};

export default invoiceService;
