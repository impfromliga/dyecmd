//console.log('\u2588\u2596\u2597\u2598\u2599\u259A\u259B\u259C\u259D\u259E\u259F');
//see https://unicode-table.com/ru/blocks/block-elements/ (bits are BGR) //Dye.TILES=` ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█`;
Dye.FG='01234567'.split('').map(v=>`\x1b[3${v}m`);
Dye.BG='01234567'.split('').map(v=>`\x1b[4${v}m`);
function Dye(mapper,w,h){
    this.w= w||80; this.h= h||50;
    this.buf= new Uint32Array(w*h);
    if(typeof mapper == 'function') Dye.prototype.mapper.call(this,mapper);
    if(typeof mapper == 'object') this.buf= new Uint32Array(mapper);
}
Dye.prototype.mapper = function(mapper){
    for(var i=this.buf.length;i--;)
        this.buf[i]= mapper(this.buf[i],i,this.buf);
    return this;
}
var add888= (a,b)=>((a&0xfefefe)>>1)+((b&0xfefefe)>>1);
var to111= bgr=> (bgr&0x808080)*0x4081>>21&7;
Dye.prototype.toString = function(){
    var str='';
    const w=this.w, h=this.h;
    var errs= Array(w).fill(0);
    var tops= Array(w).fill(0);
    for(var e=0, y=0; y<h; y++){
        for(var x=w; x--; e=bgr&0x7f7f7f){
            var bgr = add888(this.buf[x+y*w], e+errs[(x+(x%3))%w] );
            tops[x]= to111(bgr);
            errs[x%w]= e;
        }y++;
        for(var x=0; x<w; x++, e=bgr&0x7f7f7f){
            var bgr = add888(this.buf[x+y*w], e+ errs[(x-(x%3))%w]);
            str+= Dye.FG[ tops[x] ] +Dye.BG[ to111(bgr) ] +'▀';
            errs[(x-1)%w]= e;
        }
        str+='\x1b[40m\n';
    }
    return str+'\x1b[37m';
}

export default Dye;