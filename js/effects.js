var videoInput = document.getElementById('inputVideo');
    var canvasInput = document.getElementById('inputCanvas');

    var effectIndex = 1;
     var effectsArray = ['blur','brightness','bump','circlesmear','contrast','crosssmear','diffusion','dither','edge','emboss','exposure','gain','gamma','grayscale','hue','invert','kaleidoscope','lensdistortion','linesmear','maximum','median','minimum','noise','opacity','pinch','pixelate','posterize','rgbadjust','saturation','sawtoothripple','sepia','sharpen','sineripple','solarize','sparkle','squaresmear','threshold','triangleripple','twirl','vignette','waterripple']


    //find user media and stick in the video
    navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

    var video = document.querySelector('video');

    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio: false, video: true}, function(stream) {
        video.src = window.URL.createObjectURL(stream);
        openAperture();
      }, errorCallback);
    } else {
      video.src = 'somevideo.webm'; // fallback.
    }

    function errorCallback(){}

    var fc = new frameConverter(videoInput,canvasInput);
    fc.setEffect(effectsArray[effectIndex]);


    document.onkeydown= function(e){

        switch(e.keyCode){
            case 32: //space
                takeAPicture();
                break;
            case 37: //left
                previousScene();
                break;
            case 39: //right
                nextScene();
                break;
            case 38: //up
                switchEffectPrevious();
                break;
            case 40: //down
                switchEffect();
                break;
        }
    }

    function switchEffect(name){
        if(name == '' || name == undefined){
            effectIndex++;
            if(effectIndex > effectsArray.length -1){
                effectIndex = 0;
            }
            var effect = effectsArray[effectIndex];

            fc.setEffect(effect)

        }else{
            fc.setEffect(name)
        }
    }
    function switchEffectPrevious(){
        effectIndex--;
        if(effectIndex < 0){
            effectIndex = effectsArray.length-1;
        }

        var effect = effectsArray[effectIndex];

        fc.setEffect(effect)
    }

    function frameConverter(video, canvas) {

        // Set up our frame converter
        this.video = video;
        this.viewport = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        // Create the frame-buffer canvas
        this.framebuffer = document.createElement("canvas");
        this.framebuffer.width = this.width;
        this.framebuffer.height = this.height;
        this.ctx = this.framebuffer.getContext("2d");
         // flip the video horizontally
        this.ctx.translate(this.width, 0);
        this.ctx.scale(-1, 1);

        // Default video effect is blur
        this.effect = JSManipulate.blur;
        // This variable used to pass ourself to event call-backs
        var self = this;
        // Start rendering when the video is playing
        this.video.addEventListener("play", function() {
            self.render();
        }, false);

        // Change the image effect to be applied
        this.setEffect = function(effect) {
            if (effect in JSManipulate) {
                this.effect = JSManipulate[effect];
            }
        }

        // Rendering call-back
        this.render = function() {
            if (this.video.paused || this.video.ended) {
                return;
            }
            this.renderFrame();
            var self = this;
            // Render every 10 ms
            setTimeout(function() {
                self.render();
            }, 10);
        };

        // Compute and display the next frame
        this.renderFrame = function() {
            // Acquire a video frame from the video element
            this.ctx.drawImage(this.video, 0, 0, this.video.videoWidth,
                this.video.videoHeight, 0, 0, this.width, this.height);
            var data = this.ctx.getImageData(0, 0, this.width, this.height);
            // Apply image effect
            this.effect.filter(data, this.effect.defaultValues);
            // Render to viewport
            this.viewport.putImageData(data, 0, 0);
            return;
        };
    };


    /*
    For facetracking
     */
    // var htracker = new headtrackr.Tracker({
    //     calcAngles: true
    // });
    // htracker.init(videoInput, canvasInput);
    // htracker.start();


    // document.addEventListener("facetrackingEvent", function(e) {
    //     JSManipulate.lensdistortion.filter(data, {refraction: 3.0, radius: 75});
    // }, true);

