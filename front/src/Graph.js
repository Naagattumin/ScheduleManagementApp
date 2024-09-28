import axios from 'axios';
import { useEffect, useState } from 'react';
import { prefixApi } from "./Connector";

import { LineChart } from '@mui/x-charts/LineChart';

export default function Graph() {

    const [data, setData] = useState();

    const [loading, setLoading] = useState(true);

    function GetChartData() {
        return axios.get(`${prefixApi}/get_chart_data`)
        .then(response => {
            console.log("🐾get_chart_data_then🐾", response.data);//////////
            return response.data;
        })
        .catch(error => {
            console.error("🐾!!!get_chart_data_catch🐾", error);
        });
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            setData(await GetChartData());
        })();
    }, []);

    useEffect(() => {
        if (data === undefined) {
            console.log("🐾tasks is undefined🐾");//////////
            return;
        }

        setLoading(false);
        console.log("🐾data🐾", data);//////////
    }, [data]);

    if (loading) {
        return <h1>Loading...</h1>;
    }


    return (
        <LineChart style={{ textAlign: "center", width: '100%' }}
            xAxis={[{ 
                data: data[0], 
                reverse: true, 
                label: '日前', // x軸のラベル
            }]}
            series={[
                {
                    data: data[1],
                },
            ]}
            width={500}
            height={300}
        />
    );
}