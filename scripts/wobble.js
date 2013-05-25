var stage, holder, grow, oscillator, color, oscillator2, oscillator3, drums, context, draw, index, played_notes, playing, pitch, wob, bass, volume, gainNode, music, crazy;
  function init() {
    stage = new createjs.Stage("canvas");
    draw_stage();
    grow = 0;
    context = new webkitAudioContext();
    gainNode = context.createGainNode();
    oscillator = context.createOscillator();
    oscillator2 = context.createOscillator();
    oscillator3 = context.createOscillator();
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
    //holder.rotation += 4;
    var l = holder.getNumChildren();
    for (var i=0; i<l; i++) {
      var child = holder.getChildAt(i);
      var pt = child.globalToLocal(stage.mouseX, stage.mouseY);
      if (stage.mouseInBounds && child.hitTest(pt.x, pt.y)) {
        remove_and_redraw(child);

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
    var c_major = [523.25,587.33,698.46,783.99,880.00,1046.50];
    if ((random_color < 120) && (random_color > 0 )){
      for (var i = 0; i < c_major.length; i++){
        c_major[i] = c_major[i] * 2;
      }
    }else {
        c_major = [523.25,587.33,698.46,783.99,880.00,1046.50];
      }
    index = Math.floor(Math.random()*6);
    var c_major_note = c_major[index];
    oscillator.type = 3; // triangle wave
    oscillator.frequency.value = c_major_note;
    oscillator.connect(context.destination);
    oscillator.noteOn && oscillator.noteOn(0);

  }

  function play_harmony(){
    var harmony = [329.63,349.23,440.00,493.88,523.25,659.26];
    var harmony_note = harmony[index];
    oscillator3.type = 1; // triangle wave
    oscillator3.frequency.value = harmony_note;
    oscillator3.connect(context.destination);
    oscillator3.noteOn && oscillator3.noteOn(0);
  }

  function play_bass(){
    var c_bass = [130.81, 174.61, 196.00];
    var c_bass_note = c_bass[Math.floor(Math.random()*3)];
    var how_much_wobble = Math.random()*500
    setInterval(function() {wobble(c_bass_note)}, how_much_wobble);
    setInterval(function() {bass_me(pitch, volume)}, 500);
    gainNode.connect(context.destination);
    oscillator2.noteOn && oscillator2.noteOn(0);

  }

  function stop_music(){
    document.getElementById("stop");
    clearInterval(wob);
    clearInterval(bass);
    music = false;
    oscillator.disconnect();
    oscillator2.disconnect();
    oscillator3.disconnect();
    drums.stop();
    draw_squares();
    played_notes = 0;
    clearInterval(change_color);
    clearInterval(dancing_squares);
    reset_color();
    crazy = false;
    playing = false;
  }

    drums = new Howl({
    urls: ['audio/Loop6.wav'],
    loop: true,
    volume: 1
  });

  function play_drums(){
    if (playing === false){
    document.getElementById("drums");
    drums.play();
    playing = true;
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
    wobbly = Math.random() * 10;
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

  function go_crazy(){
    if (crazy === false){
      document.getElementById("crazy");
      change_color = setInterval(color,200);
      dancing_squares=setInterval(draw_squares,400);
      crazy = true;
      if (playing === false){
        play_drums();
        playing = true;
      }
    }
  }


