# JUKEBOX DTMF
Es una jukebox, que permite reproducir hasta 10 archivos MP3, mediante tonos DTMF o monotono
en tiempo real usando micrófono o gamepad (MT8870 conectado a joystick), bajo HTML5.
<center><img src='preview/previewDTMF.gif'></center>
<br>
<ul>
 <li><a href='#interface'>Interface<a/></li>
 <li><a href='#html5'>HTML5<a/></li> 
 <li><a href='#codigo'>Código</a></li> 
</ul>
<br>


<a name="interface"><h2>Interface</h2></a>
Se permiten varios interfaces:
<ul>
 <li>Micrófono o entrada de linea</li>
 <li>Salida de linea o altavoces</li>
 <li>Joystick o gamepad modificado con MT8870</li>
 <li>Arduino emulando joystick (ARDUINO UNO R3 ATMEGA 16u2 y LEONARDO)</li>
</ul>
Aunque el uso del MT8870 implica un poco más de dificultad, se consigue mucha más velocidad y precisión a la hora de decodificar tonos DTMF.
Gracias al chip MT8870, conectando las salidas de STQ, Q4, Q3, Q2 y Q1 a un transistor permitiendo abrir o cerrar
los botones de un GAMEPAD, se puede decodificar tonos DTMF. Tan sólo necesitamos 5 pines (botones de mando).<br>

Para la construcción del mismo, se debe seguir el proyecto:<br>

<a href="https://github.com/rpsubc8/dtmfgamepadchat">https://github.com/rpsubc8/dtmfgamepadchat</a>

<br><br>
<a name="html5"><h2>HTML5</h2></a>
Desde el navegador web se puede enviar los tonos o comandos tanto DTMF (frecuencia dual) como monotonos (una sóla frecuencia).
Podemos hacer uso del teclado izquierdo para generar los tonos, o bien, del derecho para enviar la secuncia de control:
<ul>
 <li>0 .. 10 Reproduce un Track (directorio Tracks 0.mp3 .. 10.mp3)</li>
 <li>Anterior y siguiente Track</li>
 <li>Subir y bajar volumen</li>
 <li>Parar o reproducir</li> 
</ul>
<center><img src='preview/previewMonotone.gif'></center>
Se puede ajustar la velocidad de reproducción de los tonos, así como seleccionar con Fast para enviar el menor número de tonos.

<br><br>
<a name="codigo"><h2>Código</h2></a>
Podemos modificar:
<pre><code>
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
</code></pre>
