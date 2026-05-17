import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Lead, User, DashboardStats } from '../types';
import { INITIAL_LEADS } from './mockData';

// Constants for LocalStorage
const LEADS_KEY = 'smart_leads_db';
const USERS_KEY = 'smart_leads_users';
const CURRENT_USER_KEY = 'smart_leads_current_user';

// Setup Mock DB in LocalStorage
const initializeMockDB = () => {
  if (!localStorage.getItem(LEADS_KEY)) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(INITIAL_LEADS));
  }
  
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUser: User & { password?: string } = {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah@smartleads.app',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
      password: 'password',
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
  }
};

initializeMockDB();

// Helper to delay response for realistic loading states
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: read and write to LocalStorage
const getLeads = (): Lead[] => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
const setLeads = (leads: Lead[]) => localStorage.setItem(LEADS_KEY, JSON.stringify(leads));

const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const setUsers = (users: any[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};
const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// SET TO true TO RUN STANDALONE IN THE BROWSER (persisting in localStorage)
// SET TO false TO CALL THE ACTUAL EXPRESS SERVER RUNNING ON http://localhost:8080
const USE_STANDALONE_MOCK = false;

// Create Axios Instance — uses VITE_API_URL env var, falls back to localhost for development
export const api = axios.create({
  baseURL: USE_STANDALONE_MOCK
    ? '/api'
    : (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept responses from the real backend to match the structure the frontend expects
if (!USE_STANDALONE_MOCK) {
  api.interceptors.response.use((response) => {
    // Our backend wraps success data in { success: true, data: { ... } }
    if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
      const data = response.data.data;
      
      // Recursively map _id to id to match frontend types
      if (data && data.leads && Array.isArray(data.leads)) {
        data.leads = data.leads.map((lead: { _id?: string; id?: string }) => ({ ...lead, id: lead._id || lead.id }));
      }
      if (data && data.user) {
        data.user.id = data.user._id || data.user.id;
      }

      // Re-assign the data property so the frontend components don't have to change
      response.data = data;
    }
    return response;
  });
}

// Configure Custom Axios Adapter if standalone mode is enabled
if (USE_STANDALONE_MOCK) {
  api.defaults.adapter = async (config) => {
    await delay(500); // Simulate network latency

  const { url, method, params, data, headers } = config;
  const normalizedUrl = url?.replace(/^\/api/, '') || '';

  // Check authorization
  const token = headers?.Authorization as string;
  const isAuthPage = normalizedUrl.startsWith('/auth/login') || normalizedUrl.startsWith('/auth/register');
  
  if (!isAuthPage && token !== 'Bearer mock-jwt-token') {
    return Promise.reject({
      response: {
        status: 401,
        statusText: 'Unauthorized',
        data: { message: 'Authentication required' },
      },
    });
  }

  try {
    // ----------------------------------------------------
    // AUTHENTICATION ENDPOINTS
    // ----------------------------------------------------
    if (normalizedUrl === '/auth/login' && method === 'post') {
      const { email, password } = JSON.parse(data || '{}');
      const users = getUsers();
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (!user) {
        return Promise.reject({
          response: {
            status: 400,
            statusText: 'Bad Request',
            data: { message: 'Invalid email or password' },
          },
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      
      return {
        data: { token: 'mock-jwt-token', user: userWithoutPassword },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse;
    }

    if (normalizedUrl === '/auth/register' && method === 'post') {
      const { name, email, password, role } = JSON.parse(data || '{}');
      const users = getUsers();
      
      if (users.some((u: any) => u.email === email)) {
        return Promise.reject({
          response: {
            status: 400,
            statusText: 'Bad Request',
            data: { message: 'Email already exists' },
          },
        });
      }

      // Choose a avatar based on role or name
      const avatarUrl = role === 'ADMIN' 
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120';

      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: role || 'SALES_USER',
        avatarUrl,
        password,
      };

      users.push(newUser);
      setUsers(users);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);

      return {
        data: { token: 'mock-jwt-token', user: userWithoutPassword },
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      } as AxiosResponse;
    }

    if (normalizedUrl === '/auth/me' && method === 'get') {
      const user = getCurrentUser();
      if (!user) {
        return Promise.reject({
          response: {
            status: 401,
            statusText: 'Unauthorized',
            data: { message: 'Session expired' },
          },
        });
      }
      return {
        data: { user },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse;
    }

    if (normalizedUrl === '/auth/logout' && method === 'post') {
      setCurrentUser(null);
      return {
        data: { message: 'Logged out successfully' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse;
    }

    // ----------------------------------------------------
    // LEADS ENDPOINTS
    // ----------------------------------------------------
    if (normalizedUrl.startsWith('/leads') && method === 'get') {
      const allLeads = getLeads();

      // Get stats
      const stats: DashboardStats = {
        totalLeads: allLeads.length,
        qualified: allLeads.filter((l) => l.status === 'Qualified').length,
        contacted: allLeads.filter((l) => l.status === 'Contacted').length,
        lost: allLeads.filter((l) => l.status === 'Lost').length,
      };

      // Filter and Sort leads
      let filteredLeads = [...allLeads];

      const { q, status, source, sort, page = '1', limit = '6' } = params || {};

      // Text search (name, email)
      if (q) {
        const query = q.toLowerCase();
        filteredLeads = filteredLeads.filter(
          (l) => l.name.toLowerCase().includes(query) || l.email.toLowerCase().includes(query)
        );
      }

      // Status filter
      if (status && status !== 'All Status') {
        filteredLeads = filteredLeads.filter((l) => l.status === status);
      }

      // Source filter
      if (source && source !== 'All Sources') {
        filteredLeads = filteredLeads.filter((l) => l.source === source);
      }

      // Sorting
      if (sort === 'Newest') {
        filteredLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sort === 'Oldest') {
        filteredLeads.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }

      // Pagination
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const totalCount = filteredLeads.length;
      const totalPages = Math.ceil(totalCount / limitNum);
      const offset = (pageNum - 1) * limitNum;
      const paginatedLeads = filteredLeads.slice(offset, offset + limitNum);

      return {
        data: {
          leads: paginatedLeads,
          stats,
          pagination: {
            page: pageNum,
            limit: limitNum,
            totalCount,
            totalPages,
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse;
    }

    if (normalizedUrl === '/leads' && method === 'post') {
      const { name, email, status, source } = JSON.parse(data || '{}');
      
      if (!name || !email) {
        return Promise.reject({
          response: {
            status: 400,
            statusText: 'Bad Request',
            data: { message: 'Name and email are required fields' },
          },
        });
      }

      const allLeads = getLeads();
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name,
        email,
        status: status || 'New',
        source: source || 'Website',
        createdAt: new Date().toISOString(),
      };

      allLeads.unshift(newLead); // Add to the top
      setLeads(allLeads);

      return {
        data: newLead,
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      } as AxiosResponse;
    }

    // Single lead matching /leads/:id
    const leadIdMatch = normalizedUrl.match(/^\/leads\/([a-zA-Z0-9-]+)$/);
    if (leadIdMatch) {
      const leadId = leadIdMatch[1];
      const allLeads = getLeads();
      const leadIndex = allLeads.findIndex((l) => l.id === leadId);

      if (leadIndex === -1) {
        return Promise.reject({
          response: {
            status: 404,
            statusText: 'Not Found',
            data: { message: 'Lead not found' },
          },
        });
      }

      if (method === 'put') {
        const updates = JSON.parse(data || '{}');
        const updatedLead = { ...allLeads[leadIndex], ...updates };
        
        allLeads[leadIndex] = updatedLead;
        setLeads(allLeads);

        return {
          data: updatedLead,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }

      if (method === 'delete') {
        const filteredLeads = allLeads.filter((l) => l.id !== leadId);
        setLeads(filteredLeads);

        return {
          data: { success: true },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as AxiosResponse;
      }
    }

    // Default 404 for unknown endpoints
    return Promise.reject({
      response: {
        status: 404,
        statusText: 'Not Found',
        data: { message: 'Endpoint not found' },
      },
    });

  } catch (error: any) {
    return Promise.reject({
      response: {
        status: 500,
        statusText: 'Internal Server Error',
        data: { message: error.message || 'Something went wrong' },
      },
    });
  }
};
}
