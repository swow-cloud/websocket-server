var script = {
  data() {
    return {
      clouds: 50,
      particles:300,
      particleArray:[],
      shootingParticles:100,
      shootingParticlesArray:[],
      ringNumber:8,
      stylesArray:[],
      ringArray:[],
      instances: 4,
      count:300,
      countArray:[],
      start:65,
      then: Date.now(),
      displayModeEngage:Date.now(),
      displayMode:false,
      angles:[[0,25,10,'rgba(255,255,255,1)'],
              [50,76,10,'rgba(255,255,255,1)'],
              [101,126,10,'rgba(255,255,255,1)'],
              [152,177,10,'rgba(255,255,255,1)'],
              [203,227,10,'rgba(255,255,255,1)'],
              [258,279,10,'rgba(255,255,255,1)'],
              [305,334,10,'rgba(255,255,255,1)'],
             ],
    };
  },
  methods: {
    changeDisplay() {
      this.displayMode = !this.displayMode;
      this.displayModeEngage = Date.now();
      //console.log("changed display!")
    },
    loop() {
      let now = Date.now();
      now - this.then;
      this.update();
      this.render();
      this.then = now;
      requestAnimationFrame(this.loop);
    },
    update() {
      if(this.displayMode === false) {
        this.start = this.start + 0.2;
        this.start >= 100 ? (this.changeDisplay(), this.start = 100) : null;
      }
      else {
        this.start = this.start - 0.4;
        this.start <= 0 ? (this.changeDisplay(), this.start = 0) : null;
      }
      //console.log(this.start)
      this.particleArray.forEach((item, index) => {
        this.adjustLength(item);
        this.moveParticle(item);
      });
      this.shootingParticlesArray.forEach((item, index) => {
        this.moveShootingParticle(item);  
      });
      this.ringArray.forEach((item, index) => {
        this.updateRings(item);  
      });
      this.countArray.forEach((item, index) => {
        this.updateCount(item);  
      });
      //console.log("we updating!")
    },
    render() {
      let canvas1 = document.getElementById("coreCanvas");
      let canvas2 = document.getElementById("firstCanvas");
      let canvas3 = document.getElementById("secondCanvas");
      let canvas4 = document.getElementById("shootingParticles");
      let ctx = canvas1.getContext("2d");
      let ctx2 = canvas2.getContext("2d");
      let ctx3 = canvas3.getContext("2d");
      let ctx4 = canvas4.getContext("2d");
      ctx.globalCompositeOperation = 'screen'; //test */
      ctx4.globalCompositeOperation = 'screen'; //test */
      ctx.clearRect(0, 0, canvas1.width, canvas1.height);
      this.particleArray.forEach((item, index) => {
        this.renderParticle(item, ctx);
      });
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
      this.drawCircularPlate(this.angles, ctx2);
      ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
      this.countArray.forEach((item, index) => {
        this.drawCounter(item, ctx3);
      });
      this.drawShootTime(this.start, ctx3);
      this.drawOuterRing(this.ringArray, ctx3);
      ctx4.clearRect(0,0,canvas4.width, canvas4.height);
      this.shootingParticlesArray.forEach((item, index) => {
        this.renderShootingParticles(item, ctx4);
      });
      /* ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighten'; //test */
      //console.log("we rendering!")
    },
    createShootingParticles(number) {
      for(let n=0;n<number;n++) {
        let obj = {
          x:470,
          y:95 + (Math.random() * 12 - 6),
          radius:Math.random() * 5 + 15,
          speed:Math.random() * 7 + 1,
          opacity:1,
          delay:Math.floor(Math.random() * 1000),
        };
        this.shootingParticlesArray.push(obj);
      }
    },
    drawCounterInitiation(number) {
      for(let n=0; n<number; n++) {
        let obj = {
          number: n,
          opacity:Math.random(),
          reverse:true,
          start: n * (360/number),
          finish:(n + 1) * (360/number) ,
          fill: "transparent",
          shadow: "rgba(255,255,255,0.5)",
          strokeStyle:"255,255,255",
          lineWidth: Math.floor(Math.random() * 5 + 3)
        };
        this.countArray.push(obj);
      }
    },
    drawShootTime(start, ctx) {
      let finish = 360/100 * start - 90;
      ctx.strokeStyle = "rgba(255,255,255," + start/100 + ")";
      ctx.beginPath();
      ctx.arc(450/2, 450/2, 185, -90 * (Math.PI / 180), finish * (Math.PI / 180));  
      ctx.stroke();
      ctx.closePath();
      //X = Math.cos(angle*Math.PI/180) * length + startPointX
      let calculateX = Math.cos((finish+5)*Math.PI/180) * 185 + (450/2);
      //Y = Math.sin(angle*Math.PI/180) * length + startPointY    
      let calculateY = Math.sin((finish+5)*Math.PI/180) * 185 + (450/2);
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "10px Arial";
      ctx.fillText(start.toString().substring(0,2) + "%", calculateX, calculateY);
    },
    updateCount(item) {
      if(item.reverse === true) {
        item.opacity -= 0.01;
        item.opacity < 0.1 ? item.reverse = false : null;
      }
      if(item.reverse === false) {
        item.opacity += 0.01;
        item.opacity > 0.9 ? item.reverse = true : null;
      }
    },
    drawCounter(item, ctx) {
        if(item.number % 2) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(" + item.strokeStyle + "," + item.opacity + ")";
        ctx.arc(450/2, 450/2, 215 + (item.lineWidth/2), item.start * (Math.PI / 180), item.finish * (Math.PI / 180));
        ctx.fillStyle = item.fill;
        ctx.fill();
        ctx.shadowColor = item.shadow;
        ctx.shadowBlur = 8;
        ctx.lineWidth = item.lineWidth;
        ctx.strokeStyle = 1;
        ctx.stroke();
        ctx.closePath();
      }
    },
    createCoreParticles(number) {
      for(let n=0;n<number;n++) {
        let angle = Math.floor(Math.random() * 360);
        let ring = Math.floor(Math.random() * 25);
        let length = 80 + Math.random() * 40;
        let speed = Math.random() - 0.5;
        speed > 0.3 ? speed = 0.3 : speed = speed;
        let particle = {
          x:250 + (length + ring * Math.cos(angle * (Math.PI / 180))),
          y:250 + (length + ring * Math.sin(angle * (Math.PI / 180))),
          radius:Math.random() * 2 + 2,
          startRadius:Math.random() * 2 + 2,
          length:length,
          speed:speed,
          usedLength:length,
          grow:Math.random() > 0.5 ? true : false,
          startAngle:angle,
          number:n,
          usedAngle:angle,
          ring: ring,
          color: Math.random() > 0.5 ? "rgba(255, 255, 255,0.3)" : "rgba(214,107,24,0.3)",
          shadow:"rgba(0, 0, 0,1)",
          number:n,
        };
        this.particleArray.push(particle);
      }
    },
    makeStarStyles(cloud) {
      if(document.getElementById("cloud-" + cloud) === null) {
      let radius = Math.floor(Math.random() * 230 + 130);
      let x = "top:" + Math.floor(Math.random() * document.body.clientHeight - radius/2) + "px";
      let y = "left:" + Math.floor(Math.random() * document.body.clientWidth - radius/2) + "px";
      let animationTime = Math.floor(Math.random() * 10 + 5);
      let animationDelay = Math.floor(Math.random() * 15);
      let background = "background:radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 34%, rgba(217,217,217,0.0) 70%)";
      let style = "position:absolute;" + x + ";" + y + ";" + "height:" + radius + "px;" + "width:" + radius + "px;" + "border-radius:180px;" + background + ";animation-duration: " + animationTime + "s;animation-delay:" + animationDelay + "s;";
        this.stylesArray.push(style);
      //console.log(style)
      return style;
      }
      else {
        return this.stylesArray[cloud]
      }
    },
    renderParticle(particle, ctx) {
      var grd = ctx.createRadialGradient(particle.x, particle.y, 1, particle.x,   particle.y, particle.radius-particle.radius/10);
      grd.addColorStop(0,particle.color);
      grd.addColorStop(1,"rgba(255,255,255,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
    },
    renderShootingParticles(particle, ctx) {
      if(particle.x < 470) {
      ctx.fillStyle = "rgba(255,255,255," + particle.opacity + ")";
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
      }
    },
    moveShootingParticle(item) {
      if(this.displayMode === true && Date.now() > this.displayModeEngage + 1000) {
        item.opacity = item.x/470;
        item.x/470 * 10 > 0 ? item.radius = item.x/470 * 10 : item.radius = 0;
        if(item.x > 0) {
          if(Date.now() > this.displayModeEngage + 1000 + item.delay) {
            item.x = item.x - item.speed;
          }
        }
        else {
          item.x = 470;
        }
      }
      else if(this.displayMode === false && Date.now() < this.displayModeEngage + 1500) {
          item.opacity = item.x/470;
          item.x/470 * 10 > 0 ? item.radius = item.x/470 * 10 : item.radius = 0;
          item.x = item.x - item.speed;
      }
      else if(this.displayMode === false && Date.now() > this.displayModeEngage + 1500) {
        item.x = 470;
      }
    },
    createRings(rings, array) {
      //console.logs
      for(let i = 0; i < rings ; i ++) {
        let startAng = Math.floor(Math.random() * 360);
        let endAng = startAng + Math.random() * 50 + 50;
        let obj = {
           startAng: startAng * (Math.PI / 180),
           endAng: endAng * (Math.PI / 180),
           length: 120 + 7 * i,
           shown:true,
           moveDirection:Math.random() > 0.5 ? true : false,
           moveDone:false,
          };
        array.push(obj);
        console.log(obj);
      }
    },
    updateRings(ring) {
      if(ring.moveDone === false) {
        ring.moveDirection ?
         (ring.startAng -= 0.01, ring.endAng -= 0.01) : 
         (ring.startAng += 0.01, ring.endAng += 0.01);
         Math.random() < 0.02 ? ring.moveDone = true : null;
      }
      else {
        ring.moveDirection = !ring.moveDirection;       
        ring.moveDone = false;
      }
    },
    drawOuterRing(points, ctx) {
      points.forEach(item => {
         if(item.shown === true) {
           //console.log(item.startAng, item.endAng)
            ctx.beginPath();
            ctx.arc(450/2, 450/2, item.length, item.startAng, item.endAng, 0, 2 * Math.PI);
            ctx.fillStyle = 'transparent';
            ctx.fill();
            ctx.shadowColor = 'rgba(255,255,255,1)';
            ctx.shadowBlur = 15;
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(255,255,255,1)";
            ctx.stroke();
            ctx.closePath();
         }
      });
    },
    adjustLength(particle) {
      //particle.number === 0 ? console.log(particle.grow) : null
      if(particle.grow && !this.displayMode) {
        particle.usedLength += Math.abs(particle.speed) / 2;
        particle.usedLength > particle.length + 20 ? particle.grow = false : null;
        particle.radius > particle.startRadius ? (particle.radius -= 0.5, particle.usedLength += particle.radius / 3) : null;
      }
      else if(!particle.grow && !this.displayMode) {
        particle.usedLength -= Math.abs(particle.speed) / 2;
        particle.usedLength < particle.length - 20 ? particle.grow = true : null;
        particle.radius > particle.startRadius ? (particle.radius -= 1) : null;
      }
      else if(this.displayMode) {
        !particle.grow ? particle.grow = true : null;
        particle.usedLength > 0 ? particle.usedLength -= particle.radius / 10 : null;
        particle.radius < 25 ? particle.radius += 1 : null;
      }
    },
    moveParticle(particle) {
      //Math.random() < 0.5 ? particle.usedLength++ : particle.usedLength--;
      particle.usedAngle = particle.usedAngle + particle.speed;
      particle.x = 250 + particle.usedLength * Math.cos(particle.usedAngle * (Math.PI / 180));
      particle.y = 250 + particle.usedLength * Math.sin(particle.usedAngle * (Math.PI / 180));
    },
    drawCircularPlate(angles,ctx) {
      angles.forEach((item) => {     
        ctx.beginPath();
        ctx.arc(450/2, 450/2, 150, item[0] * (Math.PI / 180), item[1] * (Math.PI / 180));
        ctx.fillStyle = 'transparent';
        ctx.fill();
        ctx.shadowColor = item[3];
        ctx.shadowBlur = 15;
        ctx.lineWidth = item[2];
        ctx.strokeStyle = item[3];
        ctx.stroke();
        ctx.closePath();
      });
        ctx.beginPath();
        ctx.arc(450/2, 450/2, 138, 0, 2 * Math.PI);
        ctx.fillStyle = 'transparent';
        ctx.fill();
        ctx.shadowColor = 'rgba(255,255,255,1)';
        ctx.shadowBlur = 15;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.stroke();
        ctx.closePath();
      
        ctx.beginPath();
        ctx.arc(450/2, 450/2, 163, 0, 2 * Math.PI);
        ctx.fillStyle = 'transparent';
        ctx.fill();
        ctx.shadowColor = 'rgba(255,255,255,1)';
        ctx.shadowBlur = 15;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.stroke();
        ctx.closePath();
    }
  },
  mounted() {
    this.drawCounterInitiation(this.count);
    this.createCoreParticles(this.particles);
    this.createShootingParticles(this.shootingParticles);
    this.createRings(this.ringNumber,this.ringArray);
    let canvas1 = document.getElementById("coreCanvas");
    canvas1.width = document.getElementById("core").offsetWidth;
    canvas1.height = document.getElementById("core").offsetHeight;
    let canvas2 = document.getElementById("firstCanvas");
    canvas2.width = document.getElementById("firstCircle").offsetWidth;
    canvas2.height = document.getElementById("firstCircle").offsetHeight;
    let ctx2 = canvas2.getContext("2d");
    this.drawCircularPlate(this.angles, ctx2);
    document.getElementById("secondCanvas");
    canvas2.width = document.getElementById("firstCircle").offsetWidth;
    canvas2.height = document.getElementById("firstCircle").offsetHeight;
    window.addEventListener("resize", function(){
    let canvas1 = document.getElementById("coreCanvas");
    canvas1.width = document.getElementById("core").offsetWidth;
    canvas1.height = document.getElementById("core").offsetHeight;
    let canvas2 = document.getElementById("firstCanvas");
    canvas2.width = document.getElementById("firstCircle").offsetWidth;
    canvas2.height = document.getElementById("firstCircle").offsetHeight;
    document.getElementById("secondCanvas");
    canvas2.width = document.getElementById("firstCircle").offsetWidth;
    canvas2.height = document.getElementById("firstCircle").offsetHeight;
    }, true);
    //Let's start this!
    //we go!
    this.loop();
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { attrs: { id: "app" } },
    [
      _vm._l(_vm.clouds, function(item, index) {
        return _c("div", {
          staticClass: "cloud",
          style: _vm.makeStarStyles(index),
          attrs: { id: "cloud-" + index }
        })
      }),
      _vm._v(" "),
      _c(
        "div",
        {
          class: _vm.displayMode ? "active" : "notActive",
          attrs: { id: "holoLoader" }
        },
        [
          _vm._m(0),
          _vm._v(" "),
          _vm._m(1),
          _vm._v(" "),
          _vm._m(2),
          _vm._v(" "),
          _c("div", { staticClass: "holoLayer", attrs: { id: "thirdCircle" } }),
          _vm._v(" "),
          _c("div", {
            staticClass: "holoLayer",
            attrs: { id: "fourthCircle" }
          }),
          _vm._v(" "),
          _vm._m(3),
          _vm._v(" "),
          _c("div", { staticClass: "holoLayer", attrs: { id: "sixthCircle" } })
        ]
      ),
      _vm._v(" "),
      _c("canvas", {
        class: _vm.displayMode ? "active" : "notActive",
        attrs: { width: "470", height: "200", id: "shootingParticles" }
      })
    ],
    2
  )
};
var __vue_staticRenderFns__ = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "holoLayer", attrs: { id: "core" } }, [
      _c("canvas", { attrs: { id: "coreCanvas" } })
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "holoLayer", attrs: { id: "firstCircle" } },
      [
        _c("canvas", {
          attrs: { width: "450", height: "450", id: "secondCanvas" }
        })
      ]
    )
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "holoLayer", attrs: { id: "secondCircle" } },
      [
        _c("div", { staticClass: "slider a" }, [
          _c("div", { staticClass: "sliderPoint a" })
        ])
      ]
    )
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "holoLayer", attrs: { id: "fifthCircle" } },
      [_c("canvas", { attrs: { id: "firstCanvas" } })]
    )
  }
];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-c170eec2_0", { source: "\n:root {\n  --main-blue-color: #13aeff;\n  --main-white-color: #ffffff;\n  --main-orange-color: #d66b18;\n}\nbody {\n    width:100vw;\n    height:100vh;\n    margin:0;\n    padding:0;\n    overflow:hidden;\n    background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(28,38,47,1) 0%, rgba(37,47,57,1) 90% );\n}\n.testbtn {\n    position: absolute;\n    top: 20px;\n    left: calc(50vw - 25px);\n    height: 20px;\n    box-shadow: 0px 0px 15px 0px rgba(255, 255, 255, 0.5);\n    text-transform: uppercase;\n    height: 25px;\n    width: 70px;\n    background-color: transparent;\n    z-index: 10000000000000;\n    color: white;\n    border: 1px solid white;\n}\n.cloud {\n    z-index:-1;\n    opacity:0.5;\n    animation:cloudFade;\n}\n@keyframes cloudFade {\n0%    {opacity:0.5;}\n50%   {opacity:0;}\n100%  {opacity:0.5;}\n}\n@keyframes reverseRotate {\nfrom { transform:rotate(0deg)\n}\nto { transform:rotate(360deg)\n}\n}\n@keyframes rotate {\nfrom { transform:rotate(360deg)\n}\nto { transform:rotate(0deg)\n}\n}\n#secondCircle .slider {\n    background-color: transparent;\n    width: calc(50% + 4px);\n    box-sizing: border-box;\n    height: 8px;\n    top:calc(50% - 4px);\n    left:calc(50% - 4px);\n    position: relative;\n    animation:rotate 8s infinite linear;\n    transform-origin: 4px 4px;\n}\n#secondCircle .sliderPoint.a {\n    box-shadow: 0px 0px 3px 2px rgba(255,255,255,0.55);\n    left: calc(100% - 2px);\n    width: 4px;\n    background-color: rgba(255,255,255,0.55);\n    position:relative;\n    box-sizing: border-box;\n    border-radius: 100%;\n    height: 4px;\n}\n#secondCircle .sliderPoint.a:before {\n    content: '';\n    box-shadow: 0px 0px 3px 2px rgba(255,255,255,0.55);\n    width: 4px;\n    position: relative;\n   \ttop: 183px;\n\t  left: -285px;\n    border-radius: 90px;\n    height: 4px;\n    display: block;\n    background-color: rgba(255,255,255,0.55);\n}\n#secondCircle .sliderPoint.a:after {\n    content: '';\n    box-shadow: 0px 0px 3px 2px rgba(255,255,255,0.55);\n    width: 4px;\n    position: relative;\n    top: -190px;\n\t  left: -270px;\n    border-radius: 90px;\n    height: 4px;\n    display: block;\n    background-color: rgba(255,255,255,0.55);\n}\n#holoLoader.active .sliderPoint.a:after {\n    animation:sparks 3s infinite linear 0s;\n}\n#holoLoader.active .sliderPoint.a:before {\n    animation:sparks 3s infinite linear 1.2s;\n}\n#holoLoader.active .sliderPoint.a {\n    animation:sparks 3s infinite linear 0.3s;\n}\n@keyframes sparks {\n0% {\n     box-shadow: 0px 0px 5px 3px rgba(255,255,255,0.75);\n}\n60% {\n     box-shadow: 0px 0px 5px 3px rgba(255,255,255,0.75);\n}\n61% {\n     box-shadow: 0px 0px 5px 8px rgba(255,255,255,0.75);\n}\n62% {\n     box-shadow: 0px 0px 5px 3px rgba(255,255,255,0.75);\n}\n84% {\n     box-shadow: 0px 0px 5px 3px rgba(255,255,255,0.75);\n}\n85% {\n     box-shadow: 0px 0px 5px 8px rgba(255,255,255,0.75);\n}\n86% {\n     box-shadow: 0px 0px 5px 3px rgba(255,255,255,0.75);\n}\n}\n#holoLoader {\n    z-index:1;\n    //box-shadow: 0px 0px 39px 0px rgba(148,255,241,1);\n    position:relative;\n    border-radius:50%;\n    background-color:rgba(255,255,255,0);\n    width:500px;\n    height:500px;\n    margin:auto;\n    margin-top:calc(50vh - 250px);\n    transition:all 0.5s ease-in-out 0.4s;\n    //transform: perspective(1000px) rotateX(30deg) rotateY(-50deg) rotateZ(0deg);\n}\n.holoLayer {\n    //background: radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(202,226,255,0) 65%, rgba(147,196,255,1) 100%);\n    //box-shadow: 0px 0px 39px 0px rgba(148,255,241,0.3);\n    border-radius:360px;\n    transition:all 0.5s ease-in-out 0s;\n}\n#holoLoader.active {\n    transform: perspective(1000px) rotateX(30deg) rotateY(-50deg) rotateZ(0deg);\n    transition:all 0.5s ease-in-out;\n}\n#core {\n    width:100%;\n    height:100%;\n    background:radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 17%, rgba(147,196,255,0.1) 24%, rgba(255,255,255,0) 30%)\n}\n#coreCanvas, #firstCanvas, #secondCanvas {\n   width:100%;\n   height:100%;\n}\n#firstCircle {\n    position:absolute;\n    top:0px;\n    width:90%;\n    height:90%;\n    margin:5%;\n}\n@keyframes stutterMovement {\n0% {\n      transform:rotate(0deg)\n}\n10% {\n      transform:rotate(50deg)\n}\n30% {\n      transform:rotate(50deg)\n}\n40% {\n      transform:rotate(50deg)\n}\n45% {\n      transform:rotate(70deg)\n}\n60% {\n      transform:rotate(-20deg)\n}\n70% {\n      transform:rotate(0deg)\n}\n85% {\n      transform:rotate(20deg)\n}\n90% {\n      transform:rotate(0deg)\n}\n100% {\n      transform:rotate(0deg)\n}\n}\n#holoLoader.active #firstCircle {\n    transform: translateX(-130px) translateY(-80px);\n    transition:all 0.5s ease-in-out 0.4s;\n}\n#secondCircle {\n    position:absolute;\n    top:0px;\n    width:80%;\n    height:80%;\n    margin:10%;\n    border:1px solid var(--main-orange-color);\n}\n#secondCircle:before {\n    transition:all 0.5s ease-in-out 0s;\n    content:'';\n    border:7px dotted rgba(79, 223, 255,0.3);\n    position:absolute;\n    top:0px;\n    width:100%;\n    height:100%;\n    top: 0px;\n    left: 0px;\n    border-radius:360%;\n    opacity:0;\n}\n#secondCircle:after {\n    transition:all 0.5s ease-in-out 0s;\n    content:'';\n    border:5px solid rgba(79, 223, 255,0.7);\n    position:absolute;\n    top:0px;\n    width:100%;\n    height:100%;\n    border-radius:360%;\n    opacity:0;\n}\n#holoLoader.active #secondCircle {\n    border:2px solid rgba(255, 255, 255,0.5);\n    transform:translateX(-180px) translateY(-120px);\n    transition:all 0.5s ease-in-out 0.4s;\n}\n#holoLoader.active #secondCircle:before {\n    opacity:1;\n    top: -55px;\n    left: -75px;\n    transition:all 0.5s ease-in-out 0.4s;\n    animation: rotation 5s linear 0s infinite;\n    transformation-origin:100% 100%;\n}\n@keyframes rotation {\n0% {\n      transform:rotateZ(0deg)\n}\n100% {\n      transform:rotateZ(360deg)\n}\n}\n#holoLoader.active #secondCircle:after {\n    opacity:1;\n    transform: translateX(45px) translateY(35px);\n    transition:all 0.5s ease-in-out 0.4s;\n}\n#thirdCircle {\n    position:absolute;\n    top:0px;\n    width:70%;\n    height:70%;\n    margin:15%;\n    border:0px solid white;\n    opacity:0;\n    transition:all 0.5s ease-in-out 0s;\n}\n#holoLoader.active #thirdCircle:before {\n    content:'';\n    display:block;\n    width:100%;\n    height:100%;\n    position:absolute;\n}\n#holoLoader.active #thirdCircle:after {\n    content:'';\n    position:absolute;\n    display:block;\n    border-radius:180%;\n    width:100%;\n    height:100%;\n}\n#holoLoader.active #thirdCircle {\n    border:5px solid white;\n    opacity:1;\n    transform: translateX(-520px) translateY(-330px);\n    transition:all 0.5s ease-in-out 0.4s;\n}\n#fourthCircle {\n    position:absolute;\n    top:0px;\n    width:60%;\n    height:60%;\n    margin:20%;\n}\n#holoLoader.active #fourthCircle {\n    transform: translateX(-810px) translateY(-540px);\n    transition:all 0.5s ease-in-out 0.4s;\n}\n#fifthCircle {\n    position:absolute;\n    top:0px;\n    width:50%;\n    height:50%;\n    margin:25%;\n    animation: stutterMovement 5s infinite linear;\n}\n#holoLoader.active #fifthCircle {\n    transform: translateX(-600px) translateY(-400px);\n    transition:all 0.5s ease-in-out 0.4s;\n}\n#sixthCircle {\n    position:absolute;\n    top:0px;\n    width:40%;\n    height:40%;\n    margin:30%;\n    border:1px dashed var(--main-orange-color);\n    border-radius:180%;\n}\n#holoLoader.active #sixthCircle {\n    border:3px solid var(--main-white-color);\n    transition:all 0.5s ease-in-out 0.4s;\n}\n#holoLoader.active #sixthCircle:before {\n    position:absolute;\n    width:40%;\n    height:40%;\n    margin:30%;\n    top:-5px;\n    left:-5px;\n    border:1px dashed var(--main-white-color);\n    border-radius:180%;\n    transition: all 0.5s ease-in-out 0s;\n    animation: bubbleEffect 4s infinite linear;\n    box-shadow: 0px 0px 0px rgba(255,255,255,0);\n}\n#sixthCircle:before {\n    content:'';\n    position:absolute;\n    border-radius:180%;\n    width:20%;\n   \tdisplay: block;\n    height:20%;\n    margin:40%;\n    top: -5px;\n\t  left: -5px;\n    border:1px solid var(--main-white-color);\n    box-shadow: 0px 0px 5px 2px rgba(214,107,24,1), inset 0 0px 5px rgba(214,107,24,1);\n    transition:all 0.5s ease-in-out 0.4s;\n    animation: rotationY 4s infinite linear;\n}\n#holoLoader.active #sixthCircle:after {\n    position:absolute;\n    width:40%;\n    height:40%;\n    margin:30%;\n    top:-5px;\n    left:-5px;\n    border:1px dashed var(--main-white-color);\n    border-radius:180%;\n    transition: all 0.5s ease-in-out 0s;\n    animation: bubbleEffect 4s infinite linear;\n    box-shadow: 0px 0px 0px rgba(255,255,255,0);\n}\n#sixthCircle:after {\n    content:'';\n    position:absolute;\n    display: block;\n    width:20%;\n    height:20%;\n    border-radius:180%;\n    margin:40%;\n    top: -5px;\n\t  left: -5px;\n    box-shadow: 0px 0px 5px 2px var(--main-orange-color), inset 0 0px 5px var(--main-orange-color);\n    border:1px solid var(--main-white-color);\n    transition:all 0.5s ease-in-out 0.4s;\n    animation: rotationX 8s infinite linear;\n}\n@keyframes rotationX {\n0% {\n      transform:rotateX(0deg) rotateY(0deg) scale(1);\n}\n100% {\n      transform:rotateX(360deg) rotateY(-360deg) scale(1);\n}\n}\n@keyframes rotationY {\n0% {\n      transform:rotateY(0deg) rotateX(0deg) scale(1)\n}\n100% {\n      transform:rotateY(360deg) rotateX(360deg) scale(1)\n}\n}\n@keyframes bubbleEffect {\n0% {\n      animation-timing-function: linear;\n      transform:scale(1);\n}\n25% {\n      animation-timing-function: linear;\n      opacity:1;\n      transform:scale(1.2);\n}\n50% {\n      animation-timing-function: linear;\n      opacity:0.5;\n      transform:scale(1);\n}\n75% {\n      animation-timing-function: linear;\n      opacity:0.5;\n      transform:scale(0.8);\n}\n100%{\n      animation-timing-function: linear;\n      opacity:1;\n      transform:scale(1);\n}\n}\n#shootingParticles {\n    opacity:0;\n    width: 470px;\n    height: 200px;\n    z-index:1;\n    position: absolute;\n    top: calc(50vh - 168px);\n\t  left: calc(50vw - 460px);\n    transform: rotateZ(18deg);\n    transition:all 0.5s linear 0.5s;\n}\n#shootingParticles.active {\n     transition:all 0.5s linear 1s;\n     opacity:1;\n}\n", map: {"version":3,"sources":["/tmp/codepen/vuejs/src/pen.vue"],"names":[],"mappings":";AAgbA;EACA,0BAAA;EACA,2BAAA;EACA,4BAAA;AACA;AACA;IACA,WAAA;IACA,YAAA;IACA,QAAA;IACA,SAAA;IACA,eAAA;IACA,kHAAA;AACA;AACA;IACA,kBAAA;IACA,SAAA;IACA,uBAAA;IACA,YAAA;IACA,qDAAA;IACA,yBAAA;IACA,YAAA;IACA,WAAA;IACA,6BAAA;IACA,uBAAA;IACA,YAAA;IACA,uBAAA;AACA;AACA;IACA,UAAA;IACA,WAAA;IACA,mBAAA;AACA;AACA;AACA,OAAA,WAAA,CAAA;AACA,OAAA,SAAA,CAAA;AACA,OAAA,WAAA,CAAA;AACA;AAEA;AACA,OAAA;AAAA;AACA,KAAA;AAAA;AACA;AACA;AACA,OAAA;AAAA;AACA,KAAA;AAAA;AACA;AAEA;IACA,6BAAA;IACA,sBAAA;IACA,sBAAA;IACA,WAAA;IACA,mBAAA;IACA,oBAAA;IACA,kBAAA;IACA,mCAAA;IACA,yBAAA;AAEA;AAEA;IACA,kDAAA;IACA,sBAAA;IACA,UAAA;IACA,wCAAA;IACA,iBAAA;IACA,sBAAA;IACA,mBAAA;IACA,WAAA;AACA;AAEA;IACA,WAAA;IACA,kDAAA;IACA,UAAA;IACA,kBAAA;IACA,UAAA;GACA,YAAA;IACA,mBAAA;IACA,WAAA;IACA,cAAA;IACA,wCAAA;AACA;AACA;IACA,WAAA;IACA,kDAAA;IACA,UAAA;IACA,kBAAA;IACA,WAAA;GACA,YAAA;IACA,mBAAA;IACA,WAAA;IACA,cAAA;IACA,wCAAA;AACA;AACA;IACA,sCAAA;AACA;AACA;IACA,wCAAA;AACA;AACA;IACA,wCAAA;AACA;AAEA;AACA;KACA,kDAAA;AACA;AACA;KACA,kDAAA;AACA;AACA;KACA,kDAAA;AACA;AACA;KACA,kDAAA;AACA;AACA;KACA,kDAAA;AACA;AACA;KACA,kDAAA;AACA;AACA;KACA,kDAAA;AACA;AACA;AAEA;IACA,SAAA;IACA,kDAAA;IACA,iBAAA;IACA,iBAAA;IACA,oCAAA;IACA,WAAA;IACA,YAAA;IACA,WAAA;IACA,6BAAA;IACA,oCAAA;IACA,6EAAA;AAEA;AAEA;IACA,gHAAA;IACA,oDAAA;IACA,mBAAA;IACA,kCAAA;AACA;AAEA;IACA,2EAAA;IACA,+BAAA;AACA;AAEA;IACA,UAAA;IACA,WAAA;IACA;AACA;AACA;GACA,UAAA;GACA,WAAA;AACA;AACA;IACA,iBAAA;IACA,OAAA;IACA,SAAA;IACA,UAAA;IACA,SAAA;AACA;AAEA;AACA;MACA;AACA;AACA;MACA;AACA;AACA;MACA;AACA;AACA;MACA;AACA;AACA;MACA;AACA;AACA;MACA;AACA;AACA;MACA;AACA;AACA;MACA;AACA;AACA;MACA;AACA;AACA;MACA;AACA;AACA;AAEA;IACA,+CAAA;IACA,oCAAA;AACA;AACA;IACA,iBAAA;IACA,OAAA;IACA,SAAA;IACA,UAAA;IACA,UAAA;IACA,yCAAA;AACA;AAEA;IACA,kCAAA;IACA,UAAA;IACA,wCAAA;IACA,iBAAA;IACA,OAAA;IACA,UAAA;IACA,WAAA;IACA,QAAA;IACA,SAAA;IACA,kBAAA;IACA,SAAA;AACA;AACA;IACA,kCAAA;IACA,UAAA;IACA,uCAAA;IACA,iBAAA;IACA,OAAA;IACA,UAAA;IACA,WAAA;IACA,kBAAA;IACA,SAAA;AACA;AACA;IACA,wCAAA;IACA,+CAAA;IACA,oCAAA;AACA;AAEA;IACA,SAAA;IACA,UAAA;IACA,WAAA;IACA,oCAAA;IACA,yCAAA;IACA,+BAAA;AACA;AAEA;AACA;MACA;AACA;AACA;MACA;AACA;AACA;AACA;IACA,SAAA;IACA,4CAAA;IACA,oCAAA;AAEA;AACA;IACA,iBAAA;IACA,OAAA;IACA,SAAA;IACA,UAAA;IACA,UAAA;IACA,sBAAA;IACA,SAAA;IACA,kCAAA;AACA;AACA;IACA,UAAA;IACA,aAAA;IACA,UAAA;IACA,WAAA;IACA,iBAAA;AACA;AACA;IACA,UAAA;IACA,iBAAA;IACA,aAAA;IACA,kBAAA;IACA,UAAA;IACA,WAAA;AACA;AACA;IACA,sBAAA;IACA,SAAA;IACA,gDAAA;IACA,oCAAA;AACA;AACA;IACA,iBAAA;IACA,OAAA;IACA,SAAA;IACA,UAAA;IACA,UAAA;AACA;AACA;IACA,gDAAA;IACA,oCAAA;AACA;AACA;IACA,iBAAA;IACA,OAAA;IACA,SAAA;IACA,UAAA;IACA,UAAA;IACA,6CAAA;AACA;AACA;IACA,gDAAA;IACA,oCAAA;AACA;AACA;IACA,iBAAA;IACA,OAAA;IACA,SAAA;IACA,UAAA;IACA,UAAA;IACA,0CAAA;IACA,kBAAA;AACA;AACA;IACA,wCAAA;IACA,oCAAA;AACA;AAEA;IACA,iBAAA;IACA,SAAA;IACA,UAAA;IACA,UAAA;IACA,QAAA;IACA,SAAA;IACA,yCAAA;IACA,kBAAA;IACA,mCAAA;IACA,0CAAA;IACA,2CAAA;AACA;AACA;IACA,UAAA;IACA,iBAAA;IACA,kBAAA;IACA,SAAA;IACA,cAAA;IACA,UAAA;IACA,UAAA;IACA,SAAA;GACA,UAAA;IACA,wCAAA;IACA,kFAAA;IACA,oCAAA;IACA,uCAAA;AACA;AACA;IACA,iBAAA;IACA,SAAA;IACA,UAAA;IACA,UAAA;IACA,QAAA;IACA,SAAA;IACA,yCAAA;IACA,kBAAA;IACA,mCAAA;IACA,0CAAA;IACA,2CAAA;AACA;AACA;IACA,UAAA;IACA,iBAAA;IACA,cAAA;IACA,SAAA;IACA,UAAA;IACA,kBAAA;IACA,UAAA;IACA,SAAA;GACA,UAAA;IACA,8FAAA;IACA,wCAAA;IACA,oCAAA;IACA,uCAAA;AACA;AAEA;AACA;MACA,8CAAA;AACA;AACA;MACA,mDAAA;AACA;AACA;AAEA;AACA;MACA;AACA;AACA;MACA;AACA;AACA;AAEA;AACA;MACA,iCAAA;MACA,kBAAA;AACA;AACA;MACA,iCAAA;MACA,SAAA;MACA,oBAAA;AACA;AACA;MACA,iCAAA;MACA,WAAA;MACA,kBAAA;AACA;AACA;MACA,iCAAA;MACA,WAAA;MACA,oBAAA;AACA;AACA;MACA,iCAAA;MACA,SAAA;MACA,kBAAA;AACA;AACA;AAEA;IACA,SAAA;IACA,YAAA;IACA,aAAA;IACA,SAAA;IACA,kBAAA;IACA,uBAAA;GACA,wBAAA;IACA,yBAAA;IACA,+BAAA;AACA;AAEA;KACA,6BAAA;KACA,SAAA;AACA","file":"pen.vue","sourcesContent":["<!-- ALL THE HTML -->\n<template>\n  <div id=\"app\">\n   <div\n      v-for=\"(item, index) in clouds\"\n      class=\"cloud\"\n      :id=\"'cloud-' + index\"\n      :style=\"makeStarStyles(index)\"\n         ></div>\n    <!--<button class=\"testbtn\" @click=\"changeDisplay\">Fire!</button> -->\n    <div id=\"holoLoader\" :class=\"displayMode ? 'active' : 'notActive'\">\n      <div class=\"holoLayer\" id=\"core\"><canvas id=\"coreCanvas\" /></div>\n      <div class=\"holoLayer\" id=\"firstCircle\">\n        <canvas width=\"450\" height=\"450\" id=\"secondCanvas\" />\n      </div>\n      <div class=\"holoLayer\" id=\"secondCircle\">\n        <div class=\"slider a\">\n        <div class=\"sliderPoint a\">\n          <!-- <div v-for=\"item in sparks\" class=\"spark\" /> -->\n          </div>\n          </div>\n        </div>\n      <div class=\"holoLayer\" id=\"thirdCircle\"></div>\n     <div class=\"holoLayer\" id=\"fourthCircle\"></div>\n     <div class=\"holoLayer\" id=\"fifthCircle\">\n       <canvas id=\"firstCanvas\" />\n     </div>\n     <div class=\"holoLayer\" id=\"sixthCircle\"></div>\n    </div>\n   <canvas width=\"470\" height=\"200\" id=\"shootingParticles\" :class=\"displayMode ? 'active' : 'notActive'\"/>\n  </div>\n</template>\n<!-- ALL THE JAVASRIPT -->\n<script>\nexport default {\n  data() {\n    return {\n      clouds: 50,\n      particles:300,\n      particleArray:[],\n      shootingParticles:100,\n      shootingParticlesArray:[],\n      ringNumber:8,\n      stylesArray:[],\n      ringArray:[],\n      instances: 4,\n      count:300,\n      countArray:[],\n      start:65,\n      then: Date.now(),\n      displayModeEngage:Date.now(),\n      displayMode:false,\n      angles:[[0,25,10,'rgba(255,255,255,1)'],\n              [50,76,10,'rgba(255,255,255,1)'],\n              [101,126,10,'rgba(255,255,255,1)'],\n              [152,177,10,'rgba(255,255,255,1)'],\n              [203,227,10,'rgba(255,255,255,1)'],\n              [258,279,10,'rgba(255,255,255,1)'],\n              [305,334,10,'rgba(255,255,255,1)'],\n             ],\n    };\n  },\n  methods: {\n    changeDisplay() {\n      this.displayMode = !this.displayMode\n      this.displayModeEngage = Date.now();\n      //console.log(\"changed display!\")\n    },\n    loop() {\n      let now = Date.now();\n      let delta = now - this.then;\n      this.update();\n      this.render();\n      this.then = now;\n      requestAnimationFrame(this.loop);\n    },\n    update() {\n      if(this.displayMode === false) {\n        this.start = this.start + 0.2;\n        this.start >= 100 ? (this.changeDisplay(), this.start = 100) : null;\n      }\n      else {\n        this.start = this.start - 0.4;\n        this.start <= 0 ? (this.changeDisplay(), this.start = 0) : null;\n      }\n      //console.log(this.start)\n      this.particleArray.forEach((item, index) => {\n        this.adjustLength(item);\n        this.moveParticle(item);\n      })\n      this.shootingParticlesArray.forEach((item, index) => {\n        this.moveShootingParticle(item)  \n      })\n      this.ringArray.forEach((item, index) => {\n        this.updateRings(item)  \n      })\n      this.countArray.forEach((item, index) => {\n        this.updateCount(item)  \n      })\n      //console.log(\"we updating!\")\n    },\n    render() {\n      let canvas1 = document.getElementById(\"coreCanvas\");\n      let canvas2 = document.getElementById(\"firstCanvas\");\n      let canvas3 = document.getElementById(\"secondCanvas\");\n      let canvas4 = document.getElementById(\"shootingParticles\")\n      let ctx = canvas1.getContext(\"2d\");\n      let ctx2 = canvas2.getContext(\"2d\");\n      let ctx3 = canvas3.getContext(\"2d\");\n      let ctx4 = canvas4.getContext(\"2d\");\n      ctx.globalCompositeOperation = 'screen'; //test */\n      ctx4.globalCompositeOperation = 'screen'; //test */\n      ctx.clearRect(0, 0, canvas1.width, canvas1.height);\n      this.particleArray.forEach((item, index) => {\n        this.renderParticle(item, ctx)\n      })\n      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);\n      this.drawCircularPlate(this.angles, ctx2);\n      ctx3.clearRect(0, 0, canvas3.width, canvas3.height);\n      this.countArray.forEach((item, index) => {\n        this.drawCounter(item, ctx3)\n      })\n      this.drawShootTime(this.start, ctx3)\n      this.drawOuterRing(this.ringArray, ctx3);\n      ctx4.clearRect(0,0,canvas4.width, canvas4.height);\n      this.shootingParticlesArray.forEach((item, index) => {\n        this.renderShootingParticles(item, ctx4)\n      })\n      /* ctx.clearRect(0, 0, canvas.width, canvas.height);\n      ctx.globalCompositeOperation = 'lighten'; //test */\n      //console.log(\"we rendering!\")\n    },\n    createShootingParticles(number) {\n      for(let n=0;n<number;n++) {\n        let obj = {\n          x:470,\n          y:95 + (Math.random() * 12 - 6),\n          radius:Math.random() * 5 + 15,\n          speed:Math.random() * 7 + 1,\n          opacity:1,\n          delay:Math.floor(Math.random() * 1000),\n        }\n        this.shootingParticlesArray.push(obj);\n      }\n    },\n    drawCounterInitiation(number) {\n      for(let n=0; n<number; n++) {\n        let obj = {\n          number: n,\n          opacity:Math.random(),\n          reverse:true,\n          start: n * (360/number),\n          finish:(n + 1) * (360/number) ,\n          fill: \"transparent\",\n          shadow: \"rgba(255,255,255,0.5)\",\n          strokeStyle:\"255,255,255\",\n          lineWidth: Math.floor(Math.random() * 5 + 3)\n        }\n        this.countArray.push(obj)\n      }\n    },\n    drawShootTime(start, ctx) {\n      let finish = 360/100 * start - 90;\n      ctx.strokeStyle = \"rgba(255,255,255,\" + start/100 + \")\";\n      ctx.beginPath();\n      ctx.arc(450/2, 450/2, 185, -90 * (Math.PI / 180), finish * (Math.PI / 180));  \n      ctx.stroke();\n      ctx.closePath();\n      //X = Math.cos(angle*Math.PI/180) * length + startPointX\n      let calculateX = Math.cos((finish+5)*Math.PI/180) * 185 + (450/2)\n      //Y = Math.sin(angle*Math.PI/180) * length + startPointY    \n      let calculateY = Math.sin((finish+5)*Math.PI/180) * 185 + (450/2)\n      ctx.fillStyle = \"white\";\n      ctx.textAlign = \"center\";\n      ctx.font = \"10px Arial\";\n      ctx.fillText(start.toString().substring(0,2) + \"%\", calculateX, calculateY);\n    },\n    updateCount(item) {\n      if(item.reverse === true) {\n        item.opacity -= 0.01;\n        item.opacity < 0.1 ? item.reverse = false : null\n      }\n      if(item.reverse === false) {\n        item.opacity += 0.01;\n        item.opacity > 0.9 ? item.reverse = true : null\n      }\n    },\n    drawCounter(item, ctx) {\n        if(item.number % 2) {\n        ctx.beginPath();\n        ctx.strokeStyle = \"rgba(\" + item.strokeStyle + \",\" + item.opacity + \")\";\n        ctx.arc(450/2, 450/2, 215 + (item.lineWidth/2), item.start * (Math.PI / 180), item.finish * (Math.PI / 180));\n        ctx.fillStyle = item.fill;\n        ctx.fill();\n        ctx.shadowColor = item.shadow;\n        ctx.shadowBlur = 8;\n        ctx.lineWidth = item.lineWidth\n        ctx.strokeStyle = 1;\n        ctx.stroke();\n        ctx.closePath();\n      }\n    },\n    createCoreParticles(number) {\n      for(let n=0;n<number;n++) {\n        let angle = Math.floor(Math.random() * 360);\n        let ring = Math.floor(Math.random() * 25);\n        let length = 80 + Math.random() * 40;\n        let speed = Math.random() - 0.5;\n        speed > 0.3 ? speed = 0.3 : speed = speed;\n        let particle = {\n          x:250 + (length + ring * Math.cos(angle * (Math.PI / 180))),\n          y:250 + (length + ring * Math.sin(angle * (Math.PI / 180))),\n          radius:Math.random() * 2 + 2,\n          startRadius:Math.random() * 2 + 2,\n          length:length,\n          speed:speed,\n          usedLength:length,\n          grow:Math.random() > 0.5 ? true : false,\n          startAngle:angle,\n          number:n,\n          usedAngle:angle,\n          ring: ring,\n          color: Math.random() > 0.5 ? \"rgba(255, 255, 255,0.3)\" : \"rgba(214,107,24,0.3)\",\n          shadow:\"rgba(0, 0, 0,1)\",\n          number:n,\n        }\n        this.particleArray.push(particle);\n      }\n    },\n    makeStarStyles(cloud) {\n      if(document.getElementById(\"cloud-\" + cloud) === null) {\n      let radius = Math.floor(Math.random() * 230 + 130);\n      let x = \"top:\" + Math.floor(Math.random() * document.body.clientHeight - radius/2) + \"px\";\n      let y = \"left:\" + Math.floor(Math.random() * document.body.clientWidth - radius/2) + \"px\";\n      let animationTime = Math.floor(Math.random() * 10 + 5);\n      let animationDelay = Math.floor(Math.random() * 15);\n      let background = \"background:radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 34%, rgba(217,217,217,0.0) 70%)\";\n      let style = \"position:absolute;\" + x + \";\" + y + \";\" + \"height:\" + radius + \"px;\" + \"width:\" + radius + \"px;\" + \"border-radius:180px;\" + background + \";animation-duration: \" + animationTime + \"s;animation-delay:\" + animationDelay + \"s;\";\n        this.stylesArray.push(style)\n      //console.log(style)\n      return style;\n      }\n      else {\n        return this.stylesArray[cloud]\n      }\n    },\n    renderParticle(particle, ctx) {\n      var grd = ctx.createRadialGradient(particle.x, particle.y, 1, particle.x,   particle.y, particle.radius-particle.radius/10);\n      grd.addColorStop(0,particle.color);\n      grd.addColorStop(1,\"rgba(255,255,255,0)\");\n      ctx.fillStyle = grd;\n      ctx.beginPath();\n      ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);\n      ctx.closePath();\n      ctx.fill();\n    },\n    renderShootingParticles(particle, ctx) {\n      if(particle.x < 470) {\n      ctx.fillStyle = \"rgba(255,255,255,\" + particle.opacity + \")\";\n      ctx.beginPath();\n      ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);\n      ctx.closePath();\n      ctx.fill();\n      }\n    },\n    moveShootingParticle(item) {\n      if(this.displayMode === true && Date.now() > this.displayModeEngage + 1000) {\n        item.opacity = item.x/470;\n        item.x/470 * 10 > 0 ? item.radius = item.x/470 * 10 : item.radius = 0;\n        if(item.x > 0) {\n          if(Date.now() > this.displayModeEngage + 1000 + item.delay) {\n            item.x = item.x - item.speed\n          }\n        }\n        else {\n          item.x = 470\n        }\n      }\n      else if(this.displayMode === false && Date.now() < this.displayModeEngage + 1500) {\n          item.opacity = item.x/470;\n          item.x/470 * 10 > 0 ? item.radius = item.x/470 * 10 : item.radius = 0;\n          item.x = item.x - item.speed\n      }\n      else if(this.displayMode === false && Date.now() > this.displayModeEngage + 1500) {\n        item.x = 470;\n      }\n    },\n    createRings(rings, array) {\n      //console.logs\n      for(let i = 0; i < rings ; i ++) {\n        let distance = (360/rings)\n        let startAng = Math.floor(Math.random() * 360)\n        let endAng = startAng + Math.random() * 50 + 50;\n        //let distance = Math.floor(Math.random() * 50 + 50)\n        let distandeDrawn = (360/rings) /  100 * 90\n        let distanceTransparent = (360/rings) /  100 * 10\n        let obj = {\n           startAng: startAng * (Math.PI / 180),\n           endAng: endAng * (Math.PI / 180),\n           length: 120 + 7 * i,\n           shown:true,\n           moveDirection:Math.random() > 0.5 ? true : false,\n           moveDone:false,\n          }\n        array.push(obj);\n        console.log(obj)\n      }\n    },\n    updateRings(ring) {\n      if(ring.moveDone === false) {\n        ring.moveDirection ?\n         (ring.startAng -= 0.01, ring.endAng -= 0.01) : \n         (ring.startAng += 0.01, ring.endAng += 0.01);\n         Math.random() < 0.02 ? ring.moveDone = true : null;\n      }\n      else {\n        ring.moveDirection = !ring.moveDirection;       \n        ring.moveDone = false\n      }\n    },\n    drawOuterRing(points, ctx) {\n      points.forEach(item => {\n         if(item.shown === true) {\n           //console.log(item.startAng, item.endAng)\n            ctx.beginPath();\n            ctx.arc(450/2, 450/2, item.length, item.startAng, item.endAng, 0, 2 * Math.PI);\n            ctx.fillStyle = 'transparent'\n            ctx.fill();\n            ctx.shadowColor = 'rgba(255,255,255,1)';\n            ctx.shadowBlur = 15;\n            ctx.lineWidth = 5;\n            ctx.strokeStyle = \"rgba(255,255,255,1)\";\n            ctx.stroke();\n            ctx.closePath();\n         }\n      })\n    },\n    adjustLength(particle) {\n      //particle.number === 0 ? console.log(particle.grow) : null\n      if(particle.grow && !this.displayMode) {\n        particle.usedLength += Math.abs(particle.speed) / 2;\n        particle.usedLength > particle.length + 20 ? particle.grow = false : null;\n        particle.radius > particle.startRadius ? (particle.radius -= 0.5, particle.usedLength += particle.radius / 3) : null;\n      }\n      else if(!particle.grow && !this.displayMode) {\n        particle.usedLength -= Math.abs(particle.speed) / 2;\n        particle.usedLength < particle.length - 20 ? particle.grow = true : null;\n        particle.radius > particle.startRadius ? (particle.radius -= 1) : null;\n      }\n      else if(this.displayMode) {\n        !particle.grow ? particle.grow = true : null;\n        particle.usedLength > 0 ? particle.usedLength -= particle.radius / 10 : null;\n        particle.radius < 25 ? particle.radius += 1 : null;\n      }\n    },\n    moveParticle(particle) {\n      //Math.random() < 0.5 ? particle.usedLength++ : particle.usedLength--;\n      particle.usedAngle = particle.usedAngle + particle.speed;\n      particle.x = 250 + particle.usedLength * Math.cos(particle.usedAngle * (Math.PI / 180));\n      particle.y = 250 + particle.usedLength * Math.sin(particle.usedAngle * (Math.PI / 180));\n    },\n    drawCircularPlate(angles,ctx) {\n      angles.forEach((item) => {     \n        ctx.beginPath();\n        ctx.arc(450/2, 450/2, 150, item[0] * (Math.PI / 180), item[1] * (Math.PI / 180));\n        ctx.fillStyle = 'transparent'\n        ctx.fill();\n        ctx.shadowColor = item[3];\n        ctx.shadowBlur = 15;\n        ctx.lineWidth = item[2];\n        ctx.strokeStyle = item[3];\n        ctx.stroke();\n        ctx.closePath();\n      })\n        ctx.beginPath();\n        ctx.arc(450/2, 450/2, 138, 0, 2 * Math.PI);\n        ctx.fillStyle = 'transparent'\n        ctx.fill();\n        ctx.shadowColor = 'rgba(255,255,255,1)';\n        ctx.shadowBlur = 15;\n        ctx.lineWidth = 2;\n        ctx.strokeStyle = 'rgba(255,255,255,1)';\n        ctx.stroke();\n        ctx.closePath();\n      \n        ctx.beginPath();\n        ctx.arc(450/2, 450/2, 163, 0, 2 * Math.PI);\n        ctx.fillStyle = 'transparent'\n        ctx.fill();\n        ctx.shadowColor = 'rgba(255,255,255,1)';\n        ctx.shadowBlur = 15;\n        ctx.lineWidth = 2;\n        ctx.strokeStyle = 'rgba(255,255,255,1)';\n        ctx.stroke();\n        ctx.closePath();\n    }\n  },\n  mounted() {\n    this.drawCounterInitiation(this.count);\n    this.createCoreParticles(this.particles);\n    this.createShootingParticles(this.shootingParticles);\n    this.createRings(this.ringNumber,this.ringArray);\n    let canvas1 = document.getElementById(\"coreCanvas\");\n    canvas1.width = document.getElementById(\"core\").offsetWidth;\n    canvas1.height = document.getElementById(\"core\").offsetHeight;\n    let canvas2 = document.getElementById(\"firstCanvas\");\n    canvas2.width = document.getElementById(\"firstCircle\").offsetWidth;\n    canvas2.height = document.getElementById(\"firstCircle\").offsetHeight;\n    let ctx2 = canvas2.getContext(\"2d\");\n    this.drawCircularPlate(this.angles, ctx2);\n    let canvas3 = document.getElementById(\"secondCanvas\");\n    canvas2.width = document.getElementById(\"firstCircle\").offsetWidth;\n    canvas2.height = document.getElementById(\"firstCircle\").offsetHeight;\n    window.addEventListener(\"resize\", function(){\n    let canvas1 = document.getElementById(\"coreCanvas\");\n    canvas1.width = document.getElementById(\"core\").offsetWidth;\n    canvas1.height = document.getElementById(\"core\").offsetHeight;\n    let canvas2 = document.getElementById(\"firstCanvas\");\n    canvas2.width = document.getElementById(\"firstCircle\").offsetWidth;\n    canvas2.height = document.getElementById(\"firstCircle\").offsetHeight;\n    let canvas3 = document.getElementById(\"secondCanvas\");\n    canvas2.width = document.getElementById(\"firstCircle\").offsetWidth;\n    canvas2.height = document.getElementById(\"firstCircle\").offsetHeight;\n    }, true);\n    //Let's start this!\n    //we go!\n    this.loop();\n  }\n};\n</script>\n<!-- ALL THE STYLES -->\n<style>\n  :root {\n  --main-blue-color: #13aeff;\n  --main-white-color: #ffffff;\n  --main-orange-color: #d66b18;\n}\n  body {\n    width:100vw;\n    height:100vh;\n    margin:0;\n    padding:0;\n    overflow:hidden;\n    background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(28,38,47,1) 0%, rgba(37,47,57,1) 90% );\n  }\n  .testbtn {\n    position: absolute;\n    top: 20px;\n    left: calc(50vw - 25px);\n    height: 20px;\n    box-shadow: 0px 0px 15px 0px rgba(255, 255, 255, 0.5);\n    text-transform: uppercase;\n    height: 25px;\n    width: 70px;\n    background-color: transparent;\n    z-index: 10000000000000;\n    color: white;\n    border: 1px solid white;\n  }\n  .cloud {\n    z-index:-1;\n    opacity:0.5;\n    animation:cloudFade;\n  }\n @keyframes cloudFade {\n  0%    {opacity:0.5;}\n  50%   {opacity:0;}\n  100%  {opacity:0.5;}\n}\n  \n  @keyframes reverseRotate {\n  from { transform:rotate(0deg) } \n  to { transform:rotate(360deg) } \n}\n    @keyframes rotate {\n  from { transform:rotate(360deg) } \n  to { transform:rotate(0deg) } \n}\n  \n  #secondCircle .slider {\n    background-color: transparent;\n    width: calc(50% + 4px);\n    box-sizing: border-box;\n    height: 8px;\n    top:calc(50% - 4px);\n    left:calc(50% - 4px);\n    position: relative;\n    animation:rotate 8s infinite linear;\n    transform-origin: 4px 4px;\n\n  }\n  \n  #secondCircle .sliderPoint.a {\n    box-shadow: 0px 0px 3px 2px rgba(255,255,255,0.55);\n    left: calc(100% - 2px);\n    width: 4px;\n    background-color: rgba(255,255,255,0.55);\n    position:relative;\n    box-sizing: border-box;\n    border-radius: 100%;\n    height: 4px;\n  }\n  \n  #secondCircle .sliderPoint.a:before {\n    content: '';\n    box-shadow: 0px 0px 3px 2px rgba(255,255,255,0.55);\n    width: 4px;\n    position: relative;\n   \ttop: 183px;\n\t  left: -285px;\n    border-radius: 90px;\n    height: 4px;\n    display: block;\n    background-color: rgba(255,255,255,0.55);\n  }\n  #secondCircle .sliderPoint.a:after {\n    content: '';\n    box-shadow: 0px 0px 3px 2px rgba(255,255,255,0.55);\n    width: 4px;\n    position: relative;\n    top: -190px;\n\t  left: -270px;\n    border-radius: 90px;\n    height: 4px;\n    display: block;\n    background-color: rgba(255,255,255,0.55);\n  }\n  #holoLoader.active .sliderPoint.a:after {\n    animation:sparks 3s infinite linear 0s;\n  }\n  #holoLoader.active .sliderPoint.a:before {\n    animation:sparks 3s infinite linear 1.2s;\n  }\n  #holoLoader.active .sliderPoint.a {\n    animation:sparks 3s infinite linear 0.3s;\n  }\n  \n  @keyframes sparks {\n    0% {\n     box-shadow: 0px 0px 5px 3px rgba(255,255,255,0.75);\n    }\n    60% {\n     box-shadow: 0px 0px 5px 3px rgba(255,255,255,0.75); \n    }\n    61% {\n     box-shadow: 0px 0px 5px 8px rgba(255,255,255,0.75); \n    }\n    62% {\n     box-shadow: 0px 0px 5px 3px rgba(255,255,255,0.75); \n    }\n    84% {\n     box-shadow: 0px 0px 5px 3px rgba(255,255,255,0.75); \n    }\n    85% {\n     box-shadow: 0px 0px 5px 8px rgba(255,255,255,0.75); \n    }\n    86% {\n     box-shadow: 0px 0px 5px 3px rgba(255,255,255,0.75); \n    }\n  }\n  \n  #holoLoader {\n    z-index:1;\n    //box-shadow: 0px 0px 39px 0px rgba(148,255,241,1);\n    position:relative;\n    border-radius:50%;\n    background-color:rgba(255,255,255,0);\n    width:500px;\n    height:500px;\n    margin:auto;\n    margin-top:calc(50vh - 250px);\n    transition:all 0.5s ease-in-out 0.4s;\n    //transform: perspective(1000px) rotateX(30deg) rotateY(-50deg) rotateZ(0deg);\n\n  }\n  \n  .holoLayer {\n    //background: radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(202,226,255,0) 65%, rgba(147,196,255,1) 100%);\n    //box-shadow: 0px 0px 39px 0px rgba(148,255,241,0.3);\n    border-radius:360px;\n    transition:all 0.5s ease-in-out 0s;\n  }\n  \n  #holoLoader.active {\n    transform: perspective(1000px) rotateX(30deg) rotateY(-50deg) rotateZ(0deg);\n    transition:all 0.5s ease-in-out;\n  }\n  \n  #core {\n    width:100%;\n    height:100%;\n    background:radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 17%, rgba(147,196,255,0.1) 24%, rgba(255,255,255,0) 30%)\n  }\n  #coreCanvas, #firstCanvas, #secondCanvas {\n   width:100%;\n   height:100%;\n  }\n  #firstCircle {\n    position:absolute;\n    top:0px;\n    width:90%;\n    height:90%;\n    margin:5%;\n  }\n  \n  @keyframes stutterMovement {\n    0% {\n      transform:rotate(0deg)\n    }\n    10% {\n      transform:rotate(50deg)\n    }\n    30% {\n      transform:rotate(50deg)\n    }\n    40% {\n      transform:rotate(50deg)\n    }\n    45% {\n      transform:rotate(70deg)\n    }\n    60% {\n      transform:rotate(-20deg)\n    }\n    70% {\n      transform:rotate(0deg)\n    }\n    85% {\n      transform:rotate(20deg)\n    }\n    90% {\n      transform:rotate(0deg)\n    }\n    100% {\n      transform:rotate(0deg)\n    }\n  }\n  \n  #holoLoader.active #firstCircle {\n    transform: translateX(-130px) translateY(-80px);\n    transition:all 0.5s ease-in-out 0.4s;\n  }\n  #secondCircle {\n    position:absolute;\n    top:0px;\n    width:80%;\n    height:80%;\n    margin:10%;\n    border:1px solid var(--main-orange-color);\n  }\n \n  #secondCircle:before {\n    transition:all 0.5s ease-in-out 0s;\n    content:'';\n    border:7px dotted rgba(79, 223, 255,0.3);\n    position:absolute;\n    top:0px;\n    width:100%;\n    height:100%;\n    top: 0px;\n    left: 0px;\n    border-radius:360%;\n    opacity:0;\n  }\n  #secondCircle:after {\n    transition:all 0.5s ease-in-out 0s;\n    content:'';\n    border:5px solid rgba(79, 223, 255,0.7);\n    position:absolute;\n    top:0px;\n    width:100%;\n    height:100%;\n    border-radius:360%;\n    opacity:0;\n  }\n  #holoLoader.active #secondCircle {\n    border:2px solid rgba(255, 255, 255,0.5);\n    transform:translateX(-180px) translateY(-120px);\n    transition:all 0.5s ease-in-out 0.4s;\n  }\n  \n  #holoLoader.active #secondCircle:before {\n    opacity:1;\n    top: -55px;\n    left: -75px;\n    transition:all 0.5s ease-in-out 0.4s;\n    animation: rotation 5s linear 0s infinite;\n    transformation-origin:100% 100%;\n  }\n  \n  @keyframes rotation {\n    0% {\n      transform:rotateZ(0deg)\n    }\n    100% {\n      transform:rotateZ(360deg)\n    }\n  }\n  #holoLoader.active #secondCircle:after {\n    opacity:1;\n    transform: translateX(45px) translateY(35px);\n    transition:all 0.5s ease-in-out 0.4s;\n    \n  }\n  #thirdCircle {\n    position:absolute;\n    top:0px;\n    width:70%;\n    height:70%;\n    margin:15%;\n    border:0px solid white;\n    opacity:0;\n    transition:all 0.5s ease-in-out 0s;\n  }\n  #holoLoader.active #thirdCircle:before {\n    content:'';\n    display:block;\n    width:100%;\n    height:100%;\n    position:absolute;\n  }\n  #holoLoader.active #thirdCircle:after {\n    content:'';\n    position:absolute;\n    display:block;\n    border-radius:180%;\n    width:100%;\n    height:100%;\n  }\n  #holoLoader.active #thirdCircle {\n    border:5px solid white;\n    opacity:1;\n    transform: translateX(-520px) translateY(-330px);\n    transition:all 0.5s ease-in-out 0.4s;\n  }\n  #fourthCircle {\n    position:absolute;\n    top:0px;\n    width:60%;\n    height:60%;\n    margin:20%;\n  }\n   #holoLoader.active #fourthCircle {\n    transform: translateX(-810px) translateY(-540px);\n    transition:all 0.5s ease-in-out 0.4s;\n  }\n  #fifthCircle {\n    position:absolute;\n    top:0px;\n    width:50%;\n    height:50%;\n    margin:25%;\n    animation: stutterMovement 5s infinite linear;\n  }\n  #holoLoader.active #fifthCircle {\n    transform: translateX(-600px) translateY(-400px);\n    transition:all 0.5s ease-in-out 0.4s;\n  }\n  #sixthCircle {\n    position:absolute;\n    top:0px;\n    width:40%;\n    height:40%;\n    margin:30%;\n    border:1px dashed var(--main-orange-color);\n    border-radius:180%;\n  }\n  #holoLoader.active #sixthCircle {\n    border:3px solid var(--main-white-color);\n    transition:all 0.5s ease-in-out 0.4s;\n  }\n  \n  #holoLoader.active #sixthCircle:before {\n    position:absolute;\n    width:40%;\n    height:40%;\n    margin:30%;\n    top:-5px;\n    left:-5px;\n    border:1px dashed var(--main-white-color);\n    border-radius:180%;\n    transition: all 0.5s ease-in-out 0s;\n    animation: bubbleEffect 4s infinite linear;\n    box-shadow: 0px 0px 0px rgba(255,255,255,0);\n  }\n   #sixthCircle:before {\n    content:'';\n    position:absolute;\n    border-radius:180%;\n    width:20%;\n   \tdisplay: block;\n    height:20%;\n    margin:40%;\n    top: -5px;\n\t  left: -5px;\n    border:1px solid var(--main-white-color);\n    box-shadow: 0px 0px 5px 2px rgba(214,107,24,1), inset 0 0px 5px rgba(214,107,24,1);\n    transition:all 0.5s ease-in-out 0.4s;\n    animation: rotationY 4s infinite linear;\n  }\n  #holoLoader.active #sixthCircle:after {\n    position:absolute;\n    width:40%;\n    height:40%;\n    margin:30%;\n    top:-5px;\n    left:-5px;\n    border:1px dashed var(--main-white-color);\n    border-radius:180%;\n    transition: all 0.5s ease-in-out 0s;\n    animation: bubbleEffect 4s infinite linear;\n    box-shadow: 0px 0px 0px rgba(255,255,255,0);\n  }\n  #sixthCircle:after {\n    content:'';\n    position:absolute;\n    display: block;\n    width:20%;\n    height:20%;\n    border-radius:180%;\n    margin:40%;\n    top: -5px;\n\t  left: -5px;\n    box-shadow: 0px 0px 5px 2px var(--main-orange-color), inset 0 0px 5px var(--main-orange-color);\n    border:1px solid var(--main-white-color);\n    transition:all 0.5s ease-in-out 0.4s;\n    animation: rotationX 8s infinite linear;\n  }\n  \n  @keyframes rotationX {\n    0% {\n      transform:rotateX(0deg) rotateY(0deg) scale(1);\n    }\n    100% {\n      transform:rotateX(360deg) rotateY(-360deg) scale(1);\n    }\n  }\n  \n  @keyframes rotationY {\n     0% {\n      transform:rotateY(0deg) rotateX(0deg) scale(1)\n    }\n    100% {\n      transform:rotateY(360deg) rotateX(360deg) scale(1)\n    }\n  }\n  \n  @keyframes bubbleEffect {\n    0% {\n      animation-timing-function: linear;\n      transform:scale(1);\n    }\n    25% {\n      animation-timing-function: linear;\n      opacity:1;\n      transform:scale(1.2);\n    }\n    50% {\n      animation-timing-function: linear;\n      opacity:0.5;\n      transform:scale(1);\n    }\n    75% {\n      animation-timing-function: linear;\n      opacity:0.5;\n      transform:scale(0.8);\n    }\n    100%{\n      animation-timing-function: linear;\n      opacity:1;\n      transform:scale(1);\n    }\n  }\n  \n  #shootingParticles {\n    opacity:0;\n    width: 470px;\n    height: 200px;\n    z-index:1;\n    position: absolute;\n    top: calc(50vh - 168px);\n\t  left: calc(50vw - 460px);\n    transform: rotateZ(18deg);\n    transition:all 0.5s linear 0.5s;\n  }\n  \n  #shootingParticles.active {\n     transition:all 0.5s linear 1s;\n     opacity:1;\n  }\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

export default __vue_component__;