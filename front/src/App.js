// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Button,
//   TextField
// } from "@mui/material";
import { useEffect, useState } from "react";
import axios from 'axios';
import { prefixApi } from "./Connector";
import { Tomorrow } from "./tomorrow";

function App() {
  const initialItems = {
    id: "",
    priority: "",
    contents: "",
    progress: "",
    sortId: ""
  };

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


  const [todayItems, setTodayItems] = useState(initialItems);
  const [tomorrowItems, setTomorrowItems] = useState(initialItems);
  useEffect(() => {
    //今日のタスクを取得
    // axios.get(`${prefixApi}/get-task-data`)
    //   .then(response => {
    //     if (response.data) {
    //       setTodayItems(response.data);
    //     }
    //   })
    //   .catch(error => {
    //     console.error("There was an error fetching the data!", error);
    //   });

    //明日のタスクを取得
    let today = new Date();
    today.setDate( today.getDate() + 1 );
        let year = String(today.getFullYear());
        let month = String(today.getMonth());
        let date = String(today.getDate());
        const baseID = year+month+date;
        
    axios.get(`${prefixApi}/get_task_data/${baseID}`)
      .then(response => {
        if (response.data) {
          setTomorrowItems(response.data);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const handleEdit = () => {

  }

  return (
    // <div className="App">
    //   <header className="App-header"></header>
    //   <Accordion
    //     disableGutters
    //     sx={{ borderRadius: 1, ":before": { height: 0 } }}
    //   >
    //     <AccordionSummary>
    //       今日のタスク
    //     </AccordionSummary>
    //     <AccordionDetails>
    //       Todoアプリを完成させる
    //     </AccordionDetails>
    //   </Accordion>
    //   <Accordion
    //     disableGutters
    //     sx={{ borderRadius: 1, ":before": { height: 0 } }}
    //   >
    //     <AccordionSummary>
    //       明日のタスク
    //     </AccordionSummary>
    //     <AccordionDetails>
    //       Todoアプリを完成させる
    //       <TextField
    //         value={tomorrowItems.id}
    //         onChange={(e) => {
    //         }}
    //         // sx={{ width: textFieldWidth, ...sx }}
    //         inputProps={{
    //           style: { textAlign: "center" },
    //         }}
    //       />
    //       <Button
    //         // sx={styles.button}
    //         onClick={() => handleEdit()}
    //       >
    //         編集
    //       </Button>
    //     </AccordionDetails>
    //   </Accordion>
    // </div>
    <Tomorrow tomorrowItems={tomorrowItems}/>
  );
}

export default App;
