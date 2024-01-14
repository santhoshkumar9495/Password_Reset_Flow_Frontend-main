import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../global";
import {getUsername} from "../api/user.api";




/** custom hook */
export default function useFetch(query){
    const [getData, setData] = useState({ isLoading : false, apiData: undefined, status: null, serverError: null })
    useEffect(() => {
        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true}));
                const { username } = !query ? await getUsername() : '';
                
                const { data, status } =!query ? await axios.get(`${API}/api/user/${username}`) : await axios.get(`${API}/api/${query}`);

                if(status === 201){
                    setData(prev => ({ ...prev, isLoading: false}));
                    setData(prev => ({ ...prev, apiData : data, status: status }));
                }

                setData(prev => ({ ...prev, isLoading: false}));
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        };
        fetchData()

    }, [query]);

    return [getData, setData];
}