
interface wxScanData {
    success?: (code: string) => void,
    fail?: (errMsg: string) => void,
}

const wxScan = async (data: wxScanData) => {
    wx.scanCode({
        scanType: [ "barCode", "qrCode", "datamatrix", "pdf417" ],
        success: function(t) {
          if(t.errMsg === "scanCode:ok") {
            //二维码读取成功
            if(data.success) { data.success(t.result) }
          } else {
            //二维码读取失败
            if(data.fail) { data.fail(t.errMsg) }
          }
        }
    });
}

export { wxScan }