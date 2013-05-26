var stage, holder, grow, oscillator, color, oscillator2, oscillator3, drums, context, draw, index,
   played_notes, playing, pitch, wob, bass, volume, gainNode, music, crazy, dubstep1, dubstep2,
    random_crazy, random_crazy2, crazy_time, crazy_position_x, crazy_position_y, c_major,
    range,range_y,current,current_y;
  function init() {
    stage = new createjs.Stage("canvas");
    draw_stage();
    grow = 0;
    context = new webkitAudioContext();
    gainNode = context.createGainNode();
    gainNode2 = context.createGainNode();
    gainNode2.gain.value = 0.1;
    gainNode2.connect(context.destination);
    filter = context.createBiquadFilter();
    filter.type = 0;
    filter.frequency.value = 440;
    filter.Q.value = 0;
    filter.gain.value = 0;
    soloNode = context.createGainNode();
    soloNode.gain.value = 0.5;
    soloNode.connect(context.destination);
    oscillator = context.createOscillator();
    oscillator2 = context.createOscillator();
    oscillator3 = context.createOscillator();
    soloOsc = context.createOscillator();
    draw_squares();
    played_notes = 0;
    createjs.Ticker.addEventListener("tick", tick);
    keydown_listen();
    playing = false;
    random_color = 0;
    music = true;
    crazy = false;
  }


  function tick(event) {
    if (crazy === false){
      gainNode2.connect(context.destination);
    var l = holder.getNumChildren();
    for (var i=0; i<l; i++) {
      var child = holder.getChildAt(i);
      var pt = child.globalToLocal(stage.mouseX, stage.mouseY);
      if (stage.mouseInBounds && child.hitTest(pt.x, pt.y)) {
        remove_and_redraw(child);

      }
    }
    }
    stage.update(event);
  }

  function draw_squares(){
      draw_stage();
      for (var i=0; i<100; i++) {
      var shape = new createjs.Shape();
      var size = Math.random()*100 + 50;
      shape.graphics.beginFill(createjs.Graphics.getHSL(Math.random()*360,100,50)).drawRect(0,0,size,size);
      shape.x = Math.random()*700-150;
      shape.y = Math.random()*700-150;
      shape.alpha = Math.random();
      shape.rotation += Math.random() * 5 - 2.5;
      holder.addChild(shape);
    }
  }

  function remove_and_redraw(child){
    var shape = new createjs.Shape();
    draw = Math.floor(Math.random()*3);
    var size = Math.random()*100 + grow;
    random_color = Math.random()*360;
    if (draw === 0){
      shape.graphics.beginFill(createjs.Graphics.getHSL(random_color,100,50)).drawRect(0,0,size,size);
      play_sound();}
    else if (draw ===1) {
      shape.graphics.beginFill(createjs.Graphics.getHSL(random_color,100,50)).drawCircle(0,0,size/2);
      music = true;
      play_bass();
    } else {
      shape.graphics.beginFill(createjs.Graphics.getHSL(random_color,100,50)).drawRoundRect(0,0,size,size,size/(Math.random()*5));
      play_harmony();
    }
      shape.x = Math.random()*700-150;
      shape.y = Math.random()*700-150;
      shape.alpha = Math.random();
      shape.rotation += Math.random() * 5 - 2.5;
      var index = holder.children.indexOf(child);
      holder.children.splice((index), 1);
      holder.addChild(shape);
    grow += 0.5;
    played_notes += 1;
    display_notes(random_color);
  }

  function draw_stage(){
    stage.removeAllChildren();
    stage.update();
    holder = stage.addChild(new createjs.Container());
    holder.x = window.innerWidth / 2 - 300;
    holder.y = window.innerHeight / 2 -260;
  }

  function play_sound(){
    c_major = [392.00,466.16,532.25,587.33,698.46,783.99];
    if ((random_color < 120) && (random_color > 0 )){
      for (var i = 0; i < c_major.length; i++){
        c_major[i] = c_major[i] * 2;
      }
    }else {
        c_major = [392.00,466.16,532.25,587.33,698.46,783.99];
      }
    index = Math.floor(Math.random()*6);
    var c_major_note = c_major[index];
    oscillator.type = 3; // triangle wave
    oscillator.frequency.value = c_major_note;
    oscillator.connect(gainNode2);
    oscillator.noteOn && oscillator.noteOn(0);

  }

  function play_harmony(){
    var harmony = [466.16,587.33,622.25,698.46,880.00,932.33];
    var harmony_note = harmony[index];
    oscillator3.type = 1; // square wave
    oscillator3.frequency.value = harmony_note;
    oscillator3.connect(gainNode2);
    oscillator3.noteOn && oscillator3.noteOn(0);
  }

  function play_bass(){
    var c_bass = [49.00,65.41,73.42];
    var c_bass_note = c_bass[Math.floor(Math.random()*3)];
    var how_much_wobble = Math.random()*500;
    setInterval(function() {wobble(c_bass_note)}, how_much_wobble);
    setInterval(function() {bass_me(pitch, volume)}, 500);
    gainNode.connect(gainNode2);
    oscillator2.noteOn && oscillator2.noteOn(0);

  }

  function solo(){
    var solo_major = [392.00,466.16,532.25,587.33,698.46,783.99];
    var high_major = [783.99,932.33,1046.50,1174.66,1396.91,1567.98];
    var low_major = [196.00,233.08,261.63,293.66,349.23, 392.00];
    range = window.innerWidth / 6;
    range_y = window.innerHeight / 3;
    current = Math.floor(crazy_position_x / range);
    current_y = Math.floor(crazy_position_y / range_y);
    soloOsc.type = 1;
    if (current_y === 2){
      soloOsc.frequency.value=low_major[current];
    } else if (current_y === 1){
      soloOsc.frequency.value=solo_major[current];
    } else {
      soloOsc.frequency.value=high_major[current];
    }
    soloOsc.connect(filter);
    filter.connect(soloNode);
    soloOsc.noteOn && soloOsc.noteOn(0);
  }

  function stop_music(){
    document.getElementById("stop");
    clearInterval(wob);
    clearInterval(bass);
    music = false;
    oscillator.disconnect();
    oscillator2.disconnect();
    oscillator3.disconnect();
    soloOsc.disconnect();
    drums.stop();
    draw_squares();
    played_notes = 0;
    clearInterval(change_color);
    clearInterval(dancing_squares);
    reset_color();
    dubstep1.stop();
    dubstep2.stop();
    crazy = false;
    playing = false;
    remove_crazy_music();
  }

    drums = new Howl({
    urls: ['audio/drums.wav'],
    loop: true,
    volume: 1
  });

    dubstep1 = new Howl({
    urls: ['audio/gocrazy.wav'],
    loop: false,
    volume: 1,
    onend: function(){
      stop_music();
    }
  });

    dubstep2 = new Howl({
    urls: ['audio/gocrazy2.wav'],
    loop: false,
    volume: 1,
    onend: function(){
      stop_music();
    }
  });

  function play_drums(){
    if (crazy === false){
    if (playing === false){
    document.getElementById("drums");
    drums.play();
    playing = true;
    }
  }
  }

  function display_notes(random_color){
    $('p').text(played_notes).css("color","hsl("+random_color+",100%,50%)");
  }

  function keydown_listen(){
  $('body').keydown(function(e) {
    if(e.keyCode == 38){
    grow += 100;}
    else if (e.keyCode == 40){
      grow -= 100;
    } else if (e.keyCode == 32){
      if (playing === false){
      play_drums();
      playing = true;
    } else {
      stop_music();
      playing = false;
    }
    }
  });}


  function wobble(frequency){
    wobbly = Math.random() * 2;
    pitch = frequency + wobbly;
    volume = (Math.random() / 2) + 0.5;
  }

  function bass_me(pitch, volume){
    oscillator2.type = 1; // square wave
    oscillator2.frequency.value = pitch;
    oscillator2.connect(gainNode);
    gainNode.gain.value = volume;
    if (music === false){
      oscillator2.disconnect();
    }
  }

  function color(){
    background_color = Math.random() * 360;
    $('body').css("background-color","hsl("+background_color+",100%,50%)");
  }

  function reset_color(){
    $('body').css("background-color", "black");
  }

  function random_change_time(){
    random_crazy = Math.floor(Math.random() * 4);
    random_crazy2 = Math.floor(Math.random() * 4);
  }

  function make_color(){
    if (crazy === true){
    clearInterval(change_color);
    clearInterval(dancing_squares);
    change_color = setInterval(color,crazy_time[random_crazy]);
    dancing_squares=setInterval(draw_squares,crazy_time[random_crazy2]);
    }else{
      clearInterval(change_color);
      clearInterval(dancing_squares);
    }
  }

  function go_crazy(){
    if (crazy === false){
      $('p').text("");
      gainNode2.disconnect();
      document.getElementById("crazy");
      crazy_time = [107.14,214.28,428.57, 857.14];
      random_change_time();
      setInterval(random_change_time, 1000);
      change_color = setInterval(color,crazy_time[random_crazy]);
      dancing_squares=setInterval(draw_squares,crazy_time[random_crazy2]);
      setInterval(make_color, 1714.38);
      var song_choice = Math.floor(Math.random() * 2);
      if (song_choice === 0){
        dubstep1.play();
      }else{
        dubstep2.play();
      }
      go_crazy_music();
      crazy = true;
      if (playing === true){
        stop_music();
        playing = false;
      }
    }
  }

  function go_crazy_music(){
      stage.addEventListener("stagemousemove", function(evt) {
      crazy_position_x = evt.stageX;
      crazy_position_y = evt.stageY;
      solo();
      });
    }

  function remove_crazy_music(){
    stage.removeAllEventListeners();
  }



