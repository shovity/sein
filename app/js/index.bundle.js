(()=>{var e={41:()=>{Array.prototype.sum=function(){return this.reduce(((e,t)=>e+t))},HTMLElement.prototype.addClass=function(e){new RegExp(`^${e}$|^${e} | ${e}$| ${e}( )`,"g").test(this.className)||(this.className=`${this.className} ${e}`.trim())},HTMLElement.prototype.removeClass=function(e){const t=new RegExp(`^${e}$|^${e} | ${e}$| ${e}( )`,"g");this.className=this.className.replace(t,"$1").trim()},HTMLCollection.prototype.toArray=function(){return[...this]},NodeList.prototype.toArray=function(){return[...this]}}},t={};function n(o){var a=t[o];if(void 0!==a)return a.exports;var r=t[o]={exports:{}};return e[o](r,r.exports,n),r.exports}(()=>{"use strict";n(41);const e=["debug","info","warning","error"],t={log_level:"debug",get debug(){return e.indexOf(this.log_level.toLowerCase())<=e.indexOf("debug")?console.debug.bind(window.console,"%cDEBUG  :","color: #6c757d"):()=>{}},get info(){return e.indexOf(this.log_level.toLowerCase())<=e.indexOf("info")?console.info.bind(window.console,"%cINFO   :","color: #17a2b8"):()=>{}},get warning(){return e.indexOf(this.log_level.toLowerCase())<=e.indexOf("warning")?console.warn.bind(window.console,"%cWARNING:","color: #ffc107"):()=>{}},get error(){return e.indexOf(this.log_level.toLowerCase())<=e.indexOf("error")?console.error.bind(window.error,"%cERROR  :","color: #dc3545"):()=>{}}},o=new Proxy({},{get:(e,n)=>{if("origin"===n)return e;const o=window.localStorage[n];try{return o&&JSON.parse(o)}catch(e){return t.error("storage: Parse json fail, key: ",n)}},set:(e,t,n)=>(window.localStorage[t]=JSON.stringify(n),e[t]=n,!0)}),a={default:{wallpapers:[{url:"img/w0.jpg",video:0,active:!0},{url:"img/w1.jpg",video:1},{url:"img/w2.jpg",video:2}],local:{wallpaper_videos_0:"video/w0.mp4",wallpaper_videos_1:"video/w1.mp4",wallpaper_videos_2:"video/w2.mp4"}},init:()=>{const e=a.default.wallpapers;return chrome.storage.local.set({...a.default.local,wallpapers:e.concat(Array(9).fill({url:"img/placeholder.png",editbale:!0}))}),a.cache(e)},cache:e=>{try{const t=e.filter((e=>e.active));return o.wallpapers=t,t}catch(e){throw alert("The value of wallpapers exceeded the quota"),e}},boot:()=>{const e=o.wallpapers||a.init(),t=e[Math.floor(Math.random()*e.length)];t&&(window.wall.style.backgroundImage=`url(${t.url})`,t.video>-1&&setTimeout((()=>{const e=`wallpaper_videos_${t.video}`;chrome.storage.local.get(e,(t=>{const n=document.createElement("source");n.src=t[e],n.type="video/mp4",window.wall_video.appendChild(n)}))})))}},r=a,i={pool:{},emit:(e,...t)=>{for(const n of i.pool[e]??[])n(...t)},on:(e,t)=>{i.pool[e]?.push(t)||(i.pool[e]=[t])},next:(e,...t)=>{setTimeout(i.emit,0,e,...t)}},s=i,l={mounted:{},gen:(e,n)=>{if(l[e]||!/^[a-zA-Z][a-zA-Z0-9_]{0,63}$/.test(e))return t.error(`emitter: Name "${e}" existed or invalid`);l[e]=()=>{if(l.mounted[e])return t.error(`emitter: Duplicate mount emitter ${e}`);n(),l.mounted[e]=!0}}};l.gen("click",(()=>{function e(t,n,o=0){if(o>5||!t)return;const a=t.getAttribute("click-emit");if(!a)return e(t.parentElement,n,o+1);const r=a.split(":")[0];let i=a.split(":").slice(1).join(":");if("?"===i[0]){const e={};i.slice(1).split("&").forEach((t=>{const[n,o]=t.split("=");""!==n&&(e[n]=o)})),i=e}s.next(r,i,{target:t,domEvent:n})}window.document.body.addEventListener("click",(t=>{e(t.target,t)})),t.info("emiter: Click emiter mounted")}));const d=l,c={throttle:(e=200,t=!0)=>{const n={lock:!1,handle:null,execute:(o,...a)=>{n.handle=o,n.lock||(n.lock=!0,n.handle(...a),n.handle=null,setTimeout((()=>{n.lock=!1,t&&n.handle&&n.execute(n.handle,...a)}),e))}};return n},debounce:(e=200)=>{const t={timeout:null,execute:(n,...o)=>{clearTimeout(t.timeout),t.timeout=setTimeout(n,e,...o)}};return t},raf:()=>{const e={lock:!1,handle:null,execute:(t,...n)=>{e.handle=t,e.lock||(e.lock=!0,window.requestAnimationFrame((()=>{e.lock=!1,e.handle(...n)})))}};return e}},w={hide:()=>{window.modal.removeClass("modal-show")},show:e=>{window.modal_content.innerHTML=e,window.modal.addClass("modal-show")}};window.modal.addEventListener("click",(({target:e})=>{"modal"===e.id&&w.hide()}));const p=w,m={pull_cooldown:1e4,call:{move:c.raf(),sync:c.throttle(),push:c.debounce(1e3)},version:null,eqCodeReady:null,notes:[],fetch:async()=>{const e=await chrome.storage.local.get(["notes","version"]);m.notes=e.notes||[],m.version=e.version,m.render()},save:()=>{const e=Date.now();chrome.storage.local.set({notes:m.notes,version:e}),m.version=e,m.call.push.execute(m.push),t.debug("noter: Noter save:",m.notes)},createObject:e=>{const t={msg:"",x:Math.floor(Math.random()*(holder.w_w-500)),y:Math.floor(Math.random()*(holder.w_h-250)),w:300,h:100,workspace:o.workspace||0,status:"default"};return Object.assign(t,e)},createElement:e=>{const t=document.createElement("div");return t.setAttribute("id",`noteid_${e.id}`),t.setAttribute("class","note"),t.setAttribute("style",`transform: translate(${e.x}px, ${e.y}px)`),t.setAttribute("note-status",e.status||"default"),t.innerHTML=`\n    <div class="note-controls" note-move-id="${e.id}">\n        <div class="note-remove" click-emit="note_remove:${e.id}">&times;</div>\n    </div>\n    <div class="note-rainbow">\n        <div click-emit="note_mark:${e.id},primary"></div>\n        <div click-emit="note_mark:${e.id},success"></div>\n        <div click-emit="note_mark:${e.id},danger"></div>\n    </div>\n    <div class="note-editor"\n        contenteditable="true"\n        spellcheck="false"\n        note-editor-id="${e.id}"\n        style="width:${e.w}px;height:${e.h-20}px"\n    >${e.msg}</div>`,m.handleHashtag(t),t},add:e=>{void 0===e.id&&(e.id=Date.now().toString(),e.updatedAt=Date.now(),m.notes.push(e)),window.note_box.appendChild(m.createElement(e))},render:(e=!0,n=+o.workspace||0)=>{e&&(window.note_box.innerHTML="");for(const e of m.notes)n===e.workspace&&m.add(e);t.debug("noter: Render note",m.notes)},handleEqcode:e=>{const t=window.getSelection(),n=t.getRangeAt(0),o=document.createElement("span");o.id="caret-marker",o.appendChild(document.createTextNode("​")),n.insertNode(o);const a=e.innerHTML;holder.code_tables.forEach((t=>{const n=new RegExp(t.code),o=a.match(n);if(o){const r=o.slice(1);let i=t.value;for(const e of r)i=i.replace("$",e);e.innerHTML=a.replace(n,i)}}));const r=document.getElementById("caret-marker");if(r){const e=document.createRange();e.setStartAfter(r),e.collapse(!0),r.parentNode.removeChild(r),t.removeAllRanges(),t.addRange(e)}},handleHashtag:e=>{const t=["note"];(e.querySelector(".note-editor").innerHTML.slice(0,256).match(/#[a-z0-9_]{1,12}/gi)||[]).includes("#mono")&&t.push("note-ffm"),e.className=t.join(" ")},remove:e=>{const t=m.notes.findIndex((t=>t.id==e));-1!==o.workspace&&m.notes[t].msg.replace(/(<br>)| /g,"")?(m.notes[t].workspace=-1,m.notes[t].removeAt=Date.now(),m.notes[t].updatedAt=Date.now()):m.notes.splice(t,1);const n=window[`noteid_${e}`];n.parentElement.removeChild(n),m.save()},mark:(e,t)=>{const n=m.notes.find((t=>t.id==e));n.status===t?n.status="default":n.status=t,window[`noteid_${e}`].setAttribute("note-status",n.status),m.save()},handleOnChange:({target:e,key:t})=>{const n=e.getAttribute("note-editor-id");if(n){const o=m.notes.findIndex((e=>e.id==n));if(m.notes[o].msg===e.innerHTML)return;m.handleHashtag(e.parentElement),"="===t&&(m.eqCodeReady?(m.handleEqcode(e),m.eqCodeReady=!1):m.eqCodeReady=!0),m.notes[o].msg=e.innerHTML,m.notes[o].updatedAt=Date.now(),m.save()}},pull:async()=>{if(!o.config.sync_url)return;if(o.pull_date>Date.now()-m.pull_cooldown)return;const[e,t]=o.config.sync_url.split("#"),n=Date.now(),a=m.notes.filter((e=>e.updatedAt>=+o.pull_date)).map((e=>`${e.id}:${e.updatedAt}`)).join(","),r=await fetch(`${e}?date=${o.pull_date||0}&exclude=${a}`,{method:"GET",headers:{"X-Secret":t}}),{data:i}=await r.json();if(i?.length){const e={};let t=!1;for(const t of m.notes)e[t.id]=t;for(const{raw:n}of i)(!e[n.id]?.updatedAt||e[n.id].updatedAt<n.updatedAt)&&(e[n.id]=n,t=!0);t&&(m.notes=Object.values(e),m.render(),m.save())}o.pull_date=n},push:async()=>{if(!o.config.sync_url)return;const e=m.notes.filter((e=>+e.updatedAt>(+o.push_date||0)&&e.msg)),t=Date.now(),[n,a]=o.config.sync_url.split("#");e.length&&await fetch(n,{method:"POST",body:JSON.stringify({notes:e}),headers:{"Content-Type":"application/json","X-Secret":a}}),o.push_date=t},clearTrash:()=>{o.last_clear_trash>Date.now()-8e7||(o.last_clear_trash=Date.now(),m.notes=m.notes.filter((e=>-1!==e.workspace||e.removeAt>Date.now()-2592e6||void 0)),m.save())},boot:()=>{const e={resize:!1,move:!1,deltaX:0,deltaY:0};s.on("note_remove",(e=>{m.remove(e)})),s.on("note_mark",(e=>{const[t,n]=e.split(",");m.mark(t,n)})),window.note_box.addEventListener("mousedown",(t=>{if(3===t.which)return;const{target:n}=t;if(null!==n.getAttribute("note-editor-id")){const o=t.clientX,a=t.clientY,r=+n.getAttribute("note-editor-id"),i=m.notes.findIndex((e=>e.id==r)),s=m.notes[i];s.x+s.w-o<15&&s.y+s.h-a<15&&(e.resize=r)}if(null!==n.getAttribute("note-move-id")){document.body.style.userSelect="none";const o=+n.getAttribute("note-move-id"),a=m.notes.findIndex((e=>e.id==o));e.deltaX=t.clientX-m.notes[a].x,e.deltaY=t.clientY-m.notes[a].y,e.move=o}})),window.addEventListener("mousemove",(t=>{!1!==e.move&&(t.preventDefault(),m.call.move.execute((()=>{const n=window[`noteid_${e.move}`];if(n){const o=Math.min(holder.w_w-20,Math.max(t.clientX-e.deltaX,0)),a=Math.min(holder.w_h-20,Math.max(t.clientY-e.deltaY,0));n.style.transform=`translate(${o}px, ${a}px)`}})))})),window.addEventListener("mouseup",(t=>{if(document.body.style.userSelect="",!1!==e.move){const n=t.clientX-e.deltaX,o=t.clientY-e.deltaY,a=m.notes.find((t=>t.id==e.move));a&&(a.x=Math.max(0,Math.min(holder.w_w,n)),a.y=Math.max(0,Math.min(holder.w_h,o)),a.updatedAt=Date.now()),e.move=!1,m.save()}else if(!1!==e.resize){const t=m.notes.find((t=>t.id==e.resize));t&&(t.w=window["noteid_"+e.resize].offsetWidth,t.h=window["noteid_"+e.resize].offsetHeight,t.updatedAt=Date.now()),e.resize=!1,m.save()}})),window.note_box.addEventListener("keyup",m.handleOnChange),window.note_box.addEventListener("paste",m.handleOnChange),window.note_box.addEventListener("click",(({target:e})=>{"IMG"===e.tagName&&p.show(`<img src="${e.src}" style="max-width: calc(100vw - 50px)">`)})),s.on("noter_add",(()=>{m.add(m.createObject()),m.save()})),s.on("noter_switch_workspace",(()=>{let e=+o.workspace||0;e>o.config.number_of_workspace-2?e=-1:e++,window.switch_workspace_btn.innerHTML=-1===e?"🗑️":e,o.workspace=e,m.save(),m.render()})),chrome.storage.onChanged.addListener(((e,t)=>{"local"===t&&m.call.sync.execute((()=>{e.notes&&e.version?.newValue>m.version&&(m.notes=e.notes.newValue,m.render())}))})),m.fetch().then((async()=>{m.clearTrash(),await m.push(),await m.pull()}))}},u=m,g={bookmarkBarElement:window.bookmark_bar,create:e=>{const{url:t,title:n,children:o}=e;return o?(setTimeout((()=>g.render(e))),""):`\n    <a class="item" href="${t}">\n        <img src="${chrome.runtime.getURL("/_favicon/")}?pageUrl=${t}">\n        <div class="title">${n}</div>\n    </a>`},createParent:e=>{const t=e.title,n=e.children.map((e=>g.create(e))).join(""),a=`${t}-${e.parentId||"root"}`;return`\n    <div class="parent ${o[`bookmark:parent:${a}`]||"open"}">\n        <div class="parent-header" data-parent-id="${a}">\n            <span class="icon icon-folder"></span>\n            <div class="label">${t}</div>\n        </div>\n        <div class="stopgrap"></div>\n        <div class="parent-childs">${n}</div>\n    </div>`},render:(e,t=!1)=>{t&&(g.bookmarkBarElement.innerHTML=""),g.bookmarkBarElement.innerHTML+=g.createParent(e)},toggleOpenParent:e=>{const t="close"===o[`bookmark:parent:${e}`]?"open":"close";o[`bookmark:parent:${e}`]=t,document.querySelector(`[data-parent-id="${e}"]`).parentNode.className=`parent ${t}`},fetch:()=>{chrome.topSites.get((e=>{g.render({children:e,title:"Most visited"},!0),chrome.bookmarks.getTree((e=>{g.render(e[0].children[0])}))}))},boot:()=>{g.bookmarkBarElement.addEventListener("click",(({target:e})=>{const t=e.getAttribute("data-parent-id")||e.parentNode.getAttribute("data-parent-id");t&&g.toggleOpenParent(t)})),chrome.bookmarks.onCreated.addListener(g.fetch),chrome.bookmarks.onRemoved.addListener(g.fetch),chrome.bookmarks.onChanged.addListener(g.fetch),chrome.bookmarks.onMoved.addListener(g.fetch),g.fetch()}},h=g,v=(e,t)=>{window.wave_click_box.innerHTML=`\n    <div class="wave active" style="transform: translate(${e}px, ${t}px)">\n        <div></div>\n        <div></div>\n        <div></div>\n    </div>`};window.addEventListener("mouseup",(e=>{v(e.clientX,e.clientY)}));const f={isOpen:!1,blob_buffer_url:null,render:()=>{const e=Math.floor(window.settings_wallpapers.clientWidth/6-11),t=Math.floor(e*holder.w_h/holder.w_w);window.settings_wallpapers.innerHTML=Array(12).fill(1).map((()=>`\n            <div class="settings-wall-pre"\n                style="width: ${e}px; height: ${t}px; background-image: url(/img/placeholder.png)"\n            ></div>\n            `)).join(""),chrome.storage.local.get("wallpapers",(({wallpapers:n})=>{window.settings_wallpapers.innerHTML=n.map(((n,o)=>{let a="settings-wall-pre";n.active&&(a+=" active");let r="";return n.editbale&&(r+=`<span click-emit="setting_wallpaper_edit:${o}">EDIT</span>`),`\n                <div class="${a}"\n                    style="width: ${e}px; height: ${t}px; background-image: url(${n.url})"\n                    click-emit="setting_wallpaper_toggle:${o}"\n                >${r}</div>\n                `})).join("")})),window.setting_config_input.value=JSON.stringify(o.config,null,2)},toggle:e=>{void 0===e&&(e=!f.isOpen),f.isOpen=e,e?(window.setting_box.removeClass("hidden"),f.render()):window.setting_box.addClass("hidden")}};s.on("setting_close",(()=>{f.toggle(!1)})),s.on("setting_open",(()=>{f.toggle(!0)})),s.on("setting_backup",(async()=>{const e=new Date,t=await chrome.storage.local.get(),n={};n.local=t,n.storage=window.localStorage;const o=new Blob([JSON.stringify(n)],{type:"text/plain"}),a=URL.createObjectURL(o),r=document.createElement("a");r.href=a,r.download="sein-backup-"+e.toLocaleDateString().replace(/\//g,"-")+".json",r.click(),URL.revokeObjectURL(a)})),s.on("setting_restore",(()=>{const e=document.createElement("input");e.type="file",e.addEventListener("change",(()=>{const t=e.files[0],n=new FileReader;n.addEventListener("load",(async()=>{const{local:e,storage:t,notes:o}=JSON.parse(n.result);if(t)for(const e of Object.keys(t))window.localStorage[e]=t[e];e&&await chrome.storage.local.set(e),o&&(u.notes=o,u.save()),window.alert("Restore completed"),window.location.reload()})),n.readAsText(t)}),{once:!0}),e.click()})),s.on("setting_config_save",(()=>{try{const e=JSON.parse(window.setting_config_input.value);o.config=e}catch(e){return console.error(e),window.alert("Parse and save config error")}window.alert("Save config success")})),s.on("setting_wallpaper_toggle",((e,{target:t})=>{e=+e,chrome.storage.local.get("wallpapers",(({wallpapers:n})=>{const o=-1!==t.className.indexOf("active");n[e].active=!o,r.cache(n),chrome.storage.local.set({wallpapers:n}),o?t.removeClass("active"):t.addClass("active")}))})),s.on("setting_wallpaper_edit",((e,{target:t})=>{e=+e;const n=document.createElement("input");n.type="file",n.addEventListener("change",(()=>{const o=n.files[0],a=new FileReader;a.addEventListener("load",(async()=>{if(o.type.startsWith("video/")){const n=document.createElement("video"),i=document.createElement("source"),s=document.createElement("canvas"),l=s.getContext("2d");return n.className="invisible",s.className="invisible",i.setAttribute("src",a.result),i.setAttribute("type",o.type),n.appendChild(i),window.setting_box.appendChild(n),void n.addEventListener("canplaythrough",(()=>{setTimeout((async()=>{s.width=n.videoWidth,s.height=n.videoHeight,window.setting_box.appendChild(s),l.drawImage(n,0,0,n.videoWidth,n.videoHeight);const{wallpapers:o}=await chrome.storage.local.get("wallpapers"),i=s.toDataURL("image/jpeg");window.setting_box.removeChild(n),window.setting_box.removeChild(s),o[e].url=i,o[e].video=e,r.cache(o),chrome.storage.local.set({wallpapers:o,[`wallpaper_videos_${e}`]:a.result}),t.parentElement.style.backgroundImage=`url(${i})`}),200)}))}if(o.type.startsWith("image/")){const{wallpapers:n}=await chrome.storage.local.get("wallpapers");n[e].url=a.result,r.cache(n),chrome.storage.local.set({wallpapers:n,[`wallpaper_videos_${e}`]:""}),t.parentElement.style.backgroundImage=`url(${a.result})`}else alert("Only accept image or video")})),a.readAsDataURL(o)}),{once:!0}),n.click()})),window.holder={w_w:window.document.documentElement.clientWidth,w_h:window.document.documentElement.clientHeight,code_tables:[{code:"date==",value:(new Date).toLocaleDateString()},{code:"time==",value:(new Date).toLocaleTimeString()},{code:"now==",value:(new Date).toLocaleString()},{code:"name_(.+?)==",value:"Hi sir, $ <3"}]},window.addEventListener("resize",(()=>{holder.w_w=window.document.documentElement.clientWidth,holder.w_h=window.document.documentElement.clientHeight})),r.boot(),u.boot(),h.boot(),d.click(),o.config=Object.assign({log_level:"error",number_of_workspace:2},o.config),o.workspace?(-1===o.workspace&&o.workspace++,window.switch_workspace_btn.innerHTML=o.workspace):window.switch_workspace_btn.innerHTML="0",t.log_level=o.config.log_level})()})();