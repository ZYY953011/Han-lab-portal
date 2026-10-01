/* meetings.js —— 组会安排与记录（精简版）
 * 只保留最需要发布的信息：会议时间、地点、汇报人、汇报材料、发布时间、发布人。
 */
window.DATA = window.DATA || {};
window.DATA.meetings = [
  {
    id: "MT-2024-03-22",
    date: "2024-03-22",
    time: "14:00",
    place: "农科楼 B308",
    reporter: "陈思",
    topic: "小麦抗旱转录组进展与候选基因汇报",
    pptUrl: "https://docs.example.com/mt0322_ppt",
    docUrl: "https://docs.example.com/mt0322_note",
    publishDate: "2024-03-20",
    publisher: "张叶叶"
  },
  {
    id: "MT-2024-03-15",
    date: "2024-03-15",
    time: "14:00",
    place: "农科楼 B308",
    reporter: "刘洋",
    topic: "玉米密植示范方测产汇报",
    pptUrl: "https://docs.example.com/mt0315_ppt",
    docUrl: "",
    publishDate: "2024-03-13",
    publisher: "张叶叶"
  },
  {
    id: "MT-2024-03-08",
    date: "2024-03-08",
    time: "14:00",
    place: "农科楼 B308",
    reporter: "周婷",
    topic: "水稻高温胁迫荧光数据汇报",
    pptUrl: "",
    docUrl: "https://docs.example.com/mt0308_note",
    publishDate: "2024-03-06",
    publisher: "张叶叶"
  },
];
