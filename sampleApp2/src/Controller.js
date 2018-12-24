
// 最初に一回だけ呼び出される
// Processingでいうsetup()
function Controller(){
    this.t = 0;
    var source, animationId;
    var audioContext = new (window.AudioContext || window.webkitAudioContext);
    var fileReader   = new FileReader;
  
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    analyser.connect(audioContext.destination);
  
    var canvas        = document.getElementById('visualizer');
    var canvasContext = canvas.getContext('2d');
    canvas.setAttribute('width', analyser.frequencyBinCount * 10);
  
    fileReader.onload = function(){
      audioContext.decodeAudioData(fileReader.result, function(buffer){
        if(source) {
          source.stop();
          cancelAnimationFrame(animationId);
        }
        source = audioContext.createBufferSource();
  
        source.buffer = buffer;
        source.connect(analyser);
        source.start(0);
  
        animationId = requestAnimationFrame(render);
      });
    };
  
    document.getElementById('file').addEventListener('change', function(e){
      fileReader.readAsArrayBuffer(e.target.files[0]);
    });

    thisRef = this;
    render = function(){
      var spectrums = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(spectrums);
  
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      for(var i=0, len=spectrums.length; i<len; i++){
        canvasContext.fillRect(i*10, 0, 5, spectrums[i]);
      }
      thisRef.spectrums = spectrums;
      animationId = requestAnimationFrame(render);
    };
  
}


// 毎フレーム呼び出される
// Processingでいうdraw()
Controller.prototype.control = function(){
    params = {
        PARAM_ANGLE_Z: this.t-30,
        PARAM_BROW_L_Y: (this.t-30)/30.0,
        PARAM_BROW_R_Y: (this.t-30)/30.0,
        PARAM_MOUSE_OPEN_Y: this.t
    };
    this.t = (this.t + 1) % 60;

    if (this.spectrums != null){
        params = {
            PARAM_ANGLE_X: this.spectrums[0] *120/255 - 80,
            PARAM_ANGLE_Y: this.spectrums[2] *120/255 - 80,
            PARAM_ANGLE_Z: this.spectrums[5] *120/255 - 80,
            PARAM_EYE_L_OPEN: (this.spectrums[7] *120/255 - 80)/30,
            PARAM_EYE_R_OPEN: (this.spectrums[9] *120/255 - 80)/30,
            PARAM_EYE_BALL_X: (this.spectrums[12] *120/255 - 80)/30-1,
            PARAM_EYE_BALL_Y: (this.spectrums[15] *120/255 - 80)/30-1,
            PARAM_EYE_BALL_FORM: (this.spectrums[17] *120/255 - 80)/30-1,
            PARAM_EYE_BALL_KIRAKIRA: (this.spectrums[19] *120/255 - 80)/30,
            PARAM_BROW_L_Y: this.spectrums[21] *2/255 -1,
            PARAM_BROW_R_Y: this.spectrums[23] *2/255 -1,
            PARAM_BROW_L_X: this.spectrums[25] *2/255 -1,
            PARAM_BROW_R_X: this.spectrums[28] *2/255 -1,
            PARAM_BROW_L_FORM: this.spectrums[30] *2/255 -1,
            PARAM_BROW_R_FORM: this.spectrums[33] *2/255 -1,
            PARAM_MOUTH_OPEN_Y: (this.spectrums[36] *120/255 - 80)/30,
            PARAM_MOUSE_FORM: (this.spectrums[40] *120/255 - 80)/30-1,
            PARAM_MOUSE_SIZE: (this.spectrums[42] *120/255 - 80)/30-1,
            PARAM_TERE: (this.spectrums[45] *120/255 - 80)/30-1,
            PARAM_BODY_X: (this.spectrums[50] *120/255 - 80)/30-1,
            PARAM_BODY_Y: (this.spectrums[55] *120/255 - 80)/30-1,
            PARAM_BODY_Z: (this.spectrums[60] *120/255 - 80)/30-1,
            PARAM_DONYORI: (this.spectrums[63] *120/255 - 80)/30-1,
        }

    console.log(params);
    }

    return params;
}
