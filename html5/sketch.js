//Autor: Jaime Jose Gavin Sierra
//Ackerman
//Jukebox dtmf y monotone.
// Received gamepad MT8870 and Sound Card mic or line in DTMF or Monotone
// 0 - 10 Song
// 11 - Up volume
// 12 - Down volume
// 13 - Last
// 14 - Next
// 15 - Play/Pause

var gb_value_stq,gb_value_q4,gb_value_q3,gb_value_q2,gb_value_q1;
var gb_value_stq_antes,gb_value_q4_antes,gb_value_q3_antes,gb_value_q2_antes,gb_value_q1_antes;

var gb_cad_bit_dtmf='';
var stq_antes=0;
var dato=0;
var gb_cadDTMF='';
var cad_areaRX='';

var gb_forceDraw = false;

var gb_ctrl_btn_input_stq;
var gb_ctrl_btn_input_q4;
var gb_ctrl_btn_input_q3;
var gb_ctrl_btn_input_q2;
var gb_ctrl_btn_input_q1;
var gb_ctrl_lbl_q1;
var gb_ctrl_lbl_q2;
var gb_ctrl_lbl_q3;
var gb_ctrl_lbl_q4;
var gb_ctrl_lbl_stq;
var gb_ctrl_btnClear;
var gb_ctrl_btnStop;
var gb_cad_botones='';

var gb_oscTone1;
var gb_oscTone2;
var gb_current_array_dtmf = 0;
var gb_total_array_dtmf = 0;
var gb_buf_send_dtmf = '';
var gb_play_array_dtmf= false;
var gb_begin_dtmf = false;
var gb_end_dtmf = false;
var gb_begin_silence = false;
var gb_end_silence = false;
var gb_ini_dtmf;

var gb_current_array_monotone = 0;
var gb_total_array_monotone = 0;
var gb_buf_send_monotone = '';
var gb_play_array_monotone= false;
var gb_begin_monotone = false;
var gb_end_monotone = false;
var gb_begin_silence = false;
var gb_end_silence = false;
var gb_ini_monotone;

var gb_mic, gb_fft;
var gb_fft_dtmf='';
var gb_fft_dtmf_antes='';
var gb_ini_fft_dtmf = false;
var gb_ini_fft_dtmf_time;

var gb_buf_rcv_dtmf = '' //string buffer recepcion 
var gb_event_new_data_dtmf= false;
var gb_begin_sync_dtmf= false;

var gb_song_array;
var gb_current_track=0;
var gb_pauseplay_track=0;

var contIniAsteriscos = 0;
var contFinAsteriscos = 0;

var gb_cad_playTrack = '';
var gb_begin_sms = false;
var gb_end_sms = false;

var gb_ctrl_chkbox_dtmf;
var gb_ctrl_lbl_speed_dtmf; //Speed
var gb_ctrl_input_speed_dtmf; //Speed
var gb_ctrl_chkbox_fast; //modo fast
var gb_ctrl_chkbox_log;
var gb_ctrl_chkboxNTSC; //sincronizado ntsc

//Configuraciones
var gb_id_stq = 3;             //Boton PAD para pin STQ MT8870
var gb_id_q4 = 5;              //Boton PAD para pin Q4 MT8870
var gb_id_q3 = 6;              //Boton PAD para pin Q3 MT8870
var gb_id_q2 = 9;              //Boton PAD para pin Q2 MT8870
var gb_id_q1 = 10;             //Boton PAD para pin Q1 MT8870
var gb_speed_dtmf = 1;         //Velocidad envio tonos 1 .. 17 (Solo MT8870)
var gb_use_dtmf = true;        //Detecta DTMF o monotono
var gb_use_fast = false;       //Modo fast reducir tonos
var gb_log_debug = true;       //Debug consola
var gb_use_gamepad_dtmf= false;//Usar gamepad
var gb_use_mic_dtmf= true;     //Usar microfono
var gb_use_ntsc_arduino = false;   //Sonido sincronizados con NTSC 63.55 microseconds

//resto variables
var gb_time_silence = 1000;
var gb_time_sound = 500;
var gb_fft_dtmf_two_monotone = '';


//Rutina principal Setup inicial
function setup(){
 try{
  createCanvas(windowWidth, windowHeight);
  textFont('Courier');
  textSize(20);
  
  PreLoadOscillator(); //Osciladores
  ActivarMic(); //Preparar la captura de microfono	  
   
  gb_value_stq= gb_value_q4= gb_value_q3= gb_value_q2 = gb_value_q1 = 0;
  //gb_value_stq_antes = gb_value_q4_antes = gb_value_q3_antes = gb_value_q2_antes = gb_value_q1_antes = 0;  
  
  gb_ctrl_btnClear = createButton('Clear');
  gb_ctrl_btnClear.position(150, 150);
  gb_ctrl_btnClear.mousePressed(ClearDtmf);
   
  gb_ctrl_btnStop = createButton('Stop');
  gb_ctrl_btnStop.position(150, 180);
  gb_ctrl_btnStop.mousePressed(StopSound);
    
  //btnPruebaSendDTMF = createButton('Send');
  //btnPruebaSendDTMF.position(220, 210);
  //btnPruebaSendDTMF.mousePressed(PruebaSendDTMF);
  
  gb_ctrl_lbl_stq = createElement('h4', 'STQ'); //label
  gb_ctrl_lbl_stq.position(10,130);
  gb_ctrl_btn_input_stq = createInput(gb_id_stq.toString(),'number');  
  gb_ctrl_btn_input_stq.style('width','40px');
  gb_ctrl_btn_input_stq.position(50, 150);
  gb_ctrl_btn_input_stq.input(LoadBotones);
  gb_ctrl_btn_input_stq.elt.min = 0;
  gb_ctrl_btn_input_stq.elt.max = 99;
  gb_ctrl_btn_input_stq.elt.value = gb_id_stq.toString();

  gb_ctrl_lbl_q4 = createElement('h4', 'Q4'); //label
  gb_ctrl_lbl_q4.position(10,160);
  gb_ctrl_btn_input_q4 = createInput(gb_id_q4.toString(),'number');
  gb_ctrl_btn_input_q4.style('width','40px');
  gb_ctrl_btn_input_q4.position(50, 180);
  gb_ctrl_btn_input_q4.input(LoadBotones);
  gb_ctrl_btn_input_q4.elt.min = 0;
  gb_ctrl_btn_input_q4.elt.max = 99;
  gb_ctrl_btn_input_q4.elt.value = gb_id_q4.toString();
  
  gb_ctrl_lbl_q3 = createElement('h4', 'Q3'); //label
  gb_ctrl_lbl_q3.position(10,190);
  gb_ctrl_btn_input_q3 = createInput(gb_id_q3.toString(),'number');
  gb_ctrl_btn_input_q3.style('width','40px');
  gb_ctrl_btn_input_q3.position(50, 210);
  gb_ctrl_btn_input_q3.input(LoadBotones);
  gb_ctrl_btn_input_q3.elt.min = 0;
  gb_ctrl_btn_input_q3.elt.max = 99;  
  gb_ctrl_btn_input_q3.elt.value = gb_id_q3.toString();
  
  gb_ctrl_lbl_q2 = createElement('h4', 'Q2'); //label
  gb_ctrl_lbl_q2.position(10,220);
  gb_ctrl_btn_input_q2 = createInput(gb_id_q2.toString(),'number');
  gb_ctrl_btn_input_q2.style('width','40px');
  gb_ctrl_btn_input_q2.position(50, 240);
  gb_ctrl_btn_input_q2.input(LoadBotones);
  gb_ctrl_btn_input_q2.elt.min = 0;
  gb_ctrl_btn_input_q2.elt.max = 99;    
  gb_ctrl_btn_input_q2.elt.value = gb_id_q2.toString();
  
  gb_ctrl_lbl_q1 = createElement('h4', 'Q1'); //label
  gb_ctrl_lbl_q1.position(10,250);
  gb_ctrl_btn_input_q1 = createInput(gb_id_q1.toString(),'number');
  gb_ctrl_btn_input_q1.style('width','40px');
  gb_ctrl_btn_input_q1.position(50, 270);
  gb_ctrl_btn_input_q1.input(LoadBotones);
  gb_ctrl_btn_input_q1.elt.min = 0;
  gb_ctrl_btn_input_q1.elt.max = 99;      
  gb_ctrl_btn_input_q1.elt.value = gb_id_q1.toString();
  

  gb_ctrl_chkbox_dtmf = createCheckbox('DTMF', gb_use_dtmf); 
  gb_ctrl_chkbox_dtmf.position(150,210);
  gb_ctrl_chkbox_dtmf.changed(UseDTMFEvent);    
  UseDTMFEvent();
  
  gb_ctrl_lbl_speed_dtmf = createElement('h4', 'Vel'); //label
  gb_ctrl_lbl_speed_dtmf.position(150,220);
  gb_ctrl_input_speed_dtmf = createInput(gb_speed_dtmf.toString(),'number'); //input
  gb_ctrl_input_speed_dtmf.position(180, 240);
  gb_ctrl_input_speed_dtmf.style('width','40px');
  gb_ctrl_input_speed_dtmf.elt.min = 1;
  gb_ctrl_input_speed_dtmf.elt.max = 17;    
  gb_ctrl_input_speed_dtmf.input(SpeedEvent);
  gb_ctrl_input_speed_dtmf.elt.value = gb_speed_dtmf.toString();  
  SpeedEvent(); //Fuerza la velocidad leida

  gb_ctrl_chkbox_fast = createCheckbox('FAST', gb_use_fast); 
  gb_ctrl_chkbox_fast.position(150,270);
  gb_ctrl_chkbox_fast.changed(UseFastEvent);
  UseFastEvent();
  
  gb_ctrl_chkbox_log = createCheckbox('Log Debug', gb_log_debug); //TX y RX al mismo tiempo
  gb_ctrl_chkbox_log.position(250,150);
  gb_ctrl_chkbox_log.changed(LogDebugEvent);
  
  
  gb_ctrl_chkboxPAD = createCheckbox('GAMEPAD', gb_use_gamepad_dtmf); //checkbox joystick
  gb_ctrl_chkboxPAD.position(250,170);
  gb_ctrl_chkboxPAD.changed(GamePADEvent);
  
  gb_ctrl_chkboxMic = createCheckbox('Micrófono', gb_use_mic_dtmf);//checkbox mic
  gb_ctrl_chkboxMic.position(250,190);
  gb_ctrl_chkboxMic.changed(MicEvent);

  gb_ctrl_chkboxNTSC = createCheckbox('NTSC', gb_use_ntsc_arduino);//checkbox mic
  gb_ctrl_chkboxNTSC.position(250,210);
  gb_ctrl_chkboxNTSC.changed(NTSCEvent);  
   
	  
  gb_forceDraw = true;     
  //gb_song_array.play();
 }
 catch(err) 
 {
   DebugLog(err.message.toString());
 }  
}

//PAra sincronizar con sonidos NTSC arduinocade
function NTSCEvent()
{
 try
 {
  gb_use_ntsc_arduino = this.checked() ? true : false;  
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }  
}

//Seleccion Mic decodificar tonos DTMF
function MicEvent()
{
 try
 {
  gb_use_mic_dtmf = this.checked() ? true : false;
  ActivarMic();
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }  
}

//Seleccion de GAMEPAD para leer MT8870 tonos DTMF
function GamePADEvent()
{
 try
 {
  gb_use_gamepad_dtmf = this.checked() ? true : false;
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }  	
}

//Chequeado checkbos logdebug
function LogDebugEvent()
{
 try
 {    
  gb_log_debug = this.checked() ? true : false;
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 } 
}


//Preparar la captura de microfono	  
function ActivarMic()
{
 try
 {
  if (gb_use_mic_dtmf === true)
  {
   if ((typeof gb_mic === 'undefined') || (typeof gb_fft === 'undefined'))
   {
    gb_mic = new p5.AudioIn();
    gb_mic.start();
    gb_fft = new p5.FFT();
    gb_fft.setInput(gb_mic);  	  
   }
  }
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }
}

//Prepara los 2 tonos de los osciladores
function PreLoadOscillator()
{
 try
 {
  gb_oscTone1 = new p5.Oscillator();
  gb_oscTone1.setType('sine');
  gb_oscTone1.freq(697);
  gb_oscTone1.amp(1);
  gb_oscTone2 = new p5.Oscillator();
  gb_oscTone2.setType('sine');
  gb_oscTone2.freq(1209);
  gb_oscTone2.amp(1);
  //gb_oscTone2.start();	    
  //gb_oscTone1.start();
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }   
}


//Velocidad envio tonos
function SpeedEvent()
{
 try
 {
  gb_speed_dtmf = Number(gb_ctrl_input_speed_dtmf.elt.value);  
  switch (gb_speed_dtmf)
  {
   case 1: gb_time_silence = 1000; gb_time_sound = 500;
    break;
   case 2: gb_time_silence = 950; gb_time_sound = 500;
    break;
   case 3: gb_time_silence = 900; gb_time_sound = 450;
    break;
   case 4: gb_time_silence = 850; gb_time_sound = 450;
    break;
   case 5: gb_time_silence = 800; gb_time_sound = 400;
    break;
   case 6: gb_time_silence = 750; gb_time_sound = 400;
    break;
   case 6: gb_time_silence = 700; gb_time_sound = 350;
    break;
   case 6: gb_time_silence = 650; gb_time_sound = 350;
    break;
   case 7: gb_time_silence = 600; gb_time_sound = 300;
    break;	
   case 8: gb_time_silence = 550; gb_time_sound = 300;
    break;
   case 9: gb_time_silence = 500; gb_time_sound = 250;
    break;	
   case 10: gb_time_silence = 450; gb_time_sound = 250;
    break;	
   case 11: gb_time_silence = 400; gb_time_sound = 200;
    break;	
   case 12: gb_time_silence = 350; gb_time_sound = 200;
    break;	
   case 13: gb_time_silence = 300; gb_time_sound = 150;
    break;		
   case 14: gb_time_silence = 250; gb_time_sound = 150;
    break;		
   case 15: gb_time_silence = 200; gb_time_sound = 100;
    break;		
   case 16: gb_time_silence = 150; gb_time_sound = 100;
    break;		
   case 17: gb_time_silence = 100; gb_time_sound = 50;
    break;
   default: gb_time_silence = 1000; gb_time_sound = 500;
    break;
  }  
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }  
}

//Usar modo fast reducir envio tonos
function UseFastEvent()
{
 try
 {
  gb_use_fast = gb_ctrl_chkbox_fast.checked() ? true : false;	
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }  
}

//Use DTMF o Monotone
function UseDTMFEvent()
{
 try
 {
  gb_use_dtmf = gb_ctrl_chkbox_dtmf.checked() ? true : false;	
  var myKey = document.getElementById("keybuttonsDTMFSeq"); 
  var myPlayer = document.getElementById("keybuttonsDTMF"); 
  var myKeyMono = document.getElementById("keybuttonsMono"); 
  var myPlayerMono = document.getElementById("keybuttonsMonoSeq"); 
  if (gb_use_dtmf === true)
  {  
   myKey.style.display = 'block';
   myPlayer.style.display = 'block';  
   myKeyMono.style.display = 'none';
   myPlayerMono.style.display = 'none';    
  }
  else
  {  
   myKey.style.display = 'none';  
   myPlayer.style.display = 'none';  
   myKeyMono.style.display = 'block';
   myPlayerMono.style.display = 'block';      
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }  
}

function StopSound(){
 try
 {
  gb_oscTone1.stop();
  gb_oscTone2.stop();
  gb_play_array_dtmf = false;
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }  
}

//Para todos los sonidos Tracks
function StopAllTracks(){
 try
 {
  document.getElementById('soundTrack0').pause();
  document.getElementById('soundTrack1').pause();
  document.getElementById('soundTrack2').pause();
  document.getElementById('soundTrack3').pause();
  document.getElementById('soundTrack4').pause();
  document.getElementById('soundTrack5').pause(); 
  document.getElementById('soundTrack6').pause(); 
  document.getElementById('soundTrack7').pause();
  document.getElementById('soundTrack8').pause(); 
  document.getElementById('soundTrack9').pause(); 
  document.getElementById('soundTrack10').pause(); 
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

function ClearDtmf()
{
 try
 {
  cad_areaRX ='';
  gb_forceDraw = true;
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

//Reproduce un tono DTMF dado
function PlayDTMF(data)
{
 try
 { 
  gb_buf_send_dtmf = data;
  gb_total_array_dtmf= 0;
  gb_current_array_dtmf = 0;
  gb_play_array_dtmf= true;
  gb_begin_dtmf = false;
  gb_end_dtmf = false;
  gb_begin_silence = false;
  gb_end_silence = false;
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }  
}

//Reproduce una secuencia de tmonotones
function PlaySeqMonotone(cad)
{
 try
 {
  if (gb_use_fast === true)
  {
   switch (cad)
   {
    case '#00*': cad = '00'; break;
    case '#01*': cad = '01'; break;
    case '#02*': cad = '02'; break;   
    case '#04*': cad = '04'; break;      
    case '#07*': cad = '07'; break;
    case '#0D*': cad = '0D'; break;
    case '#10*': cad = '10'; break;
    case '#11*': cad = '11'; break;
    case '#12*': cad = '12'; break;
    case '#14*': cad = '14'; break;
    case '#17*': cad = '17'; break;
    case '#1D*': cad = '1D'; break;
    case '#20*': cad = '20'; break;
    case '#21*': cad = '21'; break;
    case '#22*': cad = '22'; break;
    case '#24*': cad = '24'; break;
    default: cad = ' '; break;
   }
  }
 
  let i=0;
  let len = cad.length;
  gb_buf_send_monotone = '';
  for (i=0; i<len ;i++)
  {
   gb_buf_send_monotone += cad[i];
  }
  gb_total_array_monotone= len;
  gb_current_array_monotone = 0;
  gb_play_array_monotone= true;
  gb_begin_monotone = false;
  gb_end_monotone = false;
  gb_begin_silence = false;
  gb_end_silence = false; 
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}


//Reproduce una secuencia de tonos dtmf
function PlaySeqDTMF(cad)
{ 
 try
 {
  if (gb_use_fast === true)
  {
   switch (cad)
   {
    case '#00*': cad = 'D'; break;
    case '#01*': cad = '1'; break;
    case '#02*': cad = '2'; break;
    case '#03*': cad = '3'; break;
    case '#04*': cad = '4'; break;
    case '#05*': cad = '5'; break;
    case '#06*': cad = '6'; break;
    case '#07*': cad = '7'; break;
    case '#08*': cad = '8'; break;
    case '#09*': cad = '9'; break;
    case '#09*': cad = '9'; break;
    case '#10*': cad = '0'; break; 
    case '#11*': cad = '*'; break; //Volumen up
    case '#12*': cad = '#'; break; //Volumen down   
    case '#13*': cad = 'A'; break; //Siguiente track
    case '#14*': cad = 'B'; break; //Anterior track
    case '#15*': cad = 'C'; break; //Play Pause        
    default: cad = ' '; break;
   }
  }
 
  let i=0;
  let len = cad.length; 
  gb_buf_send_dtmf = '';
  for (i=0; i<len ;i++)
  {
   gb_buf_send_dtmf += cad[i];
  }
  gb_total_array_dtmf= len;
  gb_current_array_dtmf = 0;
  gb_play_array_dtmf= true;
  gb_begin_dtmf = false;
  gb_end_dtmf = false;
  gb_begin_silence = false;
  gb_end_silence = false; 
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}


//Reproduce una sola frecuencia
function PlayMonotone(data)
{
 try
 {
  gb_buf_send_monotone = data;
  gb_total_array_monotone= 0;
  gb_current_array_monotone = 0;
  gb_play_array_monotone= true;
  gb_begin_monotone = false;
  gb_end_monotone = false;
  gb_begin_silence = false;
  gb_end_silence = false;
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

/*function PruebaSendDTMF(){
// try{	
  //gb_oscTone1.start();
  //gb_oscTone2.start();
  //let cadSend='0123456789ABCD*#' 
  //let cadSend=StringTo2KeyDTMF('Prueba');
  let cadSend="0123456789ABCD";
  //alert(cadSend);
  let i=0;
  gb_buf_send_dtmf = '#';
  for (i=1;i<=cadSend.length;i++){
   gb_buf_send_dtmf += cadSend[(i-1)];
  }
  gb_buf_send_dtmf += '#';
 
  //alert(gb_array_dtmf);
  //gb_array_dtmf[0]='3';
  //gb_array_dtmf[1]='B';
  //gb_array_dtmf[2]='7';
  //gb_array_dtmf[3]='D';
  //gb_array_dtmf[4]='8';
  //gb_array_dtmf[5]='A';
  //gb_array_dtmf[6]='6';
 
  //3B7D8A6C1A3B7D1A8B6B2A1A7A7C8B3B2B2A
 
  gb_total_array_dtmf= cadSend.length;
  gb_current_array_dtmf = 0;
  gb_play_array_dtmf= true;
  gb_begin_dtmf = false;
  gb_end_dtmf = false;
  gb_begin_silence = false;
  gb_end_silence = false;
// }
// catch(error) {
//  console.log(error);  
// }  
}
*/


function LoadBotones()
{
 try
 {
  gb_id_stq = Number(gb_ctrl_btn_input_stq.elt.value);
  gb_id_q4 = Number(gb_ctrl_btn_input_q4.elt.value);
  gb_id_q3 = Number(gb_ctrl_btn_input_q3.elt.value);
  gb_id_q2 = Number(gb_ctrl_btn_input_q2.elt.value);
  gb_id_q1 = Number(gb_ctrl_btn_input_q1.elt.value);
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

function NumberToDTMFString(valor)
{
 let aReturn='';
 try
 {	 
  switch (valor){
   case 0: aReturn ='D'; break; //16
   case 1: aReturn ='1'; break;
   case 2: aReturn ='2'; break;
   case 3: aReturn ='3'; break;
   case 4: aReturn ='4'; break;
   case 5: aReturn ='5'; break;
   case 6: aReturn ='6'; break;
   case 7: aReturn ='7'; break;
   case 8: aReturn ='8'; break;
   case 9: aReturn ='9'; break;
   case 10: aReturn ='0'; break; //0
   case 11: aReturn ='*'; break;
   case 12: aReturn ='#'; break;
   case 13: aReturn ='A'; break;
   case 14: aReturn ='B'; break;
   case 15: aReturn ='C'; break;
   default: aReturn=''; break;
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
 return aReturn;
}

//Convierte DTMF a doble codigo
function DTMFStringToDoubleNumber(valor){
 let aReturn='';
 try
 {	 
  switch (valor){
   case 'D': aReturn ='00'; break; //16
   case '1': aReturn ='01'; break;
   case '2': aReturn ='02'; break;
   case '3': aReturn ='03'; break;
   case '4': aReturn ='04'; break;
   case '5': aReturn ='05'; break;
   case '6': aReturn ='06'; break;
   case '7': aReturn ='07'; break;
   case '8': aReturn ='08'; break;
   case '9': aReturn ='09'; break;
   case '0': aReturn ='10'; break; //0
   case '*': aReturn ='11'; break;
   case '#': aReturn ='12'; break;
   case 'A': aReturn ='13'; break;
   case 'B': aReturn ='14'; break;
   case 'C': aReturn ='15'; break;
   default: aReturn=''; break;
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
 return aReturn;
}


//Silencio de los 2 tonos DTMF
function StopSoundDTMF()
{
 try
 {
  gb_oscTone1.amp(0);
  gb_oscTone2.amp(0);
  gb_oscTone1.stop();
  gb_oscTone2.stop();
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

function StopSoundMonotone()
{
 try
 {
  gb_oscTone1.amp(0);
  gb_oscTone2.amp(0);
  gb_oscTone1.stop();
  gb_oscTone2.stop();
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

function Poll_DTMFPlaySound()
{
 let valor='';
 try
 {
  if (gb_play_array_dtmf === true)
  {  
   if (gb_begin_dtmf === false)
   {
    gb_ini_dtmf = millis();
    gb_begin_dtmf = true;
    gb_end_dtmf = false;
    gb_begin_silence = false;
    gb_end_silence = false;   
    gb_oscTone1.stop();
    gb_oscTone2.stop();
    let baja= 0;
    let alta= 0;  
    valor = gb_buf_send_dtmf[gb_current_array_dtmf];  
    switch (valor)
	{
     case '1': baja= 697; alta= 1209; break;
     case '2': baja= 697; alta= 1336; break;
     case '3': baja= 697; alta= 1477; break;
     case '4': baja= 770; alta= 1209; break;
     case '5': baja= 770; alta= 1336; break;
     case '6': baja= 770; alta= 1477; break;
     case '7': baja= 852; alta= 1209; break;
     case '8': baja= 852; alta= 1336; break;
     case '9': baja= 852; alta= 1477; break;
     case '*': baja= 941; alta= 1209; break;
     case '0': baja= 941; alta= 1336; break;
     case '#': baja= 941; alta= 1477; break;
     case 'A': baja= 697; alta= 1633; break;
     case 'B': baja= 770; alta= 1633; break;
     case 'C': baja= 852; alta= 1633; break;
     case 'D': baja= 941; alta= 1633; break;
    }   
    gb_oscTone1.freq(baja);
    gb_oscTone2.freq(alta);
    gb_oscTone1.amp(1);
    gb_oscTone2.amp(1);
    gb_oscTone1.start();
    gb_oscTone2.start();   
   }
   else
   {//Esta sonando
    if (gb_begin_silence === true)
	{ //La parte del silencio
	 if ((millis()-gb_ini_dtmf) >= gb_time_silence){
	 //if ((millis()-gb_ini_dtmf)>=250){//MT8870 tiempo silencio 250, 500 ms para microfono
	  gb_begin_dtmf = false;
      gb_end_dtmf = false;
      gb_begin_silence = false;
      gb_end_silence = false;
	  gb_current_array_dtmf++;
	  if (gb_current_array_dtmf >= gb_total_array_dtmf){
 	   gb_current_array_dtmf= 0;
       StopSoundDTMF();
	   gb_play_array_dtmf = false;
	  }
	 }
    }
    else
	{
     if ((millis()-gb_ini_dtmf) >= gb_time_sound)
	 {
	 //if ((millis()-gb_ini_dtmf)>=150){//MT8870 tiempo sonido 150 ms, 300 ms para microfono
 	  StopSoundDTMF();
	  gb_begin_dtmf = true;
      gb_end_dtmf = true;
      gb_begin_silence = true;
      gb_end_silence = false;
     }
    }
   }
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}



function Poll_MonotonePlaySound()
{
 let valor='';
 try
 {
  if (gb_play_array_monotone === true)
  {  
   if (gb_begin_monotone === false)
   {
    gb_ini_monotone = millis();
    gb_begin_monotone = true;
    gb_end_monotone = false;
    gb_begin_silence = false;
    gb_end_silence = false;   
    gb_oscTone1.stop();
    gb_oscTone2.stop();
    let baja= 0;     
    valor = gb_buf_send_monotone[gb_current_array_monotone];
    switch (valor){
     case '1': baja= 697; break;
     case '4': baja= 770; break;
     case '7': baja= 852; break;     
     case '*': baja= 941; break;
	 
	 case '2': baja= 1209; break;
	 case '0': baja= 1336; break;
	 case '#': baja= 1477; break;	 	 
	 case 'D': baja= 1633; break;
     default: baja= 0; break;
    }   
	if (baja === 0)
	{
	 gb_oscTone1.stop();
	 gb_oscTone2.stop();
	}
	else
	{
     gb_oscTone1.freq(baja);    
     gb_oscTone1.amp(1);    
     gb_oscTone1.start();
	}
   }
   else
   {//Esta sonando
    if (gb_begin_silence === true)
	{ //La parte del silencio
	 if ((millis()-gb_ini_monotone) >= gb_time_silence)
	 {
	 //if ((millis()-gb_ini_dtmf)>=250){//MT8870 tiempo silencio 250, 500 ms para microfono
	  gb_begin_monotone = false;
      gb_end_monotone = false;
      gb_begin_silence = false;
      gb_end_silence = false;
	  gb_current_array_monotone ++;
	  if (gb_current_array_monotone >= gb_total_array_monotone)
	  {
 	   gb_current_array_monotone= 0;
       StopSoundMonotone();
	   gb_play_array_monotone = false;
	  }
	 }
    }
    else
	{
     if ((millis()-gb_ini_monotone) >= gb_time_sound)
	 {
	 //if ((millis()-gb_ini_dtmf)>=150){//MT8870 tiempo sonido 150 ms, 300 ms para microfono
 	  StopSoundMonotone();
	  gb_begin_monotone = true;
      gb_end_monotone = true;
      gb_begin_silence = true;
      gb_end_silence = false;
     }
    }
   }
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}


//Sube volumen del track
function SetVolumenTrackUp(num_track)
{
 try
 {
  let aux = document.getElementById('soundTrack'+num_track).volume;
  aux += 0.1;
  if (aux>1){aux=1;}
  document.getElementById('soundTrack'+num_track).volume = aux;
 } 
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

//Baja volumen del track
function SetVolumenTrackDown(num_track)
{
 try
 {
  let aux = document.getElementById('soundTrack'+num_track).volume;
  aux -= 0.1;
  if (aux<0){aux=0;}
  document.getElementById('soundTrack'+num_track).volume = aux;
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

//Pausa del Track reproducido
function PausePlayTrack(num_track, valuePause)
{
 try
 {	
  if (valuePause === 1)
  {
   document.getElementById('soundTrack'+num_track).pause();
  }
  else
  {
   document.getElementById('soundTrack'+num_track).play();
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

//Avanza adelante en el track
function SeekTrackUp(num_track)
{
 try
 {	
  let tope = document.getElementById('soundTrack'+num_track).seekable.end; 
  let actual = document.getElementById('soundTrack'+num_track).currentTime;
  actual += 2;
  if (actual > tope)
  {
   actual = tope;
  }
  document.getElementById('soundTrack'+num_track).currentTime = actual;
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

//Retrocede en el track
function SeekTrackDown(num_track)
{	
 try
 {
  let actual = document.getElementById('soundTrack'+num_track).currentTime;
  actual -= 2;
  if (actual < 0){
   actual = 0;
  }
  document.getElementById('soundTrack'+num_track).currentTime = actual;
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

//Reproduce el Track
function playSoundTrack(dataDTMF)
{   
 // 0 - 10 Song
 // 11 - * - Up volume 
 // 12 - # - Down volume
 // 13 - A - Last
 // 14 - B - Next
 // 15 - C - Play/Pause
 try
 {
  switch (dataDTMF)
  {
   case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': case 'D': 
    StopAllTracks();
	if (dataDTMF === 'D')
	{
     gb_current_track = 10;
     document.getElementById('soundTrack10').currentTime = 0;
	 document.getElementById('soundTrack10').pause();
     document.getElementById('soundTrack10').play();
     gb_cad_playTrack = 'Play Track 10';
	}
	else
	{
     gb_current_track = dataDTMF.toString();
     document.getElementById('soundTrack'+gb_current_track).currentTime = 0;
     document.getElementById('soundTrack'+gb_current_track).pause();
	 document.getElementById('soundTrack'+gb_current_track).play();
	 gb_cad_playTrack = 'Play Track ' + gb_current_track.toString();	 
	}
	gb_forceDraw = true;
    break;
   case '*': SetVolumenTrackUp(gb_current_track);
    gb_cad_playTrack = 'Play Track ' + gb_current_track.toString();
    gb_cad_playTrack += ' Vol Up';
    gb_forceDraw = true;
    break;
   case '#': SetVolumenTrackDown(gb_current_track);
    gb_cad_playTrack = 'Play Track ' + gb_current_track.toString();
    gb_cad_playTrack += ' Vol Down';   
    break;   
   case 'A': SeekTrackUp(gb_current_track);
    document.getElementById('soundTrack'+gb_current_track).pause();
    gb_current_track ++;
	gb_current_track = (gb_current_track>10) ? 10 : gb_current_track;
	gb_cad_playTrack = 'Play Track ' + gb_current_track.toString();
    document.getElementById('soundTrack'+gb_current_track).currentTime = 0;
    document.getElementById('soundTrack'+gb_current_track).play();
    break;      
   case 'B': SeekTrackDown(gb_current_track);
    document.getElementById('soundTrack'+gb_current_track).pause();
    gb_current_track --;
	gb_current_track = (gb_current_track<0) ? 0 : gb_current_track;
	gb_cad_playTrack = 'Play Track ' + gb_current_track.toString();	
    document.getElementById('soundTrack'+gb_current_track).currentTime = 0;
    document.getElementById('soundTrack'+gb_current_track).play();
    break;         
   case 'C': PausePlayTrack(gb_current_track, gb_pauseplay_track);
    gb_cad_playTrack = 'Play Track ' + gb_current_track.toString();
    if (gb_pauseplay_track === 1)
	{
	 gb_cad_playTrack += ' Pause'
     gb_pauseplay_track = 0;
    }
    else
	{
	 gb_cad_playTrack += ' Play'
 	 gb_pauseplay_track = 1;
    }
    break;
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

//Convierte fila columna a DTMF
function RowColToDtmf(row,col)
{ 
 try
 {
  if ((row === 0) && (col === 0)){return ('1');}
  if ((row === 0) && (col === 1)){return ('2');}
  if ((row === 0) && (col === 2)){return ('3');}
  if ((row === 0) && (col === 3)){return ('A');}
  if ((row === 1) && (col === 0)){return ('4');}
  if ((row === 1) && (col === 1)){return ('5');}
  if ((row === 1) && (col === 2)){return ('6');}
  if ((row === 1) && (col === 3)){return ('B');}
  if ((row === 2) && (col === 0)){return ('7');}
  if ((row === 2) && (col === 1)){return ('8');}
  if ((row === 2) && (col === 2)){return ('9');}
  if ((row === 2) && (col === 3)){return ('C');}
  if ((row === 3) && (col === 0)){return ('*');}
  if ((row === 3) && (col === 1)){return ('0');}
  if ((row === 3) && (col === 2)){return ('#');}
  if ((row === 3) && (col === 3)){return ('D');}  
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }  
 return ('');
}


//convierte una sola frecuencia
function RowColToMonotone(row,col)
{  
 try
 {
  if (row === 0){return ('1');}
  if (row === 1){return ('4');}
  if (row === 2){return ('7');}
  if (row === 3){return ('*');} 
  
  if (col === 0){return ('2');}
  if (col === 1){return ('0');}
  if (col === 2){return ('#');}
  if (col === 3){return ('D');}  
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
 return ('');
}

//Analiza las frecuencias desde Tarjeta Sonido
function Poll_FFT_DTMF()
{
  //44100 / 1024 = 43,06 Hz saltos  21,533203125 Hz
 try
 {
  if (gb_use_mic_dtmf === false)
  {
   return;
  }
	  
  let spectrum = gb_fft.analyze();
  let row= -1;
  let col= -1;  
  
  //if (spectrum[31] > 250){row = 0;}
  if (spectrum[32] > 230){row = 0;}
  else{
   if (spectrum[35] > 230){row = 1;}
   else{
    if (spectrum[39] > 230){row = 2;}
    else{
     if (spectrum[43] > 230){row = 3;}
	}
   }
  }
 
  //if (spectrum[55] > 250){col = 0;}
  if (spectrum[56] > 230){col = 0;}
  else{
   //if (spectrum[61] > 250){col = 1;}
   if (spectrum[62] > 230){col = 1;}   
   else{
    //if (spectrum[67] > 250){col = 2;}
	if (spectrum[68] > 230){col = 2;}
    else{
     if (spectrum[76] > 230){col = 3;}
	}
   }
  }
  
  //console.log('55:'+spectrum[55].toString()+' 56:'+spectrum[56].toString()+' 57:'+spectrum[57].toString());
    	
  if ((row>-1) && (col>-1))
  {   
   gb_fft_dtmf = RowColToDtmf(row,col);
   gb_cadDTMF = gb_fft_dtmf;
   if (gb_fft_dtmf_antes != gb_fft_dtmf){	
    gb_fft_dtmf_antes = gb_fft_dtmf;
    cad_areaRX += gb_fft_dtmf;	
	gb_buf_rcv_dtmf += gb_fft_dtmf;
	gb_event_new_data_dtmf = true;
	if (gb_fft_dtmf === '#'){
	 gb_begin_sync_dtmf= true;
    }

    if (gb_use_fast === true)
	{ //Si es fast solo recibe un tono
	 gb_buf_rcv_dtmf = '#' + DTMFStringToDoubleNumber(gb_fft_dtmf) + '*';	 
	 gb_begin_sms = false; 
	 gb_end_sms = true;
	 contIniAsteriscos = 1;
	}
	else
	{
	 switch (gb_fft_dtmf)
	 {
 	  case '#':
	   gb_buf_rcv_dtmf = '#';
	   gb_begin_sms = true; 
	   gb_end_sms = false;
	   //gb_begin_sync_dtmf= true;	 
	   break;
	  case '*':	  
	   contIniAsteriscos ++;
	   gb_begin_sms = false; 
	   gb_end_sms = true;
	   break;
	  default:	  
	   contIniAsteriscos = 0;	 	 
	   break;
	 }	
	}
	
	
    gb_forceDraw = true;
   }   
  }
  else
  {
   gb_fft_dtmf= gb_fft_dtmf_antes= '';
  }  
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

//Convierte un codigo monotono a un numero
function CodeMonotoneToNumber(cod)
{
 let aReturn = 0;
 try
 {
  switch (cod)
  {
   case '00': aReturn = '0'; break;
   case '01': aReturn = '1'; break;
   case '02': aReturn = '2'; break;
   case '04': aReturn = '3'; break;
   case '07': aReturn = '4'; break;
   case '0D': aReturn = '5'; break;
   case '10': aReturn = '6'; break;
   case '11': aReturn = '7'; break;
   case '12': aReturn = '8'; break;
   case '14': aReturn = '9'; break;
   case '17': aReturn = '*'; break; //+
   case '1D': aReturn = '#'; break; //-
   case '20': aReturn = 'A'; break; //>>
   case '21': aReturn = 'B'; break; //<<
   case '22': aReturn = 'C'; break; //>  
   case '24': aReturn = 'D'; break;
   default: aReturn = '0';
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
 return (aReturn);
}

//Convierte un codigo dtmf a un numero
function CodeDTMFtoNumber(cod)
{
 let aReturn = 0;
 try
 {
  switch (cod)
  {
   case '00': aReturn = '0'; break;
   case '01': aReturn = '1'; break;
   case '02': aReturn = '2'; break;
   case '03': aReturn = '3'; break;
   case '04': aReturn = '4'; break;
   case '05': aReturn = '5'; break;
   case '06': aReturn = '6'; break;
   case '07': aReturn = '7'; break;
   case '08': aReturn = '8'; break;
   case '09': aReturn = '9'; break;
   case '11': aReturn = '*'; break; //+
   case '12': aReturn = '#'; break; //-
   case '13': aReturn = 'A'; break; //>>
   case '14': aReturn = 'B'; break; //<<
   case '15': aReturn = 'C'; break; //>  
   case '10': aReturn = 'D'; break;
   default: aReturn = '0';
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
 return (aReturn);
}

//Solo mira una frecuencia
function Poll_FFT_MONOTONE()
{
  //44100 / 1024 = 43,06 Hz saltos  21,533203125 Hz
 try
 {
  let spectrum = gb_fft.analyze();
  let row= -1;
  let col= -1;  
  
  if (gb_use_ntsc_arduino) //63.55 microsegundos
  {
   //Para belial
   if (spectrum[32] > 230){row = 0;}
   else{
    if (spectrum[35] > 230){row = 1;} //4 770 /21,533203125 = 35,75873015873015873015873015873
    else{
     if (spectrum[39] > 230){row = 2;}
     else{
      if (spectrum[18] > 230){row = 3;} //* 393,3910306845 /21,533203125 = 18,269043783262040816326530612245
	 }
    }
   }  
  
   if (spectrum[14] > 230){col = 0;} //2 302,60848514192 /21,533203125 = 14
   else{   
    if (spectrum[62] > 230){col = 1;}
    else{    
 	 if (spectrum[26] > 230){col = 2;} //# 561,98718669215 /21,533203125 = 26,09863397608896145124716553288
     else{
      if (spectrum[76] > 230){col = 3;}
 	 }
    }
   }  	  
  }
  else
  {
   //if (spectrum[31] > 250){row = 0;}
   if (spectrum[32] > 230){row = 0;}
   else{
    if (spectrum[35] > 230){row = 1;}
    else{
     if (spectrum[39] > 230){row = 2;}
     else{
      if (spectrum[43] > 230){row = 3;}
	 }
    }
   }
 
   //if (spectrum[55] > 250){col = 0;}
   if (spectrum[56] > 230){col = 0;}
   else{
    //if (spectrum[61] > 250){col = 1;}
    if (spectrum[62] > 230){col = 1;}
    else{
     //if (spectrum[67] > 250){col = 2;}
	 if (spectrum[68] > 230){col = 2;}
     else{
      if (spectrum[76] > 230){col = 3;}
	 }
    }
   }  	 
  }

  
  //let cadLog = '67:'+spectrum[67].toString()+' 68:'+spectrum[68].toString()+' 69:'+spectrum[69].toString();
  //let cadLog = '31:'+spectrum[31].toString()+' 32:'+spectrum[32].toString()+' 33:'+spectrum[33].toString();
  //let cadLog = '61:'+spectrum[61].toString()+' 62:'+spectrum[62].toString()+' 63:'+spectrum[63].toString();
  //console.log (cadLog);
  		
  if ((row>-1)||(col>-1))
  {   
   gb_fft_dtmf = RowColToMonotone(row,col);
   gb_cadDTMF = gb_fft_dtmf;
   if (gb_fft_dtmf_antes != gb_fft_dtmf)
   {	    
    gb_fft_dtmf_antes = gb_fft_dtmf;	
    
	cad_areaRX += gb_fft_dtmf;	
	gb_buf_rcv_dtmf += gb_fft_dtmf;
	gb_event_new_data_dtmf = true;
	
	if (gb_use_fast === true)
	{ //Si es fast solo recibe un tono     
	 gb_fft_dtmf_two_monotone += gb_fft_dtmf;
	 if (gb_fft_dtmf_two_monotone.length > 1)
	 {	  	 
	  gb_buf_rcv_dtmf = '#' + gb_fft_dtmf_two_monotone + '*';	 
	  gb_fft_dtmf_two_monotone = '';	  
	 }
	 gb_begin_sms = false; 
	 gb_end_sms = true;
	 contIniAsteriscos = 1;	
	}
	else
	{
	 switch (gb_fft_dtmf)
	 {
	  case '#':
	   gb_buf_rcv_dtmf = '#';
	   gb_begin_sms = true; 
	   gb_end_sms = false;
	   //gb_begin_sync_dtmf= true;	 
	   break;
	  case '*':	  
	   contIniAsteriscos ++;
	   gb_begin_sms = false; 
	   gb_end_sms = true;
	   break;
	  default:	  
	   contIniAsteriscos = 0;	 	 
	   break;
	 }
	}
		
    gb_forceDraw = true;
   }
   //playSoundTrack(gb_fft_dtmf);//Reproduce el Track
  }
  else
  {
   gb_fft_dtmf= gb_fft_dtmf_antes= '';
  }  
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}






//Lee tonos DTMF desde el gamepad conectado a MT8870
function Poll_Pad_DTMF()
{ 
 try
 {
  if (gb_use_gamepad_dtmf === false)
  {	
   return;
  }
	
  let pads = navigator.getGamepads();
  let pad0 = pads[0];
  let i=0;
  if (pad0)
  {
   gb_cad_botones='';
   for (i=0;i<pad0.buttons.length;i++)
   {
    if (pad0.buttons[i].value === 1)
	{
     gb_cad_botones+='1';
    }
    else{
     gb_cad_botones+='0';
    }
    switch ((i+1))
	{
  	 case gb_id_stq: gb_value_stq = pad0.buttons[i].value; break;
	 case gb_id_q4: gb_value_q4 = pad0.buttons[i].value; break;
	 case gb_id_q3: gb_value_q3 = pad0.buttons[i].value; break;
	 case gb_id_q2: gb_value_q2 = pad0.buttons[i].value; break;
	 case gb_id_q1: gb_value_q1 = pad0.buttons[i].value; break;
	 default: break;
    }
   }
  }
  gb_cad_bit_dtmf = '';
  gb_cad_bit_dtmf += gb_value_stq;
  gb_cad_bit_dtmf += gb_value_q4;
  gb_cad_bit_dtmf += gb_value_q3;
  gb_cad_bit_dtmf += gb_value_q2;
  gb_cad_bit_dtmf += gb_value_q1;
 
  if (gb_value_stq === 1)
  {
   if (stq_antes === 0)
   {
    dato = (gb_value_q4*8)+(gb_value_q3*4)+(gb_value_q2*2)+gb_value_q1;
    gb_cadDTMF = NumberToDTMFString(dato);
    gb_forceDraw = true;
   }
  }
  else
  {
   //dato=0;
   //gb_cadDTMF = NumberToDTMFString(dato);      
  }
 
  if ((gb_value_q4 != gb_value_q4_antes)
      ||
      (gb_value_q3 != gb_value_q3_antes)
      ||
      (gb_value_q2 != gb_value_q2_antes)
      ||
      (gb_value_q1 != gb_value_q1_antes)
      ||
      (gb_value_stq != gb_value_stq_antes)
     ){
   gb_forceDraw = true;
  }
 
  if (gb_value_stq != stq_antes)
  {
   if ((stq_antes === 0) && (gb_value_stq === 1))
   {   
    cad_areaRX += gb_cadDTMF;
   
    gb_buf_rcv_dtmf += gb_cadDTMF;
    gb_event_new_data_dtmf = true;
    if (gb_cadDTMF === '#')
	{
     gb_begin_sync_dtmf= true;
    }
	
	let gb_fft_dtmf = gb_cadDTMF;
    if (gb_use_fast === true)
	{ //Si es fast solo recibe un tono
	 gb_buf_rcv_dtmf = '#' + DTMFStringToDoubleNumber(gb_fft_dtmf) + '*';	 
	 gb_begin_sms = false; 
	 gb_end_sms = true;
	 contIniAsteriscos = 1;
	}
	else
	{
	 switch (gb_fft_dtmf)
	 {
 	  case '#':
	   gb_buf_rcv_dtmf = '#';
	   gb_begin_sms = true; 
	   gb_end_sms = false;
	   //gb_begin_sync_dtmf= true;	 
	   break;
	  case '*':	  
	   contIniAsteriscos ++;
	   gb_begin_sms = false; 
	   gb_end_sms = true;
	   break;
	  default:	  
	   contIniAsteriscos = 0;	 	 
	   break;
	 }	
	}
		
	
    gb_forceDraw = true;
   }	 
   stq_antes = gb_value_stq;
  }	
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

//Dibuja los datos principales en Pantalla
function PollDibujaDatos()
{
 try
 {	
  if (gb_forceDraw === true)
  {
   gb_forceDraw = false;
   background(255);
   //fill(0, 0, 0);
   if (gb_use_gamepad_dtmf === true){
    text(gb_cad_botones, 370, 30); 
    text(gb_cad_bit_dtmf, 370, 60);
    text('stq: '+gb_value_stq, 370, 80);
    text('q4: '+gb_value_q4, 370, 100);
    text('q3: '+gb_value_q3, 370, 120);
    text('q2: '+gb_value_q2, 370, 140);
    text('q1: '+gb_value_q1, 370, 160);      
   }
   text('dato: '+dato, 10, 210);   
   text('DTMF: '+gb_cadDTMF,10,180);
      
   text(cad_areaRX,10,240);
   if (cad_areaRX.length > 20)
   {
	cad_areaRX = '';
   }   
   
   text (gb_cad_playTrack,10,260); //El track actual
   //areaRX.elt.value = cad_areaRX;    
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

//Procesa los buffers de datos DTMF recibidos y eventos
function PollProcessDTMF()
{
 try
 {
/*  if (gb_begin_sync_dtmf === true){
   gb_begin_sync_dtmf= false; //Comienzo trama
   gb_cadDTMF +=' Sync';
  
   //let aux_cad = gb_buf_rcv_dtmf;  
   //console.log(aux_cad);
   //gb_cadDTMF+=' '+StringTwoKeyDTMFToString(aux_cad);
  
   gb_buf_rcv_dtmf =''; //reset buffer recepcion
   gb_forceDraw = true;
  }
 
  if (gb_event_new_data_dtmf === true){
   gb_event_new_data_dtmf= false;//Nuevo dato
   gb_cadDTMF +=' Data';
  
   let aux_cad = gb_buf_rcv_dtmf;  
   gb_cadDTMF+=' '+ aux_cad.toString();
  
   gb_forceDraw = true;
  }
   

*/

  if (gb_end_sms === true)
  {	 
   gb_end_sms = false;  
   if (contIniAsteriscos >= 1)
   {
    contIniAsteriscos = 0;	   
    let lenCode = gb_buf_rcv_dtmf.length;
    if (lenCode === 4)
    {    
  	 if (gb_buf_rcv_dtmf[0] === '#')
 	 {		 
	  let numTrack = CodeDTMFtoNumber(gb_buf_rcv_dtmf[1] + gb_buf_rcv_dtmf[2]);
	  playSoundTrack(numTrack);
 	  //console.log('Track: ' + numTrack.toString());     
	 }
    }
   } 
  }	  
   
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}

//Procesa comando Monotono
function PollProcessMonotone()
{
 try
 {
  if (gb_end_sms === true)
  {
   gb_end_sms = false;
   if (contIniAsteriscos >= 1)
   {
    contIniAsteriscos = 0;	   
    let lenCode = gb_buf_rcv_dtmf.length;
    if (lenCode === 4)
    {
     //alert (lenCode.toString());
	 if (gb_buf_rcv_dtmf[0] === '#')
	 {		 
 	  let numTrack = CodeMonotoneToNumber(gb_buf_rcv_dtmf[1] + gb_buf_rcv_dtmf[2]);
	  playSoundTrack(numTrack);
	  //console.log('Track: ' + numTrack.toString());     
 	 }
    }
   }
  }	  
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}


//Imprime consola log si tenemos activa gb_log_debug
function DebugLog(cad)
{
 try
 {
  if (gb_log_debug === true)
  {
   console.log(cad);
  }
 }
 catch(err)
 {  
 } 
}


//Rutina principal Draw Poll
function draw()
{
 try
 {
  if (gb_use_dtmf === true) //Lectura DTMF
  {
   Poll_DTMFPlaySound(); //Reproduce tonos DTMF
   Poll_FFT_DTMF(); //Lee tonos DTMF de microfono        
   Poll_Pad_DTMF(); //Lee del gamepad tonos DTMF   
   PollProcessDTMF();  
  }
  else
  {
   Poll_MonotonePlaySound(); //Lectura Monotono   
   Poll_FFT_MONOTONE(); //Lee tonos de microfono     
   PollProcessMonotone();   
  }
    
  PollDibujaDatos();
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}