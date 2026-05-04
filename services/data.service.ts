import api from './api.service';

export const dataService = {
  // Stats & Dashboard
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },

  // Sliders
  getSliders: async () => {
    const response = await api.get('/sliders');
    return response.data;
  },

  // News
  getNews: async () => {
    const response = await api.get('/news');
    return response.data;
  },
  
  getNewsDetails: async (id: string) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  // Members
  getMembers: async (params: any = {}) => {
    const response = await api.get('/members', { params });
    return response.data;
  },

  getMemberDetails: async (id: string) => {
    const response = await api.get(`/memberDetails/${id}`);
    return response.data;
  },

  registerMember: async (memberData: any) => {
    const response = await api.post('/members', memberData);
    return response.data;
  },

  // Events
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  getEventDetails: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  registerForEvent: async (registrationData: any) => {
    const response = await api.post('/events/register', registrationData);
    return response.data;
  },

  // Businesses
  getBusinesses: async (params: any = {}) => {
    const response = await api.get('/business', { params });
    return response.data;
  },

  getBusinessDetails: async (id: string) => {
    const response = await api.get(`/business/${id}`);
    return response.data;
  },

  createBusiness: async (data: any) => {
    const response = await api.post('/business', data);
    return response.data;
  },

  getSubscriptionPlans: async () => {
    const response = await api.get('/subscription-plans');
    return response.data;
  },

  // Jobs
  getJobs: async (params: any = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  applyForJob: async (applicationData: any) => {
    const response = await api.post('/jobs/apply', applicationData);
    return response.data;
  },

  // Committee
  getCommittee: async () => {
    const response = await api.get('/committee');
    return response.data;
  },

  // Gallery
  getGallery: async () => {
    const response = await api.get('/gallery');
    return response.data;
  },

  // Villages
  getVillages: async () => {
    const response = await api.get('/villages');
    return response.data;
  },

  // Donations
  getDonations: async () => {
    const response = await api.get('/donations');
    return response.data;
  },

  createDonation: async (donationData: any) => {
    const response = await api.post('/donations/create-order', donationData);
    return response.data;
  },

  // Complaints
  getComplaints: async (memberId: string) => {
    const response = await api.get(`/complaints/member/${memberId}`);
    return response.data;
  },

  createComplaint: async (complaintData: any) => {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  },

  // Polls
  getPolls: async () => {
    const response = await api.get('/polls/active');
    return response.data;
  },

  submitVote: async (voteData: any) => {
    const response = await api.post('/polls/vote', voteData);
    return response.data;
  },

  // FAQ
  getFaqs: async () => {
    const response = await api.get('/faqs');
    return response.data;
  },

  // Page Content
  getPageContent: async (slug: string) => {
    const response = await api.get(`/pages/${slug}`);
    return response.data;
  },

  // Achievements
  getAchievements: async () => {
    const response = await api.get('/achievements');
    return response.data;
  },
};

export default dataService;
