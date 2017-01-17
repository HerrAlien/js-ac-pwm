/*
js-audio-pwm - a JavaScript utility to generate PWM AC audio output
               
Copyright 2017  Herr_Alien <alexandru.garofide@gmail.com>
                
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
                
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
                
You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see https://www.gnu.org/licenses/agpl.html
*/

var PWMManager = {
    buffer : false,
    fillFactor : 0.5,
    audioContext : false,
    source : false,
    
    config : {
        freq : 440,
        duration : 0.05,
        amplitude: 1
    },
    
    updateBuffer : function () {
    
        if (!this.audioContext)
            this.audioContext = new AudioContext();
            
        var buffLen = this.audioContext.sampleRate * this.config.duration;
        
        if (!this.buffer)
            this.buffer = this.audioContext.createBuffer(1, buffLen, this.audioContext.sampleRate);
        
        var omegaStep = 2 * Math.PI * this.config.freq / this.audioContext.sampleRate;
        var omega = 0;
        var data = this.buffer.getChannelData(0);
        
        // plain PWM for now.
        var numOfSkippedSamples = Math.round (buffLen * this.fillFactor);
        
        for (var i = 0; i < buffLen; i++) {
            
            if (i > numOfSkippedSamples)
                data [i] = 0;
            else
                data [i] = this.config.amplitude * Math.sin(omega);
                
            omega += omegaStep;
        }
    },
    
    play : function () {
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.loop = true;
        this.source.connect(this.audioContext.destination);
        this.source.start();
    },
    
    stop : function () {
        if (!!this.source) {
            this.source.stop();
            delete this.source;
        }        
    }
};
