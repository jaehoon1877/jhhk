// EntranceScene 정의
class EntranceScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EntranceScene' });
    }

    init(data) {
        // GalleryScene에서 돌아올 때 위치 데이터를 받음
        if (data && data.returnToEntrance) {
            this.playerStartX = 400; // 문 앞 x 좌표
            this.playerStartY = 300; // 문 앞 y 좌표
        } else {
            // 처음 시작할 때 위치 (기존 설정 유지)
            this.playerStartX = 400;
            this.playerStartY = 550;
        }
    }

    preload() {
        this.load.image('entranceBg', 'assets/entrance.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 48, frameHeight: 48 });
        this.load.audio('entranceBgm', 'assets/entrance_bgm.mp3'); // 밝고 평화로운 잔잔한 음악 (MP3 파일 필요)
    }

create() {
    this.add.image(400, 300, 'entranceBg');
    this.player = this.physics.add.sprite(this.playerStartX, this.playerStartY, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setFrame(4); // 기본 프레임(정지 상태)로 설정


    // BGM 재생 
    if (this.sound.get('entranceBgm')) {
        // this.sound.removeByKey('entranceBgm');
    }
    else {
        this.entranceBgm = this.sound.add('entranceBgm', { volume: 0.5, loop: true });
        this.entranceBgm.play();
    }

    // 나머지 코드 (애니메이션, 입력, Zone 등 유지)
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

    this.cursors = this.input.keyboard.createCursorKeys();
    this.targetPosition = { x: this.player.x, y: this.player.y };
    this.isMovingX = false; // 가로 이동 중인지 추적

    this.input.on('pointerdown', (pointer) => {
        this.targetPosition.x = pointer.x;
        this.targetPosition.y = pointer.y;
        this.isMovingX = true; // 터치 시 가로 이동부터 시작
    });

    this.entryZone = this.add.zone(400, 220, 100, 50);
    this.physics.add.existing(this.entryZone);
    this.physics.add.overlap(this.player, this.entryZone, () => {
        this.scene.start('GalleryScene');
    });
}

    update() {
        const speed = 200;
        let velocityX = 0;
        let velocityY = 0;

        // 키보드 입력 처리
        if (this.cursors.left.isDown) {
            velocityX = -speed;
            this.player.anims.play('walkLeft', true);
        } else if (this.cursors.right.isDown) {
            velocityX = speed;
            this.player.anims.play('walkRight', true);
        } else if (this.cursors.up.isDown) {
            velocityY = -speed;
            this.player.anims.play('walkUp', true);
        } else if (this.cursors.down.isDown) {
            velocityY = speed;
            this.player.anims.play('walkDown', true);
        }

        // 터치 입력 처리
        if (velocityX === 0 && velocityY === 0) {
            const dx = this.targetPosition.x - this.player.x;
            const dy = this.targetPosition.y - this.player.y;

            if (this.isMovingX) { // 가로 이동 먼저
                if (Math.abs(dx) > 5) {
                    if (dx > 0) {
                        velocityX = speed;
                        this.player.anims.play('walkRight', true);
                    } else {
                        velocityX = -speed;
                        this.player.anims.play('walkLeft', true);
                    }
                } else {
                    this.isMovingX = false; // 가로 이동 끝나면 세로로 전환
                }
            } else { // 세로 이동
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
                }
            }
        } else {
            this.targetPosition = { x: this.player.x, y: this.player.y }; // 키보드 이동 시 터치 목표 초기화
            this.isMovingX = false;
        }

        // 속도 적용
        this.player.setVelocity(velocityX, velocityY);
    }

    shutdown() {
        // 씬 종료 시 BGM 정지
        if (this.entranceBgm) {
            this.entranceBgm.stop();
            this.entranceBgm.destroy();
        }
    }
}


// GalleryScene 정의
class GalleryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GalleryScene' });
    }
    
    init(data) {
        // GalleryScene에서 돌아올 때 위치 데이터를 받음
        if (data && data.returnToEntrance) {
            this.playerStartX = 400; // 문 앞 x 좌표
            this.playerStartY = 0; // 문 앞 y 좌표
        } else {
            // 처음 시작할 때 위치 (기존 설정 유지)
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
        // this.load.image('painting6', 'assets/painting6.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
        this.load.audio('galleryBgm', 'assets/gallery_bgm.mp3'); // 갤러리에 어울리는 고요하고 예술적인 음악 (MP3 파일 필요)
    }

    create() {
        // 배경 이미지 추가
        this.add.image(400, 300, 'galleryBg');
        
        // 플레이어 생성
        this.player = this.physics.add.sprite(this.playerStartX, this.playerStartY, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setFrame(4);
        
        // // BGM 재생 
        // if (this.sound.get('gallery_bgm')) {
        //     // this.sound.removeByKey('gallery_bgm');
        // }
        // else {
        //     this.gallery_bgm = this.sound.add('gallery_bgm', { volume: 0.5, loop: true });
        //     this.gallery_bgm.play();
        // }
    
        // 나머지 코드 (애니메이션, 입력, 벽, 출구, 그림 등 유지)
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
        
        this.input.on('pointerdown', (pointer) => {
            this.targetPosition.x = pointer.x;
            this.targetPosition.y = pointer.y;
            this.isMovingX = true;
        });
        
        // 이동 불가능 영역 (벽면) 설정
        const walls = [
            // 상단 벽
            this.physics.add.staticBody(0, 0, 800, 160), // 상단 전체 벽 (y=0~160)
            // 좌측 벽
            this.physics.add.staticBody(0, 0, 20, 600), // 좌측 벽 (x=0~20, y=0~600)
            // 우측 벽
            this.physics.add.staticBody(780, 0, 20, 600), // 우측 벽 (x=780~800, y=0~600)
            // 중앙 하단 벽(좌)
            this.physics.add.staticBody(0, 590, 330, 10), // 중앙 하단 좌측 벽 (x=0~330, y=590~600)
            // 중앙 하단 벽(우)
            this.physics.add.staticBody(480, 590, 330, 10), // 중앙 하단 우측 벽 (x=480~810, y=590~600)
            // 계단 좌측 벽
            this.physics.add.staticBody(0, 270, 330, 120), // 좌측 계단 벽 (x=0~330, y=270~390)
            // 계단 우측 벽
            this.physics.add.staticBody(480, 270, 320, 120)  // 우측 계단 벽 (x=480~800, y=270~390)
        ];
        
        // 플레이어와 벽면 충돌 설정
        walls.forEach(wall => {
            this.physics.add.collider(this.player, wall);
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
                // Spacebar를 두 번째 누르면 상호작용 종료
                this.hideDescription();
            } else {
                // Spacebar를 처음 누르면 그림과의 상호작용 체크
                this.checkPaintingInteraction();
            }
        });
    
        // 초기 상태: 상호작용 없음
        this.isInteracting = false;
        this.currentPaintingDesc = null;
        this.currentZone = null; // 현재 Zone 저장 변수 초기화
        this.lastDirectionFrame = 4; // 기본 방향 (아래)
    
        // 그림 이미지 초기 숨김 및 크기 설정
        const paintings = [
            { x: 130, y: 150, x_zone: 100, y_zone: 50, key: 'painting1', desc: '해가 예쁘당해가 예쁘당해가 예쁘당해가 예쁘당해가 예쁘당해가 예쁘당', imageKey: 'painting1' },
            { x: 285, y: 150, x_zone: 30, y_zone: 50, key: 'painting2', desc: 'An abstract art piece.', imageKey: 'painting2' },
            { x: 400, y: 150, x_zone: 60, y_zone: 50, key: 'painting3', desc: 'A starry night scene.', imageKey: 'painting3' },
            { x: 525, y: 150, x_zone: 30, y_zone: 50, key: 'painting4', desc: 'A peaceful landscape.', imageKey: 'painting4' },
            { x: 680, y: 150, x_zone: 100, y_zone: 50, key: 'painting5', desc: 'A modern portrait.', imageKey: 'painting5' }
            // { x: 750, y: 350, x_zone: 30, y_zone: 50, key: 'painting6', desc: 'A historic artwork.', imageKey: 'painting6' }
        ];
    
        this.paintingZones = [];
        this.paintings = paintings; // 전역으로 paintings 배열 저장
        this.paintingImages = []; // 그림 이미지 참조 저장
    
        paintings.forEach((p, index) => {
            // Zone 설정 (평소에는 보이지 않음, 상호작용으로만 표시)
            const zone = this.add.zone(p.x, p.y, p.x_zone, p.y_zone);
            this.physics.add.existing(zone);
            this.physics.add.overlap(this.player, zone, () => {
                this.currentZone = zone; // Zone에 들어가면 현재 Zone 저장, 상호작용은 하지 않음
            });
            this.paintingZones.push(zone);
    
            // 그림 이미지 생성하지만 초기에는 숨김, 150x150 크기로 비율 유지
            const paintingImage = this.add.image(0, 0, p.imageKey).setVisible(false);
            paintingImage.setDisplaySize(150, 150); // 비율 유지하면서 150x150 크기로 설정
            this.paintingImages.push(paintingImage);
        });
    }

    update() {
        const speed = 200;
        let velocityX = 0;
        let velocityY = 0;

        // 상호작용 중이 아닌 경우에만 입력 처리
        if (!this.isInteracting) {
            // 키보드 입력 처리 (마지막 방향 저장)
            if (this.cursors.left.isDown) {
                velocityX = -speed;
                this.player.anims.play('walkLeft', true);
                this.lastDirectionFrame = 15; // 왼쪽 이동 중 프레임 저장 (첫 번째 프레임)
            } else if (this.cursors.right.isDown) {
                velocityX = speed;
                this.player.anims.play('walkRight', true);
                this.lastDirectionFrame = 27; // 오른쪽 이동 중 프레임 저장 (첫 번째 프레임)
            } else if (this.cursors.up.isDown) {
                velocityY = -speed;
                this.player.anims.play('walkUp', true);
                this.lastDirectionFrame = 39; // 위 이동 중 프레임 저장 (첫 번째 프레임)
            } else if (this.cursors.down.isDown) {
                velocityY = speed;
                this.player.anims.play('walkDown', true);
                this.lastDirectionFrame = 3; // 아래 이동 중 프레임 저장 (첫 번째 프레임)
            }
        
            // 터치 입력 처리
            if (velocityX === 0 && velocityY === 0) {
                const dx = this.targetPosition.x - this.player.x;
                const dy = this.targetPosition.y - this.player.y;
        
                if (this.isMovingX) { // 가로 이동 먼저
                    if (Math.abs(dx) > 5) {
                        if (dx > 0) {
                            velocityX = speed;
                            this.player.anims.play('walkRight', true);
                            this.lastDirectionFrame = 27; // 오른쪽 이동 중 프레임 저장
                        } else {
                            velocityX = -speed;
                            this.player.anims.play('walkLeft', true);
                            this.lastDirectionFrame = 15; // 왼쪽 이동 중 프레임 저장
                        }
                    } else {
                        this.isMovingX = false; // 가로 이동 끝나면 세로로 전환
                    }
                } else { // 세로 이동
                    if (Math.abs(dy) > 5) {
                        if (dy > 0) {
                            velocityY = speed;
                            this.player.anims.play('walkDown', true);
                            this.lastDirectionFrame = 3; // 아래 이동 중 프레임 저장
                        } else {
                            velocityY = -speed;
                            this.player.anims.play('walkUp', true);
                            this.lastDirectionFrame = 39; // 위 이동 중 프레임 저장
                        }
                    } else {
                        this.player.setVelocity(0);
                        this.player.anims.stop();
                        // 이동이 끝난 후 마지막 방향 프레임 유지
                        if (this.lastDirectionFrame !== undefined) {
                            this.player.setFrame(this.lastDirectionFrame);
                        } else {
                            this.player.setFrame(this.player.frame.index || 4); // 현재 프레임 또는 기본값 (아래 방향)
                        }
                    }
                }
            } else {
                this.targetPosition = { x: this.player.x, y: this.player.y }; // 키보드 이동 시 터치 목표 초기화
                this.isMovingX = false;
            }
        } else {
            // 상호작용 중일 때는 캐릭터 위치 유지, 현재 프레임 유지
            this.player.setVelocity(0);
            if (this.player.anims.currentAnim) {
                this.player.anims.stop(); // 애니메이션 정지, 현재 프레임 유지
            }
            // 상호작용 중 프레임 강제로 설정하지 않고, 마지막 저장된 프레임 유지
            if (this.lastDirectionFrame !== undefined) {
                this.player.setFrame(this.lastDirectionFrame);
            } else if (this.player.frame.index) {
                this.lastDirectionFrame = this.player.frame.index; // 프레임이 없으면 현재 프레임 저장
                this.player.setFrame(this.lastDirectionFrame);
            }
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

                    // 상호작용 시 현재 캐릭터 프레임 저장
                    this.lastDirectionFrame = this.player.frame.index; // 현재 프레임 인덱스 저장
                }
            });
        }
    }

    showDescription(text, imageKey) {
        // 중앙에 그림 이미지 팝업 (기존 오브젝트 위에 표시, 150x150 크기 유지)
        const paintingImage = this.paintingImages[this.paintings.findIndex(p => p.imageKey === imageKey)];
        paintingImage.setPosition(400, 250); // 화면 중앙에 위치
        paintingImage.setVisible(true); // 이미지 표시
        paintingImage.setDepth(12); // 다른 오브젝트 위에 표시
        paintingImage.setDisplaySize(400, 400); // 비율 유지하면서 150x150 크기로 설정

        // 액자 테두리 추가 (검은색 사각형, 그림 크기보다 약간 크게)
        const frame = this.add.rectangle(400, 250, 400, 400, 0x000000, 0); // 검은색 테두리, 150x150 이미지보다 10px씩 크게
        frame.setDepth(13); // 그림 이미지 위에 표시
        frame.setStrokeStyle(10, 0x8B4513, 1); // 나무 질감 느낌의 테두리 (갈색, 두께 4px)

        // 하단에 대화창 표시
        const dialogBox = this.add.rectangle(400, 550, 600, 100, 0x000000, 0.8); // 검은색 반투명 배경
        const dialogText = this.add.text(400, 550, text, { 
            fontSize: '16px', 
            color: '#fff', 
            align: 'center', 
            wordWrap: { width: 560 } 
        }).setOrigin(0.5);

        // 대화창 레이어 관리
        dialogBox.setDepth(10);
        dialogText.setDepth(11);

        this.dialogBox = dialogBox; // 대화창 참조 저장
        this.dialogText = dialogText; // 텍스트 참조 저장
        this.currentPaintingImage = paintingImage; // 현재 표시 중인 그림 이미지 저장
        this.frame = frame; // 액자 테두리 참조 저장
    }
    
    hideDescription() {
        if (this.dialogBox && this.dialogText) {
            this.dialogBox.destroy();
            this.dialogText.destroy();
        }
        if (this.currentPaintingImage) {
            this.currentPaintingImage.setVisible(false); // 그림 이미지 숨김
            this.currentPaintingImage.setPosition(0, 0); // 원래 위치로 복원
        }
        if (this.frame) {
            this.frame.destroy(); // 액자 테두리 제거
        }
        this.isInteracting = false;
        this.currentPaintingDesc = null;
        this.currentPaintingImage = null;
        this.frame = null; // 액자 테두리 참조 초기화

        // 상호작용 후 마지막 방향 프레임으로 복원
        if (this.lastDirectionFrame !== undefined) {
            this.player.setFrame(this.lastDirectionFrame);
        }
    }

    shutdown() {
        // 씬 종료 시 BGM 정지
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
        mode: Phaser.Scale.FIT, // 자동 크기 조정
        // autoCenter: Phaser.Scale.CENTER_BOTH, // 화면 중앙 정렬
    },
    scene: [EntranceScene, GalleryScene]
};

// 게임 초기화
const game = new Phaser.Game(config);