// App.js 

import './App.css';
import { useEffect, useState } from "react";


// import {
//     Accordion,
//     AccordionDetails,
//     AccordionSummary,
//     Button,
//     TextField
//   } from "@mui/material";
import axios from 'axios';
import { prefixApi } from "./Connector";



// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


function App() {
    const today = new Date().toLocaleDateString();


    // ul {
    //     list-style: none;
    //     justify-content: center;
    //     column-gap: 10px;
    // }
    const dummyData = [{
        id: "20240811-01",
        priority: 5,
        contents: "TodoAppの実装",
        progress: 4,
    }, {
        id: "20240811-02",
        priority: 4,
        contents: "選択",
        progress: 3,
    }, {
        id: "20240811-03",
        priority: 1,
        contents: "掃除",
        progress: 1,
    }];

    const initialItems = [{
      id: "",
      priority: "",
      contents: "",
      progress: "",
      sortId: ""
    }
];

      
    const [todayItems, setTodayItems] = useState(initialItems);
    const [tomorrowItems, setTomorrowItems] = useState(initialItems);
    // useEffect(() => {///////////条件が合うときに実行
    //   //今日のタスクを取得
    //   axios.get(`${prefixApi}/get-today-task`)
    //     .then(response => {
    //       if (response.data) {
    //         setTodayItems(response.data);
    //       }
    //     })
    //     .catch(error => {
    //       console.error("There was an error fetching the data!", error);
    //     });
  
    //   //明日のタスクを取得
    //   axios.get(`${prefixApi}get-tomorrow-task`)/////////////prefixApiからget...を取得
    //     .then(response => {
    //       if (response.data) {
    //         setTomorrowItems(response.data);///////////set...にresponse.dataを代入
    //       }
    //     })
    //     .catch(error => {
    //       console.error("There was an error fetching the data!", error);
    //     });
    // }, []);///////////ここが空なら最初に実行？

    // 取りあえずダミーデータを設定 ///////////////////////////
    useEffect(() => {
        let today = new Date();
        let year = String(today.getFullYear());
        let month = String("0"+(today.getMonth() + 1)).slice(-2);
        let date = String("0"+today.getDate()).slice(-2);
        const baseID = 1;///////////
        // const baseID = year+month+date;
        console.log("baseID: " + baseID)
        axios.get(`${prefixApi}/get_task_data/${baseID}`)
        .then(response => {
            console.log(response)
            if(response.data){
            console.log(response.data)
            setTodayItems(response.data);
            }
        })
        .catch(error => {
            console.error("There was an error fetching the data!", error);
        });
        // setTomorrowItems(dummyData);
    }, []);

    function proMinusHandleClick(index) {
        let nextTodayItems = [...todayItems];
        if (nextTodayItems[index].progress > 0){
            --nextTodayItems[index].progress;
            setTodayItems(nextTodayItems);
        }
    }

    function proPlusHandleClick(index) {
        let nextTodayItems = [...todayItems];
        if (nextTodayItems[index].progress < 5){
            ++nextTodayItems[index].progress;
            setTodayItems(nextTodayItems);
        }

    }

    return (
        <>
            <h1 style={{ textAlign: "center" }}>{today}のタスク1</h1>
            {todayItems.map((task, index) => (
            <ul style={{ textAlign: "center" }}>
                <li style={{ display: "inline-block", width: "10%"}}>優先度： {task.priority}  </li>
                <li style={{ display: "inline-block", width: "30%"}}>{task.contents}  </li>
                <li style={{ display: "inline-block", width: "8ch"}}>進捗： </li>
                <button className="square" style={{ display: "inline-block", width: "5ch"}} onClick={() => proMinusHandleClick(index)}>-</button>
                <li style={{ display: "inline-block", width: "5ch"}}>{task.progress}  </li>
                <button className="square" style={{ display: "inline-block", width: "5ch"}} onClick={() => proPlusHandleClick(index)}>+</button>
            </ul>
            ))}
        </>
    )///////////


    // return (
    //     <>
    //         <h1>{today}のタスク</h1>
    //         <ul style={{ listStyleType: "none", padding: 0 }}>
    //             {dummyData.map((task, index) => (
    //                 <li key={index} style={{ display: "inline-block", marginRight: "20px" }}>
    //                     <span> id: {task.id}</span> | 
    //                     <span> priority: {task.priority}</span> | 
    //                     <span> contents: {task.contents}</span> | 
    //                     <span> progress: {task.progress}</span>
    //                 </li>
    //             ))}
    //         </ul>
    //     </>
    // );
}

export default App;










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