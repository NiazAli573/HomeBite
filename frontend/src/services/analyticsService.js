import api from './api';

const analyticsService = {
    getAdminStats: async () => {
        const response = await api.get('/analytics/stats/');
        return response.data;
    },
};

export default analyticsService;
