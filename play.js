(function(){
  var v=document.getElementById('v');
  if(v){
    hgHistPut({id:v.getAttribute('data-vid'),name:v.getAttribute('data-name'),pic:v.getAttribute('data-pic'),ep:parseInt(v.getAttribute('data-ep'),10)||0,epName:v.getAttribute('data-epname')});
    hgMeP.then(function(me){
      if(me&&me.logged){
        fetch('/api/hist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:parseInt(v.getAttribute('data-vid'),10),ep:parseInt(v.getAttribute('data-ep'),10)||0})}).catch(function(){});
      }
    });
  }
  hgWireFav(document.getElementById('favBtn'));
})();
