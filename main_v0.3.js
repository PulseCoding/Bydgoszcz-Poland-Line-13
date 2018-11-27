// ----------------------------------------------------//
// Se crean las instancias de las librerias a utilizar //
// ----------------------------------------------------//

var modbus = require('jsmodbus');
var fs = require('fs');
var httpClient = require('node-rest-client').Client;
var clientHttp = new httpClient();
//Asignar host, puerto y otros par ametros al cliente Modbus
var client = modbus.client.tcp.complete({
  'host': "192.168.20.17",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout': 30000
}).connect();

var intId, timeStop = 40,
  flagONS1 = 0,
  flagONS2 = 0,
  flagONS3 = 0,
  flagONS4 = 0,
  flagONS5 = 0,
  flagONS6 = 0,
  flagONS7 = 0,
  flagONS8 = 0,
  flagONS9 = 0,
  flagONS10 = 0;
var BottleSorter, ctBottleSorter = 0,
  speedTempBottleSorter = 0,
  secBottleSorter = 0,
  stopCountBottleSorter = 0,
  flagStopBottleSorter = 0,
  flagPrintBottleSorter = 0,
  speedBottleSorter = 0,
  timeBottleSorter = 0;
var actualBottleSorter = 0,
  stateBottleSorter = 0;
var Fillercapper, ctFillercapper = 0,
  speedTempFillercapper = 0,
  secFillercapper = 0,
  stopCountFillercapper = 0,
  flagStopFillercapper = 0,
  flagPrintFillercapper = 0,
  speedFillercapper = 0,
  timeFillercapper = 0;
var actualFillercapper = 0,
  stateFillercapper = 0;
var CapSorter, ctCapSorter = 0,
  speedTempCapSorter = 0,
  secCapSorter = 0,
  stopCountCapSorter = 0,
  flagStopCapSorter = 0,
  flagPrintCapSorter = 0,
  speedCapSorter = 0,
  timeCapSorter = 0;
var actualCapSorter = 0,
  stateCapSorter = 0;
var Depuck, ctDepuck = 0,
  speedTempDepuck = 0,
  secDepuck = 0,
  stopCountDepuck = 0,
  flagStopDepuck = 0,
  flagPrintDepuck = 0,
  speedDepuck = 0,
  timeDepuck = 0;
var actualDepuck = 0,
  stateDepuck = 0;
var Labeller, ctLabeller = 0,
  speedTempLabeller = 0,
  secLabeller = 0,
  stopCountLabeller = 0,
  flagStopLabeller = 0,
  flagPrintLabeller = 0,
  speedLabeller = 0,
  timeLabeller = 0;
var actualLabeller = 0,
  stateLabeller = 0;
var Shrinkwrapper, ctShrinkwrapper = 0,
  speedTempShrinkwrapper = 0,
  secShrinkwrapper = 0,
  stopCountShrinkwrapper = 0,
  flagStopShrinkwrapper = 0,
  flagPrintShrinkwrapper = 0,
  speedShrinkwrapper = 0,
  timeShrinkwrapper = 0;
var actualShrinkwrapper = 0,
  stateShrinkwrapper = 0;
var Taper, ctTaper = 0,
  speedTempTaper = 0,
  secTaper = 0,
  stopCountTaper = 0,
  flagStopTaper = 0,
  flagPrintTaper = 0,
  speedTaper = 0,
  timeTaper = 0;
var actualTaper = 0,
  stateTaper = 0;
var Printer, ctPrinter = 0,
  speedTempPrinter = 0,
  secPrinter = 0,
  stopCountPrinter = 0,
  flagStopPrinter = 0,
  flagPrintPrinter = 0,
  speedPrinter = 0,
  timePrinter = 0;
var actualPrinter = 0,
  statePrinter = 0;
var Checkweigher, ctCheckweigher = 0,
  speedTempCheckweigher = 0,
  secCheckweigher = 0,
  stopCountCheckweigher = 0,
  flagStopCheckweigher = 0,
  flagPrintCheckweigher = 0,
  speedCheckweigher = 0,
  timeCheckweigher = 0;
var actualCheckweigher = 0,
  stateCheckweigher = 0;
var Paletizer, ctPaletizer = 0,
  speedTempPaletizer = 0,
  secPaletizer = 0,
  stopCountPaletizer = 0,
  flagStopPaletizer = 0,
  flagPrintPaletizer = 0,
  speedPaletizer = 0,
  timePaletizer = 0;
var actualPaletizer = 0,
  statePaletizer = 0;
var Barcode, secBarcode = 0;
var secEOL = 0,
  secPubNub = 5 * 60;
var publishConfig;

var files = fs.readdirSync("/home/oee/Pulse/BYD_L13_LOGS/"); //Leer documentos
var actualdate = Date.now(); //Fecha actual
var text2send = []; //Vector a enviar
var flagInfo2Send = 0;
var i = 0;

// --------------------------------------------------------- //
//Función que realiza las instrucciones de lectura de datos  //
// --------------------------------------------------------- //
var DoRead = function() {
  client.readHoldingRegisters(0, 99).then(function(resp) {
    var statesBottleSorter = switchData(resp.register[0], resp.register[1]),
      statesFillercapper = switchData(resp.register[2], resp.register[3]),
      statesCapSorter = switchData(resp.register[4], resp.register[5]),
      statesDepuck = switchData(resp.register[6], resp.register[7]),
      statesLabeller = switchData(resp.register[8], resp.register[9]),
      statesShrinkwrapper = switchData(resp.register[10], resp.register[11]),
      statesTaper = switchData(resp.register[12], resp.register[13]),
      statesCheckweigher = switchData(resp.register[14], resp.register[15]),
      statesPrinter = switchData(resp.register[16], resp.register[17]),
      statesPaletizer = switchData(resp.register[18], resp.register[19]);
    //BottleSorter -------------------------------------------------------------------------------------------------------------
    ctBottleSorter = joinWord(resp.register[23], resp.register[22]);
    if (flagONS1 === 0) {
      speedTempBottleSorter = ctBottleSorter;
      flagONS1 = 1;
    }
    if (secBottleSorter >= 60) {
      if (stopCountBottleSorter === 0 || flagStopBottleSorter == 1) {
        flagPrintBottleSorter = 1;
        secBottleSorter = 0;
        speedBottleSorter = ctBottleSorter - speedTempBottleSorter;
        speedTempBottleSorter = ctBottleSorter;
      }
      if (flagStopBottleSorter == 1) {
        timeBottleSorter = Date.now();
      }
    }
    secBottleSorter++;
    if (ctBottleSorter > actualBottleSorter) {
      stateBottleSorter = 1; //RUN
      if (stopCountBottleSorter >= timeStop) {
        speedBottleSorter = 0;
        secBottleSorter = 0;
      }
      timeBottleSorter = Date.now();
      stopCountBottleSorter = 0;
      flagStopBottleSorter = 0;


    } else if (ctBottleSorter == actualBottleSorter) {
      if (stopCountBottleSorter === 0) {
        timeBottleSorter = Date.now();
      }
      stopCountBottleSorter++;
      if (stopCountBottleSorter >= timeStop) {
        stateBottleSorter = 2; //STOP
        speedBottleSorter = 0;
        if (flagStopBottleSorter === 0) {
          flagPrintBottleSorter = 1;
          ////console.log(stateBottleSorter);
          secBottleSorter = 0;
        }
        flagStopBottleSorter = 1;
      }
    }
    if (stateBottleSorter == 2) {
      speedTempBottleSorter = ctBottleSorter;
    }

    actualBottleSorter = ctBottleSorter;
    if (stateBottleSorter == 2) {
      if (statesBottleSorter[5] == 1) {
        stateBottleSorter = 3; //Wait
      } else {
        if (statesBottleSorter[4] == 1) {
          stateBottleSorter = 4; //Block
        }
      }
    }
    BottleSorter = {
      ST: stateBottleSorter,
      //CPQI: joinWord(resp.register[65],resp.register[64]),
      CPQO: joinWord(resp.register[23], resp.register[22]),
      //CPQR: joinWord(resp.register[63],resp.register[62]),
      SP: speedBottleSorter
    };
    if (flagPrintBottleSorter == 1) {
      for (var key in BottleSorter) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L13_LOGS/pol_byd_BottleSorter_l13.log", "tt=" + timeBottleSorter + ",var=" + key + ",val=" + BottleSorter[key] + "\n");
      }
      flagPrintBottleSorter = 0;
    }
    //BottleSorter -------------------------------------------------------------------------------------------------------------
    //Fillercapper -------------------------------------------------------------------------------------------------------------
    ctFillercapper = joinWord(resp.register[25], resp.register[24]);
    if (flagONS2 === 0) {
      speedTempFillercapper = ctFillercapper;
      flagONS2 = 1;
    }
    if (secFillercapper >= 60) {
      if (stopCountFillercapper === 0 || flagStopFillercapper == 1) {
        flagPrintFillercapper = 1;
        secFillercapper = 0;
        speedFillercapper = ctFillercapper - speedTempFillercapper;
        speedTempFillercapper = ctFillercapper;
      }
      if (flagStopFillercapper == 1) {
        timeFillercapper = Date.now();
      }
    }
    secFillercapper++;
    if (ctFillercapper > actualFillercapper) {
      stateFillercapper = 1; //RUN
      if (stopCountFillercapper >= timeStop) {
        speedFillercapper = 0;
        secFillercapper = 0;
      }
      timeFillercapper = Date.now();
      stopCountFillercapper = 0;
      flagStopFillercapper = 0;


    } else if (ctFillercapper == actualFillercapper) {
      if (stopCountFillercapper === 0) {
        timeFillercapper = Date.now();
      }
      stopCountFillercapper++;
      if (stopCountFillercapper >= timeStop) {
        stateFillercapper = 2; //STOP
        speedFillercapper = 0;
        if (flagStopFillercapper === 0) {
          flagPrintFillercapper = 1;
          ////console.log(stateFillercapper);
          secFillercapper = 0;
        }
        flagStopFillercapper = 1;
      }
    }
    if (stateFillercapper == 2) {
      speedTempFillercapper = ctFillercapper;
    }

    actualFillercapper = ctFillercapper;
    if (stateFillercapper == 2) {
      if (statesFillercapper[5] == 1) {
        stateFillercapper = 3; //Wait
      } else {
        if (statesFillercapper[4] == 1) {
          stateFillercapper = 4; //Block
        }
      }
    }
    Fillercapper = {
      ST: stateFillercapper,
      CPQI: joinWord(resp.register[25], resp.register[24]),
      CPQO: joinWord(resp.register[27], resp.register[26]),
      CPQR: joinWord(resp.register[29], resp.register[28]),
      SP: speedFillercapper
    };
    if (flagPrintFillercapper == 1) {
      for (var key in Fillercapper) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L13_LOGS/pol_byd_Fillercapper_l13.log", "tt=" + timeFillercapper + ",var=" + key + ",val=" + Fillercapper[key] + "\n");
      }
      flagPrintFillercapper = 0;
    }
    //Fillercapper -------------------------------------------------------------------------------------------------------------
    //CapSorter -------------------------------------------------------------------------------------------------------------
    ctCapSorter = joinWord(resp.register[31], resp.register[30]);
    if (flagONS3 === 0) {
      speedTempCapSorter = ctCapSorter;
      flagONS3 = 1;
    }
    if (secCapSorter >= 60) {
      if (stopCountCapSorter === 0 || flagStopCapSorter == 1) {
        flagPrintCapSorter = 1;
        secCapSorter = 0;
        speedCapSorter = ctCapSorter - speedTempCapSorter;
        speedTempCapSorter = ctCapSorter;
      }
      if (flagStopCapSorter == 1) {
        timeCapSorter = Date.now();
      }
    }
    secCapSorter++;
    if (ctCapSorter > actualCapSorter) {
      stateCapSorter = 1; //RUN
      if (stopCountCapSorter >= timeStop) {
        speedCapSorter = 0;
        secCapSorter = 0;
      }
      timeCapSorter = Date.now();
      stopCountCapSorter = 0;
      flagStopCapSorter = 0;


    } else if (ctCapSorter == actualCapSorter) {
      if (stopCountCapSorter === 0) {
        timeCapSorter = Date.now();
      }
      stopCountCapSorter++;
      if (stopCountCapSorter >= timeStop) {
        stateCapSorter = 2; //STOP
        speedCapSorter = 0;
        if (flagStopCapSorter === 0) {
          flagPrintCapSorter = 1;
          ////console.log(stateCapSorter);
          secCapSorter = 0;
        }
        flagStopCapSorter = 1;
      }
    }
    if (stateCapSorter == 2) {
      speedTempCapSorter = ctCapSorter;
    }

    actualCapSorter = ctCapSorter;
    if (stateCapSorter == 2) {
      if (statesCapSorter[5] == 1) {
        stateCapSorter = 3; //Wait
      } else {
        if (statesCapSorter[4] == 1) {
          stateCapSorter = 4; //Block
        }
      }
    }
    CapSorter = {
      ST: stateCapSorter,
      //CPQI: joinWord(resp.register[23],resp.register[22]),
      CPQO: joinWord(resp.register[31], resp.register[30]),
      //CPQR: joinWord(resp.register[27],resp.register[26]),
      SP: speedCapSorter
    };
    if (flagPrintCapSorter == 1) {
      for (var key in CapSorter) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L13_LOGS/pol_byd_CapSorter_l13.log", "tt=" + timeCapSorter + ",var=" + key + ",val=" + CapSorter[key] + "\n");
      }
      flagPrintCapSorter = 0;
    }
    //CapSorter -------------------------------------------------------------------------------------------------------------
    //Depuck -------------------------------------------------------------------------------------------------------------
    ctDepuck = joinWord(resp.register[33], resp.register[32]);
    if (flagONS4 === 0) {
      speedTempDepuck = ctDepuck;
      flagONS4 = 1;
    }
    if (secDepuck >= 60) {
      if (stopCountDepuck === 0 || flagStopDepuck == 1) {
        flagPrintDepuck = 1;
        secDepuck = 0;
        speedDepuck = ctDepuck - speedTempDepuck;
        speedTempDepuck = ctDepuck;
      }
      if (flagStopDepuck == 1) {
        timeDepuck = Date.now();
      }
    }
    secDepuck++;
    if (ctDepuck > actualDepuck) {
      stateDepuck = 1; //RUN
      if (stopCountDepuck >= timeStop) {
        speedDepuck = 0;
        secDepuck = 0;
      }
      timeDepuck = Date.now();
      stopCountDepuck = 0;
      flagStopDepuck = 0;


    } else if (ctDepuck == actualDepuck) {
      if (stopCountDepuck === 0) {
        timeDepuck = Date.now();
      }
      stopCountDepuck++;
      if (stopCountDepuck >= timeStop) {
        stateDepuck = 2; //STOP
        speedDepuck = 0;
        if (flagStopDepuck === 0) {
          flagPrintDepuck = 1;
          ////console.log(stateDepuck);
          secDepuck = 0;
        }
        flagStopDepuck = 1;
      }
    }
    if (stateDepuck == 2) {
      speedTempDepuck = ctDepuck;
    }

    actualDepuck = ctDepuck;
    if (stateDepuck == 2) {
      if (statesDepuck[5] == 1) {
        stateDepuck = 3; //Wait
      } else {
        if (statesDepuck[4] == 1) {
          stateDepuck = 4; //Block
        }
      }
    }
    Depuck = {
      ST: stateDepuck,
      //CPQI: joinWord(resp.register[23],resp.register[22]),
      CPQO: joinWord(resp.register[33], resp.register[32]),
      //CPQR: joinWord(resp.register[27],resp.register[26]),
      SP: speedDepuck
    };
    if (flagPrintDepuck == 1) {
      for (var key in Depuck) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L13_LOGS/pol_byd_Depuck_l13.log", "tt=" + timeDepuck + ",var=" + key + ",val=" + Depuck[key] + "\n");
      }
      flagPrintDepuck = 0;
    }
    //Depuck -------------------------------------------------------------------------------------------------------------
    //Labeller -------------------------------------------------------------------------------------------------------------
    ctLabeller = joinWord(resp.register[35], resp.register[34]);
    if (flagONS5 === 0) {
      speedTempLabeller = ctLabeller;
      flagONS5 = 1;
    }
    if (secLabeller >= 60) {
      if (stopCountLabeller === 0 || flagStopLabeller == 1) {
        flagPrintLabeller = 1;
        secLabeller = 0;
        speedLabeller = ctLabeller - speedTempLabeller;
        speedTempLabeller = ctLabeller;
      }
      if (flagStopLabeller == 1) {
        timeLabeller = Date.now();
      }
    }
    secLabeller++;
    if (ctLabeller > actualLabeller) {
      stateLabeller = 1; //RUN
      if (stopCountLabeller >= timeStop) {
        speedLabeller = 0;
        secLabeller = 0;
      }
      timeLabeller = Date.now();
      stopCountLabeller = 0;
      flagStopLabeller = 0;


    } else if (ctLabeller == actualLabeller) {
      if (stopCountLabeller === 0) {
        timeLabeller = Date.now();
      }
      stopCountLabeller++;
      if (stopCountLabeller >= timeStop) {
        stateLabeller = 2; //STOP
        speedLabeller = 0;
        if (flagStopLabeller === 0) {
          flagPrintLabeller = 1;
          ////console.log(stateLabeller);
          secLabeller = 0;
        }
        flagStopLabeller = 1;
      }
    }
    if (stateLabeller == 2) {
      speedTempLabeller = ctLabeller;
    }

    actualLabeller = ctLabeller;
    if (stateLabeller == 2) {
      if (statesLabeller[5] == 1) {
        stateLabeller = 3; //Wait
      } else {
        if (statesLabeller[4] == 1) {
          stateLabeller = 4; //Block
        }
      }
    }
    Labeller = {
      ST: stateLabeller,
      CPQI: joinWord(resp.register[35], resp.register[34]),
      CPQO: joinWord(resp.register[37], resp.register[36]),
      CPQR: joinWord(resp.register[39], resp.register[38]),
      SP: speedLabeller
    };
    if (flagPrintLabeller == 1) {
      for (var key in Labeller) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L13_LOGS/pol_byd_Labeller_l13.log", "tt=" + timeLabeller + ",var=" + key + ",val=" + Labeller[key] + "\n");
      }
      flagPrintLabeller = 0;
    }
    //Labeller -------------------------------------------------------------------------------------------------------------
    //Shrinkwrapper -------------------------------------------------------------------------------------------------------------
    ctShrinkwrapper = joinWord(resp.register[41], resp.register[40]);
    if (flagONS6 === 0) {
      speedTempShrinkwrapper = ctShrinkwrapper;
      flagONS6 = 1;
    }
    if (secShrinkwrapper >= 60) {
      if (stopCountShrinkwrapper === 0 || flagStopShrinkwrapper == 1) {
        flagPrintShrinkwrapper = 1;
        secShrinkwrapper = 0;
        speedShrinkwrapper = ctShrinkwrapper - speedTempShrinkwrapper;
        speedTempShrinkwrapper = ctShrinkwrapper;
      }
      if (flagStopShrinkwrapper == 1) {
        timeShrinkwrapper = Date.now();
      }
    }
    secShrinkwrapper++;
    if (ctShrinkwrapper > actualShrinkwrapper) {
      stateShrinkwrapper = 1; //RUN
      if (stopCountShrinkwrapper >= timeStop) {
        speedShrinkwrapper = 0;
        secShrinkwrapper = 0;
      }
      timeShrinkwrapper = Date.now();
      stopCountShrinkwrapper = 0;
      flagStopShrinkwrapper = 0;


    } else if (ctShrinkwrapper == actualShrinkwrapper) {
      if (stopCountShrinkwrapper === 0) {
        timeShrinkwrapper = Date.now();
      }
      stopCountShrinkwrapper++;
      if (stopCountShrinkwrapper >= timeStop) {
        stateShrinkwrapper = 2; //STOP
        speedShrinkwrapper = 0;
        if (flagStopShrinkwrapper === 0) {
          flagPrintShrinkwrapper = 1;
          ////console.log(stateShrinkwrapper);
          secShrinkwrapper = 0;
        }
        flagStopShrinkwrapper = 1;
      }
    }
    if (stateShrinkwrapper == 2) {
      speedTempShrinkwrapper = ctShrinkwrapper;
    }

    actualShrinkwrapper = ctShrinkwrapper;
    if (stateShrinkwrapper == 2) {
      if (statesShrinkwrapper[5] == 1) {
        stateShrinkwrapper = 3; //Wait
      } else {
        if (statesShrinkwrapper[4] == 1) {
          stateShrinkwrapper = 4; //Block
        }
      }
    }
    Shrinkwrapper = {
      ST: stateShrinkwrapper,
      CPQI: joinWord(resp.register[41], resp.register[40]),
      CPQO: joinWord(resp.register[43], resp.register[42]),
      //CPQR: joinWord(resp.register[37],resp.register[36]),
      SP: speedShrinkwrapper
    };
    if (flagPrintShrinkwrapper == 1) {
      for (var key in Shrinkwrapper) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L13_LOGS/pol_byd_Shrinkwrapper_l13.log", "tt=" + timeShrinkwrapper + ",var=" + key + ",val=" + Shrinkwrapper[key] + "\n");
      }
      flagPrintShrinkwrapper = 0;
    }
    //Shrinkwrapper -------------------------------------------------------------------------------------------------------------
    //Taper -------------------------------------------------------------------------------------------------------------
    ctTaper = joinWord(resp.register[45], resp.register[44]);
    if (flagONS7 === 0) {
      speedTempTaper = ctTaper;
      flagONS7 = 1;
    }
    if (secTaper >= 60) {
      if (stopCountTaper === 0 || flagStopTaper == 1) {
        flagPrintTaper = 1;
        secTaper = 0;
        speedTaper = ctTaper - speedTempTaper;
        speedTempTaper = ctTaper;
      }
      if (flagStopTaper == 1) {
        timeTaper = Date.now();
      }
    }
    secTaper++;
    if (ctTaper > actualTaper) {
      stateTaper = 1; //RUN
      if (stopCountTaper >= timeStop) {
        speedTaper = 0;
        secTaper = 0;
      }
      timeTaper = Date.now();
      stopCountTaper = 0;
      flagStopTaper = 0;


    } else if (ctTaper == actualTaper) {
      if (stopCountTaper === 0) {
        timeTaper = Date.now();
      }
      stopCountTaper++;
      if (stopCountTaper >= timeStop) {
        stateTaper = 2; //STOP
        speedTaper = 0;
        if (flagStopTaper === 0) {
          flagPrintTaper = 1;
          ////console.log(stateTaper);
          secTaper = 0;
        }
        flagStopTaper = 1;
      }
    }
    if (stateTaper == 2) {
      speedTempTaper = ctTaper;
    }

    actualTaper = ctTaper;
    if (stateTaper == 2) {
      if (statesTaper[5] == 1) {
        stateTaper = 3; //Wait
      } else {
        if (statesTaper[4] == 1) {
          stateTaper = 4; //Block
        }
      }
    }
    Taper = {
      ST: stateTaper,
      //CPQI: joinWord(resp.register[39],resp.register[38]),
      CPQO: joinWord(resp.register[45], resp.register[44]),
      //CPQR: joinWord(resp.register[37],resp.register[36]),
      SP: speedTaper
    };
    if (flagPrintTaper == 1) {
      for (var key in Taper) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L13_LOGS/pol_byd_Taper_l13.log", "tt=" + timeTaper + ",var=" + key + ",val=" + Taper[key] + "\n");
      }
      flagPrintTaper = 0;
    }
    //Taper -------------------------------------------------------------------------------------------------------------
    //Printer -------------------------------------------------------------------------------------------------------------
    ctPrinter = joinWord(resp.register[47], resp.register[46]);
    if (flagONS8 === 0) {
      speedTempPrinter = ctPrinter;
      flagONS8 = 1;
    }
    if (secPrinter >= 60) {
      if (stopCountPrinter === 0 || flagStopPrinter == 1) {
        flagPrintPrinter = 1;
        secPrinter = 0;
        speedPrinter = ctPrinter - speedTempPrinter;
        speedTempPrinter = ctPrinter;
      }
      if (flagStopPrinter == 1) {
        timePrinter = Date.now();
      }
    }
    secPrinter++;
    if (ctPrinter > actualPrinter) {
      statePrinter = 1; //RUN
      if (stopCountPrinter >= timeStop) {
        speedPrinter = 0;
        secPrinter = 0;
      }
      timePrinter = Date.now();
      stopCountPrinter = 0;
      flagStopPrinter = 0;


    } else if (ctPrinter == actualPrinter) {
      if (stopCountPrinter === 0) {
        timePrinter = Date.now();
      }
      stopCountPrinter++;
      if (stopCountPrinter >= timeStop) {
        statePrinter = 2; //STOP
        speedPrinter = 0;
        if (flagStopPrinter === 0) {
          flagPrintPrinter = 1;
          ////console.log(statePrinter);
          secPrinter = 0;
        }
        flagStopPrinter = 1;
      }
    }
    if (statePrinter == 2) {
      speedTempPrinter = ctPrinter;
    }

    actualPrinter = ctPrinter;
    if (statePrinter == 2) {
      if (statesPrinter[5] == 1) {
        statePrinter = 3; //Wait
      } else {
        if (statesPrinter[4] == 1) {
          statePrinter = 4; //Block
        }
      }
    }
    Printer = {
      ST: statePrinter,
      CPQI: joinWord(resp.register[47], resp.register[46]),
      CPQO: joinWord(resp.register[49], resp.register[48]),
      CPQR: joinWord(resp.register[51], resp.register[50]),
      SP: speedPrinter
    };
    if (flagPrintPrinter == 1) {
      for (var key in Printer) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L13_LOGS/pol_byd_Printer_l13.log", "tt=" + timePrinter + ",var=" + key + ",val=" + Printer[key] + "\n");
      }
      flagPrintPrinter = 0;
    }
    //Printer -------------------------------------------------------------------------------------------------------------
    //Checkweigher -------------------------------------------------------------------------------------------------------------
    ctCheckweigher = joinWord(resp.register[53], resp.register[52]);
    if (flagONS9 === 0) {
      speedTempCheckweigher = ctCheckweigher;
      flagONS9 = 1;
    }
    if (secCheckweigher >= 60) {
      if (stopCountCheckweigher === 0 || flagStopCheckweigher == 1) {
        flagPrintCheckweigher = 1;
        secCheckweigher = 0;
        speedCheckweigher = ctCheckweigher - speedTempCheckweigher;
        speedTempCheckweigher = ctCheckweigher;
      }
      if (flagStopCheckweigher == 1) {
        timeCheckweigher = Date.now();
      }
    }
    secCheckweigher++;
    if (ctCheckweigher > actualCheckweigher) {
      stateCheckweigher = 1; //RUN
      if (stopCountCheckweigher >= timeStop) {
        speedCheckweigher = 0;
        secCheckweigher = 0;
      }
      timeCheckweigher = Date.now();
      stopCountCheckweigher = 0;
      flagStopCheckweigher = 0;


    } else if (ctCheckweigher == actualCheckweigher) {
      if (stopCountCheckweigher === 0) {
        timeCheckweigher = Date.now();
      }
      stopCountCheckweigher++;
      if (stopCountCheckweigher >= timeStop) {
        stateCheckweigher = 2; //STOP
        speedCheckweigher = 0;
        if (flagStopCheckweigher === 0) {
          flagPrintCheckweigher = 1;
          ////console.log(stateCheckweigher);
          secCheckweigher = 0;
        }
        flagStopCheckweigher = 1;
      }
    }
    if (stateCheckweigher == 2) {
      speedTempCheckweigher = ctCheckweigher;
    }

    actualCheckweigher = ctCheckweigher;
    if (stateCheckweigher == 2) {
      if (statesCheckweigher[5] == 1) {
        stateCheckweigher = 3; //Wait
      } else {
        if (statesCheckweigher[4] == 1) {
          stateCheckweigher = 4; //Block
        }
      }
    }
    Checkweigher = {
      ST: stateCheckweigher,
      CPQI: joinWord(resp.register[53], resp.register[52]),
      CPQO: joinWord(resp.register[55], resp.register[54]),
      CPQR: joinWord(resp.register[57], resp.register[56]),
      SP: speedCheckweigher
    };
    if (flagPrintCheckweigher == 1) {
      for (var key in Checkweigher) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L13_LOGS/pol_byd_Checkweigher_l13.log", "tt=" + timeCheckweigher + ",var=" + key + ",val=" + Checkweigher[key] + "\n");
      }
      flagPrintCheckweigher = 0;
    }
    //Checkweigher -------------------------------------------------------------------------------------------------------------
    //Paletizer -------------------------------------------------------------------------------------------------------------
    ctPaletizer = joinWord(resp.register[59], resp.register[58]);
    if (flagONS10 === 0) {
      speedTempPaletizer = ctPaletizer;
      flagONS10 = 1;
    }
    if (secPaletizer >= 60) {
      if (stopCountPaletizer === 0 || flagStopPaletizer == 1) {
        flagPrintPaletizer = 1;
        secPaletizer = 0;
        speedPaletizer = ctPaletizer - speedTempPaletizer;
        speedTempPaletizer = ctPaletizer;
      }
      if (flagStopPaletizer == 1) {
        timePaletizer = Date.now();
      }
    }
    secPaletizer++;
    if (ctPaletizer > actualPaletizer) {
      statePaletizer = 1; //RUN
      if (stopCountPaletizer >= timeStop) {
        speedPaletizer = 0;
        secPaletizer = 0;
      }
      timePaletizer = Date.now();
      stopCountPaletizer = 0;
      flagStopPaletizer = 0;


    } else if (ctPaletizer == actualPaletizer) {
      if (stopCountPaletizer === 0) {
        timePaletizer = Date.now();
      }
      stopCountPaletizer++;
      if (stopCountPaletizer >= timeStop) {
        statePaletizer = 2; //STOP
        speedPaletizer = 0;
        if (flagStopPaletizer === 0) {
          flagPrintPaletizer = 1;
          ////console.log(statePaletizer);
          secPaletizer = 0;
        }
        flagStopPaletizer = 1;
      }
    }
    if (statePaletizer == 2) {
      speedTempPaletizer = ctPaletizer;
    }

    actualPaletizer = ctPaletizer;
    if (statePaletizer == 2) {
      if (statesPaletizer[5] == 1) {
        statePaletizer = 3; //Wait
      } else {
        if (statesPaletizer[4] == 1) {
          statePaletizer = 4; //Block
        }
      }
    }
    Paletizer = {
      ST: statePaletizer,
      CPQI: joinWord(resp.register[59], resp.register[58]),
      //CPQO: joinWord(resp.register[53],resp.register[52]),
      //CPQR: joinWord(resp.register[55],resp.register[54]),
      SP: speedPaletizer
    };
    if (flagPrintPaletizer == 1) {
      for (var key in Paletizer) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L13_LOGS/pol_byd_Paletizer_l13.log", "tt=" + timePaletizer + ",var=" + key + ",val=" + Paletizer[key] + "\n");
      }
      flagPrintPaletizer = 0;
    }
    //Paletizer -------------------------------------------------------------------------------------------------------------

    //Barcode -------------------------------------------------------------------------------------------------------------
    if (resp.register[68] == 0 && resp.register[69] == 0 && resp.register[62] == 0 && resp.register[63] == 0 && resp.register[64] == 0 && resp.register[65] == 0 && resp.register[66] == 0 && resp.register[67] == 0) {
      Barcode = '0';
    } else {

      var dig1 = hex2a(assignment(resp.register[62]).toString(16));
      var dig2 = hex2a(assignment(resp.register[63]).toString(16));
      var dig3 = hex2a(assignment(resp.register[64]).toString(16));
      var dig4 = hex2a(assignment(resp.register[65]).toString(16));
      var dig5 = hex2a(assignment(resp.register[66]).toString(16));
      var dig6 = hex2a(assignment(resp.register[67]).toString(16));
      var dig7 = hex2a(assignment(resp.register[68]).toString(16));
      var dig8 = hex2a(assignment(resp.register[69]).toString(16));

      Barcode = dig1 + dig2 + dig3 + dig4 + dig5 + dig6 + dig7 + dig8;
    }
    if (isNaN(Barcode)) {
      Barcode = '0';
    }
    if (secBarcode >= 60) {
      writedataBarcode(Barcode, "pol_byd_Barcode_l13.log");
      secBarcode = 0;
    }
    secBarcode++;
    //Barcode -------------------------------------------------------------------------------------------------------------
    //EOL --------------------------------------------------------------------------------------------------------------------
    if (secEOL >= 60) {
      fs.appendFileSync("../BYD_L13_LOGS/pol_byd_EOL_l13.log", "tt=" + Date.now() + ",var=EOL" + ",val=" + Paletizer.CPQI + "\n");
      secEOL = 0;
    }
    secEOL++;
    //EOL --------------------------------------------------------------------------------------------------------------------
    if (secPubNub >= 60 * 5) {

      function idle() {
        i = 0;
        text2send = [];
        for (k = 0; k < files.length; k++) { //Verificar los archivos
          var stats = fs.statSync("/home/oee/Pulse/BYD_L13_LOGS/" + files[k]);
          var mtime = new Date(stats.mtime).getTime();
          if (mtime < (Date.now() - (3 * 60 * 1000)) && files[k].indexOf("serialbox") == -1) {
            flagInfo2Send = 1;
            text2send[i] = files[k];
            i++;
          }
        }
      }

      idle();
      secPubNub = 0;
      publishConfig = {
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          message: {
            line: "13",
            tt: Date.now(),
            machines: text2send
          }
        }
      };
      senderData();
    }
    secPubNub++;
  }); //END Client Read
};
// registering remote methods
clientHttp.registerMethod("postMethod", "http://35.160.68.187:23000/heartbeatLine/Byd", "POST");


function senderData() {
  clientHttp.methods.postMethod(publishConfig, function(data, response) {
    // parsed response body as js object
    console.log(data.toString());
  });
}

var assignment = function(val) {
  var result;
  if (val < 4095)
    result = "";
  else
    result = val;
  return result;
};

function hex2a(hex) {
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

var stateMachine = function(data) {
  if (data[7] == 1) {
    return 1; //RUN
  }
  if (data[6] == 1) {
    return 2; //STOP
  }
  if (data[5] == 1) {
    return 3; //WAIT
  }
  if (data[4] == 1) {
    return 4; //BLOCK
  }
  return 2;
};

var counterState = function(actual, temp) {
  if (actual != temp) {
    return 1;
  } else {
    return 2;
  }
};

var writedata = function(varJson, nameFile) {
  var data;
  var timet = Date.now();
  for (var key in varJson) {
    fs.appendFileSync("/home/pi/Pulse/BYD_L13_LOGS/" + nameFile, "tt=" + timet + ",var=" + key + ",val=" + varJson[key] + "\n");
  }
};

var writedataBarcode = function(barcode, nameFile) {
  var timet = Date.now();
  fs.appendFileSync("/home/oee/Pulse/BYD_L13_LOGS/" + nameFile, "tt=" + timet + ",var=bc" + ",val=" + barcode + "\n");
};

var joinWord = function(num1, num2) {
  var bits = "00000000000000000000000000000000";
  var bin1 = num1.toString(2),
    bin2 = num2.toString(2),
    newNum = bits.split("");

  for (var i = 0; i < bin1.length; i++) {
    newNum[31 - i] = bin1[(bin1.length - 1) - i];
  }
  for (var j = 0; j < bin2.length; j++) {
    newNum[15 - j] = bin2[(bin2.length - 1) - j];
  }
  bits = newNum.join("");
  return parseInt(bits, 2);
};
var switchData = function(num1, num2) {
  var bits = "00000000000000000000000000000000";
  var bin1 = num1.toString(2),
    bin2 = num2.toString(2),
    newNum = bits.split("");

  for (var i = 0; i < bin1.length; i++) {
    newNum[15 - i] = bin1[(bin1.length - 1) - i];
  }
  for (var j = 0; j < bin2.length; j++) {
    newNum[31 - j] = bin2[(bin2.length - 1) - j];
  }
  bits = newNum.join("");

  return bits;
};

var stop = function() {
  ///This function clean data
  clearInterval(intId);
  process.exit(0);
};

var shutdown = function() {
  ///Use function STOP and close connection
  stop();
  client.close();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);


///*If client is connect call a function "DoRead"*/
client.on('connect', function(err) {
  setInterval(function() {
    DoRead();
  }, 1000);
});

///*If client is in a error ejecute an acction*/
client.on('error', function(err) {
  fs.appendFileSync("error.log", "ID 1: " + Date.now() + ": " + err + "\n");
  //console.log('Client Error', err);
});
///If client try closed, this metodo try reconnect client to server
client.on('close', function() {
  //console.log('Client closed, stopping interval.');
  fs.appendFileSync("error.log", "ID 2: " + Date.now() + ": " + 'Client closed, stopping interval.' + "\n");
  stop();
});
