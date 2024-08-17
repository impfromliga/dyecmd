const {performance} = require('perf_hooks'), start = performance.now();
const { get, getSync } = require('@andreekeberg/imagedata');
const filename = process.argv[2] || 'lena80x50.png';
(async function(){
    var Dye = (await import('./dye.mjs')).default;
	get(filename, (err,iData) => {
		if(err)return console.log(err);
        var dye= new Dye(iData.data.buffer, iData.width, iData.height);
		console.log(`${filename} render in ${performance.now() - start} ms\n\n${dye}` );
    })
})();