(()=>{var e={41:()=>{Array.prototype.sum=function(){return this.reduce(((e,t)=>e+t))},HTMLElement.prototype.addClass=function(e){new RegExp(`^${e}$|^${e} | ${e}$| ${e}( )`,"g").test(this.className)||(this.className=`${this.className} ${e}`.trim())},HTMLElement.prototype.removeClass=function(e){const t=new RegExp(`^${e}$|^${e} | ${e}$| ${e}( )`,"g");this.className=this.className.replace(t,"$1").trim()},HTMLCollection.prototype.toArray=function(){return[...this]},NodeList.prototype.toArray=function(){return[...this]}}},t={};function n(o){var a=t[o];if(void 0!==a)return a.exports;var r=t[o]={exports:{}};return e[o](r,r.exports,n),r.exports}(()=>{"use strict";n(41);const e=["debug","info","warning","error"],t={log_level:"debug",get debug(){return e.indexOf(this.log_level.toLowerCase())<=e.indexOf("debug")?console.debug.bind(window.console,"%cDEBUG  :","color: #6c757d"):()=>{}},get info(){return e.indexOf(this.log_level.toLowerCase())<=e.indexOf("info")?console.info.bind(window.console,"%cINFO   :","color: #17a2b8"):()=>{}},get warning(){return e.indexOf(this.log_level.toLowerCase())<=e.indexOf("warning")?console.warn.bind(window.console,"%cWARNING:","color: #ffc107"):()=>{}},get error(){return e.indexOf(this.log_level.toLowerCase())<=e.indexOf("error")?console.error.bind(window.error,"%cERROR  :","color: #dc3545"):()=>{}}},o=new Proxy({},{get:(e,n)=>{if("origin"===n)return e;const o=window.localStorage[n];try{return o&&JSON.parse(o)}catch(e){return t.error("storage: Parse json fail, key: ",n)}},set:(e,t,n)=>(window.localStorage[t]=JSON.stringify(n),e[t]=n,!0)}),a={default:{wallpapers:[{url:"img/w0.jpg",video:0,active:!0},{url:"img/w1.jpg",video:1},{url:"img/w2.jpg",video:2}],local:{wallpaper_videos_0:"video/w0.mp4",wallpaper_videos_1:"video/w1.mp4",wallpaper_videos_2:"video/w2.mp4"}},init:()=>{const e=a.default.wallpapers;return chrome.storage.local.set({...a.default.local,wallpapers:e.concat(Array(9).fill({url:"img/placeholder.png",editbale:!0}))}),a.cache(e)},cache:e=>{try{const t=e.filter((e=>e.active));return o.wallpapers=t,t}catch(e){throw alert("The value of wallpapers exceeded the quota"),e}},boot:()=>{const e=o.wallpapers||a.init(),t=e[Math.floor(Math.random()*e.length)];t&&(window.wall.style.backgroundImage=`url(${t.url})`,t.video>-1&&setTimeout((()=>{const e=`wallpaper_videos_${t.video}`;chrome.storage.local.get(e,(t=>{const n=document.createElement("source");n.src=t[e],n.type="video/mp4",window.wall_video.appendChild(n)}))})))}},r=a,i={pool:{},emit:(e,...t)=>{for(const n of i.pool[e]??[])n(...t)},on:(e,t)=>{i.pool[e]?.push(t)||(i.pool[e]=[t])},next:(e,...t)=>{setTimeout(i.emit,0,e,...t)}},s=i,l={mounted:{},gen:(e,n)=>{if(l[e]||!/^[a-zA-Z][a-zA-Z0-9_]{0,63}$/.test(e))return t.error(`emitter: Name "${e}" existed or invalid`);l[e]=()=>{if(l.mounted[e])return t.error(`emitter: Duplicate mount emitter ${e}`);n(),l.mounted[e]=!0}}};l.gen("click",(()=>{function e(t,n,o=0){if(o>5||!t)return;const a=t.getAttribute("click-emit");if(!a)return e(t.parentElement,n,o+1);const r=a.split(":")[0];let i=a.split(":").slice(1).join(":");if("?"===i[0]){const e={};i.slice(1).split("&").forEach((t=>{const[n,o]=t.split("=");""!==n&&(e[n]=o)})),i=e}s.next(r,i,{target:t,domEvent:n})}window.document.body.addEventListener("click",(t=>{e(t.target,t)})),t.info("emiter: Click emiter mounted")}));const d=l,c={throttle:(e=200,t=!0)=>{const n={lock:!1,handle:null,execute:(o,...a)=>{n.handle=o,n.lock||(n.lock=!0,n.handle(...a),n.handle=null,setTimeout((()=>{n.lock=!1,t&&n.handle&&n.execute(n.handle,...a)}),e))}};return n},debounce:(e=200)=>{const t={timeout:null,execute:(n,...o)=>{clearTimeout(t.timeout),t.timeout=setTimeout(n,e,...o)}};return t},raf:()=>{const e={lock:!1,handle:null,execute:(t,...n)=>{e.handle=t,e.lock||(e.lock=!0,window.requestAnimationFrame((()=>{e.lock=!1,e.handle(...n)})))}};return e}},w={hide:()=>{window.modal.removeClass("modal-show")},show:e=>{window.modal_content.innerHTML=e,window.modal.addClass("modal-show")}};window.modal.addEventListener("click",(({target:e})=>{"modal"===e.id&&w.hide()}));const m=w,p={notes:[],call:{move:c.raf(),sync:c.throttle()},version:null,fetch:async()=>{const e=await chrome.storage.local.get(["notes","version"]);p.notes=e.notes||[],p.version=e.version,p.render()},save:()=>{const e=Date.now();chrome.storage.local.set({notes:p.notes,version:e}),p.version=e,t.debug("noter: Noter save:",p.notes)},createObject:e=>{const t={msg:"",x:Math.floor(Math.random()*(holder.w_w-500)),y:Math.floor(Math.random()*(holder.w_h-250)),w:300,h:100,workspace:o.workspace,status:"default"};return Object.assign(t,e)},createElement:e=>{const{id:t,msg:n,x:o,y:a,w:r,h:i,status:s}=e,l=document.createElement("div");return l.setAttribute("id",`noteid_${t}`),l.setAttribute("class","note"),l.setAttribute("style",`transform: translate(${o}px, ${a}px)`),l.setAttribute("note-status",s||"default"),l.innerHTML=`\n    <div class="note-controls" note-move-id="${t}">\n        <div class="note-remove" click-emit="note_remove:${t}">&times;</div>\n    </div>\n    <div class="note-rainbow">\n        <div click-emit="note_mark:${t},primary"></div>\n        <div click-emit="note_mark:${t},success"></div>\n        <div click-emit="note_mark:${t},danger"></div>\n    </div>\n    <div class="note-editor"\n        contenteditable="true"\n        spellcheck="false"\n        note-editor-id="${t}"\n        style="width:${r}px;height:${i-20}px"\n    >${n}</div>`,p.handleHashtag(l),l},add:e=>{void 0===e.id&&(e.id=Date.now().toString(),p.notes.push(e)),window.note_box.appendChild(p.createElement(e))},render:(e=!0,n=+o.workspace||0)=>{e&&(window.note_box.innerHTML="");for(const e of p.notes)n===e.workspace&&p.add(e);t.debug("noter: Render note",p.notes)},handleHashtag:e=>{const t=["note"];(e.querySelector(".note-editor").innerHTML.slice(0,256).match(/#[a-z0-9_]{1,12}/gi)||[]).includes("#mono")&&t.push("note-ffm"),e.className=t.join(" ")},remove:e=>{const t=p.notes.findIndex((t=>t.id==e));-1===o.workspace?(p.notes.splice(t,1),console.log(p.notes[t])):(p.notes[t].workspace=-1,p.notes[t].removeAt=Date.now());const n=window[`noteid_${e}`];n.parentElement.removeChild(n),p.save()},mark:(e,t)=>{const n=p.notes.find((t=>t.id==e));n.status===t?n.status="default":n.status=t,window[`noteid_${e}`].setAttribute("note-status",n.status),p.save()},handleOnChange:({target:e})=>{const t=e.getAttribute("note-editor-id");if(t){const n=p.notes.findIndex((e=>e.id==t));if(p.notes[n].msg===e.innerHTML)return;p.handleHashtag(e.parentElement),p.notes[n].msg=e.innerHTML,p.save()}},boot:()=>{const e={resize:!1,move:!1,deltaX:0,deltaY:0};s.on("note_remove",(e=>{p.remove(e)})),s.on("note_mark",(e=>{const[t,n]=e.split(",");p.mark(t,n)})),window.note_box.addEventListener("mousedown",(t=>{if(3===t.which)return;const{target:n}=t;if(null!==n.getAttribute("note-editor-id")){const o=t.clientX,a=t.clientY,r=+n.getAttribute("note-editor-id"),i=p.notes.findIndex((e=>e.id==r)),s=p.notes[i];s.x+s.w-o<15&&s.y+s.h-a<15&&(e.resize=r)}if(null!==n.getAttribute("note-move-id")){const o=+n.getAttribute("note-move-id"),a=p.notes.findIndex((e=>e.id==o));e.deltaX=t.clientX-p.notes[a].x,e.deltaY=t.clientY-p.notes[a].y,e.move=o}})),window.addEventListener("mousemove",(t=>{!1!==e.move&&(t.preventDefault(),p.call.move.execute((()=>{const n=window[`noteid_${e.move}`];if(n){const o=Math.min(holder.w_w-20,Math.max(t.clientX-e.deltaX,0)),a=Math.min(holder.w_h-20,Math.max(t.clientY-e.deltaY,0));n.style.transform=`translate(${o}px, ${a}px)`}})))})),window.addEventListener("mouseup",(t=>{if(!1!==e.move){const n=t.clientX-e.deltaX,o=t.clientY-e.deltaY,a=p.notes.findIndex((t=>t.id==e.move));-1!==a&&(p.notes[a].x=n,p.notes[a].y=o),e.move=!1,p.save()}else if(!1!==e.resize){const t=p.notes.findIndex((t=>t.id==e.resize)),n=window["noteid_"+e.resize].offsetWidth,o=window["noteid_"+e.resize].offsetHeight;-1!==t&&(p.notes[t].w=n,p.notes[t].h=o),e.resize=!1,p.save()}})),window.note_box.addEventListener("keyup",p.handleOnChange),window.note_box.addEventListener("paste",p.handleOnChange),window.note_box.addEventListener("click",(({target:e})=>{"IMG"===e.tagName&&m.show(`<img src="${e.src}" style="max-width: calc(100vw - 50px)">`)})),s.on("noter_add",(()=>{p.add(p.createObject()),p.save()})),s.on("noter_switch_workspace",(()=>{let e=+o.workspace||0;e>o.config.number_of_workspace-2?e=-1:e++,window.switch_workspace_btn.innerHTML=-1===e?"🗑️":e,o.workspace=e,p.save(),p.render()})),chrome.storage.onChanged.addListener(((e,t)=>{"local"===t&&p.call.sync.execute((()=>{e.notes&&e.version?.newValue>p.version&&(p.notes=e.notes.newValue,p.render())}))})),p.fetch().then((()=>{(!o.last_clear_trash||o.last_clear_trash<Date.now()-8e7)&&(o.last_clear_trash=Date.now(),p.notes=p.notes.filter((e=>-1!==e.workspace||e.removeAt>Date.now()-2592e6||void 0)),p.save())}))}},g=p,u={bookmarkBarElement:window.bookmark_bar,create:e=>{const{url:t,title:n,children:o}=e;return o?(setTimeout((()=>u.render(e))),""):`\n    <a class="item" href="${t}">\n        <img src="${chrome.runtime.getURL("/_favicon/")}?pageUrl=${t}">\n        <div class="title">${n}</div>\n    </a>`},createParent:e=>{const t=e.title,n=e.children.map((e=>u.create(e))).join(""),a=`${t}-${e.parentId||"root"}`;return`\n    <div class="parent ${o[`bookmark:parent:${a}`]||"open"}">\n        <div class="parent-header" data-parent-id="${a}">\n            <span class="icon icon-folder"></span>\n            <div class="label">${t}</div>\n        </div>\n        <div class="stopgrap"></div>\n        <div class="parent-childs">${n}</div>\n    </div>`},render:(e,t=!1)=>{t&&(u.bookmarkBarElement.innerHTML=""),u.bookmarkBarElement.innerHTML+=u.createParent(e)},toggleOpenParent:e=>{const t="close"===o[`bookmark:parent:${e}`]?"open":"close";o[`bookmark:parent:${e}`]=t,document.querySelector(`[data-parent-id="${e}"]`).parentNode.className=`parent ${t}`},fetch:()=>{chrome.topSites.get((e=>{u.render({children:e,title:"Most visited"},!0),chrome.bookmarks.getTree((e=>{u.render(e[0].children[0])}))}))},boot:()=>{u.bookmarkBarElement.addEventListener("click",(({target:e})=>{const t=e.getAttribute("data-parent-id")||e.parentNode.getAttribute("data-parent-id");t&&u.toggleOpenParent(t)})),chrome.bookmarks.onCreated.addListener(u.fetch),chrome.bookmarks.onRemoved.addListener(u.fetch),chrome.bookmarks.onChanged.addListener(u.fetch),chrome.bookmarks.onMoved.addListener(u.fetch),u.fetch()}},h=u,v=(e,t)=>{window.wave_click_box.innerHTML=`\n    <div class="wave active" style="transform: translate(${e}px, ${t}px)">\n        <div></div>\n        <div></div>\n        <div></div>\n    </div>`};window.addEventListener("mouseup",(e=>{v(e.clientX,e.clientY)}));const f={isOpen:!1,blob_buffer_url:null,render:()=>{const e=Math.floor(window.settings_wallpapers.clientWidth/6-11),t=Math.floor(e*holder.w_h/holder.w_w);window.settings_wallpapers.innerHTML=Array(12).fill(1).map((()=>`\n            <div class="settings-wall-pre"\n                style="width: ${e}px; height: ${t}px; background-image: url(/img/placeholder.png)"\n            ></div>\n            `)).join(""),chrome.storage.local.get("wallpapers",(({wallpapers:n})=>{window.settings_wallpapers.innerHTML=n.map(((n,o)=>{let a="settings-wall-pre";n.active&&(a+=" active");let r="";return n.editbale&&(r+=`<span click-emit="setting_wallpaper_edit:${o}">EDIT</span>`),`\n                <div class="${a}"\n                    style="width: ${e}px; height: ${t}px; background-image: url(${n.url})"\n                    click-emit="setting_wallpaper_toggle:${o}"\n                >${r}</div>\n                `})).join("")})),window.setting_config_input.value=JSON.stringify(o.config,null,2)},toggle:e=>{void 0===e&&(e=!f.isOpen),f.isOpen=e,e?(window.setting_box.removeClass("hidden"),f.render()):window.setting_box.addClass("hidden")}};s.on("setting_close",(()=>{f.toggle(!1)})),s.on("setting_open",(()=>{f.toggle(!0)})),s.on("setting_backup",(async()=>{const e=new Date,t=await chrome.storage.local.get(),n={};n.local=t,n.storage=window.localStorage;const o=new Blob([JSON.stringify(n)],{type:"text/plain"}),a=URL.createObjectURL(o),r=document.createElement("a");r.href=a,r.download="sein-backup-"+e.toLocaleDateString().replace(/\//g,"-")+".json",r.click(),URL.revokeObjectURL(a)})),s.on("setting_restore",(()=>{const e=document.createElement("input");e.type="file",e.addEventListener("change",(()=>{const t=e.files[0],n=new FileReader;n.addEventListener("load",(async()=>{const{local:e,storage:t,notes:o}=JSON.parse(n.result);if(t)for(const e of Object.keys(t))window.localStorage[e]=t[e];e&&await chrome.storage.local.set(e),o&&(g.notes=o,g.save()),window.alert("Restore completed"),window.location.reload()})),n.readAsText(t)}),{once:!0}),e.click()})),s.on("setting_config_save",(()=>{try{const e=JSON.parse(window.setting_config_input.value);o.config=e}catch(e){return console.error(e),window.alert("Parse and save config error")}window.alert("Save config success")})),s.on("setting_wallpaper_toggle",((e,{target:t})=>{e=+e,chrome.storage.local.get("wallpapers",(({wallpapers:n})=>{const o=-1!==t.className.indexOf("active");n[e].active=!o,r.cache(n),chrome.storage.local.set({wallpapers:n}),o?t.removeClass("active"):t.addClass("active")}))})),s.on("setting_wallpaper_edit",((e,{target:t})=>{e=+e;const n=document.createElement("input");n.type="file",n.addEventListener("change",(()=>{const o=n.files[0],a=new FileReader;a.addEventListener("load",(async()=>{if(o.type.startsWith("video/")){const n=document.createElement("video"),i=document.createElement("source"),s=document.createElement("canvas"),l=s.getContext("2d");return n.className="invisible",s.className="invisible",i.setAttribute("src",a.result),i.setAttribute("type",o.type),n.appendChild(i),window.setting_box.appendChild(n),void n.addEventListener("canplaythrough",(()=>{setTimeout((async()=>{s.width=n.videoWidth,s.height=n.videoHeight,window.setting_box.appendChild(s),l.drawImage(n,0,0,n.videoWidth,n.videoHeight);const{wallpapers:o}=await chrome.storage.local.get("wallpapers"),i=s.toDataURL("image/jpeg");window.setting_box.removeChild(n),window.setting_box.removeChild(s),o[e].url=i,o[e].video=e,r.cache(o),chrome.storage.local.set({wallpapers:o,[`wallpaper_videos_${e}`]:a.result}),t.parentElement.style.backgroundImage=`url(${i})`}),200)}))}if(o.type.startsWith("image/")){const{wallpapers:n}=await chrome.storage.local.get("wallpapers");n[e].url=a.result,r.cache(n),chrome.storage.local.set({wallpapers:n,[`wallpaper_videos_${e}`]:""}),t.parentElement.style.backgroundImage=`url(${a.result})`}else alert("Only accept image or video")})),a.readAsDataURL(o)}),{once:!0}),n.click()})),window.holder={w_w:window.document.documentElement.clientWidth,w_h:window.document.documentElement.clientHeight},window.addEventListener("resize",(()=>{holder.w_w=window.document.documentElement.clientWidth,holder.w_h=window.document.documentElement.clientHeight})),r.boot(),g.boot(),h.boot(),d.click(),o.config=Object.assign({log_level:"error",number_of_workspace:2},o.config),o.workspace?(-1===o.workspace&&o.workspace++,window.switch_workspace_btn.innerHTML=o.workspace):window.switch_workspace_btn.innerHTML="0",t.log_level=o.config.log_level})()})();