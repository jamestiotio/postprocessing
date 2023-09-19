"use strict";(()=>{var le=Math.pow;var E=(a=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(a,{get:(e,t)=>(typeof require!="undefined"?require:e)[t]}):a)(function(a){if(typeof require!="undefined")return require.apply(this,arguments);throw Error('Dynamic require of "'+a+'" is not supported')});var C=E("three");var d=E("three");var ue="varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}";var N=E("three");var l={SKIP:9,SET:30,ADD:0,ALPHA:1,AVERAGE:2,COLOR:3,COLOR_BURN:4,COLOR_DODGE:5,DARKEN:6,DIFFERENCE:7,DIVIDE:8,DST:9,EXCLUSION:10,HARD_LIGHT:11,HARD_MIX:12,HUE:13,INVERT:14,INVERT_RGB:15,LIGHTEN:16,LINEAR_BURN:17,LINEAR_DODGE:18,LINEAR_LIGHT:19,LUMINOSITY:20,MULTIPLY:21,NEGATION:22,NORMAL:23,OVERLAY:24,PIN_LIGHT:25,REFLECT:26,SATURATION:27,SCREEN:28,SOFT_LIGHT:29,SRC:30,SUBTRACT:31,VIVID_LIGHT:32};var X="",M="srgb",L="srgb-linear";var w={NONE:0,DEPTH:1,CONVOLUTION:2};var u={FRAGMENT_HEAD:"FRAGMENT_HEAD",FRAGMENT_MAIN_UV:"FRAGMENT_MAIN_UV",FRAGMENT_MAIN_IMAGE:"FRAGMENT_MAIN_IMAGE",VERTEX_HEAD:"VERTEX_HEAD",VERTEX_MAIN_SUPPORT:"VERTEX_MAIN_SUPPORT"};var fe=Number(N.REVISION.replace(/\D+/g,"")),he=fe>=152,nt=new Map([[N.LinearEncoding,L],[N.sRGBEncoding,M]]),ot=new Map([[L,N.LinearEncoding],[M,N.sRGBEncoding]]);function z(a){return a===null?null:he?a.outputColorSpace:nt.get(a.outputEncoding)}function O(a,e){a!==null&&(he?a.colorSpace=e:a.encoding=ot.get(e))}function $(a){return fe<154?a.replace("colorspace_fragment","encodings_fragment"):a}var P=E("three");var de=`#include <common>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
uniform float opacity;varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);gl_FragColor=opacity*texel;
#include <colorspace_fragment>
#include <dithering_fragment>
}`;var Q=class extends P.ShaderMaterial{constructor(){super({name:"CopyMaterial",uniforms:{inputBuffer:new P.Uniform(null),opacity:new P.Uniform(1)},blending:P.NoBlending,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:de,vertexShader:ue}),this.fragmentShader=$(this.fragmentShader)}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.uniforms.inputBuffer.value=e}getOpacity(e){return this.uniforms.opacity.value}setOpacity(e){this.uniforms.opacity.value=e}};var p=E("three");var pe=`#include <common>
#include <packing>
#include <dithering_pars_fragment>
#define packFloatToRGBA(v) packDepthToRGBA(v)
#define unpackRGBAToFloat(v) unpackRGBAToDepth(v)
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#if DEPTH_PACKING == 3201
uniform lowp sampler2D depthBuffer;
#elif defined(GL_FRAGMENT_PRECISION_HIGH)
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;
#if THREE_REVISION < 143
#define luminance(v) linearToRelativeLuminance(v)
#endif
#if THREE_REVISION >= 137
vec4 sRGBToLinear(const in vec4 value){return vec4(mix(pow(value.rgb*0.9478672986+vec3(0.0521327014),vec3(2.4)),value.rgb*0.0773993808,vec3(lessThanEqual(value.rgb,vec3(0.04045)))),value.a);}
#endif
float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}float getViewZ(const in float depth){
#ifdef PERSPECTIVE_CAMERA
return perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
#else
return orthographicDepthToViewZ(depth,cameraNear,cameraFar);
#endif
}vec3 RGBToHCV(const in vec3 RGB){vec4 P=mix(vec4(RGB.bg,-1.0,2.0/3.0),vec4(RGB.gb,0.0,-1.0/3.0),step(RGB.b,RGB.g));vec4 Q=mix(vec4(P.xyw,RGB.r),vec4(RGB.r,P.yzx),step(P.x,RGB.r));float C=Q.x-min(Q.w,Q.y);float H=abs((Q.w-Q.y)/(6.0*C+EPSILON)+Q.z);return vec3(H,C,Q.x);}vec3 RGBToHSL(const in vec3 RGB){vec3 HCV=RGBToHCV(RGB);float L=HCV.z-HCV.y*0.5;float S=HCV.y/(1.0-abs(L*2.0-1.0)+EPSILON);return vec3(HCV.x,S,L);}vec3 HueToRGB(const in float H){float R=abs(H*6.0-3.0)-1.0;float G=2.0-abs(H*6.0-2.0);float B=2.0-abs(H*6.0-4.0);return clamp(vec3(R,G,B),0.0,1.0);}vec3 HSLToRGB(const in vec3 HSL){vec3 RGB=HueToRGB(HSL.x);float C=(1.0-abs(2.0*HSL.z-1.0))*HSL.y;return(RGB-0.5)*C+HSL.z;}FRAGMENT_HEAD void main(){FRAGMENT_MAIN_UV vec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGE gl_FragColor=color0;
#ifdef ENCODE_OUTPUT
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
}`;var me="uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}";var K=class extends p.ShaderMaterial{constructor(e,t,i,s,n=!1){super({name:"EffectMaterial",defines:{THREE_REVISION:p.REVISION.replace(/\D+/g,""),DEPTH_PACKING:"0",ENCODE_OUTPUT:"1"},uniforms:{inputBuffer:new p.Uniform(null),depthBuffer:new p.Uniform(null),resolution:new p.Uniform(new p.Vector2),texelSize:new p.Uniform(new p.Vector2),cameraNear:new p.Uniform(.3),cameraFar:new p.Uniform(1e3),aspect:new p.Uniform(1),time:new p.Uniform(0)},blending:p.NoBlending,toneMapped:!1,depthWrite:!1,depthTest:!1,dithering:n}),e&&this.setShaderParts(e),t&&this.setDefines(t),i&&this.setUniforms(i),this.copyCameraSettings(s)}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.uniforms.inputBuffer.value=e}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(e){this.uniforms.depthBuffer.value=e}get depthPacking(){return Number(this.defines.DEPTH_PACKING)}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}setDepthBuffer(e,t=p.BasicDepthPacking){this.depthBuffer=e,this.depthPacking=t}setShaderData(e){this.setShaderParts(e.shaderParts),this.setDefines(e.defines),this.setUniforms(e.uniforms),this.setExtensions(e.extensions)}setShaderParts(e){return this.fragmentShader=pe.replace(u.FRAGMENT_HEAD,e.get(u.FRAGMENT_HEAD)||"").replace(u.FRAGMENT_MAIN_UV,e.get(u.FRAGMENT_MAIN_UV)||"").replace(u.FRAGMENT_MAIN_IMAGE,e.get(u.FRAGMENT_MAIN_IMAGE)||""),this.vertexShader=me.replace(u.VERTEX_HEAD,e.get(u.VERTEX_HEAD)||"").replace(u.VERTEX_MAIN_SUPPORT,e.get(u.VERTEX_MAIN_SUPPORT)||""),this.fragmentShader=$(this.fragmentShader),this.needsUpdate=!0,this}setDefines(e){for(let t of e.entries())this.defines[t[0]]=t[1];return this.needsUpdate=!0,this}setUniforms(e){for(let t of e.entries())this.uniforms[t[0]]=t[1];return this}setExtensions(e){this.extensions={};for(let t of e)this.extensions[t]=!0;return this}get encodeOutput(){return this.defines.ENCODE_OUTPUT!==void 0}set encodeOutput(e){this.encodeOutput!==e&&(e?this.defines.ENCODE_OUTPUT="1":delete this.defines.ENCODE_OUTPUT,this.needsUpdate=!0)}isOutputEncodingEnabled(e){return this.encodeOutput}setOutputEncodingEnabled(e){this.encodeOutput=e}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}setDeltaTime(e){this.uniforms.time.value+=e}adoptCameraSettings(e){this.copyCameraSettings(e)}copyCameraSettings(e){e&&(this.uniforms.cameraNear.value=e.near,this.uniforms.cameraFar.value=e.far,e instanceof p.PerspectiveCamera?this.defines.PERSPECTIVE_CAMERA="1":delete this.defines.PERSPECTIVE_CAMERA,this.needsUpdate=!0)}setSize(e,t){let i=this.uniforms;i.resolution.value.set(e,t),i.texelSize.value.set(1/e,1/t),i.aspect.value=e/t}static get Section(){return u}};var G=E("three");var m=E("three"),ut=new m.Camera,I=null;function ft(){if(I===null){let a=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),e=new Float32Array([0,0,2,0,0,2]);I=new m.BufferGeometry,I.setAttribute!==void 0?(I.setAttribute("position",new m.BufferAttribute(a,3)),I.setAttribute("uv",new m.BufferAttribute(e,2))):(I.addAttribute("position",new m.BufferAttribute(a,3)),I.addAttribute("uv",new m.BufferAttribute(e,2)))}return I}var y=class a{constructor(e="Pass",t=new m.Scene,i=ut){this.name=e,this.renderer=null,this.scene=t,this.camera=i,this.screen=null,this.rtt=!0,this.needsSwap=!0,this.needsDepthTexture=!1,this.enabled=!0}get renderToScreen(){return!this.rtt}set renderToScreen(e){if(this.rtt===e){let t=this.fullscreenMaterial;t!==null&&(t.needsUpdate=!0),this.rtt=!e}}set mainScene(e){}set mainCamera(e){}setRenderer(e){this.renderer=e}isEnabled(){return this.enabled}setEnabled(e){this.enabled=e}get fullscreenMaterial(){return this.screen!==null?this.screen.material:null}set fullscreenMaterial(e){let t=this.screen;t!==null?t.material=e:(t=new m.Mesh(ft(),e),t.frustumCulled=!1,this.scene===null&&(this.scene=new m.Scene),this.scene.add(t),this.screen=t)}getFullscreenMaterial(){return this.fullscreenMaterial}setFullscreenMaterial(e){this.fullscreenMaterial=e}getDepthTexture(){return null}setDepthTexture(e,t=m.BasicDepthPacking){}render(e,t,i,s,n){throw new Error("Render method not implemented!")}setSize(e,t){}initialize(e,t,i){}dispose(){for(let e of Object.keys(this)){let t=this[e];(t instanceof m.WebGLRenderTarget||t instanceof m.Material||t instanceof m.Texture||t instanceof a)&&this[e].dispose()}}};var j=class extends y{constructor(e,t=!0){super("CopyPass"),this.fullscreenMaterial=new Q,this.needsSwap=!1,this.renderTarget=e,e===void 0&&(this.renderTarget=new G.WebGLRenderTarget(1,1,{minFilter:G.LinearFilter,magFilter:G.LinearFilter,stencilBuffer:!1,depthBuffer:!1}),this.renderTarget.texture.name="CopyPass.Target"),this.autoResize=t}get resize(){return this.autoResize}set resize(e){this.autoResize=e}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}setAutoResizeEnabled(e){this.autoResize=e}render(e,t,i,s,n){this.fullscreenMaterial.inputBuffer=t.texture,e.setRenderTarget(this.renderToScreen?null:this.renderTarget),e.render(this.scene,this.camera)}setSize(e,t){this.autoResize&&this.renderTarget.setSize(e,t)}initialize(e,t,i){i!==void 0&&(this.renderTarget.texture.type=i,i!==G.UnsignedByteType?this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1":z(e)===M&&O(this.renderTarget.texture,M))}};var q=class extends y{constructor(){super("ClearMaskPass",null,null),this.needsSwap=!1}render(e,t,i,s,n){let r=e.state.buffers.stencil;r.setLocked(!1),r.setTest(!1)}};var xe=E("three");var ge=new xe.Color,H=class extends y{constructor(e=!0,t=!0,i=!1){super("ClearPass",null,null),this.needsSwap=!1,this.color=e,this.depth=t,this.stencil=i,this.overrideClearColor=null,this.overrideClearAlpha=-1}setClearFlags(e,t,i){this.color=e,this.depth=t,this.stencil=i}getOverrideClearColor(){return this.overrideClearColor}setOverrideClearColor(e){this.overrideClearColor=e}getOverrideClearAlpha(){return this.overrideClearAlpha}setOverrideClearAlpha(e){this.overrideClearAlpha=e}render(e,t,i,s,n){let r=this.overrideClearColor,o=this.overrideClearAlpha,c=e.getClearAlpha(),h=r!==null,f=o>=0;h?(e.getClearColor(ge),e.setClearColor(r,f?o:c)):f&&e.setClearAlpha(o),e.setRenderTarget(this.renderToScreen?null:t),e.clear(this.color,this.depth,this.stencil),h?e.setClearColor(ge,c):f&&e.setClearAlpha(c)}};var W=class extends y{constructor(e,t,i=null){super("RenderPass",e,t),this.needsSwap=!1,this.clearPass=new H,this.overrideMaterialManager=i===null?null:new k(i),this.ignoreBackground=!1,this.skipShadowMapUpdate=!1,this.selection=null}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get renderToScreen(){return super.renderToScreen}set renderToScreen(e){super.renderToScreen=e,this.clearPass.renderToScreen=e}get overrideMaterial(){let e=this.overrideMaterialManager;return e!==null?e.material:null}set overrideMaterial(e){let t=this.overrideMaterialManager;e!==null?t!==null?t.setMaterial(e):this.overrideMaterialManager=new k(e):t!==null&&(t.dispose(),this.overrideMaterialManager=null)}getOverrideMaterial(){return this.overrideMaterial}setOverrideMaterial(e){this.overrideMaterial=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getSelection(){return this.selection}setSelection(e){this.selection=e}isBackgroundDisabled(){return this.ignoreBackground}setBackgroundDisabled(e){this.ignoreBackground=e}isShadowMapDisabled(){return this.skipShadowMapUpdate}setShadowMapDisabled(e){this.skipShadowMapUpdate=e}getClearPass(){return this.clearPass}render(e,t,i,s,n){let r=this.scene,o=this.camera,c=this.selection,h=o.layers.mask,f=r.background,R=e.shadowMap.autoUpdate,x=this.renderToScreen?null:t;c!==null&&o.layers.set(c.getLayer()),this.skipShadowMapUpdate&&(e.shadowMap.autoUpdate=!1),(this.ignoreBackground||this.clearPass.overrideClearColor!==null)&&(r.background=null),this.clearPass.enabled&&this.clearPass.render(e,t),e.setRenderTarget(x),this.overrideMaterialManager!==null?this.overrideMaterialManager.render(e,r,o):e.render(r,o),o.layers.mask=h,r.background=f,e.shadowMap.autoUpdate=R}};var Z=E("three");function ve(a,e,t){for(let i of e){let s="$1"+a+i.charAt(0).toUpperCase()+i.slice(1),n=new RegExp("([^\\.])(\\b"+i+"\\b)","g");for(let r of t.entries())r[1]!==null&&t.set(r[0],r[1].replace(n,s))}}function ht(a,e,t){let i=e.getFragmentShader(),s=e.getVertexShader(),n=i!==void 0&&/mainImage/.test(i),r=i!==void 0&&/mainUv/.test(i);if(t.attributes|=e.getAttributes(),i===void 0)throw new Error(`Missing fragment shader (${e.name})`);if(r&&t.attributes&w.CONVOLUTION)throw new Error(`Effects that transform UVs are incompatible with convolution effects (${e.name})`);if(!n&&!r)throw new Error(`Could not find mainImage or mainUv function (${e.name})`);{let o=/\w+\s+(\w+)\([\w\s,]*\)\s*{/g,c=t.shaderParts,h=c.get(u.FRAGMENT_HEAD)||"",f=c.get(u.FRAGMENT_MAIN_UV)||"",R=c.get(u.FRAGMENT_MAIN_IMAGE)||"",x=c.get(u.VERTEX_HEAD)||"",A=c.get(u.VERTEX_MAIN_SUPPORT)||"",B=new Set,S=new Set;if(r&&(f+=`	${a}MainUv(UV);
`,t.uvTransformation=!0),s!==null&&/mainSupport/.test(s)){let v=/mainSupport *\([\w\s]*?uv\s*?\)/.test(s);A+=`	${a}MainSupport(`,A+=v?`vUv);
`:`);
`;for(let T of s.matchAll(/(?:varying\s+\w+\s+([\S\s]*?);)/g))for(let ae of T[1].split(/\s*,\s*/))t.varyings.add(ae),B.add(ae),S.add(ae);for(let T of s.matchAll(o))S.add(T[1])}for(let v of i.matchAll(o))S.add(v[1]);for(let v of e.defines.keys())S.add(v.replace(/\([\w\s,]*\)/g,""));for(let v of e.uniforms.keys())S.add(v);S.delete("while"),S.delete("for"),S.delete("if"),e.uniforms.forEach((v,T)=>t.uniforms.set(a+T.charAt(0).toUpperCase()+T.slice(1),v)),e.defines.forEach((v,T)=>t.defines.set(a+T.charAt(0).toUpperCase()+T.slice(1),v));let U=new Map([["fragment",i],["vertex",s]]);ve(a,S,t.defines),ve(a,S,U),i=U.get("fragment"),s=U.get("vertex");let D=e.blendMode;if(t.blendModes.set(D.blendFunction,D),n){e.inputColorSpace!==null&&e.inputColorSpace!==t.colorSpace&&(R+=e.inputColorSpace===M?`color0 = LinearTosRGB(color0);
	`:`color0 = sRGBToLinear(color0);
	`),e.outputColorSpace!==X?t.colorSpace=e.outputColorSpace:e.inputColorSpace!==null&&(t.colorSpace=e.inputColorSpace);let v=/MainImage *\([\w\s,]*?depth[\w\s,]*?\)/;R+=`${a}MainImage(color0, UV, `,t.attributes&w.DEPTH&&v.test(i)&&(R+="depth, ",t.readDepth=!0),R+=`color1);
	`;let T=a+"BlendOpacity";t.uniforms.set(T,D.opacity),R+=`color0 = blend${D.blendFunction}(color0, color1, ${T});

	`,h+=`uniform float ${T};

`}if(h+=i+`
`,s!==null&&(x+=s+`
`),c.set(u.FRAGMENT_HEAD,h),c.set(u.FRAGMENT_MAIN_UV,f),c.set(u.FRAGMENT_MAIN_IMAGE,R),c.set(u.VERTEX_HEAD,x),c.set(u.VERTEX_MAIN_SUPPORT,A),e.extensions!==null)for(let v of e.extensions)t.extensions.add(v)}}var Y=class extends y{constructor(e,...t){super("EffectPass"),this.fullscreenMaterial=new K(null,null,null,e),this.listener=i=>this.handleEvent(i),this.effects=[],this.setEffects(t),this.skipRendering=!1,this.minTime=1,this.maxTime=Number.POSITIVE_INFINITY,this.timeScale=1}set mainScene(e){for(let t of this.effects)t.mainScene=e}set mainCamera(e){this.fullscreenMaterial.copyCameraSettings(e);for(let t of this.effects)t.mainCamera=e}get encodeOutput(){return this.fullscreenMaterial.encodeOutput}set encodeOutput(e){this.fullscreenMaterial.encodeOutput=e}get dithering(){return this.fullscreenMaterial.dithering}set dithering(e){let t=this.fullscreenMaterial;t.dithering=e,t.needsUpdate=!0}setEffects(e){for(let t of this.effects)t.removeEventListener("change",this.listener);this.effects=e.sort((t,i)=>i.attributes-t.attributes);for(let t of this.effects)t.addEventListener("change",this.listener)}updateMaterial(){let e=new J,t=0;for(let o of this.effects)if(o.blendMode.blendFunction===l.DST)e.attributes|=o.getAttributes()&w.DEPTH;else{if(e.attributes&o.getAttributes()&w.CONVOLUTION)throw new Error(`Convolution effects cannot be merged (${o.name})`);ht("e"+t++,o,e)}let i=e.shaderParts.get(u.FRAGMENT_HEAD),s=e.shaderParts.get(u.FRAGMENT_MAIN_IMAGE),n=e.shaderParts.get(u.FRAGMENT_MAIN_UV),r=/\bblend\b/g;for(let o of e.blendModes.values())i+=o.getShaderCode().replace(r,`blend${o.blendFunction}`)+`
`;e.attributes&w.DEPTH?(e.readDepth&&(s=`float depth = readDepth(UV);

	`+s),this.needsDepthTexture=this.getDepthTexture()===null):this.needsDepthTexture=!1,e.colorSpace===M&&(s+=`color0 = sRGBToLinear(color0);
	`),e.uvTransformation?(n=`vec2 transformedUv = vUv;
`+n,e.defines.set("UV","transformedUv")):e.defines.set("UV","vUv"),e.shaderParts.set(u.FRAGMENT_HEAD,i),e.shaderParts.set(u.FRAGMENT_MAIN_IMAGE,s),e.shaderParts.set(u.FRAGMENT_MAIN_UV,n);for(let[o,c]of e.shaderParts)c!==null&&e.shaderParts.set(o,c.trim().replace(/^#/,`
#`));this.skipRendering=t===0,this.needsSwap=!this.skipRendering,this.fullscreenMaterial.setShaderData(e)}recompile(){this.updateMaterial()}getDepthTexture(){return this.fullscreenMaterial.depthBuffer}setDepthTexture(e,t=Z.BasicDepthPacking){this.fullscreenMaterial.depthBuffer=e,this.fullscreenMaterial.depthPacking=t;for(let i of this.effects)i.setDepthTexture(e,t)}render(e,t,i,s,n){for(let r of this.effects)r.update(e,t,s);if(!this.skipRendering||this.renderToScreen){let r=this.fullscreenMaterial;r.inputBuffer=t.texture,r.time+=s*this.timeScale,e.setRenderTarget(this.renderToScreen?null:i),e.render(this.scene,this.camera)}}setSize(e,t){this.fullscreenMaterial.setSize(e,t);for(let i of this.effects)i.setSize(e,t)}initialize(e,t,i){this.renderer=e;for(let s of this.effects)s.initialize(e,t,i);this.updateMaterial(),i!==void 0&&i!==Z.UnsignedByteType&&(this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}dispose(){super.dispose();for(let e of this.effects)e.removeEventListener("change",this.listener),e.dispose()}handleEvent(e){switch(e.type){case"change":this.recompile();break}}};var ee=class extends y{constructor(e,t){super("MaskPass",e,t),this.needsSwap=!1,this.clearPass=new H(!1,!1,!0),this.inverse=!1}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get inverted(){return this.inverse}set inverted(e){this.inverse=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getClearPass(){return this.clearPass}isInverted(){return this.inverted}setInverted(e){this.inverted=e}render(e,t,i,s,n){let r=e.getContext(),o=e.state.buffers,c=this.scene,h=this.camera,f=this.clearPass,R=this.inverted?0:1,x=1-R;o.color.setMask(!1),o.depth.setMask(!1),o.color.setLocked(!0),o.depth.setLocked(!0),o.stencil.setTest(!0),o.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),o.stencil.setFunc(r.ALWAYS,R,4294967295),o.stencil.setClear(x),o.stencil.setLocked(!0),this.clearPass.enabled&&(this.renderToScreen?f.render(e,null):(f.render(e,t),f.render(e,i))),this.renderToScreen?(e.setRenderTarget(null),e.render(c,h)):(e.setRenderTarget(t),e.render(c,h),e.setRenderTarget(i),e.render(c,h)),o.color.setLocked(!1),o.depth.setLocked(!1),o.stencil.setLocked(!1),o.stencil.setFunc(r.EQUAL,1,4294967295),o.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),o.stencil.setLocked(!0)}};var te=class{constructor(){this.startTime=performance.now(),this.previousTime=0,this.currentTime=0,this._delta=0,this._elapsed=0,this._fixedDelta=1e3/60,this.timescale=1,this.useFixedDelta=!1,this._autoReset=!1}get autoReset(){return this._autoReset}set autoReset(e){typeof document!="undefined"&&document.hidden!==void 0&&(e?document.addEventListener("visibilitychange",this):document.removeEventListener("visibilitychange",this),this._autoReset=e)}get delta(){return this._delta*.001}get fixedDelta(){return this._fixedDelta*.001}set fixedDelta(e){this._fixedDelta=e*1e3}get elapsed(){return this._elapsed*.001}update(e){this.useFixedDelta?this._delta=this.fixedDelta:(this.previousTime=this.currentTime,this.currentTime=(e!==void 0?e:performance.now())-this.startTime,this._delta=this.currentTime-this.previousTime),this._delta*=this.timescale,this._elapsed+=this._delta}reset(){this._delta=0,this._elapsed=0,this.currentTime=performance.now()-this.startTime}handleEvent(e){document.hidden||(this.currentTime=performance.now()-this.startTime)}dispose(){this.autoReset=!1}};var ie=class{constructor(e=null,{depthBuffer:t=!0,stencilBuffer:i=!1,multisampling:s=0,frameBufferType:n}={}){this.renderer=null,this.inputBuffer=this.createBuffer(t,i,n,s),this.outputBuffer=this.inputBuffer.clone(),this.copyPass=new j,this.depthTexture=null,this.passes=[],this.timer=new te,this.autoRenderToScreen=!0,this.setRenderer(e)}get multisampling(){return this.inputBuffer.samples||0}set multisampling(e){let t=this.inputBuffer,i=this.multisampling;i>0&&e>0?(this.inputBuffer.samples=e,this.outputBuffer.samples=e,this.inputBuffer.dispose(),this.outputBuffer.dispose()):i!==e&&(this.inputBuffer.dispose(),this.outputBuffer.dispose(),this.inputBuffer=this.createBuffer(t.depthBuffer,t.stencilBuffer,t.texture.type,e),this.inputBuffer.depthTexture=this.depthTexture,this.outputBuffer=this.inputBuffer.clone())}getTimer(){return this.timer}getRenderer(){return this.renderer}setRenderer(e){if(this.renderer=e,e!==null){let t=e.getSize(new d.Vector2),i=e.getContext().getContextAttributes().alpha,s=this.inputBuffer.texture.type;s===d.UnsignedByteType&&z(e)===M&&(O(this.inputBuffer.texture,M),O(this.outputBuffer.texture,M),this.inputBuffer.dispose(),this.outputBuffer.dispose()),e.autoClear=!1,this.setSize(t.width,t.height);for(let n of this.passes)n.initialize(e,i,s)}}replaceRenderer(e,t=!0){let i=this.renderer,s=i.domElement.parentNode;return this.setRenderer(e),t&&s!==null&&(s.removeChild(i.domElement),s.appendChild(e.domElement)),i}createDepthTexture(){let e=this.depthTexture=new d.DepthTexture;return this.inputBuffer.depthTexture=e,this.inputBuffer.dispose(),this.inputBuffer.stencilBuffer?(e.format=d.DepthStencilFormat,e.type=d.UnsignedInt248Type):e.type=d.UnsignedIntType,e}deleteDepthTexture(){if(this.depthTexture!==null){this.depthTexture.dispose(),this.depthTexture=null,this.inputBuffer.depthTexture=null,this.inputBuffer.dispose();for(let e of this.passes)e.setDepthTexture(null)}}createBuffer(e,t,i,s){let n=this.renderer,r=n===null?new d.Vector2:n.getDrawingBufferSize(new d.Vector2),o={minFilter:d.LinearFilter,magFilter:d.LinearFilter,stencilBuffer:t,depthBuffer:e,type:i},c=new d.WebGLRenderTarget(r.width,r.height,o);return s>0&&(c.ignoreDepthForMultisampleCopy=!1,c.samples=s),i===d.UnsignedByteType&&z(n)===M&&O(c.texture,M),c.texture.name="EffectComposer.Buffer",c.texture.generateMipmaps=!1,c}setMainScene(e){for(let t of this.passes)t.mainScene=e}setMainCamera(e){for(let t of this.passes)t.mainCamera=e}addPass(e,t){let i=this.passes,s=this.renderer,n=s.getDrawingBufferSize(new d.Vector2),r=s.getContext().getContextAttributes().alpha,o=this.inputBuffer.texture.type;if(e.setRenderer(s),e.setSize(n.width,n.height),e.initialize(s,r,o),this.autoRenderToScreen&&(i.length>0&&(i[i.length-1].renderToScreen=!1),e.renderToScreen&&(this.autoRenderToScreen=!1)),t!==void 0?i.splice(t,0,e):i.push(e),this.autoRenderToScreen&&(i[i.length-1].renderToScreen=!0),e.needsDepthTexture||this.depthTexture!==null)if(this.depthTexture===null){let c=this.createDepthTexture();for(e of i)e.setDepthTexture(c)}else e.setDepthTexture(this.depthTexture)}removePass(e){let t=this.passes,i=t.indexOf(e);if(i!==-1&&t.splice(i,1).length>0){if(this.depthTexture!==null){let r=(c,h)=>c||h.needsDepthTexture;t.reduce(r,!1)||(e.getDepthTexture()===this.depthTexture&&e.setDepthTexture(null),this.deleteDepthTexture())}this.autoRenderToScreen&&i===t.length&&(e.renderToScreen=!1,t.length>0&&(t[t.length-1].renderToScreen=!0))}}removeAllPasses(){let e=this.passes;this.deleteDepthTexture(),e.length>0&&(this.autoRenderToScreen&&(e[e.length-1].renderToScreen=!1),this.passes=[])}render(e){let t=this.renderer,i=this.copyPass,s=this.inputBuffer,n=this.outputBuffer,r=!1,o,c,h;e===void 0&&(this.timer.update(),e=this.timer.delta);for(let f of this.passes)f.enabled&&(f.render(t,s,n,e,r),f.needsSwap&&(r&&(i.renderToScreen=f.renderToScreen,o=t.getContext(),c=t.state.buffers.stencil,c.setFunc(o.NOTEQUAL,1,4294967295),i.render(t,s,n,e,r),c.setFunc(o.EQUAL,1,4294967295)),h=s,s=n,n=h),f instanceof ee?r=!0:f instanceof q&&(r=!1))}setSize(e,t,i){let s=this.renderer,n=s.getSize(new d.Vector2);(e===void 0||t===void 0)&&(e=n.width,t=n.height),(n.width!==e||n.height!==t)&&s.setSize(e,t,i);let r=s.getDrawingBufferSize(new d.Vector2);this.inputBuffer.setSize(r.width,r.height),this.outputBuffer.setSize(r.width,r.height);for(let o of this.passes)o.setSize(r.width,r.height)}reset(){let e=this.timer.autoReset;this.dispose(),this.autoRenderToScreen=!0,this.timer.autoReset=e}dispose(){for(let e of this.passes)e.dispose();this.passes=[],this.inputBuffer!==null&&this.inputBuffer.dispose(),this.outputBuffer!==null&&this.outputBuffer.dispose(),this.deleteDepthTexture(),this.copyPass.dispose(),this.timer.dispose()}};var J=class{constructor(){this.shaderParts=new Map([[u.FRAGMENT_HEAD,null],[u.FRAGMENT_MAIN_UV,null],[u.FRAGMENT_MAIN_IMAGE,null],[u.VERTEX_HEAD,null],[u.VERTEX_MAIN_SUPPORT,null]]),this.defines=new Map,this.uniforms=new Map,this.blendModes=new Map,this.extensions=new Set,this.attributes=w.NONE,this.varyings=new Set,this.uvTransformation=!1,this.readDepth=!1,this.colorSpace=L}};var b=E("three"),ce=!1,k=class{constructor(e=null){this.originalMaterials=new Map,this.material=null,this.materials=null,this.materialsBackSide=null,this.materialsDoubleSide=null,this.materialsFlatShaded=null,this.materialsFlatShadedBackSide=null,this.materialsFlatShadedDoubleSide=null,this.setMaterial(e),this.meshCount=0,this.replaceMaterial=t=>{if(t.isMesh){let i;if(t.material.flatShading)switch(t.material.side){case b.DoubleSide:i=this.materialsFlatShadedDoubleSide;break;case b.BackSide:i=this.materialsFlatShadedBackSide;break;default:i=this.materialsFlatShaded;break}else switch(t.material.side){case b.DoubleSide:i=this.materialsDoubleSide;break;case b.BackSide:i=this.materialsBackSide;break;default:i=this.materials;break}this.originalMaterials.set(t,t.material),t.isSkinnedMesh?t.material=i[2]:t.isInstancedMesh?t.material=i[1]:t.material=i[0],++this.meshCount}}}cloneMaterial(e){if(!(e instanceof b.ShaderMaterial))return e.clone();let t=e.uniforms,i=new Map;for(let n in t){let r=t[n].value;r.isRenderTargetTexture&&(t[n].value=null,i.set(n,r))}let s=e.clone();for(let n of i)t[n[0]].value=n[1],s.uniforms[n[0]].value=n[1];return s}setMaterial(e){if(this.disposeMaterials(),this.material=e,e!==null){let t=this.materials=[this.cloneMaterial(e),this.cloneMaterial(e),this.cloneMaterial(e)];for(let i of t)i.uniforms=Object.assign({},e.uniforms),i.side=b.FrontSide;t[2].skinning=!0,this.materialsBackSide=t.map(i=>{let s=this.cloneMaterial(i);return s.uniforms=Object.assign({},e.uniforms),s.side=b.BackSide,s}),this.materialsDoubleSide=t.map(i=>{let s=this.cloneMaterial(i);return s.uniforms=Object.assign({},e.uniforms),s.side=b.DoubleSide,s}),this.materialsFlatShaded=t.map(i=>{let s=this.cloneMaterial(i);return s.uniforms=Object.assign({},e.uniforms),s.flatShading=!0,s}),this.materialsFlatShadedBackSide=t.map(i=>{let s=this.cloneMaterial(i);return s.uniforms=Object.assign({},e.uniforms),s.flatShading=!0,s.side=b.BackSide,s}),this.materialsFlatShadedDoubleSide=t.map(i=>{let s=this.cloneMaterial(i);return s.uniforms=Object.assign({},e.uniforms),s.flatShading=!0,s.side=b.DoubleSide,s})}}render(e,t,i){let s=e.shadowMap.enabled;if(e.shadowMap.enabled=!1,ce){let n=this.originalMaterials;this.meshCount=0,t.traverse(this.replaceMaterial),e.render(t,i);for(let r of n)r[0].material=r[1];this.meshCount!==n.size&&n.clear()}else{let n=t.overrideMaterial;t.overrideMaterial=this.material,e.render(t,i),t.overrideMaterial=n}e.shadowMap.enabled=s}disposeMaterials(){if(this.material!==null){let e=this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);for(let t of e)t.dispose()}}dispose(){this.originalMaterials.clear(),this.disposeMaterials()}static get workaroundEnabled(){return ce}static set workaroundEnabled(e){ce=e}};var re=E("three");var Se="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x+y,opacity);}";var Te="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y,min(y.a,opacity));}";var Ee="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,(x+y)*0.5,opacity);}";var ye="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(yHSL.rg,xHSL.b));return vec4(mix(x.rgb,z,opacity),y.a);}";var Me="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(step(0.0,y)*(1.0-min(vec4(1.0),(1.0-x)/y)),vec4(1.0),step(1.0,x));return mix(x,z,opacity);}";var Re="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=step(0.0,x)*mix(min(vec4(1.0),x/max(1.0-y,1e-9)),vec4(1.0),step(1.0,y));return mix(x,z,opacity);}";var be="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,min(x,y),opacity);}";var Ce="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,abs(x-y),opacity);}";var Ae="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x/max(y,1e-12),opacity);}";var Be="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,(x+y-2.0*x*y),opacity);}";var we="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 a=min(x,1.0),b=min(y,1.0);vec4 z=mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(0.5,y));return mix(x,z,opacity);}";var _e="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,step(1.0,x+y),opacity);}";var De="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(yHSL.r,xHSL.gb));return vec4(mix(x.rgb,z,opacity),y.a);}";var Ne="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,1.0-y,opacity);}";var Ie="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y*(1.0-x),opacity);}";var Le="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,max(x,y),opacity);}";var Pe="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,clamp(y+x-1.0,0.0,1.0),opacity);}";var Ge="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,min(x+y,1.0),opacity);}";var Fe="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,clamp(2.0*y+x-1.0,0.0,1.0),opacity);}";var Oe="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(xHSL.rg,yHSL.b));return vec4(mix(x.rgb,z,opacity),y.a);}";var He="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x*y,opacity);}";var Ue="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,1.0-abs(1.0-x-y),opacity);}";var ze="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,y,opacity);}";var ke="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(2.0*y*x,1.0-2.0*(1.0-y)*(1.0-x),step(0.5,x));return mix(x,z,opacity);}";var Ve="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 y2=2.0*y;vec4 z=mix(mix(y2,x,step(0.5*x,y)),max(vec4(0.0),y2-1.0),step(x,(y2-1.0)));return mix(x,z,opacity);}";var Xe="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(min(x*x/max(1.0-y,1e-12),1.0),y,step(1.0,y));return mix(x,z,opacity);}";var $e="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec3 xHSL=RGBToHSL(x.rgb);vec3 yHSL=RGBToHSL(y.rgb);vec3 z=HSLToRGB(vec3(xHSL.r,yHSL.g,xHSL.b));return vec4(mix(x.rgb,z,opacity),y.a);}";var Qe="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,x+y-min(x*y,1.0),opacity);}";var Ke="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 y2=2.0*y;vec4 w=step(0.5,y);vec4 z=mix(x-(1.0-y2)*x*(1.0-x),mix(x+(y2-1.0)*(sqrt(x)-x),x+(y2-1.0)*x*((16.0*x-12.0)*x+3.0),w*(1.0-step(0.25,x))),w);return mix(x,z,opacity);}";var je="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return y;}";var qe="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){return mix(x,max(x+y-1.0,0.0),opacity);}";var We="vec4 blend(const in vec4 x,const in vec4 y,const in float opacity){vec4 z=mix(max(1.0-min((1.0-x)/(2.0*y),1.0),0.0),min(x/(2.0*(1.0-y)),1.0),step(0.5,y));return mix(x,z,opacity);}";var $t=new Map([[l.ADD,Se],[l.ALPHA,Te],[l.AVERAGE,Ee],[l.COLOR,ye],[l.COLOR_BURN,Me],[l.COLOR_DODGE,Re],[l.DARKEN,be],[l.DIFFERENCE,Ce],[l.DIVIDE,Ae],[l.DST,null],[l.EXCLUSION,Be],[l.HARD_LIGHT,we],[l.HARD_MIX,_e],[l.HUE,De],[l.INVERT,Ne],[l.INVERT_RGB,Ie],[l.LIGHTEN,Le],[l.LINEAR_BURN,Pe],[l.LINEAR_DODGE,Ge],[l.LINEAR_LIGHT,Fe],[l.LUMINOSITY,Oe],[l.MULTIPLY,He],[l.NEGATION,Ue],[l.NORMAL,ze],[l.OVERLAY,ke],[l.PIN_LIGHT,Ve],[l.REFLECT,Xe],[l.SATURATION,$e],[l.SCREEN,Qe],[l.SOFT_LIGHT,Ke],[l.SRC,je],[l.SUBTRACT,qe],[l.VIVID_LIGHT,We]]),se=class extends re.EventDispatcher{constructor(e,t=1){super(),this._blendFunction=e,this.opacity=new re.Uniform(t)}getOpacity(){return this.opacity.value}setOpacity(e){this.opacity.value=e}get blendFunction(){return this._blendFunction}set blendFunction(e){this._blendFunction=e,this.dispatchEvent({type:"change"})}getBlendFunction(){return this.blendFunction}setBlendFunction(e){this.blendFunction=e}getShaderCode(){return $t.get(this.blendFunction)}};var _=E("three");var ne=class extends _.EventDispatcher{constructor(e,t,{attributes:i=w.NONE,blendFunction:s=l.NORMAL,defines:n=new Map,uniforms:r=new Map,extensions:o=null,vertexShader:c=null}={}){super(),this.name=e,this.renderer=null,this.attributes=i,this.fragmentShader=t,this.vertexShader=c,this.defines=n,this.uniforms=r,this.extensions=o,this.blendMode=new se(s),this.blendMode.addEventListener("change",h=>this.setChanged()),this._inputColorSpace=L,this._outputColorSpace=X}get inputColorSpace(){return this._inputColorSpace}set inputColorSpace(e){this._inputColorSpace=e,this.setChanged()}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e,this.setChanged()}set mainScene(e){}set mainCamera(e){}getName(){return this.name}setRenderer(e){this.renderer=e}getDefines(){return this.defines}getUniforms(){return this.uniforms}getExtensions(){return this.extensions}getBlendMode(){return this.blendMode}getAttributes(){return this.attributes}setAttributes(e){this.attributes=e,this.setChanged()}getFragmentShader(){return this.fragmentShader}setFragmentShader(e){this.fragmentShader=e,this.setChanged()}getVertexShader(){return this.vertexShader}setVertexShader(e){this.vertexShader=e,this.setChanged()}setChanged(){this.dispatchEvent({type:"change"})}setDepthTexture(e,t=_.BasicDepthPacking){}update(e,t,i){}setSize(e,t){}initialize(e,t,i){}dispose(){for(let e of Object.keys(this)){let t=this[e];(t instanceof _.WebGLRenderTarget||t instanceof _.Material||t instanceof _.Texture||t instanceof y)&&this[e].dispose()}}};var F=E("three");var Ye="uniform bool active;uniform vec4 d;void mainUv(inout vec2 uv){if(active){uv=d.xy*(floor(uv*d.zw)+0.5);}}";var oe=class extends ne{constructor(e=30){super("PixelationEffect",Ye,{uniforms:new Map([["active",new F.Uniform(!1)],["d",new F.Uniform(new F.Vector4)]])}),this.resolution=new F.Vector2,this._granularity=0,this.granularity=e}get granularity(){return this._granularity}set granularity(e){let t=Math.floor(e);t%2>0&&(t+=1),this._granularity=t,this.uniforms.get("active").value=t>0,this.setSize(this.resolution.width,this.resolution.height)}getGranularity(){return this.granularity}setGranularity(e){this.granularity=e}setSize(e,t){let i=this.resolution;i.set(e,t);let s=this.granularity,n=s/i.x,r=s/i.y;this.uniforms.get("d").value.set(n,r,1/n,1/r)}};var it=E("tweakpane"),st=E("spatial-controls");var Kt=Math.PI/180,jt=180/Math.PI;function Ze(a,e=16/9){return Math.atan(Math.tan(a*Kt*.5)/e)*jt*2}var V=class{constructor(){this.fps="0",this.timestamp=0,this.acc=0,this.frames=0}update(e){++this.frames,this.acc+=e-this.timestamp,this.timestamp=e,this.acc>=1e3&&(this.fps=this.frames.toFixed(0),this.acc=0,this.frames=0)}};var g=E("three");function Je(){return new g.Group}function et(a){let e=new g.Group,t=new g.MeshStandardMaterial({color:12698049,roughness:0,metalness:1,envMap:a}),i=new g.Matrix4,s=new g.Vector3,n=new g.Vector3,r=new g.Quaternion;r.identity();let o=12,c=24,h=c/o,f=10,R=.3,x=new g.BoxGeometry(1,1,1);x.boundingSphere=new g.Sphere,x.boundingBox=new g.Box3,x.boundingBox.min.set(0,-f,0),x.boundingBox.max.set(c,f,c),x.boundingBox.getBoundingSphere(x.boundingSphere);for(let A=-2;A<2;++A)for(let B=-2;B<2;++B){let S=new g.InstancedMesh(x,t,le(o,2)*2);for(let U=0,D=0;D<o;++D)for(let v=-1;v<1;++v)for(let T=0;T<o;++T)s.set(h,Math.random()*(f-R),h),n.set(D*h,(v+.5)*f,T*h),S.setMatrixAt(U++,i.compose(n,r,s));S.position.set(c*A,0,c*B),S.instanceMatrix.needsUpdate=!0,S.boundingBox=x.boundingBox,S.boundingSphere=x.boundingSphere,S.frustumCulled=!0,e.add(S)}return e}function tt(a){return new g.Group}function Wt(){let a=new Map,e=new C.LoadingManager,t=new C.CubeTextureLoader(e),i=document.baseURI+"img/textures/skies/sunset/",s=".png",n=[i+"px"+s,i+"nx"+s,i+"py"+s,i+"ny"+s,i+"pz"+s,i+"nz"+s];return new Promise((r,o)=>{e.onLoad=()=>r(a),e.onError=c=>o(new Error(`Failed to load ${c}`)),t.load(n,c=>{c.colorSpace=C.SRGBColorSpace,a.set("sky",c)})})}window.addEventListener("load",()=>Wt().then(a=>{let e=new C.WebGLRenderer({powerPreference:"high-performance",antialias:!1,stencil:!1,depth:!1});e.debug.checkShaderErrors=window.location.hostname==="localhost";let t=document.querySelector(".viewport");t.prepend(e.domElement);let i=new C.PerspectiveCamera,s=new st.SpatialControls(i.position,i.quaternion,e.domElement),n=s.settings;n.rotation.sensitivity=2.2,n.rotation.damping=.05,n.translation.damping=.1,s.position.set(0,0,1),s.lookAt(0,0,0);let r=new C.Scene;r.fog=new C.FogExp2(3617076,.06),r.background=a.get("sky"),r.add(Je()),r.add(et(r.background)),r.add(tt(r.background));let o=new ie(e,{multisampling:Math.min(4,e.capabilities.maxSamples)}),c=new oe(5);o.addPass(new W(r,i)),o.addPass(new Y(i,c));let h=new V,f=new it.Pane({container:t.querySelector(".tp")});f.addBinding(h,"fps",{readonly:!0,label:"FPS"}),f.addFolder({title:"Settings"}).addBinding(c,"granularity",{min:0,max:20,step:1});function x(){let A=t.clientWidth,B=t.clientHeight;i.aspect=A/B,i.fov=Ze(90,Math.max(i.aspect,16/9)),i.updateProjectionMatrix(),o.setSize(A,B)}window.addEventListener("resize",x),x(),requestAnimationFrame(function A(B){h.update(B),s.update(B),o.render(),requestAnimationFrame(A)})}));})();
