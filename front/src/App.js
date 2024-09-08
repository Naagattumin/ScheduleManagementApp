// App.js 

import './App.css';
import { useEffect, useState } from "react";

import axios from 'axios';
import { prefixApi } from "./Connector";


function GetTodayEpoch() {
    return Date.now();
}

function GetTommorowEpoch() {
    return Date.now() + 86400000;
}




export default function App() {
    const today = new Date().toLocaleDateString();

    const dummyData = [{
        id: "1724236965191",
        exec_date: "20240811",
        priority: 5,
        contents: "TodoAppの実装",
        progress: 4,
    }, {
        id: "1724236965193",
        exec_date: "20240811",
        priority: 4,
        contents: "選択",
        progress: 3,
    }, {
        id: "1724236965192",
        exec_date: "20240811",
        priority: 1,
        contents: "掃除",
        progress: 1,
    }];

    const initialItems = [{
        id: "",
        exec_date: "",
        priority: "",
        contents: "",
        progress: "",
        sortId: ""
        }
    ];

    const [todayItems, setTodayItems] = useState(initialItems);

    const [tomorrowItems, setTomorrowItems] = useState(initialItems);

    function GetTodayTasks() {
        let epoch = Date.now();

        return axios.get(`${prefixApi}/get_task_data/${epoch}`)
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
        let epoch = Date.now() + 86400000;

        return axios.get(`${prefixApi}/get_task_data/${epoch}`)
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


    useEffect(() => {
        (async () => {
            setTodayItems(await GetTodayTasks());
        })();
    }, []);


    function OnClickProg(index, num) {
        if (num == -1){
            if (todayItems[index].progress > 0){
                let nextTodayItems = [...todayItems];
                --nextTodayItems[index].progress;
                setTodayItems(nextTodayItems);
            }
        } else if (num == 1){
            if (todayItems[index].progress < 5){
                let nextTodayItems = [...todayItems];
                ++nextTodayItems[index].progress;
                setTodayItems(nextTodayItems);
            }
        }
    }

    async function OnClickUpdate() {
        setTodayItems(await GetTodayTasks());
    }

    return (
        <>
            <h1 style={{ textAlign: "center" }}>{today}のタスク1</h1>
            <button onClick={() => {OnClickUpdate()}}>更新</button>
            {todayItems.map((task, index) => (
                <ul style={{ textAlign: "center" }}>
                    <li style={{ display: "inline-block", width: "10%"}}>優先度： {task.priority}  </li>
                    <li style={{ display: "inline-block", width: "30%"}}>{task.contents}  </li>
                    <li style={{ display: "inline-block", width: "8ch"}}>進捗： </li>
                    <button className="square" style={{ display: "inline-block", width: "5ch"}} onClick={() => OnClickProg(index, -1)}>-</button>
                    <li style={{ display: "inline-block", width: "5ch"}}>{task.progress}  </li>
                    <button className="square" style={{ display: "inline-block", width: "5ch"}} onClick={() => OnClickProg(index, 1)}>+</button>
                </ul>
            ))}
        </>
    )///////////
}








// ///////////////////////////////////

// import {
//     Accordion,
//     AccordionDetails,
//     AccordionSummary,
//     Button,
//     TextField
//   } from "@mui/material";
//   import { useEffect, useState } from "react";
//   import axios from 'axios';
//   import { prefixApi } from "./Connector";
  
//   function App() {
//     const initialItems = {
//       id: "",
//       priority: "",
//       contents: "",
//       progress: "",
//       sortId: ""
//     };
  
//     const dummyData = [{
//       id: "20240811-01",
//       priority: 5,
//       contents: "TodoAppの実装",
//       progress: 4,
//     }, {
//       id: "20240811-02",
//       priority: 4,
//       contents: "選択",
//       progress: 3,
//     }, {
//       id: "20240811-03",
//       priority: 1,
//       contents: "掃除",
//       progress: 1,
//     }];
  
  
//     const [todayItems, setTodayItems] = useState(initialItems);
//     const [tomorrowItems, setTomorrowItems] = useState(initialItems);
//     useEffect(() => {///////////条件が合うときに実行
//       //今日のタスクを取得
//       axios.get(`${prefixApi}/get-today-task`)
//         .then(response => {
//           if (response.data) {
//             setTodayItems(response.data);
//           }
//         })
//         .catch(error => {
//           console.error("There was an error fetching the data!", error);
//         });
  
//       //明日のタスクを取得
//       axios.get(`${prefixApi}get-tomorrow-task`)/////////////prefixApiからget...を取得
//         .then(response => {
//           if (response.data) {
//             setTomorrowItems(response.data);///////////set...にresponse.dataを代入
//           }
//         })
//         .catch(error => {
//           console.error("There was an error fetching the data!", error);
//         });
//     }, []);///////////ここが空なら最初に実行？
  
//     const handleEdit = () => {
  
//     }
  
//     return (
//       <div className="App">
//         <header className="App-header"></header>
//         <Accordion
//           disableGutters
//           sx={{ borderRadius: 1, ":before": { height: 0 } }}
//         >
//           <AccordionSummary>
//             今日のタスク
//           </AccordionSummary>
//           <AccordionDetails>
//             Todoアプリを完成させる
//           </AccordionDetails>
//         </Accordion>
//         <Accordion
//           disableGutters
//           sx={{ borderRadius: 1, ":before": { height: 0 } }}
//         >
//           <AccordionSummary>
//             明日のタスク
//           </AccordionSummary>
//           <AccordionDetails>
//             Todoアプリを完成させる
//             <TextField
//               value={tomorrowItems.id}
//               onChange={(e) => {
//               }}
//               // sx={{ width: textFieldWidth, ...sx }}
//               inputProps={{
//                 style: { textAlign: "center" },
//               }}
//             />
//             <Button
//               // sx={styles.button}
//               onClick={() => handleEdit()}
//             >
//               編集
//             </Button>
//           </AccordionDetails>
//         </Accordion>
//       </div>
//     );
//   }
  
//   export default App;