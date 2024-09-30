import axios from 'axios';
import { useEffect, useState } from 'react';
import { prefixApi } from "./Connector";

import { LineChart } from '@mui/x-charts/LineChart';

function Neko() {
    function GetStreakData() {
        return axios.get(`${prefixApi}/get_streak_data`)
        .then(response => {
            console.log("🐾get_streak_data_then🐾", response.data);//////////
            return response.data;
        })
        .catch(error => {
            console.error("🐾!!!get_streak_data_catch🐾", error);
        });
    }

    function handleNekoClick() {
        axios.get(`${prefixApi}/get_dbg_task_data/`)
            .then(response => {
                console.log("🐾tasks🐾", response.data);
                console.log("🐾streak🐾", streakData);
            })
            .catch(error => {
                console.error("🐾!!!get_dbg_task_data_catch🐾", error);
            });

            if (streakData > 2) {
                setStreakData(1);
            } else {
                setStreakData(streakData + 1);
            }
    }

    const [streakData, setStreakData] = useState();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            setLoading(true);
            setStreakData(await GetStreakData());
        })();
    }, []);

    useEffect(() => {
        if (streakData === undefined) {
            console.log("streakData is undefined🐾");//////////
            return;
        }

        setLoading(false);
        console.log("🐾data🐾", streakData);//////////
    }, [streakData]);

    if (loading) {
        return <h1>Loading...</h1>;
    }
    if (streakData === 0) {
        return (
            <></>
        );
    } else if (streakData === 1) {
        return (
            <img 
            style={{ display: "block", margin: "auto", width: '30%', height: 'auto' }}
            src="cat06_moyou_chatora.png"
            alt="koneko" 
            onClick={() => { handleNekoClick() }}
            />
        );
    } else if (streakData === 2) {
        return (
            <img
            style={{ display: "block", margin: "auto", width: '30%', height: 'auto' }}
            src="cat_study.png"
            alt="neko"
            onClick={() => { handleNekoClick() }}
            />
        );
    } else {
        return (
            <img
            style={{ display: "block", margin: "auto", width: '30%', height: 'auto' }}
            src="study_animal_lion.png"
            alt="raionn"
            onClick={() => { handleNekoClick() }}
            />
        );
    }
}

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
        <div>
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
            <Neko />
      </div>
    );
}