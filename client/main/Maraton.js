'use strict';

var angularModule = require("main/Main")

class Indicator {

    constructor(params, target) {

        this.container = target;
        this.params = params;
        this.progressBar = document.getElementById("progress");
        this.arrow = document.getElementById("arrow-right");
        this.axis = document.getElementById("axis");
        this.income = document.getElementById("income-box");

        // this.drawScale();
        this.drawScaleStep();
        this.drawProgress();
    }
    
    drawScale () {

        for(var i=0; i<this.params.segments+1; i++) {

            let tick = document.createElement("div");
            let currentTick = this.axis.appendChild(tick);
            if(i%this.params.major==0) {
                currentTick.className = "tick";
            } else {
                currentTick.className = "small-tick";   
            }
            currentTick.style.marginLeft = i*(100/this.params.segments) + "%";
            let percentStep = (this.params.max-this.params.min)/this.params.segments;
            let val = Number(this.params.min+(i*percentStep))/1000;
            currentTick.innerHTML = "<div class='values'>" + this.convertDecimal(val) + "</div>";
        }

    }

    changeVal(val) {
        let w = val / (this.params.max-this.params.min);
        this.progressBar.style.width = w*100 + "%";
    }

    drawScaleStep () {

        let j=0;
        let numOfSegments = this.params.max/this.params.segmentStep;

        for(var i=this.params.min; i<this.params.max; i+=this.params.segmentStep) {
            j++;
            
            let tick = document.createElement("div");
            let currentTick = this.axis.appendChild(tick);
            
            if(j%this.params.major==0) {
                currentTick.className = "tick";
            } else {
                currentTick.className = "small-tick";   
            }
            
            currentTick.style.marginLeft = j*(100/numOfSegments) + "%";
            let percentStep = (this.params.max-this.params.min)/numOfSegments;
            let val = Number(this.params.min+(j*percentStep))/1000;
            currentTick.innerHTML = "<div class='values'>" + this.convertDecimal(val) + "</div>";
        }
    }

    drawProgress () {
        this.income.innerHTML = this.params.value + "e";
        let w = this.params.value / (this.params.max-this.params.min);
        this.progressBar.style.width = w*100 + "%";
        // this.arrow.style.marginLeft = w*100 + "%";
    }

    convertDecimal (num) {
        let str = String(num);
        return str.replace(".", ",");
    }
}

angularModule.controller('MaratonCtrl', function ($scope) {

    var params = {
        segmentStep: 100,   
        major: 2,
        min: 0,
        max: 1500,
        value: ‭1130
    }
    var target = document.getElementById("donation--indicator--wrapper");
    var indicator = new Indicator(params, target);  
});


