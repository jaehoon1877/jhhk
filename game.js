// EntranceScene 정의
class EntranceScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EntranceScene' });
    }

    init(data) {
        if (data && data.returnToEntrance) {
            this.playerStartX = 400;
            this.playerStartY = 300;
        } else {
            this.playerStartX = 400;
            this.playerStartY = 550;
        }
    }

    preload() {
        this.load.image('entranceBg', 'assets/entrance.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 48, frameHeight: 48 });
        this.load.audio('entranceBgm', 'assets/entrance_bgm.mp3');
    }

    create() {
        this.add.image(400, 300, 'entranceBg');
        this.player = this.physics.add.sprite(this.playerStartX, this.playerStartY, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setFrame(4);

        // BGM 재생
        if (this.sound.get('entranceBgm')) {
            // this.sound.removeByKey('entranceBgm');
        } else {
            this.entranceBgm = this.sound.add('entranceBgm', { volume: 0.5, loop: true });
            this.entranceBgm.play();
        }

        // 애니메이션 설정
        this.anims.create({
            key: 'walkLeft',
            frames: this.anims.generateFrameNumbers('player', { start: 15, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walkRight',
            frames: this.anims.generateFrameNumbers('player', { start: 27, end: 29 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walkUp',
            frames: this.anims.generateFrameNumbers('player', { start: 39, end: 41 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walkDown',
            frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // 입력 설정
        this.cursors = this.input.keyboard.createCursorKeys();
        this.targetPosition = { x: this.player.x, y: this.player.y };
        this.isMovingX = false;
        this.isTouchInputActive = false; // 터치 입력 활성화 상태 추가

        // 터치 입력 처리
        this.input.on('pointerdown', (pointer) => {
            if (!this.isInteracting) {
                this.targetPosition.x = pointer.x;
                this.targetPosition.y = pointer.y;
                this.isMovingX = true;
                this.isTouchInputActive = true; // 터치 입력 활성화
            }
        });

        // 벽 설정 (현재는 없지만 확장성을 위해 추가)
        this.walls = [];
        this.walls.forEach(wall => {
            this.physics.add.collider(this.player, wall, () => {
                // 벽에 충돌 시 목표 경로를 현재 위치로 변경
                this.targetPosition = { x: this.player.x, y: this.player.y };
                this.isTouchInputActive = false; // 터치 입력 비활성화
                this.isMovingX = false;
                this.player.anims.stop(); // 애니메이션 정지
            });
        });

        // 갤러리 입구 Zone (ReceptionScene으로 이동)
        this.entryZone = this.add.zone(400, 220, 100, 50);
        this.physics.add.existing(this.entryZone);
        this.physics.add.overlap(this.player, this.entryZone, () => {
            this.scene.start('ReceptionScene', { returnToEntrance: true });
        });

        // 초기 상태
        this.isInteracting = false;
    }

    update() {
        const speed = 200;
        let velocityX = 0;
        let velocityY = 0;

        if (!this.isInteracting) {
            // 키보드 입력 처리
            let hasKeyboardInput = false;
            if (this.cursors.left.isDown) {
                velocityX = -speed;
                this.player.anims.play('walkLeft', true);
                hasKeyboardInput = true;
            } else if (this.cursors.right.isDown) {
                velocityX = speed;
                this.player.anims.play('walkRight', true);
                hasKeyboardInput = true;
            } else if (this.cursors.up.isDown) {
                velocityY = -speed;
                this.player.anims.play('walkUp', true);
                hasKeyboardInput = true;
            } else if (this.cursors.down.isDown) {
                velocityY = speed;
                this.player.anims.play('walkDown', true);
                hasKeyboardInput = true;
            }

            // 키보드 입력이 있으면 터치 입력 비활성화
            if (hasKeyboardInput) {
                this.isTouchInputActive = false;
                this.targetPosition = { x: this.player.x, y: this.player.y };
                this.isMovingX = false;
            }

            // 터치 입력 처리 (터치 입력이 활성화된 경우에만)
            if (!hasKeyboardInput && velocityX === 0 && velocityY === 0 && this.isTouchInputActive) {
                const dx = this.targetPosition.x - this.player.x;
                const dy = this.targetPosition.y - this.player.y;

                if (this.isMovingX) {
                    if (Math.abs(dx) > 5) {
                        if (dx > 0) {
                            velocityX = speed;
                            this.player.anims.play('walkRight', true);
                        } else {
                            velocityX = -speed;
                            this.player.anims.play('walkLeft', true);
                        }
                    } else {
                        this.isMovingX = false;
                    }
                } else {
                    if (Math.abs(dy) > 5) {
                        if (dy > 0) {
                            velocityY = speed;
                            this.player.anims.play('walkDown', true);
                        } else {
                            velocityY = -speed;
                            this.player.anims.play('walkUp', true);
                        }
                    } else {
                        this.player.setVelocity(0);
                        this.player.anims.stop();
                        this.isTouchInputActive = false; // 목표에 도달하면 터치 입력 비활성화
                    }
                }
            } else if (velocityX === 0 && velocityY === 0) {
                // 키보드 입력 후 멈췄을 때 애니메이션 정지
                this.player.setVelocity(0);
                this.player.anims.stop();
            }
        } else {
            this.player.setVelocity(0);
            this.player.anims.stop();
        }

        this.player.setVelocity(velocityX, velocityY);
    }

    shutdown() {
        if (this.entranceBgm) {
            this.entranceBgm.stop();
            this.entranceBgm.destroy();
        }
    }
}

class ReceptionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ReceptionScene' });
    }

    init(data) {
        if (data && data.returnToEntrance) {
            this.playerStartX = 400;
            this.playerStartY = 550;
        } else {
            this.playerStartX = 400;
            this.playerStartY = 550;
        }
    }

    preload() {
        this.load.image('receptionBg', 'assets/reception.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 48, frameHeight: 48 });
        // this.load.audio('receptionBgm', 'assets/entrance_bgm.mp3');
    }

    create() {
        this.add.image(400, 300, 'receptionBg');
        this.player = this.physics.add.sprite(this.playerStartX, this.playerStartY, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setFrame(4);

        // // BGM 재생
        // if (this.sound.get('receptionBgm')) {
        //     // this.sound.removeByKey('receptionBgm');
        // } else {
        //     this.receptionBgm = this.sound.add('receptionBgm', { volume: 0.5, loop: true });
        //     this.receptionBgm.play();
        // }

        // NPC 생성
        this.npc = this.physics.add.sprite(400, 165, 'player');
        this.npc.setImmovable(true);
        this.npc.setFrame(52);

        // 애니메이션 설정
        this.anims.create({
            key: 'walkLeft',
            frames: this.anims.generateFrameNumbers('player', { start: 15, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walkRight',
            frames: this.anims.generateFrameNumbers('player', { start: 27, end: 29 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walkUp',
            frames: this.anims.generateFrameNumbers('player', { start: 39, end: 41 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walkDown',
            frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // 입력 설정
        this.cursors = this.input.keyboard.createCursorKeys();
        this.targetPosition = { x: this.player.x, y: this.player.y };
        this.isMovingX = false;
        this.isTouchInputActive = false; // 터치 입력 활성화 상태 추가

        // 이동 불가능 영역 (벽면) 설정
        this.walls = [
            this.physics.add.staticBody(0, 150, 800, 80),
        ];
        this.walls.forEach(wall => {
            this.physics.add.collider(this.player, wall, () => {
                // 벽에 충돌 시 목표 경로를 현재 위치로 변경
                this.targetPosition = { x: this.player.x, y: this.player.y };
                this.isTouchInputActive = false; // 터치 입력 비활성화
                this.isMovingX = false;
                this.player.anims.stop(); // 애니메이션 정지
            });
        });

        // 터치 입력 처리
        this.input.on('pointerdown', (pointer) => {
            if (this.physics.world.overlap(this.player, this.npcZone) && !this.isInteracting) {
                this.handleNpcInteraction();
            } else if (this.isInteracting && this.isTextComplete) {
                this.hideDescription();
                this.scene.start('GalleryScene', { returnToEntrance: false });
            }
            if (!this.isInteracting) {
                this.targetPosition.x = pointer.x;
                this.targetPosition.y = pointer.y;
                this.isMovingX = true;
                this.isTouchInputActive = true; // 터치 입력 활성화
            }
        });

        // NPC 상호작용 Zone
        this.npcZone = this.add.zone(400, 165, 70, 180);
        this.physics.add.existing(this.npcZone);
        this.physics.add.overlap(this.player, this.npcZone, () => {
            // this.showInteractionPrompt();
        }, null, this);

        // Spacebar 입력 설정
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.physics.world.overlap(this.player, this.npcZone) && !this.isInteracting) {
                this.handleNpcInteraction();
            } else if (this.isInteracting && this.isTextComplete) {
                this.hideDescription();
                this.scene.start('GalleryScene', { returnToEntrance: false });
            }
        });

        // 초기 상태
        this.isInteracting = false;
        this.isTextComplete = false; // 초기화 추가
    }

    update() {
        const speed = 200;
        let velocityX = 0;
        let velocityY = 0;

        if (!this.isInteracting) {
            // 키보드 입력 처리
            let hasKeyboardInput = false;
            if (this.cursors.left.isDown) {
                velocityX = -speed;
                this.player.anims.play('walkLeft', true);
                hasKeyboardInput = true;
            } else if (this.cursors.right.isDown) {
                velocityX = speed;
                this.player.anims.play('walkRight', true);
                hasKeyboardInput = true;
            } else if (this.cursors.up.isDown) {
                velocityY = -speed;
                this.player.anims.play('walkUp', true);
                hasKeyboardInput = true;
            } else if (this.cursors.down.isDown) {
                velocityY = speed;
                this.player.anims.play('walkDown', true);
                hasKeyboardInput = true;
            }

            // 키보드 입력이 있으면 터치 입력 비활성화
            if (hasKeyboardInput) {
                this.isTouchInputActive = false;
                this.targetPosition = { x: this.player.x, y: this.player.y };
                this.isMovingX = false;
            }

            // 터치 입력 처리 (터치 입력이 활성화된 경우에만)
            if (!hasKeyboardInput && velocityX === 0 && velocityY === 0 && this.isTouchInputActive) {
                const dx = this.targetPosition.x - this.player.x;
                const dy = this.targetPosition.y - this.player.y;

                if (this.isMovingX) {
                    if (Math.abs(dx) > 5) {
                        if (dx > 0) {
                            velocityX = speed;
                            this.player.anims.play('walkRight', true);
                        } else {
                            velocityX = -speed;
                            this.player.anims.play('walkLeft', true);
                        }
                    } else {
                        this.isMovingX = false;
                    }
                } else {
                    if (Math.abs(dy) > 5) {
                        if (dy > 0) {
                            velocityY = speed;
                            this.player.anims.play('walkDown', true);
                        } else {
                            velocityY = -speed;
                            this.player.anims.play('walkUp', true);
                        }
                    } else {
                        this.player.setVelocity(0);
                        this.player.anims.stop();
                        this.isTouchInputActive = false; // 목표에 도달하면 터치 입력 비활성화
                    }
                }
            } else if (velocityX === 0 && velocityY === 0) {
                // 키보드 입력 후 멈췄을 때 애니메이션 정지
                this.player.setVelocity(0);
                this.player.anims.stop();
            }
        } else {
            this.player.setVelocity(0);
            this.player.anims.stop();
        }

        this.player.setVelocity(velocityX, velocityY);
    }

    showDescription(text, imageKey) {
        const dialogBox = this.add.rectangle(400, 550, 600, 80, 0x000000, 0.8);
        const dialogText = this.add.text(400, 550, '', { 
            fontSize: '16px', 
            color: '#fff', 
            align: 'center', 
            wordWrap: { width: 580 }
        }).setOrigin(0.5);

        dialogBox.setDepth(10);
        dialogText.setDepth(11);

        this.isInteracting = true;
        this.isTextComplete = false;
        this.typeText(text, dialogText, this, () => {
            this.isTextComplete = true;
        });

        this.dialogBox = dialogBox;
        this.dialogText = dialogText;
    }
    
    hideDescription() {
        if (this.dialogBox && this.dialogText) {
            this.dialogBox.destroy();
            this.dialogText.destroy();
        }
        this.dialogBox = null;
        this.dialogText = null;
        this.isInteracting = false;
        this.isTextComplete = false;
    }
 
    typeText(text, targetText, scene, callback) {
        let currentIndex = 0;
        let letEnterIdx = 0;
        let line_cnt = 1;
        const typingSpeed = 100;
    
        const typeEvent = scene.time.addEvent({
            delay: typingSpeed,
            callback: () => {
                if (currentIndex < text.length) {
                    targetText.setText(targetText.text + text[currentIndex]);
                    currentIndex++;
                    letEnterIdx++;
                    if (text[currentIndex] === '\n') {
                        letEnterIdx = 0;
                        line_cnt++;
                        if (line_cnt > 2) {
                            targetText.setText('');
                            line_cnt = 1;
                        }
                    } else if (letEnterIdx > 20) {
                        targetText.setText(targetText.text + '\n');
                        letEnterIdx = 0;
                        line_cnt++;
                        if (line_cnt > 2) {
                            targetText.setText('');
                            line_cnt = 1;
                        }
                    }
                } else {
                    typeEvent.remove();
                    if (callback) {
                        callback();
                        console.log('Callback executed, currentIndex:', currentIndex, 'text.length:', text.length);
                    }
                }
            },
            repeat: text.length
        });
    }

    handleNpcInteraction() {
        this.isInteracting = true;
        const dialogText = '가나다라마바사아자차카타파하1가나다라마바사아자차카타파하2가나다라마바사아자차카타파하3가나다라마바사아자차카타파하4가나다라마바사아자차카타파하5';
        this.showDescription(dialogText, null);
    }

    shutdown() {
        if (this.receptionBgm) {
            this.receptionBgm.stop();
            this.receptionBgm.destroy();
        }
        if (this.interactionText) {
            this.interactionText.destroy();
        }
    }
}

class GalleryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GalleryScene' });
    }
    
    init(data) {
        if (data && data.returnToEntrance) {
            this.playerStartX = 400;
            this.playerStartY = 0;
        } else {
            this.playerStartX = 400;
            this.playerStartY = 550;
        }
    }

    preload() {
        this.load.image('galleryBg', 'assets/gallery.png');
        this.load.image('painting1', 'assets/painting1.png');
        this.load.image('painting2', 'assets/painting2.png');
        this.load.image('painting3', 'assets/painting3.png');
        this.load.image('painting4', 'assets/painting4.png');
        this.load.image('painting5', 'assets/painting5.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
        this.load.audio('galleryBgm', 'assets/gallery_bgm.mp3');
    }

    create() {
        this.add.image(400, 300, 'galleryBg');
        this.player = this.physics.add.sprite(this.playerStartX, this.playerStartY, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setFrame(4);

        // BGM 재생 (주석 처리 유지)
        // if (this.sound.get('galleryBgm')) {
        //     // this.sound.removeByKey('galleryBgm');
        // } else {
        //     this.galleryBgm = this.sound.add('galleryBgm', { volume: 0.5, loop: true });
        //     this.galleryBgm.play();
        // }

        // 애니메이션 설정
        this.anims.create({
            key: 'walkLeft',
            frames: this.anims.generateFrameNumbers('player', { start: 15, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walkRight',
            frames: this.anims.generateFrameNumbers('player', { start: 27, end: 29 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walkUp',
            frames: this.anims.generateFrameNumbers('player', { start: 39, end: 41 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walkDown',
            frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // 입력 설정
        this.cursors = this.input.keyboard.createCursorKeys();
        this.targetPosition = { x: this.player.x, y: this.player.y };
        this.isMovingX = false;
        this.isTouchInputActive = false; // 터치 입력 활성화 상태 추가

        // 터치 입력 처리
        this.input.on('pointerdown', (pointer) => {
            if (!this.isInteracting) {
                this.targetPosition.x = pointer.x;
                this.targetPosition.y = pointer.y;
                this.isMovingX = true;
                this.isTouchInputActive = true; // 터치 입력 활성화
            }
        });

        // 이동 불가능 영역 (벽면) 설정
        this.walls = [
            this.physics.add.staticBody(0, 0, 800, 160),
            this.physics.add.staticBody(0, 0, 20, 600),
            this.physics.add.staticBody(780, 0, 20, 600),
            this.physics.add.staticBody(0, 590, 330, 10),
            this.physics.add.staticBody(480, 590, 330, 10),
            this.physics.add.staticBody(0, 270, 330, 120),
            this.physics.add.staticBody(480, 270, 320, 120)
        ];
        this.walls.forEach(wall => {
            this.physics.add.collider(this.player, wall, () => {
                // 벽에 충돌 시 목표 경로를 현재 위치로 변경
                this.targetPosition = { x: this.player.x, y: this.player.y };
                this.isTouchInputActive = false; // 터치 입력 비활성화
                this.isMovingX = false;
                this.player.anims.stop(); // 애니메이션 정지
            });
        });

        // 출구 Zone
        this.exitZone = this.add.zone(335, 600, 200, 5);
        this.physics.add.existing(this.exitZone);
        this.physics.add.overlap(this.player, this.exitZone, () => {
            this.player.setVelocity(0);
            this.player.anims.stop();
            this.scene.start('EntranceScene', { returnToEntrance: true });
        });

        // Spacebar 입력 설정
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.isInteracting) {
                this.hideDescription();
            } else {
                this.checkPaintingInteraction();
            }
        });

        // 초기 상태
        this.isInteracting = false;
        this.currentPaintingDesc = null;
        this.currentZone = null;

        // 그림 설정
        const paintings = [
            { x: 130, y: 150, x_zone: 100, y_zone: 50, key: 'painting1', desc: '해가 예쁘당해가 예쁘당해가 예쁘당해가 예쁘당해가 예쁘당해가 예쁘당', imageKey: 'painting1' },
            { x: 285, y: 150, x_zone: 30, y_zone: 50, key: 'painting2', desc: 'An abstract art piece.', imageKey: 'painting2' },
            { x: 400, y: 150, x_zone: 60, y_zone: 50, key: 'painting3', desc: 'A starry night scene.', imageKey: 'painting3' },
            { x: 525, y: 150, x_zone: 30, y_zone: 50, key: 'painting4', desc: 'A peaceful landscape.', imageKey: 'painting4' },
            { x: 680, y: 150, x_zone: 100, y_zone: 50, key: 'painting5', desc: 'A modern portrait.', imageKey: 'painting5' }
        ];

        this.paintingZones = [];
        this.paintings = paintings;
        this.paintingImages = [];

        paintings.forEach((p, index) => {
            const zone = this.add.zone(p.x, p.y, p.x_zone, p.y_zone);
            this.physics.add.existing(zone);
            this.physics.add.overlap(this.player, zone, () => {
                this.currentZone = zone;
            });
            this.paintingZones.push(zone);

            const paintingImage = this.add.image(0, 0, p.imageKey).setVisible(false);
            paintingImage.setDisplaySize(150, 150);
            this.paintingImages.push(paintingImage);
        });
    }

    update() {
        const speed = 200;
        let velocityX = 0;
        let velocityY = 0;

        if (!this.isInteracting) {
            // 키보드 입력 처리
            let hasKeyboardInput = false;
            if (this.cursors.left.isDown) {
                velocityX = -speed;
                this.player.anims.play('walkLeft', true);
                hasKeyboardInput = true;
            } else if (this.cursors.right.isDown) {
                velocityX = speed;
                this.player.anims.play('walkRight', true);
                hasKeyboardInput = true;
            } else if (this.cursors.up.isDown) {
                velocityY = -speed;
                this.player.anims.play('walkUp', true);
                hasKeyboardInput = true;
            } else if (this.cursors.down.isDown) {
                velocityY = speed;
                this.player.anims.play('walkDown', true);
                hasKeyboardInput = true;
            }

            // 키보드 입력이 있으면 터치 입력 비활성화
            if (hasKeyboardInput) {
                this.isTouchInputActive = false;
                this.targetPosition = { x: this.player.x, y: this.player.y };
                this.isMovingX = false;
            }

            // 터치 입력 처리 (터치 입력이 활성화된 경우에만)
            if (!hasKeyboardInput && velocityX === 0 && velocityY === 0 && this.isTouchInputActive) {
                const dx = this.targetPosition.x - this.player.x;
                const dy = this.targetPosition.y - this.player.y;

                if (this.isMovingX) {
                    if (Math.abs(dx) > 5) {
                        if (dx > 0) {
                            velocityX = speed;
                            this.player.anims.play('walkRight', true);
                        } else {
                            velocityX = -speed;
                            this.player.anims.play('walkLeft', true);
                        }
                    } else {
                        this.isMovingX = false;
                    }
                } else {
                    if (Math.abs(dy) > 5) {
                        if (dy > 0) {
                            velocityY = speed;
                            this.player.anims.play('walkDown', true);
                        } else {
                            velocityY = -speed;
                            this.player.anims.play('walkUp', true);
                        }
                    } else {
                        this.player.setVelocity(0);
                        this.player.anims.stop();
                        this.isTouchInputActive = false; // 목표에 도달하면 터치 입력 비활성화
                    }
                }
            } else if (velocityX === 0 && velocityY === 0) {
                // 키보드 입력 후 멈췄을 때 애니메이션 정지
                this.player.setVelocity(0);
                this.player.anims.stop();
            }
        } else {
            this.player.setVelocity(0);
            this.player.anims.stop();
        }

        this.player.setVelocity(velocityX, velocityY);
    }

    checkPaintingInteraction() {
        if (this.currentZone) {
            this.paintingZones.forEach((zone, index) => {
                if (zone === this.currentZone && this.physics.world.overlap(this.player, zone)) {
                    const painting = this.paintings[index];
                    this.showDescription(painting.desc, painting.imageKey);
                    this.isInteracting = true;
                    this.currentPaintingDesc = painting.desc;
                    this.currentZone = null;
                }
            });
        }
    }

    showDescription(text, imageKey) {
        const paintingImage = this.paintingImages[this.paintings.findIndex(p => p.imageKey === imageKey)];
        paintingImage.setPosition(400, 250);
        paintingImage.setVisible(true);
        paintingImage.setDepth(12);
        paintingImage.setDisplaySize(400, 400);

        const frame = this.add.rectangle(400, 250, 400, 400, 0x000000, 0);
        frame.setDepth(13);
        frame.setStrokeStyle(10, 0x8B4513, 1);

        const dialogBox = this.add.rectangle(400, 550, 600, 100, 0x000000, 0.8);
        const dialogText = this.add.text(400, 550, text, { 
            fontSize: '16px', 
            color: '#fff', 
            align: 'center', 
            wordWrap: { width: 560 }
        }).setOrigin(0.5);

        dialogBox.setDepth(10);
        dialogText.setDepth(11);

        this.dialogBox = dialogBox;
        this.dialogText = dialogText;
        this.currentPaintingImage = paintingImage;
        this.frame = frame;
    }
    
    hideDescription() {
        if (this.dialogBox && this.dialogText) {
            this.dialogBox.destroy();
            this.dialogText.destroy();
        }
        if (this.currentPaintingImage) {
            this.currentPaintingImage.setVisible(false);
            this.currentPaintingImage.setPosition(0, 0);
        }
        if (this.frame) {
            this.frame.destroy();
        }
        this.isInteracting = false;
        this.currentPaintingDesc = null;
        this.currentPaintingImage = null;
        this.frame = null;
    }

    shutdown() {
        if (this.galleryBgm) {
            this.galleryBgm.stop();
            this.galleryBgm.destroy();
        }
    }
}

// 게임 설정
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [EntranceScene, ReceptionScene, GalleryScene]
};

// 게임 초기화
const game = new Phaser.Game(config);