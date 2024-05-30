import { useQuery } from '@tanstack/react-query';

import api from '../../api';
import queryKey from './keys';


const BASE_URL = 'https://fedskillstest.coalitiontechnologies.workers.dev';

const useRead = (options = {}) => {

    const response = useQuery([queryKey.read], () => api.get({ url: `${BASE_URL}` }), {
        ...options,
        onSuccess: () => { },
        onError: () => { },
    });

    return {
        ...response,
        data: (response.data || []) as any
    };
};


const queries = { useRead, };

export default queries;
