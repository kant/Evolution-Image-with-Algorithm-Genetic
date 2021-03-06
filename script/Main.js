/* this script run when page is loaded*/

//10 is defalt
window.MAXRADIUS = 0;
window.MAXCIRCLE = 0;
window.COLORMODE = 0;
window.LOCALFOLDER = "";
window.CROSSOVER = "";
window.stopNow = false;
//type array
window.imageTarget = null;
window.view = null;
window.verbose = false;
window.p  = null;
window.clock = null;
//type image (HTML)
window.fileTarget = null;
window.BACKGROUNDCOLOR = "";
window.populationnumber = 0;

$(window).on("load",function(){
    //set seed #01
     Math.seedrandom('AAaBbCc');
     //get canvas of html
     var canvas = document.getElementById("view");
     //get context 2d of canvas
     var ctx = canvas.getContext("2d");

    //get canvas of html
    var canvas2 = document.getElementById("view2");
    //get context 2d of canvas
    var ctx2 = canvas2.getContext("2d");
    //control of time
    clock = new Clock();
    //control of view
    view = new View(canvas2, ctx2);

    //play button of main screen
    $("#bt-play").click( function(){

        //get data of inputs
        MAXRADIUS =  parseInt( $("#text-radius-limite").val() );
        MAXCIRCLE = parseInt( $("#text-number-circle").val() );
        COLORMODE =  $("#select-typecolor option:selected").val();
        LOCALFOLDER = $("#text-testname").val();
        BACKGROUNDCOLOR = $("#select-backgroundcolor option:selected").val();
        BACKGROUNDCOLOR2 = $("#text-specific-color").val();
        CROSSOVER = $("#select-crossover option:selected").val();
        populationnumber  = parseInt( $("#text-population-number").val() );
        console.log(populationnumber)
        //if user set specific color
        if(BACKGROUNDCOLOR2 != ""){
           if(/^#[0-9A-F]{6}$/i.test(BACKGROUNDCOLOR2)){
               BACKGROUNDCOLOR = BACKGROUNDCOLOR2;
           }else{
               alert("Color hex not is correct!");
               return;
           }
        }

        //if don't choose image
        if(fileTarget == null){
            alert("Choose your image target!");
            return;
        }

        //if don't define folder
        if(LOCALFOLDER == ""){
            alert("Define a local for save images");
            return;
        }

        //value default
        if(isNaN(MAXRADIUS))
            MAXRADIUS = 10;

        if(isNaN(MAXCIRCLE))
            MAXCIRCLE = 100;

        //print image target in canvas
        ctx.drawImage(fileTarget,0,0);

        //if is the first time of click play
        if(imageTarget == null){

            //if user click another time in file choose
            $("#bt-file-data").click(function(){
                alert("You do not change image target after process started!");
            });


            //get data of image
            window.imageTarget = ctx.getImageData(0, 0, 200, 250).data;
            //p is global
            p = new Population(populationnumber, imageTarget);
            //call generations process
            p.generation();

        }else{
            //falg stop is false
            stopNow = false;
            //continue generation
            p.generation();
        }


        //falg stop is false
        stopNow = false;
        //call funtion count time
        clock.start();
        //hide this button and show pause button
        $(this).hide();
        //show button pause
        $("#bt-pause").css("display","inline");

    });


    //click pause
    $("#bt-pause").click( function(){
        //stop flat true
        stopNow = true;
        //hide button stop
        $(this).hide();
        //show button play
        $("#bt-play").css("display","inline");
        //stop time
        clock.stop();
    });

    $("#bt-print").click(function(){
        //save canvas current
        view.saveCanvas(p.members[0].fitness, clock.getTime());
    });

    //trigger file with button
    $("#bt-file-data").click(function(){
        $("#file-data").trigger("click");
    });

    //geting image target
    document.getElementById('file-data').onchange = function(e) {
        window.fileTarget = new Image();
        window.fileTarget.crossOrigin = 'anonymous';
        //get url image
        fileTarget.src =  URL.createObjectURL(e.target.files[0]);

    };
});


/*
 * copyArray [Method]
 * this method copy array of Locals and Vehicles
 * newDemand [array] - array of Local or Vehicle
 */
copyArray = function(array){
    newarray = new Array();
    for(var i = 0; i< array.length; i++){
        newarray.push( array[i].copy() );
    }
    return newarray;
}




