require([
	'goo/entities/EntityUtils',
	'goo/entities/GooRunner',
	'goo/renderer/Camera',
	'goo/renderer/Material',
	'goo/renderer/TextureCreator',
	'goo/renderer/light/PointLight',
	'goo/renderer/shaders/ShaderLib',
	'goo/scripts/OrbitCamControlScript',
	'goo/shapes/ShapeCreator'
], function (
	EntityUtils,
	GooRunner,
	Camera,
	Material,
	TextureCreator,
	PointLight,
	ShaderLib,
	OrbitCamControlScript,
	ShapeCreator
) {
	"use strict";

	var goo = new GooRunner();
    document.getElementById("game-frame").appendChild(goo.renderer.domElement);
	
	var tc = new TextureCreator()
	var sunTex = tc.loadTexture2D('sun.png');
	var earthTex = tc.loadTexture2D('earth.jpg');
	var moonTex = tc.loadTexture2D('moon.jpg');
	var borgTex = tc.loadTexture2D('borg.jpg');

	function createAstronomicalObject(radius, texture) {
		var meshData = ShapeCreator.createSphere(24, 24, radius);
		var material = Material.createMaterial(ShaderLib.uber);
		material.setTexture('DIFFUSE_MAP', texture);
		var entity = EntityUtils.createTypicalEntity(goo.world, meshData, material, {
			run: function (entity) {
				entity.transformComponent.setRotation( 0, goo.world.time * 0.5, 0);
			}
		});
		entity.addToWorld();
		return entity;
	}

    function createHostileObject(width, height, length, texture) {
        var meshData = ShapeCreator.createBox(width, height, length, 1, 1);
        var material = Material.createMaterial(ShaderLib.uber);
        material.setTexture('DIFFUSE_MAP', texture);
        var entityBox = EntityUtils.createTypicalEntity(goo.world, meshData, material, {
            run: function (entityBox) {
                entityBox.transformComponent.setRotation( 0, goo.world.time * 0.8, 0);
            }
        });
        entityBox.addToWorld();
        return entityBox;
    }

    var sun = createAstronomicalObject(1, sunTex);
    sun.meshRendererComponent.materials[0].uniforms.materialAmbient = [1,1,0.3,1];

	var earth = createAstronomicalObject(0.5, earthTex);
	earth.transformComponent.setTranslation( 5, 0, 0);
	earth.meshRendererComponent.materials[0].uniforms.materialAmbient = [1,1,1,1];
	sun.transformComponent.attachChild( earth.transformComponent);
	
	var moon = createAstronomicalObject(0.15, moonTex);
	moon.transformComponent.setTranslation( 1.4, 0, 0);
	moon.meshRendererComponent.materials[0].uniforms.materialAmbient = [1,1,1,1];
	earth.transformComponent.attachChild( moon.transformComponent);

    var borg = createHostileObject(0.4, 0.4, 0.4, borgTex);
    borg.transformComponent.setTranslation( 2, 0, 0);
    borg.meshRendererComponent.materials[0].uniforms.materialAmbient = [1,1,1,1];
    moon.transformComponent.attachChild( borg.transformComponent);
	
	var light = new PointLight();
	light.color.set( 1,1,0);
	var lightEntity = EntityUtils.createTypicalEntity( goo.world, light);
	lightEntity.addToWorld();


	var camera = new Camera(20, 1, 0.1, 1000);
	var cameraEntity = 	EntityUtils.createTypicalEntity(goo.world, camera, new OrbitCamControlScript(), [0,0,5]);
	cameraEntity.addToWorld();
	
});
