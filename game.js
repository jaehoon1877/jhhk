
class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload() {
        const { width, height } = this.cameras.main;

        // 텍스트 스타일
        const loadingText = this.add.text(width / 2, height / 2 - 50, '로딩 중...', {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: 'Nanum Gothic'
        }).setOrigin(0.5);

        const percentText = this.add.text(width / 2, height / 2, '0%', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const progressBox = this.add.rectangle(width / 2, height / 2 + 40, 320, 50, 0x222222).setOrigin(0.5);
        const progressBar = this.add.rectangle(width / 2 - 150, height / 2 + 40, 0, 30, 0xffffff).setOrigin(0, 0.5);

        // 로딩 진행 표시
        this.load.on('progress', (value) => {
            progressBar.width = 300 * value;
            percentText.setText(parseInt(value * 100) + '%');
        });

        // 로딩 완료
        this.load.on('complete', () => {
            this.cameras.main.fadeOut(100, 0, 0, 0); // 1초 동안 검정색으로 페이드 아웃
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('RooftopScene', { returnToEntrance: false });
        });
        });

        // 👉 여기에 모든 asset preload
        this.load.image('entranceBg', 'assets/entrance.png');
        this.load.image('galleryBg', 'assets/gallery.png');
        this.load.image('receptionBg', 'assets/reception.png');
        this.load.image('rooftopBg', 'assets/rooftop.png');
        this.load.image('ticket', 'assets/ticket_concrete.png');
        this.load.image('ticket_part', 'assets/ticket_part.png');
        this.load.image('envelope', 'assets/envelope.png');
        this.load.image('letter', 'assets/letter.png');
        this.load.image('left', 'assets/left.png');
        this.load.image('right', 'assets/right.png');

        this.load.image('painting1', 'assets/painting1.png');
        this.load.image('painting2', 'assets/painting2.png');
        this.load.image('painting3', 'assets/painting3.png');
        this.load.image('painting4', 'assets/painting4.png');
        this.load.image('painting5', 'assets/painting5.png');
        this.load.image('painting6', 'assets/painting6.png');
        this.load.image('painting7', 'assets/painting7.png');
        this.load.image('painting8', 'assets/painting8.png');
        this.load.image('painting9', 'assets/painting9.png');
        this.load.image('painting10', 'assets/painting10.png');

        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 48, frameHeight: 48 });
        this.load.audio('entranceBgm', 'assets/entrance_bgm.mp3');
        // this.load.audio('letterBgm', 'assets/letter_bgm.mp3'); // 편지 음악
    }
}



class EntranceScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EntranceScene' });
    }

    init(data) {
        if (data && data.returnToEntrance) {
            this.playerStartX = 512;
            this.playerStartY = 500;
        } else {
            this.playerStartX = 512;
            this.playerStartY = 1200;
        }

    }


    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0); // 1초 동안 부드럽게 나타남
        this.isTransitioning = false; // 전환 상태 초기화
        this.transitionStarted=false;
        this.collisionCount = 0;
        this.add.image(512, 640, 'entranceBg');
        this.player = this.physics.add.sprite(this.playerStartX, this.playerStartY, 'player');
        this.player.setScale(2); // 플레이어 크기 조정 (필요에 따라 수정)
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

        // NPC 생성 (위치: x: 400, y: 430)
        this.npc = this.physics.add.sprite(512, 1010, 'player');
        this.npc.setScale(2); // 플레이어 크기 조정 (필요에 따라 수정)
        this.npc.setImmovable(true);
        this.npc.setFrame(59); // NPC 스프라이트 프레임

        // 호랑이 동상1 상호작용
        this.tigerZone1 = this.add.zone(280, 580, 60, 160);
        this.physics.add.existing(this.tigerZone1);
        this.physics.add.overlap(this.player, this.tigerZone1, () => {
            // 상호작용 프롬프트 표시 (필요 시 추가 가능)
        }, null, this);

        // 호랑이 동상2 상호작용
        this.tigerZone2 = this.add.zone(740, 580, 60, 160);
        this.physics.add.existing(this.tigerZone2);
        this.physics.add.overlap(this.player, this.tigerZone2, () => {
            // 상호작용 프롬프트 표시 (필요 시 추가 가능)
        }, null, this);

        // 티켓 조각 관련
        if (this.registry.get('hasReceivedTicket')==false) {
            this.collectedPieces = 0;
            this.totalPieces = 3;
            this.ticketPieces = [];
            const piecePositions = [
                { x: 300, y: 700 },
                { x: 720, y: 700 },
                { x: 510, y: 850 }
            ];
            piecePositions.forEach((pos, index) => {
                const piece = this.physics.add.sprite(pos.x, pos.y, 'ticket_part')
                    .setScale(0.05)
                    .setInteractive()
                    .setDepth(1);
                piece.index = index;
                this.physics.add.overlap(this.player, piece, () => this.collectTicketPiece(piece));
                this.ticketPieces.push(piece);
            });
        } else {
            this.collectedPieces = 3;
        }

        // NPC 상호작용 Zone
        this.npcZone = this.add.zone(512, 1010, 80, 80);
        this.physics.add.existing(this.npcZone);
        this.physics.add.overlap(this.player, this.npcZone, () => {
            // 상호작용 프롬프트 표시 (필요 시 추가 가능)
        }, null, this);

        // 터치 입력 처리
        this.input.on('pointerdown', (pointer) => {
            if (this.isInteracting && this.isWaitingForInput) {
                console.log('Touch: Continuing typing');
                this.isWaitingForInput = false;
                this.continueTyping = true;
            } else if (this.isShowingTicket && this.isWaitingForTicketInput) {
                console.log('Touch: Closing ticket message');
                this.isWaitingForTicketInput = false;
                this.hideTicketAndMessage();
            } else if (!this.isInteracting) {
                if (this.physics.world.overlap(this.player, this.npcZone) &&
                    Phaser.Geom.Rectangle.ContainsPoint(this.npcZone.getBounds(), { x: pointer.x, y: pointer.y })) {
                    this.handleNpcInteraction();
                } else if (this.physics.world.overlap(this.player, this.tigerZone1) &&
                    Phaser.Geom.Rectangle.ContainsPoint(this.tigerZone1.getBounds(), { x: pointer.x, y: pointer.y })) {
                    this.handleTiger1Interaction();
                } else if (this.physics.world.overlap(this.player, this.tigerZone2) &&
                    Phaser.Geom.Rectangle.ContainsPoint(this.tigerZone2.getBounds(), { x: pointer.x, y: pointer.y })) {
                    this.handleTiger2Interaction();           
                } else {
                    this.targetPosition.x = pointer.x;
                    this.targetPosition.y = pointer.y;
                    this.isMovingX = true;
                    this.isTouchInputActive = true; // 터치 입력 활성화
                }
            }
        });

        // Spacebar 입력 설정
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.isInteracting && this.isWaitingForInput) {
                console.log('Space: Continuing typing');
                this.isWaitingForInput = false;
                this.continueTyping = true;
            } else if (this.isShowingTicket && this.isWaitingForTicketInput) {
                console.log('Space: Closing ticket message');
                this.isWaitingForTicketInput = false;
                this.hideTicketAndMessage();
            } else if (!this.isInteracting) {
                if (this.physics.world.overlap(this.player, this.npcZone)) {
                    this.handleNpcInteraction();
                } else if (this.physics.world.overlap(this.player, this.tigerZone1)) {
                    this.handleTiger1Interaction();
                } else if (this.physics.world.overlap(this.player, this.tigerZone2)) {
                    this.handleTiger2Interaction();
                }
            }
                
        });

        // 벽 설정
        this.walls = [
            this.physics.add.staticBody(490, 1000, 45, 45), // NPC

            this.physics.add.staticBody(360, 420, 70, 70),
            this.physics.add.staticBody(590, 420, 70, 70),

            this.physics.add.staticBody(335, 440, 20, 190),
            this.physics.add.staticBody(665, 440, 20, 190),

            this.physics.add.staticBody(145, 600, 210, 30),
            this.physics.add.staticBody(665, 600, 210, 30),

            this.physics.add.staticBody(0, 600, 150, 425),
            this.physics.add.staticBody(870, 600, 150, 425),

            this.physics.add.staticBody(0, 1020, 320, 425),
            this.physics.add.staticBody(700,1020, 320, 425),

        ];
        this.walls.forEach(wall => {
            this.physics.add.collider(this.player, wall, () => {
                if (this.isTouchInputActive) {
                    this.collisionCount += 1;
            
                    if (this.collisionCount >= 3) {
                        // 3번 이상 충돌 시 이동 중지
                        this.isTouchInputActive = false;
                        this.player.setVelocity(0);
                        this.player.anims.stop();
                        this.collisionCount = 0; // 충돌 카운트 초기화
                        console.log('⚠️ 터치 이동 중 충돌 3회 → 이동 중지됨');
                    } else {
                        // 방향 전환
                        this.isMovingX = !this.isMovingX;
                        this.player.setVelocity(0);
                        this.player.anims.stop();
                    }
                }
            });
        });

        // 갤러리 입구 Zone (ReceptionScene으로 이동)
        this.entryZone = this.add.zone(510, 400, 150, 50);
        this.physics.add.existing(this.entryZone);
        this.physics.add.overlap(this.player, this.entryZone, () => {
            if (this.transitionStarted) return; // 이미 페이드 시작했으면 무시

            console.log("Start fadeOut");
            this.transitionStarted = true;     // 플래그 설정
            this.isTransitioning = true;
                this.cameras.main.fadeOut(500, 0, 0, 0); // 1초 동안 검정색으로 페이드 아웃

                this.cameras.main.once('camerafadeoutcomplete', () => {
                    
                this.scene.start('ReceptionScene', { returnToEntrance: true });
            });
        });

        // 초기 상태
        this.isInteracting = false;
        this.isWaitingForInput = false; // ▼ 표시 대기 상태
        this.continueTyping = false; // 텍스트 이어쓰기 상태
        this.isShowingTicket = false; // 입장권 메시지 표시 중인지 여부
    }

    update() {
        const speed = 400;
        let velocityX = 0;
        let velocityY = 0;
        if (this.isTransitioning) {
            // 전환 중에는 플레이어 이동 비활성화
            this.player.setVelocity(0);
            this.player.anims.stop();
            return;
        }

        if (!this.isInteracting && !this.isShowingTicket) {
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
            const tolerance = 10;
            const dx = this.targetPosition.x - this.player.x;
            const dy = this.targetPosition.y - this.player.y;

            let canMoveX = Math.abs(dx) > tolerance;
            let canMoveY = Math.abs(dy) > tolerance;

            if (this.isTouchInputActive) {
                // 현재 X 축 이동 중
                if (this.isMovingX) {
                    if (canMoveX) {
                        velocityX = dx > 0 ? speed : -speed;
                        this.player.anims.play(dx > 0 ? 'walkRight' : 'walkLeft', true);
                    } else {
                        this.player.x = this.targetPosition.x;
                        this.isMovingX = false; // X 완료 → Y로 넘어감
                        this.player.setVelocityX(0);
                    }
                } else {
                    if (canMoveY) {
                        velocityY = dy > 0 ? speed : -speed;
                        this.player.anims.play(dy > 0 ? 'walkDown' : 'walkUp', true);
                    } else {
                        this.player.y = this.targetPosition.y;

                        if (canMoveX) {
                            this.isMovingX = true; // Y 막혔지만 X 남음 → X 시도
                            this.player.setVelocityY(0);
                        } else {
                            // 🎯 둘 다 못 가면 멈추기
                            this.isTouchInputActive = false;
                            this.player.setVelocity(0);
                            this.player.anims.stop();

                            // 마지막으로 좌표 정리
                            this.player.x = this.targetPosition.x;
                            this.player.y = this.targetPosition.y;
                        }
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

    collectTicketPiece(piece) {
        if (!piece.collected) {
            let dialogText;
            if (this.collectedPieces+1 == this.totalPieces) {
                dialogText = `(모든 티켓 조각을 모았습니다.직원에게 돌아가세요.)`;
            } else {
                dialogText = `(티켓 조각을 획득했습니다. ${this.collectedPieces + 1} / ${this.totalPieces}개 )`;
            }
            this.NormalShowDescription(dialogText, null);

            piece.collected = true;
            piece.destroy();
            this.collectedPieces++;
            console.log(`Collected piece ${piece.index + 1}. Total: ${this.collectedPieces}`);
        }
    }

    // 대화창 표시 메서드
    NormalShowDescription(text, imageKey) {
        const dialogBox = this.add.rectangle(0, 1280, 2048, 280, 0x000000, 0.8);
        const dialogText = this.add.text(512, 1210, '', { 
            fontFamily: 'Nanum Gothic',
            fontSize: '30px', 
            color: '#fff', 
            align: 'center', 
            // wordWrap: { width: 700 }
        }).setOrigin(0.5);
        dialogText.setLineSpacing(10);
        dialogBox.setDepth(10);
        dialogText.setDepth(11);

        this.isInteracting = true;
        this.isWaitingForInput = false;
        this.continueTyping = false;

        // ▼ 표시를 위한 텍스트 객체
        this.arrowIndicator = this.add.text(950, 1230, '▼', {
            fontSize: '30px',
            color: '#fff'
        }).setOrigin(0.5).setDepth(11).setVisible(false);

        const callback = () => {
            this.time.delayedCall(500, () => {});
        };

        this.typeText(text, dialogText, this, callback);

        this.dialogBox = dialogBox;
        this.dialogText = dialogText;
    }

    // 대화창 표시 메서드
    showDescription(text, imageKey) {
        const dialogBox = this.add.rectangle(0, 1280, 2048, 280, 0x000000, 0.8);
        const dialogText = this.add.text(512, 1210, '', { 
            fontFamily: 'Nanum Gothic',
            fontSize: '30px', 
            color: '#fff', 
            align: 'center', 
            // wordWrap: { width: 700 }
        }).setOrigin(0.5);
        dialogText.setLineSpacing(10);
        dialogBox.setDepth(10);
        dialogText.setDepth(11);

        
        this.isInteracting = true;
        this.isWaitingForInput = false;
        this.continueTyping = false;

        // ▼ 표시를 위한 텍스트 객체
        this.arrowIndicator = this.add.text(950, 1230, '▼', {
            fontSize: '30px',
            color: '#fff'
        }).setOrigin(0.5).setDepth(11).setVisible(false);

        // 첫 대화가 끝난 후 입장권 이미지와 메시지 표시
        const callback = () => {
            console.log('First NPC conversation finished, preparing to show ticket.');
            // 대화창이 완전히 사라진 후 입장권 표시
            this.time.delayedCall(500, () => {
                this.showTicketAndMessage();
            });
        };

        this.typeText(text, dialogText, this, callback);

        this.dialogBox = dialogBox;
        this.dialogText = dialogText;
    }

    // 입장권 이미지와 "갤러리 입장권을 획득했습니다." 메시지 표시
    showTicketAndMessage() {
        this.isInteracting = true;
        // 입장권 이미지 표시
        this.ticketImage = this.add.image(512, 524, 'ticket').setDepth(12);
        this.ticketImage.setDisplaySize(600, 600); // 입장권 이미지 크기 조정 (필요에 따라 수정)
        this.ticketImage.setAlpha(0);
        this.ticketImage.setVisible(true);
        this.tweens.add({
            targets: this.ticketImage,
            alpha: 1,
            duration: 500,
            ease: 'Linear'
        });
        console.log('Ticket image displayed at (400, 300).');

        // 입장권 획득 메시지 표시
        const ticketMessage = '(갤러리 입장권을 획득했습니다.)';
        const dialogBox = this.add.rectangle(0, 1280, 2048, 280, 0x000000, 0.8);
        const dialogText = this.add.text(512, 1210, '', { 
            fontFamily: 'Nanum Gothic',
            fontSize: '30px', 
            color: '#fff', 
            align: 'center', 
            // wordWrap: { width: 700 }
        }).setOrigin(0.5);
        dialogText.setLineSpacing(10);
        dialogBox.setDepth(10);
        dialogText.setDepth(11);

        this.isShowingTicket = true;
        this.isWaitingForTicketInput = false;

        // ▼ 표시를 위한 텍스트 객체
        this.ticketArrowIndicator = this.add.text(950, 1240, '▼', {
            fontSize: '30px',
            color: '#fff'
        }).setOrigin(0.5).setDepth(11).setVisible(false);

        

        this.typeTicketText(ticketMessage, dialogText, this);

        this.ticketDialogBox = dialogBox;
        this.ticketDialogText = dialogText;
    }

    // 입장권 메시지 숨김 메서드
    hideTicketAndMessage() {
        if (this.ticketDialogBox && this.ticketDialogText) {
            this.ticketDialogBox.destroy();
            this.ticketDialogText.destroy();
        }
        if (this.ticketArrowIndicator) {
            if (this.ticketArrowIndicatorBlinkEvent) {
                this.ticketArrowIndicatorBlinkEvent.remove();
            }
            this.ticketArrowIndicator.destroy();
        }
        if (this.ticketImage) {
            this.ticketImage.destroy();
            console.log('Ticket image removed.');
        }
        this.ticketDialogBox = null;
        this.ticketDialogText = null;
        this.ticketArrowIndicator = null;
        this.ticketArrowIndicatorBlinkEvent = null;
        this.ticketImage = null;
        this.isShowingTicket = false;
        this.isWaitingForTicketInput = false;

        // 전역 상태 업데이트
        this.registry.set('hasReceivedTicket', true);
        console.log('hasReceivedTicket set to true in registry.');
        this.isInteracting = false;
    }

    // 대화창 숨김 메서드
    hideDescription() {
        if (this.dialogBox && this.dialogText) {
            this.dialogBox.destroy();
            this.dialogText.destroy();
        }
        if (this.arrowIndicator) {
            if (this.arrowIndicatorBlinkEvent) {
                this.arrowIndicatorBlinkEvent.remove();
            }
            this.arrowIndicator.destroy();
        }
        this.dialogBox = null;
        this.dialogText = null;
        this.arrowIndicator = null;
        this.arrowIndicatorBlinkEvent = null;
        this.isInteracting = false;
        this.isWaitingForInput = false;
        this.continueTyping = false;
    }

    // 텍스트 타이핑 메서드 (대화창용)
    typeText(text, targetText, scene, callback) {
        let currentIndex = 0;
        let letEnterIdx = 0;
        let line_cnt = 1;
        let is_skip = 0;
        const typingSpeed = 80;

        const typeNextChar = () => {
            // 텍스트 출력이 완료된 경우
            if (currentIndex >= text.length) {
                // ▼ 표시를 띄우고 입력 대기
                console.log('Text fully displayed, waiting for user input at index:', currentIndex);
                scene.isWaitingForInput = true;
                scene.arrowIndicator.setVisible(true);
                // ▼ 깜빡임 효과
                if (scene.arrowIndicatorBlinkEvent) {
                    scene.arrowIndicatorBlinkEvent.remove();
                    scene.arrowIndicatorBlinkEvent = null;
                }
                scene.arrowIndicatorBlinkEvent = scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if (scene.arrowIndicator) {
                            scene.arrowIndicator.setVisible(!scene.arrowIndicator.visible);
                            console.log('Arrow indicator visibility toggled to:', scene.arrowIndicator.visible);
                        }
                    },
                    loop: true
                });
            }

            // ▼ 표시 중 사용자 입력 대기
            if (scene.isWaitingForInput) {
                if (scene.continueTyping) {
                    console.log('Continuing typing after user input');
                    if (currentIndex >= text.length) {
                        // 텍스트가 모두 출력된 경우, 콜백 호출 후 대화창 닫기
                        if (scene.arrowIndicatorBlinkEvent) {
                            scene.arrowIndicatorBlinkEvent.remove();
                            scene.arrowIndicatorBlinkEvent = null;
                        }
                        scene.arrowIndicator.setVisible(false);
                        if (callback) {
                            callback();
                            console.log('Callback executed, currentIndex:', currentIndex, 'text.length:', text.length);
                        }
                        scene.hideDescription(); // 대화창 닫기
                        return; // 루프 종료
                    } else {
                        // 텍스트가 아직 남아있는 경우, 다음 텍스트로 진행
                        if (text[currentIndex] === '\n') {
                            currentIndex++;
                        }
                        targetText.setText(''); // 텍스트 초기화
                        letEnterIdx = 0;
                        line_cnt = 1;
                        scene.isWaitingForInput = false;
                        if (scene.arrowIndicatorBlinkEvent) {
                            scene.arrowIndicatorBlinkEvent.remove();
                            scene.arrowIndicatorBlinkEvent = null;
                        }
                        scene.arrowIndicator.setVisible(false);
                        scene.continueTyping = false;
                    }
                } else {
                    // 사용자 입력을 기다리는 동안 루프 유지
                    scene.time.delayedCall(typingSpeed, typeNextChar);
                    return;
                }
            }

            // 2줄 초과 시 ▼ 표시
            if (line_cnt === 3) {
                if (is_skip === 0) {
                    currentIndex +=1;
                    is_skip = 1;
                }
                scene.isWaitingForInput = true;
                scene.arrowIndicator.setVisible(true);
                // ▼ 깜빡임 효과
                if (scene.arrowIndicatorBlinkEvent) {
                    scene.arrowIndicatorBlinkEvent.remove();
                    scene.arrowIndicatorBlinkEvent = null;
                }
                scene.arrowIndicatorBlinkEvent = scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if (scene.arrowIndicator) {
                            scene.arrowIndicator.setVisible(!scene.arrowIndicator.visible);
                            console.log('Arrow indicator visibility toggled to:', scene.arrowIndicator.visible);
                        }
                    },
                    loop: true
                });
                scene.time.delayedCall(typingSpeed, typeNextChar);
                return;
            }

            // 다음 글자 출력
            targetText.setText(targetText.text + text[currentIndex]);
            currentIndex++;
            letEnterIdx++;

            // 줄바꿈 처리
            if (text[currentIndex] === '\n') {
                letEnterIdx = 0;
                line_cnt++;
            }
            // } else if (letEnterIdx == 35) {
            //     letEnterIdx = 0;
            //     line_cnt++;
            //     if (line_cnt < 3) {
            //         targetText.setText(targetText.text + '\n');
            //     }
            // }

            // 다음 글자 출력
            scene.time.delayedCall(typingSpeed, typeNextChar);
        };

        // 첫 글자부터 시작
        typeNextChar();
    }

    // 입장권 텍스트 타이핑 메서드
    typeTicketText(text, targetText, scene) {
        let currentIndex = 0;
        let letEnterIdx = 0;
        let line_cnt = 1;
        let is_skip = 0;
        const typingSpeed = 80;

        const typeNextChar = () => {
            // 텍스트 출력이 완료된 경우
            if (currentIndex >= text.length) {
                // ▼ 표시를 띄우고 입력 대기
                console.log('Ticket text fully displayed, waiting for user input at index:', currentIndex);
                scene.isWaitingForTicketInput = true;
                scene.ticketArrowIndicator.setVisible(true);
                // ▼ 깜빡임 효과
                if (scene.ticketArrowIndicatorBlinkEvent) {
                    scene.ticketArrowIndicatorBlinkEvent.remove();
                    scene.ticketArrowIndicatorBlinkEvent = null;
                }
                scene.ticketArrowIndicatorBlinkEvent = scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if (scene.ticketArrowIndicator) {
                            scene.ticketArrowIndicator.setVisible(!scene.ticketArrowIndicator.visible);
                            console.log('Ticket arrow indicator visibility toggled to:', scene.ticketArrowIndicator.visible);
                        }
                    },
                    loop: true
                });
                return; // 루프 종료
            }

            // 2줄 초과 시 ▼ 표시 (입장권 메시지는 한 줄이므로 이 조건은 필요 없을 수 있음)
            if (line_cnt === 3) {
                if (is_skip === 0) {
                    currentIndex +=1;
                    is_skip = 1;
                }
                scene.isWaitingForTicketInput = true;
                scene.ticketArrowIndicator.setVisible(true);
                // ▼ 깜빡임 효과
                if (scene.ticketArrowIndicatorBlinkEvent) {
                    scene.ticketArrowIndicatorBlinkEvent.remove();
                    scene.ticketArrowIndicatorBlinkEvent = null;
                }
                scene.ticketArrowIndicatorBlinkEvent = scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if (scene.ticketArrowIndicator) {
                            scene.ticketArrowIndicator.setVisible(!scene.ticketArrowIndicator.visible);
                            console.log('Ticket arrow indicator visibility toggled to:', scene.ticketArrowIndicator.visible);
                        }
                    },
                    loop: true
                });
                scene.time.delayedCall(typingSpeed, typeNextChar);
                return;
            }

            // 다음 글자 출력
            targetText.setText(targetText.text + text[currentIndex]);
            currentIndex++;
            letEnterIdx++;

            // 줄바꿈 처리
            if (text[currentIndex] === '\n') {
                letEnterIdx = 0;
                line_cnt++;
            }
            // } else if (letEnterIdx == 35) {
            //     letEnterIdx = 0;
            //     line_cnt++;
            //     if (line_cnt < 3) {
            //         targetText.setText(targetText.text + '\n');
            //     }
            // }

            // 다음 글자 출력
            scene.time.delayedCall(typingSpeed, typeNextChar);
        };

        // 첫 글자부터 시작
        typeNextChar();
    }

    // NPC 상호작용 처리 메서드
    handleNpcInteraction() {
        this.isInteracting = true;
        let dialogText;
        if (this.registry.get('hasReceivedTicket')==false) {
            if (this.registry.get('isFirstTalk')==true) {
                dialogText = '안녕하세요. 하경님 맞으으시죠? 만나서 반가워요!\nJH님께서 저희 갤러리의 VIP 관람 티켓의 전달을 부탁하셨는데...\n하경님을 마중 가는 길에 실수로 잃어버렸지 뭐예요 ㅠㅠ..\n그래서 혹시 괜찮으시면..\n티켓 조각 찾는 거를 도와주실 수 있을까요??\n조각은 총 3개이고, 아마 여기 어딘가에 떨어져 있을거예요!';
                this.registry.set('isFirstTalk', false);  
            } else {
                if (this.collectedPieces == 3) {
                    dialogText = '모든 조각을 모으셨군요! 감사합니다!\n제가 이 조각들을 완전한 티켓으로 합쳐드릴게요!\n이 티켓을 가지고 갤러리 안으로 들어가시면\n저희 직원이 하경 님의 관람을 도와주실 거예요 :)';
                    this.showDescription(dialogText, null);
                    return
                } else {
                    dialogText = '티켓 조각이 모자라네요 ㅠㅠ\n조각은 총 3개이고, 아마 여기 어딘가에 떨어져 있을 거예요!';
                }
            }
        } else {
            // 두 번째 대화 (이후 반복)
            dialogText = '이 티켓을 가지고 갤러리 안으로 들어가시면\n저희 직원이 하경 님의 관람을 도와주실 거예요 ^^';
        }
        this.NormalShowDescription(dialogText, null);
    }
    // NPC 상호작용 처리 메서드
    handleTiger1Interaction() {
        this.isInteracting = true;
        let dialogText;
        dialogText = '어흥!!!';
        this.NormalShowDescription(dialogText, null);
    }
    handleTiger2Interaction() {
        this.isInteracting = true;
        let dialogText;
        dialogText = '야옹!!!';
        this.NormalShowDescription(dialogText, null);
    }


    shutdown() {
        if (this.entranceBgm) {
            this.entranceBgm.stop();
            this.entranceBgm.destroy();
        }
        if (this.interactionText) {
            this.interactionText.destroy();
        }
        if (this.ticketImage) {
            this.ticketImage.destroy();
        }
    }
}

class ReceptionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ReceptionScene' });
    }

    init(data) {
        if (data && data.returnToReception) {
            this.playerStartX = 512;
            this.playerStartY = 1150;
        } else {
            this.playerStartX = 512;
            this.playerStartY = 1150;
        }

    }


    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0); // 1초 동안 부드럽게 나타남
        this.isTransitioning = false; // 전환 상태 초기화
        this.transitionStarted=false;
        this.collisionCount = 0;
        this.add.image(512, 640, 'receptionBg');
        this.player = this.physics.add.sprite(this.playerStartX, this.playerStartY, 'player');
        this.player.setScale(2); // 플레이어 크기 조정 (필요에 따라 수정)
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
        this.npc = this.physics.add.sprite(512, 250, 'player');
        this.npc.setScale(2); // 플레이어 크기 조정 (필요에 따라 수정)
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
            this.physics.add.staticBody(0, 0, 1210, 200),
            this.physics.add.staticBody(0, 1210, 360, 70),
            this.physics.add.staticBody(664, 1210, 360, 70),
            this.physics.add.staticBody(0, 0, 150, 1280),
            this.physics.add.staticBody(874, 0, 150, 1280),
            this.physics.add.staticBody(315, 0, 410, 360),

        ];
        this.walls.forEach(wall => {
            this.physics.add.collider(this.player, wall, () => {
                if (this.isTouchInputActive) {
                    this.collisionCount += 1;
            
                    if (this.collisionCount >= 3) {
                        // 3번 이상 충돌 시 이동 중지
                        this.isTouchInputActive = false;
                        this.player.setVelocity(0);
                        this.player.anims.stop();
                        this.collisionCount = 0; // 충돌 카운트 초기화
                        console.log('⚠️ 터치 이동 중 충돌 3회 → 이동 중지됨');
                    } else {
                        // 방향 전환
                        this.isMovingX = !this.isMovingX;
                        this.player.setVelocity(0);
                        this.player.anims.stop();
                    }
                }
            });
        });

        // 갤러리 입구 Zone (ReceptionScene으로 이동)
        this.entryZone = this.add.zone(512, 1260, 300, 40);
        this.physics.add.existing(this.entryZone);
        this.physics.add.overlap(this.player, this.entryZone, () => {
            this.scene.start('EntranceScene', { returnToEntrance: true });
        });

        // 터치 입력 처리
        this.input.on('pointerdown', (pointer) => {
            if (this.isInteracting && this.isWaitingForInput) {
                console.log('Touch: Continuing typing');
                this.isWaitingForInput = false;
                this.continueTyping = true;
            } else if (!this.isInteracting) {
                if (this.physics.world.overlap(this.player, this.npcZone) &&
                    Phaser.Geom.Rectangle.ContainsPoint(this.npcZone.getBounds(), { x: pointer.x, y: pointer.y })) {
                    this.handleNpcInteraction();
                } else if (this.physics.world.overlap(this.player,this.painting1Zone) &&
                    Phaser.Geom.Rectangle.ContainsPoint(this.painting1Zone.getBounds(), { x: pointer.x, y: pointer.y })) {
                    this.handlePaintingInteraction();
                } else if (this.physics.world.overlap(this.player, this.painting2Zone) &&
                    Phaser.Geom.Rectangle.ContainsPoint(this.painting2Zone.getBounds(), { x: pointer.x, y: pointer.y })) {
                    this.handlePaintingInteraction();
                } else {    
                    this.targetPosition.x = pointer.x;
                    this.targetPosition.y = pointer.y;
                    this.isMovingX = true;
                    this.isTouchInputActive = true; // 터치 입력 활성화
                }
            }
        });

        // NPC 상호작용 Zone
        this.npcZone = this.add.zone(512, 300, 100, 200);
        this.physics.add.existing(this.npcZone);
        this.physics.add.overlap(this.player, this.npcZone, () => {
            // this.showInteractionPrompt();
        }, null, this);

        // 그림1 상호작용 Zone
        this.painting1Zone = this.add.zone(240, 170, 100, 200);
        this.physics.add.existing(this.painting1Zone);
        this.physics.add.overlap(this.player, this.painting1Zone, () => {
        }, null, this);
        // 그림2 상호작용 Zone
        this.painting2Zone = this.add.zone(785, 170, 100, 200);
        this.physics.add.existing(this.painting2Zone);
        this.physics.add.overlap(this.player, this.painting2Zone, () => {
        }, null, this);

        // Spacebar 입력 설정
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.isInteracting && this.isWaitingForInput) {
                console.log('Space: Continuing typing');
                this.isWaitingForInput = false;
                this.continueTyping = true;
            } else if (!this.isInteracting) {
                if (this.physics.world.overlap(this.player, this.npcZone)) {
                    this.handleNpcInteraction();
                }else if (this.physics.world.overlap(this.player, this.painting1Zone)) {
                    this.handlePaintingInteraction();
                }else if (this.physics.world.overlap(this.player, this.painting2Zone)) {
                    this.handlePaintingInteraction();
                }
            }
        });

        // 초기 상태
        this.isInteracting = false;
        this.isWaitingForInput = false; // ▼ 표시 대기 상태
        this.continueTyping = false; // 텍스트 이어쓰기 상태
    }

    update() {
        const speed = 400;
        let velocityX = 0;
        let velocityY = 0;

          if (this.isTransitioning) {
            this.player.setVelocity(0);
            this.player.anims.stop();
            return;
          }

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
            const tolerance = 10;
            const dx = this.targetPosition.x - this.player.x;
            const dy = this.targetPosition.y - this.player.y;

            let canMoveX = Math.abs(dx) > tolerance;
            let canMoveY = Math.abs(dy) > tolerance;

            if (this.isTouchInputActive) {
                // 현재 X 축 이동 중
                if (this.isMovingX) {
                    if (canMoveX) {
                        velocityX = dx > 0 ? speed : -speed;
                        this.player.anims.play(dx > 0 ? 'walkRight' : 'walkLeft', true);
                    } else {
                        this.player.x = this.targetPosition.x;
                        this.isMovingX = false; // X 완료 → Y로 넘어감
                        this.player.setVelocityX(0);
                    }
                } else {
                    if (canMoveY) {
                        velocityY = dy > 0 ? speed : -speed;
                        this.player.anims.play(dy > 0 ? 'walkDown' : 'walkUp', true);
                    } else {
                        this.player.y = this.targetPosition.y;

                        if (canMoveX) {
                            this.isMovingX = true; // Y 막혔지만 X 남음 → X 시도
                            this.player.setVelocityY(0);
                        } else {
                            // 🎯 둘 다 못 가면 멈추기
                            this.isTouchInputActive = false;
                            this.player.setVelocity(0);
                            this.player.anims.stop();

                            // 마지막으로 좌표 정리
                            this.player.x = this.targetPosition.x;
                            this.player.y = this.targetPosition.y;
                        }
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

    showDescription(text, imageKey, callback) {
        const dialogBox = this.add.rectangle(0, 1280, 2048, 280, 0x000000, 0.8);
        const dialogText = this.add.text(512, 1210, '', { 
            fontFamily: 'Nanum Gothic',
            fontSize: '30px', 
            color: '#fff', 
            align: 'center', 
            // wordWrap: { width: 700 }
        }).setOrigin(0.5);
        dialogText.setLineSpacing(10);
        dialogBox.setDepth(10);
        dialogText.setDepth(11);

        this.isInteracting = true;
        this.isWaitingForInput = false;
        this.continueTyping = false;

        this.arrowIndicator = this.add.text(950, 1230, '▼', {
            fontSize: '30px',
            color: '#fff'
        }).setOrigin(0.5).setDepth(11).setVisible(false);

        this.typeText(text, dialogText, this, callback);

        this.dialogBox = dialogBox;
        this.dialogText = dialogText;
    }
    
    hideDescription() {
        if (this.dialogBox && this.dialogText) {
            this.dialogBox.destroy();
            this.dialogText.destroy();
        }
        if (this.arrowIndicator) {
            if (this.arrowIndicatorBlinkEvent) {
                this.arrowIndicatorBlinkEvent.remove();
            }
            this.arrowIndicator.destroy();
        }
        this.dialogBox = null;
        this.dialogText = null;
        this.arrowIndicator = null;
        this.arrowIndicatorBlinkEvent = null;
        this.isInteracting = false;
        this.isWaitingForInput = false;
        this.continueTyping = false;
    }

    typeText(text, targetText, scene, callback) {
        let currentIndex = 0;
        let letEnterIdx = 0;
        let line_cnt = 1;
        let is_skip = 0;
        const typingSpeed = 80;

        const typeNextChar = () => {
            // 텍스트 출력이 완료된 경우
            if (currentIndex >= text.length) {
                // ▼ 표시를 띄우고 입력 대기
                console.log('Text fully displayed, waiting for user input at index:', currentIndex);
                scene.isWaitingForInput = true;
                scene.arrowIndicator.setVisible(true);
                // ▼ 깜빡임 효과
                if (scene.arrowIndicatorBlinkEvent) {
                    scene.arrowIndicatorBlinkEvent.remove();
                    scene.arrowIndicatorBlinkEvent = null;
                }
                scene.arrowIndicatorBlinkEvent = scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if (scene.arrowIndicator) {
                            scene.arrowIndicator.setVisible(!scene.arrowIndicator.visible);
                            console.log('Arrow indicator visibility toggled to:', scene.arrowIndicator.visible);
                        }
                    },
                    loop: true
                });
            }

            // ▼ 표시 중 사용자 입력 대기
            if (scene.isWaitingForInput) {
                if (scene.continueTyping) {
                    console.log('Continuing typing after user input');
                    if (currentIndex >= text.length) {
                        // 텍스트가 모두 출력된 경우, 콜백 호출 후 대화창 닫기
                        if (scene.arrowIndicatorBlinkEvent) {
                            scene.arrowIndicatorBlinkEvent.remove();
                            scene.arrowIndicatorBlinkEvent = null;
                        }
                        scene.arrowIndicator.setVisible(false);
                        if (callback) {
                            callback();
                            console.log('Callback executed, currentIndex:', currentIndex, 'text.length:', text.length);
                        }
                        return; // 루프 종료
                    } else {
                        // 텍스트가 아직 남아있는 경우, 다음 텍스트로 진행
                        if (text[currentIndex] === '\n') {
                            currentIndex++;
                        }
                        targetText.setText(''); // 텍스트 초기화
                        letEnterIdx = 0;
                        line_cnt = 1;
                        scene.isWaitingForInput = false;
                        if (scene.arrowIndicatorBlinkEvent) {
                            scene.arrowIndicatorBlinkEvent.remove();
                            scene.arrowIndicatorBlinkEvent = null;
                        }
                        scene.arrowIndicator.setVisible(false);
                        scene.continueTyping = false;
                    }
                } else {
                    // 사용자 입력을 기다리는 동안 루프 유지
                    scene.time.delayedCall(typingSpeed, typeNextChar);
                    return;
                }
            }

            // 2줄 초과 시 ▼ 표시
            if (line_cnt === 3) {
                if (is_skip === 0) {
                    currentIndex +=1;
                    is_skip = 1;
                }
                scene.isWaitingForInput = true;
                scene.arrowIndicator.setVisible(true);
                // ▼ 깜빡임 효과
                if (scene.arrowIndicatorBlinkEvent) {
                    scene.arrowIndicatorBlinkEvent.remove();
                    scene.arrowIndicatorBlinkEvent = null;
                }
                scene.arrowIndicatorBlinkEvent = scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if (scene.arrowIndicator) {
                            scene.arrowIndicator.setVisible(!scene.arrowIndicator.visible);
                            console.log('Arrow indicator visibility toggled to:', scene.arrowIndicator.visible);
                        }
                    },
                    loop: true
                });
                scene.time.delayedCall(typingSpeed, typeNextChar);
                return;
            }

            // 다음 글자 출력
            targetText.setText(targetText.text + text[currentIndex]);
            currentIndex++;
            letEnterIdx++;

            // 줄바꿈 처리
            if (text[currentIndex] === '\n') {
                letEnterIdx = 0;
                line_cnt++;
            }
            // } else if (letEnterIdx == 35) {
            //     letEnterIdx = 0;
            //     line_cnt++;
            //     if (line_cnt < 3) {
            //         targetText.setText(targetText.text + '\n');
            //     }
            // }

            // 다음 글자 출력
            scene.time.delayedCall(typingSpeed, typeNextChar);
        };

        // 첫 글자부터 시작
        typeNextChar();
    }

    handleNpcInteraction() {
        this.isInteracting = true;
        this.showDescription('안녕하세요, JH갤러리입니다.\n무엇을 도와드릴까요?', null, () => {
            // 입장권 소지 여부 확인
            const hasReceivedTicket = this.registry.get('hasReceivedTicket');
            console.log('Checking hasReceivedTicket:', hasReceivedTicket);
            this.hideDescription();
            if (hasReceivedTicket) {
                // 입장권이 있으면 기존 대화 이어가기
                const dialogText = '(입장권을 전달했습니다.)\n\n티켓을 가지고 계시네요!\n현재 입장 가능하세요. 갤러리로 이동시켜 드리겠습니다.\n즐거운 관람 되세요 ^^';
                this.showDescription(dialogText, null, () => {
                    if (this.transitionStarted) return; // 이미 페이드 시작했으면 무시

                    console.log("Start fadeOut");
                    this.transitionStarted = true;     // 플래그 설정
                    this.isTransitioning = true;
                    this.cameras.main.fadeOut(500, 0, 0, 0); // 1초 동안 검정색으로 페이드 아웃
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        console.log("FadeOut complete");
                    this.scene.start('GalleryScene', { returnToReception: true });
                    });
                });
            } else {
                // 입장권이 없으면 대화 종료
                this.showDescription('(입장권이 없습니다.)\n\n실례지만, 입장권이 있으셔야 관람을 도와드릴 수 있습니다.', null, () => {
                    this.hideDescription();
                });
            }
        });
    }
    handlePaintingInteraction() {
        this.isInteracting = true;
        this.showDescription('(전혀 모르는 작품이다..ㅠㅠㅠ)', null, () => {
            this.hideDescription();
        });
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


        if (data && data.returnToGallery) {
            this.playerStartX = 512;
            this.playerStartY = 1200;
        } else {
            this.playerStartX = 512;
            this.playerStartY = 1200;
        }
    
    }


    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0); // 1초 동안 부드럽게 나타남
        this.isTransitioning = false; // 전환 상태 초기화
        this.transitionStarted=false;
        this.collisionCount = 0;
        this.add.image(512, 640, 'galleryBg');
        this.player = this.physics.add.sprite(this.playerStartX, this.playerStartY, 'player');
        this.player.setScale(2); // 플레이어 크기 조정 (필요에 따라 수정)
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
        
        // NPC 이미지와 Zone 설정
        this.galleryNpc = this.physics.add.sprite(50, 1200, 'player');  // 적절한 위치에
        this.galleryNpc.setScale(2);
        this.galleryNpc.setImmovable(true);
        this.galleryNpc.setFrame(34); // 원하는 프레임

        this.galleryNpcZone = this.add.zone(50, 1200, 100, 100);
        this.physics.add.existing(this.galleryNpcZone);
        this.physics.add.overlap(this.player, this.galleryNpcZone, () => {
            this.currentNpcZone = this.galleryNpcZone;
        });

        // 터치 처리
        this.input.on('pointerdown', (pointer) => {
            if (this.isInteracting && this.isWaitingForInput) {
                // 대화창 글자 넘기기
                this.isWaitingForInput = false;
                this.continueTyping = true;
            } else if (!this.isInteracting) {
                // 💬 NPC 클릭 처리
                if (
                    this.physics.world.overlap(this.player, this.galleryNpcZone) && // 플레이어가 NPC 근처에 있고
                    Phaser.Geom.Rectangle.ContainsPoint(this.galleryNpcZone.getBounds(), pointer) // 클릭 위치가 NPC 위
                ) {
                    this.handleGalleryNpcInteraction(); // 👉 대화 시작
                } else {
                    // 🎯 그림 클릭 확인 또는 이동 처리
                    let isPaintingClicked = false;
                    this.paintingZones.forEach((zone, index) => {
                        const zoneBounds = zone.getBounds();
                        if (this.physics.world.overlap(this.player, zone) &&
                            Phaser.Geom.Rectangle.ContainsPoint(zoneBounds, { x: pointer.x, y: pointer.y })) {
                            this.checkPaintingInteraction();
                            isPaintingClicked = true;
                        }
                    });
        
                    if (!isPaintingClicked) {
                        this.targetPosition.x = pointer.x;
                        this.targetPosition.y = pointer.y;
                        this.isMovingX = true;
                        this.isTouchInputActive = true;
                    }
                }
            }
        });
        

        // 충돌 예측 함수 추가
        this.predictCollision = (x, y) => {
            const bounds = this.player.getBounds();
            const testRect = new Phaser.Geom.Rectangle(
                x - bounds.width / 2,
                y - bounds.height / 2,
                bounds.width,
                bounds.height
            );
            return this.walls.some(wall => Phaser.Geom.Intersects.RectangleToRectangle(testRect, wall.getBounds()));
        };

        // 이동 불가능 영역 (벽면) 설정
        this.walls = [

            this.physics.add.staticBody(20, 1170, 70, 70), // NPC

            this.physics.add.staticBody(0, 1270, 1170, 10),
            // this.physics.add.staticBody(0, 1250, 360, 50),
            // this.physics.add.staticBody(660, 1250, 350, 50),

            this.physics.add.staticBody(0, 965, 280, 70),
            this.physics.add.staticBody(735, 965, 300, 70),   

            this.physics.add.staticBody(280, 820, 50, 215),
            this.physics.add.staticBody(685, 820, 50, 215),

            this.physics.add.staticBody(0, 820, 280, 50),
            this.physics.add.staticBody(735, 820, 290, 50),           

            this.physics.add.staticBody(295, 455, 50, 205),
            this.physics.add.staticBody(675, 455, 50, 205),

            this.physics.add.staticBody(0, 600, 295, 60),
            this.physics.add.staticBody(725, 600, 300, 60), 

            this.physics.add.staticBody(0, 455, 295, 70),
            this.physics.add.staticBody(725, 455, 300, 70), 

            this.physics.add.staticBody(0, 240, 1025, 50),

            this.physics.add.staticBody(0, 0, 20, 1280),
            this.physics.add.staticBody(1004, 0, 20, 1280)

        ];

        this.walls.forEach(wall => {
            this.physics.add.collider(this.player, wall, () => {
                if (this.isTouchInputActive) {
                    this.collisionCount += 1;
            
                    if (this.collisionCount >= 3) {
                        // 3번 이상 충돌 시 이동 중지
                        this.isTouchInputActive = false;
                        this.player.setVelocity(0);
                        this.player.anims.stop();
                        this.collisionCount = 0; // 충돌 카운트 초기화
                        console.log('⚠️ 터치 이동 중 충돌 3회 → 이동 중지됨');
                    } else {
                        // 방향 전환
                        this.isMovingX = !this.isMovingX;
                        this.player.setVelocity(0);
                        this.player.anims.stop();
                    }
                }
            });
        });
        
        

        // 출구 Zone
        // this.exitZone = this.add.zone(512, 1280, 300, 20);
        // this.exitZone = this.add.zone(0, 0, 0, 0);
        // this.physics.add.existing(this.exitZone);
        // this.physics.add.overlap(this.player, this.exitZone, () => {
        //     this.player.setVelocity(0);
        //     this.player.anims.stop();
        //     this.scene.start('ReceptionScene', { returnToEntrance: true });
        // });

        // Spacebar 입력 설정
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.isInteracting && this.isWaitingForInput) {
                this.isWaitingForInput = false;
                this.continueTyping = true;
            } else if (!this.isInteracting) {
                if (this.physics.world.overlap(this.player, this.galleryNpcZone)) {
                    this.handleGalleryNpcInteraction();
                } else {
                    this.checkPaintingInteraction();
                }
            }
        });

        // 초기 상태
        this.isInteracting = false;
        this.isWaitingForInput = false; // ▼ 표시 대기 상태
        this.continueTyping = false; // 텍스트 이어쓰기 상태
        this.currentPaintingDesc = null;
        this.currentZone = null;

        
        this.awaitingConfirmation = false;  // 네/아니오 대기 중인지

        // 그림 설정
        const paintings = [
            { x: 155, y: 235, x_zone: 210, y_zone: 150, key: 'painting1', desc: 'ㅇ\n┌ㅡ┐', imageKey: 'painting1' },
            { x: 512, y: 235, x_zone: 260, y_zone: 150, key: 'painting2', desc: '하나모미지 앞 눈밭에서 신난 하경이 넘 기엽', imageKey: 'painting2' },
            { x: 865, y: 235, x_zone: 210, y_zone: 150, key: 'painting3', desc: '기모노 커플샷! 좀 잘 어울리는듯 인정??', imageKey: 'painting3' },
            { x: 150, y: 605, x_zone: 230, y_zone: 140, key: 'painting4', desc: '째깐둥이 애기 하굥', imageKey: 'painting4' },
            { x: 865, y: 605, x_zone: 230, y_zone: 140, key: 'painting5', desc: '여기 어디지 명동인가? 암튼 인형 왕 말랑말랑했음', imageKey: 'painting5'} ,
            { x: 140, y: 975, x_zone: 240, y_zone: 145, key: 'painting6', desc: '삿포로에서 생수 광고 찍는 하경이. 상ㅡ쾌!', imageKey: 'painting6'},
            { x: 875, y: 975, x_zone: 240, y_zone: 145, key: 'painting7', desc: '느좋카에서 멍때리는 하경이. 침착맨 맨투맨 탐난당.', imageKey: 'painting7'}
        ];

        this.paintingZones = [];
        this.paintings = paintings;
        this.paintingImages = [];
        this.paintingImages_popup = [];;

        paintings.forEach((p, index) => {
            const zone = this.add.zone(p.x, p.y, p.x_zone, p.y_zone);
            this.physics.add.existing(zone);
            this.physics.add.overlap(this.player, zone, () => {
                this.currentZone = zone;
                console.log('Player overlapped with painting zone:', index);
            });
            this.paintingZones.push(zone);

            // 👉 그림 이미지 추가 (zone 위치에 맞게)
            const paintingImage_popup = this.add.image(0, 0, p.imageKey).setVisible(false);
            paintingImage_popup.setDisplaySize(150, 150);
            this.paintingImages_popup.push(paintingImage_popup);

            const paintingImage = this.add.image(p.x, p.y, p.imageKey)
                .setDisplaySize(p.x_zone - 20, p.y_zone - 20) // 살짝 작게 넣으면 예쁘게 들어감
                .setDepth(5); // 필요한 경우 depth 설정
            this.paintingImages.push(paintingImage);
        });
    }

    update() {
        const speed = 400;
        let velocityX = 0;
        let velocityY = 0;
        
        if (this.isTransitioning) {
            this.player.setVelocity(0);
            this.player.anims.stop();
            return;
          }

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
            const tolerance = 10;
            const dx = this.targetPosition.x - this.player.x;
            const dy = this.targetPosition.y - this.player.y;

            let canMoveX = Math.abs(dx) > tolerance;
            let canMoveY = Math.abs(dy) > tolerance;

            if (this.isTouchInputActive) {
                // 현재 X 축 이동 중
                if (this.isMovingX) {
                    if (canMoveX) {
                        velocityX = dx > 0 ? speed : -speed;
                        this.player.anims.play(dx > 0 ? 'walkRight' : 'walkLeft', true);
                    } else {
                        this.player.x = this.targetPosition.x;
                        this.isMovingX = false; // X 완료 → Y로 넘어감
                        this.player.setVelocityX(0);
                    }
                } else {
                    if (canMoveY) {
                        velocityY = dy > 0 ? speed : -speed;
                        this.player.anims.play(dy > 0 ? 'walkDown' : 'walkUp', true);
                    } else {
                        this.player.y = this.targetPosition.y;

                        if (canMoveX) {
                            this.isMovingX = true; // Y 막혔지만 X 남음 → X 시도
                            this.player.setVelocityY(0);
                        } else {
                            // 🎯 둘 다 못 가면 멈추기
                            this.isTouchInputActive = false;
                            this.player.setVelocity(0);
                            this.player.anims.stop();

                            // 마지막으로 좌표 정리
                            this.player.x = this.targetPosition.x;
                            this.player.y = this.targetPosition.y;
                        }
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

    // NPC 상호작용 처리 메서드 (갤러리용)
    handleGalleryNpcInteraction() {
        const hasTalked = this.registry.get('hasTalkedToGalleryNpc');
        const hasConfirmed = this.registry.get('awaitingConfirmation');
        console.log('[NPC] hasTalkedToGalleryNpc:', hasTalked);

        if (!hasTalked) {
            const introText = "안녕하세요, 이곳은 JH 작가님의 작품들을\n전시해 놓은 장소입니다.\nJH님이 하경 님과 만나면서\n간직한 사진들을 이 갤러리에 기증하셨어요.\n그러면 지금부터 작품들을 자유롭게 둘러보시고,\n감상을 충분히 하셨다면 저에게 말씀해 주세요.";
            this.showNpcDescription(introText, null, () => {
                console.log('[NPC] First interaction complete');
                this.registry.set('hasTalkedToGalleryNpc', true);
            });
        } else {
            if (!hasConfirmed) {
                console.log('[NPC] Showing confirmation prompt');
                const confirmText = "충분히 감상하셨나요?\n그러면 그 다음 장소인 루프탑으로 안내를 도와드릴텐데,\n마음의 준비가 되시면 말씀해 주세요.\n누군가가 기다리고 계신 것 같아요.";
                this.showNpcDescription(confirmText, null, () => {
                    this.registry.set('awaitingConfirmation', true);
                });
            } else {
                const confirmTrueText = "준비가 되신 것 같으니, 바로 루프탑으로 이동하시겠습니다.";
                this.showNpcDescription(confirmTrueText, null, () => {
                    if (this.transitionStarted) return; // 이미 페이드 시작했으면 무시

                    console.log("Start fadeOut");
                    this.transitionStarted = true;     // 플래그 설정
                    this.isTransitioning = true;
                    this.cameras.main.fadeOut(500, 0, 0, 0); // 1초 동안 검정색으로 페이드 아웃
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('RooftopScene');
                    });
                });
            }
        }
    }


    checkPaintingInteraction() {
        if (this.currentZone) {
            this.paintingZones.forEach((zone, index) => {
                if (zone === this.currentZone && this.physics.world.overlap(this.player, zone)) {
                    const painting = this.paintings[index];
                    this.showPaintingDescription(painting.desc, painting.imageKey);
                    this.isInteracting = true;
                    this.currentPaintingDesc = painting.desc;
                    this.currentZone = null;
                }
            });
        }
    }

    // NPC 전용 대화창
    showNpcDescription(text, imageKey, callback) {
        const dialogBox = this.add.rectangle(0, 1280, 2048, 280, 0x000000, 0.8);
        const dialogText = this.add.text(512, 1210, '', { 
            fontFamily: 'Nanum Gothic',
            fontSize: '30px', 
            color: '#fff', 
            align: 'center', 
        }).setOrigin(0.5);
        dialogText.setLineSpacing(10);
        dialogBox.setDepth(10);
        dialogText.setDepth(11);

        this.isInteracting = true;
        this.isWaitingForInput = false;
        this.continueTyping = false;

        this.arrowIndicator = this.add.text(950, 1230, '▼', {
            fontSize: '30px',
            color: '#fff'
        }).setOrigin(0.5).setDepth(11).setVisible(false);

        this.typeText(text, dialogText, this, callback);

        this.dialogBox = dialogBox;
        this.dialogText = dialogText;
    }


    showPaintingDescription(text, imageKey) {
        const paintingImage_popup = this.paintingImages_popup[this.paintings.findIndex(p => p.imageKey === imageKey)];
        paintingImage_popup.setPosition(512, 624);
        paintingImage_popup.setVisible(true);
        paintingImage_popup.setDepth(12);
        paintingImage_popup.setDisplaySize(600, 600);

        const frame = this.add.rectangle(512, 624, 600, 600, 0x000000, 0);
        frame.setDepth(13);
        frame.setStrokeStyle(10, 0x8B4513, 1);

        const dialogBox = this.add.rectangle(0, 1280, 2048, 280, 0x000000, 0.8);
        const dialogText = this.add.text(512, 1210, '', { 
            fontFamily: 'Nanum Gothic',
            fontSize: '30px', 
            color: '#fff', 
            align: 'center', 
            // wordWrap: { width: 700 }
        }).setOrigin(0.5);
        dialogText.setLineSpacing(10);
        dialogBox.setDepth(10);
        dialogText.setDepth(11);

        this.isInteracting = true;
        this.isWaitingForInput = false;
        this.continueTyping = false;

        // ▼ 표시를 위한 텍스트 객체
        this.arrowIndicator = this.add.text(950, 1230, '▼', {
            fontSize: '30px',
            color: '#fff'
        }).setOrigin(0.5).setDepth(11).setVisible(false);

        this.typeText(text, dialogText, this, () => {
            // 콜백에서 대화창을 닫음
        });

        this.dialogBox = dialogBox;
        this.dialogText = dialogText;
        this.currentPaintingImage_popup = paintingImage_popup;
        this.frame = frame;
    }
    
    hideDescription() {
        // 대화 텍스트 및 박스 제거
        if (this.dialogBox) this.dialogBox.destroy();
        if (this.dialogText) this.dialogText.destroy();
    
        // ▼ 깜빡이 제거
        if (this.arrowIndicatorBlinkEvent) this.arrowIndicatorBlinkEvent.remove();
        if (this.arrowIndicator) this.arrowIndicator.destroy();
    
        // 그림 설명이라면 그림 이미지와 액자도 제거
        if (this.currentPaintingImage_popup) {
            this.currentPaintingImage_popup.setVisible(false);
            this.currentPaintingImage_popup.setPosition(0, 0);
            this.currentPaintingImage_popup = null;
        }
    
        if (this.frame) {
            this.frame.destroy();
            this.frame = null;
        }
    
        // 상태 초기화
        this.dialogBox = null;
        this.dialogText = null;
        this.arrowIndicator = null;
        this.arrowIndicatorBlinkEvent = null;
        this.isInteracting = false;
        this.isWaitingForInput = false;
        this.continueTyping = false;
        this.currentPaintingDesc = null;
    }
    

    typeText(text, targetText, scene, callback) {
        let currentIndex = 0;
        let line_cnt = 1;
        let is_skip = 0;
        const typingSpeed = 80;

        const typeNextChar = () => {
            // 텍스트 출력이 완료된 경우
            if (currentIndex >= text.length) {
                // ▼ 표시를 띄우고 입력 대기
                console.log('Text fully displayed, waiting for user input at index:', currentIndex);
                scene.isWaitingForInput = true;
                scene.arrowIndicator.setVisible(true);
                // ▼ 깜빡임 효과
                if (scene.arrowIndicatorBlinkEvent) {
                    scene.arrowIndicatorBlinkEvent.remove();
                    scene.arrowIndicatorBlinkEvent = null;
                }
                scene.arrowIndicatorBlinkEvent = scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if (scene.arrowIndicator) {
                            scene.arrowIndicator.setVisible(!scene.arrowIndicator.visible);
                            console.log('Arrow indicator visibility toggled to:', scene.arrowIndicator.visible);
                        }
                    },
                    loop: true
                });
            }

            // ▼ 표시 중 사용자 입력 대기
            if (scene.isWaitingForInput) {
                if (scene.continueTyping) {
                    console.log('Continuing typing after user input');
                    if (currentIndex >= text.length) {
                        // 텍스트가 모두 출력된 경우, 콜백 호출 후 대화창 닫기
                        if (scene.arrowIndicatorBlinkEvent) {
                            scene.arrowIndicatorBlinkEvent.remove();
                            scene.arrowIndicatorBlinkEvent = null;
                        }
                        scene.arrowIndicator.setVisible(false);
                        if (callback) {
                            callback();
                            console.log('Callback executed, currentIndex:', currentIndex, 'text.length:', text.length);
                        }
                        scene.hideDescription(); // 대화창 닫기
                        return; // 루프 종료
                    } else {
                        if (text[currentIndex] === '\n') {
                            currentIndex++;
                        }
                        targetText.setText(''); // 텍스트 초기화
                        line_cnt = 1;
                        scene.isWaitingForInput = false;
                        if (scene.arrowIndicatorBlinkEvent) {
                            scene.arrowIndicatorBlinkEvent.remove();
                            scene.arrowIndicatorBlinkEvent = null;
                        }
                        scene.arrowIndicator.setVisible(false);
                        scene.continueTyping = false;
                    }
                } else {
                    // 사용자 입력을 기다리는 동안 루프 유지
                    scene.time.delayedCall(typingSpeed, typeNextChar);
                    return;
                }
            }

            // 2줄 초과 시 ▼ 표시
            if (line_cnt >= 3) {
                if (is_skip === 0) {
                    currentIndex +=1;
                    is_skip = 1;
                }
                scene.isWaitingForInput = true;
                scene.arrowIndicator.setVisible(true);
                // ▼ 깜빡임 효과
                if (scene.arrowIndicatorBlinkEvent) {
                    scene.arrowIndicatorBlinkEvent.remove();
                    scene.arrowIndicatorBlinkEvent = null;
                }
                scene.arrowIndicatorBlinkEvent = scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if (scene.arrowIndicator) {
                            scene.arrowIndicator.setVisible(!scene.arrowIndicator.visible);
                            console.log('Arrow indicator visibility toggled to:', scene.arrowIndicator.visible);
                        }
                    },
                    loop: true
                });
                scene.time.delayedCall(typingSpeed, typeNextChar);
                return;
            }



            // 다음 글자 출력
            targetText.setText(targetText.text + text[currentIndex]);
            currentIndex++;

            // 줄바꿈 처리
            if (text[currentIndex] === '\n') {
                line_cnt++;
            }

            // 다음 글자 출력
            scene.time.delayedCall(typingSpeed, typeNextChar);
        };

        // 첫 글자부터 시작
        typeNextChar();
    }

    shutdown() {
        if (this.galleryBgm) {
            this.galleryBgm.stop();
            this.galleryBgm.destroy();
        }
    }
}

class RooftopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RooftopScene' });
    }

    init(data) {
        this.playerStartX = 512;
        this.playerStartY = 1150;

    }


    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0); // 1초 동안 부드럽게 나타남
        this.isTransitioning = false; // 전환 상태 초기화
        this.transitionStarted=false;
        this.hasShownMessage_1 = false; // 메시지 표시 여부 초기화
        this.hasShownMessage_2 = false; // 메시지 표시 여부 초기화
        this.collisionCount = 0;
        this.add.image(512, 640, 'rooftopBg');
        this.player = this.physics.add.sprite(this.playerStartX, this.playerStartY, 'player');
        this.player.setScale(2); // 플레이어 크기 조정 (필요에 따라 수정)
        this.player.setCollideWorldBounds(true);
        this.player.setFrame(4);

        // // BGM 재생
        // if (this.sound.get('entranceBgm')) {
        //     // this.sound.removeByKey('entranceBgm');
        // } else {
        //     this.entranceBgm = this.sound.add('entranceBgm', { volume: 0.5, loop: true });
        //     this.entranceBgm.play();
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

        // NPC 생성 (위치: x: 400, y: 430)
        this.npc = this.physics.add.sprite(512, 500, 'player');
        this.npc.setScale(2); // 플레이어 크기 조정 (필요에 따라 수정)
        this.npc.setImmovable(true);
        this.npc.setFrame(1); // NPC 스프라이트 프레임

        // NPC 상호작용 Zone
        this.npcZone = this.add.zone(512, 500, 150, 150);
        this.physics.add.existing(this.npcZone);
        this.physics.add.overlap(this.player, this.npcZone, () => {
            // 상호작용 프롬프트 표시 (필요 시 추가 가능)
        }, null, this);

        this.stopZone1 = this.add.zone(512, 1000, 1024, 50);
        this.physics.add.existing(this.stopZone1);
        this.stopZone1.body.setAllowGravity(false);
        this.stopZone1.body.setImmovable(true);

        this.physics.add.overlap(this.player, this.stopZone1, () => {
            if (!this.hasShownMessage_1) {
                this.hasShownMessage_1 = true;
                this.showNormalDescription("(저기 멀리에서 누군가가 보인다. 오빠인가..?)", null);
            }
        });

        this.stopZone2 = this.add.zone(512, 700, 1024, 50);
        this.physics.add.existing(this.stopZone2);
        this.stopZone2.body.setAllowGravity(false);
        this.stopZone2.body.setImmovable(true);

        this.physics.add.overlap(this.player, this.stopZone2, () => {
            if (!this.hasShownMessage_2) {
                this.hasShownMessage_2 = true;
                this.showNormalDescription("여기야 여기!!", null);
            }
        });

        // 터치 입력 처리
        this.input.on('pointerdown', (pointer) => {
            if (this.isInteracting && this.isWaitingForInput) {
                console.log('Touch: Continuing typing');
                this.isWaitingForInput = false;
                this.continueTyping = true;
            } else if (this.isShowingTicket && this.isWaitingForTicketInput) {
                console.log('Touch: Closing ticket message');
                this.isWaitingForTicketInput = false;
                this.hideTicketAndMessage();
            } else if (!this.isInteracting) {
                if (this.physics.world.overlap(this.player, this.npcZone) &&
                    Phaser.Geom.Rectangle.ContainsPoint(this.npcZone.getBounds(), { x: pointer.x, y: pointer.y })) {
                    this.handleNpcInteraction();
                } else {
                    this.targetPosition.x = pointer.x;
                    this.targetPosition.y = pointer.y;
                    this.isMovingX = true;
                    this.isTouchInputActive = true; // 터치 입력 활성화
                }
            }
        });

        // Spacebar 입력 설정
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.isInteracting && this.isWaitingForInput) {
                console.log('Space: Continuing typing');
                this.isWaitingForInput = false;
                this.continueTyping = true;
            } else if (this.isShowingTicket && this.isWaitingForTicketInput) {
                console.log('Space: Closing ticket message');
                this.isWaitingForTicketInput = false;
                this.hideTicketAndMessage();
            } else if (!this.isInteracting && !this.isShowingTicket) {
                if (this.physics.world.overlap(this.player, this.npcZone)) {
                    this.handleNpcInteraction();
                }
            }
        });

        // 벽 설정
        this.walls = [
            this.physics.add.staticBody(490, 500, 45, 45), // NPC
            this.physics.add.staticBody(330, 0, 45, 1300), // 
            this.physics.add.staticBody(650, 0, 45, 1300), // 
            this.physics.add.staticBody(0, 400, 1100, 45), // 

        ];
        this.walls.forEach(wall => {
            this.physics.add.collider(this.player, wall, () => {
                if (this.isTouchInputActive) {
                    this.collisionCount += 1;
            
                    if (this.collisionCount >= 3) {
                        // 3번 이상 충돌 시 이동 중지
                        this.isTouchInputActive = false;
                        this.player.setVelocity(0);
                        this.player.anims.stop();
                        this.collisionCount = 0; // 충돌 카운트 초기화
                        console.log('⚠️ 터치 이동 중 충돌 3회 → 이동 중지됨');
                    } else {
                        // 방향 전환
                        this.isMovingX = !this.isMovingX;
                        this.player.setVelocity(0);
                        this.player.anims.stop();
                    }
                }
            });
        });

        // 갤러리 입구 Zone (ReceptionScene으로 이동)
        this.entryZone = this.add.zone(510, 1280, 150, 30);
        this.physics.add.existing(this.entryZone);
        this.physics.add.overlap(this.player, this.entryZone, () => {
            this.scene.start('GalleryScene', { returnToEntrance: true });
        });

        // 초기 상태
        this.isInteracting = false;
        this.isWaitingForInput = false; // ▼ 표시 대기 상태
        this.continueTyping = false; // 텍스트 이어쓰기 상태
        this.isShowingTicket = false; // 입장권 메시지 표시 중인지 여부
    }

    update() {
        const speed = 100;
        let velocityX = 0;
        let velocityY = 0;

        if (this.isTransitioning) {
            this.player.setVelocity(0);
            this.player.anims.stop();
            return;
          }

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
            const tolerance = 10;
            const dx = this.targetPosition.x - this.player.x;
            const dy = this.targetPosition.y - this.player.y;

            let canMoveX = Math.abs(dx) > tolerance;
            let canMoveY = Math.abs(dy) > tolerance;

            if (this.isTouchInputActive) {
                // 현재 X 축 이동 중
                if (this.isMovingX) {
                    if (canMoveX) {
                        velocityX = dx > 0 ? speed : -speed;
                        this.player.anims.play(dx > 0 ? 'walkRight' : 'walkLeft', true);
                    } else {
                        this.player.x = this.targetPosition.x;
                        this.isMovingX = false; // X 완료 → Y로 넘어감
                        this.player.setVelocityX(0);
                    }
                } else {
                    if (canMoveY) {
                        velocityY = dy > 0 ? speed : -speed;
                        this.player.anims.play(dy > 0 ? 'walkDown' : 'walkUp', true);
                    } else {
                        this.player.y = this.targetPosition.y;

                        if (canMoveX) {
                            this.isMovingX = true; // Y 막혔지만 X 남음 → X 시도
                            this.player.setVelocityY(0);
                        } else {
                            // 🎯 둘 다 못 가면 멈추기
                            this.isTouchInputActive = false;
                            this.player.setVelocity(0);
                            this.player.anims.stop();

                            // 마지막으로 좌표 정리
                            this.player.x = this.targetPosition.x;
                            this.player.y = this.targetPosition.y;
                        }
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

    // 대화창 표시 메서드
    showDescription(text, imageKey) {
        const dialogBox = this.add.rectangle(0, 1280, 2048, 280, 0x000000, 0.8);
        const dialogText = this.add.text(512, 1210, '', { 
            fontFamily: 'Nanum Gothic',
            fontSize: '30px', 
            color: '#fff', 
            align: 'center', 
            // wordWrap: { width: 700 }
        }).setOrigin(0.5);
        dialogText.setLineSpacing(10);
        dialogBox.setDepth(10);
        dialogText.setDepth(11);

        this.isInteracting = true;
        this.isWaitingForInput = false;
        this.continueTyping = false;

        // ▼ 표시를 위한 텍스트 객체
        this.arrowIndicator = this.add.text(950, 1230, '▼', {
            fontSize: '30px',
            color: '#fff'
        }).setOrigin(0.5).setDepth(11).setVisible(false);

        // const callback = () => {
        // };
        // 첫 대화가 끝난 후 입장권 이미지와 메시지 표시
        const callback = () => {
            if (this.registry.get('hasReceivedLetter')==false) {
                this.isInteracting = true;
                console.log('First NPC conversation finished, preparing to show ticket.');
                // 대화창이 완전히 사라진 후 입장권 표시
                this.time.delayedCall(500, () => {
                    this.showTicketAndMessage();
                });
            }
        };

        this.typeText(text, dialogText, this, callback);

        this.dialogBox = dialogBox;
        this.dialogText = dialogText;
    }

    showNormalDescription(text, imageKey) {
        const dialogBox = this.add.rectangle(0, 1280, 2048, 280, 0x000000, 0.8);
        const dialogText = this.add.text(512, 1210, '', { 
            fontFamily: 'Nanum Gothic',
            fontSize: '30px', 
            color: '#fff', 
            align: 'center', 
            // wordWrap: { width: 700 }
        }).setOrigin(0.5);
        dialogText.setLineSpacing(10);
        dialogBox.setDepth(10);
        dialogText.setDepth(11);

        this.isInteracting = true;
        this.isWaitingForInput = false;
        this.continueTyping = false;

        // ▼ 표시를 위한 텍스트 객체
        this.arrowIndicator = this.add.text(950, 1230, '▼', {
            fontSize: '30px',
            color: '#fff'
        }).setOrigin(0.5).setDepth(11).setVisible(false);


        const callback = () => {
            this.time.delayedCall(500, () => {
            });
        };

        this.typeText(text, dialogText, this, callback);

        this.dialogBox = dialogBox;
        this.dialogText = dialogText;
    }



    showTicketAndMessage() {
        // 입장권 이미지 표시
        this.envelopeImage = this.add.image(512, 524, 'envelope').setDepth(12);
        this.envelopeImage.setDisplaySize(600, 600); // 입장권 이미지 크기 조정 (필요에 따라 수정)
        this.envelopeImage.setAlpha(0);
        this.envelopeImage.setVisible(true);
        this.tweens.add({
            targets: this.envelopeImage,
            alpha: 1,
            duration: 500,
            ease: 'Linear'
        });
        console.log('Ticket image displayed at (400, 300).');

        // 입장권 획득 메시지 표시
        const envelopeMessage = '(편지를 전달받았습니다.)';
        const dialogBox = this.add.rectangle(0, 1280, 2048, 280, 0x000000, 0.8);
        const dialogText = this.add.text(512, 1210, '', { 
            fontFamily: 'Nanum Gothic',
            fontSize: '30px', 
            color: '#fff', 
            align: 'center', 
            // wordWrap: { width: 700 }
        }).setOrigin(0.5);
        dialogText.setLineSpacing(10);
        dialogBox.setDepth(10);
        dialogText.setDepth(11);

        this.isShowingTicket = true;
        this.isWaitingForTicketInput = false;

        // ▼ 표시를 위한 텍스트 객체
        this.ticketArrowIndicator = this.add.text(950, 1240, '▼', {
            fontSize: '30px',
            color: '#fff'
        }).setOrigin(0.5).setDepth(11).setVisible(false);

        this.typeTicketText(envelopeMessage, dialogText, this);

        this.envelopeDialogBox = dialogBox;
        this.envelopeDialogText = dialogText;
    }

    // 입장권 메시지 숨김 메서드
    hideTicketAndMessage() {
        if (this.envelopeDialogBox && this.envelopeDialogText) {
            this.envelopeDialogBox.destroy();
            this.envelopeDialogText.destroy();
        }
        if (this.ticketArrowIndicator) {
            if (this.ticketArrowIndicatorBlinkEvent) {
                this.ticketArrowIndicatorBlinkEvent.remove();
            }
            this.ticketArrowIndicator.destroy();
        }
        if (this.envelopeImage) {
            this.envelopeImage.destroy();
            console.log('Ticket image removed.');
        }
        this.envelopeDialogBox = null;
        this.envelopeDialogText = null;
        this.ticketArrowIndicator = null;
        this.ticketArrowIndicatorBlinkEvent = null;
        this.envelopeImage = null;
        this.isShowingTicket = false;
        this.isWaitingForTicketInput = false;
        
        this.cameras.main.fadeOut(100, 0, 0, 0); // 1초 동안 검정색으로 페이드 아웃
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.showFullLetterSequence();
        });
        // this.showNormalDescription("편지 잘 읽어봤어? ㅎㅎ 어쩌고저쩌고 끝~", null);
        this.isInteracting = false;
        // // 전역 상태 업데이트
        // this.registry.set('hasReceivedTicket', true);
        // console.log('hasReceivedTicket set to true in registry.');
    }

    // 대화창 숨김 메서드
    hideDescription() {
        if (this.dialogBox && this.dialogText) {
            this.dialogBox.destroy();
            this.dialogText.destroy();
        }
        if (this.arrowIndicator) {
            if (this.arrowIndicatorBlinkEvent) {
                this.arrowIndicatorBlinkEvent.remove();
            }
            this.arrowIndicator.destroy();
        }
        this.dialogBox = null;
        this.dialogText = null;
        this.arrowIndicator = null;
        this.arrowIndicatorBlinkEvent = null;
        this.isInteracting = false;
        this.isWaitingForInput = false;
        this.continueTyping = false;
    }

    showFullLetterSequence() {
        this.cameras.main.fadeIn(500, 0, 0, 0); // 1초 동안 부드럽게 나타남

        // // 👉 편지 음악 시작
        // this.letterBgm = this.sound.add('letterBgm', { volume: 0.5, loop: true });
        // this.letterBgm.play();

        this.letterImages = ['letter', 'letter', 'letter']; // 미리 로딩된 이미지 키들
        this.currentLetterIndex = 0;
        this.showNextLetter();
        this.createLetterArrows();
    }

    showNextLetter(isBack = false) {
        const duration = 400;
    
        if (this.fullLetterImage) {
            this.tweens.add({
                targets: this.fullLetterImage,
                x: isBack ? this.fullLetterImage.x + 200 : this.fullLetterImage.x - 200,
                alpha: 0,
                duration,
                onComplete: () => {
                    this.fullLetterImage.destroy();
                    this.fullLetterImage = null;
                    this._createNextLetter(isBack);
                }
            });
        } else {
            this._createNextLetter(isBack);
        }
    }

    _createNextLetter(isBack) {
        const imageKey = this.letterImages[this.currentLetterIndex];
        this.fullLetterImage = this.add.image(isBack ? 312 : 712, 640, imageKey)
            .setDisplaySize(1024, 1280)
            .setDepth(20)
            .setAlpha(0);

        this.tweens.add({
            targets: this.fullLetterImage,
            x: 512,
            alpha: 1,
            duration: 400,
            ease: 'Sine.easeInOut'
        });
    }
    

    createLetterArrows() {
        this.leftArrow = this.add.image(100, 640, 'left')
            .setScale(0.15)
            .setDepth(21)
            .setInteractive()
            .on('pointerdown', () => {
                if (this.currentLetterIndex > 0) {
                    this.currentLetterIndex--;
                    this.showNextLetter(true);
                }
            });

            this.rightArrow = this.add.image(924, 640, 'right')
            .setScale(0.15)
            .setDepth(21)
            .setInteractive()
            .on('pointerdown', () => {
                if (this.currentLetterIndex < this.letterImages.length - 1) {
                    this.currentLetterIndex++;
                    this.showNextLetter(false);
                } else {
                    this.removeLetterArrows();
                    this.fullLetterImage.destroy();
                    this.registry.set('hasReceivedLetter', true);
        
                    // 👉 엔딩으로 페이드 아웃 전환
                    this.cameras.main.fadeOut(1000, 0, 0, 0);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('EndingScene');
                    });
                }
            });
        
    }

    removeLetterArrows() {
        this.leftArrow?.destroy();
        this.rightArrow?.destroy();
    }
    
    // 텍스트 타이핑 메서드 (대화창용)
    typeText(text, targetText, scene, callback) {
        let currentIndex = 0;
        let letEnterIdx = 0;
        let line_cnt = 1;
        let is_skip = 0;
        const typingSpeed = 80;

        const typeNextChar = () => {
            // 텍스트 출력이 완료된 경우
            if (currentIndex >= text.length) {
                // ▼ 표시를 띄우고 입력 대기
                console.log('Text fully displayed, waiting for user input at index:', currentIndex);
                scene.isWaitingForInput = true;
                scene.arrowIndicator.setVisible(true);
                // ▼ 깜빡임 효과
                if (scene.arrowIndicatorBlinkEvent) {
                    scene.arrowIndicatorBlinkEvent.remove();
                    scene.arrowIndicatorBlinkEvent = null;
                }
                scene.arrowIndicatorBlinkEvent = scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if (scene.arrowIndicator) {
                            scene.arrowIndicator.setVisible(!scene.arrowIndicator.visible);
                            console.log('Arrow indicator visibility toggled to:', scene.arrowIndicator.visible);
                        }
                    },
                    loop: true
                });
            }

            // ▼ 표시 중 사용자 입력 대기
            if (scene.isWaitingForInput) {
                if (scene.continueTyping) {
                    console.log('Continuing typing after user input');
                    if (currentIndex >= text.length) {
                        // 텍스트가 모두 출력된 경우, 콜백 호출 후 대화창 닫기
                        if (scene.arrowIndicatorBlinkEvent) {
                            scene.arrowIndicatorBlinkEvent.remove();
                            scene.arrowIndicatorBlinkEvent = null;
                        }
                        scene.arrowIndicator.setVisible(false);
                        if (callback) {
                            callback();
                            console.log('Callback executed, currentIndex:', currentIndex, 'text.length:', text.length);
                        }
                        scene.hideDescription(); // 대화창 닫기
                        return; // 루프 종료
                    } else {
                        // 텍스트가 아직 남아있는 경우, 다음 텍스트로 진행
                        if (text[currentIndex] === '\n') {
                            currentIndex++;
                        }
                        targetText.setText(''); // 텍스트 초기화
                        letEnterIdx = 0;
                        line_cnt = 1;
                        scene.isWaitingForInput = false;
                        if (scene.arrowIndicatorBlinkEvent) {
                            scene.arrowIndicatorBlinkEvent.remove();
                            scene.arrowIndicatorBlinkEvent = null;
                        }
                        scene.arrowIndicator.setVisible(false);
                        scene.continueTyping = false;
                    }
                } else {
                    // 사용자 입력을 기다리는 동안 루프 유지
                    scene.time.delayedCall(typingSpeed, typeNextChar);
                    return;
                }
            }

            // 2줄 초과 시 ▼ 표시
            if (line_cnt === 3) {
                if (is_skip === 0) {
                    currentIndex +=1;
                    is_skip = 1;
                }
                scene.isWaitingForInput = true;
                scene.arrowIndicator.setVisible(true);
                // ▼ 깜빡임 효과
                if (scene.arrowIndicatorBlinkEvent) {
                    scene.arrowIndicatorBlinkEvent.remove();
                    scene.arrowIndicatorBlinkEvent = null;
                }
                scene.arrowIndicatorBlinkEvent = scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if (scene.arrowIndicator) {
                            scene.arrowIndicator.setVisible(!scene.arrowIndicator.visible);
                            console.log('Arrow indicator visibility toggled to:', scene.arrowIndicator.visible);
                        }
                    },
                    loop: true
                });
                scene.time.delayedCall(typingSpeed, typeNextChar);
                return;
            }

            // 다음 글자 출력
            targetText.setText(targetText.text + text[currentIndex]);
            currentIndex++;
            letEnterIdx++;

            // 줄바꿈 처리
            if (text[currentIndex] === '\n') {
                letEnterIdx = 0;
                line_cnt++;
            }
            // } else if (letEnterIdx == 35) {
            //     letEnterIdx = 0;
            //     line_cnt++;
            //     if (line_cnt < 3) {
            //         targetText.setText(targetText.text + '\n');
            //     }
            // }

            // 다음 글자 출력
            scene.time.delayedCall(typingSpeed, typeNextChar);
        };

        // 첫 글자부터 시작
        typeNextChar();
    }

    // 입장권 텍스트 타이핑 메서드
    typeTicketText(text, targetText, scene) {
        let currentIndex = 0;
        let letEnterIdx = 0;
        let line_cnt = 1;
        let is_skip = 0;
        const typingSpeed = 80;

        const typeNextChar = () => {
            // 텍스트 출력이 완료된 경우
            if (currentIndex >= text.length) {
                // ▼ 표시를 띄우고 입력 대기
                console.log('Ticket text fully displayed, waiting for user input at index:', currentIndex);
                scene.isWaitingForTicketInput = true;
                scene.ticketArrowIndicator.setVisible(true);
                // ▼ 깜빡임 효과
                if (scene.ticketArrowIndicatorBlinkEvent) {
                    scene.ticketArrowIndicatorBlinkEvent.remove();
                    scene.ticketArrowIndicatorBlinkEvent = null;
                }
                scene.ticketArrowIndicatorBlinkEvent = scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if (scene.ticketArrowIndicator) {
                            scene.ticketArrowIndicator.setVisible(!scene.ticketArrowIndicator.visible);
                            console.log('Ticket arrow indicator visibility toggled to:', scene.ticketArrowIndicator.visible);
                        }
                    },
                    loop: true
                });
                return; // 루프 종료
            }

            // 2줄 초과 시 ▼ 표시 (입장권 메시지는 한 줄이므로 이 조건은 필요 없을 수 있음)
            if (line_cnt === 3) {
                if (is_skip === 0) {
                    currentIndex +=1;
                    is_skip = 1;
                }
                scene.isWaitingForTicketInput = true;
                scene.ticketArrowIndicator.setVisible(true);
                // ▼ 깜빡임 효과
                if (scene.ticketArrowIndicatorBlinkEvent) {
                    scene.ticketArrowIndicatorBlinkEvent.remove();
                    scene.ticketArrowIndicatorBlinkEvent = null;
                }
                scene.ticketArrowIndicatorBlinkEvent = scene.time.addEvent({
                    delay: 500,
                    callback: () => {
                        if (scene.ticketArrowIndicator) {
                            scene.ticketArrowIndicator.setVisible(!scene.ticketArrowIndicator.visible);
                            console.log('Ticket arrow indicator visibility toggled to:', scene.ticketArrowIndicator.visible);
                        }
                    },
                    loop: true
                });
                scene.time.delayedCall(typingSpeed, typeNextChar);
                return;
            }

            // 다음 글자 출력
            targetText.setText(targetText.text + text[currentIndex]);
            currentIndex++;
            letEnterIdx++;

            // 줄바꿈 처리
            if (text[currentIndex] === '\n') {
                letEnterIdx = 0;
                line_cnt++;
            }

            // 다음 글자 출력
            scene.time.delayedCall(typingSpeed, typeNextChar);
        };

        // 첫 글자부터 시작
        typeNextChar();
    }

    // NPC 상호작용 처리 메서드
    handleNpcInteraction() {
        this.isInteracting = true;
        this.isTransitioning = true;  // 🎯 추가
    
        let dialogText;
        dialogText = '안녕 하경아. 여기까지 오느라 고생했어!\n그림들 구경은 잘 했어??\n마음에 들었으면 좋겠는데, 어떨지 모르겠네 ㅎㅎ\n아 맞다, 편지를 좀 준비했는데 읽어줄래??';
        this.showDescription(dialogText, null);
    }

    shutdown() {
        if (this.entranceBgm) {
            this.entranceBgm.stop();
            this.entranceBgm.destroy();
        }
        if (this.interactionText) {
            this.interactionText.destroy();
        }
        if (this.ticketImage) {
            this.ticketImage.destroy();
        }
    }
}

class EndingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndingScene' });
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0); // 부드럽게 나타남

        this.add.text(512, 640, 'Thank you for Playing :)', {
            fontFamily: 'Nanum Gothic',
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
}

// 게임 설정
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 1280,
    physics: {
        default: 'arcade',
        arcade: {
             gravity: { y: 0 } ,
             debug:true // debug option
            }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: 'game-container',
        parent: 'game-container', // 캔버스를 #game-container 안에 배치
        width: 1024,
        height: 1280
    },
    scene: [LoadingScene,GalleryScene,EntranceScene, ReceptionScene,RooftopScene,EndingScene],
    callbacks: {  // 추가: 게임 시작 시 실행되는 콜백
        preBoot: (game) => {
            game.registry.set('hasReceivedTicket', false); // 게임 시작 시 한 번만 초기화
            game.registry.set('isFirstTalk',true);
            game.registry.set('hasTalkedToGalleryNpc', false); // 게임 시작 시 한 번만 실행
            game.registry.set('awaitingConfirmation', false); // 게임 시작 시 한 번만 실행
            game.registry.set('hasReceivedLetter', false);
        }
    }
};

// 게임 초기화
const game = new Phaser.Game(config);