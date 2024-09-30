import axios from 'axios';
import { useEffect, useState } from 'react';
import { prefixApi } from "./Connector";


export default function Tomorrow({ tomorrowItems }) {
    // // ダミーデータ
    // tomorrowItems = [{
    //     id: "1724236965191",
    //     exec_date: "20240811",
    //     priority: 5,
    //     contents: "TodoAppの実装",
    //     progress: 4,
    // }, {
    //     id: "1724236965193",
    //     exec_date: "20240811",
    //     priority: 4,
    //     contents: "選択",
    //     progress: 3,
    // }, {
    //     id: "1724236965192",
    //     exec_date: "20240811",
    //     priority: 1,
    //     contents: "掃除",
    //     progress: 1,
    // }];


    const [tasks, setTasks] = useState();

    const [loading, setLoading] = useState(true);

    function GetTodayTasks() {
        let jsEpoch = Date.now();

        return axios.get(`${prefixApi}/get_task_data/${jsEpoch}`)
            .then(response => {
                console.log("🐾GetTasks_then🐾", response.data);//////////
                return response.data;
            })
            .catch(error => {
                console.error("🐾!!!GetTasks_catch🐾", error);
            });
    }

    function GetTomorrowTasks() {
        console.log("🐾GetTomorrowTasks_start🐾");//////////
        let jsEpoch = Date.now() + 86400000;

        return axios.get(`${prefixApi}/get_task_data/${jsEpoch}`)
            .then(response => {
                console.log("🐾GetTasks_then🐾", response.data);//////////
                return response.data;
            })
            .catch(error => {
                console.error("🐾!!!GetTasks_catch🐾", error);
            });
    }

    function PostTasks(tasks) {
        console.log("🐾PostTasks_start🐾");//////////

        return axios.post(`${prefixApi}/post_tomorrow_task/`, tasks)
            .then(response => {
                console.log("🐾PostTasks_then🐾", response.data);
            })
            .catch(error => {
                console.error("🐾!!!PostTasks_catch🐾", error);
            });
    }

    function Delete_Task(task) {
        console.log("🐾DeleteTasks_start🐾");//////////////

        return axios.post(`${prefixApi}/post_deleted_task`, task)
            .then(response => {
                console.log("🐾DeleteTasks_then🐾", response.data);
            })
            .catch(error => {
                console.error("🐾!!!DeleteTasks_catch🐾", error);
            });
    }

    function PostProgress(task) {
        console.log("🐾PostProgress_start🐾");//////////

        return axios.post(`${prefixApi}/post_achievement/`, task)
            .then(response => {
                console.log("🐾PostProgress_then🐾", response.data);
            })
            .catch(error => {
                console.error("🐾!!!PostProgress_catch🐾", error);
            });
    }

    function PostPriority(task) {
        console.log("🐾PostPriority_start🐾");//////////

        return axios.post(`${prefixApi}/post_priority/`, task)
            .then(response => {
                console.log("🐾PostPriority_then🐾", response.data);
            })
            .catch(error => {
                console.error("🐾!!!PostPriority_catch🐾", error);
            });
    }

    function PostContents(task) {
        console.log("🐾PostContents_start🐾");//////////

        return axios.post(`${prefixApi}/post_contents/`, task)
            .then(response => {
                console.log("🐾PostContents_then🐾", response.data);
            })
            .catch(error => {
                console.error("🐾!!!PostContents_catch🐾", error);
            });
    }


    const OnchangeText = (index, newContents) => {
        let newTasks = tasks.concat();
        newTasks[index].contents = newContents;

        setTasks(newTasks);
    }

    function OnBlurText(index, newText) {
        PostContents(tasks[index]).then(() => {
            GetTomorrowTasks().then((response) => {
                setLoading(true);
                setTasks(response);
            })
        })
    }

    const handlePriorityClick = (index, addPriority) => {
        let newTasks = tasks.concat();
        if (newTasks[index].priority + addPriority > 5) {
            return;
        }
        if (newTasks[index].priority + addPriority < 0) {
            return;
        }

        newTasks[index].priority += addPriority;

        PostPriority(newTasks[index]).then(() => {
            GetTomorrowTasks().then((response) => {
                setLoading(true);
                setTasks(response);})
        });
    }

    function handleDeleteClick(index) {
        Delete_Task(tasks[index]).then(() => {
            GetTomorrowTasks().then((response) => {
                setLoading(true);
                setTasks(response);
            })
        })
    }

    // タスクの追加ボタンで発火。
    const handleAddClick = () => {
        let newTask = tasks.concat();

        // IDの重複を避けるための処理
        let epoch = Date.now();

        let flag = true;
        while (flag) {
            flag = false;
            for (let i = 0; i < newTask.length; i++) {
                if (newTask[i].id === epoch) {
                    flag = true;
                    ++epoch;
                    break;
                }
            }
        }

        // null回避のための初期化用タスク
        let addedTask = {
            id: epoch,
            exec_date: "",
            priority: 0,
            contents: "",
            progress: 0,
        }
        newTask.push(addedTask);

        setLoading(true);
        setTasks(newTask);
    }


    useEffect(() => {
        (async () => {
            setLoading(true);
            setTasks(await GetTomorrowTasks());
        })();
    }, []);

    useEffect(() => {
        if (tasks === undefined) {
            console.log("🐾tasks is undefined🐾");//////////
            return;
        }

        setLoading(false);
    }, [tasks]);

    if (loading) {
        return <h1>Loading...</h1>;
    }


    function handleDbgClick() {////////////////
        axios.get(`${prefixApi}/get_dbg_task_data/`)
            .then(response => {
                console.log("🐾get_dbg_task_data_then🐾", response.data);//////////
            })
            .catch(error => {
                console.error("🐾!!!get_dbg_task_data_catch🐾", error);
            });
        console.log("🐾tasks🐾", tasks);
    }


    return (
        <div style={{ textAlign: "center" }}>
            <button onClick={handleAddClick}>タスクの追加</button>

            {/* tasksを回してるからtasksの要素が増えるとたTaskLineの行が増える */}
            {tasks.map((task, index) => (
                <div>
                    <button
                        onClick={() => { handleDeleteClick(index) }}
                    >
                        削除
                    </button>

                    {/* タスク名を入力するテキストボックス */}
                    <input
                        style={{ textAlign: "center" }}
                        value={task.contents}
                        onChange={(e) => { OnchangeText(index, e.target.value) }}
                        onBlur={(e) => { OnBlurText(index, e.target.value) }}
                    />

                    {/* 優先度を変更するボタンたち */}
                    <button
                        style={{ textAlign: "center" }}
                        onClick={() => { handlePriorityClick(index, -1) }}
                    >
                        -
                    </button>

                    {task.priority}

                    <button
                        style={{ textAlign: "center" }}
                        onClick={() => { handlePriorityClick(index, +1) }}
                    >
                        +
                    </button>
                </div>
            ))}
        </div>
    );////////////////
}
