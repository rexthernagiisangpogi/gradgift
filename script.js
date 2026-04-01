var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext( '2d' ),
    
    hw = w / 2,
    hh = h / 2,
    
    opts = {
      strings: [ 'Congratulations', 'Baby' ],
      charSize: 60,
      charSpacing: 34,
      lineHeight: 70,
      
      cx: w / 2,
      cy: h / 2,
      
      confettiCount: 50,
      sparkleCount: 30,
      
      fireworkPrevPoints: 10,
      fireworkBaseLineWidth: 5,
      fireworkAddedLineWidth: 8,
      fireworkSpawnTime: 200,
      fireworkBaseReachTime: 30,
      fireworkAddedReachTime: 30,
      fireworkCircleBaseSize: 20,
      fireworkCircleAddedSize: 10,
      fireworkCircleBaseTime: 30,
      fireworkCircleAddedTime: 30,
      fireworkCircleFadeBaseTime: 10,
      fireworkCircleFadeAddedTime: 5,
      fireworkBaseShards: 5,
      fireworkAddedShards: 5,
      fireworkShardPrevPoints: 3,
      fireworkShardBaseVel: 4,
      fireworkShardAddedVel: 2,
      fireworkShardBaseSize: 3,
      fireworkShardAddedSize: 3,
      gravity: .1,
      upFlow: -.1,
      letterContemplatingWaitTime: 360,
      balloonSpawnTime: 20,
      balloonBaseInflateTime: 10,
      balloonAddedInflateTime: 10,
      balloonBaseSize: 20,
      balloonAddedSize: 20,
      balloonBaseVel: .4,
      balloonAddedVel: .4,
      balloonBaseRadian: -( Math.PI / 2 - .5 ),
      balloonAddedRadian: -1,
    },
    calc = {
      totalWidth: opts.charSpacing * Math.max( opts.strings[0].length, opts.strings[1].length )
    },
    
    Tau = Math.PI * 2,
    TauQuarter = Tau / 4,
    
    letters = [],
    confetti = [],
    sparkles = [],
    hearts = [],
    stars = [],
    ribbons = [];

ctx.font = 'bold ' + opts.charSize + 'px Verdana';

function Confetti(x, y) {
  this.x = x || Math.random() * w - hw;
  this.y = y || Math.random() * h - hh;
  this.vx = (Math.random() - 0.5) * 4;
  this.vy = Math.random() * 2 - 3;
  this.rotation = Math.random() * Tau;
  this.rotationSpeed = (Math.random() - 0.5) * 0.2;
  this.size = Math.random() * 4 + 2;
  this.life = 1;
  this.decay = Math.random() * 0.015 + 0.015;
  
  var shapes = ['square', 'circle', 'triangle'];
  this.shape = shapes[Math.floor(Math.random() * shapes.length)];
  
  var hue = Math.random() * 360;
  this.color = 'hsl(' + hue + ', 100%, 50%)';
}

Confetti.prototype.step = function() {
  this.x += this.vx;
  this.y += this.vy;
  this.vy += 0.1;
  this.rotation += this.rotationSpeed;
  this.life -= this.decay;
  this.vx *= 0.98;
};

Confetti.prototype.draw = function() {
  ctx.save();
  ctx.globalAlpha = this.life;
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation);
  ctx.fillStyle = this.color;
  
  if (this.shape === 'square') {
    ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
  } else if (this.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(0, 0, this.size/2, 0, Tau);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -this.size/2);
    ctx.lineTo(this.size/2, this.size/2);
    ctx.lineTo(-this.size/2, this.size/2);
    ctx.closePath();
    ctx.fill();
  }
  
  ctx.restore();
};

function Sparkle(x, y) {
  this.x = x !== undefined ? x : (Math.random() * w - hw);
  this.y = y !== undefined ? y : (Math.random() * h - hh);
  this.size = Math.random() * 2 + 1;
  this.life = Math.random() * 0.5 + 0.5;
  this.maxLife = this.life;
  this.opacity = Math.random() * 0.6 + 0.4;
  
  var hues = [0, 45, 60, 180, 240, 300];
  this.color = 'hsl(' + hues[Math.floor(Math.random() * hues.length)] + ', 100%, 60%)';
}

Sparkle.prototype.step = function() {
  this.life -= 0.02;
};

Sparkle.prototype.draw = function() {
  var glow = Math.sin(this.life * Math.PI) * 2 + 2;
  
  ctx.save();
  ctx.globalAlpha = Math.max(0, this.life * this.opacity);
  ctx.fillStyle = this.color;
  ctx.shadowColor = this.color;
  ctx.shadowBlur = glow * 2;
  
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Tau);
  ctx.fill();
  
  ctx.restore();
};

function Heart(x, y) {
  this.x = x || Math.random() * w - hw;
  this.y = y || Math.random() * h - hh;
  this.vx = (Math.random() - 0.5) * 2;
  this.vy = Math.random() * 1 - 2;
  this.size = Math.random() * 8 + 4;
  this.life = 1;
  this.decay = Math.random() * 0.008 + 0.006;
  this.rotation = Math.random() * Tau;
  this.rotationSpeed = (Math.random() - 0.5) * 0.1;
}

Heart.prototype.step = function() {
  this.x += this.vx;
  this.y += this.vy;
  this.vy += 0.05;
  this.rotation += this.rotationSpeed;
  this.life -= this.decay;
  this.vx *= 0.99;
};

Heart.prototype.draw = function() {
  ctx.save();
  ctx.globalAlpha = this.life;
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation);
  ctx.fillStyle = '#FF1493';
  
  var size = this.size;
  
  ctx.beginPath();
  ctx.moveTo(0, -size / 2);
  ctx.quadraticCurveTo(-size / 2, -size, -size / 2, -size / 3);
  ctx.quadraticCurveTo(-size / 2, 0, 0, size / 2);
  ctx.quadraticCurveTo(size / 2, 0, size / 2, -size / 3);
  ctx.quadraticCurveTo(size / 2, -size, 0, -size / 2);
  ctx.fill();
  
  ctx.restore();
};

function Star(x, y) {
  this.x = x || Math.random() * w - hw;
  this.y = y || Math.random() * h - hh;
  this.vx = (Math.random() - 0.5) * 1.5;
  this.vy = Math.random() * 2 - 2.5;
  this.size = Math.random() * 3 + 1.5;
  this.life = 1;
  this.decay = Math.random() * 0.01 + 0.008;
  this.rotation = Math.random() * Tau;
  this.rotationSpeed = Math.random() * 0.2 + 0.1;
}

Star.prototype.step = function() {
  this.x += this.vx;
  this.y += this.vy;
  this.vy += 0.08;
  this.rotation += this.rotationSpeed;
  this.life -= this.decay;
  this.vx *= 0.97;
};

Star.prototype.draw = function() {
  var glow = Math.sin(this.life * Math.PI) * 1.5 + 1;
  
  ctx.save();
  ctx.globalAlpha = this.life;
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation);
  
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = glow * 3;
  ctx.fillStyle = '#FFD700';
  
  var size = this.size;
  ctx.beginPath();
  for (var i = 0; i < 5; i++) {
    var angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    var x = Math.cos(angle) * size;
    var y = Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
};

function Ribbon(x, y) {
  this.x = x;
  this.y = y;
  this.vx = (Math.random() - 0.5) * 3;
  this.vy = Math.random() * 1 - 1.5;
  this.length = Math.random() * 30 + 20;
  this.width = Math.random() * 2 + 1;
  this.life = 1;
  this.decay = Math.random() * 0.012 + 0.008;
  this.rotation = Math.random() * Tau;
  this.wobble = Math.random() * 0.05;
  this.wobbleAmount = 0;
  
  var colors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FF4500', '#FFD700', '#32CD32'];
  this.color = colors[Math.floor(Math.random() * colors.length)];
}

Ribbon.prototype.step = function() {
  this.x += this.vx;
  this.y += this.vy;
  this.vy += 0.06;
  this.wobbleAmount += this.wobble;
  this.life -= this.decay;
  this.vx *= 0.98;
};

Ribbon.prototype.draw = function() {
  ctx.save();
  ctx.globalAlpha = this.life;
  ctx.translate(this.x, this.y);
  ctx.rotate(this.rotation);
  
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.width;
  ctx.lineCap = 'round';
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(
    Math.sin(this.wobbleAmount) * 10,
    this.length / 2,
    Math.sin(this.wobbleAmount * 0.7) * 8,
    this.length
  );
  ctx.stroke();
  
  ctx.restore();
};

function Letter( char, x, y ){
  this.char = char;
  this.x = x;
  this.y = y;
  
  this.dx = -ctx.measureText( char ).width / 2;
  this.dy = +opts.charSize / 2;
  
  this.fireworkDy = this.y - hh;
  
  var hue = 340;
  
  this.color = 'hsl(340,90%,65%)';
  this.lightAlphaColor = 'hsla(340,90%,light%,alp)';
  this.lightColor = 'hsl(340,90%,light%)';
  this.alphaColor = 'hsla(340,90%,65%,alp)';
  
  this.reset();
}
Letter.prototype.reset = function(){
  
  this.phase = 'firework';
  this.tick = 0;
  this.spawned = false;
  this.spawningTime = opts.fireworkSpawnTime * Math.random() |0;
  this.reachTime = opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random() |0;
  this.lineWidth = opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
  this.prevPoints = [ [ 0, hh, 0 ] ];
}
Letter.prototype.step = function(){
  
  if( this.phase === 'firework' ){
    
    if( !this.spawned ){
      
      ++this.tick;
      if( this.tick >= this.spawningTime ){
        
        this.tick = 0;
        this.spawned = true;
      }
      
    } else {
      
      ++this.tick;
      
      var linearProportion = this.tick / this.reachTime,
          armonicProportion = Math.sin( linearProportion * TauQuarter ),
          
          x = linearProportion * this.x,
          y = hh + armonicProportion * this.fireworkDy;
      
      if( this.prevPoints.length > opts.fireworkPrevPoints )
        this.prevPoints.shift();
      
      this.prevPoints.push( [ x, y, linearProportion * this.lineWidth ] );
      
      var lineWidthProportion = 1 / ( this.prevPoints.length - 1 );
      
      for( var i = 1; i < this.prevPoints.length; ++i ){
        
        var point = this.prevPoints[ i ],
            point2 = this.prevPoints[ i - 1 ];
          
        ctx.strokeStyle = this.alphaColor.replace( 'alp', i / this.prevPoints.length );
        ctx.lineWidth = point[ 2 ] * lineWidthProportion * i;
        ctx.beginPath();
        ctx.moveTo( point[ 0 ], point[ 1 ] );
        ctx.lineTo( point2[ 0 ], point2[ 1 ] );
        ctx.stroke();
      
      }
      
      if( this.tick >= this.reachTime ){
        
        this.phase = 'contemplate';
        
        this.circleFinalSize = opts.fireworkCircleBaseSize + opts.fireworkCircleAddedSize * Math.random();
        this.circleCompleteTime = opts.fireworkCircleBaseTime + opts.fireworkCircleAddedTime * Math.random() |0;
        this.circleCreating = true;
        this.circleFading = false;
        
        this.circleFadeTime = opts.fireworkCircleFadeBaseTime + opts.fireworkCircleFadeAddedTime * Math.random() |0;
        this.tick = 0;
        this.tick2 = 0;
        
        this.shards = [];
        
        var shardCount = opts.fireworkBaseShards + opts.fireworkAddedShards * Math.random() |0,
            angle = Tau / shardCount,
            cos = Math.cos( angle ),
            sin = Math.sin( angle ),
            
            x = 1,
            y = 0;
        
        for( var i = 0; i < shardCount; ++i ){
          var x1 = x;
          x = x * cos - y * sin;
          y = y * cos + x1 * sin;
          
          this.shards.push( new Shard( this.x, this.y, x, y, this.alphaColor ) );
        }
      }
      
    }
  } else if( this.phase === 'contemplate' ){
    
    ++this.tick;
    
    if( this.circleCreating ){
      
      ++this.tick2;
      var proportion = this.tick2 / this.circleCompleteTime,
          armonic = -Math.cos( proportion * Math.PI ) / 2 + .5;
      
      ctx.beginPath();
      ctx.fillStyle = this.lightAlphaColor.replace( 'light', 50 + 50 * proportion ).replace( 'alp', proportion );
      ctx.beginPath();
      ctx.arc( this.x, this.y, armonic * this.circleFinalSize, 0, Tau );
      ctx.fill();
      
      if( this.tick2 > this.circleCompleteTime ){
        this.tick2 = 0;
        this.circleCreating = false;
        this.circleFading = true;
      }
    } else if( this.circleFading ){
    
      ctx.fillStyle = this.lightColor.replace( 'light', 70 );
      ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );
      
      ++this.tick2;
      var proportion = this.tick2 / this.circleFadeTime,
          armonic = -Math.cos( proportion * Math.PI ) / 2 + .5;
      
      ctx.beginPath();
      ctx.fillStyle = this.lightAlphaColor.replace( 'light', 100 ).replace( 'alp', 1 - armonic );
      ctx.arc( this.x, this.y, this.circleFinalSize, 0, Tau );
      ctx.fill();
      
      if( this.tick2 >= this.circleFadeTime )
        this.circleFading = false;
      
    } else {
      
      ctx.fillStyle = this.lightColor.replace( 'light', 70 );
      ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );
    }
    
    for( var i = 0; i < this.shards.length; ++i ){
      
      this.shards[ i ].step();
      
      if( !this.shards[ i ].alive ){
        this.shards.splice( i, 1 );
        --i;
      }
    }
    
    if( this.tick > opts.letterContemplatingWaitTime ){
      
      this.phase = 'burst';
      this.tick = 0;
      this.burstShards = [];
      var burstCount = 18 + Math.floor( Math.random() * 14 );
      for( var b = 0; b < burstCount; b++ ){
        var angle = ( b / burstCount ) * Tau;
        var vel = 3 + Math.random() * 5;
        this.burstShards.push({
          x: this.x, y: this.y,
          vx: Math.cos( angle ) * vel,
          vy: Math.sin( angle ) * vel,
          alpha: 1,
          size: 2 + Math.random() * 3
        });
      }
    }
  } else if( this.phase === 'burst' ){

    ++this.tick;
    var allDead = true;
    for( var b = 0; b < this.burstShards.length; b++ ){
      var s = this.burstShards[ b ];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.12;
      s.vx *= 0.97;
      s.alpha -= 0.022;
      if( s.alpha > 0 ){
        allDead = false;
        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc( s.x, s.y, s.size, 0, Tau );
        ctx.fill();
        ctx.restore();
      }
    }
    if( allDead ) this.phase = 'done';
  }
}
function Shard( x, y, vx, vy, color ){
  
  var vel = opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();
  
  this.vx = vx * vel;
  this.vy = vy * vel;
  
  this.x = x;
  this.y = y;
  
  this.prevPoints = [ [ x, y ] ];
  this.color = color;
  
  this.alive = true;
  
  this.size = opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
}
Shard.prototype.step = function(){
  
  this.x += this.vx;
  this.y += this.vy += opts.gravity;
  
  if( this.prevPoints.length > opts.fireworkShardPrevPoints )
    this.prevPoints.shift();
  
  this.prevPoints.push( [ this.x, this.y ] );
  
  var lineWidthProportion = this.size / this.prevPoints.length;
  
  for( var k = 0; k < this.prevPoints.length - 1; ++k ){
    
    var point = this.prevPoints[ k ],
        point2 = this.prevPoints[ k + 1 ];
    
    ctx.strokeStyle = this.color.replace( 'alp', k / this.prevPoints.length );
    ctx.lineWidth = k * lineWidthProportion;
    ctx.beginPath();
    ctx.moveTo( point[ 0 ], point[ 1 ] );
    ctx.lineTo( point2[ 0 ], point2[ 1 ] );
    ctx.stroke();
    
  }
  
  if( this.prevPoints[ 0 ][ 1 ] > hh )
    this.alive = false;
}
function generateBalloonPath( x, y, size ){
  
  ctx.moveTo( x, y );
  ctx.bezierCurveTo( x - size / 2, y - size / 2,
                     x - size / 4, y - size,
                     x,            y - size );
  ctx.bezierCurveTo( x + size / 4, y - size,
                     x + size / 2, y - size / 2,
                     x,            y );
}

var uiShown = false;

function anim(){
  
  window.requestAnimationFrame( anim );
  
  var gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, '#0a0e27');
  gradient.addColorStop(0.5, 'rgba(26, 15, 58, 0.8)');
  gradient.addColorStop(1, '#0d1a2e');
  ctx.fillStyle = gradient;
  ctx.fillRect( 0, 0, w, h );
  
  ctx.translate( hw, hh );

  if (Math.random() < 0.5) sparkles.push(new Sparkle());
  if (Math.random() < 0.35) hearts.push(new Heart());
  if (Math.random() < 0.4) stars.push(new Star());
  if (Math.random() < 0.25) ribbons.push(new Ribbon(Math.random() * w - hw, -hh));

  for (var i = sparkles.length - 1; i >= 0; i--) {
    sparkles[i].step();
    sparkles[i].draw();
    if (sparkles[i].life <= 0) sparkles.splice(i, 1);
  }

  for (var i = hearts.length - 1; i >= 0; i--) {
    hearts[i].step();
    hearts[i].draw();
    if (hearts[i].life <= 0) hearts.splice(i, 1);
  }

  for (var i = stars.length - 1; i >= 0; i--) {
    stars[i].step();
    stars[i].draw();
    if (stars[i].life <= 0) stars.splice(i, 1);
  }

  for (var i = ribbons.length - 1; i >= 0; i--) {
    ribbons[i].step();
    ribbons[i].draw();
    if (ribbons[i].life <= 0) ribbons.splice(i, 1);
  }

  for (var i = confetti.length - 1; i >= 0; i--) {
    confetti[i].step();
    confetti[i].draw();
    if (confetti[i].life <= 0) confetti.splice(i, 1);
  }

  var done = true;
  for( var l = 0; l < letters.length; ++l ){
    letters[ l ].step();
    if( letters[ l ].phase !== 'done' ) done = false;
  }

  ctx.translate( -hw, -hh );
  
  if( done ) {
    // Show button the first time animation completes
    if (!uiShown) {
      uiShown = true;
      document.getElementById('ui').classList.add('show');
    }

    for( var l = 0; l < letters.length; ++l )
      letters[ l ].reset();
    
    for (var i = 0; i < opts.confettiCount * 1.5; i++)
      confetti.push(new Confetti((Math.random() - 0.5) * w, -hh));
    
    for (var i = 0; i < 40; i++) {
      var side = Math.random(), x, y;
      if (side < 0.25)      { x = Math.random() * w - hw; y = -hh; }
      else if (side < 0.5)  { x = -hw; y = (Math.random() - 0.5) * h; }
      else if (side < 0.75) { x = hw;  y = (Math.random() - 0.5) * h; }
      else                  { x = (Math.random() - 0.5) * w; y = -hh; }
      hearts.push(new Heart(x, y));
    }
    
    for (var i = 0; i < 35; i++) {
      var side = Math.random(), x, y;
      if (side < 0.25)      { x = Math.random() * w - hw; y = -hh; }
      else if (side < 0.5)  { x = -hw; y = (Math.random() - 0.5) * h; }
      else if (side < 0.75) { x = hw;  y = (Math.random() - 0.5) * h; }
      else                  { x = (Math.random() - 0.5) * w; y = -hh; }
      stars.push(new Star(x, y));
    }
    
    for (var i = 0; i < 20; i++)
      ribbons.push(new Ribbon(Math.random() * w - hw, -hh));
  }
}

for( var i = 0; i < opts.strings.length; ++i ){
  for( var j = 0; j < opts.strings[ i ].length; ++j ){
    letters.push( new Letter( opts.strings[ i ][ j ], 
                            j * opts.charSpacing + opts.charSpacing / 2 - opts.strings[ i ].length * opts.charSpacing / 2,
                            i * opts.lineHeight + opts.lineHeight / 2 - opts.strings.length * opts.lineHeight / 2 ) );
  }
}

anim();

window.addEventListener( 'resize', function(){
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  hw = w / 2;
  hh = h / 2;
  ctx.font = 'bold ' + opts.charSize + 'px Verdana';
});
