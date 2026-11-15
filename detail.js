(function(){
  hgWireFav(document.getElementById('favBtn'));
  var w=document.getElementById('watchBtn');
  if(w){
    var h=hgHistGet(w.getAttribute('data-id'));
    if(h){w.setAttribute('href','/play?id='+h.id+'&ep='+h.ep);w.textContent='▶ 继续播放 · '+h.epName;}
    hgMeP.then(function(me){
      if(me&&me.logged){
        fetch('/api/hist').then(function(r){return r.json();}).then(function(list){
          for(var i=0;i<(list||[]).length;i++){
            if(String(list[i].id)===String(w.getAttribute('data-id'))){
              w.setAttribute('href','/play?id='+list[i].id+'&ep='+list[i].ep);
              w.textContent='▶ 继续播放 · '+(list[i].epName||'');
              break;
            }
          }
        }).catch(function(){});
      }
    });
  }
})();
(function(){
  var s=document.getElementById('shareBtn');
  if(!s)return;
  s.addEventListener('click',function(){
    function done(){var t=s.textContent;s.textContent='已复制链接';setTimeout(function(){s.textContent=t;},1600);}
    if(navigator.share){navigator.share({title:document.title,url:location.href}).catch(function(){});}
    else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(location.href).then(done).catch(function(){});}
  });
})();
