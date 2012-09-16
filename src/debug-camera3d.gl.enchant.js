/**
 * phi
 */

if (enchant.gl) {
    
    (function(){
        
        /**
         * @scope enchant.gl.DebugCamera3D.prototype
         */
        enchant.gl.DebugCamera3D = enchant.Class.create(enchant.gl.Camera3D, {
            
            /**
             * デバッグ用カメラ
             * @constructs
             * @extends enchant.gl.Camera3D
             * @memo    上ベクトルもいじればグワングワンなるけど, 酔うといけないのでとりあえずこれでいく.
             */
            initialize: function() {
                enchant.gl.Camera3D.call(this);
                this.reset();
            },
            
            enable: function(scene)
            {
                var self    = this;
                var px      = 0;
                var py      = 0;
                var isA     = 0;
                
                // 更新処理
                scene.addEventListener("enterframe", function(e){
                    if (self._changeParam === true) { self.update(); }
                });
                
                // Aボタンチェック
                scene.addEventListener("abuttondown", function(e) { isA = true; });
                scene.addEventListener("abuttonup", function(e) { isA = false; });
                
                // タッチ
                scene.addEventListener("touchstart", function(e) {
                    px = e.x;
                    py = e.y;
                });
                scene.addEventListener("touchmove", function(e) {
                    var dx = (e.x - px);
                    var dy = (e.y - py);

                    
                    if (isA) {
                        // 向きベクトルを基準として右ベクトル(XZ平面上ベクトル)を
                        var left = vec3.create([ -self.direction[2], 0, self.direction[0] ]);
                        vec3.normalize(left);
                        // 上ベクトルを求める
                        var up = vec3.create();
                        vec3.cross(self.direction, left, up);
                        vec3.normalize(up);
                        
                        // マウス移動値分左右移動をする
                        vec3.scale(left, dx*0.1);
                        self.trans(left[0], left[1], left[2]);
                        // マウス移動値分上下移動をする
                        vec3.scale(up, -dy*0.1);
                        self.trans(up[0], up[1], up[2]);
                    }
                    else {
                        self.phi   -= dx*0.25;
                        self.theta += dy*0.25;
                    }
                    
                    px = e.x;
                    py = e.y;
                });
                
                // ズームイン/ズームアウト
                window.addEventListener("mousewheel", function(e) {
                    self.distance -= e.wheelDelta / 48.0;
                });
            },
            
            trans: function(x, y, z) {
                this.x += x;
                this.y += y;
                this.z += z;
                this.centerX += x;
                this.centerY += y;
                this.centerZ += z;
                
                return this;
            },
            
            /**
             * 向きベクトルから Eye を更新
             */
            updateEyeFromDirection: function() {
                this.x = this.centerX + this.direction[0]*this.distance;
                this.y = this.centerY + this.direction[1]*this.distance;
                this.z = this.centerZ + this.direction[2]*this.distance;
            },
            
            /**
             * 向きベクトルから Cnt を更新
             */
            updateCntFromDirection: function() {
                this.centerX = this.x + this.direction[0]*this.distance;
                this.centerY = this.y + this.direction[1]*this.distance;
                this.centerZ = this.z + this.direction[2]*this.distance;
                return this;
            },
            
            /**
             * 更新
             */
            update: function(input, dx, dy) {
                this.setDirectionFromAngle(this.theta, this.phi);
                this.updateEyeFromDirection();
                this._changeParam = false;

                return this;
            },
            
            /**
             * リセット
             */
            reset: function() {
                this.phi        = enchant.gl.DebugCamera3D.DEFAULT_PHI;
                this.theta      = enchant.gl.DebugCamera3D.DEFAULT_THETA;
                this.distance   = enchant.gl.DebugCamera3D.DEFAULT_DISTANCE;
                this.direction  = vec3.create.apply(enchant.gl.DebugCamera3D.DEFAULT_DIRECTION);
                this.centerX = this.centerY = this.centerZ = 0;
            },
            
            /**
             * アングルから向きベクトルをセット
             * @param   {Number}    theta   縦の角度
             * @param   {NUmber}    phi     横の角度
             */
            setDirectionFromAngle:  function(theta, phi)
            {
                var thetaRad = theta*Math.PI/180;
                var phiRad   = phi*Math.PI/180;
                this.direction[0] = Math.cos(thetaRad) * Math.sin(phiRad);
                this.direction[1] = Math.sin(thetaRad);
                this.direction[2] = Math.cos(thetaRad) * Math.cos(phiRad);
                
                return this;
            }
        });
        
        /**
         * 向きベクトル
         * @type    Number
         */
        enchant.gl.DebugCamera3D.prototype.direction = null;
        
        /**
         * Eye と Cnt との距離
         * @type    Number
         */
        Object.defineProperty(enchant.gl.DebugCamera3D.prototype, "distance", {
            get: function() {
                return this._distance;
            },
            set: function(v) {
                this._distance = v;
                this._changeParam = true;
            }
        });
        
        /**
         * 横の角度
         * @type    Number
         */
        Object.defineProperty(enchant.gl.DebugCamera3D.prototype, "phi", {
            get: function() {
                return this._phi;
            },
            set: function(v) {
                this._phi = v;
                this._changeParam = true;
            }
        });
        
        /**
         * 縦の角度
         * @type    Number
         */
        Object.defineProperty(enchant.gl.DebugCamera3D.prototype, "theta", {
            get: function() {
                return this._theta;
            },
            set: function(v) {
                this._theta = v;
                this._changeParam = true;
            }
        });
        
        enchant.gl.DebugCamera3D.DEFAULT_PHI        = 0;
        enchant.gl.DebugCamera3D.DEFAULT_THETA      = 16;
        enchant.gl.DebugCamera3D.DEFAULT_DISTANCE   = 32;
        enchant.gl.DebugCamera3D.DEFAULT_DIRECTION  = vec3.create([0, 0, 1]);
        
    })();
    
}