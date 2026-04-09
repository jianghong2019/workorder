import Axios from "axios";

// 获取表格头数据
async function getTableHead(fundCode){
  let Data
  let src = this.url + "/dataAccessManage/getTableHeader?" + `fundCode=${fundCode}`
  await Axios.get(src)
       .then(res=>{
         if(!res.data.success) return
         Data = res.data.choose
       })
  return Data
}
export default getTableHead