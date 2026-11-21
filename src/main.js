import*as T from 'three';
const $=i=>document.getElementById(i),V3=T.Vector3,rnd=Math.random,PI=Math.PI,cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const R=new T.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(innerWidth,innerHeight);R.shadowMap.enabled=true;document.body.prepend(R.domElement);
const bgA=new T.Color(0x9a9a9a),bgB=new T.Color(0x1c0f33),S=new T.Scene();S.background=bgA.clone();S.fog=new T.Fog(0x9a9a9a,20,70);
const C=new T.PerspectiveCamera(60,innerWidth/innerHeight,.1,400);
addEventListener('resize',()=>{R.setSize(innerWidth,innerHeight);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()});
const hemi=new T.HemisphereLight(0xffffff,0x667766,1.1),sun=new T.DirectionalLight(0xffffff,1.8);
sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8});sun.shadow.camera.updateProjectionMatrix();S.add(hemi,sun,sun.target);
// ---------- SUELO + PASTO 3D ----------
const G=new T.Mesh(new T.PlaneGeometry(300,300),new T.MeshStandardMaterial({color:0x3f7a2e,roughness:1}));G.rotation.x=-PI/2;G.receiveShadow=true;S.add(G);
const bg=new T.BufferGeometry();bg.setAttribute('position',new T.Float32BufferAttribute([-.06,0,0,.06,0,0,0,.55,0],3));bg.computeVertexNormals();
const uT={value:0},gm=new T.MeshLambertMaterial({side:T.DoubleSide});
gm.onBeforeCompile=s=>{s.uniforms.uT=uT;s.vertexShader='uniform float uT;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvec4 ip=instanceMatrix*vec4(0.,0.,0.,1.);transformed.x+=sin(uT*2.+ip.x*.7+ip.z*.5)*.24*position.y;')};
const NG=24000,GR=new T.InstancedMesh(bg,gm,NG),m4=new T.Matrix4(),qq=new T.Quaternion(),ee=new T.Euler(),gc=new T.Color();
for(let i=0;i<NG;i++){const s=.7+rnd()*1.1;ee.set(0,rnd()*6.28,0);m4.compose(new V3((rnd()-.5)*130,0,(rnd()-.5)*130),qq.setFromEuler(ee),new V3(s,s*(.8+rnd()*.8),s));GR.setMatrixAt(i,m4);GR.setColorAt(i,gc.setHSL(.25+rnd()*.07,.55,.25+rnd()*.2))}
GR.receiveShadow=true;S.add(GR);
// ---------- PERSONAJE ----------
const M=new T.MeshStandardMaterial({color:0x8d8d8d,roughness:.5}),M2=new T.MeshStandardMaterial({color:0x767676,roughness:.7}),M3=new T.MeshStandardMaterial({color:0x666666,roughness:.4});
const mesh=(g,m,p,par,sc,rot)=>{const o=new T.Mesh(g,m);o.position.set(...p);if(sc)o.scale.set(...sc);if(rot)o.rotation.set(...rot);o.castShadow=true;par.add(o);return o};
const grp=(p,par)=>{const o=new T.Group();o.position.set(...p);par.add(o);return o};
const sph=r=>new T.SphereGeometry(r,20,16),cap=(r,l)=>new T.CapsuleGeometry(r,l,6,12),cyl=(a,b,h)=>new T.CylinderGeometry(a,b,h,16),box=(w,h,d)=>new T.BoxGeometry(w,h,d),cone=(r,h)=>new T.ConeGeometry(r,h,10);
const root=new T.Group();S.add(root);
const body=grp([0,0,0],root),tor=grp([0,.71,0],body),head=grp([0,.5,0],tor);
mesh(box(.36,.17,.23),M2,[0,.69,0],body);
mesh(box(.33,.46,.2),M2,[0,.24,0],tor);mesh(box(.38,.4,.06),M,[0,.26,-.1],tor);
[1,-1].forEach(s=>{mesh(box(.15,.4,.23),M,[s*.12,.26,0],tor);mesh(box(.06,.05,.02),M2,[s*.12,.34,.12],tor)});
mesh(new T.TorusGeometry(.13,.05,10,20),M,[0,.47,0],tor,null,[PI/2,0,0]);
const hood=grp([0,.46,-.1],tor);mesh(box(.24,.14,.06),M,[0,-.04,-.03],hood);
const hem=grp([0,.1,0],tor);mesh(box(.39,.13,.25),M,[0,-.05,0],hem);
mesh(cyl(.06,.07,.12),M2,[0,.02,0],head);mesh(sph(.24),M,[0,.27,0],head);mesh(sph(.03),M,[0,.21,.24],head);
[1,-1].forEach(s=>{mesh(sph(.06),M,[s*.24,.24,0],head,[.7,1,1]);mesh(sph(.04),M3,[s*.085,.28,.215],head,[1,1.4,.3]);mesh(cone(.05,.16),M,[s*.2,.4,0],head,null,[0,0,-s*.9])});
const hair=grp([0,.27,0],head);mesh(new T.SphereGeometry(.26,20,14,0,PI*2,0,1.7),M,[0,0,-.015],hair,null,[-.2,0,0]);
const fr=grp([-.02,.2,.15],hair);mesh(sph(1),M,[0,0,.07],fr,[.2,.05,.13],[.6,0,.3]);
const ts=grp([.05,.24,0],hair);mesh(cone(.07,.2),M,[0,.09,0],ts,null,[0,0,-.4]);
const L=[],A=[];
[1,-1].forEach(s=>{
 const th=grp([s*.1,.71,0],body);mesh(cyl(.115,.125,.24),M,[0,-.12,0],th);mesh(cyl(.062,.062,.14),M2,[0,-.27,0],th);
 const kn=grp([0,-.34,0],th);mesh(cyl(.062,.06,.34),M2,[0,-.17,0],kn);mesh(cyl(.1,.105,.16),M,[0,-.2,0],kn);mesh(cap(.075,.12),M,[0,-.29,.05],kn,null,[PI/2,0,0]);L.push({th,kn,s});
 const sh=grp([s*.225,.44,0],tor);mesh(cap(.07,.18),M,[0,-.13,0],sh);
 const el=grp([0,-.26,0],sh);mesh(cap(.066,.1),M,[0,-.09,0],el);mesh(cyl(.082,.082,.08),M,[0,-.19,0],el);
 A.push({sh,el,s,hd:mesh(sph(.08),M,[0,-.27,0],el,[1,1.1,.9])});
});
// ---------- ESTADO ----------
let tm=0,ph=0,cy=0,pch=.3,psi=0,py=0,vy=0,gnd=true,land=0,cA=0,pA=0,run=false,cr=false,pr=false,jr=false,jx=0,jy=0,lt=0;
const pos=new V3(),vel=new V3(),cur={},tg={},st={h:{},hz:{},f:{},t:{},hd:{}},K={},U={on:false,t:0,f:{}};
't0 t1 k0 k1 a0 a1 f0 f1 z0 z1 tx ty hx by br bz sp'.split(' ').forEach(k=>cur[k]=0);
const sp=(o,t,dt)=>{o.v=(o.v||0)+((t-(o.a||0))*80-(o.v||0)*7)*dt;return o.a=(o.a||0)+o.v*dt};
const sync=()=>{$('co').classList.toggle('on',run);$('ag').classList.toggle('on',cr);$('ac').classList.toggle('on',pr);$('ul').style.opacity=U.on?.4:1};
// ---------- CONTROLES ----------
const JB=$('jb'),JK=$('jk');let jp=null,jo=[0,0],cq=null,cd=[0,0];
addEventListener('pointerdown',e=>{au();if(e.target.classList.contains('b'))return;
 if(e.clientX<innerWidth*.45&&jp==null){jp=e.pointerId;jo=[e.clientX,e.clientY];JB.style.display='block';JB.style.left=e.clientX-50+'px';JB.style.top=e.clientY-50+'px';JK.style.transform='none'}
 else if(cq==null){cq=e.pointerId;cd=[e.clientX,e.clientY]}});
addEventListener('pointermove',e=>{if(e.pointerId==jp){let x=e.clientX-jo[0],y=e.clientY-jo[1];const l=Math.hypot(x,y);if(l>50){x*=50/l;y*=50/l}jx=x/50;jy=y/50;JK.style.transform=`translate(${x}px,${y}px)`}
 else if(e.pointerId==cq){cy+=(e.clientX-cd[0])*.006;pch=cl(pch+(e.clientY-cd[1])*.004,.05,1.2);cd=[e.clientX,e.clientY]}});
const up=e=>{if(e.pointerId==jp){jp=null;jx=jy=0;JB.style.display='none'}if(e.pointerId==cq)cq=null};addEventListener('pointerup',up);addEventListener('pointercancel',up);
const bt=(i,f)=>$(i).addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();au();f();sync()});
bt('ju',()=>jr=true);bt('ag',()=>{if(!U.on){cr=!cr;pr=false}});bt('ac',()=>{if(!U.on){pr=!pr;cr=false}});bt('co',()=>run=!run);bt('ul',ultGo);
addEventListener('keydown',e=>{K[e.code]=1;if(e.code=='Space')jr=true;if(e.code=='KeyC'&&!U.on){cr=!cr;pr=false}if(e.code=='KeyZ'&&!U.on){pr=!pr;cr=false}if(e.code=='KeyE')ultGo();sync()});
addEventListener('keyup',e=>K[e.code]=0);
// ---------- AUDIO ----------
let AC,mg;
const au=()=>{if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();mg=AC.createGain();mg.gain.value=.9;const dl=AC.createDelay(),fb=AC.createGain();dl.delayTime.value=.33;fb.gain.value=.38;mg.connect(AC.destination);mg.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(AC.destination)}if(AC.state=='suspended')AC.resume();return AC};
const osc=(ty,f0,f1,t0,d,g,dest,h=.3)=>{const o=AC.createOscillator(),v=AC.createGain();o.type=ty;o.frequency.setValueAtTime(f0,t0);o.frequency.exponentialRampToValueAtTime(f1,t0+d);v.gain.setValueAtTime(0,t0);v.gain.linearRampToValueAtTime(g,t0+.02);v.gain.setValueAtTime(g,t0+Math.max(.02,d*h));v.gain.exponentialRampToValueAtTime(.001,t0+d);o.connect(v);v.connect(dest||mg);o.start(t0);o.stop(t0+d+.05)};
const noise=(t0,d,ty,f0,f1,g,Q=1)=>{const b=AC.createBuffer(1,AC.sampleRate*d|0,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=rnd()*2-1;const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type=ty;f.Q.value=Q;f.frequency.setValueAtTime(f0,t0);f.frequency.exponentialRampToValueAtTime(f1,t0+d);const v=AC.createGain();v.gain.setValueAtTime(g,t0);v.gain.exponentialRampToValueAtTime(.001,t0+d);s.connect(f);f.connect(v);v.connect(mg);s.start(t0)};
const voice=(t0,f0,f1,d,g)=>{const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=950;bp.Q.value=2;const rm=AC.createGain();rm.gain.value=0;const lf=AC.createOscillator();lf.frequency.value=55;lf.connect(rm.gain);lf.start(t0);lf.stop(t0+d+.1);bp.connect(rm);rm.connect(mg);bp.connect(mg);osc('sawtooth',f0,f1,t0,d,g,bp);osc('square',f0*.5,f1*.5,t0,d,g*.6,bp)};
const tts=(s,p,r,v,l)=>{try{const u=new SpeechSynthesisUtterance(s);u.pitch=p;u.rate=r;u.volume=v;u.lang=l;speechSynthesis.speak(u)}catch(e){}};
const laugh=()=>{const n=AC.currentTime+.1;for(let i=0;i<9;i++)voice(n+i*.3,300-i*12,220-i*10,.22,.22);voice(n+2.9,330,100,.9,.28);tts('Ja, ja, ja, ja, jaaaa',.2,.75,.8,'es-MX');osc('sawtooth',50,900,n+3.8,11.2,.12,null,.9);osc('sine',90,500,n+3.8,11.2,.2,null,.9)};
const whisper=()=>{const n=AC.currentTime;[[2300,.1],[1500,.13],[1900,.1],[1700,.1],[3400,.18],[1200,.2]].reduce((t,[f,d])=>{noise(n+t,d,'bandpass',f,f*.9,.6,3);return t+d+.03},0);tts('Inexpeshion',.6,.55,.3,'en-US');setTimeout(()=>tts('Inexpeshion',.6,.55,.12,'en-US'),1100)};
const boom=()=>{const n=AC.currentTime;osc('sine',110,30,n,3,1.3,null,0);noise(n,3.5,'lowpass',4000,60,1.2);osc('sawtooth',55,40,n,5,.3,null,.8);noise(n+.3,4.7,'lowpass',2500,400,.35);try{speechSynthesis.cancel()}catch(e){}tts('Pooom',0,.35,1,'es-MX')};
// ---------- EFECTOS ULTI ----------
const ad=(c,o=1,m=null)=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,fog:false,map:m});
const cv=document.createElement('canvas');cv.width=cv.height=64;const x=cv.getContext('2d'),gg=x.createRadialGradient(32,32,0,32,32,32);gg.addColorStop(0,'#fff');gg.addColorStop(.3,'rgba(255,255,255,.5)');gg.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gg;x.fillRect(0,0,64,64);const GT=new T.CanvasTexture(cv);
const cc=document.createElement('canvas');cc.width=cc.height=512;const g2=cc.getContext('2d');g2.translate(256,256);g2.strokeStyle=g2.fillStyle='#fff';g2.lineWidth=5;
[250,230,150].forEach(r=>{g2.beginPath();g2.arc(0,0,r,0,7);g2.stroke()});
for(let k=0;k<2;k++){g2.beginPath();for(let i=0;i<=3;i++){const a=i*2.0944+k*PI/3-1.57;g2.lineTo(Math.cos(a)*230,Math.sin(a)*230)}g2.stroke()}
for(let i=0;i<48;i++){g2.rotate(PI/24);g2.fillRect(-3,-245,6,i%2?14:30)}
const CT=new T.CanvasTexture(cc),FX=new T.Group();FX.visible=false;S.add(FX);
const orb=new T.Group(),oc=new T.Mesh(sph(1),ad(0xffffff)),osl=new T.Mesh(sph(1.3),ad(0xaa55ff,.5)),og=new T.Sprite(new T.SpriteMaterial({map:GT,blending:T.AdditiveBlending,depthWrite:false,fog:false}));og.scale.setScalar(5);orb.add(oc,osl,og);FX.add(orb);
const PL=new T.PointLight(0xaa66ff,0,40);FX.add(PL);
const mk2=c=>{const m=new T.Mesh(new T.PlaneGeometry(1,1),ad(c,.9,CT));m.rotation.x=-PI/2;FX.add(m);return m},mc1=mk2(0xb070ff),mc2=mk2(0x55ddff);
const pil=new T.Mesh(new T.CylinderGeometry(1.4,1.4,40,32,1,true),ad(0xaa66ff,0));FX.add(pil);
const BM=new T.Group(),LN=90,RG=[];FX.add(BM);
[[.3,.9,0xffffff,1],[.6,1.7,0x55ddff,.6],[1.1,3,0xb040ff,.35]].forEach(([a,b,c,o])=>{const g=new T.CylinderGeometry(b,a,LN,28,1,true);g.rotateX(PI/2);g.translate(0,0,LN/2);BM.add(new T.Mesh(g,ad(c,o)))});
for(let i=0;i<14;i++){const m=new T.Mesh(new T.TorusGeometry(1,.07,8,36),ad(i%2?0x88eeff:0xffaaff,.8));BM.add(m);RG.push(m)}
const SW=[0,1].map(()=>{const g=new T.RingGeometry(.9,1,64);g.rotateX(-PI/2);const m=new T.Mesh(g,ad(0xffffff,.9));m.visible=false;FX.add(m);return m});
const EX=new T.Mesh(sph(1),ad(0xffcc88,.85)),EL=new T.PointLight(0xffaa66,0,200);EX.scale.setScalar(.01);FX.add(EX,EL);
const pt=(n,sz,c)=>{const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(new Float32Array(n*3),3));const p=new T.Points(g,new T.PointsMaterial({map:GT,size:sz,color:c,transparent:true,blending:T.AdditiveBlending,depthWrite:false,fog:false}));p.frustumCulled=false;FX.add(p);return p};
const PC=pt(500,.35,0xcc99ff),PS=pt(350,.5,0xffddaa),pd=[...Array(500)].map(()=>({a:rnd()*7,h:rnd()*6,o:rnd(),v:.15+rnd()*.25})),sd=[...Array(350)].map(()=>({z:rnd()*85,x:(rnd()-.5)*5,y:rnd()*8,s:2+rnd()*5}));
const LG=[...Array(5)].map(()=>{const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(new Float32Array(42),3));const l=new T.Line(g,new T.LineBasicMaterial({color:0xccddff,blending:T.AdditiveBlending,transparent:true,depthWrite:false,fog:false}));l.frustumCulled=false;FX.add(l);return l});
const hp=new V3(),op=new V3(),fw=new V3();
function ultGo(){if(U.on)return;au();U.on=true;U.t=0;U.f={};run=cr=pr=false;sync();laugh()}
function endUlt(){U.on=false;FX.visible=false;S.background.copy(bgA);S.fog.color.copy(bgA);hemi.intensity=1.1;$('fl').style.opacity=0;PL.intensity=0;EL.intensity=0;sync()}
function fx(dt,ch){
 const t=U.t,at=t>=15,k=at?t-15:0,sf=at?cl(20-t,0,1):ch;
 FX.visible=true;root.updateMatrixWorld(true);A[1].hd.getWorldPosition(hp);fw.set(Math.sin(psi),0,Math.cos(psi));
 if(at)op.copy(hp).addScaledVector(fw,.45);else op.copy(hp).setY(hp.y+.25+ch*.9);
 const rad=at?1.3*cl((5-k)/.6,0,1):.08+Math.pow(ch,1.6)*1.2,hue=(.76-ch*.25)%1;
 orb.position.copy(op);orb.scale.setScalar(rad*(1+Math.sin(tm*30)*.06)+.001);osl.material.color.setHSL(hue,1,.6);og.material.color.setHSL(hue,1,.65);
 PL.position.copy(op);PL.color.setHSL(hue,1,.6);PL.intensity=ch*20+(at?50*sf:0);
 const sz=3+ch*10;mc1.visible=mc2.visible=t>=3.8;mc1.position.set(pos.x,.04,pos.z);mc2.position.set(pos.x,.05,pos.z);mc1.scale.setScalar(sz*sf+.01);mc2.scale.setScalar(sz*1.4*sf+.01);mc1.rotation.z=tm*.6;mc2.rotation.z=-tm*.9;
 pil.position.set(pos.x,20,pos.z);pil.material.opacity=sf*.25;
 S.background.copy(bgA).lerp(bgB,sf*.85);S.fog.color.copy(S.background);hemi.intensity=1.1-sf*.8;
 if(t>13.4&&!U.f.w){U.f.w=1;whisper()}if(t>=15&&!U.f.b){U.f.b=1;boom()}
 const pp=PC.geometry.attributes.position;PC.visible=ch>.02;
 for(let i=0;i<500;i++){const d=pd[i],q=(d.o+tm*d.v)%1,r=(1-q)*(2+7*Math.min(1,ch*2)),an=d.a+q*8;pp.setXYZ(i,op.x+Math.cos(an)*r,op.y+(d.h-3)*(1-q),op.z+Math.sin(an)*r)}pp.needsUpdate=true;
 lt-=dt;LG.forEach(l=>l.visible=ch>.3);
 if(lt<=0&&ch>.3){lt=.07;LG.forEach(l=>{const p=l.geometry.attributes.position,ex=pos.x+(rnd()-.5)*18,ez=pos.z+(rnd()-.5)*18;for(let i=0;i<14;i++){const q=i/13,j=Math.sin(q*PI)*.9;p.setXYZ(i,op.x+(ex-op.x)*q+(rnd()-.5)*j,op.y*(1-q)+(rnd()-.5)*j,op.z+(ez-op.z)*q+(rnd()-.5)*j)}p.needsUpdate=true})}
 BM.visible=PS.visible=at;
 if(at){const g=cl(k/.35,0,1)*cl((5-k)/.7,0,1),pu=1+Math.sin(tm*45)*.07;BM.position.copy(op);BM.rotation.y=psi;BM.scale.set(g*pu,g*pu,1);
  RG.forEach((m,i)=>{const z=(tm*48+i*LN/14)%LN;m.position.z=z;m.scale.setScalar(1.3+z*.035)});
  const ps=PS.geometry.attributes.position;for(let i=0;i<350;i++){const d=sd[i];d.y+=dt*d.s;if(d.y>9){d.y=0;d.z=rnd()*85;d.x=(rnd()-.5)*5}ps.setXYZ(i,op.x+fw.x*d.z+Math.cos(psi)*d.x,op.y+d.y-1,op.z+fw.z*d.z-Math.sin(psi)*d.x)}ps.needsUpdate=true;
  SW.forEach((m,i)=>{const e=k-i*.4;m.visible=e>0&&e<1.8;m.position.set(pos.x,.1,pos.z);m.scale.setScalar(1+Math.max(e,0)*40);m.material.opacity=.9*cl(1-e/1.8,0,1)});
  const e=cl((k-.5)/1.6,0,1),f=cl((5-k)/1.2,0,1);EX.position.set(pos.x+fw.x*78,2,pos.z+fw.z*78);EX.scale.setScalar(.01+e*22);EX.material.opacity=.85*f;EL.position.copy(EX.position);EL.intensity=e*150*f;
  $('fl').style.opacity=cl(1-k/.5,0,1)}
 return sf*.025+(at?.13*cl(1-k/5,0,1):0)}
// ---------- ACTUALIZAR ----------
function update(dt){
 tm+=dt;uT.value=tm;let ch=0;if(U.on){U.t+=dt;ch=cl((U.t-3.8)/11.2,0,1)}
 const kx=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0),ky=(K.KeyS||K.ArrowDown?1:0)-(K.KeyW||K.ArrowUp?1:0);
 const ix=cl(jx+kx,-1,1),iy=cl(jy+ky,-1,1),mag=Math.min(1,Math.hypot(ix,iy)),lock=U.on||pr;
 const spd=cr?1.3:(run||K.ShiftLeft)?5.4:2.3,dx=-Math.sin(cy)*iy-Math.cos(cy)*ix,dz=-Math.cos(cy)*iy+Math.sin(cy)*ix,dl=Math.hypot(dx,dz)||1,kv=1-Math.exp(-dt*8);
 vel.x+=((lock?0:dx/dl*spd*mag)-vel.x)*kv;vel.z+=((lock?0:dz/dl*spd*mag)-vel.z)*kv;
 pos.x=cl(pos.x+vel.x*dt,-58,58);pos.z=cl(pos.z+vel.z*dt,-58,58);
 const hs=Math.hypot(vel.x,vel.z);let ta=hs>.3?Math.atan2(vel.x,vel.z):psi;if(U.on)ta=cy;
 psi+=(((ta-psi+PI)%(2*PI)+2*PI)%(2*PI)-PI)*(1-Math.exp(-dt*(U.on?6:12)));
 if(jr){jr=false;if(pr)pr=false;else{cr=false;if(gnd&&!U.on){vy=6.2;gnd=false}}sync()}
 if(!gnd){vy-=17*dt;py+=vy*dt;if(py<=0){py=0;if(vy<-3)land=.6;vy=0;gnd=true}}
 land*=Math.exp(-dt*5);
 const cT=pr?0:Math.max(cr?1:0,land,U.on?(U.t<3.8?0:.4):0);cA+=(cT-cA)*(1-Math.exp(-dt*9));pA+=((pr?1:0)-pA)*(1-Math.exp(-dt*2.6));
 ph+=dt*hs*(hs>3.5?2.1:hs>1.8?3.1:3.9);
 const w=Math.min(hs/2.3,1),r=cl((hs-2.5)/2.5,0,1),a=w*.5+r*.5,s=Math.sin(ph),c=Math.cos(ph),kb=(.3+r*.9)*w,lean=r*.3+w*(1-r)*.07+.35*cA;
 tg.t0=s*a-1.1*cA;tg.t1=-s*a-1.1*cA;tg.k0=Math.max(0,-c)*kb+1.9*cA;tg.k1=Math.max(0,c)*kb+1.9*cA;
 tg.a0=-s*a*.9-.3*cA;tg.a1=s*a*.9-.3*cA;tg.f0=tg.f1=-(.12+r*1+.3*cA);tg.z0=tg.z1=.1;tg.sp=.03+.12*cA;
 tg.tx=lean;tg.ty=s*.18*r;tg.hx=-lean*.6+Math.sin(tm*1.2)*.03;tg.by=-.29*cA+.24*pA+Math.abs(c)*.035*w*(1-cA);tg.br=-PI/2*pA;tg.bz=.85*pA;
 if(!gnd){const u=vy>0;tg.t0=-.8;tg.t1=-.25;tg.k0=1.2;tg.k1=.5;tg.a0=tg.a1=u?-2.5:-1.3;tg.z0=tg.z1=u?.3:.9;tg.f0=tg.f1=-.2;tg.tx=.1;tg.by=0}
 if(pr){tg.t0=tg.t1=0;tg.k0=tg.k1=.1;tg.a0=tg.a1=0;tg.z0=tg.z1=.15;tg.tx=tg.ty=tg.hx=0}
 if(U.on){const t=U.t,sh=Math.sin(tm*28);
  if(t<3.8){tg.hx=-.6;tg.tx=-.22+sh*.06;tg.a0=tg.a1=-.4;tg.z0=tg.z1=.5;tg.f0=tg.f1=-.8;tg.t0=tg.t1=0;tg.k0=tg.k1=0;tg.ty=Math.sin(tm*14)*.2;tg.by=sh*.02}
  else{tg.a1=t<15?-2.4:-1.57;tg.f1=-.1;tg.z1=.15;tg.a0=.5;tg.z0=.45;tg.f0=-.5;tg.sp=.22;tg.tx=t<15?.05:-.12;tg.hx=0;tg.ty=0;tg.by+=Math.sin(tm*40)*.012*ch}}
 const kk=1-Math.exp(-dt*16);for(const k in tg)cur[k]+=(tg[k]-cur[k])*kk;
 L.forEach((l,i)=>{l.th.rotation.x=cur['t'+i];l.th.rotation.z=l.s*cur.sp;l.kn.rotation.x=cur['k'+i]});
 A.forEach((q,i)=>{q.sh.rotation.x=cur['a'+i];q.sh.rotation.z=q.s*cur['z'+i];q.el.rotation.x=cur['f'+i]});
 tor.rotation.x=cur.tx;tor.rotation.y=cur.ty;head.rotation.x=cur.hx;tor.scale.y=1+Math.sin(tm*2)*.01;body.position.set(0,cur.by,cur.bz);body.rotation.x=cur.br;
 // ropa y pelo con resortes
 const sn=Math.sin(psi),cs=Math.cos(psi),fv=vel.x*sn+vel.z*cs,lv=vel.x*cs-vel.z*sn,ws=U.on?ch:0;
 hem.rotation.x=sp(st.h,fv*.08-cur.tx*.6+(gnd?0:.25)+Math.sin(tm*2)*.02+ws*Math.sin(tm*19)*.3,dt);
 hem.rotation.z=sp(st.hz,lv*.06+ws*Math.sin(tm*23)*.2,dt);
 hood.rotation.x=sp(st.hd,fv*.06+ws*Math.sin(tm*17)*.2,dt);
 fr.rotation.x=sp(st.f,-fv*.1+vy*.03+ws*Math.sin(tm*21)*.25,dt);ts.rotation.x=sp(st.t,-fv*.12+vy*.03+ws*Math.sin(tm*25)*.3,dt);
 root.position.set(pos.x,py,pos.z);root.rotation.y=psi;
 let shake=0;if(U.on){shake=fx(dt,ch);if(U.t>=20)endUlt()}
 const tgY=1.2-.35*cA-.75*pA,d=4.6+(U.on&&U.t>=15?2:0)+pA,cpv=Math.cos(pch);
 C.position.set(pos.x-Math.sin(cy)*cpv*d+(rnd()-.5)*shake,Math.max(.25,py+tgY+Math.sin(pch)*d+(rnd()-.5)*shake),pos.z-Math.cos(cy)*cpv*d+(rnd()-.5)*shake);C.lookAt(pos.x,py+tgY,pos.z);
 const tf=U.on?(U.t>=15?78:60+ch*8):60;C.fov+=(tf-C.fov)*(1-Math.exp(-dt*5));C.updateProjectionMatrix();
 sun.position.set(pos.x+20,40,pos.z+10);sun.target.position.set(pos.x,0,pos.z);
}
let last=performance.now();
(function loop(n){requestAnimationFrame(loop);const dt=Math.min((n-last)/1000,.05);last=n;update(dt);R.render(S,C)})(last);
  
