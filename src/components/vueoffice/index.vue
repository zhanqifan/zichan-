<template>
  <div class="Office-Preview" v-loading="loading">
    <VueOfficeDocx
      :src="fileUrl"
      @rendered="onRendered"
      @error="onError"
    ></VueOfficeDocx>


  </div>
</template>

<script>

import VueOfficeDocx from "@vue-office/docx";
//引入相关样式
import '@vue-office/docx/lib/v2/index.css'
export default {
  name: "OfficePreview",
  components: {
    VueOfficeDocx
  },
  /**
   * fileUrl: 文件地址
   */
  props: {
    fileUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      fileType: "",
      loading: true,
    };
  },

  methods: {
    init() {
      if (!this.fileUrl) {
        console.error("文件为空");
        this.fileType = "errType";
        this.loading = false;
        return;
      }

      const fileExtension = this.fileUrl.split(".").pop().toLowerCase(); //取出文件后缀
      // 设立文件类型字典
      const validFileTypes = {
        doc: "docx",
        docx: "docx",
        pdf: "pdf",
        // xls: "excel",
        // xlsx: "excel",
      };
      this.fileType = validFileTypes[fileExtension] || "errType"; //赋予文件类型
      this.loading = false; //
    },
    onRendered() {
      this.loading = false;
    },
    // 错误监听
    onError() {
      console.error("加载错误");
      this.loading = false;
      this.fileType = "loadErr";
    },
  },
  mounted() {
    console.log('mounted')
    console.log(this.fileUrl)
    this.init();
  },
  watch: {
    fileUrl(val) {
      console.log(val);
      this.init();
    },
  },
};
</script>

<style lang="scss" >
/* 注意：这里没有使用 scoped，因为需要深度修改组件内部样式 */
.Office-Preview {
  overflow-y: auto;
  height: 100%;
}

// /* 文档标题样式 */
// .docx-wrapper h1,
// .docx-wrapper h2 {
//   text-align: center !important;
//   font-weight: bold !important;
//   margin: 20px 0 !important;
// }

// /* 整体表格样式 */
// .docx-wrapper table {
//   border-collapse: collapse !important;
//   border: 1px solid #000 !important;
//   width: 100% !important;
//   margin: 15px 0 !important;
//   table-layout: fixed !important;
// }

// /* 表格单元格样式 */
// .docx-wrapper td,
// .docx-wrapper th {
//   border: 1px solid #000 !important;
//   padding: 8px !important;
//   text-align: center !important;
//   vertical-align: middle !important;
// }

// /* 表格标题行 */
// .docx-wrapper tr:first-child td {
//   font-weight: bold !important;
// }

// /* 抽取结果行 - 整行合并 */
// .docx-wrapper tr:nth-child(3) td {
//   text-align: center !important;
//   font-weight: bold !important;
// }

// /* 隐藏抽取结果行的中间边框，只保留外边框 */
// .docx-wrapper tr:nth-child(3) td:not(:first-child):not(:last-child) {
//   border-left: none !important;
//   border-right: none !important;
// }

// .docx-wrapper tr:nth-child(3) td:first-child {
//   border-right: none !important;
// }

// .docx-wrapper tr:nth-child(3) td:last-child {
//   border-left: none !important;
//   border-collapse: collapse;
// }

// /* 确保"抽取结果"文字在整行居中显示 */
// .docx-wrapper tr:nth-child(3) td:first-child {
//   text-align: center !important;
//   font-size: 16px !important;
//   border-collapse: collapse;
// }

// /* 处理行合并单元格 */
// .docx-wrapper [rowspan],
// .docx-wrapper .rowspan {
//   vertical-align: middle !important;
// }

// /* 特别处理签名区域 */
// .docx-wrapper tr:nth-child(n+5):nth-child(-n+7) td:nth-child(n+2) {
//   height: 60px !important;
//   vertical-align: top !important;
//   text-align: left !important;
//   padding-top: 12px !important;
// }

// /* 签名行 - 确保合并单元格正确显示 */
// .docx-wrapper tr:nth-last-child(-n+3) td {
//   border-top: 1px solid #000 !important;
//   border-bottom: 1px solid #000 !important;
//   height: 70px !important;
//   vertical-align: top !important;
//   padding-top: 12px !important;
// }

// /* 处理特殊的docx表格结构 */
// .docx-wrapper .docx-table {
//   border: 1px solid #000 !important;
// }

// .docx-wrapper .docx-table-cell {
//   border: 1px solid #000 !important;
//   text-align: center !important;
//   vertical-align: middle !important;
// }

// /* 处理表格行 */
// .docx-wrapper .docx-table-row {
//   border: none !important;
// }

// /* 打印样式 */
// @media print {
//   .docx-wrapper table,
//   .docx-wrapper td,
//   .docx-wrapper th {
//     border: 1px solid #000 !important;
//     -webkit-print-color-adjust: exact !important;
//   }
// }

// /* 处理框选的特定合并单元格 */

// /* 项目名称行 - 第2-5列合并 */
// .docx-wrapper tr:first-child td:nth-child(2),
// .docx-wrapper tr:first-child td:nth-child(3),
// .docx-wrapper tr:first-child td:nth-child(4),
// .docx-wrapper tr:first-child td:nth-child(5) {
//   border-left: none !important;
//   border-right: none !important;
// }

// .docx-wrapper tr:first-child td:nth-child(2) {
//   border-left: 1px solid #000 !important;
// }

// .docx-wrapper tr:first-child td:nth-child(5) {
//   border-right: 1px solid #000 !important;
// }

// /* 评审时间行 - 第2-5列合并 */
// .docx-wrapper tr:nth-child(2) td:nth-child(2),
// .docx-wrapper tr:nth-child(2) td:nth-child(3),
// .docx-wrapper tr:nth-child(2) td:nth-child(4),
// .docx-wrapper tr:nth-child(2) td:nth-child(5) {
//   border-left: none !important;
//   border-right: none !important;
// }

// .docx-wrapper tr:nth-child(2) td:nth-child(2) {
//   border-left: 1px solid #000 !important;
// }

// .docx-wrapper tr:nth-child(2) td:nth-child(5) {
//   border-right: 1px solid #000 !important;
// }

// /* 抽取人签名行处理 */
// .docx-wrapper tr:nth-last-child(-n+2) td:nth-child(2),
// .docx-wrapper tr:nth-last-child(-n+2) td:nth-child(3) {
//   border-left: none !important;
//   border-right: none !important;
// }

// .docx-wrapper tr:nth-last-child(-n+2) td:nth-child(2) {
//   border-left: 1px solid #000 !important;
// }

// .docx-wrapper tr:nth-last-child(-n+2) td:nth-child(3) {
//   border-right: 1px solid #000 !important;
// }

// /* 签名区域高度设置 */
// .docx-wrapper tr:nth-last-child(-n+2) td {
//   height: 80px !important;
// }

// /* 特殊处理合并单元格内的内容 */
// .docx-wrapper .docx-table-cell[colspan],
// .docx-wrapper .docx-table-cell[rowspan] {
//   text-align: center !important;
//   vertical-align: middle !important;
// }
</style>
