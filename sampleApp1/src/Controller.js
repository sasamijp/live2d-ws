
// 最初に一回だけ呼び出される
// Processingでいうsetup()
function Controller(){
    this.t = 0;

}


// 毎フレーム呼び出される
// Processingでいうdraw()
Controller.prototype.control = function(){

    this.t = (this.t + 1) % 60;
    console.log(this.t);
    return {PARAM_ANGLE_Z: this.t-30, PARAM_ANGLE_X: this.t-30};
}
